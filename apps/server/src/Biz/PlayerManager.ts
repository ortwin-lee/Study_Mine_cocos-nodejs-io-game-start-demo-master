import Singleton from "../Base/Singleton";
import { ApiMsgEnum, IApiPlayerJoinReq } from "../Common";
import { Connection } from "../Core";
import { Player } from "./Player";
import { IPlayer } from "../Common/Api";
import { RoomManager } from "./RoomManager";

export class PlayerManager extends Singleton {
    static get Instance() {
        return super.GetInstance<PlayerManager>();
    }

    nextPlayerId = 1;

    players: Set<Player> = new Set();
    idMapPlayer: Map<number, Player> = new Map();

    createPlayer({ nickname, connection }: IApiPlayerJoinReq & { connection: Connection }) {
        const player = new Player({ id: this.nextPlayerId++, nickname, connection });
        this.players.add(player);
        this.idMapPlayer.set(player.id, player);
        return player;
    }

    removePlayer(pid: number) {
        const player = this.idMapPlayer.get(pid);
        if (player) {
            const rid = player.rid;
            if (rid) {
                RoomManager.Instance.leaveRoom(rid, player.id);
                RoomManager.Instance.syncRooms();
                RoomManager.Instance.syncRoom(rid);
            }
            this.players.delete(player);
            this.idMapPlayer.delete(player.id);
        }
    }

    syncPlayers() {
        for (const player of this.players) {
            player.connection.sendMsg(ApiMsgEnum.MsgPlayerList, { list: this.getPlayersView() });
        }
    }

    getPlayersView(players: Set<Player> = this.players): IPlayer[] {
        return [...players].map(p => this.getPlayerView(p));
    }

    getPlayerView({ id, nickname, rid }: Player): IPlayer {
        return { id, nickname, rid };
    }
}
