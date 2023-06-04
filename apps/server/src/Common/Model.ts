import { IApiPlayerJoinReq, IApiPlayerJoinRes, IApiPlayerListReq, IApiPlayerListRes } from "./Api";
import { ApiMsgEnum } from "./Enum";
import { MsgClientSync, MsgPlayerList, MsgServerSync } from "./Msg";

export interface IModel {
    api: {
        [ApiMsgEnum.ApiPlayerJoin]: {
            req: IApiPlayerJoinReq;
            res: IApiPlayerJoinRes;
        };

        [ApiMsgEnum.ApiPlayerList]: {
            req: IApiPlayerListReq;
            res: IApiPlayerListRes;
        };
    };

    msg: {
        [ApiMsgEnum.MsgPlayerList]: MsgPlayerList;
        [ApiMsgEnum.MsgClientSync]: MsgClientSync;
        [ApiMsgEnum.MsgServerSync]: MsgServerSync;
    };
}
