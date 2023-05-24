import { Connection } from "../Core";

export class Player {
    id: number;
    nickname: string;
    connection: Connection;
    rid: number;

    constructor({ id, nickname, connection }: Pick<Player, "id" | "nickname" | "connection">) {
        this.id = id;
        this.nickname = nickname;
        this.connection = connection;
    }
}
