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
const Game_1 = __importDefault(require("./Game"));
const rawQuestions = __importStar(require("./questions.json"));
const app = express_1.default();
app.use(cookie_parser_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server, { cookie: true });
const games = [];
const gameIO = io.of('/game/0');
const gamesIO = io.of('/games');
gameIO.on('connection', (socket) => {
    console.log('connected socket!');
    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });
});
server.listen(8080, () => console.log('Example app listening on port 8080!'));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/games', (req, res) => {
    res.send(games);
});
app.post('/game/create', (req, res) => {
    const { masterName, gameTitle } = req.body;
    const game = new Game_1.default(masterName, gameTitle, rawQuestions);
    games.push(game);
    gamesIO.emit('addGame', game);
    res.cookie('role', 'master', { expires: new Date(Date.now() + 900000), httpOnly: true });
    res.send(games[0].getState());
});
app.post('/game/:id/join', (req, res) => {
    const playerName = req.body.playerName;
    games[0].join(playerName);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
});
app.post('/game/:id/select-player', (req, res) => {
    const playerId = req.body.playerId;
    games[0].selectPlayer(playerId);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
});
app.post('/game/:id/set-answer', (req, res) => {
    const answer = req.body.answer;
    games[0].setAnswer(answer);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
});
app.post('/game/:id/judge', (req, res) => {
    const correct = req.body.correct;
    games[0].judgeAnswer(correct);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
});
app.post('/game/:id/select-question', (req, res) => {
    const categoryId = req.body.categoryId;
    const questionId = req.body.questionId;
    games[0].selectQuestion(categoryId, questionId);
    const gameState = games[0].getState();
    gameIO.emit('getState', gameState);
    res.send(gameState);
});
//# sourceMappingURL=index.js.map