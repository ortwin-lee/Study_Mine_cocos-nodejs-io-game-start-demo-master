import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import DataManager from '../Global/DataManager';
import { JoyStickManager } from '../UI/JoyStickManager';
import { ResourceManager } from '../Global/ResourceManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import { PrefabPathEnum } from '../Enum';
import { EntityTypeEnum } from '../Common';
const { ccclass } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {

    private _stage: Node;
    private _ui: Node;

    private _shouldUpdate = false;

    onLoad() {
        this._stage = this.node.getChildByName("Stage");
        this._ui = this.node.getChildByName("UI");
        this._stage.destroyAllChildren();  // 销毁编辑器的测试节点
        DataManager.Instance.jm = this._ui.getComponentInChildren(JoyStickManager);
    }

    async start() {
        await this.loadRes();
        this.initMap();
        this._shouldUpdate = true;
    }

    async loadRes() {
        const list = []
        for (const type in PrefabPathEnum) {
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((prefeb) => {
                DataManager.Instance.prefabMap.set(type, prefeb);
            });
            list.push(p);
        }

        await Promise.all(list);
    }

    initMap() {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Map);
        const map = instantiate(prefab);
        map.setParent(this._stage);
    }

    update(dt: number) {
        if (!this._shouldUpdate) {
            return;
        }
        this.render();
    }

    render() {
        this.renderActor();
    }

    renderActor() {
        for (const data of DataManager.Instance.state.actors) {
            const { id, type } = data;
            let am = DataManager.Instance.actorMap.get(id);
            if (!am) {
                const prefab = DataManager.Instance.prefabMap.get(type);
                const actor = instantiate(prefab);
                actor.setParent(this._stage);
                am = actor.addComponent(ActorManager);
                DataManager.Instance.actorMap.set(id, am);
                am.init(data);
            } else {
                am.render(data);
            }
        }
    }
}

