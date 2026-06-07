import React, { useEffect, useState, useCallback } from 'react';
import { getAdminUsers, createAdminUser, getAdminUser } from '../../api';
import SortableHeader from '../../components/SortableHeader';
import toast from 'react-hot-toast';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

const EMPTY_FORM = { name: '', email: '', password: '', address: '', role: 'user' };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    getAdminUsers({ ...filters, ...sort })
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = (field) => {
    setSort(s => ({ sortBy: field, sortOrder: s.sortBy === field && s.sortOrder === 'ASC' ? 'DESC' : 'ASC' }));
  };

  const validateForm = () => {
    const e = {};
    if (!form.name || form.name.length < 20 || form.name.length > 60) e.name = 'Name: 20–60 characters';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!PASSWORD_REGEX.test(form.password)) e.password = 'Password: 8-16 chars, uppercase + special char';
    if (!form.address || form.address.length > 400) e.address = 'Address required (max 400 chars)';
    return e;
  };

  const handleCreate = async (ev) => {
    ev.preventDefault();
    const e = validateForm();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    setSubmitting(true);
    try {
      await createAdminUser(form);
      toast.success('User created');
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getAdminUser(id);
      setDetailUser(res.data);
    } catch { toast.error('Failed to load user details'); }
  };

  const set = (f) => (e) => { setForm({ ...form, [f]: e.target.value }); setFormErrors({ ...formErrors, [f]: undefined }); };

  return (
    <div className="page-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Users</h2>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormErrors({}); }}>
          + Add User
        </button>
      </div>

      {/* Filters */}
      <div className="search-bar">
        {[['name','Name'], ['email','Email'], ['address','Address']].map(([field, label]) => (
          <div className="form-group" key={field}>
            <label>{label}</label>
            <input value={filters[field]} onChange={e => setFilters({ ...filters, [field]: e.target.value })} placeholder={`Filter by ${label}`} />
          </div>
        ))}
        <div className="form-group">
          <label>Role</label>
          <select value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
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
                  <SortableHeader label="Role" field="role" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</td>
                    <td><span className={`badge badge-${u.role}`}>{u.role.replace('_', ' ')}</span></td>
                    <td>
                      <button className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => handleViewDetail(u.id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h3>Add New User</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Name <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>(20–60 chars)</span></label>
                <input value={form.name} onChange={set('name')} />
                {formErrors.name && <div className="error">{formErrors.name}</div>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={set('email')} />
                {formErrors.email && <div className="error">{formErrors.email}</div>}
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={form.password} onChange={set('password')} />
                {formErrors.password && <div className="error">{formErrors.password}</div>}
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea value={form.address} onChange={set('address')} rows={2} />
                {formErrors.address && <div className="error">{formErrors.address}</div>}
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={set('role')}>
                  <option value="user">Normal User</option>
                  <option value="admin">Admin</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create User'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {detailUser && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setDetailUser(null)}>
          <div className="modal">
            <h3>User Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Name', detailUser.name], ['Email', detailUser.email], ['Address', detailUser.address]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                  <div>{val}</div>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 2 }}>Role</div>
                <span className={`badge badge-${detailUser.role}`}>{detailUser.role.replace('_', ' ')}</span>
              </div>
              {detailUser.role === 'store_owner' && detailUser.storeRating !== undefined && (
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 2 }}>Store Rating</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#fbbf24' }}>
                    {detailUser.storeRating ? `⭐ ${detailUser.storeRating}` : 'No ratings yet'}
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn-ghost" style={{ marginTop: 20 }} onClick={() => setDetailUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
