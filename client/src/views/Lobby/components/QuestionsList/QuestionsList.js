import React, {memo} from 'react';

import './style.css';

const QuestionsList = ({questions, selectedQuestion, selectQuestion}) => {
    return (
        <div className="lobby-questions">
            <h3 className="h3">Вопросы</h3>
            <ul className="lobby-questions-list">
                {questions.map(question => {
                    const selectedQuestionClassName = `${selectedQuestion && selectedQuestion.id === question.id ? 'lobby-questions-list__item--selected' : ''}`;
                    return (
                        <li key={question.id}
                            className={`lobby-questions-list__item ${selectedQuestionClassName}`}
                            onClick={() => selectQuestion(question)}>
                            {question.questions.title}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

export default memo(QuestionsList);