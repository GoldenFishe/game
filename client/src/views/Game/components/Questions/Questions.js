import React, {Fragment, memo} from 'react';

import './style.css';

const Questions = ({categories, onSelectQuestion}) => {
    return (
        <div className="game-categories">
            {categories.map(category => {
                return (
                    <div className="game-category" key={category.id}>
                        <Fragment>
                            <div className="game-category__title">{category.title}</div>
                            {category.questions.map(question => {
                                return (
                                    <div className="game-question"
                                         onClick={() => !question.answered && onSelectQuestion(category.id, question.id)}
                                         key={question.id}>
                                        {!question.answered && question.cost}
                                    </div>
                                )
                            })}
                        </Fragment>
                    </div>
                )
            })}
        </div>
    );
};

export default memo(Questions);