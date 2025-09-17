import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { jwtDecode } from 'jwt-decode';


function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            console.log(data);
            if (data.token) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard'); // Redirect to dashboard or another page
            } else {
                setMessage(data.message || 'Login failed');
            }
        } catch (err) {
            setMessage('Login failed');
        }
    };

    return (
        <div>
            <p>Pondicherry University</p>
            <form onSubmit={handleSubmit}>
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br />
                <button type="submit">Login</button>
            </form>
            <div>
                Don't have an account? <Link to="/signup">Signup</Link>
            </div>
            <p>{message}</p>
        </div>
    );
}

export default Login;