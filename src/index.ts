import express, {Express, Request, Response} from "express";
import http from "http";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import socket, {Server, Socket} from "socket.io";

import {IGame} from "./interfaces/IGame";
import {Role} from "./enums/Role";
import Game from "./Game";
import * as rawQuestions from "./questions.json";

const PORT = process.env.PORT || 8080;
const app: Express = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const server = http.createServer(app);
const io: Server = socket(server, {cookie: true});
const games: IGame[] = [];
const gameIO = io.of('/api/game/0');
const gamesIO = io.of('/api/games');

gameIO.on('connection', (socket: Socket) => {

});

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello World!');
});

app.get('/api/games', (req: Request, res: Response): void => {
    res.send(games);
});

app.get('/api/game/:id', (req: Request, res: Response): void => {
    const {role} = req.cookies;
    res.send({role, ...games[0].getState()});
});

app.post('/api/game/create', (req: Request, res: Response): void => {
    const {masterName, gameTitle}: { masterName: string, gameTitle: string } = req.body;
    const game = new Game(masterName, gameTitle, rawQuestions);
    games.push(game);
    gamesIO.emit('addGame', game);
    const cookieOptions = {expires: new Date(Date.now() + 900000), httpOnly: true};
    res.cookie('role', Role.Master, cookieOptions);
    res.cookie('name', masterName, cookieOptions);
    res.send({role: Role.Master, ...games[0].getState()});
})

app.post('/api/game/:id/join', (req: Request, res: Response): void => {
    const {playerName}: { playerName: string } = req.body;
    games[0].join(playerName);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send({role: Role.Master, ...games[0].getState()});
})

app.post('/api/game/:id/select-player', (req: Request, res: Response): void => {
    const playerId: number = req.body.playerId;
    games[0].selectPlayer(playerId);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
})

app.post('/api/game/:id/set-answer', (req: Request, res: Response): void => {
    const answer: string = req.body.answer;
    games[0].setAnswer(answer);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
})

app.post('/api/game/:id/judge', (req: Request, res: Response): void => {
    const correct: boolean = req.body.correct;
    games[0].judgeAnswer(correct);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
})

app.post('/api/game/:id/select-question', (req: Request, res: Response): void => {
    const categoryId: number = req.body.categoryId;
    const questionId: number = req.body.questionId;
    games[0].selectQuestion(categoryId, questionId);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
})

server.listen(8080, () => console.log(`Server is listening port ${PORT}`));

