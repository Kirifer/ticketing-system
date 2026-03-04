import { useState, useMemo } from 'react';
import './Tickets.css';

function Tickets({ tickets, setSelectedTicket, loading }) {
    const [searchId, setSearchId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;

    const filteredTickets = useMemo(() => {
        const filtered = searchId
            ? tickets.filter(ticket => ticket.ticket_ref.includes(searchId))
            : tickets;

        const priorityOrder = { High: 3, Medium: 2, Low: 1 };

        return filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }, [tickets, searchId]);

    const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);

    const displayedTickets = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredTickets.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredTickets, currentPage]);

    const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    return (
        <div className='tickets-container'>
            <div className='tickets-title'>
                <h1>Tickets</h1>
            </div>

            <div className='search-bar-container'>
                <input
                    type="text"
                    placeholder='Enter Ref ID'
                    onChange={(e) => setSearchId(e.target.value)}
                    value={searchId}
                />
            </div>

            <div className="loader-container">
                {loading && (
                    <>
                        <div className="spinner"></div>
                        <p className="loading-text">Loading...</p>
                    </>
                )}
            </div>

            <div className="table-wrapper">
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
            {filteredTickets.length > rowsPerPage && (
                <div className="pagination">
                    <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}
        </div>
    );
}

export default Tickets;