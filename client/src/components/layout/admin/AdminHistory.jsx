import NavBarAdmin from '../../common/NavBarAdmin';
import './AdminHistory.css'
import History from '../../admin/History';
function AdminHistory(){
    return(
        <div className="admin-history-container">  
            <NavBarAdmin />
            <History />
        </div>
    );
}
export default AdminHistory;