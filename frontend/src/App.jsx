import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CandidateDashboard from './pages/CandidateDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <div className="page-wrapper">
            <div className="container">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route path="/candidate" element={
                        <ProtectedRoute allowedRoles={['candidate']}>
                            <CandidateDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/company" element={
                        <ProtectedRoute allowedRoles={['company', 'admin']}>
                            <CompanyDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </div>
    );
}

export default App;
