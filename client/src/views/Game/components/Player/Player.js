import React, {memo} from 'react';

import './style.css';

const Player = ({player, selected, onSelectPlayer}) => {
    const className = `game-player${selected ? ' game-player--selected' : ''}`;
    return (
        <div className={className}
             onClick={() => onSelectPlayer(player.id)}>
            <div className="game-player__name">{player.name}</div>
            <div className="game-player__points">{player.points}</div>
            {/*{(selected && selectedQuestion && game.answer) && <p>{player.answer}</p>}*/}
            {/*{(selected && selectedQuestion && !player.answer) &&*/}
            {/*<textarea onChange={e => setAnswer(e.target.value)}*/}
            {/*          value={answer}/>}*/}
            {/*{selected && <button onClick={sendAnswer}>Отправить ответ</button>}*/}
        </div>
    );
};

export default memo(Player);