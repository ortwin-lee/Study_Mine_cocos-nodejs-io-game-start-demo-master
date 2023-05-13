import { ProgressBar, _decorator, instantiate, math } from "cc";
import DataManager from "../../Global/DataManager";
import { EntityTypeEnum, IActor, InputTypeEnum } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { ActorStateMachine } from "./ActorStateMachine";
import { EntityStateEnum } from "../../Enum";
import { WeaponManager } from "../Weapon/WeaponManager";
const { ccclass } = _decorator;

@ccclass("ActorManager")
export class ActorManager extends EntityManager {
    id: number;
    bulletType: EntityTypeEnum;

    private hp: ProgressBar;

    private weaponManager: WeaponManager;

    init(data: IActor) {
        this.id = data.id;
        this.hp = this.node.getComponentInChildren(ProgressBar);
        this.bulletType = data.bulletType;
        this.fsm = this.addComponent(ActorStateMachine);
        this.fsm.init(data.type);

        this.state = EntityStateEnum.Idle;

        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon1);

        const weapon = instantiate(prefab);
        weapon.setParent(this.node);
        this.weaponManager = weapon.addComponent(WeaponManager);
        this.weaponManager.init(data);
    }

    tick(dt) {
        if (this.id !== DataManager.Instance.myPlayerId) {
            return;
        }
        if (DataManager.Instance.jm.input.length()) {
            const { x, y } = DataManager.Instance.jm.input;
            DataManager.Instance.applyInput({
                id: 1,
                type: InputTypeEnum.ActorMove,
                direction: {
                    x,
                    y,
                },
                dt,
            });

            this.state = EntityStateEnum.Run;
        } else {
            this.state = EntityStateEnum.Idle;
        }
    }

    render(data: IActor) {
        const { direction, position } = data;
        this.node.setPosition(position.x, position.y);

        if (direction.x !== 0) {
            this.node.setScale(direction.x > 0 ? 1 : -1, 1);
            this.hp.node.setScale(direction.x > 0 ? 1 : -1, 1);
        }

        const rad = Math.atan2(direction.y, Math.abs(direction.x));
        const angle = math.toDegree(rad);

        this.weaponManager.node.setRotationFromEuler(0, 0, angle);

        this.hp.progress = data.hp / this.hp.totalLength;
    }
}
