import { useState } from "react";
import './AdminTicket.css'
import { Outlet } from 'react-router-dom'
import Tickets from "../../admin/Tickets";
import NavBarAdmin from "../../common/NavBarAdmin";
import TicketDetails from "../../admin/TicketDetails";
const AdminTicket = () => {
const [tickets, setTickets] = useState([]);
const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div className="admin-ticket-container">
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

export default AdminTicket;