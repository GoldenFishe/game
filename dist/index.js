"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const socket_io_1 = __importDefault(require("socket.io"));
const Role_1 = require("./enums/Role");
const Game_1 = __importDefault(require("./Game"));
const Master_1 = __importDefault(require("./Master"));
const Questions_1 = __importDefault(require("./Questions"));
const Player_1 = __importDefault(require("./Player"));
const PORT = Number.parseInt(process.env.PORT) || 8080;
const gamesSockets = new Map();
const app = express_1.default();
app.use(cookie_parser_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server, { cookie: true });
const gamesIO = io.of('/api/games');
const setCookie = (res, role, gameId, userId) => {
    const cookieOptions = { expires: new Date(Date.now() + 900000), httpOnly: true };
    res.cookie('role', role, cookieOptions);
    res.cookie('gameId', gameId, cookieOptions);
    res.cookie('userId', userId, cookieOptions);
};
const createGameSocket = (gameId) => {
    const gameSocket = io.of(`/api/game/${gameId}`);
    gamesSockets.set(gameId, gameSocket);
};
const emitGameState = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const gameState = yield Game_1.default.getState(gameId);
    const gameSocket = gamesSockets.get(gameId);
    gameSocket.emit('getState', gameState);
});
app.get('/api/games', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield Game_1.default.getAllGamesFromDb();
    res.send(games);
}));
app.get('/api/game/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number.parseInt(req.cookies.userId);
    const gameId = Number.parseInt(req.params.id);
    const gameState = yield Game_1.default.getState(gameId);
    res.send(gameState);
}));
app.post('/api/game/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { masterName, gameTitle } = req.body;
    const questions = yield Questions_1.default.getQuestionsFromDb(1);
    const game = yield Game_1.default.insertInDb(gameTitle, questions);
    const master = yield Master_1.default.insertInDb(masterName, game.id);
    gamesIO.emit('addGame', game);
    createGameSocket(game.id);
    setCookie(res, Role_1.Role.master, game.id, master.id);
    res.send({ id: game.id });
}));
app.post('/api/game/join', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const playerName = req.body.playerName;
    const gameId = Number.parseInt(req.body.gameId);
    const player = yield Player_1.default.insertInDb(playerName, gameId);
    const game = yield Game_1.default.join(player.id, gameId);
    yield emitGameState(gameId);
    setCookie(res, Role_1.Role.player, game.id, player.id);
    res.send({ id: game.id });
}));
app.post('/api/game/:id/select-player', (req, res) => {
    const playerId = req.body.playerId;
    games[0].selectPlayer(playerId);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
});
app.post('/api/game/:id/set-answer', (req, res) => {
    const answer = req.body.answer;
    games[0].setAnswer(answer);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
});
app.post('/api/game/:id/judge', (req, res) => {
    const correct = req.body.correct;
    games[0].judgeAnswer(correct);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
});
app.post('/api/game/:id/select-question', (req, res) => {
    const categoryId = req.body.categoryId;
    const questionId = req.body.questionId;
    games[0].selectQuestion(categoryId, questionId);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
});
server.listen(8080, () => console.log(`Server is listening port ${PORT}`));
//# sourceMappingURL=index.js.map