import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = () => {
    if (!user) return null;
    if (user.role === 'admin') {
      return (
        <>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/stores">Stores</Link>
        </>
      );
    }
    if (user.role === 'user') {
      return <Link to="/stores">Browse Stores</Link>;
    }
    if (user.role === 'store_owner') {
      return <Link to="/owner/dashboard">My Store</Link>;
    }
  };

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      height: 60,
      gap: 24,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800,
        fontSize: 20,
        color: 'var(--accent)',
        textDecoration: 'none',
        letterSpacing: '-0.03em',
      }}>
        RATEIT
      </Link>

      <div style={{ display: 'flex', gap: 20, flex: 1 }}>
        {navLinks()}
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/update-password" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Settings
          </Link>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {user.name.split(' ')[0]}
          </span>
          <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <style>{`
        nav a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }
        nav a:hover { color: var(--text); }
        nav a.active { color: var(--accent); }
      `}</style>
    </nav>
  );
};

export default Navbar;
