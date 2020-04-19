import {IPlayer} from "./interfaces/IPlayer";

export default class Player implements IPlayer {
    readonly id: number;
    readonly name: string;
    points: number;
    answer: string | null;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.points = 0;
        this.answer = '';
    }
}
