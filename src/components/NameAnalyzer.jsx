import React, { useState } from 'react';
import { calculateSoundNumbers } from '../utils/hangulUtils';
import { Calendar, User, Sparkles, AlertCircle, Info } from 'lucide-react';
import KoreanLunarCalendar from 'korean-lunar-calendar';
import { CORE_SOUND_TYPES } from '../data/soundTypes';

export default function NameAnalyzer() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [calendarType, setCalendarType] = useState('solar'); // 'solar' or 'lunar'
  const [isIntercalation, setIsIntercalation] = useState(false);
  const [analyzedData, setAnalyzedData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;

    setIsAnalyzing(true);
    setAnalyzedData(null);
    setExpandedDetails(false);

    // 이름 분석에 생동감을 주기 위한 짧은 딜레이 효과
    setTimeout(() => {
      let analysisDate = birthDate;
      let solarConvertedDate = null;

      if (calendarType === 'lunar') {
        const parts = birthDate.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const day = parseInt(parts[2], 10);
          
          const calendar = new KoreanLunarCalendar();
          calendar.setLunarDate(year, month, day, isIntercalation);
          const solarDateObj = calendar.getSolarCalendar();
          
          if (solarDateObj && solarDateObj.year) {
            const sy = solarDateObj.year;
            const sm = String(solarDateObj.month).padStart(2, '0');
            const sd = String(solarDateObj.day).padStart(2, '0');
            solarConvertedDate = `${sy}-${sm}-${sd}`;
            analysisDate = solarConvertedDate;
          }
        }
      }

      const soundAnalysis = calculateSoundNumbers(name.trim(), analysisDate);
      
      if (soundAnalysis) {
        const totalStrokes = soundAnalysis.details.reduce((sum, item) => sum + item.total, 0);

        setAnalyzedData({
          name: name.trim(),
          birthDate,
          calendarType,
          isIntercalation,
          solarConvertedDate,
          totalStrokes,
          ...soundAnalysis
        });
      }
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div style={{ maxWidth: analyzedData ? '850px' : '500px', margin: '0 auto', width: '100%', transition: 'max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      {!analyzedData ? (
        <div className="glass-panel">
          <form onSubmit={handleSubmit}>
          {/* 이름 입력 */}
          <div className="form-group">
            <label className="form-label">한글 이름</label>
            <div className="input-glow-wrapper">
              <input
                type="text"
                className="input-text"
                placeholder="분석할 이름을 입력하세요 (예: 이서윤)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={8}
                required
              />
            </div>
          </div>

          {/* 생년월일 입력 */}
          <div className="form-group">
            <label className="form-label">실제 생년월일</label>
            <div className="input-glow-wrapper">
              <input
                type="date"
                className="input-text"
                value={birthDate}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setBirthDate('');
                    return;
                  }
                  const parts = val.split('-');
                  if (parts[0] && parts[0].length > 4) {
                    parts[0] = parts[0].slice(0, 4);
                    setBirthDate(parts.join('-'));
                  } else {
                    setBirthDate(val);
                  }
                }}
                max="9999-12-31"
                required
              />
            </div>
          </div>

          {/* 양력 / 음력 선택 */}
          <div className="form-group">
            <label className="form-label">구분</label>
            <div className="toggle-group">
              <input
                type="radio"
                id="solar"
                name="calendarType"
                value="solar"
                className="toggle-option"
                checked={calendarType === 'solar'}
                onChange={() => setCalendarType('solar')}
              />
              <label htmlFor="solar" className="toggle-label">
                <Calendar size={16} /> 양력
              </label>

              <input
                type="radio"
                id="lunar"
                name="calendarType"
                value="lunar"
                className="toggle-option"
                checked={calendarType === 'lunar'}
                onChange={() => setCalendarType('lunar')}
              />
              <label htmlFor="lunar" className="toggle-label">
                <Calendar size={16} /> 음력
              </label>
            </div>
          </div>

          {/* 윤달 체크박스 (음력 선택시에만 표시) */}
          {calendarType === 'lunar' && (
            <div className="form-group" style={{ marginTop: '-0.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isIntercalation}
                  onChange={(e) => setIsIntercalation(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                윤달 여부
              </label>
            </div>
          )}

          {/* 분석 제출 버튼 */}
          <button type="submit" className="btn-primary" disabled={isAnalyzing}>
            <Sparkles size={18} />
            {isAnalyzing ? '소리에너지 조율 중...' : '분석하기'}
          </button>
        </form>

        {isAnalyzing && (
          <div className="sound-wave-container">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        )}
      </div>
      ) : (
      <div className="glass-panel" style={{ minHeight: '430px', animation: 'fadeIn 0.5s ease-out' }}>
        <button 
          onClick={() => { setAnalyzedData(null); setName(''); setBirthDate(''); }}
          style={{ 
            background: 'rgba(255, 255, 255, 0.25)', border: '1px solid var(--glass-border)', 
            color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '8px 16px', borderRadius: '9999px',
            marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
            fontWeight: 600, transition: 'var(--transition-smooth)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--glass-hover-bg)'; e.currentTarget.style.borderColor = 'var(--glass-hover-border)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
        >
          ← 다시 분석하기
        </button>
        <div className="analysis-results-container">
            <div>
              <h2 className="name-glow-title">{analyzedData.name}</h2>
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {analyzedData.calendarType === 'lunar' ? (
                  <span>
                    음력 {analyzedData.birthDate.split('-')[0]}년 {analyzedData.birthDate.split('-')[1]}월 {analyzedData.birthDate.split('-')[2]}일
                    {analyzedData.isIntercalation ? ' (윤달)' : ''} 
                    <br/>
                    <strong style={{ color: 'var(--primary)' }}>
                      → 양력 변환: {analyzedData.solarConvertedDate.split('-')[0]}년 {analyzedData.solarConvertedDate.split('-')[1]}월 {analyzedData.solarConvertedDate.split('-')[2]}일 기준
                    </strong>
                  </span>
                ) : (
                  <span>양력 {analyzedData.birthDate.split('-')[0]}년 {analyzedData.birthDate.split('-')[1]}월 {analyzedData.birthDate.split('-')[2]}일 기준</span>
                )}
              </div>

              {/* 대시보드 뷰 - 핵심 소리수 요약 */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                
                {/* 핵심 소리수 강조 위젯 (나의 소리수) */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(179, 146, 172, 0.08) 0%, rgba(111, 138, 150, 0.08) 100%)',
                  border: '1px solid rgba(179, 146, 172, 0.22)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(62, 50, 57, 0.02)',
                  width: '100%',
                  maxWidth: '320px'
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '0.6rem' }}>
                    나의 소리수
                  </div>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--secondary) 0%, var(--primary) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.2rem',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-brand)',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(179, 146, 172, 0.25)',
                    textShadow: '0 1px 2px rgba(62, 50, 57, 0.1)',
                    marginBottom: '0.4rem'
                  }}>
                    {analyzedData.coreSoundNumber !== null ? analyzedData.coreSoundNumber : '-'}
                  </div>
                  {analyzedData.coreSoundNumber !== null && CORE_SOUND_TYPES[analyzedData.coreSoundNumber] && (
                    <div style={{
                      marginTop: '0.2rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      letterSpacing: '0.05em'
                    }}>
                      {CORE_SOUND_TYPES[analyzedData.coreSoundNumber].title}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* 핵심 소리수 성향 카드 */}
            {analyzedData.coreSoundNumber !== null && CORE_SOUND_TYPES[analyzedData.coreSoundNumber] && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(179, 146, 172, 0.05) 0%, rgba(111, 138, 150, 0.05) 100%)',
                border: '1px solid rgba(179, 146, 172, 0.18)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(62, 50, 57, 0.02)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      background: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '20px'
                    }}>핵심 성향 유형</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {CORE_SOUND_TYPES[analyzedData.coreSoundNumber].title} ({analyzedData.coreSoundNumber}번 파동)
                    </h3>
                  </div>
                  {CORE_SOUND_TYPES[analyzedData.coreSoundNumber].details && (
                    <button
                      onClick={() => setExpandedDetails(!expandedDetails)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Info size={14} />
                      {expandedDetails ? '접기' : '자세히 보기'}
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                  {CORE_SOUND_TYPES[analyzedData.coreSoundNumber].desc}
                </p>

                {/* 상세 보기 아코디언 */}
                {expandedDetails && CORE_SOUND_TYPES[analyzedData.coreSoundNumber].details && (
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px dashed rgba(179, 146, 172, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    {Object.entries({
                      '성격과 특성': CORE_SOUND_TYPES[analyzedData.coreSoundNumber].details.traits,
                      '가정': CORE_SOUND_TYPES[analyzedData.coreSoundNumber].details.family,
                      '어울리는 직업': CORE_SOUND_TYPES[analyzedData.coreSoundNumber].details.jobs,
                      '여자의 특성': CORE_SOUND_TYPES[analyzedData.coreSoundNumber].details.womenTraits,
                      '건강': CORE_SOUND_TYPES[analyzedData.coreSoundNumber].details.health,
                      '도움말': CORE_SOUND_TYPES[analyzedData.coreSoundNumber].details.advice
                    }).map(([sectionTitle, items]) => (
                      items && items.length > 0 && (
                        <div key={sectionTitle}>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '0.4rem', borderBottom: '1px solid rgba(179, 146, 172, 0.2)', paddingBottom: '0.2rem' }}>
                            {sectionTitle}
                          </h4>
                          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.8rem', lineHeight: '1.6' }}>
                            {items.map((item, i) => (
                              <li key={i} style={{ marginBottom: '0.3rem' }}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 글자 분해 카드 목록 */}
            <div className="name-char-grid" style={{ gridTemplateColumns: `repeat(${analyzedData.details.length}, 1fr)` }}>
              {analyzedData.details.map((charData, idx) => (
                <div className="char-card" key={idx} style={{
                  border: idx === 1 ? '1.5px solid var(--primary)' : '1px solid var(--glass-border)',
                  boxShadow: idx === 1 ? '0 4px 15px rgba(179, 146, 172, 0.1)' : 'none'
                }}>
                  {idx === 1 && (
                    <span style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      borderRadius: '8px'
                    }}>핵심</span>
                  )}
                  <div className="char-card-main">{charData.char}</div>
                  
                  {charData.isNonHangul ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>분석 제외</div>
                  ) : (
                    <div className="char-decomposition" style={{ borderTop: 'none', paddingTop: 0 }}>
                      {/* 주기능 소리수 */}
                      <div style={{
                        background: 'rgba(111, 138, 150, 0.06)',
                        border: '1px solid rgba(111, 138, 150, 0.12)',
                        borderRadius: '8px',
                        padding: '0.6rem 0.4rem',
                        marginBottom: '0.4rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{charData.mainSound}</div>
                      </div>

                      {/* 부기능 소리수 */}
                      <div style={{
                        background: 'rgba(219, 156, 147, 0.06)',
                        border: '1px solid rgba(219, 156, 147, 0.12)',
                        borderRadius: '8px',
                        padding: '0.6rem 0.4rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--secondary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{charData.subSound}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            

          </div>
        </div>
      )}
    </div>
  );
}
