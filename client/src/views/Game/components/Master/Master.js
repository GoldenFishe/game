import React, {memo} from 'react';

import './style.css';

const Master = ({master, onJudge}) => {
    return (
        <div className="game-master">
            <div className="game-master__name">{master.name}</div>
            <button onClick={() => onJudge(true)}>Правильно</button>
            <button onClick={() => onJudge(false)}>Неправильно</button>
        </div>
    );
};

export default memo(Master);