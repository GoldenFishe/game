import {IGame, IGameState} from "./interfaces/IGame";
import {IMaster} from "./interfaces/IMaster";
import {IPlayer} from "./interfaces/IPlayer";
import {ICategory, IQuestion, IQuestions} from "./interfaces/IQuestions";
import Questions from "./Questions";
import Player from "./Player";
import Master from "./Master";

export default class Game implements IGame {
    public readonly id: number;
    public readonly players: IPlayer[];
    public readonly master: IMaster;
    public selectedPlayer: IPlayer | null;
    public readonly questions: IQuestions;
    public currentRoundIndex: number;
    public selectedCategoryId: number | null;
    public selectedQuestion: IQuestion | null;

    constructor(masterName: string, rawQuestions: IQuestions) {
        this.id = 0;
        this.players = [];
        this.master = new Master(masterName);
        this.selectedPlayer = null;
        this.questions = new Questions(rawQuestions);
        this.currentRoundIndex = 0;
        this.selectedCategoryId = null;
        this.selectedQuestion = null;
    }

    public selectPlayer(playerId: number): void {
        this.selectedPlayer = this.players.find(player => player.id === playerId);
    }

    public selectQuestion(categoryId: number, questionId: number): void {
        this.selectedCategoryId = categoryId;
        this.selectedQuestion = this.questions.getQuestion(this.currentRoundIndex, categoryId, questionId);
    }

    public setAnswer(answer: string): void {
        this.selectedPlayer.answer = answer;
    }

    public judgeAnswer(correct: boolean): void {
        correct ? this.correctAnswer() : this.incorrectAnswer();
    }

    public correctAnswer(): void {
        this.selectedPlayer.points += this.selectedQuestion.cost;
        this.selectedPlayer.answer = '';
        this.selectedQuestion.answered = true;
        this.deselectQuestion();
    }

    public incorrectAnswer(): void {
        this.selectedPlayer.points -= this.selectedQuestion.cost;
        this.selectedPlayer = null;
    }

    public join(name: string): void {
        const player = new Player(this.players.length, name);
        this.players.push(player);
    }

    public finishGame(): void {

    }

    public getState(log: boolean = false): IGameState {
        const categories = this.questions.rounds[this.currentRoundIndex];
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

    public deselectQuestion(): void {
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

    public checkRoundIsOver(): boolean {
        const checkAllQuestionsInCategoryIsAnswered = (category: ICategory): boolean => category.questions.every(question => question.answered)
        return this.questions.rounds[this.currentRoundIndex].every(checkAllQuestionsInCategoryIsAnswered);
    }

    public checkIsGameOver(): boolean {
        return this.currentRoundIndex === this.questions.rounds.length;
    }
}
