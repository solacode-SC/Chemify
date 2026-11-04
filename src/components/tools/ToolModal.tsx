import React, { useEffect, useState } from 'react';
import { ToolItem } from '../../types/tool';
import { MolarMassCalc } from './calculators/MolarMassCalc';
import { EquationBalancerCalc } from './calculators/EquationBalancerCalc';
import { StoichiometryCalc } from './calculators/StoichiometryCalc';
import { PHCalc } from './calculators/PHCalc';
import { MolarityCalc } from './calculators/MolarityCalc';
import { PercentCompositionCalc } from './calculators/PercentCompositionCalc';
import { GibbsCalc } from './calculators/GibbsCalc';
import { IdealGasCalc } from './calculators/IdealGasCalc';
import { EmpiricalFormulaCalc } from './calculators/EmpiricalFormulaCalc';
import { OxidationStateCalc } from './calculators/OxidationStateCalc';
import { ToolCrashCourse } from './ToolCrashCourse';
import { useLanguage } from '../../i18n/LanguageContext';
import { TOOLS_TRANSLATIONS } from '../../i18n/translations/tools';

interface ToolModalProps {
  tool: ToolItem | null;
  initialTab?: 'calculator' | 'crashcourse';
  onClose: () => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({ tool, initialTab = 'calculator', onClose }) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'calculator' | 'crashcourse'>(initialTab);
  const [calculatorPreset, setCalculatorPreset] = useState<any>(null);

  // Sync initial tab when a new tool is selected
  useEffect(() => {
    setActiveTab(initialTab);
    setCalculatorPreset(null);
  }, [tool, initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!tool) return null;

  const localizedTool = TOOLS_TRANSLATIONS[language]?.[tool.id];
  const toolTitle = localizedTool?.title || tool.title;
  const toolSubtitle = localizedTool?.subtitle || tool.subtitle;
  const toolCategory = t.tools.categories[tool.category] || tool.category;
  const toolBadge = t.tools.badges[tool.badge] || tool.badge;

  const handleSwitchToCalculator = (preset?: any) => {
    if (preset) {
      setCalculatorPreset(preset);
    }
    setActiveTab('calculator');
  };

  const renderCalculator = () => {
    switch (tool.id) {
      case 'molar-mass':
        return <MolarMassCalc initialFormula={calculatorPreset?.formula} />;
      case 'equation-balancer':
        return <EquationBalancerCalc initialEquation={calculatorPreset?.equation} />;
      case 'stoichiometry':
        return (
          <StoichiometryCalc
            initialEquation={calculatorPreset?.equation}
            initialInputVal={calculatorPreset?.inputVal}
          />
        );
      case 'ph-calculator':
        return (
          <PHCalc
            initialMode={calculatorPreset?.mode}
            initialVal={calculatorPreset?.val}
          />
        );
      case 'molarity-dilution':
        return (
          <MolarityCalc
            initialTab={calculatorPreset?.tab}
            initialFormula={calculatorPreset?.formula}
            initialMass={calculatorPreset?.mass}
            initialVolume={calculatorPreset?.volume}
            initialM1={calculatorPreset?.m1}
            initialV1={calculatorPreset?.v1}
            initialM2={calculatorPreset?.m2}
            initialV2={calculatorPreset?.v2}
            initialSolveFor={calculatorPreset?.solveFor}
          />
        );
      case 'percent-composition':
        return <PercentCompositionCalc initialFormula={calculatorPreset?.formula} />;
      case 'gibbs-free-energy':
        return (
          <GibbsCalc
            initialDeltaH={calculatorPreset?.deltaH}
            initialDeltaS={calculatorPreset?.deltaS}
            initialTemp={calculatorPreset?.temp}
          />
        );
      case 'ideal-gas-law':
        return (
          <IdealGasCalc
            initialSolveFor={calculatorPreset?.solveFor}
            initialP={calculatorPreset?.p}
            initialV={calculatorPreset?.v}
            initialN={calculatorPreset?.n}
            initialT={calculatorPreset?.t}
          />
        );
      case 'empirical-formula':
        return <EmpiricalFormulaCalc initialElements={calculatorPreset?.elements} />;
      case 'oxidation-state':
        return <OxidationStateCalc initialFormula={calculatorPreset?.formula} />;
      default:
        return <div>Tool coming soon...</div>;
    }
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="no-scrollbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(35, 42, 33, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto'
      }}
    >
      <div
        className="no-scrollbar"
        style={{
          background: '#E6E2D3',
          border: '1.5px solid #6F7F63',
          borderRadius: '16px',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.18)',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '1.75rem',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid rgba(111, 127, 99, 0.3)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <span
                style={{
                  background: '#FAF8F5',
                  border: '1px solid #6F7F63',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#4E5B47'
                }}
              >
                {toolCategory}
              </span>
              <span
                style={{
                  background: '#DCE0CF',
                  border: '1px solid #6F7F63',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#5F6F5B'
                }}
              >
                {toolBadge}
              </span>
            </div>
            <h2
              className="section-title"
              style={{
                fontSize: '1.75rem',
                color: '#4E5B47',
                margin: 0,
                lineHeight: 1.2
              }}
            >
              {toolTitle}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#5F6F5B', fontSize: '0.88rem' }}>{toolSubtitle}</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.75rem',
              color: '#4E5B47',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 4px',
              transition: 'transform 0.15s ease'
            }}
          >
            ×
          </button>
        </div>

        {/* Tab Toggle: Interactive Calculator vs Crash Course */}
        <div
          style={{
            display: 'flex',
            background: '#DCE0CF',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid #6F7F63',
            gap: '4px'
          }}
        >
          <button
            onClick={() => setActiveTab('calculator')}
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'calculator' ? '#4E5B47' : 'transparent',
              color: activeTab === 'calculator' ? '#FAF8F5' : '#4E5B47',
              boxShadow: activeTab === 'calculator' ? '0 2px 6px rgba(78, 91, 71, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🧮</span>
            <span>{language === 'ar' ? 'حاسبة تفاعلية' : language === 'fr' ? 'Calculateur Interactif' : 'Interactive Calculator'}</span>
          </button>

          <button
            onClick={() => setActiveTab('crashcourse')}
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'crashcourse' ? '#4E5B47' : 'transparent',
              color: activeTab === 'crashcourse' ? '#FAF8F5' : '#4E5B47',
              boxShadow: activeTab === 'crashcourse' ? '0 2px 6px rgba(78, 91, 71, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span>📖</span>
            <span>{language === 'ar' ? 'دليل تعليمي وشرح' : language === 'fr' ? 'Guide & Cours Express' : 'Guide & Crash Course'}</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="no-scrollbar" style={{ overflowY: 'visible' }}>
          {activeTab === 'calculator' ? (
            renderCalculator()
          ) : (
            <ToolCrashCourse
              toolId={tool.id}
              onSwitchToCalculator={handleSwitchToCalculator}
            />
          )}
        </div>
      </div>
    </div>
  );
};
