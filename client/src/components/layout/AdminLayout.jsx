import { Outlet } from "react-router-dom";
import NavBar from '../common/NavBar'
function AdminLayout(){
    return(
        <>
            <title>Admin</title>
            <NavBar />
            <Outlet />
        </>
    );
}
export default AdminLayout;