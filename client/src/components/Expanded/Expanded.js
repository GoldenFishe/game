import React, {memo, useState} from 'react';
import {any, bool} from "prop-types";

import plusIcon from '../../assets/icons/plus.svg';
import minusIcon from '../../assets/icons/minus.svg';
import './style.css';

const Expanded = ({label, defaultExpand, children}) => {
    const [expanded, expand] = useState(defaultExpand);
    const toggleExpand = () => expand(!expanded);
    const iconSrc = expanded ? minusIcon : plusIcon;
    const iconAlt = expanded ? "Скрыть всё" : "Раскрыть всё";
    const labelTitle = expanded ? "Кликните, чтобы свернуть" : "Кликните, чтобы развернуть";
    return (
        <div className="expanded">
            <div className="expanded-label"
                 title={labelTitle}
                 onClick={toggleExpand}>
                <img src={iconSrc}
                     alt={iconAlt}
                     className="expanded-label__icon"/>
                <div>{label}</div>
            </div>
            <div className="expanded-items">
                {expanded && children}
            </div>
        </div>
    );
};

Expanded.defaultProps = {
    defaultExpand: false
}

Expanded.propTypes = {
    label: any.isRequired,
    defaultExpand: bool
}

export default memo(Expanded);