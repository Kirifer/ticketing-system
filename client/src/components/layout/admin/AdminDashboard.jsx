import { useState } from 'react'
import NavBarAdmin from "../../common/NavBarAdmin";
import './AdminDashboard.css'
import StatusCard from "../../admin/StatusCard";
function AdminDashboard(){
    const [loading, setLoading] = useState(false);
    return(
        <div className="admin-dashboard-container">  
            <NavBarAdmin 
            loading={loading}
            setLoading={setLoading}
            />
            <StatusCard 
             loading={loading}
            />
        </div>
    );
}
export default AdminDashboard;