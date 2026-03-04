import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './NavBarAdmin.css'
import dashboardImg from '../../assets/dashboard.png'
import historyImg from '../../assets/history.png'
import ticketImg from '../../assets/ticket.png'
import ITSlogo from '../../../ITS-LOGO-NOBG.png'
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
            <img className='its-logo' src={ITSlogo} alt="Logo" />
            <div className='nav-panel'>
                <Link to='/admin/dashboard'>
                    <img src={dashboardImg} alt="Dashboard" className='admin-nav-icon'/>
                    <span>Dashboard</span>
                </Link>
                <Link to='/admin/tickets'>
                    <img src={ticketImg} alt="Tickets" className='admin-nav-icon'/>
                    <span>Tickets</span>
                </Link>
                <Link to='/admin/history'>
                    <img src={historyImg} alt="History" className='admin-nav-icon'/>
                    <span>History</span>
                </Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}
export default NavBarAdmin;