import React from "react";
import { useNavigate } from "react-router-dom";
import './AdminHeader.css'
function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:5000/admin/logout", {
      method: "POST",
      credentials: "include"
    });
    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <img className="header-logo" src="../../../ITS-LOGO-NOBG.png" alt="Logo" />
        <h2 className="header-title">Admin Dashboard</h2>
      </div>
      <div className="header-actions">
        <button className="history-btn">History</button>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </header>
  );
}

export default AdminHeader;