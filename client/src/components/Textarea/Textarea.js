import React, {memo} from 'react';
import {bool, func, string} from "prop-types";

import './style.css';

const Textarea = ({value, autofocus, onChange}) => {
    return (
        <textarea value={value}
                  autoFocus={autofocus}
                  className="textarea"
                  onChange={onChange}/>
    );
};


Textarea.propTypes = {
    value: string.isRequired,
    autofocus: bool,
    onChange: func.isRequired
}

export default memo(Textarea);