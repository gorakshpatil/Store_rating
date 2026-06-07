import React, { useEffect, useState } from 'react';
import { getOwnerDashboard } from '../../api';
import StarRating from '../../components/StarRating';
import SortableHeader from '../../components/SortableHeader';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ sortBy: 'rating', sortOrder: 'DESC' });

  useEffect(() => {
    getOwnerDashboard()
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (field) => {
    setSort(s => ({ sortBy: field, sortOrder: s.sortBy === field && s.sortOrder === 'ASC' ? 'DESC' : 'ASC' }));
  };

  const sortedRatings = data?.ratings ? [...data.ratings].sort((a, b) => {
    const dir = sort.sortOrder === 'ASC' ? 1 : -1;
    if (sort.sortBy === 'rating') return (a.rating - b.rating) * dir;
    if (sort.sortBy === 'name') return (a.user?.name || '').localeCompare(b.user?.name || '') * dir;
    if (sort.sortBy === 'email') return (a.user?.email || '').localeCompare(b.user?.email || '') * dir;
    return 0;
  }) : [];

  if (loading) return <div className="page-container" style={{ color: 'var(--text-muted)' }}>Loading...</div>;

  if (!data) return (
    <div className="page-container">
      <div className="empty-state">
        <p>No store found for your account. Contact an admin.</p>
      </div>
    </div>
  );

  return (
    <div className="page-container fade-in">
      <h2 style={{ marginBottom: 4 }}>{data.name}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>{data.address}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div className="stat-card">
          <div className="stat-label">Average Rating</div>
          <div className="stat-number" style={{ color: '#fbbf24' }}>{data.averageRating ?? 'N/A'}</div>
          {data.averageRating && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StarRating value={Math.round(data.averageRating)} readOnly size={18} />
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Ratings</div>
          <div className="stat-number">{data.totalRatings}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Submitted reviews</div>
        </div>
      </div>

      <h3 style={{ marginBottom: 16 }}>Ratings from Users</h3>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <SortableHeader label="User Name" field="name" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                <SortableHeader label="Email" field="email" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                <SortableHeader label="Rating" field="rating" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedRatings.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>No ratings yet</td></tr>
              ) : sortedRatings.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.user?.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{r.user?.email}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StarRating value={r.rating} readOnly size={16} />
                      <span style={{ fontWeight: 600, color: '#fbbf24' }}>{r.rating}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
