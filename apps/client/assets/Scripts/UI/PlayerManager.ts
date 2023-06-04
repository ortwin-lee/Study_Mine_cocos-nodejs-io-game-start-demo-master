import { _decorator, Component, Label } from "cc";
import { IPlayer } from "../Common";
const { ccclass } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends Component {
    init({ nickname }: IPlayer) {
        const label = this.getComponent(Label);
        label.string = nickname;
        this.node.active = true;
    }
}
