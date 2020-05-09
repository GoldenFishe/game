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
class Questions {
    static getAllQuestionsFromDb() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.query(`SELECT * FROM questions`);
        });
    }
    static insertInDb(jsonQuestions) {
        return __awaiter(this, void 0, void 0, function* () {
            const [questions] = yield db_1.query(`INSERT INTO questions (questions) VALUES ('${JSON.stringify(jsonQuestions)}') RETURNING *`);
            return questions;
        });
    }
    static getQuestionsFromDb(questionsId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [questions] = yield db_1.query(`SELECT * FROM questions WHERE id = ${questionsId}`);
            return questions;
        });
    }
}
exports.default = Questions;
//# sourceMappingURL=Questions.js.map