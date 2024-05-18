import Actuators from './Actuators';
import './Columns.css';
import Sensors from './Sensors';

function Columns({ index }) {
    return (
        <div>
            <div className="col1">
                <Sensors />
            </div>
            <div className="col2">
                <Actuators />
            </div>
        </div>
    );
}

export default Columns;