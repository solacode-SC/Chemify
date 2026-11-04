import React, { useState } from 'react';
import { CrashCourseItem, getCrashCourse } from '../../data/toolsCrashCourseData';
import { useLanguage } from '../../i18n/LanguageContext';
import { MathEquation } from '../common/MathEquation';

interface ToolCrashCourseProps {
  toolId: string;
  onSwitchToCalculator: (preset?: any) => void;
}

export const ToolCrashCourse: React.FC<ToolCrashCourseProps> = ({
  toolId,
  onSwitchToCalculator
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const l = (en: string, fr: string, ar: string) => (language === 'ar' ? ar : language === 'fr' ? fr : en);

  const course: CrashCourseItem | undefined = getCrashCourse(toolId, language);

  // Tabs
  const [activeTab, setActiveTab] = useState<'concept' | 'formula' | 'worked' | 'quiz' | 'applications' | 'tips'>('concept');

  // Worked Example Stepper State
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [stepperMode, setStepperMode] = useState<'stepper' | 'all'>('stepper');

  // Quiz State
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Clipboard feedback
  const [copiedFormula, setCopiedFormula] = useState(false);

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#5F6F5B' }}>
        <p style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
          {l('The crash course for this tool is being prepared...', 'Le cours express pour cette calculatrice est en cours de préparation...', 'يجري تحضير الدورة المكثفة لهذه الأداة...')}
        </p>
        <button
          onClick={() => onSwitchToCalculator()}
          style={{
            background: '#4E5B47',
            color: '#FAF8F5',
            border: 'none',
            borderRadius: '999px',
            padding: '9px 24px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(78, 91, 71, 0.2)'
          }}
        >
          {l('Open Calculator', 'Ouvrir le calculateur', 'فتح الحاسبة')}
        </button>
      </div>
    );
  }

  const handleCopyFormula = (formulaText: string) => {
    navigator.clipboard?.writeText(formulaText);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  const handleQuizSelect = (index: number) => {
    setSelectedQuizOption(index);
    setQuizSubmitted(true);
  };

  const handleQuizReset = () => {
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  };

  const totalSteps = course.workedExample.steps.length;
  const currentStep = course.workedExample.steps[activeStepIndex] || course.workedExample.steps[0];

  const badgeText = course.badge === 'Basic'
    ? l('Basic Level', 'Niveau Fondamental', 'مستوى أساسي')
    : course.badge === 'Intermediate'
    ? l('Intermediate Level', 'Niveau Intermédiaire', 'مستوى متوسط')
    : l('Advanced Level', 'Niveau Avancé', 'مستوى متقدم');

  const crashCourseTabs = [
    { key: 'concept', label: l('🌿 Concept & Analogy', '🌿 Concept & Analogie', '🌿 المفهوم والتشبيه') },
    { key: 'formula', label: l('📐 Master Equation & Variables', '📐 Formule & Variables', '📐 الصيغة والمتغيرات') },
    { key: 'worked', label: l('📝 Worked Problem (Step-by-Step)', '📝 Problème résolu (Pas à pas)', '📝 مسألة محلولة (خطوة بخطوة)') },
    { key: 'quiz', label: l('🧠 Knowledge Check', '🧠 Test de connaissances', '🧠 اختبار المفاهيم') },
    { key: 'applications', label: l('⚗️ Lab Applications', '⚗️ Applications labo', '⚗️ التطبيقات المخبرية') },
    { key: 'tips', label: l('💡 Pitfalls & Pro Tips', '💡 Pièges & Astuces pro', '💡 فخاخ شائعة ونصائح') }
  ];

  return (
    <div className="tool-crash-course no-scrollbar" style={{ color: '#4E5B47', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Botanical Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(78, 91, 71, 0.08) 0%, rgba(220, 224, 207, 0.6) 100%)',
          border: '1.5px solid #6F7F63',
          borderRadius: '16px',
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '1.25rem',
          alignItems: 'center',
          boxShadow: '0 4px 16px rgba(78, 91, 71, 0.08)'
        }}
      >
        {/* Botanical Art Thumbnail */}
        <div
          style={{
            width: '95px',
            height: '95px',
            borderRadius: '14px',
            overflow: 'hidden',
            flexShrink: 0,
            border: '2px solid #6F7F63',
            boxShadow: '0 6px 16px rgba(78, 91, 71, 0.18)',
            background: '#FAF8F5'
          }}
        >
          <img
            src="assets/images/botanical-tools-guide.png"
            alt="Botanical Chemistry Guide Scene"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            loading="lazy"
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: '#4E5B47',
                color: '#FAF8F5',
                padding: '3px 9px',
                borderRadius: '6px'
              }}
            >
              {l('CRASH COURSE', 'COURS EXPRESS', 'دورة مكثفة')}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#4E5B47',
                background: '#DCE0CF',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(111, 127, 99, 0.3)'
              }}
            >
              {badgeText}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#5F6F5B',
                background: 'rgba(250, 248, 245, 0.9)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(111, 127, 99, 0.3)'
              }}
            >
              ⏱ {course.estimatedTime}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "var(--font-heading, 'Playfair Display', serif)",
              fontSize: 'clamp(1.2rem, 3vw, 1.45rem)',
              color: '#4E5B47',
              margin: '0 0 4px',
              lineHeight: 1.25
            }}
          >
            {course.title}
          </h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#5F6F5B', fontStyle: 'italic', lineHeight: 1.45 }}>
            "{course.tagline}"
          </p>
        </div>
      </div>

      {/* Crash Course Navigation Tabs */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px',
          borderBottom: '1.5px solid rgba(111, 127, 99, 0.25)'
        }}
      >
        {crashCourseTabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                background: isActive ? '#4E5B47' : '#FAF8F5',
                color: isActive ? '#FAF8F5' : '#4E5B47',
                border: '1px solid #6F7F63',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 2px 8px rgba(78, 91, 71, 0.25)' : 'none'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Concept & Mental Model */}
      {activeTab === 'concept' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.25s ease' }}>
          {/* Mental Model Analogy Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FAF8F5 0%, #F5F2EB 100%)',
              border: '1.5px solid #6F7F63',
              borderRadius: '14px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(78, 91, 71, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.35rem' }}>💡</span>
              <strong style={{ color: '#4E5B47', fontSize: '1.04rem', fontFamily: "var(--font-heading, 'Playfair Display', serif)" }}>
                {course.mentalModelAnalogy.title}
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.7, color: '#3f4a39' }}>
              {course.mentalModelAnalogy.analogy}
            </p>
          </div>

          {/* Plain English Explanation */}
          <div
            style={{
              background: '#FAF8F5',
              border: '1px solid #6F7F63',
              borderRadius: '12px',
              padding: '1.25rem'
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem', color: '#4E5B47', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📖</span> {l('What is this concept in plain English?', "De quoi s'agit-il en clair ?", 'ما هو هذا المفهوم ببساطة؟')}
            </h4>
            <p style={{ margin: '0 0 0.85rem', fontSize: '0.9rem', lineHeight: 1.65, color: '#4E5B47' }}>
              {course.plainEnglish}
            </p>

            <div
              style={{
                background: '#EDEAE1',
                borderRadius: '8px',
                padding: '10px 14px',
                borderLeft: isAr ? 'none' : '4px solid #4E5B47',
                borderRight: isAr ? '4px solid #4E5B47' : 'none'
              }}
            >
              <strong style={{ fontSize: '0.84rem', color: '#4E5B47', display: 'block', marginBottom: '2px' }}>
                {l('Why chemists rely on it:', "Pourquoi les chimistes l'utilisent :", 'لماذا يعتمد عليه الكيميائيون :')}
              </strong>
              <span style={{ fontSize: '0.86rem', color: '#5F6F5B', lineHeight: 1.55 }}>
                {course.whyItMatters}
              </span>
            </div>
          </div>

          {/* Master Equation Card with KaTeX Rendered Mathematics */}
          <div
            style={{
              background: 'linear-gradient(135deg, #E6EAD9 0%, #DCE0CF 100%)',
              border: '1.5px solid #6F7F63',
              borderRadius: '14px',
              padding: '1.25rem',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 3px 12px rgba(78, 91, 71, 0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#4E5B47', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📐</span> {l('Master Equation', 'Équation maîtresse', 'المعادلة الأساسية')}
              </span>
              <button
                onClick={() => handleCopyFormula(course.primaryEquation)}
                style={{
                  background: copiedFormula ? '#4E5B47' : '#FAF8F5',
                  color: copiedFormula ? '#FAF8F5' : '#4E5B47',
                  border: '1px solid #6F7F63',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title={l('Copy equation LaTeX', "Copier l'équation", 'نسخ المعادلة')}
              >
                {copiedFormula ? l('✓ Copied!', '✓ Copié !', '✓ تم النسخ!') : l('Copy formula', 'Copier la formule', 'نسخ الصيغة')}
              </button>
            </div>

            {/* KaTeX Math Equation Rendered */}
            <div
              style={{
                background: '#FAF8F5',
                borderRadius: '10px',
                border: '1.5px solid #6F7F63',
                padding: '14px 16px',
                margin: '6px 0 10px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
                overflowX: 'auto'
              }}
              className="no-scrollbar"
            >
              <MathEquation equation={course.primaryEquation} displayMode={true} />
            </div>

            {course.equationNote && (
              <span style={{ fontSize: '0.8rem', color: '#5F6F5B', fontStyle: 'italic', display: 'block', lineHeight: 1.5 }}>
                {course.equationNote}
              </span>
            )}
          </div>

          {/* Quick CTA to try calculator */}
          {course.calculatorPresetValue && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(78, 91, 71, 0.12) 0%, rgba(220, 224, 207, 0.7) 100%)',
                border: '1.5px solid #6F7F63',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#4E5B47', display: 'block' }}>
                  {l('Ready to test this concept right now?', 'Prêt à tester ce concept dès maintenant ?', 'جاهز لتجربة هذا المفهوم الآن؟')}
                </strong>
                <span style={{ fontSize: '0.8rem', color: '#5F6F5B' }}>
                  {course.calculatorPresetLabel || l('Jump directly into the interactive calculator.', 'Accéder directement à la calculatrice interactive.', 'انتقل مباشرة إلى الحاسبة التفاعلية المباشرة.')}
                </span>
              </div>
              <button
                onClick={() => onSwitchToCalculator(course.calculatorPresetValue)}
                style={{
                  background: '#4E5B47',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '8px 20px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(78, 91, 71, 0.25)'
                }}
              >
                <span>{l('Launch Solver', 'Lancer le solveur', 'تشغيل الحلّال')}</span>
                <span>⚡</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Formula & Variables */}
      {activeTab === 'formula' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.25s ease' }}>
          <div
            style={{
              background: '#FAF8F5',
              border: '1.5px solid #6F7F63',
              borderRadius: '14px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(78, 91, 71, 0.05)'
            }}
          >
            {/* Primary Equation Header with KaTeX */}
            <div
              style={{
                background: 'linear-gradient(135deg, #E6EAD9 0%, #DCE0CF 100%)',
                border: '1.5px solid #6F7F63',
                borderRadius: '12px',
                padding: '1.15rem',
                textAlign: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block', marginBottom: '6px', letterSpacing: '0.06em' }}>
                {l('Mathematical Formulation & Governing Principle', 'Formulation mathématique', 'الصياغة الرياضية')}
              </span>
              <div
                style={{
                  background: '#FAF8F5',
                  border: '1px solid #6F7F63',
                  borderRadius: '8px',
                  padding: '12px',
                  overflowX: 'auto'
                }}
                className="no-scrollbar"
              >
                <MathEquation equation={course.primaryEquation} displayMode={true} />
              </div>
            </div>

            <h4 style={{ margin: '0 0 0.85rem', color: '#4E5B47', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🏷️</span> {l('Glossary of Variables & Standard Units', 'Glossaire des variables & Unités standards', 'معجم المتغيرات والوحدات القياسية')}
            </h4>

            {/* Responsive Botanical Variables Table */}
            <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1.5px solid #6F7F63', background: '#FAF8F5' }} className="no-scrollbar">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#DCE0CF', color: '#4E5B47', borderBottom: '1.5px solid #6F7F63' }}>
                    <th style={{ padding: '10px 14px', width: '90px' }}>{l('Symbol', 'Symbole', 'الرمز')}</th>
                    <th style={{ padding: '10px 14px' }}>{l('Variable Name & Role', 'Nom & Signification', 'اسم المتغير ومعناه')}</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', width: '140px' }}>{l('Standard Unit', 'Unité Standard', 'الوحدة القياسية')}</th>
                  </tr>
                </thead>
                <tbody>
                  {course.variables.map((v, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid rgba(111, 127, 99, 0.2)',
                        background: idx % 2 === 0 ? '#FAF8F5' : '#F5F2EB'
                      }}
                    >
                      <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                        <code
                          style={{
                            background: '#FAF8F5',
                            border: '1px solid #6F7F63',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: '#4E5B47'
                          }}
                          className="formula-ltr"
                        >
                          {v.symbol}
                        </code>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <strong style={{ display: 'block', color: '#4E5B47', fontSize: '0.92rem' }}>{v.name}</strong>
                        <span style={{ fontSize: '0.82rem', color: '#5F6F5B', lineHeight: 1.5 }}>{v.desc}</span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: '#EDEAE1',
                            border: '1px solid #6F7F63',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            color: '#4E5B47',
                            whiteSpace: 'nowrap'
                          }}
                          className="formula-ltr"
                        >
                          {v.unit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Unit Conversions Table */}
            {course.unitConversions && course.unitConversions.length > 0 && (
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(111, 127, 99, 0.25)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block', marginBottom: '8px' }}>
                  {l('Standard Unit Conversions:', "Conversions d'unités usuelles :", 'تحويلات الوحدات القياسية :')}
                </span>
                <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1.5px solid #6F7F63', background: '#FAF8F5' }} className="no-scrollbar">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ background: '#DCE0CF', color: '#4E5B47', borderBottom: '1.5px solid #6F7F63' }}>
                        <th style={{ padding: '8px 12px', textAlign: isAr ? 'right' : 'left', width: '160px' }}>{l('Units', 'Unités', 'الوحدات')}</th>
                        <th style={{ padding: '8px 12px', textAlign: isAr ? 'right' : 'left' }}>{l('Conversion Formula', 'Formule de conversion', 'صيغة التحويل')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.unitConversions.map((uc, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(111, 127, 99, 0.2)', background: i % 2 === 0 ? '#FAF8F5' : '#F5F2EB' }}>
                          <td style={{ padding: '8px 12px', fontWeight: 700, color: '#4E5B47' }}>
                            <span className="formula-ltr">{uc.from} → {uc.to}</span>
                          </td>
                          <td style={{ padding: '8px 12px', color: '#2d3728' }} className="formula-ltr">
                            <code>{uc.formula}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Worked Problem (Interactive Stepper) */}
      {activeTab === 'worked' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.25s ease' }}>
          <div
            style={{
              background: '#FAF8F5',
              border: '1.5px solid #6F7F63',
              borderRadius: '14px',
              padding: '1.35rem',
              boxShadow: '0 4px 16px rgba(78, 91, 71, 0.05)'
            }}
          >
            {/* Header with Mode Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem' }}>📝</span>
                <strong style={{ color: '#4E5B47', fontSize: '1.05rem', fontFamily: "var(--font-heading, 'Playfair Display', serif)" }}>
                  {l('Concrete Laboratory Problem:', 'Problème concret de laboratoire :', 'مسألة مخبرية تطبيقية :')}
                </strong>
              </div>

              {/* Toggle Stepper vs All Steps */}
              <div style={{ display: 'flex', background: '#DCE0CF', padding: '2px', borderRadius: '8px', border: '1px solid #6F7F63' }}>
                <button
                  onClick={() => setStepperMode('stepper')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: stepperMode === 'stepper' ? '#4E5B47' : 'transparent',
                    color: stepperMode === 'stepper' ? '#FAF8F5' : '#4E5B47',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {l('Step by step', 'Pas à pas', 'خطوة بخطوة')}
                </button>
                <button
                  onClick={() => setStepperMode('all')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: stepperMode === 'all' ? '#4E5B47' : 'transparent',
                    color: stepperMode === 'all' ? '#FAF8F5' : '#4E5B47',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {l('Show all', 'Tout afficher', 'عرض الكل')}
                </button>
              </div>
            </div>

            <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', lineHeight: 1.65, fontWeight: 600, color: '#2d3728' }}>
              {course.workedExample.problemStatement}
            </p>

            {/* Given Information Box */}
            <div
              style={{
                background: '#DCE0CF',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '1.25rem',
                border: '1px solid #6F7F63'
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block', marginBottom: '6px' }}>
                {l('Given Initial Data:', 'Données initiales :', 'المعطيات الابتدائية :')}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {course.workedExample.given.map((g, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#FAF8F5',
                      border: '1px solid #6F7F63',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.84rem',
                      color: '#4E5B47',
                      fontWeight: 600
                    }}
                  >
                    • {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Stepper Mode */}
            {stepperMode === 'stepper' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Step Indicator Pills */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }} className="no-scrollbar">
                  {course.workedExample.steps.map((st, idx) => {
                    const isCurrent = activeStepIndex === idx;
                    const isPassed = activeStepIndex > idx;
                    return (
                      <button
                        key={st.stepNumber}
                        onClick={() => setActiveStepIndex(idx)}
                        style={{
                          background: isCurrent ? '#4E5B47' : isPassed ? '#DCE0CF' : '#FAF8F5',
                          color: isCurrent ? '#FAF8F5' : '#4E5B47',
                          border: '1px solid #6F7F63',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>{isPassed ? '✓' : l(`Step ${st.stepNumber}`, `Étape ${st.stepNumber}`, `الخطوة ${st.stepNumber}`)}</span>
                        <span>{st.title.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Card with KaTeX Math Rendered */}
                <div
                  style={{
                    background: '#EDEAE1',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    borderLeft: isAr ? 'none' : '5px solid #4E5B47',
                    borderRight: isAr ? '5px solid #4E5B47' : 'none',
                    boxShadow: '0 2px 8px rgba(78, 91, 71, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          background: '#4E5B47',
                          color: '#FAF8F5',
                          borderRadius: '50%',
                          width: '26px',
                          height: '26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.84rem',
                          fontWeight: 700
                        }}
                      >
                        {currentStep.stepNumber}
                      </span>
                      <strong style={{ fontSize: '1rem', color: '#4E5B47' }}>{currentStep.title}</strong>
                    </div>
                    <span style={{ fontSize: '0.76rem', color: '#5F6F5B', fontWeight: 600 }}>
                      {l(`Step ${activeStepIndex + 1} of ${totalSteps}`, `Étape ${activeStepIndex + 1} sur ${totalSteps}`, `الخطوة ${activeStepIndex + 1} من ${totalSteps}`)}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 10px', fontSize: '0.92rem', color: '#4E5B47', lineHeight: 1.65 }}>
                    {currentStep.explanation}
                  </p>

                  {/* KaTeX Step Math Equation */}
                  {currentStep.math && (
                    <div
                      style={{
                        background: '#FAF8F5',
                        border: '1px solid #6F7F63',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        marginTop: '8px',
                        overflowX: 'auto'
                      }}
                      className="no-scrollbar"
                    >
                      <MathEquation equation={currentStep.math} displayMode={true} />
                    </div>
                  )}

                  {/* Step Navigation Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(111, 127, 99, 0.2)' }}>
                    <button
                      onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                      disabled={activeStepIndex === 0}
                      style={{
                        background: '#FAF8F5',
                        color: activeStepIndex === 0 ? '#A8B3A0' : '#4E5B47',
                        border: '1px solid #6F7F63',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: activeStepIndex === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {l('← Previous', '← Précédent', '← السابق')}
                    </button>

                    <button
                      onClick={() => setActiveStepIndex(Math.min(totalSteps - 1, activeStepIndex + 1))}
                      disabled={activeStepIndex === totalSteps - 1}
                      style={{
                        background: '#4E5B47',
                        color: '#FAF8F5',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 18px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: activeStepIndex === totalSteps - 1 ? 'not-allowed' : 'pointer',
                        opacity: activeStepIndex === totalSteps - 1 ? 0.6 : 1
                      }}
                    >
                      {l('Next Step →', 'Étape suivante →', 'الخطوة التالية →')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* View All Mode with KaTeX Math */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {course.workedExample.steps.map(step => (
                  <div
                    key={step.stepNumber}
                    style={{
                      background: '#EDEAE1',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      borderLeft: isAr ? 'none' : '4px solid #4E5B47',
                      borderRight: isAr ? '4px solid #4E5B47' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span
                        style={{
                          background: '#4E5B47',
                          color: '#FAF8F5',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700
                        }}
                      >
                        {step.stepNumber}
                      </span>
                      <strong style={{ fontSize: '0.94rem', color: '#4E5B47' }}>{step.title}</strong>
                    </div>
                    <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#4E5B47', lineHeight: 1.6 }}>
                      {step.explanation}
                    </p>
                    {step.math && (
                      <div
                        style={{
                          background: '#FAF8F5',
                          border: '1px solid #6F7F63',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          marginTop: '6px',
                          overflowX: 'auto'
                        }}
                        className="no-scrollbar"
                      >
                        <MathEquation equation={step.math} displayMode={true} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Final Answer Banner */}
            <div
              style={{
                marginTop: '1.25rem',
                background: 'linear-gradient(135deg, #4E5B47 0%, #3b4536 100%)',
                color: '#FAF8F5',
                borderRadius: '12px',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(78, 91, 71, 0.25)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85, display: 'block', marginBottom: '2px' }}>
                  {l('Calculated Final Result:', 'Résultat final calculé :', 'النتيجة النهائية المحسوبة :')}
                </span>
                <strong style={{ fontSize: '1.15rem', letterSpacing: '0.02em' }} className="formula-ltr">
                  {course.workedExample.finalResult}
                </strong>
              </div>
              <span style={{ fontSize: '1.6rem', color: '#86efac' }}>✓</span>
            </div>

            {course.workedExample.verificationNote && (
              <p style={{ margin: '10px 0 0', fontSize: '0.84rem', color: '#5F6F5B', fontStyle: 'italic', lineHeight: 1.5 }}>
                💡 {l('Verification tip:', 'Astuce vérification :', 'نصيحة تحقق :')} {course.workedExample.verificationNote}
              </p>
            )}

            {/* Load Example into Calculator Button */}
            {course.calculatorPresetValue && (
              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <button
                  onClick={() => onSwitchToCalculator(course.calculatorPresetValue)}
                  style={{
                    width: '100%',
                    background: '#FAF8F5',
                    color: '#4E5B47',
                    border: '2px solid #4E5B47',
                    borderRadius: '12px',
                    padding: '11px 18px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(78, 91, 71, 0.12)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>⚡</span>
                  <span>{l('Test this example in the live calculator', 'Tester cet exemple dans le calculateur interactif', 'جرّب هذا المثال في الحاسبة المباشرة')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Knowledge Check (Interactive Quiz) */}
      {activeTab === 'quiz' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.25s ease' }}>
          {course.knowledgeCheck ? (
            <div
              style={{
                background: '#FAF8F5',
                border: '1.5px solid #6F7F63',
                borderRadius: '14px',
                padding: '1.5rem',
                boxShadow: '0 4px 16px rgba(78, 91, 71, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🧠</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    background: '#DCE0CF',
                    color: '#4E5B47',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {l('Knowledge Check', 'Test de connaissances', 'اختبار المفاهيم')}
                </span>
              </div>

              <h4
                style={{
                  fontFamily: "var(--font-heading, 'Playfair Display', serif)",
                  fontSize: '1.18rem',
                  color: '#4E5B47',
                  margin: '0 0 1.25rem',
                  lineHeight: 1.45
                }}
              >
                {course.knowledgeCheck.question}
              </h4>

              {/* Multiple Choice Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
                {course.knowledgeCheck.options.map((opt, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === course.knowledgeCheck!.correctIndex;
                  let bg = '#EDEAE1';
                  let border = '1px solid rgba(111, 127, 99, 0.3)';
                  let color = '#4E5B47';

                  if (quizSubmitted) {
                    if (isCorrect) {
                      bg = '#dcfce7';
                      border = '2px solid #22c55e';
                      color = '#15803d';
                    } else if (isSelected && !isCorrect) {
                      bg = '#fee2e2';
                      border = '2px solid #ef4444';
                      color = '#b91c1c';
                    }
                  } else if (isSelected) {
                    bg = '#DCE0CF';
                    border = '2px solid #4E5B47';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSelect(idx)}
                      style={{
                        background: bg,
                        border: border,
                        color: color,
                        borderRadius: '10px',
                        padding: '12px 16px',
                        textAlign: isAr ? 'right' : 'left',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#FAF8F5',
                            border: '1px solid #6F7F63',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {quizSubmitted && isCorrect && <span style={{ fontSize: '1.2rem', color: '#15803d' }}>✓</span>}
                      {quizSubmitted && isSelected && !isCorrect && <span style={{ fontSize: '1.2rem', color: '#b91c1c' }}>✗</span>}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {quizSubmitted && (
                <div
                  style={{
                    background: selectedQuizOption === course.knowledgeCheck.correctIndex ? '#f0fdf4' : '#fffbeb',
                    border: `1.5px solid ${selectedQuizOption === course.knowledgeCheck.correctIndex ? '#86efac' : '#fde68a'}`,
                    borderRadius: '10px',
                    padding: '14px 16px',
                    marginBottom: '1rem',
                    animation: 'fadeIn 0.25s ease'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px', color: selectedQuizOption === course.knowledgeCheck.correctIndex ? '#15803d' : '#b45309' }}>
                    {selectedQuizOption === course.knowledgeCheck.correctIndex
                      ? l('🎉 Spot on! Exact and accurate intuition.', '🎉 Spot on ! Excellente intuition.', '🎉 إجابة دقيقة وصحيحة تماماً!')
                      : l('💡 Not quite — here is the reasoning:', '💡 Pas tout à fait — voici comment raisonner :', '💡 ليس تماماً — إليك التفسير السليم :')}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#4E5B47', lineHeight: 1.6 }}>
                    {course.knowledgeCheck.explanation}
                  </p>

                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={handleQuizReset}
                      style={{
                        background: '#FAF8F5',
                        border: '1px solid #6F7F63',
                        borderRadius: '6px',
                        padding: '5px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#4E5B47'
                      }}
                    >
                      {l('↺ Try Question Again', '↺ Réessayer la question', '↺ إعادة المحاولة')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>{l('Knowledge check coming soon.', 'Test de connaissances bientôt disponible.', 'يجري تحضير اختبار المفاهيم قريباً.')}</p>
          )}
        </div>
      )}

      {/* Tab 5: Lab Applications */}
      {activeTab === 'applications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.25s ease' }}>
          <div
            style={{
              background: '#FAF8F5',
              border: '1px solid #6F7F63',
              borderRadius: '12px',
              padding: '1.25rem'
            }}
          >
            <h4 style={{ margin: '0 0 0.85rem', color: '#4E5B47', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚗️</span> {l('Real-World Industry & Research Applications', 'Applications en industrie et recherche', 'تطبيقات صناعية وبحثية واقعية')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {course.labApplications.map((app, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#EDEAE1',
                    border: '1px solid rgba(111, 127, 99, 0.3)'
                  }}
                >
                  <span
                    style={{
                      background: '#4E5B47',
                      color: '#FAF8F5',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {app.domain}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#4E5B47', lineHeight: 1.55 }}>
                    {app.application}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '1.25rem',
                background: '#DCE0CF',
                borderRadius: '10px',
                padding: '12px 14px',
                border: '1px solid #6F7F63'
              }}
            >
              <strong style={{ fontSize: '0.86rem', color: '#4E5B47', display: 'block', marginBottom: '3px' }}>
                🎯 {l('Hands-on Practice Challenge:', "Défi d'entraînement pratique :", 'تحدي للممارسة والتطبيق :')}
              </strong>
              <span style={{ fontSize: '0.88rem', color: '#5F6F5B', lineHeight: 1.5 }}>
                {course.recommendedPractice}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Common Traps & Pro Tips */}
      {activeTab === 'tips' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.25s ease' }}>
          <div
            style={{
              background: '#FAF8F5',
              border: '1px solid #6F7F63',
              borderRadius: '12px',
              padding: '1.25rem'
            }}
          >
            <h4 style={{ margin: '0 0 0.85rem', color: '#b91c1c', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚠️</span> {l('Common Traps in Exams & Problems', 'Pièges fréquents aux examens', 'فخاخ شائعة في الامتحانات والمسائل')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
              {course.commonTraps.map((trap, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#fef2f2',
                    border: '1.5px solid #fecaca'
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.88rem', marginBottom: '4px' }}>
                    {l('Trap:', 'Piège :', 'الفخ :')} {trap.trap}
                  </div>
                  <div style={{ color: '#4E5B47', fontSize: '0.86rem', lineHeight: 1.5 }}>
                    <strong>{l('Solution:', 'Solution :', 'الحل :')}</strong> {trap.howToAvoid}
                  </div>
                </div>
              ))}
            </div>

            <h4 style={{ margin: '0 0 0.75rem', color: '#4E5B47', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✨</span> {l('Pro Chemist Tips & Mnemonics', 'Astuces de chimistes & Mnémotechniques', 'حيل وتلميحات كيميائية احترافية')}
            </h4>
            <ul style={{ margin: 0, paddingInlineStart: '1.25rem', fontSize: '0.88rem', color: '#4E5B47', lineHeight: 1.65 }}>
              {course.proTips.map((tip, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #DCE0CF 0%, #E6E2D3 100%)',
          border: '1.5px solid #6F7F63',
          borderRadius: '12px',
          padding: '12px 18px',
          marginTop: '0.5rem',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div>
          <span style={{ fontSize: '0.88rem', color: '#4E5B47', fontWeight: 700, display: 'block' }}>
            {l('Ready to test your understanding?', 'Prêt à tester votre compréhension ?', 'هل أنت مستعد لاختبار فهمك؟')}
          </span>
          <span style={{ fontSize: '0.78rem', color: '#5F6F5B' }}>
            {course.calculatorPresetLabel
              ? l(`Click to run: ${course.calculatorPresetLabel}`, `Cliquer pour lancer : ${course.calculatorPresetLabel}`, `انقر للتشغيل: ${course.calculatorPresetLabel}`)
              : l('Go to interactive calculator with automatic validation.', 'Passer au calculateur interactif avec validation automatique.', 'انتقل إلى الحاسبة التفاعلية المباشرة مع التحقق الآلي.')}
          </span>
        </div>
        <button
          onClick={() => onSwitchToCalculator(course.calculatorPresetValue)}
          style={{
            background: '#4E5B47',
            color: '#FAF8F5',
            border: 'none',
            borderRadius: '999px',
            padding: '9px 22px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(78, 91, 71, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>{l('Open Calculator', 'Ouvrir le calculateur', 'فتح الحاسبة')}</span>
          <span>⚡</span>
        </button>
      </div>
    </div>
  );
};
