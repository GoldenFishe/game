import React, {memo, useState} from 'react';

import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import './style.css';

const AddQuestion = ({onAddQuestion}) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [points, setPoints] = useState(0);
    return (
        <div>
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
            <Button onClick={() => onAddQuestion(question, answer, points)}>Добавить вопрос</Button>
        </div>
    );
};

export default memo(AddQuestion);