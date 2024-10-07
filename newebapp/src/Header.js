import './Header.css';
import { Link } from 'react-router-dom';
import logo from './images/logo1_2_cropped.png';

function Header() {
    return (
        <header className="flex items-center justify-between p-3 bg-green-400 fixed w-full top-0 font-semibold">
            <div className="flex items-center space-x-16"> {/*remove this div*/}
                <img src={logo} alt="Company Logo" className="h-8" />
                <nav className="flex items-center space-x-10"> {/*and add ml-auto to put links right*/}
                    <Link to="/" className="hover:text-gray-800">
                        <h2 className="text-lg">Home</h2>
                    </Link>
                    <Link to="/Graphs" className="hover:text-gray-800">
                        <h2 className="text-lg">Graphs</h2>
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
