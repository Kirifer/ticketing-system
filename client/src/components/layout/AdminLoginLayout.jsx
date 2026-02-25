import { Outlet } from "react-router-dom";
import NavBar from '../common/NavBar'
function AdminLoginLayout(){
    return(
        <>
            <title>Admin</title>
            <NavBar />
            <Outlet />
        </>
    );
}
export default AdminLoginLayout;