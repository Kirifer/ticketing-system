import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [auth, setAuth] = useState(false);
    const [pass, setPass] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

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

    if (!auth) return (
        <div className="login-wrapper">
            <div className="login-box">
                <h2 style={{ color: '#004a99', marginTop: 0 }}>ITSquarehub Admin</h2>
                <p style={{ color: '#666', fontSize: 14 }}>Please sign in to manage tickets</p>
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

            <div className="table-wrapper">
                <table className="admin-tbl">
                    <thead>
                        <tr className="tbl-head">
                            <th className="admin-th">Reference</th>
                            <th className="admin-th">Full Name</th>
                            <th className="admin-th">Category</th>
                            <th className="admin-th">Status</th>
                            <th className="admin-th">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(t => (
                            <tr key={t.id}>
                                <td className="admin-td"><b>{t.reference_no}</b></td>
                                <td className="admin-td">{t.full_name}</td>
                                <td className="admin-td">{t.category}</td>
                                <td className="admin-td">
                                    <span className="status-badge" style={{ backgroundColor: getStatusColor(t.status) }}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="admin-td">
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedTicket && (
                <div className="admin-overlay">
                    <div className="admin-modal">
                        <div className="modal-header">
                            <h3 style={{ margin: 0 }}>Ticket Details</h3>
                            <button onClick={() => setSelectedTicket(null)} style={{background:'none', border:'none', cursor:'pointer', fontSize: 20}}>×</button>
                        </div>
                        <div className="modal-body">
                            <p><b>User:</b> {selectedTicket.full_name}</p>
                            <p><b>Description:</b> {selectedTicket.description}</p>
                            {selectedTicket.image_url && (
                                <div style={{ marginTop: 10 }}>
                                    <a href={selectedTicket.image_url} target="_blank" rel="noreferrer" style={{color: '#004a99', fontWeight: 'bold', textDecoration: 'none'}}>View Image ↗</a>
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