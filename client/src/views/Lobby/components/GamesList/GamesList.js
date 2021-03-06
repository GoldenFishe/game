import React, {memo} from 'react';

import Button from "../../../../components/Button/Button";
import './style.css';

const GamesList = ({games, selectedGame, selectGame}) => {
    return (
        <div className="lobby-games">
            <h3 className="h3">Игры</h3>
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
            <Button primary
                    onClick={() => selectGame(null)}>
                Новая игра
            </Button>
        </div>
    );
};

export default memo(GamesList);