import React, {memo} from 'react';

import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import './style.css';

const GameDetails = ({selectedGame, joinGame}) => {
    return (
        <form onSubmit={joinGame}
              className="lobby-game-details">
            <h3 className="h3">{selectedGame.title}</h3>
            <div className="lobby-game-details-field">
                <p className="lobby-game-details-field__label">
                    Организатор
                </p>
                <p className="lobby-game-details-field__value">

                </p>
            </div>
            <div className="lobby-game-details-field">
                <p className="lobby-game-details-field__label">
                    Статус
                </p>
                <p className="lobby-game-details-field__value">

                </p>
            </div>
            <div className="lobby-game-details-field">
                <p className="lobby-game-details-field__label">
                    Игроки
                </p>
                <p className="lobby-game-details-field__value">

                </p>
            </div>
            <div className="lobby-game-details-field">
                <p className="lobby-game-details-field__label">
                    Пакет вопросов
                </p>
                <p className="lobby-game-details-field__value">
                    {selectedGame.questions.title}
                </p>
            </div>
            <Input label="Имя игрока"
                   name="player_name"/>
            <Button type="submit"
                    primary>
                Присоединиться
            </Button>
        </form>
    );
};

export default memo(GameDetails);