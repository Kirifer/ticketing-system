import { useState } from 'react';
import axios from 'axios'
import './TrackProgress.css'
function TrackProgress(){
  const [ticketRef,setTicketRef] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

    const handleTrack = async () => {
      const cleanRef =ticketRef.trim();
      if(cleanRef === ""){
        setError("Please Enter Reference ID");
        return; 
      }
      setTicketData(null); 
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
        "http://localhost:5000/api/tickets/" + cleanRef
        
      );
      setTicketData(response.data);
      } catch(err){
        console.log(err)
        setError("Ticket not found");
        setTicketData(null);
      } finally{
      setLoading(false);
      }
    }
    return(
          <div className="card">
            <h2 className="card-title">Track Progress</h2>
            <input 
            className="input-field" 
            placeholder="Enter Ref ID (ITS-XXXX)"
            onChange={(e) => setTicketRef(e.target.value)}
            value={ticketRef}
            />
            <button onClick={handleTrack} className="submit-btn">Search Ticket</button>
              <div className="loader-container">
                {loading === true && (
                <>
                  <div className="spinner"></div>
                  <p className="loading-text">Verifying ID-REFERENCE...</p>
                </>
                )}
              </div>
              <p className='error'>{error}</p>
              {ticketData &&(
              <div className="track-info-box">
                <p><b>Reference: </b>{ticketData.ticket_ref}</p>
                <p><b>Department: </b>{ticketData.department}</p>
                <p><b>Status: </b>{ticketData.status}</p>
                <p><b>Issue: </b>{ticketData.issue}</p>
                <p><b>Date Submitted:</b>{ticketData.date}</p>
                <p><b>Description: </b>{ticketData.description}</p>
                <p><b>Email: </b>{ticketData.email}</p>
              </div>
              )}
          </div>
    );
}
export default TrackProgress;