import React, {memo} from 'react';

import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import './style.css';

const CreateGameForm = ({createGame}) => {
    return (
        <form onSubmit={createGame}
              className="lobby-create-game-form">
            <h3 className="h3">Новая игра</h3>
            <Input label="Название игры" name="game_title"/>
            <Input label="Имя ведущего" name="master_name"/>
            <Button type="submit" primary>Создать игру</Button>
        </form>
    );
};

export default memo(CreateGameForm);