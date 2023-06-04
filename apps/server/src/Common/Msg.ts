import { IPlayer } from "./Api";
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
