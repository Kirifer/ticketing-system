import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import UserLayout from '../components/layout/UserLayout'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/admin/Login'
import CreateTicket from '../pages/user/CreateTicket'
import AdminDashboard from '../pages/admin/AdminDashboard'
function AppRoutes(){

    return(
        <Routes>
            {/*User Side*/}
            <Route element={<UserLayout />}>
                <Route index element={<CreateTicket />} />
            </Route>

            {/*Admin Side*/}
            <Route path='admin/login' element={<AdminLayout/>}>
                <Route index element={<Login />}></Route>
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/*Error 404*/}
            <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    );
}
export default AppRoutes;