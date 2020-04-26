import {IMaster} from "./interfaces/IMaster";
import {query} from "./utils/db";
import {Role} from "./enums/Role";
import Game from "./Game";

export default class Master implements IMaster {
    readonly id: number;
    readonly name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public static async insertInDb(name: string, game_id: number): Promise<IMaster> {
        const [master] = await query(`INSERT INTO users (name, game_id, role) VALUES ('${name}', ${game_id}, '${Role.master}') RETURNING *`);
        await Game.setMasterId(master.id, game_id)
        return master;
    }
}
