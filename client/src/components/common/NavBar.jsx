import { Link } from "react-router-dom";
import logo from '../../../ITS-LOGO-NOBG.png';
import './NavBar.css'
function NavBar(){
    return(
            <div className="nav-bar-container">
                <nav>
                    <div className="left-panel">
                        <Link to='/'>
                            <img className="logo" src={logo} alt="Logo" />
                        </Link>
                        <span className="first-name">IT Squarehub </span>
                        <span className="second-name">| Ticketing System</span>
                    </div>
                    <div className="right-panel">
                        <Link to='/'>Report a problem</Link>
                        <Link to='/admin/login'>Admin</Link>
                    </div>
                </nav>
            </div>
    );
}
export default NavBar;