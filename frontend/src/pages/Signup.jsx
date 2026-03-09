import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'candidate'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await register(formData);
            if (user.role === 'company') navigate('/company');
            else navigate('/candidate');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '60px auto' }}>
            <div className="glass-card">
                <h2 className="text-center mb-4">Create Account</h2>
                {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(239, 68, 68, 0.5)' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">I am a...</label>
                        <div className="d-flex gap-4">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="candidate"
                                    checked={formData.role === 'candidate'}
                                    onChange={handleChange}
                                /> Candidate
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="company"
                                    checked={formData.role === 'company'}
                                    onChange={handleChange}
                                /> Company
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">{formData.role === 'company' ? 'Company Name' : 'Full Name'}</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '16px' }} disabled={loading}>
                        <UserPlus size={18} /> {loading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" className="text-gradient" style={{ fontWeight: 500 }}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
