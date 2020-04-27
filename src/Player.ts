import {IPlayer} from "./interfaces/IPlayer";
import {query} from "./utils/db";
import {Role} from "./enums/Role";
import {IMaster} from "./interfaces/IMaster";

export default class Player implements IPlayer {
    readonly id: number;
    readonly name: string;
    points: number;
    answer: string | null;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.points = 0;
        this.answer = '';
    }

    public static async insertInDb(name: string, gameId: number): Promise<IPlayer> {
        const [player] = await query(`INSERT INTO users (name, game_id, points, role) VALUES ('${name}', ${gameId}, 0, '${Role.player}') RETURNING *`);
        return player;
    }

    public static async getGamePlayers(gameId: number): Promise<IPlayer[]> {
        return await query(`SELECT * FROM users WHERE game_id = ${gameId} AND role != 'master'`);
    }

    public static async getGameMaster(gameId: number): Promise<IMaster> {
        const [master] = await query(`SELECT * FROM users WHERE game_id = ${gameId} AND role = 'master'`);
        return master;
    }
}
