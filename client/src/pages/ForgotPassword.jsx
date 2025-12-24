import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

            setMessage(data.message);
            setStep(2);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Reset failed');

            alert('Password reset successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container-3d fade-in">
            <div className="card-3d" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="heading-3d">Recovery</h2>
                {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {message && <div style={{ color: 'var(--primary-color)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

                {step === 1 ? (
                    <form onSubmit={handleRequestOtp}>
                        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                            Enter your email to receive a One-Time Password (OTP).
                        </p>
                        <div className="input-group">
                            <input
                                className="input-3d"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-3d" style={{ width: '100%' }}>
                            SEND OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                            Check your email/console for the OTP.
                        </p>
                        <div className="input-group">
                            <input
                                className="input-3d"
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                className="input-3d"
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-3d" style={{ width: '100%' }}>
                            RESET PASSWORD
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'var(--text-muted)' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
