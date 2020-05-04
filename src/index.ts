import express, {Express, Request, Response} from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import bodyParser from "body-parser";
import socket, {Namespace, Server, Socket} from "socket.io";
import morgan from "morgan";

import {Role} from "./enums/Role";
import Game from "./Game";
import Questions from "./Questions";
import User from "./User";
import {GameType} from "./types/Game";
import logger from "./utils/logger";

const PORT: number = Number.parseInt(process.env.PORT) || 8080;
const gamesSockets: Map<GameType["id"], Namespace> = new Map();
const app: Express = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('combined', {
    stream: {
        write: (message: string) => {
            logger.info(message)
        }
    }
}));

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
    gameSocket.on('connection', (socket: Socket) => {
        socket.on('disconnect', (reason) => {
            const rawCookie = cookie.parse(socket.handshake.headers.cookie);
            const userId: number = Number.parseInt(rawCookie.userId);
            const gameId: number = Number.parseInt(rawCookie.gameId);
            if (rawCookie.role === Role.master) {
                Game.destroyGame(gameId);
                gamesSockets.delete(gameId);
            } else {
                User.removePlayer(userId);
            }
        });
    });
    gamesSockets.set(gameId, gameSocket);
};
const emitGameState = async (gameId: number): Promise<void> => {
    const gameState = await Game.getState(gameId);
    const gameSocket: Namespace = gamesSockets.get(gameId);
    gameSocket.emit('getState', gameState);
};
const createGamesSockets = async (): Promise<void> => {
    const games = await Game.getAllGamesFromDb();
    games.map(game => createGameSocket(game.id));
};

createGamesSockets();

app.get('/api/games', async (req: Request, res: Response): Promise<void> => {
    const games = await Game.getAllGamesFromDb();
    logger.log('info', 'get games');
    res.send(games);
});
app.get('/api/game/:id', async (req: Request, res: Response): Promise<void> => {
    const gameId = Number.parseInt(req.params.id);
    const gameState = await Game.getState(gameId);
    res.send(gameState);
});
app.get('/api/user', async (req: Request, res: Response): Promise<void> => {
    const {userId} = getCookie(req);
    const user = await User.getUserById(userId);
    res.send({role: user.role, id: user.id});
});
app.post('/api/game/create', async (req: Request, res: Response): Promise<void> => {
    const {masterName, gameTitle}: { masterName: string, gameTitle: string } = req.body;
    const questions = await Questions.getQuestionsFromDb(1);
    const game = await Game.insertInDb(gameTitle, questions);
    const master = await User.insertMasterInDb(masterName, game.id);
    gamesIO.emit('addGame', game);
    createGameSocket(game.id);
    setCookie(res, Role.master, game.id, master.id);
    res.send({id: game.id});
});
app.post('/api/game/join', async (req: Request, res: Response): Promise<void> => {
    const playerName = req.body.playerName;
    const gameId = Number.parseInt(req.body.gameId);
    const player = await User.insertPlayerInDb(playerName, gameId);
    await emitGameState(gameId);
    setCookie(res, Role.player, gameId, player.id);
    res.send({id: gameId});
});
app.post('/api/game/select-question', async (req: Request, res: Response): Promise<void> => {
    const {gameId} = getCookie(req);
    const categoryId: number = Number.parseInt(req.body.categoryId);
    const questionId: number = Number.parseInt(req.body.questionId);
    await Game.selectQuestion(categoryId, questionId, gameId);
    await emitGameState(gameId);
    res.sendStatus(200);
});
app.post('/api/game/select-player', async (req: Request, res: Response): Promise<void> => {
    const {gameId, userId} = getCookie(req);
    await User.selectPlayer(userId);
    await emitGameState(gameId);
    res.sendStatus(200);
});
app.post('/api/game/set-answer', async (req: Request, res: Response): Promise<void> => {
    const {userId, gameId} = getCookie(req);
    const answer: string = req.body.answer;
    await User.setAnswer(answer, userId);
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

