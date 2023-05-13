import { _decorator, instantiate, Node } from "cc";
import Singleton from "../Base/Singleton";
import { EntityTypeEnum } from "../Common";
import DataManager from "./DataManager";

export class ObjectPoolManager extends Singleton {
    static get Instance() {
        return super.GetInstance<ObjectPoolManager>();
    }

    private objectPool: Node;
    private map: Map<EntityTypeEnum, Node[]> = new Map();

    get(type: EntityTypeEnum) {
        if (!this.objectPool) {
            this.objectPool = new Node("ObjectPool");
            this.objectPool.setParent(DataManager.Instance.stage);
        }

        if (!this.map.has(type)) {
            this.map.set(type, []);
            const container = new Node(type + "Pool");
            container.setParent(this.objectPool);
        }

        const nodes = this.map.get(type);
        if (!nodes.length) {
            const prefab = DataManager.Instance.prefabMap.get(type);
            const node = instantiate(prefab);
            node.name = type;
            node.setParent(this.objectPool.getChildByName(type + "Pool"));
            node.active = true;
            return node;
        } else {
            const node = nodes.pop();
            node.active = true;
            return node;
        }
    }

    ret(node: Node) {
        node.active = false;
        this.map.get(node.name as EntityTypeEnum).push(node);
    }
}
