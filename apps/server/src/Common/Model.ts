import {
    IApiPlayerJoinReq,
    IApiPlayerJoinRes,
    IApiPlayerListReq,
    IApiPlayerListRes,
    IApiRoomCreateReq,
    IApiRoomCreateRes,
    IApiRoomListReq,
    IApiRoomListRes,
} from "./Api";
import { ApiMsgEnum } from "./Enum";
import { MsgClientSync, MsgPlayerList, MsgRoomList, MsgServerSync } from "./Msg";

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

        [ApiMsgEnum.ApiRoomList]: {
            req: IApiRoomListReq;
            res: IApiRoomListRes;
        };

        [ApiMsgEnum.ApiRoomCreate]: {
            req: IApiRoomCreateReq;
            res: IApiRoomCreateRes;
        };
    };

    msg: {
        [ApiMsgEnum.MsgPlayerList]: MsgPlayerList;
        [ApiMsgEnum.MsgRoomList]: MsgRoomList;
        [ApiMsgEnum.MsgClientSync]: MsgClientSync;
        [ApiMsgEnum.MsgServerSync]: MsgServerSync;
    };
}
