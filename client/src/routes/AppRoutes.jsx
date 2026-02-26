import { Routes, Route } from 'react-router-dom'

import AdminLoginLayout from '../components/layout/AdminLoginLayout'
import UserLayout from '../components/layout/UserLayout'
import AdminTicket from '../components/layout/admin/AdminTicket'
import AdminDashboard from '../components/layout/admin/AdminDashboard'
import AdminHistory from '../components/layout/admin/AdminHistory'
import ProtectedRoute from './ProtectedRoute'
import Login from '../components/layout/admin/Login'
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
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/tickets" element={<AdminTicket />} />
                <Route path="admin/history" element={<AdminHistory />} />
            </Route>

            {/*Error 404*/}
            <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    );
}
export default AppRoutes;