import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [auth, setAuth] = useState(false);
    const [pass, setPass] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);


    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    useEffect(() => {
        if (auth) fetchTickets();
    }, [auth]);

    const fetchTickets = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/tickets');
            setTickets(res.data);
        } catch (err) {
            console.error("Error fetching tickets:", err);
        }
    };

    const handleLogin = async () => {
        if (!pass) return alert("Please enter a password");
        setIsLoggingIn(true);
        try {
            const res = await axios.post('http://localhost:5000/api/admin/login', { password: pass });
            if (res.data.success) {
                setAuth(true);
            } else {
                alert('Access Denied: Incorrect Password');
            }
        } catch (err) {
            const message = err.response?.data?.message || "Server connection failed";
            alert(`Access Denied: ${message}`);
            setPass(''); 
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleStatus = async (id, status, email, ref) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/tickets/${id}`, { status, email, refNo: ref });
            await fetchTickets();
        } catch (err) {
            alert("Failed to update status");
        }
    };

  
    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'Critical': return { color: '#d63031', fontWeight: 'bold' };
            case 'High': return { color: '#e17055', fontWeight: 'bold' };
            case 'Mid': return { color: '#08528b', fontWeight: 'bold' };
            case 'Low': return { color: '#2a2e2f', fontWeight: 'bold' };
            default: return { color: '#0c0c0c' };
        }
    };


    const filteredTickets = tickets.filter(t => {
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
        return matchesStatus && matchesPriority;
    });

    if (!auth) return (
        <div className="login-wrapper">
            <div className="login-box">

                <h2 style={{ color: '#004a99', marginTop: 0 }}>
                    ITSquarehub Admin
                </h2>
                <img src='./its-logo.png' alt='its-logo'/>

                <p style={{ color: '#666', fontSize: 14 }}>
                    Please sign in to manage tickets
                </p>

                <input 
                    type="password" 
                    placeholder="Admin Password" 
                    value={pass}
                    className="admin-input" 
                    onChange={e => setPass(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && handleLogin()}
                />
                
                <button 
                    onClick={handleLogin} 
                    disabled={isLoggingIn}
                    className="login-btn"
                    style={{ opacity: isLoggingIn ? 0.7 : 1 }}
                >
                    {isLoggingIn ? 'Verifying...' : 'Sign In'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="admin-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>Dashboard</h2>
                <button onClick={() => setAuth(false)} className="logout-btn">Logout</button>
            </div>

            <div className="stats-row">
                <div className="stat-card" style={{ borderTop: '4px solid #004a99' }}>
                    <div className="stat-label">Total</div>
                    <div className="stat-value">{tickets.length}</div>
                </div>
                <div className="stat-card" style={{ borderTop: '4px solid #f39c12' }}>
                    <div className="stat-label">Active</div>
                    <div className="stat-value">{tickets.filter(t => t.status !== 'Resolved').length}</div>
                </div>
                <div className="stat-card" style={{ borderTop: '4px solid #27ae60' }}>
                    <div className="stat-label">Resolved</div>
                    <div className="stat-value">{tickets.filter(t => t.status === 'Resolved').length}</div>
                </div>
            </div>


            <div className="filter-toolbar" style={{ display: 'flex', gap: '20px', marginBottom: '20px', padding: '10px', background: '#f4f7f6', borderRadius: '5px' }}>
                <div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '10px' }}>Filter Status:</span>
                    <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="On-Going">On-Going</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
                <div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '10px' }}>Filter Priority:</span>
                    <select className="admin-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                        <option value="All">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Mid">Mid</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="admin-tbl">
                    <thead>
                        <tr className="tbl-head">
                            <th className="admin-th">Reference</th>
                            <th className="admin-th">Full Name</th>
                            <th className="admin-th">Category</th>
                            <th className="admin-th">Status</th>
                            <th className="admin-th">Priority</th>
                            <th className="admin-th">Date Submitted</th>
                            <th className="admin-th">Action</th>
                            <th className="admin-th">Date Resolved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets
                            .slice()
                            .sort((a, b) => {
                                if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
                                if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;

                                return new Date(b.created_at) - new Date(a.created_at);
                            })
                            .map(t => (
                                <tr>
                                    <td className="admin-td"><b>{t.reference_no}</b></td>
                                    <td className="admin-td">{t.full_name}</td>
                                    <td className="admin-td">{t.category}</td>
                                    <td className="admin-td">
                                        <span className="status-badge" style={{ backgroundColor: getStatusColor(t.status) }}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="admin-td" style={getPriorityStyle(t.priority)}>
                                        {t.priority}
                                    </td>
                                    
                                    <td className="admin-td">
                                        {t.created_at ? new Date(t.created_at).toLocaleDateString() : "N/A"} <br/>
                                        <small style={{ color: '#151414' }}>
                                            {t.created_at ? new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </small>
                                    </td>

                                    <td className="admin-td">
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button onClick={() => setSelectedTicket(t)} className="view-btn">View</button>
                                            <select 
                                                className="admin-select"
                                                value={t.status}
                                                onChange={(e) => handleStatus(t.id, e.target.value, t.user_email, t.reference_no)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="On-Going">On-Going</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </div>
                                    </td>

                                    <td className="admin-td">
                                        {t.resolved_at ? (
                                            <>
                                                {new Date(t.resolved_at).toLocaleDateString()} <br/>
                                                <small style={{ color: '#27ae60', fontWeight: 'bold' }}>
                                                    {new Date(t.resolved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </small>
                                            </>
                                        ) : (
                                            <span style={{ color: '#ccc' }}>--</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {filteredTickets.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                        No tickets found matching your filters.
                    </div>
                )}
            </div>

            {selectedTicket && (

                <div className="admin-overlay">
                    <div className="admin-modal">

                        <div className="modal-header">
                            <h3 style={{ margin: 0 }}>Ticket Details</h3>
                            <button onClick={() => setSelectedTicket(null)} style={{background:'none', border:'none', cursor:'pointer', fontSize: 20}}>×</button>
                        </div>

                        <div className="modal-body">
                            <p><b>Reference:</b> {selectedTicket.reference_no}</p>
                            <p><b>User:</b> {selectedTicket.full_name}</p>
                            <p><b>Subject:</b> {selectedTicket.subject}</p>
                            <p><b>Description:</b> {selectedTicket.description}</p>

                            {selectedTicket.image_url && (
                                <div style={{ marginTop: 10 }}>
                                    <a href={selectedTicket.image_url} target="_blank" rel="noreferrer" style={{color: '#004a99', fontWeight: 'bold', textDecoration: 'none'}}>View Attachment ↗</a>
                                </div>
                            )}

                        </div>

                        <button onClick={() => setSelectedTicket(null)} className="modal-close-btn">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Resolved': return '#27ae60';
        case 'On-Going': return '#f39c12';
        default: return '#95a5a6';
    }
};

export default AdminDashboard;