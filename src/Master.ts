import {IMaster} from "./interfaces/IMaster";

export default class Master implements IMaster {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
}
