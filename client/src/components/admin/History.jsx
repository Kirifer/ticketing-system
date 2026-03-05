import { useEffect, useState } from 'react';
import './History.css';

function History({loading}) {
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/AdminLog", { credentials: 'include' });
                const data = await res.json();
                setLogs(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchLogs();
    }, []);

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

    const totalPages = Math.ceil(logs.length / logsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className="history-container">
            <h1 className="history-title">Admin Activity Logs</h1>

            <div className="history-table">
                <div className="history-header">
                    <span>Reference ID</span>
                    <span>Date & Time</span>
                    <span>Action</span>
                    <span>From</span>
                    <span>To</span>
                </div>
                <div className="loader-container">
                {loading && (
                <>
                <div className="spinner"></div>
                <p className="loading-text">Logging Out</p>
                </>
                )}
                </div>
                {currentLogs.map(log => (
                    <div key={log.id} className="history-row">
                        <span data-label="Reference ID">{log.ticket_ref}</span>
                        <span data-label="Date & Time">{new Date(log.created_at).toLocaleString()}</span>
                        <span data-label="Action">{log.action}</span>
                        <span data-label="From">{log.old_value}</span>
                        <span data-label="To">{log.new_value}</span>
                    </div>
                ))}

                {logs.length === 0 && (
                    <div className="history-row">
                        <span colSpan="5" style={{ textAlign: 'center' }}>
                            No logs available
                        </span>
                    </div>
                )}
            </div>
            <div className="history-pagination">
                <button onClick={handlePrev} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={handleNext} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default History;