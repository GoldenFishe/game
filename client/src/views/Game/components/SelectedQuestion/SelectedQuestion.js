import React, {memo} from 'react';

import './style.css';

const SelectedQuestion = ({question}) => {
    return (
        <div className="game-selected-question">
            {question.text}
        </div>
    );
};

export default memo(SelectedQuestion);