import './Tickets.css'
function Tickets({tickets, setSelectedTicket}){
    return(
        <div className='tickets-container'>
                <div className='tickets-title'>
                    <h1>Tickets</h1>
                </div>

                <table className="tickets-table">
                    <thead>
                        <tr>
                            <th>Ref #</th>
                            <th>Name</th>
                            <th>Issue</th>
                            <th>Priority</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            [...tickets].sort((a, b) => {
                                const priorityOrder = {
                                    High: 3,
                                    Medium: 2,
                                    Low: 1
                                };
                                return priorityOrder[b.priority] - priorityOrder[a.priority];
                            }).map(ticket => (
                            <tr key={ticket.ticket_ref} onClick={() => setSelectedTicket(ticket)}>
                                <td>{ticket.ticket_ref}</td>
                                <td>{ticket.name}</td>
                                <td>{ticket.issue}</td>
                                <td><span className={"priority"+" "+ticket.priority}>{ticket.priority}</span></td>
                                <td>{ticket.date}</td>
                                <td><span className={"status"+" "+ticket.status}>{ticket.status}</span></td>
                            </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
    );
}
export default Tickets;