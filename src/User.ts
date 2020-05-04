import {query} from "./utils/db";
import {Role} from "./enums/Role";
import {UserType} from "./types/User";

export default class User {

    public static async insertMasterInDb(name: string, gameId: number): Promise<UserType> {
        const [master]: UserType[] = await query(`INSERT INTO users (name, game_id, role) VALUES ('${name}', ${gameId}, '${Role.master}') RETURNING *`);
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

    public static async getSelectedPlayer(gameId: number): Promise<UserType> {
        const [selectedPlayer]: UserType[] = await query(`SELECT * FROM users WHERE game_id = ${gameId} AND selected = true`);
        return selectedPlayer;
    }

    public static async selectPlayer(userId: number): Promise<void> {
        await query(`UPDATE users SET selected = true WHERE id = ${userId}`);
    }

    public static async deselectPlayer(userId: number): Promise<void> {
        await query(`UPDATE users SET selected = false WHERE id = ${userId}`);
    }

    public static async setAnswer(answer: string, userId: number): Promise<void> {
        await query(`UPDATE users SET answer = '${answer}' WHERE id = ${userId}`);
    }

    public static async plusPoints(points: number, userId: number): Promise<void> {
        await query(`UPDATE users SET points = points + ${points}, answer = null WHERE id = ${userId}`);
    }

    public static async minusPoints(points: number, userId: number): Promise<void> {
        await query(`UPDATE users SET points = points - ${points}, answer = null WHERE id = ${userId}`);
    }

    public static async removePlayer(playerId: number): Promise<void> {
        await query(`DELETE FROM user WHERE id = ${playerId}`);
    }
}