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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./utils/db");
const Player_1 = __importDefault(require("./Player"));
class Game {
    constructor(id, title, players, master, selectedPlayer, questions, currentRoundIndex, selectedCategoryId, selectedQuestion) {
        this.id = id;
        this.title = title;
        this.players = players;
        this.master = master;
        this.selectedPlayer = selectedPlayer;
        this.questions = questions;
        this.currentRoundIndex = currentRoundIndex;
        this.selectedCategoryId = selectedCategoryId;
        this.selectedQuestion = selectedQuestion;
    }
    static insertInDb(title, jsonQuestions) {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = JSON.stringify(jsonQuestions);
            const [game] = yield db_1.query(`INSERT INTO games (title, questions) VALUES ('${title}', '${questions}') RETURNING *`);
            return game;
        });
    }
    static getGameFromDb(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [game] = yield db_1.query(`SELECT * FROM games WHERE id = ${id}`);
            return game;
        });
    }
    static getAllGamesFromDb() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.query(`SELECT * FROM games`);
        });
    }
    static setMasterId(masterId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.query(`UPDATE games SET master_id = ${masterId} WHERE id = ${gameId}`);
        });
    }
    static selectPlayer(playerId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.query(`UPDATE games SET selected_player_id = ${playerId} WHERE id = ${gameId}`);
        });
    }
    static selectQuestion(categoryId, questionId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ questions, current_round_index }] = yield db_1.query(`SELECT questions, current_round_index FROM games WHERE id = ${gameId}`);
            const category = questions.rounds[current_round_index].find((category) => category.id === categoryId);
            const question = category.questions.find((question) => question.id === questionId);
            yield db_1.query(`UPDATE games SET selected_category_id = ${categoryId}, selected_question = '${JSON.stringify(question)}' WHERE id = ${gameId}`);
        });
    }
    static setAnswer(answer, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.query(`UPDATE users SET answer = '${answer}' WHERE id = ${userId}`);
        });
    }
    static join(playerId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [game] = yield db_1.query(`UPDATE games SET players_ids = array_append(players_ids, ${playerId}) WHERE id = ${gameId} RETURNING *`);
            return game;
        });
    }
    static getState(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const gamePromise = Game.getGameFromDb(gameId);
            const playersPromise = Player_1.default.getGamePlayers(gameId);
            const masterPromise = Player_1.default.getGameMaster(gameId);
            const [game, players, master] = yield Promise.all([gamePromise, playersPromise, masterPromise]);
            return {
                id: game.id,
                title: game.title,
                master: master,
                players: players,
                selectedPlayerId: game.selected_player_id,
                categories: game.questions.rounds[game.current_round_index],
                selectedCategoryId: game.selected_category_id,
                selectedQuestion: game.selected_question
            };
        });
    }
    static judgeAnswer(correct, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [game] = yield db_1.query(`SELECT * FROM games WHERE id = ${gameId}`);
            correct ? yield Game.correctAnswer(game) : yield Game.incorrectAnswer(game);
        });
    }
    static correctAnswer(game) {
        return __awaiter(this, void 0, void 0, function* () {
            const rounds = game.questions.rounds.map((round, i) => {
                if (i === game.current_round_index) {
                    round.map((category) => {
                        if (category.id === game.selected_category_id) {
                            category.questions.map((question) => {
                                if (question.id === game.selected_question.id)
                                    question.answered = true;
                                return question;
                            });
                        }
                        return category;
                    });
                }
                return round;
            });
            const questions = Object.assign(Object.assign({}, game.questions), { rounds });
            let roundIndex = game.current_round_index;
            if (Game.checkRoundIsOver(game.questions.rounds[game.current_round_index])) {
                if (game.questions.rounds.length - 1 < game.current_round_index) {
                    roundIndex += 1;
                }
                else {
                    console.log('finish game');
                }
            }
            yield db_1.query(`UPDATE users SET points = points + ${game.selected_question.cost}, answer = null WHERE id = ${game.selected_player_id}`);
            yield db_1.query(`UPDATE games SET selected_player_id = null, questions = '${JSON.stringify(questions)}', selected_category_id = null, selected_question = null, current_round_index = ${roundIndex} WHERE id = ${game.id}`);
        });
    }
    static incorrectAnswer(game) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.query(`UPDATE users SET points = points - ${game.selected_question.cost}, answer = null WHERE id = ${game.selected_player_id}`);
            yield db_1.query(`UPDATE games SET selected_player_id = null WHERE id = ${game.id}`);
        });
    }
    static checkRoundIsOver(round) {
        return round.every((category) => category.questions.every(question => question.answered));
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map