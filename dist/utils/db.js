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
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'ag.riazanov',
    host: '127.0.0.1',
    database: 'game',
    password: '666666',
    port: 5432
});
exports.query = (command, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield pool.connect();
        const startTime = Date.now();
        const result = yield client.query(command, params);
        const duration = `${(Date.now() - startTime) / 1000} s`;
        console.log('executed query', { command, duration, rows: result.rowCount });
        client.release();
        return result.rows;
    }
    catch (err) {
        console.error(err.stack);
    }
});
//# sourceMappingURL=db.js.map