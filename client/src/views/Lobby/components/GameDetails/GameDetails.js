import React, {memo} from 'react';

import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import './style.css';

const GameDetails = ({selectedGame, joinGame}) => {
    return (
        <form onSubmit={joinGame}
              className="lobby-create-game-form">
            <h3 className="h3">{selectedGame.title}</h3>
            <label htmlFor="master_name">Организатор</label>
            <Input type="text"
                   id="master_name"
                   name="master_name"
                   value={selectedGame.master.name}
                   readOnly/>
            <label htmlFor="status">Статус</label>
            <Input type="text"
                   id="status"
                   name="status"
                   value="Не реализованно"
                   readOnly/>
            <label htmlFor="players_names">Игроки</label>
            <Input type="text"
                   id="players_names"
                   name="players_names"
                   value={selectedGame.players.map(player => player.name).join(', ')}
                   readOnly/>
            <label htmlFor="questions_title">Пакет вопросов</label>
            <Input type="text"
                   id="questions_title"
                   name="questions_title"
                   value={selectedGame.questions.title}
                   readOnly/>
            <label htmlFor="player_name">Имя игрока</label>
            <Input type="text"
                   id="player_name"
                   name="player_name"/>
            <Button type="submit">Присоединиться</Button>
        </form>
    );
};

export default memo(GameDetails);