import { useState } from 'react'
import NavBarAdmin from '../../common/NavBarAdmin';
import './AdminHistory.css'
import History from '../../admin/History';
function AdminHistory(){
    const [ loading, setLoading ] = useState(false);
    return(
        <div className="admin-history-container">  
            <NavBarAdmin 
            loading={loading}
            setLoading={setLoading}
            />
            <History 
            loading={loading}
            />
        </div>
    );
}
export default AdminHistory;