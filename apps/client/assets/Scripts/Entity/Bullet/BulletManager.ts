import { _decorator, math } from "cc";
import { EntityTypeEnum, IBullet } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { EntityStateEnum } from "../../Enum";
import { BulletStateMachine } from "./BulletStateMachine";
const { ccclass } = _decorator;

@ccclass("BulletManager")
export class BulletManager extends EntityManager {
    type: EntityTypeEnum;

    init(data: IBullet) {
        this.type = data.type;
        this.fsm = this.addComponent(BulletStateMachine);
        this.fsm.init(data.type);

        this.state = EntityStateEnum.Idle;
        this.node.active = false;
    }

    render(data: IBullet) {
        this.node.active = true;
        const { direction, position } = data;
        this.node.setPosition(position.x, position.y);

        const rad = Math.atan2(direction.y, direction.x);
        const angle = math.toDegree(rad);

        this.node.setRotationFromEuler(0, 0, angle);
    }
}
