import { _decorator, Component, director, instantiate, Node, Prefab } from "cc";
import { NetWorkManager } from "../Global/NetWorkManager";
import { ApiMsgEnum, IApiPlayerListRes, IApiRoomListRes } from "../Common";
import { PlayerManager } from "../UI/PlayerManager";
import DataManager from "../Global/DataManager";
import { EventEnum, SceneEnum } from "../Enum";
import { RoomManager } from "../UI/RoomManager";
import EventManager from "../Global/EventManager";
const { ccclass, property } = _decorator;

@ccclass("HallManager")
export class HallManager extends Component {
    @property(Node)
    playerContainer: Node;

    @property(Prefab)
    playerPrefab: Node;

    @property(Node)
    roomContainer: Node;

    @property(Prefab)
    roomPrefab: Node;

    onLoad() {
        EventManager.Instance.on(EventEnum.RoomJoin, this.handleJoinRoom, this);
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgRoomList, this.renderRoom, this);
    }

    start() {
        this.playerContainer.destroyAllChildren();
        this.roomContainer.destroyAllChildren();
        this.getPlayers();
        this.getRooms();
    }

    onDestroy() {
        EventManager.Instance.off(EventEnum.RoomJoin, this.handleJoinRoom, this);
        NetWorkManager.Instance.unlistenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
        NetWorkManager.Instance.unlistenMsg(ApiMsgEnum.MsgRoomList, this.renderRoom, this);
    }

    async getPlayers() {
        const { success, error, res } = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiPlayerList, {});
        if (!success) {
            console.log(error);
            return;
        }

        console.log("players", res.list);

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

    async getRooms() {
        const { success, error, res } = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiRoomList, {});
        if (!success) {
            console.log(error);
            return;
        }

        console.log("rooms", res.list);

        this.renderRoom(res);
    }

    renderRoom({ list }: IApiRoomListRes) {
        for (const child of this.roomContainer.children) {
            child.active = false;
        }

        while (this.roomContainer.children.length < list.length) {
            const node = instantiate(this.roomPrefab);
            node.active = false;
            node.setParent(this.roomContainer);
        }

        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const node = this.roomContainer.children[i];
            node.getComponent(RoomManager).init(data);
        }
    }

    async handleCreateRoom() {
        const { success, error, res } = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiRoomCreate, {});
        if (!success) {
            console.log(error);
            return;
        }

        DataManager.Instance.roomInfo = res.room;

        console.log("DataManager.Instance.roomInfo", DataManager.Instance.roomInfo);
        director.loadScene(SceneEnum.Room);
    }

    async handleJoinRoom(rid: number) {
        const { success, error, res } = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiRoomJoin, { rid });
        if (!success) {
            console.log(error);
            return;
        }

        DataManager.Instance.roomInfo = res.room;

        console.log("DataManager.Instance.roomInfo", DataManager.Instance.roomInfo);
        director.loadScene(SceneEnum.Room);
    }
}
