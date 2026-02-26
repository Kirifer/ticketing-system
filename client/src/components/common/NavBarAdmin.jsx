import { useNavigate } from 'react-router-dom'
function NavBarAdmin(){
    const navigate = useNavigate();
    const handleLogout = async () => {
        await fetch("http://localhost:5000/admin/logout", {
            method: "POST",
            credentials: "include"
        });
        navigate("/admin/login");
    };
    return(
        <div className='nav-panel-container'>
                <div className="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className='nav-panel'>
                    <span>Dashboard</span>
                    <span>Tickets</span>
                    <span>History</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
        </div>
    );
}
export default NavBarAdmin;