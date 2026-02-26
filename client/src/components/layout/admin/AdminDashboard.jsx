import NavBarAdmin from "../../common/NavBarAdmin";
import './AdminDashboard.css'
import StatusCard from "../../admin/StatusCard";
function AdminDashboard(){
    return(
        <div className="admin-dashboard-container">  
            <NavBarAdmin />
            <StatusCard />
        </div>
    );
}
export default AdminDashboard;