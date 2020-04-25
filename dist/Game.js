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
const Player_1 = __importDefault(require("./Player"));
const db_1 = require("./utils/db");
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
    static getAllGamesFromDb() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.query(`SELECT * FROM games`);
        });
    }
    selectPlayer(playerId) {
        this.selectedPlayer = this.players.find(player => player.id === playerId);
    }
    selectQuestion(categoryId, questionId) {
        this.selectedCategoryId = categoryId;
        this.selectedQuestion = this.questions.getQuestion(this.currentRoundIndex, categoryId, questionId);
    }
    setAnswer(answer) {
        this.selectedPlayer.answer = answer;
    }
    judgeAnswer(correct) {
        correct ? this.correctAnswer() : this.incorrectAnswer();
    }
    correctAnswer() {
        this.selectedPlayer.points += this.selectedQuestion.cost;
        this.selectedPlayer.answer = '';
        this.selectedQuestion.answered = true;
        this.deselectQuestion();
    }
    incorrectAnswer() {
        this.selectedPlayer.points -= this.selectedQuestion.cost;
        this.selectedPlayer = null;
    }
    join(name) {
        const player = new Player_1.default(this.players.length, name);
        this.players.push(player);
    }
    leave(player) {
        this.players = this.players.filter(p => p.id === player.id);
    }
    finishGame() {
    }
    getState(log = false) {
        const categories = this.questions.rounds[this.currentRoundIndex];
        log && console.log({
            id: this.id,
            players: this.players,
            master: this.master,
            selectedPlayer: this.selectedPlayer,
            categories: categories,
            selectedCategoryId: this.selectedCategoryId,
            selectedQuestion: this.selectedQuestion
        });
        return {
            id: this.id,
            players: this.players,
            master: { id: this.master.id, name: this.master.name },
            selectedPlayer: this.selectedPlayer,
            categories: categories,
            selectedCategoryId: this.selectedCategoryId,
            selectedQuestion: this.selectedQuestion
        };
    }
    deselectQuestion() {
        this.selectedCategoryId = null;
        this.selectedQuestion = null;
        const roundOver = this.checkRoundIsOver();
        if (roundOver) {
            const gameOver = this.checkIsGameOver();
            gameOver ?
                this.finishGame() :
                this.currentRoundIndex += 1;
        }
    }
    checkRoundIsOver() {
        const checkAllQuestionsInCategoryIsAnswered = (category) => category.questions.every(question => question.answered);
        return this.questions.rounds[this.currentRoundIndex].every(checkAllQuestionsInCategoryIsAnswered);
    }
    checkIsGameOver() {
        return this.currentRoundIndex === this.questions.rounds.length;
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map