import {query} from "./utils/db";
import {QuestionsType} from "./types/Questions";

export default class Questions {

    static async insertInDb(jsonQuestions: QuestionsType): Promise<QuestionsType> {
        const [questions]: QuestionsType[] = await query(`INSERT INTO questions (questions) VALUES ('${jsonQuestions}') RETURNING *`);
        return questions;
    }

    static async getQuestionsFromDb(questionsId: number): Promise<QuestionsType> {
        const [{questions}] = await query(`SELECT * FROM questions WHERE id = ${questionsId}`);
        return questions;
    }
}
