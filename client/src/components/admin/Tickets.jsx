import { useState, useMemo } from 'react';
import './Tickets.css';

function Tickets({ tickets, setSelectedTicket, loading }) {
    const [searchId, setSearchId] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;

    const departments = useMemo(() => {
        if (!tickets) return [];
        return [...new Set(tickets.map(t => t.department))].sort();
    }, [tickets]);

    const filteredTickets = useMemo(() => {
        let filtered = tickets || [];

        if (searchId) {
            filtered = filtered.filter(ticket => 
                ticket.ticket_ref.toLowerCase().includes(searchId.toLowerCase())
            );
        }

        if (statusFilter) filtered = filtered.filter(t => t.status === statusFilter);
        if (priorityFilter) filtered = filtered.filter(t => t.priority === priorityFilter);
        if (deptFilter) filtered = filtered.filter(t => t.department === deptFilter);

        const priorityOrder = { High: 3, Medium: 2, Low: 1 };

        return [...filtered].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateB - dateA !== 0) return dateB - dateA;

            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        });
    }, [tickets, searchId, statusFilter, priorityFilter, deptFilter]);

    const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);

    const displayedTickets = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredTickets.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredTickets, currentPage]);

    const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const dropdownStyle = {
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #cbd5e1',
        backgroundColor: 'white',
        cursor: 'pointer',
        outline: 'none',
        fontSize: '14px'
    };

    return (
        <div className='tickets-container'>
            <div className='tickets-title'>
                <h1>Tickets</h1>
            </div>

            <div className='search-bar-container' style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder='Enter Ref ID'
                    onChange={(e) => {
                        setSearchId(e.target.value);
                        setCurrentPage(1);
                    }}
                    value={searchId}
                    style={{ flex: 2, minWidth: '200px' }}
                />
                
                <select 
                    value={deptFilter}
                    onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                    style={dropdownStyle}
                >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>

                <select 
                    value={priorityFilter}
                    onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
                    style={dropdownStyle}
                >
                    <option value="">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                <select 
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    style={dropdownStyle}
                >
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>

            <div className="loader-container">
                {loading && (
                    <div style={{ textAlign: 'center', padding: '10px' }}>
                        <div className="spinner"></div>
                        <p className="loading-text">Loading...</p>
                    </div>
                )}
            </div>

            <div className="table-wrapper">
                <table className="tickets-table">
                    <thead>
                        <tr>
                            <th>#</th> 
                            <th>REFERENCE ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Issue</th>
                            <th>Priority</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedTickets.map((ticket, index) => (
                            <tr key={ticket.ticket_ref} onClick={() => setSelectedTicket(ticket)}>
                                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                <td style={{ fontWeight: 'bold', color: '#0a0b0b' }}>{ticket.ticket_ref}</td>
                                <td>{ticket.name}</td>
                                <td>{ticket.department}</td>
                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {ticket.issue}
                                </td>
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
                        {displayedTickets.length === 0 && !loading && (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                    No tickets found matching your filters.
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