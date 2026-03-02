import { useState, useMemo } from 'react';
import './Tickets.css';

function Tickets({ tickets, setSelectedTicket }) {
    const [searchId, setSearchId] = useState('');

    const displayedTickets = useMemo(() => {
        const filtered = searchId
            ? tickets.filter(ticket => ticket.ticket_ref.includes(searchId))
            : tickets;

        const priorityOrder = { High: 3, Medium: 2, Low: 1 };

        return filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }, [tickets, searchId]);

    return (
        <div className='tickets-container'>
            <div className='tickets-title'>
                <h1>Tickets</h1>
            </div>

            <div className='search-bar-container'>
                <label htmlFor="search"></label>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder='Enter Ref ID'
                    onChange={(e) => setSearchId(e.target.value)}
                    value={searchId}
                />
            </div>

            <table className="tickets-table">
                <thead>
                    <tr>
                        <th>REFERENCE ID</th>
                        <th>Name</th>
                        <th>Issue</th>
                        <th>Priority</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedTickets.map(ticket => (
                        <tr key={ticket.ticket_ref} onClick={() => setSelectedTicket(ticket)}>
                            <td>{ticket.ticket_ref}</td>
                            <td>{ticket.name}</td>
                            <td>{ticket.issue}</td>
                            <td>
                                <span className={"priority " + ticket.priority}>
                                    {ticket.priority}
                                </span>
                            </td>
                            <td>{ticket.date}</td>
                            <td>
                                <span className={"status " + ticket.status}>
                                    {ticket.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {displayedTickets.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>
                                No tickets found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
export default Tickets;