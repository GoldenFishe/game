import React, {memo} from 'react';

import './style.css';

const Input = ({label, type, value, name, required, id, readOnly, onChange}) => {
    return (
        <label className="input">
            {label}
            <input type={type}
                   value={value}
                   name={name}
                   id={id}
                   required={required}
                   onChange={onChange}
                   readOnly={readOnly}
                   className="input__input"/>
        </label>
    );
};

Input.defaultProps = {
    type: 'text'
}

export default memo(Input);