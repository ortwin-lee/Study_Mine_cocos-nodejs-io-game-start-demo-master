import { _decorator, Component } from "cc";
import { EntityStateEnum } from "../Enum";
import StateMachine from "./StateMachine";
const { ccclass } = _decorator;

@ccclass("EntityManager")
export abstract class EntityManager extends Component {
    fsm: StateMachine;
    private _state: EntityStateEnum;

    get state() {
        return this._state;
    }

    set state(newState) {
        this._state = newState;
        this.fsm.setParams(newState, true);
    }

    abstract init(...args: any[]): void;
}
