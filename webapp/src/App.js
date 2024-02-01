//CSS
import './App.css';
//Router
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

//pages
import Home from './pages/home';
import Panel from './pages/panel';
import Graph from './pages/graph';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/panel' element={<Panel />} />
        <Route path='/graph' element={<Graph />} />
      </Routes>
    </Router>
  );
}

export default App;
