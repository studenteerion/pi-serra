import './App.css';
import Cam from './Cam';
import Header from "./header";
import Columns from "./Columns";
//import Sensors from "./Sensors";
//import Actuators from "./Actuators";
//import Button from './Button';


function App() {
    return (
        <>
            <Header/>
            <Cam />
            <Columns/>
            {/*<Sensors />*/}
            {/*<Actuators />*/}
            {/*<Button />*/}
        </>
    );
}

export default App;
