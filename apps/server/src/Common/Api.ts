export interface IPlayer {
    id: number;
    nickname: string;
    rid: number;
}

export interface IRoom {
    id: number;
    players: IPlayer[];
}

export interface IApiPlayerJoinReq {
    nickname: string;
}

export interface IApiPlayerJoinRes {
    player: IPlayer;
}

export interface IApiPlayerListReq {}

export interface IApiPlayerListRes {
    list: IPlayer[];
}

export interface IApiRoomListReq {}

export interface IApiRoomListRes {
    list: IRoom[];
}

export interface IApiRoomCreateReq {}

export interface IApiRoomCreateRes {
    room: IRoom;
}

export interface IApiRoomJoinReq {
    rid: number;
}

export interface IApiRoomJoinRes {
    room: IRoom;
}