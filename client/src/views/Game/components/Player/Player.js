import React, {memo} from 'react';

import Button from "../../../../components/Button/Button";
import Textarea from "../../../../components/Textarea/Textarea";
import './style.css';

const Player = ({player, visibleAnswerButton, visibleAnswerForm, selectedPlayer, answer, onSelectPlayer, onSetAnswer, onSendAnswer}) => {
    const className = `game-player${selectedPlayer ? ' game-player--selected' : ''}`;
    return (
        <div className={className}>
            {player.answer && <p className="game-player__answer">{player.answer}</p>}
            <div className="game-player-info">
                <div className="game-player__name">{player.name}</div>
                <div className="game-player__points">{player.points}</div>
            </div>
            {visibleAnswerButton &&
            <Button primary
                    onClick={onSelectPlayer}>
                Ответить
            </Button>}
            {visibleAnswerForm &&
            <form className="game-player-answer-form"
                  onSubmit={e => {
                      e.preventDefault();
                      onSendAnswer();
                  }}>
                <Textarea autofocus
                          onChange={e => onSetAnswer(e.target.value)}
                          value={answer}/>
                <Button primary
                        type="submit">Отправить ответ</Button>
            </form>}
        </div>
    );
};

export default memo(Player);