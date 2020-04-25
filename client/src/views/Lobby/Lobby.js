import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import io from "socket.io-client";

import {GET, POST} from "../../utils";
import GamesList from "./components/GamesList/GamesList";
import GameDetails from "./components/GameDetails/GameDetails";
import CreateGameForm from "./components/CreateGameForm/CreateGameForm";
import './style.css';

const Lobby = () => {
    const history = useHistory();
    const [games, setGames] = useState([]);
    const [selectedGame, selectGame] = useState(null);
    useEffect(() => {
        const socket = io('http://localhost:8080/api/games', {transports: ['websocket']});
        getGames();
        socket.on('addGame', game => {
            setGames([...games, game])
        });
        return () => socket.close();
    }, [])
    const getGames = async () => {
        const {data} = await GET('/api/games');
        setGames(data);
    }
    const createGame = async e => {
        e.preventDefault();
        const gameTitle = e.target["game_title"].value;
        const masterName = e.target["master_name"].value;
        const {data: game} = await POST('/api/game/create', {masterName, gameTitle});
        history.push(`/game/${game.id}`);
    };
    const joinGame = async e => {
        e.preventDefault();
        const playerName = e.target["player_name"].value;
        const {data: game} = await POST(`/api/game/${selectedGame.id}/join`, {playerName});
        history.push(`/game/${game.id}`);
    }
    return (
        <div className="lobby">
            <GamesList games={games}
                       selectedGame={selectedGame}
                       selectGame={selectGame}/>
            {selectedGame ?
                <GameDetails gameTitle={selectedGame.title}
                             joinGame={joinGame}/> :
                <CreateGameForm createGame={createGame}/>
            }
        </div>
    );
};

export default Lobby;