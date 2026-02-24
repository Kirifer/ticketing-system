import { Outlet } from 'react-router-dom'
import NavBar from '../common/NavBar';
function UserLayout(){
    return(
            <>
                <title>ITS Ticketing System</title>
                <NavBar />
                <Outlet />
            </>
    );
}
export default UserLayout;