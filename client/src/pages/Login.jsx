import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            console.log("Login Response Status:", res.status, res.statusText);
            const text = await res.text();
            console.log("Login Response Body:", text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error(`Server Error (${res.status}): ${text || 'Empty Response'}`);
            }

            if (!res.ok) throw new Error(data.message || 'Login failed');

            setToken(data.token);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container-3d fade-in">
            <div className="card-3d" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="heading-3d">User Login</h2>
                {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            className="input-3d"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            className="input-3d"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-3d" style={{ width: '100%', marginTop: '1rem', fontSize: '1.1rem' }}>
                        LOGIN
                    </button>

                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span className="text-muted">No account? <Link to="/register" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Sign Up</Link></span>
                        <Link to="/forgot-password" style={{ color: 'var(--text-muted)' }}>Forgot Password?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
