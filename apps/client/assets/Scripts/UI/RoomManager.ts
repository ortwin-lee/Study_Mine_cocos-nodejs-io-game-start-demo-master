import { _decorator, Component, Label } from "cc";
import { IRoom } from "../Common";
import EventManager from "../Global/EventManager";
import { EventEnum } from "../Enum";
const { ccclass } = _decorator;

@ccclass("RoomManager")
export class RoomManager extends Component {
    id: number;

    init({ id, players }: IRoom) {
        this.id = id;
        const label = this.getComponent(Label);
        label.string = `房间id：${id}`;
        this.node.active = true;
    }

    handlerClick() {
        EventManager.Instance.emit(EventEnum.RoomJoin, this.id);
    }
}
