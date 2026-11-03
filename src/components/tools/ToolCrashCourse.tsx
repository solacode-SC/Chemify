import React, { useState } from 'react';
import { CrashCourseItem, TOOLS_CRASH_COURSES } from '../../data/toolsCrashCourseData';

interface ToolCrashCourseProps {
  toolId: string;
  onSwitchToCalculator: (preset?: any) => void;
}

export const ToolCrashCourse: React.FC<ToolCrashCourseProps> = ({
  toolId,
  onSwitchToCalculator
}) => {
  const course: CrashCourseItem | undefined = TOOLS_CRASH_COURSES[toolId];

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
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#5F6F5B' }}>
        <p>Crash course guide for this calculator is being prepared...</p>
        <button
          onClick={() => onSwitchToCalculator()}
          style={{
            background: '#4E5B47',
            color: '#FAF8F5',
            border: 'none',
            borderRadius: '999px',
            padding: '8px 20px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Open Calculator
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

  return (
    <div className="tool-crash-course no-scrollbar" style={{ color: '#4E5B47', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Botanical Header Card with Nano Banana Generated Art */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(78, 91, 71, 0.09) 0%, rgba(220, 224, 207, 0.55) 100%)',
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
        {/* Nano Banana Botanical Art Thumbnail */}
        <div
          style={{
            width: '95px',
            height: '95px',
            borderRadius: '14px',
            overflow: 'hidden',
            flexShrink: 0,
            border: '2px solid #6F7F63',
            boxShadow: '0 6px 16px rgba(78, 91, 71, 0.22)',
            background: '#FAF8F5'
          }}
        >
          <img
            src="assets/images/botanical-tools-guide.png"
            alt="Botanical Chemistry Study Scene generated via Nano Banana"
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
              CRASH COURSE
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#4E5B47',
                background: '#DCE0CF',
                padding: '3px 8px',
                borderRadius: '6px'
              }}
            >
              {course.badge} Level
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#5F6F5B',
                background: 'rgba(250, 248, 245, 0.85)',
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
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.2rem, 3vw, 1.45rem)',
              color: '#4E5B47',
              margin: '0 0 4px',
              lineHeight: 1.25
            }}
          >
            {course.title}
          </h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#5F6F5B', fontStyle: 'italic', lineHeight: 1.4 }}>
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
        {[
          { key: 'concept', label: '🌿 Concept & Analogy' },
          { key: 'formula', label: '📐 Formula & Variables' },
          { key: 'worked', label: '📝 Worked Problem (Stepper)' },
          { key: 'quiz', label: '🧠 Knowledge Check' },
          { key: 'applications', label: '⚗️ Lab Applications' },
          { key: 'tips', label: '💡 Traps & Pro Tips' }
        ].map(tab => {
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
                padding: '7px 13px',
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
              <strong style={{ color: '#4E5B47', fontSize: '1.02rem', fontFamily: "'Playfair Display', serif" }}>
                {course.mentalModelAnalogy.title}
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.68, color: '#3f4a39' }}>
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
              <span>📖</span> What Is It In Plain English?
            </h4>
            <p style={{ margin: '0 0 0.85rem', fontSize: '0.9rem', lineHeight: 1.65, color: '#4E5B47' }}>
              {course.plainEnglish}
            </p>

            <div
              style={{
                background: '#EDEAE1',
                borderRadius: '8px',
                padding: '10px 14px',
                borderLeft: '4px solid #4E5B47'
              }}
            >
              <strong style={{ fontSize: '0.84rem', color: '#4E5B47', display: 'block', marginBottom: '2px' }}>
                Why Chemists Rely On It:
              </strong>
              <span style={{ fontSize: '0.86rem', color: '#5F6F5B', lineHeight: 1.5 }}>
                {course.whyItMatters}
              </span>
            </div>
          </div>

          {/* Master Equation Card with Copy Button */}
          <div
            style={{
              background: '#DCE0CF',
              border: '1.5px dashed #6F7F63',
              borderRadius: '12px',
              padding: '1.15rem',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', letterSpacing: '0.06em' }}>
                Master Equation
              </span>
              <button
                onClick={() => handleCopyFormula(course.primaryEquation)}
                style={{
                  background: copiedFormula ? '#4E5B47' : '#FAF8F5',
                  color: copiedFormula ? '#FAF8F5' : '#4E5B47',
                  border: '1px solid #6F7F63',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Copy equation to clipboard"
              >
                {copiedFormula ? '✓ Copied!' : 'Copy Formula'}
              </button>
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', Courier, monospace)",
                fontSize: '1.08rem',
                fontWeight: 700,
                color: '#2d3728',
                padding: '8px 12px',
                background: '#FAF8F5',
                borderRadius: '8px',
                border: '1px solid #6F7F63',
                margin: '4px 0 8px',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              {course.primaryEquation}
            </div>

            {course.equationNote && (
              <span style={{ fontSize: '0.78rem', color: '#5F6F5B', fontStyle: 'italic', display: 'block' }}>
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
                  Ready to test this concept right now?
                </strong>
                <span style={{ fontSize: '0.8rem', color: '#5F6F5B' }}>
                  {course.calculatorPresetLabel || 'Jump directly into the live interactive calculator.'}
                </span>
              </div>
              <button
                onClick={() => onSwitchToCalculator(course.calculatorPresetValue)}
                style={{
                  background: '#4E5B47',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '7px 18px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(78, 91, 71, 0.25)'
                }}
              >
                <span>Launch Solver</span>
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
            {/* Primary Equation Header */}
            <div
              style={{
                background: '#DCE0CF',
                border: '1px solid #6F7F63',
                borderRadius: '10px',
                padding: '1rem',
                textAlign: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block', marginBottom: '4px' }}>
                Mathematical Formulation
              </span>
              <div
                style={{
                  fontFamily: "var(--font-mono, 'JetBrains Mono', Courier, monospace)",
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#2d3728',
                  wordBreak: 'break-word'
                }}
              >
                {course.primaryEquation}
              </div>
            </div>

            <h4 style={{ margin: '0 0 0.85rem', color: '#4E5B47', fontSize: '0.96rem' }}>
              Variable Glossary & Standard Units
            </h4>

            {/* Variable Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {course.variables.map((v, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: '#EDEAE1',
                    border: '1px solid rgba(111, 127, 99, 0.3)',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <code
                      style={{
                        background: '#FAF8F5',
                        border: '1px solid #6F7F63',
                        borderRadius: '6px',
                        padding: '3px 9px',
                        fontWeight: 700,
                        fontSize: '0.98rem',
                        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                        color: '#4E5B47'
                      }}
                    >
                      {v.symbol}
                    </code>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#4E5B47' }}>{v.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#5F6F5B' }}>{v.desc}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: '#FAF8F5',
                      border: '1px solid #6F7F63',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      color: '#4E5B47',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    SI: {v.unit}
                  </span>
                </div>
              ))}
            </div>

            {/* Unit Conversions Cheat Sheet */}
            {course.unitConversions && course.unitConversions.length > 0 && (
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(111, 127, 99, 0.25)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block', marginBottom: '8px' }}>
                  Standard Unit Conversions:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {course.unitConversions.map((uc, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#FAF8F5',
                        border: '1px solid #6F7F63',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.82rem'
                      }}
                    >
                      <strong style={{ color: '#4E5B47' }}>{uc.from} → {uc.to}:</strong>
                      <div style={{ fontFamily: "var(--font-mono, monospace)", color: '#5F6F5B', marginTop: '2px' }}>
                        {uc.formula}
                      </div>
                    </div>
                  ))}
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
                <span style={{ fontSize: '1.2rem' }}>📝</span>
                <strong style={{ color: '#4E5B47', fontSize: '1.05rem', fontFamily: "'Playfair Display', serif" }}>
                  Concrete Laboratory Problem:
                </strong>
              </div>

              {/* Toggle Stepper vs All Steps */}
              <div style={{ display: 'flex', background: '#DCE0CF', padding: '2px', borderRadius: '8px', border: '1px solid #6F7F63' }}>
                <button
                  onClick={() => setStepperMode('stepper')}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: stepperMode === 'stepper' ? '#4E5B47' : 'transparent',
                    color: stepperMode === 'stepper' ? '#FAF8F5' : '#4E5B47'
                  }}
                >
                  Step-by-Step
                </button>
                <button
                  onClick={() => setStepperMode('all')}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: stepperMode === 'all' ? '#4E5B47' : 'transparent',
                    color: stepperMode === 'all' ? '#FAF8F5' : '#4E5B47'
                  }}
                >
                  View All
                </button>
              </div>
            </div>

            <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 600, color: '#2d3728' }}>
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
                Given Starting Parameters:
              </span>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#4E5B47', lineHeight: 1.5 }}>
                {course.workedExample.given.map((g, idx) => (
                  <li key={idx} style={{ marginBottom: '3px' }}>{g}</li>
                ))}
              </ul>
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
                          padding: '5px 12px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <span>{isPassed ? '✓' : `Step ${st.stepNumber}`}</span>
                        <span>{st.title.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Card */}
                <div
                  style={{
                    background: '#EDEAE1',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    borderLeft: '5px solid #4E5B47',
                    boxShadow: '0 2px 8px rgba(78, 91, 71, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                          fontSize: '0.82rem',
                          fontWeight: 700
                        }}
                      >
                        {currentStep.stepNumber}
                      </span>
                      <strong style={{ fontSize: '0.96rem', color: '#4E5B47' }}>{currentStep.title}</strong>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#5F6F5B', fontWeight: 600 }}>
                      Step {activeStepIndex + 1} of {totalSteps}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#4E5B47', lineHeight: 1.6 }}>
                    {currentStep.explanation}
                  </p>

                  {currentStep.math && (
                    <code
                      style={{
                        display: 'block',
                        background: '#FAF8F5',
                        border: '1px solid #6F7F63',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        fontFamily: "var(--font-mono, 'JetBrains Mono', Courier, monospace)",
                        fontSize: '0.92rem',
                        color: '#4E5B47',
                        marginTop: '6px',
                        overflowX: 'auto'
                      }}
                    >
                      {currentStep.math}
                    </code>
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
                        padding: '5px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: activeStepIndex === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ← Previous
                    </button>

                    <button
                      onClick={() => setActiveStepIndex(Math.min(totalSteps - 1, activeStepIndex + 1))}
                      disabled={activeStepIndex === totalSteps - 1}
                      style={{
                        background: '#4E5B47',
                        color: '#FAF8F5',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 16px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: activeStepIndex === totalSteps - 1 ? 'not-allowed' : 'pointer',
                        opacity: activeStepIndex === totalSteps - 1 ? 0.6 : 1
                      }}
                    >
                      Next Step →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* View All Mode */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {course.workedExample.steps.map(step => (
                  <div
                    key={step.stepNumber}
                    style={{
                      background: '#EDEAE1',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      borderLeft: '4px solid #4E5B47'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          background: '#4E5B47',
                          color: '#FAF8F5',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}
                      >
                        {step.stepNumber}
                      </span>
                      <strong style={{ fontSize: '0.92rem', color: '#4E5B47' }}>{step.title}</strong>
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: '0.88rem', color: '#4E5B47', lineHeight: 1.55 }}>
                      {step.explanation}
                    </p>
                    {step.math && (
                      <code
                        style={{
                          display: 'block',
                          background: '#FAF8F5',
                          border: '1px solid #6F7F63',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          fontFamily: "var(--font-mono, 'JetBrains Mono', Courier, monospace)",
                          fontSize: '0.88rem',
                          color: '#4E5B47',
                          marginTop: '4px',
                          overflowX: 'auto'
                        }}
                      >
                        {step.math}
                      </code>
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
                borderRadius: '10px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(78, 91, 71, 0.25)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85, display: 'block' }}>
                  Final Calculated Result:
                </span>
                <strong style={{ fontSize: '1.05rem', letterSpacing: '0.02em' }}>{course.workedExample.finalResult}</strong>
              </div>
              <span style={{ fontSize: '1.4rem' }}>✓</span>
            </div>

            {course.workedExample.verificationNote && (
              <p style={{ margin: '10px 0 0', fontSize: '0.82rem', color: '#5F6F5B', fontStyle: 'italic' }}>
                💡 Tip: {course.workedExample.verificationNote}
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
                    padding: '10px 18px',
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
                  <span>Try This Exact Example In The Live Calculator</span>
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
                  Concept Check
                </span>
              </div>

              <h4
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.18rem',
                  color: '#4E5B47',
                  margin: '0 0 1.25rem',
                  lineHeight: 1.4
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
                        textAlign: 'left',
                        fontSize: '0.9rem',
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
                    {selectedQuizOption === course.knowledgeCheck.correctIndex ? '🎉 Spot on! Excellent intuition.' : '💡 Not quite — here is how to think about it:'}
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
                        padding: '4px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#4E5B47'
                      }}
                    >
                      ↺ Retry Question
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Knowledge check coming soon.</p>
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
              <span>⚗️</span> Real-World Industry & Research Applications
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
                      padding: '3px 8px',
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
                🎯 Take-Home Practice Challenge:
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
              <span>⚠️</span> Frequent Student & Exam Traps
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
                    Trap: {trap.trap}
                  </div>
                  <div style={{ color: '#4E5B47', fontSize: '0.86rem', lineHeight: 1.5 }}>
                    <strong>Solution:</strong> {trap.howToAvoid}
                  </div>
                </div>
              ))}
            </div>

            <h4 style={{ margin: '0 0 0.75rem', color: '#4E5B47', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✨</span> Pro Chemist Shortcuts & Mnemonics
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.88rem', color: '#4E5B47', lineHeight: 1.65 }}>
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
            Ready to test your understanding?
          </span>
          <span style={{ fontSize: '0.78rem', color: '#5F6F5B' }}>
            {course.calculatorPresetLabel ? `Click to launch: ${course.calculatorPresetLabel}` : 'Switch to the live interactive calculator with automatic validation.'}
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
          <span>Open Calculator</span>
          <span>⚡</span>
        </button>
      </div>
    </div>
  );
};
