import {IGame} from "./interfaces/IGame";
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

    public static async selectPlayer(playerId: number, gameId: number) {
        return await query(`UPDATE games SET selected_player_id = ${playerId} WHERE id = ${gameId}`);
    }

    public static async selectQuestion(categoryId: number, questionId: number, gameId: number) {
        const [{questions, current_round_index}] = await query(`SELECT questions, current_round_index FROM games WHERE id = ${gameId}`);
        const category = questions.rounds[current_round_index].find((category: ICategory) => category.id === categoryId);
        const question = category.questions.find((question: IQuestion) => question.id === questionId);
        await query(`UPDATE games SET selected_category_id = ${categoryId}, selected_question = '${JSON.stringify(question)}' WHERE id = ${gameId}`);
    }

    public static async setAnswer(answer: string, userId: number) {
        return await query(`UPDATE users SET answer = '${answer}' WHERE id = ${userId}`);
    }

    public static async join(playerId: number, gameId: number) {
        const [game] = await query(`UPDATE games SET players_ids = array_append(players_ids, ${playerId}) WHERE id = ${gameId} RETURNING *`);
        return game;
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
            selectedPlayerId: game.selected_player_id,
            categories: game.questions.rounds[game.current_round_index],
            selectedCategoryId: game.selected_category_id,
            selectedQuestion: game.selected_question
        }
    }

    public static async judgeAnswer(correct: boolean, gameId: number) {
        const [game] = await query(`SELECT * FROM games WHERE id = ${gameId}`);
        correct ? await Game.correctAnswer(game) : await Game.incorrectAnswer(game);
    }

    private static async correctAnswer(game) {
        const rounds = game.questions.rounds.map((round: ICategory[], i: number) => {
            if (i === game.current_round_index) {
                round.map((category: ICategory) => {
                    if (category.id === game.selected_category_id) {
                        category.questions.map((question: IQuestion) => {
                            if (question.id === game.selected_question.id) question.answered = true;
                            return question;
                        })
                    }
                    return category;
                });
            }
            return round;
        })
        const questions = {
            ...game.questions,
            rounds
        }
        let roundIndex = game.current_round_index;
        if (Game.checkRoundIsOver(game.questions.rounds[game.current_round_index])) {
            if (game.questions.rounds.length - 1 < game.current_round_index) {
                roundIndex += 1;
            } else {
                console.log('finish game');
            }
        }
        await query(`UPDATE users SET points = points + ${game.selected_question.cost}, answer = null WHERE id = ${game.selected_player_id}`);
        await query(`UPDATE games SET selected_player_id = null, questions = '${JSON.stringify(questions)}', selected_category_id = null, selected_question = null, current_round_index = ${roundIndex} WHERE id = ${game.id}`);
    }

    private static async incorrectAnswer(game) {
        await query(`UPDATE users SET points = points - ${game.selected_question.cost}, answer = null WHERE id = ${game.selected_player_id}`);
        await query(`UPDATE games SET selected_player_id = null WHERE id = ${game.id}`);
    }

    private static checkRoundIsOver(round: ICategory[]): boolean {
        return round.every((category: ICategory) => category.questions.every(question => question.answered));
    }
}
