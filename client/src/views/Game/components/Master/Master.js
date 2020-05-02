import React, {Fragment, memo} from 'react';

import Button from "../../../../components/Button/Button";
import './style.css';

const Master = ({master, currentUser, visibleJudgeControls, onJudge}) => {
    return (
        <div className="game-master">
            <div className="game-master__name">{master.name}</div>
            {(currentUser && visibleJudgeControls) &&
            <Fragment>
                <Button onClick={() => onJudge(true)}>Правильно</Button>
                <Button onClick={() => onJudge(false)}>Неправильно</Button>
            </Fragment>}
        </div>
    );
};

export default memo(Master);