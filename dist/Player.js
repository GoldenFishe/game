"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./utils/db");
const Role_1 = require("./enums/Role");
class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.points = 0;
        this.answer = '';
    }
    static insertInDb(name, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [player] = yield db_1.query(`INSERT INTO users (name, game_id, points, role) VALUES ('${name}', ${gameId}, 0, '${Role_1.Role.player}') RETURNING *`);
            return player;
        });
    }
    static getGamePlayers(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.query(`SELECT * FROM users WHERE game_id = ${gameId} AND role != 'master'`);
        });
    }
    static getGameMaster(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [master] = yield db_1.query(`SELECT * FROM users WHERE game_id = ${gameId} AND role = 'master'`);
            return master;
        });
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map