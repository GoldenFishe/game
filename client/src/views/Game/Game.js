import React, {useEffect, useState, memo, Fragment} from 'react';
import {useParams} from 'react-router-dom';
import io from "socket.io-client";

import {GET, POST} from "../../utils";
import {Roles} from "./Constants";
import Question from "./components/Question/Question";
import Questions from "./components/Questions/Questions";
import Player from "./components/Player/Player";
import Master from "./components/Master/Master";
import './style.css';

const Game = () => {
    const {id} = useParams();
    const [game, setGameState] = useState(null);
    const [answer, setAnswer] = useState('');
    useEffect(() => {
        const socket = io(`http://localhost:8080/api/game/${id}`, {transports: ['websocket']});
        socket.on('connect', () => {
        });
        socket.on('getState', state => {
            setGameState(state);
        });
        getGame();
        return () => socket.close();
    }, []);
    const selectPlayer = async playerId => {
        const {data} = await POST(`/api/game/${id}/select-player`, {playerId});
        setGameState(data);
    }
    const selectQuestion = async (categoryId, questionId) => {
        const {data} = await POST(`/api/game/${id}/select-question`, {categoryId, questionId});
        setGameState(data);
    }
    const sendAnswer = async () => {
        const {data} = await POST(`/api/game/${id}/set-answer`, {answer});
        setAnswer('');
        setGameState(data);
    }
    const judge = async correct => {
        const {data} = await POST(`/api/game/${id}/judge`, {correct});
        setGameState(data);
    }
    const getGame = async () => {
        const {data} = await GET(`/api/game/${id}`);
        setGameState(data);
    }
    return (
        <div className="game">
            {game && (
                <Fragment>
                    {game.selectedQuestion ?
                        <Question question={game.selectedQuestion}/> :
                        <Questions categories={game.categories}
                                   onSelectQuestion={selectQuestion}/>}
                    <div className="game-players">
                        {game.players.map(player => {
                            const selected = game.selectedPlayer && game.selectedPlayer.id === player.id;
                            return (
                                <Player player={player}
                                        selected={selected}
                                        isPlayer={game.role === Roles.Player}
                                        onSelectPlayer={selectPlayer}
                                        key={player.id}/>
                            )
                        })}
                    </div>
                    <Master master={game.master}
                            isMaster={game.role === Roles.Master}
                            onJudge={judge}/>
                </Fragment>
            )}
        </div>
    );
};

export default memo(Game);
