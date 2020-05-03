import {QuestionsType, QuestionType, RoundType} from "./Questions";
import {UserType} from "./User";

export type GameType = {
    id: number;
    title: string;
    players_ids: number[];
    master_id: number;
    selected_player_id: number | null;
    questions: QuestionsType;
    current_round_index: number;
    selected_category_id: number | null;
    selected_question: QuestionType | null;
}

export type GameStateType = {
    id: number;
    title: string;
    master: UserType;
    players: UserType[];
    selectedPlayerId: number | null;
    categories: RoundType,
    selectedCategoryId: number | null;
    selectedQuestion: QuestionType | null;
}
