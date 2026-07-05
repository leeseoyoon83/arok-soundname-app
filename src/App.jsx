import React, { useState, useEffect } from 'react';
import NameAnalyzer from './components/NameAnalyzer';

function App() {
  const [timeStr, setTimeStr] = useState('00:00:00');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hh}:${mm}:${ss}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin1234') { // 예시용 비밀번호
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  return (
    <div className="app-container">
      {/* Floating System Metadata Decorators */}
      <div className="floating-metadata floating-metadata-tl">
        <div>RESONANCE SYSTEM / V.05</div>
        <div style={{ opacity: 0.5, fontSize: '0.55rem', marginTop: '2px' }}>PSYCHOLOGICAL MAPPING</div>
      </div>
      
      <div className="floating-metadata floating-metadata-tr" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <div>
          <div>COORDINATES: 37.5665° N</div>
          <div style={{ opacity: 0.5, fontSize: '0.55rem', marginTop: '2px' }}>TIME: {timeStr}</div>
        </div>
        {!isAdmin ? (
          <button 
            onClick={() => setShowAdminLogin(true)}
            style={{ 
              background: 'transparent', border: '1px solid var(--text-muted)', 
              color: 'var(--text-muted)', fontSize: '0.6rem', padding: '4px 8px', 
              borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)' 
            }}>
            ADMIN LOGIN
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>ADMIN MODE</span>
            <button 
              onClick={handleAdminLogout}
              style={{ 
                background: 'transparent', border: '1px solid var(--text-muted)', 
                color: 'var(--text-muted)', fontSize: '0.6rem', padding: '4px 8px', 
                borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)' 
              }}>
              LOGOUT
            </button>
          </div>
        )}
      </div>

      {showAdminLogin && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="glass-panel" style={{ width: '300px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-brand)' }}>Admin Login</h3>
            <form onSubmit={handleAdminLogin}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <input 
                  type="password" 
                  className="input-text"
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-primary" onClick={() => setShowAdminLogin(false)} style={{ flex: 1, padding: '0.75rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', background: 'var(--text-main)', color: 'var(--color-bg-mid)' }}>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Header Area */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-subtitle">THE SOUND OF BEING</div>
          <h1 className="brand-title">아름다운 이름</h1>
          <p className="brand-desc">
            나의 삶에 에너지를 더하다.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
        <NameAnalyzer />
      </main>

      {/* Premium Footer */}
      <footer className="app-footer">
        <p>© 2026 아름다운 이름. All Rights Reserved. Designed for Sound Energy Counselors.</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.6 }}>
          본 시스템은 한글 자음과 모음을 독립적인 소리 파동의 개체로 분류하여 획수로 조율해 주는 소리에너지 전용 성명학 웹 프로그램입니다.
        </p>
      </footer>
    </div>
  );
}

export default App;
