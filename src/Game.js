const Questions = require('./Questions');
const Player = require('./Player');
const Master = require('./Master');

class Game {
    constructor(masterName, rawQuestions) {
        this.id = 0;
        this.players = [];
        this.master = new Master(masterName);
        this.selectedPlayer = null;
        this.quiestions = new Questions(rawQuestions);
        this.currentRoundIndex = 0;
        this.selectedCategoryId = null;
        this.selectedQuestion = null;
    }

    selectPlayer(playerId) {
        this.selectedPlayer = this._selectPlayer(playerId);
    }

    selectQuestion(categoryId, questionId) {
        this.selectedCategoryId = categoryId;
        this.selectedQuestion = this.quiestions.getQuestion(this.currentRoundIndex, categoryId, questionId);
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
        this._deselectQuestion();
    }

    incorrectAnswer() {
        this.selectedPlayer.points -= this.selectedQuestion.cost;
        this.selectedPlayer = null;
    }

    join(name) {
        const player = new Player(this.players.length, name);
        this.players.push(player);
    }

    finishGame() {

    }

    getState(log) {
        const categories = this.quiestions.rounds[this.currentRoundIndex];
        log && console.log({
            id: this.id,
            players: this.players,
            master: this.master,
            selectedPlayer: this.selectedPlayer,
            categories: categories,
            selectedCategoryId: this.selectedCategoryId,
            selectedQuestion: this.selectedQuestion
        })
        return {
            id: this.id,
            players: this.players,
            master: this.master,
            selectedPlayer: this.selectedPlayer,
            categories: categories,
            selectedCategoryId: this.selectedCategoryId,
            selectedQuestion: this.selectedQuestion
        }
    }

    _selectPlayer(id) {
        return this.players.find(player => player.id === id);
    }

    _deselectQuestion() {
        this.selectedCategoryId = null;
        this.selectedQuestion = null;
        const roundOver = this._checkRoundIsOver();
        if (roundOver) {
            const gameOver = this._checkIsGameOver();
            gameOver ?
                this.finishGame() :
                this.currentRoundIndex += 1;
        }
    }

    _checkRoundIsOver() {
        const checkAllQuestionsInCategoryIsAnswered = ({questions}) => questions.every(question => question.answered)
        return this.quiestions.rounds[this.currentRoundIndex].every(checkAllQuestionsInCategoryIsAnswered);
    }

    _checkIsGameOver() {
        return this.currentRoundIndex === this.quiestions.rounds.length;
    }
}

module.exports = Game;
