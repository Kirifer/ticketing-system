import { useState, useEffect } from "react";
function TicketDetails({setTickets, setSelectedTicket, selectedTicket}){
const [lightboxImage, setLightboxImage] = useState(null);
    const updateStatus = async (newStatus) => {
    console.log("updateStatus is running");
    setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    setTickets(prevTickets =>
        prevTickets.map(ticket =>
            ticket.id === selectedTicket.id
                ? { ...ticket, status: newStatus }
                : ticket
        )
    );
    try {
        await fetch(
            `http://localhost:5000/api/tickets/${selectedTicket.id}/status`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            }
        );
    } catch (err) {
        console.log(err);
    }
    };

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/tickets", { credentials: 'include' });
                const data = await res.json();
                setTickets(data);
                console.log("ALL TICKETS:", data);
            } catch(err) {
                console.log(err);
            }
            
        }
        fetchTickets();
        
    }, [setTickets]);
    return(
        <div className='ticket-details-container'>
            <div className='tickets-title'>
                <h1>Ticket Details</h1>
            </div>

            {selectedTicket ? (
                <div className='ticket-details'>
                <div className="detail-group">
                    <label>Reference:</label>
                    <span>{selectedTicket.ticket_ref}</span>
                </div>

                <div className="detail-group">
                    <label>Name:</label>
                    <span>{selectedTicket.name}</span>
                </div>

                <div className="detail-group">
                    <label>Email:</label>
                    <span>{selectedTicket.email}</span>
                </div>

                <div className="detail-group">
                    <label>Priority:</label>
                    <span className={`priority ${selectedTicket.priority.toLowerCase()}`}>
                    {selectedTicket.priority}
                    </span>
                </div>

                <div className="detail-group">
                    <label>Status:</label>
                    <select 
                    className="status-dropdown"
                    value={selectedTicket.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(e.target.value)}
                    >
                    <option value=''>Select Status</option>
                    <option value='Open'>Open</option>
                    <option value='InProgress'>In Progress</option>
                    <option value='Resolved'>Resolved</option>
                    <option value='Closed'>Closed</option>
                    </select>
                </div>

                <div className="description-section">
                    <label>Description:</label>
                    <p>{selectedTicket.description}</p>
                </div>

                <div className="attachment-section">
                    <label>Attachment:</label>
                    <div className="attachment-box">
                    {selectedTicket.image_path && (
                        <img 
                        src={`http://localhost:5000/uploads/${selectedTicket.image_path}`} 
                        alt="Attachment" 
                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                        onClick={() => setLightboxImage(`http://localhost:5000/uploads/${selectedTicket.image_path}`)}
                        />
                    )}
                    </div>
                </div>

                {lightboxImage && (
                    <div className="lightbox" onClick={() => setLightboxImage(null)}>
                    <img src={lightboxImage} alt="Full Screen" />
                    </div>
                )}
                </div>
            ) : (
                <p style={{ marginTop: '20px', color: '#64748b' }}>
                No ticket selected. Click a ticket from the list to view details.
                </p>
            )}
        </div>
    );
}
export default TicketDetails;