import {query} from "./utils/db";
import {CategoryType, QuestionsPackType, QuestionsType, QuestionType, RoundType} from "./types/Questions";
import {GameStateType, GameType} from "./types/Game";
import {UserType} from "./types/User";
import User from "./User";

export default class Game {

    public static async insertInDb(title: string, jsonQuestions: QuestionsPackType): Promise<GameType> {
        const questions: string = JSON.stringify(jsonQuestions.questions);
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

    public static async selectQuestion(categoryId: number, questionId: number, gameId: number): Promise<void> {
        const game: GameType = await Game.getGameFromDb(gameId);
        const category: CategoryType = game.questions.rounds[game.current_round_index].find((category: CategoryType) => category.id === categoryId);
        const question: QuestionType = category.questions.find((question: QuestionType) => question.id === questionId);
        await query(`UPDATE games SET selected_category_id = ${categoryId}, selected_question = '${JSON.stringify(question)}' WHERE id = ${gameId}`);
    }

    public static async getState(gameId: number): Promise<GameStateType> {
        const gamePromise: Promise<GameType> = Game.getGameFromDb(gameId);
        const playersPromise: Promise<UserType[]> = User.getGamePlayers(gameId);
        const masterPromise: Promise<UserType> = User.getGameMaster(gameId);
        const [game, players, master]: [GameType, UserType[], UserType] = await Promise.all([gamePromise, playersPromise, masterPromise]);
        const selectedPlayer = players.find((player: UserType) => !!player.selected);
        return {
            id: game.id,
            title: game.title,
            master: master,
            players: players,
            selectedPlayerId: selectedPlayer ? selectedPlayer.id : null,
            categories: game.questions.rounds[game.current_round_index],
            selectedCategoryId: game.selected_category_id,
            selectedQuestion: game.selected_question
        }
    }

    public static async judgeAnswer(correct: boolean, gameId: number): Promise<void> {
        const game: GameType = await Game.getGameFromDb(gameId);
        const selectedPlayer: UserType = await User.getSelectedPlayer(game.id);
        correct ? await Game.correctAnswer(game, selectedPlayer) : await Game.incorrectAnswer(game, selectedPlayer);
        await User.deselectPlayer(selectedPlayer.id);
    }

    public static async destroyGame(gameId: number): Promise<void> {
        await query(`DELETE FROM games WHERE id = ${gameId}`);
    }

    private static async correctAnswer(game: GameType, selectedPlayer: UserType): Promise<void> {
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
        await User.plusPoints(game.selected_question.cost, selectedPlayer.id);
        await query(`UPDATE games SET questions = '${JSON.stringify(questions)}', selected_category_id = null, selected_question = null, current_round_index = ${roundIndex} WHERE id = ${game.id}`);
    }

    private static async incorrectAnswer(game: GameType, selectedPlayer: UserType): Promise<void> {
        await User.minusPoints(game.selected_question.cost, selectedPlayer.id);
    }

    private static checkRoundIsOver(round: RoundType): boolean {
        return round.every((category: CategoryType) => category.questions.every((question: QuestionType) => question.answered));
    }
}
