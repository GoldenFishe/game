import React, {memo} from 'react';
import {func, string} from 'prop-types';

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

Button.propTypes = {
    type: string.isRequired,
    onClick: func
};

export default memo(Button);