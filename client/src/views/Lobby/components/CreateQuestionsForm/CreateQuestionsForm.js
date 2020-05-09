import React, {memo, useState} from 'react';

import Input from "../../../../components/Input/Input";
import AddQuestion from "../AddQuestion/AddQuestion";
import Button from "../../../../components/Button/Button";
import AddCategory from "../AddCategory/AddCategory";
import Expanded from "../../../../components/Expanded/Expanded";
import './style.css';

const CreateQuestionsForm = ({createQuestions}) => {
    const [title, setTitle] = useState('');
    const [rounds, modifyRounds] = useState([[]]);
    const addEmptyRound = () => modifyRounds([...rounds, []]);
    const addCategory = (roundIndex, title) => {
        const modifiedRound = [...rounds];
        modifiedRound[roundIndex].push({
            id: modifiedRound[roundIndex].length,
            title: title,
            questions: []
        });
        modifyRounds(modifiedRound);
    };
    const addQuestion = (roundIndex, categoryId, question, answer, points) => {
        const modifiedRound = [...rounds];
        const modifiedCategory = modifiedRound[roundIndex].find(category => category.id === categoryId);
        modifiedCategory.questions.push({
            id: modifiedCategory.questions.length,
            cost: points,
            text: question,
            answer: answer
        })
        modifyRounds(modifiedRound);
    };
    const saveQuestionsPack = e => {
        e.preventDefault();
        createQuestions(title, rounds);
    };
    return (
        <div className="lobby-create-questions-form">
            <h3 className="h3">Создать пак вопросов</h3>
            <form className="lobby-create-questions-form__form"
                  onSubmit={saveQuestionsPack}>
                <Input label="Название пакета"
                       onChange={e => setTitle(e.target.value)}
                       value={title}/>
                {rounds.map((round, roundIndex) => {
                    return (
                        <div className="lobby-create-questions-form__round"
                             key={roundIndex}>
                            <h4 className="h4">Раунд {roundIndex + 1}</h4>
                            {round.map(category => (
                                <Expanded label={category.title}
                                          defaultExpand={true}
                                          key={category.id}>
                                    {category.questions.map((question) => (
                                        <div className="lobby-questions-details-question">
                                            <p className="lobby-questions-details-question__text">{question.text}</p>
                                            <p className="lobby-questions-details-question__points">{question.cost}</p>
                                        </div>
                                    ))}
                                    <AddQuestion key={category.id}
                                                 onAddQuestion={(question, answer, points) => addQuestion(roundIndex, category.id, question, answer, points)}/>
                                </Expanded>
                            ))}
                            <AddCategory onAddCategory={title => addCategory(roundIndex, title)}/>
                        </div>
                    )
                })}
                <Button onClick={addEmptyRound}>Добавить раунд</Button>
                <Button type="submit">Сохранить</Button>
            </form>
        </div>
    );
};

export default memo(CreateQuestionsForm);