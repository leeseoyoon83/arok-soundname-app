import React, { useState } from 'react';
import { supabase } from '../supabase';

function ConsultationForm({ onBack }) {
  const [formData, setFormData] = useState({
    applicant: '',
    contact: '',
    targetName: '',
    targetBirthDate: '',
    familyRelation: '',
    job: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validate basic inputs
    if (!formData.applicant.trim() || !formData.contact.trim() || !formData.targetName.trim()) {
      alert('신청인, 연락처, 신청자 이름은 필수 입력 항목입니다.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (supabase) {
        const { error } = await supabase.from('consultation_requests').insert([
          {
            applicant: formData.applicant.trim(),
            contact: formData.contact.trim(),
            target_name: formData.targetName.trim(),
            target_birth_date: formData.targetBirthDate.trim(),
            family_relation: formData.familyRelation.trim(),
            job: formData.job.trim(),
            email: formData.email.trim(),
          },
        ]);

        if (error) throw error;
        setSubmitStatus('success');
      } else {
        // Local simulation / fallback if supabase fails to initialize
        console.log('Form data submitted (Supabase offline):', formData);
        setSubmitStatus('success');
      }
      
      setFormData({
        applicant: '',
        contact: '',
        targetName: '',
        targetBirthDate: '',
        familyRelation: '',
        job: '',
        email: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', textAlign: 'left' }}>
      <button 
        onClick={onBack}
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
        ← 홈으로
      </button>

      <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '2rem', fontWeight: '300', fontStyle: 'italic', color: 'var(--text-main)', marginBottom: '2rem', textAlign: 'center' }}>
        상담 신청서 작성
      </h2>

      {submitStatus === 'success' ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: '600' }}>신청이 완료되었습니다!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            입력하신 내용을 바탕으로 소리에너지 전문가가 검토 후<br />
            빠른 시일 내에 연락을 드리겠습니다.
          </p>
          <button 
            className="btn-primary" 
            onClick={onBack} 
            style={{ marginTop: '2rem', maxWidth: '200px', margin: '2rem auto 0' }}
          >
            확인
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {submitStatus === 'error' && (
            <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
              신청서 제출에 실패했습니다. (Supabase 테이블 설정을 완료해 주세요)
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">1. 신청인 *</label>
            <div className="input-glow-wrapper">
              <input
                type="text"
                name="applicant"
                className="input-text"
                placeholder="신청하시는 분의 성함을 입력하세요"
                value={formData.applicant}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">2. 연락처 *</label>
            <div className="input-glow-wrapper">
              <input
                type="tel"
                name="contact"
                className="input-text"
                placeholder="예: 010-1234-5678"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">3. 신청자 이름 *</label>
            <div className="input-glow-wrapper">
              <input
                type="text"
                name="targetName"
                className="input-text"
                placeholder="분석 대상자의 이름을 입력하세요"
                value={formData.targetName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">4. 신청자 생년월일</label>
            <div className="input-glow-wrapper">
              <input
                type="text"
                name="targetBirthDate"
                className="input-text"
                placeholder="예: 1990년 1월 1일 (양력/음력 선택 기재 가능)"
                value={formData.targetBirthDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">5. 가족관계</label>
            <div className="input-glow-wrapper">
              <input
                type="text"
                name="familyRelation"
                className="input-text"
                placeholder="예: 2남 1녀 중 장녀 등"
                value={formData.familyRelation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">6. 직업</label>
            <div className="input-glow-wrapper">
              <input
                type="text"
                name="job"
                className="input-text"
                placeholder="예: 회사원, 자영업, 주부 등"
                value={formData.job}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">7. e-mail 주소</label>
            <div className="input-glow-wrapper">
              <input
                type="email"
                name="email"
                className="input-text"
                placeholder="예: email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '2.5rem' }}>
            {isSubmitting ? '제출 중...' : '📝 신청서 제출하기'}
          </button>
        </form>
      )}
    </div>
  );
}

export default ConsultationForm;
