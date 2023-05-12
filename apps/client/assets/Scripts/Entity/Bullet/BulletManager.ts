import { IVec2, _decorator, instantiate, math } from "cc";
import { EntityTypeEnum, IBullet } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { EntityStateEnum, EventEnum } from "../../Enum";
import { BulletStateMachine } from "./BulletStateMachine";
import EventManager from "../../Global/EventManager";
import DataManager from "../../Global/DataManager";
import { ExplosionManager } from "../Explosion/ExplosionManager";
const { ccclass } = _decorator;

@ccclass("BulletManager")
export class BulletManager extends EntityManager {
    type: EntityTypeEnum;
    id: number;

    init(data: IBullet) {
        this.type = data.type;
        this.id = data.id;
        this.fsm = this.addComponent(BulletStateMachine);
        this.fsm.init(data.type);

        this.state = EntityStateEnum.Idle;
        this.node.active = false;

        EventManager.Instance.on(EventEnum.ExplosionBorn, this.handleExplosionBorn, this);
    }

    onDestroy() {
        EventManager.Instance.off(EventEnum.ExplosionBorn, this.handleExplosionBorn, this);
    }

    render(data: IBullet) {
        this.node.active = true;
        const { direction, position } = data;
        this.node.setPosition(position.x, position.y);

        const rad = Math.atan2(direction.y, direction.x);
        const angle = math.toDegree(rad);

        this.node.setRotationFromEuler(0, 0, angle);
    }

    handleExplosionBorn(id: number, { x, y }: IVec2) {
        if (id !== this.id) {
            return;
        }

        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Explosion);
        const explosion = instantiate(prefab);
        explosion.setParent(DataManager.Instance.stage);
        const em = explosion.addComponent(ExplosionManager);
        em.init(EntityTypeEnum.Explosion, { x, y });

        DataManager.Instance.bulletMap.delete(this.id);
        this.node.destroy();
    }
}
