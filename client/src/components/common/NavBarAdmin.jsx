import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './NavBarAdmin.css'
function NavBarAdmin({setLoading}){
    const navigate = useNavigate();
    const handleLogout = async () => {
        setLoading(true);
        await fetch("http://localhost:5000/admin/logout", {
            method: "POST",
            credentials: "include"
        });
        setTimeout(() => {
        navigate("/admin/login");
        }, 2000);
    };
    return(
        <div className='nav-panel-container'>
                <div className="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className='nav-panel'>
                    <Link to='/admin/dashboard'>
                        <span>Dashboard</span>
                    </Link>
                    <Link to='/admin/tickets'>
                        <span>Tickets</span>
                    </Link>
                    <Link to='/admin/history'>
                        <span>History</span>
                    </Link>
                    <button onClick={handleLogout}>Logout</button>
                </div>
        </div>
    );
}
export default NavBarAdmin;