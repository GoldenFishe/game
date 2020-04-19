import express, {Request, Response} from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import {IGame} from "./interfaces/IGame";
import Game from "./Game";
import * as rawQuestions from "./questions.json";

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let game: IGame;

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello World!');
});

app.post('/game/create', (req: Request, res: Response): void => {
    const masterName: string = req.body.masterName;
    game = new Game(masterName, rawQuestions);
    res.send(game.getState());
})

app.post('/game/:id/join', (req: Request, res: Response): void => {
    const playerName: string = req.body.playerName;
    game.join(playerName);
    res.send(game.getState())
})

app.post('/game/:id/select-player', (req: Request, res: Response): void => {
    const playerId: number = req.body.playerId;
    game.selectPlayer(playerId)
    res.send(game.getState());
})

app.post('/game/:id/set-answer', (req: Request, res: Response): void => {
    const answer: string = req.body.answer;
    game.setAnswer(answer)
    res.send(game.getState());
})

app.post('/game/:id/judge', (req: Request, res: Response): void => {
    const correct: boolean = req.body.correct;
    game.judgeAnswer(correct)
    res.send(game.getState());
})

app.post('/game/:id/select-question', (req: Request, res: Response): void => {
    const categoryId: number = req.body.categoryId;
    const questionId: number = req.body.questionId;
    game.selectQuestion(categoryId, questionId)
    res.send(game.getState());
})

app.listen(8080, () => console.log('Example app listening on port 8080!'));



