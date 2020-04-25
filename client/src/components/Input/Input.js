import React, {memo} from 'react';

import './style.css';

const Input = ({type, value, name, required, id, readOnly, onChange}) => {
    return (
        <input type={type}
               value={value}
               name={name}
               id={id}
               required={required}
               onChange={onChange}
               readOnly={readOnly}
               className="input"/>
    );
};

export default memo(Input);