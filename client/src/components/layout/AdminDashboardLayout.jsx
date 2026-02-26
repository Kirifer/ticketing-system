import AdminDashboard from "../../pages/admin/AdminDashboard";
import { Outlet } from 'react-router-dom'
const AdminDashboardLayout = () => {

  return (
    <div>
        <AdminDashboard />
        <Outlet />
    </div>
  );
};

export default AdminDashboardLayout;