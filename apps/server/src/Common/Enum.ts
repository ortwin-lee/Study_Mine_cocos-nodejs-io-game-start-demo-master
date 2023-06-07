export enum InputTypeEnum {
    ActorMove,
    WeaponShoot,
    TimePast,
}

export enum EntityTypeEnum {
    Actor1 = "Actor1",
    Actor2 = "Actor2",
    Map = "Map",
    Weapon1 = "Weapon1",
    Weapon2 = "Weapon2",
    Bullet1 = "Bullet1",
    Bullet2 = "Bullet2",
    Explosion = "Explosion",
}

export enum ApiMsgEnum {
    ApiPlayerJoin,
    ApiPlayerList,
    ApiRoomList,
    ApiRoomCreate,
    ApiRoomJoin,
    ApiRoomLeave,
    ApiGameStart,
    MsgPlayerList,
    MsgRoomList,
    MsgRoom,
    MsgGameStart,
    MsgClientSync,
    MsgServerSync,
}
