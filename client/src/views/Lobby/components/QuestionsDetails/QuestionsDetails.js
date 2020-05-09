import React, {memo} from 'react';

import Expanded from "../../../../components/Expanded/Expanded";
import './style.css';

const QuestionsDetails = ({selectedQuestions}) => {
    return (
        <div className="lobby-questions-details">
            <h3 className="h3">{selectedQuestions.questions.title}</h3>
            <div className="lobby-questions-details-rounds">
                {selectedQuestions.questions.rounds.map((round, i) => {
                    return (
                        <div className="lobby-questions-details-round" key={i}>
                            <h4 className="h4">Раунд {i + 1}</h4>
                            <div className="lobby-questions-details-categories">
                                {round.map(category => {
                                    return <Expanded label={category.title} key={category.id}>
                                        {category.questions.map(question => (
                                            <div className="lobby-questions-details-question"
                                                 key={question.id}>
                                                <p className="lobby-questions-details-question__text">{question.text}</p>
                                                <p className="lobby-questions-details-question__points">{question.cost}</p>
                                            </div>
                                        ))}
                                    </Expanded>
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default memo(QuestionsDetails);