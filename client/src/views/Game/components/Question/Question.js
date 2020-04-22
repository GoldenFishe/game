import React, {memo} from 'react';

import './style.css';

const Question = ({selectedQuestion}) => {
    return (
        <div className="game-question">
            {selectedQuestion.text}
        </div>
    );
};

export default memo(Question);