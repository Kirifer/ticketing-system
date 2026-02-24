import { Outlet } from 'react-router-dom'
import NavBar from '../common/NavBar';
import CreateTicket from '../../pages/user/CreateTicket';
import TrackProgress from '../ticket/TrackProgress';
function UserLayout(){
    return(
            <>
                <title>ITS Ticketing System</title>
                <NavBar />
                {/* <CreateTicket />
                <TrackProgress /> */}
                <Outlet />
            </>
    );
}
export default UserLayout;