import { ProgressBar, Tween, Vec3, _decorator, instantiate, math, tween } from "cc";
import DataManager from "../../Global/DataManager";
import { EntityTypeEnum, IActor, InputTypeEnum } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { ActorStateMachine } from "./ActorStateMachine";
import { EntityStateEnum, EventEnum } from "../../Enum";
import { WeaponManager } from "../Weapon/WeaponManager";
import EventManager from "../../Global/EventManager";
const { ccclass } = _decorator;

@ccclass("ActorManager")
export class ActorManager extends EntityManager {
    id: number;
    bulletType: EntityTypeEnum;

    private hp: ProgressBar;
    private _targetPos: Vec3;
    private _tween: Tween<unknown>;
    private weaponManager: WeaponManager;

    init(data: IActor) {
        this.id = data.id;
        this.hp = this.node.getComponentInChildren(ProgressBar);
        this.bulletType = data.bulletType;
        this.fsm = this.getComponent(ActorStateMachine) || this.addComponent(ActorStateMachine);
        this.fsm.init(data.type);

        this.state = EntityStateEnum.Idle;
        this.node.active = false;
        this._targetPos = undefined;

        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon1);

        const weapon = instantiate(prefab);
        weapon.setParent(this.node);
        this.weaponManager = this.getComponent(WeaponManager) || weapon.addComponent(WeaponManager);
        this.weaponManager.init(data);
    }

    tick(dt) {
        if (this.id !== DataManager.Instance.myPlayerId) {
            return;
        }
        if (DataManager.Instance.jm.input.length()) {
            const { x, y } = DataManager.Instance.jm.input;
            EventManager.Instance.emit(EventEnum.ClientSync, {
                id: DataManager.Instance.myPlayerId,
                type: InputTypeEnum.ActorMove,
                direction: {
                    x,
                    y,
                },
                dt,
            });
        } else {
            this.state = EntityStateEnum.Idle;
        }
    }

    render(data: IActor) {
        this.renderPos(data);
        this.renderDirection(data);
        this.renderHP(data);
    }

    renderPos(data: IActor) {
        const { position } = data;
        const newPos = new Vec3(position.x, position.y);
        if (!this._targetPos) {
            this.node.setPosition(newPos);
            this._targetPos = new Vec3(newPos);
            this.node.active = true;
        } else if (!this._targetPos.equals(newPos)) {
            this._tween?.stop();
            this.node.setPosition(newPos);
            this._targetPos.set(newPos);
            this.state = EntityStateEnum.Run;
            this._tween = tween(this.node)
                .to(0.1, { position: this._targetPos })
                .call(() => {
                    this.state = EntityStateEnum.Idle;
                })
                .start();
        }

        // this.node.setPosition(position.x, position.y);
    }

    renderDirection(data: IActor) {
        const { direction } = data;

        if (direction.x !== 0) {
            this.node.setScale(direction.x > 0 ? 1 : -1, 1);
            this.hp.node.setScale(direction.x > 0 ? 1 : -1, 1);
        }

        const rad = Math.atan2(direction.y, Math.abs(direction.x));
        const angle = math.toDegree(rad);

        this.weaponManager.node.setRotationFromEuler(0, 0, angle);
    }

    renderHP(data: IActor) {
        this.hp.progress = data.hp / this.hp.totalLength;
    }
}
