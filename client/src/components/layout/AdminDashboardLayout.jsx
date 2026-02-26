import { useState } from "react";
import './AdminDashboardLayout.css'
import { Outlet } from 'react-router-dom'
import Tickets from "../../pages/admin/Tickets";
import NavBarAdmin from "../common/NavBarAdmin";
import TicketDetails from "../../pages/admin/TicketDetails";
const AdminDashboardLayout = () => {
const [tickets, setTickets] = useState([]);
const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div className="admin-dashboard-container">
        <NavBarAdmin />
        <Tickets 
        tickets={tickets}
        setSelectedTicket={setSelectedTicket}
        />
        <TicketDetails 
        setTickets={setTickets}
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
        />
        <Outlet />
    </div>
  );
};

export default AdminDashboardLayout;