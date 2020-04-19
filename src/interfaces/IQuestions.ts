export interface IQuestions {
    readonly title: string;
    readonly rounds: Array<ICategory[]>;

    getQuestion?(roundIndex: number, categoryId: number, questionId: number): IQuestion;
}

export interface ICategory {
    readonly id: number;
    readonly title: string;
    readonly questions: IQuestion[];
}

export interface IQuestion {
    readonly id: number;
    readonly cost: number;
    readonly text: string;
    readonly answer: string;
    answered: boolean;
}
