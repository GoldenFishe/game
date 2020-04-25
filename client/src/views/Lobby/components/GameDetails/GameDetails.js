import React, {memo} from 'react';

import './style.css';

const GameDetails = ({gameTitle, joinGame}) => {
    return (
        <form onSubmit={joinGame} className="lobby-create-game-form">
            <h3>{gameTitle}</h3>
            <label htmlFor="player_name">Имя игрока</label>
            <input type="text" id="player_name" name="player_name"/>
            <button type="submit">Присоединиться</button>
        </form>
    );
};

export default memo(GameDetails);