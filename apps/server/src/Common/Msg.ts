import { IPlayer, IRoom } from "./Api";
import { IClientInput } from "./State";

export interface MsgClientSync {
    input: IClientInput;
    frameId: number;
}

export interface MsgServerSync {
    inputs: IClientInput[];
    lastFrameId: number;
}

export interface MsgPlayerList {
    list: IPlayer[];
}

export interface MsgRoomList {
    list: IRoom[];
}
