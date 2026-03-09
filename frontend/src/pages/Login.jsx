import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            if (user.role === 'company') navigate('/company');
            else navigate('/candidate');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '80px auto' }}>
            <div className="glass-card">
                <h2 className="text-center mb-4">Welcome Back</h2>
                {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(239, 68, 68, 0.5)' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '16px' }} disabled={loading}>
                        <LogIn size={18} /> {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <p className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/signup" className="text-gradient" style={{ fontWeight: 500 }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
