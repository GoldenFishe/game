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
class Master {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    static insertInDb(name, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [master] = yield db_1.query(`INSERT INTO users (name, game_id, role) VALUES ('${name}', ${game_id}, '${Role_1.Role.master}') RETURNING *`);
            return master;
        });
    }
}
exports.default = Master;
//# sourceMappingURL=Master.js.map