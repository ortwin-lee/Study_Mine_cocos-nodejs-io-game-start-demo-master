import {
    IApiPlayerJoinReq,
    IApiPlayerJoinRes,
    IApiPlayerListReq,
    IApiPlayerListRes,
    IApiRoomCreateReq,
    IApiRoomCreateRes,
    IApiRoomJoinReq,
    IApiRoomJoinRes,
    IApiRoomListReq,
    IApiRoomListRes,
} from "./Api";
import { ApiMsgEnum } from "./Enum";
import { IMsgClientSync, IMsgPlayerList, IMsgRoom, IMsgRoomList, IMsgServerSync } from "./Msg";

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

        [ApiMsgEnum.ApiRoomJoin]: {
            req: IApiRoomJoinReq;
            res: IApiRoomJoinRes;
        };
    };

    msg: {
        [ApiMsgEnum.MsgPlayerList]: IMsgPlayerList;
        [ApiMsgEnum.MsgRoomList]: IMsgRoomList;
        [ApiMsgEnum.MsgRoom]: IMsgRoom;
        [ApiMsgEnum.MsgClientSync]: IMsgClientSync;
        [ApiMsgEnum.MsgServerSync]: IMsgServerSync;
    };
}
