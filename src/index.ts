import express, {Express, Request, Response} from "express";
import http from "http";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import socket, {Server, Socket} from "socket.io";

import {IGame} from "./interfaces/IGame";
import Game from "./Game";
import * as rawQuestions from "./questions.json";

const app: Express = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const server = http.createServer(app);
const io: Server = socket(server, {cookie: true});
const games: IGame[] = [];
const gameIO = io.of('/game/0');
const gamesIO = io.of('/games');

gameIO.on('connection', (socket: Socket) => {
    console.log('connected socket!');
    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });
});

server.listen(8080, () => console.log('Example app listening on port 8080!'));

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello World!');
});

app.get('/games', (req: Request, res: Response): void => {
    res.send(games);
});

app.post('/game/create', (req: Request, res: Response): void => {
    const {masterName, gameTitle}: { masterName: string, gameTitle: string } = req.body;
    const game = new Game(masterName, gameTitle, rawQuestions);
    games.push(game);
    gamesIO.emit('addGame', game);
    res.cookie('role', 'master', {expires: new Date(Date.now() + 900000), httpOnly: true})
    res.send(games[0].getState());
})

app.post('/game/:id/join', (req: Request, res: Response): void => {
    const playerName: string = req.body.playerName;
    games[0].join(playerName);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
})

app.post('/game/:id/select-player', (req: Request, res: Response): void => {
    const playerId: number = req.body.playerId;
    games[0].selectPlayer(playerId);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
})

app.post('/game/:id/set-answer', (req: Request, res: Response): void => {
    const answer: string = req.body.answer;
    games[0].setAnswer(answer);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
})

app.post('/game/:id/judge', (req: Request, res: Response): void => {
    const correct: boolean = req.body.correct;
    games[0].judgeAnswer(correct);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
})

app.post('/game/:id/select-question', (req: Request, res: Response): void => {
    const categoryId: number = req.body.categoryId;
    const questionId: number = req.body.questionId;
    games[0].selectQuestion(categoryId, questionId);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
})


