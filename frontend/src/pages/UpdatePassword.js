import React, { useState } from 'react';
import { updatePassword } from '../api';
import toast from 'react-hot-toast';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

const UpdatePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Current password required';
    if (!PASSWORD_REGEX.test(form.newPassword))
      e.newPassword = 'Password: 8-16 chars, must include uppercase and special character';
    if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: undefined });
  };

  return (
    <div className="page-container" style={{ maxWidth: 480 }}>
      <h2 style={{ marginBottom: 24 }}>Update Password</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" value={form.currentPassword} onChange={set('currentPassword')} placeholder="••••••••" />
            {errors.currentPassword && <div className="error">{errors.currentPassword}</div>}
          </div>

          <div className="form-group">
            <label>New Password <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>(8-16 chars, uppercase + special)</span></label>
            <input type="password" value={form.newPassword} onChange={set('newPassword')} placeholder="••••••••" />
            {errors.newPassword && <div className="error">{errors.newPassword}</div>}
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="••••••••" />
            {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
