import React, { useState, useEffect } from 'react';
import NameAnalyzer from './components/NameAnalyzer';
import IntroPowerOfName from './components/IntroPowerOfName';
import ConsultationForm from './components/ConsultationForm';
import { supabase } from './supabase';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentView, setCurrentView] = useState('analyzer');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Supabase 로그인 상태 감지
  useEffect(() => {
    if (!supabase) return; // Supabase 설정이 안되어있으면 무시

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (!supabase) {
      setAuthError('.env.local 파일에 Supabase URL과 KEY를 먼저 입력해주세요!');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setAuthError('로그인 실패: 이메일이나 비밀번호를 확인해주세요.');
    } else {
      setShowAdminLogin(false);
      setEmail('');
      setPassword('');
    }
  };

  const handleAdminLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="app-container">
      {/* Floating System Metadata Decorators */}
      
      <div className="floating-metadata floating-metadata-tr" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
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
              {authError && <div style={{ color: 'red', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>{authError}</div>}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <input 
                  type="email" 
                  className="input-text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <input 
                  type="password" 
                  className="input-text"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '100%', position: 'relative' }}>
        
        {/* Left Dropdown Menu */}
        <div style={{ position: 'absolute', top: '0', left: '20px', zIndex: 100 }}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'rgba(20, 20, 20, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'var(--text-main)',
              padding: '10px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(20, 20, 20, 0.6)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(20, 20, 20, 0.4)'}
          >
            <span style={{ fontSize: '1.2rem' }}>{isMenuOpen ? '✕' : '☰'}</span> Category
          </button>
          {isMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '50px',
              left: '0',
              background: 'var(--color-bg-mid)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
              width: '200px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <button 
                onClick={() => { setCurrentView('analyzer'); setIsMenuOpen(false); }}
                style={{
                  background: currentView === 'analyzer' ? 'var(--primary)' : 'transparent',
                  color: currentView === 'analyzer' ? '#fff' : 'var(--text-main)',
                  border: 'none',
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem',
                  fontWeight: currentView === 'analyzer' ? 'bold' : 'normal'
                }}
                onMouseEnter={(e) => { if (currentView !== 'analyzer') e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={(e) => { if (currentView !== 'analyzer') e.currentTarget.style.background = 'transparent' }}
              >
                ✨ 나의 이름 분석하기
              </button>
              <button 
                onClick={() => { setCurrentView('intro'); setIsMenuOpen(false); }}
                style={{
                  background: currentView === 'intro' ? 'var(--primary)' : 'transparent',
                  color: currentView === 'intro' ? '#fff' : 'var(--text-main)',
                  border: 'none',
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem',
                  fontWeight: currentView === 'intro' ? 'bold' : 'normal'
                }}
                onMouseEnter={(e) => { if (currentView !== 'intro') e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={(e) => { if (currentView !== 'intro') e.currentTarget.style.background = 'transparent' }}
              >
                📖 이름이 주는 힘
              </button>
              
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '4px 0' }} />
              
              <button 
                onClick={() => { 
                  setCurrentView('consultation'); 
                  setIsMenuOpen(false); 
                }}
                style={{
                  background: currentView === 'consultation' ? 'var(--primary)' : 'transparent',
                  color: currentView === 'consultation' ? '#fff' : 'var(--secondary)',
                  border: 'none',
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
                onMouseEnter={(e) => { if (currentView !== 'consultation') e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={(e) => { if (currentView !== 'consultation') e.currentTarget.style.background = 'transparent' }}
              >
                📝 상담신청서 작성
              </button>
            </div>
          )}
        </div>

        {currentView === 'intro' ? (
          <IntroPowerOfName onStartAnalysis={() => setCurrentView('analyzer')} />
        ) : currentView === 'consultation' ? (
          <ConsultationForm onBack={() => setCurrentView('analyzer')} />
        ) : (
          <NameAnalyzer />
        )}
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
