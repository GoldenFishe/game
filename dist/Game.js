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
const User_1 = __importDefault(require("./User"));
class Game {
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
    static selectQuestion(categoryId, questionId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield Game.getGameFromDb(gameId);
            const category = game.questions.rounds[game.current_round_index].find((category) => category.id === categoryId);
            const question = category.questions.find((question) => question.id === questionId);
            yield db_1.query(`UPDATE games SET selected_category_id = ${categoryId}, selected_question = '${JSON.stringify(question)}' WHERE id = ${gameId}`);
        });
    }
    static getState(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const gamePromise = Game.getGameFromDb(gameId);
            const playersPromise = User_1.default.getGamePlayers(gameId);
            const masterPromise = User_1.default.getGameMaster(gameId);
            const [game, players, master] = yield Promise.all([gamePromise, playersPromise, masterPromise]);
            const selectedPlayer = players.find((player) => !!player.selected);
            return {
                id: game.id,
                title: game.title,
                master: master,
                players: players,
                selectedPlayerId: selectedPlayer ? selectedPlayer.id : null,
                categories: game.questions.rounds[game.current_round_index],
                selectedCategoryId: game.selected_category_id,
                selectedQuestion: game.selected_question
            };
        });
    }
    static judgeAnswer(correct, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield Game.getGameFromDb(gameId);
            const selectedPlayer = yield User_1.default.getSelectedPlayer(game.id);
            correct ? yield Game.correctAnswer(game, selectedPlayer) : yield Game.incorrectAnswer(game, selectedPlayer);
            yield User_1.default.deselectPlayer(selectedPlayer.id);
        });
    }
    static destroyGame(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.query(`DELETE FROM games WHERE id = ${gameId}`);
        });
    }
    static correctAnswer(game, selectedPlayer) {
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
            yield User_1.default.plusPoints(game.selected_question.cost, selectedPlayer.id);
            yield db_1.query(`UPDATE games SET questions = '${JSON.stringify(questions)}', selected_category_id = null, selected_question = null, current_round_index = ${roundIndex} WHERE id = ${game.id}`);
        });
    }
    static incorrectAnswer(game, selectedPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User_1.default.minusPoints(game.selected_question.cost, selectedPlayer.id);
        });
    }
    static checkRoundIsOver(round) {
        return round.every((category) => category.questions.every((question) => question.answered));
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map