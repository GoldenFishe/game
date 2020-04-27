import {IGame, IGameState} from "./interfaces/IGame";
import {IMaster} from "./interfaces/IMaster";
import {IPlayer} from "./interfaces/IPlayer";
import {ICategory, IQuestion, IQuestions} from "./interfaces/IQuestions";
import {query} from "./utils/db";
import Player from "./Player";

export default class Game implements IGame {
    public readonly id: number;
    public readonly title: string;
    public players: IPlayer[];
    public readonly master: IMaster;
    public selectedPlayer: IPlayer | null;
    public questions: IQuestions;
    public currentRoundIndex: number;
    public selectedCategoryId: number | null;
    public selectedQuestion: IQuestion | null;

    constructor(
        id: number,
        title: string,
        players: IPlayer[],
        master: IMaster,
        selectedPlayer: IPlayer | null,
        questions: IQuestions,
        currentRoundIndex: number,
        selectedCategoryId: number | null,
        selectedQuestion: IQuestion | null) {
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

    public static async insertInDb(title: string, jsonQuestions: IQuestions) {
        const questions = JSON.stringify(jsonQuestions);
        const [game] = await query(`INSERT INTO games (title, questions) VALUES ('${title}', '${questions}') RETURNING *`);
        return game;
    }

    public static async getGameFromDb(id: number) {
        const [game] = await query(`SELECT * FROM games WHERE id = ${id}`);
        return game;
    }

    public static async getAllGamesFromDb() {
        return await query(`SELECT * FROM games`);
    }

    public static async setMasterId(masterId: number, gameId: number) {
        return await query(`UPDATE games SET master_id = ${masterId} WHERE id = ${gameId}`);
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

    public static async join(playerId: number, gameId: number) {
        const [game] = await query(`UPDATE games SET players_ids = array_append(players_ids, ${playerId}) WHERE id = ${gameId} RETURNING *`);
        return game;
    }

    public leave(player: IPlayer): void {
        this.players = this.players.filter(p => p.id === player.id);
    }

    public finishGame(): void {

    }

    public static async getState(gameId: number) {
        const gamePromise = Game.getGameFromDb(gameId);
        const playersPromise = Player.getGamePlayers(gameId);
        const masterPromise = Player.getGameMaster(gameId);
        const [game, players, master] = await Promise.all([gamePromise, playersPromise, masterPromise]);
        return {
            id: game.id,
            title: game.title,
            master: master,
            players: players,
            selectedPlayer: game.selected_player_id,
            categories: game.questions.rounds[game.current_round_index],
            selectedCategoryId: game.selected_category_id,
            selectedQuestion: game.selected_question
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
