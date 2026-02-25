import "./AdminDashboardLayout.css";
import AdminHeader from "../../pages/admin/AdminHeader";
import AdminDashboard from "../../pages/admin/AdminDashboard";
import { Outlet } from 'react-router-dom'
const AdminDashboardLayout = () => {

  return (
    <>
        <AdminHeader />
        <AdminDashboard />
        <Outlet />
    </>
  );
};

export default AdminDashboardLayout;