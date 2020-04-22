"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Questions_1 = __importDefault(require("./Questions"));
const Player_1 = __importDefault(require("./Player"));
const Master_1 = __importDefault(require("./Master"));
class Game {
    constructor(masterName, title, rawQuestions) {
        this.id = 0;
        this.title = title;
        this.players = [];
        this.master = new Master_1.default(masterName);
        this.selectedPlayer = null;
        this.questions = new Questions_1.default(rawQuestions);
        this.currentRoundIndex = 0;
        this.selectedCategoryId = null;
        this.selectedQuestion = null;
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
            master: this.master,
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