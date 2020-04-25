import {IQuestions, IQuestion, ICategory} from "./interfaces/IQuestions";
import {query} from "./utils/db";

export default class Questions implements IQuestions {
    title: string;
    rounds: Array<ICategory[]>;

    constructor(jsonScheme: IQuestions) {
        this.title = jsonScheme.title;
        this.rounds = jsonScheme.rounds;
    }

    static async insertInDb(jsonQuestions: IQuestions) {
        return await query(`INSERT INTO questions (questions) VALUES ('${jsonQuestions}') RETURNING *`);
    }

    static async getQuestionsFromDb(id: number): Promise<IQuestions> {
        const [{questions}] = await query(`SELECT * FROM questions WHERE id = ${id}`);
        return questions;
    }

    getQuestion(roundIndex: number, categoryId: number, questionId: number): IQuestion {
        const category = this.rounds[roundIndex].find(({id}) => id === categoryId);
        return category.questions.find(({id}) => id === questionId);
    }
}
