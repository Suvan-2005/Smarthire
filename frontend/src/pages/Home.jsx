import { Link } from 'react-router-dom';
import { Sparkles, Briefcase, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background glowing orbs */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'rgba(109, 40, 217, 0.15)', borderRadius: '50%', filter: 'blur(100px)', zIndex: -1, animation: 'float 10s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: '20%', right: '-5%', width: '30vw', height: '30vw', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '50%', filter: 'blur(100px)', zIndex: -1, animation: 'float 12s ease-in-out infinite reverse' }} />

            {/* Hero Section */}
            <div className="text-center" style={{ padding: '100px 20px', maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{ animation: 'fadeInDown 0.8s ease-out' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 20px', background: 'rgba(109, 40, 217, 0.1)', borderRadius: '30px', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '32px', color: '#c4b5fd', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: '0 0 20px rgba(109,40,217,0.2)' }}>
                        <Sparkles size={16} /> Welcome to the future of hiring
                    </div>
                </div>

                <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '24px', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-1px', animation: 'fadeInUp 0.8s ease-out 0.2s backwards' }}>
                    The smartest way to <br />
                    <span className="text-gradient">build your career.</span>
                </h1>

                <p style={{ fontSize: '1.25rem', marginBottom: '40px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: 1.6, animation: 'fadeInUp 0.8s ease-out 0.4s backwards' }}>
                    CampusConnect leverages bleeding-edge AI to instantly match elite talent with the world's most innovative companies based on true compatibility, precision, and potential.
                </p>

                <div className="d-flex justify-center gap-4" style={{ animation: 'fadeInUp 0.8s ease-out 0.6s backwards' }}>
                    <Link to="/login" className="btn btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 600 }}>
                        Login
                        <Zap size={20} />
                    </Link>
                    <Link to="/signup" className="btn btn-outline" style={{ padding: '18px 40px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 600, background: 'rgba(255,255,255,0.02)' }}>
                        Signup
                    </Link>
                </div>

                {/* Social Proof */}
                <div style={{ marginTop: '60px', animation: 'fadeIn 1s ease-out 1s backwards' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Proudly developed for</p>
                    <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.8 }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '4px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                            Woxsen University
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="text-center" style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Why choose CampusConnect?</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Our proprietary AI engine goes beyond keyword matching to find the perfect fit for both candidates and companies.</p>
                </div>

                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    {/* Feature 1 */}
                    <div className="glass-card" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderTop: '2px solid rgba(109, 40, 217, 0.5)' }}>
                        <div style={{ background: 'rgba(109, 40, 217, 0.1)', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#c4b5fd', border: '1px solid rgba(109, 40, 217, 0.2)' }}>
                            <Zap size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Lightning Fast</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Instantly parse resumes and job descriptions. Get a shortlist of perfect candidates in seconds, not weeks.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="glass-card" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderTop: '2px solid rgba(6, 182, 212, 0.5)' }}>
                        <div style={{ background: 'rgba(6, 182, 212, 0.1)', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#67e8f9', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                            <Sparkles size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>AI Match Scores</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Our deep learning models assign a precise compatibility score based on skills, culture fit, and experience.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="glass-card" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderTop: '2px solid rgba(16, 185, 129, 0.5)' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <Briefcase size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Seamless Hiring</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>An intuitive dashboard to track applicants, review resumes, and manage your entire talent pipeline effortlessly.</p>
                    </div>
                </div>
            </div>

            {/* Global Styles injected for specific animations not in index.css */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}} />
        </div>
    );
};

export default Home;
