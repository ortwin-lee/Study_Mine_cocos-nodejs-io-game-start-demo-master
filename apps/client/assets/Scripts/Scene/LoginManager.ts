import { _decorator, Component, director, EditBox } from "cc";
import { NetWorkManager } from "../Global/NetWorkManager";
import { ApiMsgEnum } from "../Common";
import DataManager from "../Global/DataManager";
import { SceneEnum } from "../Enum";

const { ccclass } = _decorator;

@ccclass("LoginManager")
export class LoginManager extends Component {
    input: EditBox;

    onLoad() {
        this.input = this.getComponentInChildren(EditBox);
        director.preloadScene(SceneEnum.Hall);
    }

    async start() {
        await NetWorkManager.Instance.connect();
    }

    async handleClick() {
        if (!NetWorkManager.Instance.isConnected) {
            console.log("未连接");
            await NetWorkManager.Instance.connect();
            return;
        }

        const nickname = this.input.string;
        if (!nickname) {
            console.log("nickname没有！");
            return;
        }

        const { success, error, res } = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiPlayerJoin, { nickname });
        if (!success) {
            console.log(error);
            return;
        }

        DataManager.Instance.myPlayerId = res.player.id;
        console.log("res: ", res);
        director.loadScene(SceneEnum.Hall);
    }
}
