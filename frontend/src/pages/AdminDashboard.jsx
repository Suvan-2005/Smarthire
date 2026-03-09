import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BarChart3, Users as UsersIcon } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h2 className="mb-4 d-flex align-center gap-2"><BarChart3 /> Admin Analytics Center</h2>
            <div className="glass-card mb-4" style={{ borderColor: 'var(--accent-color)' }}>
                <h3>Platform Overview</h3>
                <p>This panel provides system-wide analytics on the SmartHire platform.</p>

                <div className="dashboard-grid mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                        <h4 style={{ color: 'var(--text-secondary)' }}>Total Candidates</h4>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', margin: '10px 0' }}>1,204</h2>
                    </div>
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                        <h4 style={{ color: 'var(--text-secondary)' }}>Active Jobs</h4>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--secondary-color)', margin: '10px 0' }}>85</h2>
                    </div>
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                        <h4 style={{ color: 'var(--text-secondary)' }}>Avg Match Score</h4>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-color)', margin: '10px 0' }}>68%</h2>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="glass-card">
                    <h3 className="mb-4 d-flex align-center gap-2"><UsersIcon size={20} /> Platform Activity</h3>
                    <p>Recent platform registrations, job postings, and AI applicant matches flow through the system continuously.</p>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px dashed var(--surface-border)' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Activity Graph Placeholder</p>
                    </div>
                </div>
                <div className="glass-card">
                    <h3 className="mb-4">System Health</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li className="d-flex justify-between mb-4 pb-2" style={{ borderBottom: '1px solid var(--surface-border)' }}>
                            <span>AI Matching Engine</span> <span style={{ color: 'var(--accent-color)', fontWeight: 500 }}>Online</span>
                        </li>
                        <li className="d-flex justify-between mb-4 pb-2" style={{ borderBottom: '1px solid var(--surface-border)' }}>
                            <span>Database Cluster</span> <span style={{ color: 'var(--accent-color)', fontWeight: 500 }}>Online</span>
                        </li>
                        <li className="d-flex justify-between mb-4 pb-2" style={{ borderBottom: '1px solid var(--surface-border)' }}>
                            <span>Resume Parser Module</span> <span style={{ color: 'var(--accent-color)', fontWeight: 500 }}>Online</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
