import React, {useEffect, useState, memo, Fragment} from 'react';
import {useParams} from 'react-router-dom';
import io from "socket.io-client";

import {GET, POST} from "../../utils";
import SelectedQuestion from "./components/SelectedQuestion/SelectedQuestion";
import Questions from "./components/Questions/Questions";
import Player from "./components/Player/Player";
import Master from "./components/Master/Master";
import './style.css';

const Game = () => {
    const {id} = useParams();
    const [game, setGameState] = useState(null);
    const [answer, setAnswer] = useState('');
    const [user, setUser] = useState({role: null, id: null});
    useEffect(() => {
        const socket = io(`http://localhost:8080/ws/game/${id}`, {transports: ['websocket']});
        socket.on('getState', state => {
            setGameState(state);
        });
        getGame();
        getUser();
        return () => socket.close();
    }, []);
    const selectPlayer = async () => {
        POST(`/api/game/select-player`);
    }
    const selectQuestion = (categoryId, questionId) => {
        if (user.id !== game.master.id) {
            POST(`/api/game/select-question`, {categoryId, questionId});
        }
    }
    const sendAnswer = async () => {
        await POST(`/api/game/set-message`, {answer});
        setAnswer('');
    }
    const judge = async correct => {
        await POST(`/api/game/judge`, {correct})
    }
    const getGame = async () => {
        const {data} = await GET(`/api/game/${id}`);
        setGameState(data);
    }
    const getUser = async () => {
        const {data} = await GET(`/api/user`);
        setUser(data);
    }
    return (
        <div className="game">
            {game && (
                <Fragment>
                    {game.selectedQuestion ?
                        <SelectedQuestion question={game.selectedQuestion}/> :
                        <Questions categories={game.categories}
                                   onSelectQuestion={selectQuestion}/>}
                    <div className="game-participants">
                        <Master master={game.master}
                                currentUser={user.id === game.master.id}
                                selectedQuestion={game.selectedQuestion}
                                visibleJudgeControls={game.players.some(player => player.message)}
                                onJudge={judge}/>
                        {game.players.map(player => {
                            const currentUser = user.id === player.id;
                            const selectedPlayer = game.selectedPlayerId === player.id;
                            const visibleAnswerButton = game.selectedQuestion && !game.selectedPlayerId && currentUser;
                            const visibleAnswerForm = selectedPlayer && currentUser && !player.answer;
                            return (
                                <Player player={player}
                                        visibleAnswerButton={visibleAnswerButton}
                                        visibleAnswerForm={visibleAnswerForm}
                                        selectedPlayer={selectedPlayer}
                                        answer={answer}
                                        onSelectPlayer={selectPlayer}
                                        onSetAnswer={setAnswer}
                                        onSendAnswer={sendAnswer}
                                        key={player.id}/>)
                        })}
                    </div>
                </Fragment>
            )}
        </div>
    );
};

export default memo(Game);
