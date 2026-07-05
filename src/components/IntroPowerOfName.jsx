import React from 'react';

function IntroPowerOfName({ onStartAnalysis }) {
  return (
    <div className="intro-container" style={{ 
      padding: '3.5rem', 
      maxWidth: '850px', 
      margin: '0 auto', 
      textAlign: 'left', 
      lineHeight: '1.9', 
      color: 'var(--text-main)', 
      fontSize: '1.05rem',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: 'var(--primary)', 
        marginBottom: '3.5rem', 
        fontSize: '2rem', 
        fontWeight: '300',
        letterSpacing: '-0.5px'
      }}>
        “ 이름은 우리 인생의 설계도입니다 ”
      </h2>

      <div style={{ display: 'grid', gap: '2.5rem', marginBottom: '3.5rem' }}>
        <section>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.25rem', fontWeight: '600' }}>
            가장 먼저 받는 고귀한 선물
          </h3>
          <p style={{ color: 'var(--primary)', opacity: '0.9', fontWeight: '500' }}>
            타고난 생년월일시는 바꿀 수 없지만, 이름은 우리가 후천적으로 운명을 개척하고 유연하게 살아갈 수 있도록 돕는 가장 강력한 도구입니다.
          </p>
        </section>

        <section>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.25rem', fontWeight: '600' }}>
            이름이 우리에게 주는 영향
          </h3>
          <p style={{ color: 'var(--primary)', opacity: '0.9', fontWeight: '500' }}>
            평생 불리는 이름은 우리 삶의 진로를 알려주는 나침반이자 에너지가 됩니다. 많은 사람들이 개명이나 예명을 통해 새로운 인생의 전환점을 맞이하는 것도 바로 파동의 힘 때문입니다.
          </p>
        </section>

        <section>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.25rem', fontWeight: '600' }}>
            나를 담아내는 그릇
          </h3>
          <p style={{ color: 'var(--primary)', opacity: '0.9', fontWeight: '500' }}>
            이름은 나를 담는 그릇과 같습니다. 아무리 노력해도 결과가 부족하다면 이름의 파동을 점검해 보아야 합니다. 내게 맞는 좋은 이름은 조금의 노력으로도 큰 시너지를 만들어냅니다.
          </p>
        </section>

        <section>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.25rem', fontWeight: '600' }}>
            소리에너지에 담긴 비밀
          </h3>
          <p style={{ color: 'var(--primary)', opacity: '0.9', fontWeight: '500' }}>
            이름 속에는 학업, 재물, 진로 등 인생의 다양한 설계도가 담겨 있습니다. 그 수수께끼 같은 삶의 비밀을 바로 '소리에너지'를 통해 풀어낼 수 있습니다.
          </p>
        </section>
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <button className="btn-primary" onClick={onStartAnalysis} style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '30px', fontWeight: 'bold' }}>
          ✨ 나의 이름 분석하기
        </button>
      </div>
    </div>
  );
}

export default IntroPowerOfName;
