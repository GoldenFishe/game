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
    const selectPlayer = async () => {
        POST(`/api/game/select-player`);
    }
    const selectQuestion = (categoryId, questionId) => {
        POST(`/api/game/select-question`, {categoryId, questionId});
    }
    const sendAnswer = async () => {
        await POST(`/api/game/set-answer`, {answer});
        setAnswer('');
    }
    const judge = async correct => {
        await POST(`/api/game/judge`, {correct})
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
                            const selected = game.selectedPlayerId === player.id;
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
