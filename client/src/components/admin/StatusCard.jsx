import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Link } from 'react-router-dom'
import './StatusCard.css';

function StatusCards({loading}) {
  const [tickets, setTickets] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/tickets")
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoader(false);
      })
      .catch(err => {
        console.error("Error fetching tickets:", err);
        setLoader(false);
      });
  }, []);
  const statusMap = {
    Open: "Pending",
    InProgress: "In Progress",
    Resolved: "Resolved",
    Closed: "Closed"
  };

  const counts = {
    Pending: 0,
    "In Progress": 0,
    Resolved: 0,
    Closed: 0
  };

  tickets.forEach(ticket => {
    const label = statusMap[ticket.status];
    if (label && counts[label] !== undefined) counts[label]++;
  });

  const cards = [
    { label: "Pending", count: counts.Pending, color: "#FF6B6B" },
    { label: "In Progress", count: counts["In Progress"], color: "#4D96FF" },
    { label: "Resolved", count: counts.Resolved, color: "#FFD93D" },
    { label: "Closed", count: counts.Closed, color: "#6BCB77" },
  ];

  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (6 - i));

    const options = { month: "short", day: "numeric" };
    const dateLabel = date.toLocaleDateString("en-US", options);

    const dbDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const count = tickets.filter(t => t.date === dbDate).length;

    return { date: dateLabel, count };
  });

  if (loader) return <div className="status-cards-wrapper">Loading...</div>;
  if (tickets.length === 0) return <div className="status-cards-wrapper">No tickets yet</div>;

  return (
    <div className="status-cards-wrapper">
      <div className="status-cards-container">
        {cards.map((card, index) => (
          <div className="status-card" key={index} style={{ borderTopColor: card.color }}>
            <div className="status-card-count">{card.count}</div>
            <div className="status-card-label">{card.label}</div>
          </div>
        ))}
      </div>

      <Link to='/admin/tickets'>
        <button className="manage-tickets-btn">Manage Tickets</button>
      </Link>
      <div className="loader-container">
          {loading && (
          <>
          <div className="spinner"></div>
          <p className="loading-text">Logging Out</p>
          </>
          )}
        </div>

      <div className="line-chart-container">
        <h3 className="chart-title">Tickets Submitted (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={last7Days} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} domain={[0, 'dataMax + 2']} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4D96FF"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatusCards;