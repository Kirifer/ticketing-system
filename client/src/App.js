import React, { useState } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import './Client.css'; 
import logo from './its-logo.png';

function App() {
  const [view, setView] = useState('user');
  const [form, setForm] = useState({ fullName: '', email: '', subject: '', description: '', category: 'Hardware', priority: 'Low', image: null });
  const [trackRef, setTrackRef] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));

    try {
      const res = await axios.post('http://localhost:5000/api/tickets', formData);
      setLoading(false);
      setModal({ 
        show: true, 
        title: 'Success!', 
        msg: (
          <>
            Ticket Created Successfully. Reference: <b>{res.data.reference_no}</b>
          </>
        )
      });
    } catch (err) {
      setLoading(false);
      setModal({ show: true, title: 'Error', msg: 'Could not connect to server. Check if backend is running.' });
    }
  };

  const handleTrack = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tickets/status?ref=${trackRef}`);
      setTrackResult(res.data.reference_no ? res.data : null);
    } catch (err) {
      alert("Ticket not found.");
      setTrackResult(null);
    }
  };

  return (
    <div className="app-wrapper">
      <nav className="nav-bar">
        
        <div className="logo-container">
          <img src={logo} alt="ITSquarehub Logo" className="nav-logo" />
          <div className="logo">ITSquarehub <span style={{fontWeight:400, marginLeft: '5px'}}>Ticketing System</span></div>
        </div>
        
        <div>
          <button onClick={() => setView('user')} className="nav-btn">Report Issue</button>
          <button onClick={() => setView('admin')} className="nav-btn">Admin Portal</button>
        </div>
      </nav>

      {modal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{color: modal.title === 'Error' ? '#e74c3c' : '#28a745'}}>{modal.title}</h3>
            <p>{modal.msg}</p>
            <button onClick={() => setModal({show:false})} className="submit-btn">Continue</button>
          </div>
        </div>
      )}

      {view === 'user' ? (
        <div className="main-container">
          <div className="card">
            <h2 className="card-title">Submit Ticket</h2>
            <form onSubmit={handleSubmit}>
              <input className="input-field" placeholder="Full Name" required onChange={e => setForm({...form, fullName: e.target.value})} />
              <input className="input-field" type="email" placeholder="Email Address" required onChange={e => setForm({...form, email: e.target.value})} />
              
              <div className="form-row">
                <select className="input-field" onChange={e => setForm({...form, category: e.target.value})}>
                  <option>Hardware</option><option>Software</option><option>Account</option>
                </select>
                <select className="input-field" onChange={e => setForm({...form, priority: e.target.value})}>
                  <option>Low</option><option>Mid</option><option>High</option><option>Critical</option>
                </select>
              </div>

              <input className="input-field" placeholder="Subject / Issue Title" required onChange={e => setForm({...form, subject: e.target.value})} />
              <textarea className="input-field" style={{height: '100px'}} placeholder="Detailed Description..." required onChange={e => setForm({...form, description: e.target.value})} />
              
              <label style={{fontSize: '12px', color: '#64748b', marginBottom: '5px', display: 'block'}}>Attach Screenshot (Optional)</label>
              <input type="file" style={{marginBottom: '20px', fontSize: '13px'}} onChange={e => setForm({...form, image: e.target.files[0]})} />
              
              <button disabled={loading} className="submit-btn">
                {loading ? 'Sending Request...' : 'Submit Ticket'}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="card-title">Track Progress</h2>
            <p style={{textAlign: 'center', fontSize: '14px', color: '#64748b', marginBottom: '20px'}}>Check the current status of your support request.</p>
            <input className="input-field" placeholder="Enter Ref ID (ITS-XXXX)" onChange={e => setTrackRef(e.target.value)} />
            <button onClick={handleTrack} className="submit-btn" style={{backgroundColor: '#28a745'}}>Search Ticket</button>
            
            {trackResult && (
              <div className="track-info-box">
                <p><b>Status:</b> <span style={{color: '#004a99', fontWeight: 'bold'}}>{trackResult.status}</span></p>
                <p><b>Reference:</b> {trackResult.reference_no}</p>
                <p><b>Submitted:</b> {new Date(trackResult.created_at).toLocaleDateString()}</p>
                {trackResult.resolved_at && <p><b>Resolved:</b> {new Date(trackResult.resolved_at).toLocaleDateString()}</p>}
              </div>
            )}
          </div>
        </div>
      ) : <AdminDashboard />}
    </div>
  );
}

export default App;