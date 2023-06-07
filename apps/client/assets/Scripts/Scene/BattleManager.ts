import { _decorator, Component, instantiate, Node, Prefab, SpriteFrame } from "cc";
import DataManager from "../Global/DataManager";
import { JoyStickManager } from "../UI/JoyStickManager";
import { ResourceManager } from "../Global/ResourceManager";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { EventEnum, PrefabPathEnum, TexturePathEnum } from "../Enum";
import { ApiMsgEnum, EntityTypeEnum, IClientInput, IMsgClientSync, IMsgServerSync, InputTypeEnum } from "../Common";
import { BulletManager } from "../Entity/Bullet/BulletManager";
import { ObjectPoolManager } from "../Global/ObjectPoolManager";
import { NetWorkManager } from "../Global/NetWorkManager";
import EventManager from "../Global/EventManager";
import { deepCopy } from "../Utils";
const { ccclass } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
    private _stage: Node;
    private _ui: Node;
    private _pendingMsg: IMsgClientSync[] = [];
    private _shouldUpdate = false;

    onLoad() {}

    async start() {
        this.clearGame();
        await Promise.all([this.connectServer(), this.loadRes()]);
        this.initGame();
    }

    initGame() {
        DataManager.Instance.jm = this._ui.getComponentInChildren(JoyStickManager);
        this.initMap();
        this._shouldUpdate = true;
        EventManager.Instance.on(EventEnum.ClientSync, this.handleClientSync, this);
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgServerSync, this.handleServerSync, this);
    }

    clearGame() {
        EventManager.Instance.off(EventEnum.ClientSync, this.handleClientSync, this);
        NetWorkManager.Instance.unlistenMsg(ApiMsgEnum.MsgServerSync, this.handleServerSync, this);
        DataManager.Instance.stage = this._stage = this.node.getChildByName("Stage");
        this._ui = this.node.getChildByName("UI");
        this._stage.destroyAllChildren(); // 销毁编辑器的测试节点
    }

    async connectServer() {
        if (!(await NetWorkManager.Instance.connect().catch(() => false))) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.connectServer();
        }
    }

    async loadRes() {
        const list = [];
        for (const type in PrefabPathEnum) {
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then(prefeb => {
                DataManager.Instance.prefabMap.set(type, prefeb);
            });
            list.push(p);
        }

        for (const type in TexturePathEnum) {
            const p = ResourceManager.Instance.loadDir(TexturePathEnum[type], SpriteFrame).then(spriteFrames => {
                DataManager.Instance.textureMap.set(type, spriteFrames);
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
        this.tick(dt);
    }

    tick(dt) {
        this.tickActor(dt);
        // DataManager.Instance.applyInput({
        //     type: InputTypeEnum.TimePast,
        //     dt,
        // });
    }

    tickActor(dt) {
        for (const data of DataManager.Instance.state.actors) {
            const { id } = data;
            let actorManager = DataManager.Instance.actorMap.get(id);
            actorManager?.tick(dt);
        }
    }

    render() {
        this.renderActor();
        this.renderBullet();
    }

    renderActor() {
        for (const data of DataManager.Instance.state.actors) {
            const { id, type } = data;
            let actorManager = DataManager.Instance.actorMap.get(id);
            if (!actorManager) {
                const prefab = DataManager.Instance.prefabMap.get(type);
                const actor = instantiate(prefab);
                actor.setParent(this._stage);
                actorManager = actor.getComponent(ActorManager) || actor.addComponent(ActorManager);
                DataManager.Instance.actorMap.set(id, actorManager);
                actorManager.init(data);
            } else {
                actorManager.render(data);
            }
        }
    }

    renderBullet() {
        for (const data of DataManager.Instance.state.bullets) {
            const { id, type } = data;
            let bulletManager = DataManager.Instance.bulletMap.get(id);
            if (!bulletManager) {
                const bullet = ObjectPoolManager.Instance.get(type);

                bulletManager = bullet.getComponent(BulletManager) || bullet.addComponent(BulletManager);
                DataManager.Instance.bulletMap.set(id, bulletManager);
                bulletManager.init(data);
                bulletManager.render(data);
            } else {
                bulletManager.render(data);
            }
        }
    }

    handleClientSync(input: IClientInput) {
        const msg: IMsgClientSync = {
            input,
            frameId: DataManager.Instance.frameId++,
        };
        NetWorkManager.Instance.sendMsg(ApiMsgEnum.MsgClientSync, msg);

        if (input.type === InputTypeEnum.ActorMove) {
            DataManager.Instance.applyInput(input);
            this._pendingMsg.push(msg);
        }
    }

    handleServerSync({ inputs, lastFrameId }: IMsgServerSync) {
        DataManager.Instance.state = DataManager.Instance.lastState;
        for (const input of inputs) {
            DataManager.Instance.applyInput(input);
        }
        DataManager.Instance.lastState = deepCopy(DataManager.Instance.state);
        this._pendingMsg = this._pendingMsg.filter(msg => msg.frameId > lastFrameId);
        for (const msg of this._pendingMsg) {
            DataManager.Instance.applyInput(msg.input);
        }
    }
}
