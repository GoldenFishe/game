import React, {memo} from 'react';

import Button from "../../../../components/Button/Button";
import './style.css';

const Master = ({master, currentUser, selectedQuestion, visibleJudgeControls, onJudge}) => {
    return (
        <div className="game-master">
            <div className="game-master-info">
                <div className="game-master__name">{master.name}</div>
                <div className="game-master__answer">
                    {currentUser && selectedQuestion ? selectedQuestion.answer : ''}
                </div>
            </div>

            {(currentUser && visibleJudgeControls) &&
            <div className="game-master-controls">
                <Button primary
                        onClick={() => onJudge(true)}>
                    Правильно
                </Button>
                <Button primary
                        onClick={() => onJudge(false)}>
                    Неправильно
                </Button>
            </div>}
        </div>
    );
};

export default memo(Master);