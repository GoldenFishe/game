import React, {memo} from 'react';

import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import './style.css';

const CreateGameForm = ({createGame}) => {
    return (
        <form onSubmit={createGame}
              className="lobby-create-game-form">
            <h3 className="h3">Создать игру</h3>
            <label htmlFor="game_title">Название игры</label>
            <Input type="text" id="game_title" name="game_title"/>
            <label htmlFor="master_name">Имя ведущего</label>
            <Input type="text" id="master_name" name="master_name"/>
            <Button type="submit">Создать игру</Button>
        </form>
    );
};

export default memo(CreateGameForm);