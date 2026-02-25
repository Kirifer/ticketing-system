import { Routes, Route } from 'react-router-dom'

import AdminLoginLayout from '../components/layout/AdminLoginLayout'
import UserLayout from '../components/layout/UserLayout'
import AdminDashboardLayout from '../components/layout/AdminDashboardLayout'

import ProtectedRoute from './ProtectedRoute'

import Login from '../pages/admin/Login'
import CreateTicket from '../pages/user/CreateTicket'

function AppRoutes(){

    return(
        <Routes>
            {/*User Side*/}
            <Route element={<UserLayout />}>
                <Route index element={<CreateTicket />} />
            </Route>

            {/*Admin Side*/}
            <Route path='admin/login' element={<AdminLoginLayout/>}>
                <Route index element={<Login />}></Route>
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="admin/dashboard" element={<AdminDashboardLayout />} />
            </Route>

            {/*Error 404*/}
            <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    );
}
export default AppRoutes;