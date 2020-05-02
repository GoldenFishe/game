import React, {memo} from 'react';

import './style.css';

const Textarea = ({value, onChange}) => {
    return (
        <textarea value={value}
                  className="textarea"
                  onChange={onChange}/>
    );
};

export default memo(Textarea);