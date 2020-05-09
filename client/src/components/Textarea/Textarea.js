import React, {memo} from 'react';
import {func, string} from "prop-types";

import './style.css';

const Textarea = ({value, onChange}) => {
    return (
        <textarea value={value}
                  className="textarea"
                  onChange={onChange}/>
    );
};


Textarea.propTypes = {
    value: string.isRequired,
    onChange: func.isRequired
}

export default memo(Textarea);