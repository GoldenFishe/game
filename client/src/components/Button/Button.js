import React, {memo} from 'react';

import './style.css';

const Button = ({type, children, onClick}) => {
    return (
        <button type={type}
                className="button"
                onClick={onClick}>
            {children}
        </button>
    );
};

export default memo(Button);