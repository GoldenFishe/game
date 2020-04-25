import React, {Fragment, memo} from 'react';

import './style.css';

const Master = ({master, isMaster, onJudge}) => {
    return (
        <div className="game-master">
            <div className="game-master__name">{master.name}</div>
            {isMaster &&
            <Fragment>
                <button onClick={() => onJudge(true)}>Правильно</button>
                <button onClick={() => onJudge(false)}>Неправильно</button>
            </Fragment>}
        </div>
    );
};

export default memo(Master);