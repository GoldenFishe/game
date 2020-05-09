import React, {memo} from 'react';

import './style.css';

const QuestionsDetails = ({selectedQuestions}) => {
    return (
        <div className="lobby-questions-details">
            <h3 className="h3">{selectedQuestions.questions.title}</h3>
            {selectedQuestions.questions.rounds.map((round, i) => {
                return (
                    <div className="lobby-questions-details-round" key={i}>
                        <h4 className="h4">Раунд {i + 1}</h4>
                        <div className="lobby-questions-details-categories">
                            {round.map(category => {
                                return (
                                    <div className="lobby-questions-details-category" key={category.id}>
                                        <h5 className="h5">{category.title}</h5>
                                        {category.questions.map(question => <p key={question.id}>{question.text}</p>)}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default memo(QuestionsDetails);