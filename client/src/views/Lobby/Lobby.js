import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import io from "socket.io-client";

import {GET, POST} from "../../utils";
import GamesList from "./components/GamesList/GamesList";
import GameDetails from "./components/GameDetails/GameDetails";
import CreateGameForm from "./components/CreateGameForm/CreateGameForm";
import QuestionsList from "./components/QuestionsList/QuestionsList";
import CreateQuestionsForm from "./components/CreateQuestionsForm/CreateQuestionsForm";
import QuestionsDetails from "./components/QuestionsDetails/QuestionsDetails";
import './style.css';

const gamesSocket = io('http://localhost:8080/ws/games', {transports: ['websocket']});
const questionsSocket = io('http://localhost:8080/ws/questions', {transports: ['websocket']});

const Lobby = () => {
    const history = useHistory();
    const [games, setGames] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedGame, selectGame] = useState(null);
    const [selectedQuestion, selectQuestion] = useState(null);
    useEffect(() => {
        getGames();
        getQuestions();
        gamesSocket.on('addGame', game => {
            setGames(g => [...g, game])
        });
        gamesSocket.on('deleteGame', id => {
            setGames(g => g.filter(game => game.id === id));
        })
        questionsSocket.on('addQuestions', questions => {
            setQuestions(q => [...q, questions])
        })
        return () => {
            gamesSocket.close();
            questionsSocket.close();
        }
    }, []);
    const getGames = async () => {
        const {data} = await GET('/api/games');
        setGames(data);
    }
    const getQuestions = async () => {
        const {data} = await GET('/api/questions');
        setQuestions(data);
    }
    const createGame = async e => {
        e.preventDefault();
        const gameTitle = e.target["game_title"].value;
        const masterName = e.target["master_name"].value;
        const {data: game} = await POST('/api/game/create', {masterName, gameTitle});
        history.push(`/game/${game.id}`);
    };
    const createQuestions = async (title, rounds) => {
        const {data} = await POST('/api/questions', {title, rounds});
        selectQuestion(data);
    };
    const joinGame = async e => {
        e.preventDefault();
        const playerName = e.target["player_name"].value;
        const gameId = selectedGame.id;
        const {data: game} = await POST(`/api/game/join`, {playerName, gameId});
        history.push(`/game/${game.id}`);
    }
    return (
        <div className="lobby">
            <GamesList games={games}
                       selectedGame={selectedGame}
                       selectGame={selectGame}/>
            {selectedGame ?
                <GameDetails selectedGame={selectedGame}
                             joinGame={joinGame}/> :
                <CreateGameForm createGame={createGame}/>
            }
            {selectedQuestion ?
                <QuestionsDetails selectedQuestions={selectedQuestion}/> :
                <CreateQuestionsForm createQuestions={createQuestions}/>}
            <QuestionsList questions={questions}
                           selectedQuestion={selectedQuestion}
                           selectQuestion={selectQuestion}/>
        </div>
    );
};

export default Lobby;