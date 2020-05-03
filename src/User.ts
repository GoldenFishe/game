import {query} from "./utils/db";
import {Role} from "./enums/Role";
import Game from "./Game";
import {UserType} from "./types/User";

export default class User {

    public static async insertMasterInDb(name: string, gameId: number): Promise<UserType> {
        const [master]: UserType[] = await query(`INSERT INTO users (name, game_id, role) VALUES ('${name}', ${gameId}, '${Role.master}') RETURNING *`);
        await Game.setMasterId(master.id, gameId);
        return master;
    }

    public static async insertPlayerInDb(name: string, gameId: number): Promise<UserType> {
        const [player]: UserType[] = await query(`INSERT INTO users (name, game_id, points, role) VALUES ('${name}', ${gameId}, 0, '${Role.player}') RETURNING *`);
        return player;
    }

    public static async getGamePlayers(gameId: number): Promise<UserType[]> {
        return await query(`SELECT * FROM users WHERE game_id = ${gameId} AND role != '${Role.master}'`);
    }

    public static async getGameMaster(gameId: number): Promise<UserType> {
        const [master]: UserType[] = await query(`SELECT * FROM users WHERE game_id = ${gameId} AND role = '${Role.master}'`);
        return master;
    }

    public static async getUserById(userId: number): Promise<UserType> {
        const [user]: UserType[] = await query(`SELECT * FROM users WHERE id = ${userId}`);
        return user;
    }
}