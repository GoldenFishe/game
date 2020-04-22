import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import io from "socket.io-client";

import {GET, POST} from "../../utils";
import './style.css';

const Lobby = () => {
    const [games, setGames] = useState([]);
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
        console.log(data);
    }
    const createGame = async e => {
        e.preventDefault();
        const gameTitle = e.target["game_title"].value;
        const masterName = e.target["master_name"].value;
        const {data} = await POST('/game/create', {masterName, gameTitle});
    };
    return (
        <div className="lobby">
            <ul className="lobby-games-list">
                {games.map(game => {
                    return (
                        <li key={game.id}>
                            <Link to={`/game/${game.id}`}>{game.title}</Link>
                        </li>
                    )
                })}
            </ul>
            <form onSubmit={createGame}
                  className="lobby-create-game-form">
                <h3>Создать игру</h3>
                <label htmlFor="game_title">Название игры</label>
                <input type="text" id="game_title" name="game_title"/>
                <label htmlFor="master_name">Имя ведущего</label>
                <input type="text" id="master_name" name="master_name"/>
                <button type="submit">Создать игру</button>
            </form>
        </div>
    );
};

export default Lobby;