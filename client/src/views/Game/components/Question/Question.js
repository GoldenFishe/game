import React, {memo} from 'react';

import './style.css';

const Question = ({question}) => {
    return (
        <div className="game-question">
            {question.text}
        </div>
    );
};

export default memo(Question);