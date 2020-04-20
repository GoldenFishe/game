import React, {Fragment, useEffect, useState} from 'react';
import io from "socket.io-client";

import {POST} from "../../utils";
import './style.css';

const Game = () => {
    const [game, setGameState] = useState(null);
    const [answer, setAnswer] = useState('');
    const createGame = async masterName => {
        const {data} = await POST('/game/create', {masterName});
        setGameState(data);
    }
    const joinGame = async playerName => {
        const {data} = await POST(`/game/${game.id}/join`, {playerName});
        setGameState(data)
    }
    const selectPlayer = async playerId => {
        const {data} = await POST(`/game/${game.id}/select-player`, {playerId});
        setGameState(data);
    }
    const selectQuestion = async (categoryId, questionId) => {
        const {data} = await POST(`/game/${game.id}/select-question`, {categoryId, questionId});
        setGameState(data);
    }
    const sendAnswer = async () => {
        const {data} = await POST(`/game/${game.id}/set-answer`, {answer});
        setAnswer('');
        setGameState(data);
    }
    const judge = async correct => {
        const {data} = await POST(`/game/${game.id}/judge`, {correct});
        setGameState(data);
    }

    useEffect(() => {
        const socket = io('http://localhost:8080/game/0', {transports: ['websocket']});
        socket.on('connect', function () {
        });
        socket.on('getState', state => {
            console.log(state);
            setGameState(state);
        });
        return () => socket.close();
    }, [])
    const rout = () => {
        if (game && game.selectedQuestion) {
            return (
                <div className="game-question__question">
                    {game.selectedQuestion.text}
                </div>
            )
        } else {
            return (
                <div className="game-categories">
                    {game && game.categories.map(category => {
                        return (
                            <div className="game-category" key={category.id}>
                                <Fragment>
                                    <div className="game-category__title">{category.title}</div>
                                    {category.questions.map(question => {
                                        return (
                                            <div className="game-question"
                                                 onClick={() => !question.answered && selectQuestion(category.id, question.id)}
                                                 key={question.id}>
                                                {!question.answered && question.cost}
                                            </div>
                                        )
                                    })}
                                </Fragment>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }
    return (
        <div>
            <button onClick={() => createGame('master')}>Создать игру</button>
            <button onClick={() => joinGame('Anton')}>Присоединиться к игре</button>
            {rout()}
            <div className="game-players">
                {game && game.players.map(player => {
                    const selected = game.selectedPlayer && game.selectedPlayer.id === player.id;
                    const className = `game-player${selected ? ' game-player--selected' : ''}`;
                    return (
                        <div className={className}
                             onClick={() => selectPlayer(player.id)}
                             key={player.id}>
                            <div className="game-player__name">{player.name}</div>
                            <div className="game-player__points">{player.points}</div>
                            {(selected && game.selectedQuestion && game.answer) && <p>{player.answer}</p>}
                            {(selected && game.selectedQuestion && !player.answer) &&
                            <textarea onChange={e => setAnswer(e.target.value)}
                                      value={answer}/>}
                            {selected && <button onClick={sendAnswer}>Отправить ответ</button>}
                        </div>
                    )
                })}
            </div>
            {game && game.master && (
                <div className="game-master">
                    <div className="game-master__name">
                        {game.master.name}
                    </div>
                    <button onClick={() => judge(true)}>Правильно</button>
                    <button onClick={() => judge(false)}>Неправильно</button>
                </div>
            )}
        </div>
    );
};

export default Game;
