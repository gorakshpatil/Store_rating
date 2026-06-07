import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 20 || form.name.length > 60)
      e.name = 'Name must be 20–60 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Valid email required';
    if (!PASSWORD_REGEX.test(form.password))
      e.password = 'Password: 8-16 chars, must include uppercase and special character';
    if (!form.address || form.address.length > 400)
      e.address = 'Address required (max 400 characters)';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data.token, res.data.user);
      navigate('/stores');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: undefined });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 480 }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, color: 'var(--accent)', marginBottom: 8 }}>RATEIT</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Create your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>(20–60 chars)</span></label>
              <input value={form.name} onChange={set('name')} placeholder="Enter your full name" />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label>Password <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>(8-16 chars, uppercase + special)</span></label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label>Address <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>(max 400 chars)</span></label>
              <textarea value={form.address} onChange={set('address')} rows={3} placeholder="Your address" />
              {errors.address && <div className="error">{errors.address}</div>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
