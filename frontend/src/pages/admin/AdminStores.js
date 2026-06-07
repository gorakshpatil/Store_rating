import React, { useEffect, useState, useCallback } from 'react';
import { getAdminStores, createAdminStore } from '../../api';
import SortableHeader from '../../components/SortableHeader';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', email: '', address: '', ownerId: '' };

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = useCallback(() => {
    setLoading(true);
    getAdminStores({ ...filters, ...sort })
      .then(r => setStores(r.data))
      .catch(() => toast.error('Failed to load stores'))
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleSort = (field) => {
    setSort(s => ({ sortBy: field, sortOrder: s.sortBy === field && s.sortOrder === 'ASC' ? 'DESC' : 'ASC' }));
  };

  const validateForm = () => {
    const e = {};
    if (!form.name || form.name.length < 20 || form.name.length > 60) e.name = 'Store name: 20–60 characters';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.address || form.address.length > 400) e.address = 'Address required (max 400 chars)';
    return e;
  };

  const handleCreate = async (ev) => {
    ev.preventDefault();
    const e = validateForm();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    setSubmitting(true);
    try {
      await createAdminStore({ ...form, ownerId: form.ownerId || undefined });
      toast.success('Store created');
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    } finally {
      setSubmitting(false);
    }
  };

  const set = (f) => (e) => { setForm({ ...form, [f]: e.target.value }); setFormErrors({ ...formErrors, [f]: undefined }); };

  return (
    <div className="page-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Stores</h2>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormErrors({}); }}>
          + Add Store
        </button>
      </div>

      <div className="search-bar">
        {[['name','Name'], ['email','Email'], ['address','Address']].map(([field, label]) => (
          <div className="form-group" key={field}>
            <label>{label}</label>
            <input value={filters[field]} onChange={e => setFilters({ ...filters, [field]: e.target.value })} placeholder={`Filter by ${label}`} />
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <SortableHeader label="Name" field="name" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <SortableHeader label="Email" field="email" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <SortableHeader label="Address" field="address" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <th>Rating</th>
                  <th># Ratings</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No stores found</td></tr>
                ) : stores.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</td>
                    <td>
                      {s.averageRating ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <StarRating value={Math.round(s.averageRating)} readOnly size={16} />
                          <span style={{ fontWeight: 600, color: '#fbbf24' }}>{s.averageRating}</span>
                        </div>
                      ) : <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>No ratings</span>}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.totalRatings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h3>Add New Store</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Store Name <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>(20–60 chars)</span></label>
                <input value={form.name} onChange={set('name')} />
                {formErrors.name && <div className="error">{formErrors.name}</div>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={set('email')} />
                {formErrors.email && <div className="error">{formErrors.email}</div>}
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea value={form.address} onChange={set('address')} rows={2} />
                {formErrors.address && <div className="error">{formErrors.address}</div>}
              </div>
              <div className="form-group">
                <label>Owner ID <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>(optional)</span></label>
                <input type="number" value={form.ownerId} onChange={set('ownerId')} placeholder="User ID of store owner" />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create Store'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStores;
