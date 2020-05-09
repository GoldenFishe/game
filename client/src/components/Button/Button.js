import React, {memo} from 'react';
import {bool, func, string} from 'prop-types';

import './style.css';

const Button = ({type, primary, secondary, disabled, children, onClick}) => {
    const className = `button ${primary ? 'button--primary' : ''} ${secondary ? 'button--secondary' : ''}`;
    return (
        <button type={type}
                className={className}
                disabled={disabled}
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
    primary: bool,
    secondary: bool,
    disabled: bool,
    onClick: func
};

export default memo(Button);