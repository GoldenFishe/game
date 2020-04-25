"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const socket_io_1 = __importDefault(require("socket.io"));
const Role_1 = require("./enums/Role");
const Game_1 = __importDefault(require("./Game"));
const rawQuestions = __importStar(require("./questions.json"));
const PORT = process.env.PORT || 8080;
const app = express_1.default();
app.use(cookie_parser_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server, { cookie: true });
const games = [];
const gameIO = io.of('/api/game/0');
const gamesIO = io.of('/api/games');
gameIO.on('connection', (socket) => {
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/api/games', (req, res) => {
    res.send(games);
});
app.get('/api/game/:id', (req, res) => {
    const { role } = req.cookies;
    res.send(Object.assign({ role }, games[0].getState()));
});
app.post('/api/game/create', (req, res) => {
    const { masterName, gameTitle } = req.body;
    const game = new Game_1.default(masterName, gameTitle, rawQuestions);
    games.push(game);
    gamesIO.emit('addGame', game);
    const cookieOptions = { expires: new Date(Date.now() + 900000), httpOnly: true };
    res.cookie('role', Role_1.Role.Master, cookieOptions);
    res.cookie('name', masterName, cookieOptions);
    res.send(Object.assign({ role: Role_1.Role.Master }, games[0].getState()));
});
app.post('/api/game/:id/join', (req, res) => {
    const { playerName } = req.body;
    games[0].join(playerName);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(Object.assign({ role: Role_1.Role.Master }, games[0].getState()));
});
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