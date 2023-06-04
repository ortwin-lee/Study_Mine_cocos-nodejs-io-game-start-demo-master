import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import { NetWorkManager } from "../Global/NetWorkManager";
import { ApiMsgEnum, IApiPlayerListRes } from "../Common";
import { PlayerManager } from "../UI/PlayerManager";
const { ccclass, property } = _decorator;

@ccclass("HallManager")
export class HallManager extends Component {
    @property(Node)
    playerContainer: Node;

    @property(Prefab)
    playerPrefab: Node;

    onLoad() {
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
    }

    start() {
        this.playerContainer.destroyAllChildren();
        this.getPlayers();
    }

    onDestroy() {
        NetWorkManager.Instance.unlistenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
    }

    async getPlayers() {
        const { success, error, res } = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiPlayerList, {});
        if (!success) {
            console.log(error);
            return;
        }

        console.log("res", res);

        this.renderPlayer(res);
    }

    renderPlayer({ list }: IApiPlayerListRes) {
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
}
