import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon, Briefcase } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                <h2 style={{ margin: 0 }}>
                    Campus<span className="text-gradient">Connect</span>
                </h2>
            </Link>

            <div className="nav-links">
                {user ? (
                    <>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Log In</Link>
                        <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px' }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
