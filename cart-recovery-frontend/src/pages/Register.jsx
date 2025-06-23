// src/pages/Register.jsx
import { useState } from 'react';
import api from '../api';
import InputField from '../components/InputField';
import Button from '../components/Button';

function Register() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/register', form);
      setMessage(`✅ Registered! User ID: ${res.data.id}`);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Register User</h2>
      <form onSubmit={handleSubmit}>
        <InputField label="Name" name="name" value={form.name} onChange={handleChange} />
        <InputField label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
        <Button type="submit">Register</Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
