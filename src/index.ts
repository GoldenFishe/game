import express, {Express, Request, Response} from "express";
import http from "http";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import socket, {Namespace, Server} from "socket.io";

import {Role} from "./enums/Role";
import Game from "./Game";
import Master from "./Master";
import Questions from "./Questions";
import Player from "./Player";

const PORT: number = Number.parseInt(process.env.PORT) || 8080;
const gamesSockets: Map<number, Namespace> = new Map();
const app: Express = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const server = http.createServer(app);
const io: Server = socket(server, {cookie: true});
const gamesIO: Namespace = io.of('/api/games');

const setCookie = (res: Response, role: Role, gameId: number, userId: number): void => {
    const cookieOptions = {expires: new Date(Date.now() + 900000), httpOnly: true};
    res.cookie('role', role, cookieOptions);
    res.cookie('gameId', gameId, cookieOptions);
    res.cookie('userId', userId, cookieOptions);
};
const createGameSocket = (gameId: number): void => {
    const gameSocket = io.of(`/api/game/${gameId}`);
    gamesSockets.set(gameId, gameSocket);
};
const emitGameState = async (gameId: number): Promise<void> => {
    const gameState = await Game.getState(gameId);
    const gameSocket: Namespace = gamesSockets.get(gameId);
    gameSocket.emit('getState', gameState);
};

app.get('/api/games', async (req: Request, res: Response): Promise<void> => {
    const games = await Game.getAllGamesFromDb();
    res.send(games);
});
app.get('/api/game/:id', async (req: Request, res: Response): Promise<void> => {
    const userId: number = Number.parseInt(req.cookies.userId);
    const gameId = Number.parseInt(req.params.id);
    const gameState = await Game.getState(gameId);
    res.send(gameState);
});
app.post('/api/game/create', async (req: Request, res: Response): Promise<void> => {
    const {masterName, gameTitle}: { masterName: string, gameTitle: string } = req.body;
    const questions = await Questions.getQuestionsFromDb(1);
    const game = await Game.insertInDb(gameTitle, questions);
    const master = await Master.insertInDb(masterName, game.id);
    gamesIO.emit('addGame', game);
    createGameSocket(game.id);
    setCookie(res, Role.master, game.id, master.id);
    res.send({id: game.id});
})
app.post('/api/game/join', async (req: Request, res: Response): Promise<void> => {
    const playerName = req.body.playerName;
    const gameId = Number.parseInt(req.body.gameId);
    const player = await Player.insertInDb(playerName, gameId);
    const game = await Game.join(player.id, gameId);
    await emitGameState(gameId);
    setCookie(res, Role.player, game.id, player.id);
    res.send({id: game.id});
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

