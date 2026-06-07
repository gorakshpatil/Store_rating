import React, { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container" style={{ color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div className="page-container fade-in">
      <h2 style={{ marginBottom: 8 }}>Admin Dashboard</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 14 }}>Platform overview at a glance</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-number">{stats?.totalUsers ?? 0}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Registered members</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Stores</div>
          <div className="stat-number" style={{ color: 'var(--accent2)' }}>{stats?.totalStores ?? 0}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Active stores</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Ratings</div>
          <div className="stat-number" style={{ color: 'var(--accent3)' }}>{stats?.totalRatings ?? 0}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Submitted ratings</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {[
          { label: 'Manage Users', desc: 'View, add and filter users', to: '/admin/users', color: 'var(--accent)' },
          { label: 'Manage Stores', desc: 'View, add and filter stores', to: '/admin/stores', color: 'var(--accent2)' },
        ].map(item => (
          <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ borderLeft: `3px solid ${item.color}`, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 6, color: item.color }}>{item.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
