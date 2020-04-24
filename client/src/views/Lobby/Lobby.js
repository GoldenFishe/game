import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import io from "socket.io-client";

import {GET, POST} from "../../utils";
import './style.css';

const Lobby = () => {
    const history = useHistory();
    const [games, setGames] = useState([]);
    const [selectedGame, selectGame] = useState(null);
    useEffect(() => {
        getGames();
        const socket = io('http://localhost:8080/games', {transports: ['websocket']});
        socket.on('addGame', game => {
            setGames([...games, game])
        });
        return () => socket.close();
    }, [])
    const getGames = async () => {
        const {data} = await GET('/games');
        setGames(data);
    }
    const createGame = async e => {
        e.preventDefault();
        const gameTitle = e.target["game_title"].value;
        const masterName = e.target["master_name"].value;
        const {data: game} = await POST('/game/create', {masterName, gameTitle});
        history.push(`/game/${game.id}`);
    };
    const joinGame = async e => {
        e.preventDefault();
        const playerName = e.target["player_name"].value;
        const {data: game} = await POST(`/game/${selectedGame.id}/join`, {playerName});
        history.push(`/game/${game.id}`);
    }
    return (
        <div className="lobby">
            <ul className="lobby-games-list">
                {games.map(game => {
                    return (
                        <li key={game.id} onClick={() => selectGame(game)}>{game.title}</li>
                    )
                })}
            </ul>
            {selectedGame ?
                <form onSubmit={joinGame} className="lobby-create-game-form">
                    <h3>{selectedGame.title}</h3>
                    <label htmlFor="player_name">Имя игрока</label>
                    <input type="text" id="player_name" name="player_name"/>
                    <button type="submit">Присоединиться</button>
                </form> :
                <form onSubmit={createGame} className="lobby-create-game-form">
                    <h3>Создать игру</h3>
                    <label htmlFor="game_title">Название игры</label>
                    <input type="text" id="game_title" name="game_title"/>
                    <label htmlFor="master_name">Имя ведущего</label>
                    <input type="text" id="master_name" name="master_name"/>
                    <button type="submit">Создать игру</button>
                </form>
            }
        </div>
    );
};

export default Lobby;