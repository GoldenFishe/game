import express, {Express, Request, Response} from "express";
import http from "http";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import socket, {Server, Socket} from "socket.io";

import {IGame} from "./interfaces/IGame";
import {Role} from "./enums/Role";
import Game from "./Game";
import Master from "./Master";
import Questions from "./Questions";

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

app.get('/api/games', async (req: Request, res: Response): Promise<void> => {
    const games = await Game.getAllGamesFromDb();
    res.send(games);
});

app.get('/api/game/:id', async (req: Request, res: Response): Promise<void> => {
    const game = await Game.getGameFromDb(Number.parseInt(req.params.id));
    res.send(game);
});

app.post('/api/game/create', async (req: Request, res: Response): Promise<void> => {
    const {masterName, gameTitle}: { masterName: string, gameTitle: string } = req.body;
    const questions = await Questions.getQuestionsFromDb(1);
    const game = await Game.insertInDb(gameTitle, questions);
    const master = await Master.insertInDb(masterName, game.id);
    const masterModel = new Master(master.id, master.name);
    const questionsModel = new Questions(questions);
    const gameModel = new Game(game.id, game.title, [], masterModel, null, questionsModel, 0, null, null);
    const gameState = gameModel.getState();
    gamesIO.emit('addGame', gameState);
    const cookieOptions = {expires: new Date(Date.now() + 900000), httpOnly: true};
    res.cookie('role', Role.master, cookieOptions);
    res.cookie('name', master.name, cookieOptions);
    res.send({role: Role.master, gameState});
})

app.post('/api/game/:id/join', (req: Request, res: Response): void => {
    const {playerName}: { playerName: string } = req.body;
    games[0].join(playerName);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send({role: Role.master, ...games[0].getState()});
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

