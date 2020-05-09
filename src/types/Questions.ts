export type QuestionsPackType = {
    id: number;
    questions: QuestionsType;
}

export type QuestionsType = {
    title: string;
    rounds: RoundType[];
}

export type RoundType = CategoryType[];

export type CategoryType = {
    id: number;
    title: string;
    questions: QuestionType[];
}

export type QuestionType = {
    id: number;
    cost: number;
    text: string;
    answer: string;
    answered: boolean;
}
