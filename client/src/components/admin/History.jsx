import { useEffect, useState } from 'react'
import './History.css'

function History() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/admin-logs");
                const data = await res.json();
                setLogs(data);
            } catch (err){
                console.log(err);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="history-container">
            <h1 className="history-title">Admin Activity Logs</h1>

            <div className="history-table">
            <div className="history-header">
                <span>Date & Time</span>
                <span>Action</span>
                <span>From</span>
                <span>To</span>
            </div>

            {logs.map(log => (
            <div key={log.id} className="history-row">
                <span>{new Date(log.created_at).toLocaleString()}</span>
                <span>{log.action}</span>
                <span>{log.old_value}</span>
                <span>{log.new_value}</span>
            </div>
            ))}
</div>
        </div>
    );
}

export default History;