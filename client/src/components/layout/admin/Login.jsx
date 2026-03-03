import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ loading , setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        return;
      }

      navigate('/admin/dashboard'); 
    } catch (err) {
      setError("Server error. Try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Login-form-container">
      <h1>IT Squarehub</h1>
      {loading ? (
                    <div className="loader-container">
                        <div className="spinner"></div>
                        <p className="loading-text">Verifying Admin Credentials...</p>
                    </div>
                ) : (
      <form onSubmit={handleSubmit}>
        <div className="Logo-container">
          <img src="../../../ITS-LOGO-NOBG.png" alt="ITS Logo" />
        </div>
        <span className="admin-badge">Admin Authentication</span>

        <div className="login-container">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              autoComplete="username"
              placeholder="Enter username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="login-btn">Authenticate</button>
      </form>
          )}
    </div>
  );
}

export default Login;