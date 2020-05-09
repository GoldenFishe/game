import React, {memo, useState} from 'react';

import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import './style.css';

const AddCategory = ({onAddCategory}) => {
    const [title, setTitle] = useState('');
    const addCategory = () => {
        onAddCategory(title);
        setTitle('');
    };
    return (
        <div className="lobby-create-questions-form-add-category">
            <Input label="Название категории"
                   value={title}
                   onChange={e => setTitle(e.target.value)}/>
            <Button secondary
                    onClick={addCategory}>
                Добавить категорию
            </Button>
        </div>
    );
};

export default memo(AddCategory);