import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PU from './assets/PU.png';
import bgImage from './assets/pondicherry-university-banner.jpg';
import FacultyIcon from './assets/faculty.png';

function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            console.log(res);
            const data = await res.json();
            console.log(data);
            setMessage(data.message || 'Signup successful');
        } catch (err) {
            setMessage('Signup failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `url(${bgImage}) center/cover no-repeat` }}>
            <div class='header-logo' style={{ position: 'absolute', top: '20px', left: '20px' }}>
                <img src={PU} alt="PU Logo" style={{ width: '120px', height: '110px', marginBottom: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
            </div>
            <div style={{ display: 'flex', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderRadius: '16px', overflow: 'hidden', background: '#fff', width: '900px', maxWidth: '95%' }}>
                <div style={{ flex: 1.2, padding: '25px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ fontSize: '2.1rem', opacity: 0.9, fontFamily: 'unset', fontWeight: 600, marginTop: '20px', marginBottom: '10px' }}>Pondicherry University</p>
                    <p style={{ fontSize: '1rem', opacity: 0.7 }}>Join the platform to manage your publications and profile</p>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 500 }}>Name</label>
                        <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                        <label style={{ fontWeight: 500 }}>Email</label>
                        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                        <label style={{ fontWeight: 500 }}>Password</label>
                        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                        <label style={{ fontWeight: 500 }}>Confirm Password</label>
                        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                        <button type="submit" style={{ background: 'linear-gradient(90deg, #6366f1 60%, #818cf8 100%)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, fontSize: '1.1rem', marginTop: '10px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.10)' }}>Signup</button>
                    </form>
                    <p style={{ color: '#ef4444', marginTop: '8px', fontWeight: 500 }}>{message}</p>
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        Already have an account? <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
                    </div>
                </div>
                {/* Left Side - Branding */}
                <div style={{ flex: 1, background: 'linear-gradient(120deg, #787af7ff 60%, #818cf8 100%)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 30px' }}>
                    <img src={FacultyIcon} style={{ width: '200px', height: '200px', marginBottom: '20px', borderRadius: '12px' }}></img>
                    <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: '8px' }}>Faculty Signup</h2>
                </div>
                {/* Right Side - Form */}
            </div>
        </div>
    );
}

export default Signup;