import React, {memo, useState} from 'react';

import './style.css';
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";

const AddCategory = ({onAddCategory}) => {
    const [title, setTitle] = useState('');
    return (
        <div>
            <Input value={title} onChange={e => setTitle(e.target.value)}/>
            <Button onClick={() => onAddCategory(title)}>Добавить категорию</Button>
        </div>
    );
};

export default memo(AddCategory);