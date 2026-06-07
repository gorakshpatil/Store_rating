import React, { useEffect, useState, useCallback } from 'react';
import { getStores, submitRating } from '../api';
import StarRating from '../components/StarRating';
import SortableHeader from '../components/SortableHeader';
import toast from 'react-hot-toast';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });
  const [loading, setLoading] = useState(false);
  const [ratingModal, setRatingModal] = useState(null); // { storeId, storeName, current }
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = useCallback(() => {
    setLoading(true);
    getStores({ ...filters, ...sort })
      .then(r => setStores(r.data))
      .catch(() => toast.error('Failed to load stores'))
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleSort = (field) => {
    setSort(s => ({ sortBy: field, sortOrder: s.sortBy === field && s.sortOrder === 'ASC' ? 'DESC' : 'ASC' }));
  };

  const openRatingModal = (store) => {
    setRatingModal({ storeId: store.id, storeName: store.name, current: store.userRating });
    setSelectedRating(store.userRating || 0);
  };

  const handleSubmitRating = async () => {
    if (!selectedRating) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      await submitRating(ratingModal.storeId, { rating: selectedRating });
      toast.success(ratingModal.current ? 'Rating updated!' : 'Rating submitted!');
      setRatingModal(null);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <h2 style={{ marginBottom: 8 }}>Browse Stores</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Rate your favourite stores</p>

      <div className="search-bar">
        <div className="form-group" style={{ flex: 2 }}>
          <label>Search by Name</label>
          <input value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} placeholder="Store name..." />
        </div>
        <div className="form-group" style={{ flex: 2 }}>
          <label>Search by Address</label>
          <input value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} placeholder="Address..." />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading stores...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <SortableHeader label="Store Name" field="name" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <SortableHeader label="Address" field="address" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <th>Overall Rating</th>
                  <th>Your Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>No stores found</td></tr>
                ) : stores.map(store => (
                  <tr key={store.id}>
                    <td style={{ fontWeight: 500 }}>{store.name}</td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {store.address}
                    </td>
                    <td>
                      {store.averageRating ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <StarRating value={Math.round(store.averageRating)} readOnly size={16} />
                          <span style={{ fontWeight: 600, color: '#fbbf24', fontSize: 13 }}>{store.averageRating}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({store.totalRatings})</span>
                        </div>
                      ) : <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>No ratings yet</span>}
                    </td>
                    <td>
                      {store.userRating ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <StarRating value={store.userRating} readOnly size={16} />
                          <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 600 }}>{store.userRating}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Not rated</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`btn ${store.userRating ? 'btn-ghost' : 'btn-primary'}`}
                        style={{ padding: '6px 14px', fontSize: 12 }}
                        onClick={() => openRatingModal(store)}
                      >
                        {store.userRating ? 'Edit Rating' : 'Rate Store'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {ratingModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setRatingModal(null)}>
          <div className="modal" style={{ maxWidth: 360, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 8 }}>{ratingModal.current ? 'Update Rating' : 'Rate Store'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>{ratingModal.storeName}</p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <StarRating value={selectedRating} onChange={setSelectedRating} size={36} />
            </div>

            {selectedRating > 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
                {['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'][selectedRating]}
              </p>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={handleSubmitRating} disabled={submitting || !selectedRating}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
              <button className="btn btn-ghost" onClick={() => setRatingModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreList;
