import React, {memo, useState} from 'react';

import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import './style.css';

const AddQuestion = ({onAddQuestion}) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [points, setPoints] = useState(100);
    const addQuestion = () => {
        onAddQuestion(question, answer, points);
        setQuestion('');
        setAnswer('');
        setPoints(100);
    }
    return (
        <div className="lobby-create-questions-form-add-question">
            <Input label="Вопрос"
                   value={question}
                   onChange={e => setQuestion(e.target.value)}/>
            <Input label="Ответ"
                   value={answer}
                   onChange={e => setAnswer(e.target.value)}/>
            <Input label="Очки"
                   value={points}
                   type="number"
                   onChange={e => setPoints(e.target.value)}/>
            <Button secondary
                    onClick={addQuestion}>
                Добавить вопрос
            </Button>
        </div>
    );
};

export default memo(AddQuestion);