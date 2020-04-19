import {IQuestions, IQuestion, ICategory} from "./interfaces/IQuestions";

export default class Questions implements IQuestions {
    title: string;
    rounds: Array<ICategory[]>;

    constructor(jsonScheme: IQuestions) {
        this.title = jsonScheme.title;
        this.rounds = jsonScheme.rounds;
    }

    getQuestion(roundIndex: number, categoryId: number, questionId: number): IQuestion {
        const category = this.rounds[roundIndex].find(({id}) => id === categoryId);
        return category.questions.find(({id}) => id === questionId);
    }
}
