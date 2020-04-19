const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const Game = require('./Game');
const rawQuestions = require('./questions.json');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let game;

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/game/create', (req, res) => {
    const masterName = req.body.masterName;
    game = new Game(masterName, rawQuestions);
    res.send(game.getState());
})

app.post('/game/:id/join', (req, res) => {
    game.join(req.body.playerName);
    res.send(game.getState())
})

app.post('/game/:id/select-player', (req, res) => {
    const {playerId} = req.body;
    game.selectPlayer(playerId)
    res.send(game.getState());
})

app.post('/game/:id/set-answer', (req, res) => {
    const {answer} = req.body;
    game.setAnswer(answer)
    res.send(game.getState());
})

app.post('/game/:id/judge', (req, res) => {
    const {correct} = req.body;
    game.judgeAnswer(correct)
    res.send(game.getState());
})

app.post('/game/:id/select-question', (req, res) => {
    const {categoryId, questionId} = req.body;
    game.selectQuestion(categoryId, questionId)
    res.send(game.getState());
})

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});



