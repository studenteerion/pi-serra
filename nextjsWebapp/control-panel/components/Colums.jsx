import Actuators from './Actuators';
import styles from './Colums.module.css';
import Sensors from './Sensors';

function Columns() {
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