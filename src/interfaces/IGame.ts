import {IPlayer} from "./IPlayer";
import {IMaster} from "./IMaster";
import {ICategory, IQuestion, IQuestions} from "./IQuestions";

export interface IGame {
    id: number;
    title: string;
    players: IPlayer[];
    master: IMaster;
    selectedPlayer: IPlayer | null;
    questions: IQuestions;
    currentRoundIndex: number;
    selectedCategoryId: number | null;
    selectedQuestion: IQuestion | null;

    finishGame(): void;

    deselectQuestion(): void;

    checkRoundIsOver(): boolean;

    checkIsGameOver(): boolean;
}

export interface IGameState {
    id: number;
    players: IPlayer[];
    master: IMaster;
    selectedPlayer: IPlayer | null;
    categories: ICategory[],
    selectedCategoryId: number | null;
    selectedQuestion: IQuestion | null;
}
