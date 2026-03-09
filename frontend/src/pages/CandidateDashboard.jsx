import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { FileText, Send, CheckCircle, Briefcase, User as UserIcon, Sparkles, Filter, MapPin, DollarSign, Clock, Home, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CandidateDashboard = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [expandedAppId, setExpandedAppId] = useState(null);

    // Application Form State
    const [applyingJobId, setApplyingJobId] = useState(null);
    const [resume, setResume] = useState(null);
    const [isImmediateJoiner, setIsImmediateJoiner] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [message, setMessage] = useState('');

    // Filter State
    const [profileFilter, setProfileFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [wfhFilter, setWfhFilter] = useState(false);
    const [partTimeFilter, setPartTimeFilter] = useState(false);
    const [stipendFilter, setStipendFilter] = useState(0);

    // Tab State
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'applied'

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs');
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyApplications = async () => {
        try {
            const res = await api.get('/applications/my');
            setMyApplications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchMyApplications();
    }, []);

    const handleApply = async (e, jobId) => {
        e.preventDefault();
        if (!resume) {
            setMessage('Please upload an application resume.');
            return;
        }
        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('immediateJoiner', isImmediateJoiner);
        formData.append('coverLetter', coverLetter);

        try {
            setMessage('Submitting your application...');
            await api.post(`/applications/${jobId}/apply`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Application submitted successfully!');
            setApplyingJobId(null);
            setResume(null);
            setIsImmediateJoiner(false);
            setCoverLetter('');
            fetchMyApplications(); // Refresh my applications
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error applying');
        }
        setTimeout(() => setMessage(''), 5000);
    };

    const appliedJobIds = myApplications.map(app => app.job._id);

    const clearFilters = () => {
        setProfileFilter('');
        setLocationFilter('');
        setWfhFilter(false);
        setPartTimeFilter(false);
        setStipendFilter(0);
    };

    const filteredJobs = jobs.filter(job => {
        // Exclude jobs the user has already applied for
        if (appliedJobIds.includes(job._id)) {
            return false;
        }

        const matchesProfile = job.title.toLowerCase().includes(profileFilter.toLowerCase()) ||
            job.requiredSkills.some(s => s.toLowerCase().includes(profileFilter.toLowerCase()));
        const matchesLocation = job.location ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
        const matchesWfh = wfhFilter ? (job.location && job.location.toLowerCase().includes('remote')) : true;
        const matchesPartTime = partTimeFilter ? (job.title.toLowerCase().includes('part time') || job.title.toLowerCase().includes('part-time')) : true;

        // Simple heuristic for salary comparison against stipend slider (this assumes salary field has numbers, which might be tricky but good for UI demo)
        const jobSalaryNum = job.salary ? parseInt(job.salary.replace(/[^0-9]/g, ''), 10) : 0;
        // If slider is > 0, we require the job to have a salary number greater than the slider, or not filter by it if we can't parse it well.
        // For actual robust scaling, the backend should send min/max numbers.
        const matchesStipend = stipendFilter > 0 ? (jobSalaryNum === 0 || jobSalaryNum >= stipendFilter) : true;

        return matchesProfile && matchesLocation && matchesWfh && matchesPartTime && matchesStipend;
    });

    const renderCharts = () => {
        if (myApplications.length === 0) return null;

        const counts = { pending: 0, shortlisted: 0, accepted: 0, rejected: 0 };
        myApplications.forEach(app => {
            const status = app.status || 'pending';
            if (counts[status] !== undefined) {
                counts[status]++;
            }
        });

        const chartData = [
            { name: 'Pending', value: counts.pending, color: '#c4b5fd' },
            { name: 'Shortlisted', value: counts.shortlisted, color: '#06b6d4' },
            { name: 'Selected', value: counts.accepted, color: '#10b981' },
            { name: 'Rejected', value: counts.rejected, color: '#ef4444' }
        ].filter(d => d.value > 0);

        const totalApplied = myApplications.length;

        return (
            <div className="glass-card mb-4" style={{ padding: '24px' }}>
                <div className="d-flex justify-between align-center mb-4">
                    <h3 className="m-0 d-flex align-center gap-2">
                        <PieChartIcon size={20} color="var(--primary-color)" />
                        Application Overview
                    </h3>
                    <div className="badge" style={{ background: 'rgba(109, 40, 217, 0.2)', color: '#c4b5fd', border: '1px solid rgba(109, 40, 217, 0.5)', padding: '6px 16px', fontSize: '0.9rem' }}>
                        Total Applied: {totalApplied}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div style={{ height: '220px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ textAlign: 'center', margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>Status Distribution</h4>
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--surface-border)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div style={{ height: '220px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ textAlign: 'center', margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>Application Pipeline</h4>
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--surface-border)', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="d-flex justify-between align-center mb-4">
                <h2>Welcome, <span className="text-gradient">{user.name}</span></h2>
                <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <button
                        className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '8px 24px', border: activeTab === 'all' ? 'none' : '' }}
                        onClick={() => setActiveTab('all')}
                    >
                        <Briefcase size={16} /> All Jobs
                    </button>
                    <button
                        className={`btn ${activeTab === 'applied' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '8px 24px', border: activeTab === 'applied' ? 'none' : '' }}
                        onClick={() => setActiveTab('applied')}
                    >
                        <CheckCircle size={16} /> My Applications
                    </button>
                    <button
                        className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '8px 24px', border: activeTab === 'overview' ? 'none' : '' }}
                        onClick={() => setActiveTab('overview')}
                    >
                        <PieChartIcon size={16} /> Overview
                    </button>
                </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '320px 1fr' }}>

                {/* Left Sidebar - Filters */}
                <div>
                    <div className="glass-card mb-4">
                        <div className="d-flex justify-between align-center mb-4">
                            <h3 className="d-flex align-center gap-2 m-0"><Filter size={18} /> Filters</h3>
                            <button onClick={clearFilters} style={{ background: 'transparent', border: 'none', color: 'var(--secondary-color)', cursor: 'pointer', fontSize: '0.85rem' }}>Clear all</button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Profile</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Software Engineer"
                                value={profileFilter}
                                onChange={e => setProfileFilter(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Remote, New York"
                                value={locationFilter}
                                onChange={e => setLocationFilter(e.target.value)}
                            />
                        </div>

                        <div className="form-group mt-4">
                            <label className="d-flex align-center gap-2 mb-3" style={{ cursor: 'pointer' }}>
                                <input type="checkbox" checked={wfhFilter} onChange={e => setWfhFilter(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--primary-color)' }} />
                                <span style={{ color: 'var(--text-primary)' }}>Work from home</span>
                            </label>
                            <label className="d-flex align-center gap-2" style={{ cursor: 'pointer' }}>
                                <input type="checkbox" checked={partTimeFilter} onChange={e => setPartTimeFilter(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--primary-color)' }} />
                                <span style={{ color: 'var(--text-primary)' }}>Part-time</span>
                            </label>
                        </div>

                        <div className="form-group mt-4">
                            <label className="form-label d-flex justify-between">
                                Minimum Stipend (k)
                                <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{stipendFilter > 0 ? `${stipendFilter}k+` : 'Any'}</span>
                            </label>
                            <input
                                type="range"
                                className="w-100"
                                min="0"
                                max="150"
                                step="10"
                                value={stipendFilter}
                                onChange={e => setStipendFilter(parseInt(e.target.value))}
                                style={{ accentColor: 'var(--secondary-color)' }}
                            />
                            <div className="d-flex justify-between mt-2" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <span>0</span>
                                <span>50k</span>
                                <span>100k</span>
                                <span>150k</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Content - Jobs/Applications */}
                <div>
                    {message && <div style={{ padding: '12px', background: 'rgba(109,40,217,0.2)', border: '1px solid var(--primary-color)', borderRadius: '8px', margin: '0 0 16px 0', color: '#c4b5fd' }}><Sparkles size={16} style={{ display: 'inline', marginRight: 8 }} />{message}</div>}

                    {activeTab === 'all' ? (
                        <>
                            {filteredJobs.length === 0 ? (
                                <div className="glass-card text-center" style={{ padding: '40px' }}>
                                    <Filter size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '16px' }} />
                                    <h4 style={{ color: 'var(--text-secondary)' }}>No jobs match your filters</h4>
                                    <p>Try adjusting your search criteria to see more active listings.</p>
                                    <button className="btn btn-outline mt-2" onClick={clearFilters}>Clear Filters</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {filteredJobs.map(job => {
                                        const hasApplied = appliedJobIds.includes(job._id);
                                        const myApp = myApplications.find(a => a.job._id === job._id);

                                        return (
                                            <div key={job._id} className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                                                {/* Actively Hiring Tag */}
                                                <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-color)', padding: '6px 16px', fontSize: '0.75rem', fontWeight: 600, borderBottomLeftRadius: '12px', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Sparkles size={12} /> Actively hiring
                                                </div>

                                                <div className="d-flex justify-between mt-2">
                                                    <div>
                                                        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.4rem' }}>{job.title}</h3>
                                                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px', marginBottom: '16px' }}>
                                                            {job.companyName || job.company?.name || 'Unknown Company'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Info Row (Location, Salary, Duration/Level) */}
                                                <div className="d-flex gap-4 mb-4" style={{ flexWrap: 'wrap', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                                    {job.location && (
                                                        <div className="d-flex align-center gap-2">
                                                            <MapPin size={16} color="var(--text-secondary)" /> {job.location}
                                                        </div>
                                                    )}
                                                    {job.salary && (
                                                        <div className="d-flex align-center gap-2">
                                                            <DollarSign size={16} color="var(--text-secondary)" /> {job.salary}
                                                        </div>
                                                    )}
                                                    {job.experienceLevel && (
                                                        <div className="d-flex align-center gap-2">
                                                            <Briefcase size={16} color="var(--text-secondary)" /> {job.experienceLevel}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Description Preview */}
                                                <p style={{ lineHeight: '1.6', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '20px', marginBottom: '16px' }}>
                                                    {applyingJobId === job._id ? job.description : (job.description.length > 200 ? `${job.description.substring(0, 200)}...` : job.description)}
                                                </p>

                                                {/* Tags Row */}
                                                <div className="d-flex justify-between align-center" style={{ flexWrap: 'wrap', gap: '16px' }}>
                                                    <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
                                                        {job.requiredSkills.map(skill => (
                                                            <span key={skill} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', borderColor: 'var(--surface-border)' }}>{skill}</span>
                                                        ))}
                                                    </div>

                                                    {hasApplied ? (
                                                        <div className="badge d-flex align-center gap-2"
                                                            style={{
                                                                padding: '8px 16px', fontSize: '0.9rem',
                                                                background: myApp.status === 'accepted' ? 'rgba(16, 185, 129, 0.2)' :
                                                                    myApp.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' :
                                                                        myApp.status === 'shortlisted' ? 'rgba(6, 182, 212, 0.2)' :
                                                                            'rgba(109, 40, 217, 0.2)',
                                                                color: myApp.status === 'accepted' ? 'var(--accent-color)' :
                                                                    myApp.status === 'rejected' ? 'var(--danger-color)' :
                                                                        myApp.status === 'shortlisted' ? 'var(--secondary-color)' :
                                                                            '#c4b5fd',
                                                                borderColor: myApp.status === 'accepted' ? 'rgba(16, 185, 129, 0.5)' :
                                                                    myApp.status === 'rejected' ? 'rgba(239, 68, 68, 0.5)' :
                                                                        myApp.status === 'shortlisted' ? 'rgba(6, 182, 212, 0.5)' :
                                                                            'rgba(109, 40, 217, 0.5)'
                                                            }}
                                                        >
                                                            <CheckCircle size={16} />
                                                            {myApp.status === 'pending' ? 'Applied' : myApp.status.charAt(0).toUpperCase() + myApp.status.slice(1)}
                                                        </div>
                                                    ) : (
                                                        applyingJobId !== job._id && (
                                                            <button className="btn btn-primary" style={{ padding: '8px 24px' }} onClick={() => setApplyingJobId(job._id)}>View Details & Apply</button>
                                                        )
                                                    )}
                                                </div>

                                                {/* Application Form Expansion */}
                                                {!hasApplied && applyingJobId === job._id && (
                                                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--primary-color)', borderRadius: '12px', overflow: 'hidden', marginTop: '24px' }}>
                                                        <div style={{ padding: '16px', borderBottom: '1px solid rgba(109,40,217,0.3)', background: 'rgba(109,40,217,0.1)' }}>
                                                            <h4 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Send size={18} color="var(--primary-color)" /> Complete Application</h4>
                                                        </div>
                                                        <form onSubmit={(e) => handleApply(e, job._id)} className="p-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
                                                            <div>
                                                                <label className="form-label mb-2" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Upload your Resume (PDF)</label>
                                                                <input type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])} className="form-control" style={{ padding: '10px' }} required />
                                                            </div>

                                                            <div>
                                                                <label className="form-label mb-2" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cover Letter / Why hire you?</label>
                                                                <textarea className="form-control" rows="4" placeholder="Briefly explain your fit for this role..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)}></textarea>
                                                            </div>

                                                            <label className="d-flex align-center gap-2 mt-2" style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                                <input type="checkbox" checked={isImmediateJoiner} onChange={e => setIsImmediateJoiner(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary-color)' }} />
                                                                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>I am available to start immediately</span>
                                                            </label>

                                                            <div className="d-flex gap-3 mt-4 pt-2">
                                                                <button type="submit" className="btn btn-primary d-flex align-center gap-2" style={{ flex: 1, justifyContent: 'center' }}><CheckCircle size={18} /> Submit Application</button>
                                                                <button type="button" className="btn btn-outline" style={{ padding: '0 24px' }} onClick={() => setApplyingJobId(null)}>Cancel</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    ) : activeTab === 'applied' ? (
                        <div>
                            {myApplications.length === 0 ? (
                                <div className="glass-card text-center" style={{ padding: '40px' }}>
                                    <FileText size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '16px' }} />
                                    <h4 style={{ color: 'var(--text-secondary)' }}>No applications yet</h4>
                                    <p>When you apply for jobs, they will appear here so you can track your status.</p>
                                    <button className="btn btn-primary mt-4" onClick={() => setActiveTab('all')}>Browse Jobs</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {myApplications.map(app => (
                                        <div
                                            key={app._id}
                                            className="glass-card"
                                            style={{ padding: '24px', cursor: 'pointer', borderColor: expandedAppId === app._id ? 'var(--primary-color)' : '', transition: 'all 0.3s' }}
                                            onClick={() => setExpandedAppId(expandedAppId === app._id ? null : app._id)}
                                        >
                                            <div className="d-flex justify-between align-center pb-3 mb-3" style={{ borderBottom: expandedAppId === app._id ? '1px solid var(--surface-border)' : 'none' }}>
                                                <div>
                                                    <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem' }}>{app.job?.title || 'Unknown Job'}</h3>
                                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '4px 0 0 0' }}>{app.job?.companyName || app.job?.company?.name || 'Unknown Company'}</p>
                                                </div>
                                                <div className="badge d-flex align-center gap-2"
                                                    style={{
                                                        padding: '8px 16px', fontSize: '0.9rem',
                                                        background: app.status === 'accepted' ? 'rgba(16, 185, 129, 0.2)' :
                                                            app.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' :
                                                                app.status === 'shortlisted' ? 'rgba(6, 182, 212, 0.2)' :
                                                                    'rgba(109, 40, 217, 0.2)',
                                                        color: app.status === 'accepted' ? 'var(--accent-color)' :
                                                            app.status === 'rejected' ? 'var(--danger-color)' :
                                                                app.status === 'shortlisted' ? 'var(--secondary-color)' :
                                                                    '#c4b5fd',
                                                        borderColor: app.status === 'accepted' ? 'rgba(16, 185, 129, 0.5)' :
                                                            app.status === 'rejected' ? 'rgba(239, 68, 68, 0.5)' :
                                                                app.status === 'shortlisted' ? 'rgba(6, 182, 212, 0.5)' :
                                                                    'rgba(109, 40, 217, 0.5)'
                                                    }}
                                                >
                                                    <CheckCircle size={14} />
                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                </div>
                                            </div>

                                            {expandedAppId === app._id && app.job && (
                                                <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                                                    <div className="d-flex gap-4 mb-3" style={{ flexWrap: 'wrap', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                                        {app.job.location && (
                                                            <div className="d-flex align-center gap-2">
                                                                <MapPin size={16} color="var(--text-secondary)" /> {app.job.location}
                                                            </div>
                                                        )}
                                                        {app.job.salary && (
                                                            <div className="d-flex align-center gap-2">
                                                                <DollarSign size={16} color="var(--text-secondary)" /> {app.job.salary}
                                                            </div>
                                                        )}
                                                        {app.job.experienceLevel && (
                                                            <div className="d-flex align-center gap-2">
                                                                <Briefcase size={16} color="var(--text-secondary)" /> {app.job.experienceLevel}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p style={{ lineHeight: '1.6', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                                                        {app.job.description}
                                                    </p>

                                                    <div className="d-flex gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
                                                        {app.job.requiredSkills && app.job.requiredSkills.map(skill => (
                                                            <span key={skill} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', borderColor: 'var(--surface-border)' }}>{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                                                Applied on: {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'overview' ? (
                        <div>
                            {myApplications.length === 0 ? (
                                <div className="glass-card text-center" style={{ padding: '40px' }}>
                                    <PieChartIcon size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '16px' }} />
                                    <h4 style={{ color: 'var(--text-secondary)' }}>No application data yet</h4>
                                    <p>Apply for jobs to see your application statistics here.</p>
                                    <button className="btn btn-primary mt-4" onClick={() => setActiveTab('all')}>Browse Jobs</button>
                                </div>
                            ) : (
                                renderCharts()
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
