import { useState } from "react";
import './AdminTicket.css'
import { Outlet } from 'react-router-dom'
import Tickets from "../../admin/Tickets";
import NavBarAdmin from "../../common/NavBarAdmin";
import TicketDetails from "../../admin/TicketDetails";
const AdminTicket = () => {
const [tickets, setTickets] = useState([]);
const [selectedTicket, setSelectedTicket] = useState(null);
const [loading, setLoading] = useState(false);
  return (
    <div className="admin-ticket-container">
        <NavBarAdmin 
        loading={loading}
        setLoading={setLoading}
        />
        <Tickets 
        tickets={tickets}
        setSelectedTicket={setSelectedTicket}
        loading={loading}
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

export default AdminTicket;