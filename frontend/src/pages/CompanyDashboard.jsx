import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Search, Users, Sparkles, FileText } from 'lucide-react';

const CompanyDashboard = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);

    // New Job Form
    const [showNewJob, setShowNewJob] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newSkills, setNewSkills] = useState('');
    const [newExp, setNewExp] = useState('');

    const [sortOrder, setSortOrder] = useState('desc');

    const fetchMyJobs = async () => {
        try {
            const res = await api.get('/jobs');
            const companyJobs = res.data.filter(j => j.company._id === user._id);
            setJobs(companyJobs);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs', {
                title: newTitle,
                companyName: newCompanyName,
                description: newDesc,
                requiredSkills: newSkills.split(',').map(s => s.trim()),
                experienceLevel: newExp,
                salary: document.getElementById('salaryInput').value,
                location: document.getElementById('locationInput').value
            });
            setShowNewJob(false);
            setNewCompanyName(''); setNewTitle(''); setNewDesc(''); setNewSkills(''); setNewExp('');
            fetchMyJobs();
        } catch (err) {
            console.error(err);
        }
    };

    const viewApplicants = async (jobId) => {
        setSelectedJob(jobs.find(j => j._id === jobId));
        try {
            const res = await api.get(`/applications/job/${jobId}`);
            setApplications(res.data);
            setSortOrder('desc'); // Reset sort order when viewing new job
        } catch (err) {
            console.error(err);
        }
    };

    const updateApplicationStatus = async (appId, status) => {
        try {
            await api.put(`/applications/${appId}/status`, { status });
            // Refresh applications for this job in real time
            setApplications(applications.map(app =>
                app._id === appId ? { ...app, status } : app
            ));
        } catch (err) {
            console.error('Error updating status', err);
        }
    };

    const handleViewResume = async (appId) => {
        try {
            const res = await api.get(`/applications/resume/${appId}`, {
                responseType: 'blob'
            });
            const file = new Blob([res.data], { type: res.headers['content-type'] || 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        } catch (err) {
            console.error('Error viewing resume', err);
            alert('Could not load resume. It might be missing or corrupted.');
        }
    };

    const sortedApplications = [...applications].sort((a, b) => {
        if (sortOrder === 'desc') {
            return b.matchScore - a.matchScore;
        } else {
            return a.matchScore - b.matchScore;
        }
    });

    return (
        <div>
            <div className="d-flex justify-between align-center mb-4">
                <h2>Company Dashboard: <span className="text-gradient">{user.name}</span></h2>
                <button className="btn btn-primary" onClick={() => setShowNewJob(!showNewJob)}>
                    <PlusCircle size={18} /> Post New Job
                </button>
            </div>

            {showNewJob && (
                <div className="glass-card mb-4" style={{ borderColor: 'var(--primary-color)' }}>
                    <h3 className="mb-4">Post a New Job Opening</h3>
                    <form onSubmit={handlePostJob}>
                        <div className="d-flex gap-4">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Company Name</label>
                                <input type="text" className="form-control" value={newCompanyName} onChange={e => setNewCompanyName(e.target.value)} required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Job Title</label>
                                <input type="text" className="form-control" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" rows="4" value={newDesc} onChange={e => setNewDesc(e.target.value)} required></textarea>
                        </div>
                        <div className="d-flex gap-4 mt-4">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Required Skills (comma separated)</label>
                                <input type="text" className="form-control" placeholder="React, Node.js, MongoDB" value={newSkills} onChange={e => setNewSkills(e.target.value)} required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Experience Level</label>
                                <select className="form-control" value={newExp} onChange={e => setNewExp(e.target.value)} required>
                                    <option value="">Select Level</option>
                                    <option value="Junior">Junior</option>
                                    <option value="Mid-Level">Mid-Level</option>
                                    <option value="Senior">Senior</option>
                                </select>
                            </div>
                        </div>
                        <div className="d-flex gap-4">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Salary (Optional)</label>
                                <input type="text" className="form-control" placeholder="e.g. $80k - $120k" id="salaryInput" />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Location</label>
                                <input type="text" className="form-control" placeholder="Remote, New York, etc." id="locationInput" required />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-2">Publish Job</button>
                        <button type="button" className="btn btn-outline mt-2" style={{ marginLeft: 12 }} onClick={() => setShowNewJob(false)}>Cancel</button>
                    </form>
                </div>
            )}

            <div className="dashboard-grid">
                {/* Left: Jobs List */}
                <div>
                    <h3 className="mb-4">Your Active Postings</h3>
                    {jobs.length === 0 ? <p>You haven't posted any jobs yet.</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {jobs.map(job => (
                                <div key={job._id} className="glass-card" style={{ padding: '20px', cursor: 'pointer', borderColor: selectedJob?._id === job._id ? 'var(--primary-color)' : '' }} onClick={() => viewApplicants(job._id)}>
                                    <h4 style={{ margin: 0, marginBottom: '4px' }}>{job.title}</h4>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>{job.experienceLevel}</p>
                                    <button className="btn btn-outline w-100" style={{ padding: '8px' }}><Users size={16} /> View Ranked Applicants</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Applicants */}
                <div>
                    {selectedJob ? (
                        <div className="glass-card">
                            <div className="d-flex justify-between align-center mb-4">
                                <h3 className="m-0 text-gradient">Smart AI Applicants: {selectedJob.title}</h3>
                                {applications.length > 0 && (
                                    <select
                                        className="form-control"
                                        style={{ width: 'auto', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', cursor: 'pointer', fontSize: '0.9rem' }}
                                        value={sortOrder}
                                        onChange={e => setSortOrder(e.target.value)}
                                    >
                                        <option value="desc">Sort: Highest Match Score</option>
                                        <option value="asc">Sort: Lowest Match Score</option>
                                    </select>
                                )}
                            </div>
                            {applications.length === 0 ? <p>No applications yet.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {sortedApplications.map(app => (
                                        <div key={app._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                                            <div className="d-flex justify-between align-center mb-2">
                                                <h4 style={{ margin: 0 }}>{app.candidate?.name || 'Unknown Candidate'}</h4>
                                                <div className="d-flex align-center gap-2">
                                                    {app.immediateJoiner && (
                                                        <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.5)' }}>
                                                            Immediate Joiner
                                                        </span>
                                                    )}
                                                    <div className="badge d-flex align-center gap-2" style={{ background: app.matchScore > 75 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(109, 40, 217, 0.2)', color: app.matchScore > 75 ? 'var(--accent-color)' : '#c4b5fd', border: app.matchScore > 75 ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(109, 40, 217, 0.5)' }}>
                                                        <Sparkles size={14} /> {app.matchScore}% Match
                                                    </div>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Contact: {app.candidate?.email || 'N/A'}</p>

                                            {app.coverLetter && (
                                                <div className="mb-3" style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
                                                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Why hire me? (Cover Letter)</strong>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{app.coverLetter}</p>
                                                </div>
                                            )}

                                            <div style={{ fontSize: '0.9rem', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>AI Feedback: </span>
                                                <span style={{ color: 'var(--text-primary)' }}>{app.feedback}</span>
                                            </div>

                                            <div className="d-flex gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
                                                {app.resumePath && (
                                                    <button
                                                        onClick={() => handleViewResume(app._id)}
                                                        className="btn btn-outline"
                                                        style={{ padding: '6px 12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                                                    >
                                                        <FileText size={14} /> View Resume
                                                    </button>
                                                )}
                                                {app.status === 'pending' || app.status === 'shortlisted' ? (
                                                    <>
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                                                            onClick={() => updateApplicationStatus(app._id, 'accepted')}
                                                        >
                                                            Accept
                                                        </button>
                                                        {app.status === 'pending' && (
                                                            <button
                                                                className="btn btn-outline"
                                                                style={{ padding: '6px 12px', fontSize: '0.9rem', borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)' }}
                                                                onClick={() => updateApplicationStatus(app._id, 'shortlisted')}
                                                            >
                                                                Shortlist
                                                            </button>
                                                        )}
                                                        <button
                                                            className="btn btn-outline"
                                                            style={{ padding: '6px 12px', fontSize: '0.9rem', borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}
                                                            onClick={() => updateApplicationStatus(app._id, 'rejected')}
                                                        >
                                                            Decline
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '6px',
                                                        fontSize: '0.9rem',
                                                        background: app.status === 'accepted' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                        color: app.status === 'accepted' ? 'var(--accent-color)' : 'var(--danger-color)'
                                                    }}>
                                                        Currently {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="glass-card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                            <Search size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '16px' }} />
                            <h3 style={{ color: 'var(--text-secondary)' }}>Select a job posting</h3>
                            <p>Click on one of your active job postings to view AI-ranked applicants.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
