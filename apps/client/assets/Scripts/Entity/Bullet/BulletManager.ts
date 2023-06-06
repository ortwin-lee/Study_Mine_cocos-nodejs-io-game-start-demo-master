import { IVec2, Tween, Vec3, _decorator, math, tween } from "cc";
import { EntityTypeEnum, IBullet } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { EntityStateEnum, EventEnum } from "../../Enum";
import { BulletStateMachine } from "./BulletStateMachine";
import EventManager from "../../Global/EventManager";
import DataManager from "../../Global/DataManager";
import { ExplosionManager } from "../Explosion/ExplosionManager";
import { ObjectPoolManager } from "../../Global/ObjectPoolManager";
const { ccclass } = _decorator;

@ccclass("BulletManager")
export class BulletManager extends EntityManager {
    type: EntityTypeEnum;
    id: number;

    private _targetPos: Vec3;
    private _tween: Tween<unknown>;

    init(data: IBullet) {
        this.type = data.type;
        this.id = data.id;
        this.fsm = this.getComponent(BulletStateMachine) || this.addComponent(BulletStateMachine);
        this.fsm.init(data.type);

        this.state = EntityStateEnum.Idle;
        this.node.active = false;
        this._targetPos = undefined;

        EventManager.Instance.on(EventEnum.ExplosionBorn, this.handleExplosionBorn, this);
    }

    render(data: IBullet) {
        this.renderPos(data);
        this.renderDirection(data);
    }

    renderPos(data: IBullet) {
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
            this._tween = tween(this.node)
                .to(0.1, { position: this._targetPos })
                .start();
        }
    }

    renderDirection(data: IBullet) {
        const { direction } = data;

        const rad = Math.atan2(direction.y, direction.x);
        const angle = math.toDegree(rad);

        this.node.setRotationFromEuler(0, 0, angle);
    }

    handleExplosionBorn(id: number, { x, y }: IVec2) {
        if (id !== this.id) {
            return;
        }

        const explosion = ObjectPoolManager.Instance.get(EntityTypeEnum.Explosion);
        const em = explosion.getComponent(ExplosionManager) || explosion.addComponent(ExplosionManager);
        em.init(EntityTypeEnum.Explosion, { x, y });

        EventManager.Instance.off(EventEnum.ExplosionBorn, this.handleExplosionBorn, this);
        DataManager.Instance.bulletMap.delete(this.id);
        ObjectPoolManager.Instance.ret(this.node);
    }
}
