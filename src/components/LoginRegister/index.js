import React, { useState } from 'react';
import fetchModel from '../../lib/fetchModelData';

const lrStyles = `
/* Minimal styles for simplified Login/Register (inlined) */
.lr-wrapper {
  max-width: 360px;
  margin: 60px auto;
  padding: 18px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
}

.lr-wrapper h2 { margin: 0 0 12px; }
.lr-toggle { display:flex; gap:8px; justify-content:center; margin-bottom:12px; }
.lr-toggle button { padding:6px 12px; border:1px solid #ccc; background:#fff; cursor:pointer; border-radius:6px; }
.lr-toggle button.active { background:#1976d2; color:#fff; border-color:#1976d2; }
.lr-form { display:flex; flex-direction:column; gap:8px; }
.lr-form input { padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; }
.lr-form button { padding:10px; background:#1976d2; color:#fff; border:none; border-radius:6px; cursor:pointer; }
.lr-message { margin-top:12px; color:#d32f2f; }
`;

function LoginRegister({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [form, setForm] = useState({ login_name: '', password: '', first_name: '', last_name: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!form.login_name.trim() || !form.password.trim()) {
      setMessage('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await fetchModel('/admin/login', 'POST', { login_name: form.login_name, password: form.password });
        if (onLoginSuccess) onLoginSuccess(res.data);
      } else {
        // register
        if (!form.first_name.trim() || !form.last_name.trim()) {
          setMessage('Vui lòng nhập họ và tên');
          setLoading(false);
          return;
        }
        await fetchModel('/user', 'POST', {
          login_name: form.login_name,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
        });
        setMessage('Đăng ký thành công — hãy đăng nhập.');
        setMode('login');
        setForm({ login_name: '', password: '', first_name: '', last_name: '' });
      }
    } catch (err) {
      setMessage(err.message || 'Lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{lrStyles}</style>
      <div className="lr-wrapper">
      <h2>Photo Sharing</h2>
      <div className="lr-toggle">
        <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Đăng nhập</button>
        <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Đăng ký</button>
      </div>

      <form className="lr-form" onSubmit={handleSubmit}>
        <input name="login_name" placeholder="Tên đăng nhập" value={form.login_name} onChange={handleChange} />
        <input name="password" type="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} />

        {mode === 'register' && (
          <>
            <input name="first_name" placeholder="Tên" value={form.first_name} onChange={handleChange} />
            <input name="last_name" placeholder="Họ" value={form.last_name} onChange={handleChange} />
          </>
        )}

        <button type="submit" disabled={loading}>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</button>
      </form>

      {message && <div className="lr-message">{message}</div>}
      </div>
    </>
  );
}

export default LoginRegister;
