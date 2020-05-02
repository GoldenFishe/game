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
import {query} from "./utils/db";

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
const getCookie = (req: Request): { userId: number, gameId: number } => {
    const userId: number = Number.parseInt(req.cookies.userId);
    const gameId: number = Number.parseInt(req.cookies.gameId);
    return {userId, gameId};
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
const createGamesSockets = async () => {
    const games = await Game.getAllGamesFromDb();
    games.map(game => createGameSocket(game.id));
};

createGamesSockets();

app.get('/api/games', async (req: Request, res: Response): Promise<void> => {
    const games = await Game.getAllGamesFromDb();
    res.send(games);
});
app.get('/api/game/:id', async (req: Request, res: Response): Promise<void> => {
    const gameId = Number.parseInt(req.params.id);
    const gameState = await Game.getState(gameId);
    res.send(gameState);
});
app.get('/api/user', async (req: Request, res: Response): Promise<void> => {
    const {userId} = getCookie(req);
    // TODO: Переработать User
    const [user] = await query(`SELECT * FROM users WHERE id = ${userId}`);
    res.send({role: user.role, id: user.id});
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
});
app.post('/api/game/join', async (req: Request, res: Response): Promise<void> => {
    const playerName = req.body.playerName;
    const gameId = Number.parseInt(req.body.gameId);
    const player = await Player.insertInDb(playerName, gameId);
    const game = await Game.join(player.id, gameId);
    await emitGameState(gameId);
    setCookie(res, Role.player, game.id, player.id);
    res.send({id: game.id});
});
app.post('/api/game/select-question', async (req: Request, res: Response) => {
    const {gameId} = getCookie(req);
    const categoryId: number = req.body.categoryId;
    const questionId: number = req.body.questionId;
    await Game.selectQuestion(categoryId, questionId, gameId);
    await emitGameState(gameId);
    res.sendStatus(200);
});
app.post('/api/game/select-player', async (req: Request, res: Response): Promise<void> => {
    const {userId, gameId} = getCookie(req);
    await Game.selectPlayer(userId, gameId);
    await emitGameState(gameId);
    res.sendStatus(200);
});
app.post('/api/game/set-answer', async (req: Request, res: Response) => {
    const {userId, gameId} = getCookie(req);
    const answer: string = req.body.answer;
    await Game.setAnswer(answer, userId);
    await emitGameState(gameId);
    res.sendStatus(200);
});
app.post('/api/game/judge', async (req: Request, res: Response): Promise<void> => {
    const {gameId} = getCookie(req);
    const correct: boolean = req.body.correct;
    await Game.judgeAnswer(correct, gameId);
    await emitGameState(gameId);
    res.sendStatus(200);
});

server.listen(8080, () => console.log(`Server is listening port ${PORT}`));

