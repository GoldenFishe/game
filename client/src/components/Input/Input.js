import React, {memo} from 'react';
import {bool, func, number, oneOfType, string} from "prop-types";

import './style.css';

const Input = ({label, type, value, name, required, id, readOnly, onChange}) => {
    return (
        <label className="input">
            {label}
            <input type={type}
                   value={value}
                   name={name}
                   title={label}
                   id={id}
                   required={required}
                   onChange={onChange}
                   readOnly={readOnly}
                   className="input__input"/>
        </label>
    );
};

Input.defaultProps = {
    type: 'text',
    value: ''
}

Input.propTypes = {
    label: string.isRequired,
    type: string.isRequired,
    value: oneOfType([string, number]).isRequired,
    name: string,
    required: bool,
    id: string,
    readOnly: bool,
    onChange: func.isRequired

}

export default memo(Input);