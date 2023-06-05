import { _decorator, Component, director, instantiate, Node, Prefab } from "cc";
import { NetWorkManager } from "../Global/NetWorkManager";
import { ApiMsgEnum, IMsgGameStart, IMsgRoom } from "../Common";
import { PlayerManager } from "../UI/PlayerManager";
import DataManager from "../Global/DataManager";
import { SceneEnum } from "../Enum";
const { ccclass, property } = _decorator;

@ccclass("RoomManager")
export class RoomManager extends Component {
    @property(Node)
    playerContainer: Node;

    @property(Prefab)
    playerPrefab: Node;

    onLoad() {
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgRoom, this.renderPlayer, this);
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgGameStart, this.handleGameStart, this);
    }

    start() {
        this.renderPlayer({
            room: DataManager.Instance.roomInfo,
        });
    }

    onDestroy() {
        NetWorkManager.Instance.unlistenMsg(ApiMsgEnum.MsgRoom, this.renderPlayer, this);
        NetWorkManager.Instance.unlistenMsg(ApiMsgEnum.MsgGameStart, this.handleGameStart, this);
    }

    renderPlayer({ room: { players: list } }: IMsgRoom) {
        for (const child of this.playerContainer.children) {
            child.active = false;
        }

        while (this.playerContainer.children.length < list.length) {
            const node = instantiate(this.playerPrefab);
            node.active = false;
            node.setParent(this.playerContainer);
        }

        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const node = this.playerContainer.children[i];
            node.getComponent(PlayerManager).init(data);
        }
    }

    async handleLeaveRoom() {
        const { success, error, res } = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiRoomLeave, {});
        if (!success) {
            console.log(error);
            return;
        }

        DataManager.Instance.roomInfo = null;

        director.loadScene(SceneEnum.Hall);
    }

    async handleStart() {
        const { success, error, res } = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiGameStart, {});
        if (!success) {
            console.log(error);
            return;
        }
    }

    async handleGameStart({ state }: IMsgGameStart) {
        DataManager.Instance.state = state;

        director.loadScene(SceneEnum.Battle);
    }
}
