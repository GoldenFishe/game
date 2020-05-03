import {Role} from "../enums/Role";

export type UserType = {
    id: number;
    name: string;
    game_id: number;
    points: number | null;
    answer: string | null;
    role: Role
};