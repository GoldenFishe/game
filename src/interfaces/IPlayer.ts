export interface IPlayer {
    readonly id: number;
    readonly name: string;
    points: number;
    answer: string | null;
}
