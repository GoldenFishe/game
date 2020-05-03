import {query} from "./utils/db";
import {CategoryType, QuestionsType, QuestionType, RoundType} from "./types/Questions";
import {GameStateType, GameType} from "./types/Game";
import {UserType} from "./types/User";
import User from "./User";

export default class Game {

    public static async insertInDb(title: string, jsonQuestions: QuestionsType): Promise<GameType> {
        const questions: string = JSON.stringify(jsonQuestions);
        const [game]: GameType[] = await query(`INSERT INTO games (title, questions) VALUES ('${title}', '${questions}') RETURNING *`);
        return game;
    }

    public static async getGameFromDb(id: number): Promise<GameType> {
        const [game]: GameType[] = await query(`SELECT * FROM games WHERE id = ${id}`);
        return game;
    }

    public static async getAllGamesFromDb(): Promise<GameType[]> {
        return await query(`SELECT * FROM games`);
    }

    public static async selectPlayer(playerId: number, gameId: number): Promise<void> {
        await query(`UPDATE games SET selected_player_id = ${playerId} WHERE id = ${gameId}`);
    }

    public static async setMasterId(masterId: number, gameId: number): Promise<void> {
        await query(`UPDATE games SET master_id = ${masterId} WHERE id = ${gameId}`);
    }

    public static async selectQuestion(categoryId: number, questionId: number, gameId: number): Promise<void> {
        const game: GameType = await Game.getGameFromDb(gameId);
        const category: CategoryType = game.questions.rounds[game.current_round_index].find((category: CategoryType) => category.id === categoryId);
        const question: QuestionType = category.questions.find((question: QuestionType) => question.id === questionId);
        await query(`UPDATE games SET selected_category_id = ${categoryId}, selected_question = '${JSON.stringify(question)}' WHERE id = ${gameId}`);
    }

    public static async setAnswer(answer: string, userId: number): Promise<void> {
        await query(`UPDATE users SET answer = '${answer}' WHERE id = ${userId}`);
    }

    public static async join(playerId: number, gameId: number): Promise<GameType> {
        const [game]: GameType[] = await query(`UPDATE games SET players_ids = array_append(players_ids, ${playerId}) WHERE id = ${gameId} RETURNING *`);
        return game;
    }

    public static async getState(gameId: number): Promise<GameStateType> {
        const gamePromise: Promise<GameType> = Game.getGameFromDb(gameId);
        const playersPromise: Promise<UserType[]> = User.getGamePlayers(gameId);
        const masterPromise: Promise<UserType> = User.getGameMaster(gameId);
        const [game, players, master]: [GameType, UserType[], UserType] = await Promise.all([gamePromise, playersPromise, masterPromise]);
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

    public static async judgeAnswer(correct: boolean, gameId: number): Promise<void> {
        const game: GameType = await Game.getGameFromDb(gameId);
        correct ? await Game.correctAnswer(game) : await Game.incorrectAnswer(game);
    }

    private static async correctAnswer(game: GameType): Promise<void> {
        const rounds: RoundType[] = game.questions.rounds.map((round: RoundType, i: number) => {
            if (i === game.current_round_index) {
                round.map((category: CategoryType) => {
                    if (category.id === game.selected_category_id) {
                        category.questions.map((question: QuestionType) => {
                            if (question.id === game.selected_question.id) question.answered = true;
                            return question;
                        })
                    }
                    return category;
                });
            }
            return round;
        })
        const questions: QuestionsType = {
            ...game.questions,
            rounds
        }
        let roundIndex: number = game.current_round_index;
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

    private static async incorrectAnswer(game: GameType): Promise<void> {
        await query(`UPDATE users SET points = points - ${game.selected_question.cost}, answer = null WHERE id = ${game.selected_player_id}`);
        await query(`UPDATE games SET selected_player_id = null WHERE id = ${game.id}`);
    }

    private static checkRoundIsOver(round: RoundType): boolean {
        return round.every((category: CategoryType) => category.questions.every((question: QuestionType) => question.answered));
    }
}
