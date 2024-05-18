import React, { useState } from 'react';
import './Columns.css';
import Sensors from './Sensors';
import Actuators from './Actuators';

function Columns({ index }) {
    const [isCol1Expanded, setCol1Expanded] = useState(false);
    const [isCol2Expanded, setCol2Expanded] = useState(false);

    const handleCol1Expand = () => {
        setCol1Expanded(!isCol1Expanded);
    };

    const handleCol2Expand = () => {
        setCol2Expanded(!isCol2Expanded);
    };

    return (
        <div>
            <div className={`col1 ${isCol1Expanded ? 'expanded' : ''}`}>
                <div className="arrow-right" onClick={handleCol1Expand} isCol1Expanded={isCol1Expanded}></div>
                <Sensors isCol1Expanded={isCol1Expanded} />
            </div>
            <div className={`col2 ${isCol2Expanded ? 'expanded' : ''}`}>
                <div className="arrow-left" onClick={handleCol2Expand} isCol2Expanded={isCol2Expanded}></div>
                <Actuators isCol2Expanded={isCol2Expanded}/>
            </div>
        </div>
    );
}

export default Columns;
