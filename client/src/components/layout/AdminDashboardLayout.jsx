import AdminDashboard from "../../pages/admin/AdminDashboard";
import { Outlet } from 'react-router-dom'
const AdminDashboardLayout = () => {

  return (
    <>
        <AdminDashboard />
        <Outlet />
    </>
  );
};

export default AdminDashboardLayout;