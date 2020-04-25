import React, {memo} from 'react';

import './style.css';

const GamesList = ({games, selectedGame, selectGame}) => {
    return (
        <ul className="lobby-games-list">
            {games.map(game => {
                const selectedGameClassName = `${selectedGame && selectedGame.id === game.id ? 'lobby-games-list__item--selected' : ''}`;
                return (
                    <li key={game.id}
                        className={`lobby-games-list__item ${selectedGameClassName}`}
                        onClick={() => selectGame(game)}>
                        {game.title}
                    </li>
                )
            })}
        </ul>
    );
};

export default memo(GamesList);