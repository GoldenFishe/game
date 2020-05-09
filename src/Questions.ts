import {query} from "./utils/db";
import {QuestionsPackType, QuestionsType} from "./types/Questions";

export default class Questions {

    static async getAllQuestionsFromDb(): Promise<QuestionsPackType[]> {
        return await query(`SELECT * FROM questions`);
    }

    static async insertInDb(jsonQuestions: QuestionsType): Promise<QuestionsPackType> {
        const [questions]: QuestionsPackType[] = await query(`INSERT INTO questions (questions) VALUES ('${JSON.stringify(jsonQuestions)}') RETURNING *`);
        return questions;
    }

    static async getQuestionsFromDb(questionsId: number): Promise<QuestionsPackType> {
        const [questions]: QuestionsPackType[] = await query(`SELECT * FROM questions WHERE id = ${questionsId}`);
        return questions;
    }
}
