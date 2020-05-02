import React, {memo} from 'react';

import Button from "../../../../components/Button/Button";
import Textarea from "../../../../components/Textarea/Textarea";
import './style.css';

const Player = ({player, visibleAnswerButton, visibleAnswerForm, selectedPlayer, answer, onSelectPlayer, onSetAnswer, onSendAnswer}) => {
    const className = `game-player${selectedPlayer ? ' game-player--selected' : ''}`;
    return (
        <div className={className}>
            <div className="game-player__name">{player.name}</div>
            <div className="game-player__points">{player.points}</div>
            {visibleAnswerButton && <Button onClick={onSelectPlayer}>Ответить</Button>}
            {player.answer && <p>{player.answer}</p>}
            {visibleAnswerForm &&
            <form>
                <Textarea onChange={e => onSetAnswer(e.target.value)}
                          value={answer}/>
                <Button type="submit"
                        onClick={onSendAnswer}>
                    Отправить ответ
                </Button>
            </form>}
        </div>
    );
};

export default memo(Player);