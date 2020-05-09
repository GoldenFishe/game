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

Button.defaultProps = {
    type: 'button'
}

export default memo(Button);