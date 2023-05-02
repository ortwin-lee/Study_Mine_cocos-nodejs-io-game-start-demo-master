import { _decorator, Component } from "cc";
import EventManager from "../Global/EventManager";
import { EventEnum } from "../Enum";

const { ccclass } = _decorator;

@ccclass("ShootManager")
export class ShootManager extends Component {
    handleShoot() {
        EventManager.Instance.emit(EventEnum.WeaponShoot);
    }
}
