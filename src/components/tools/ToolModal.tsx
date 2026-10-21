import React, { useEffect } from 'react';
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

interface ToolModalProps {
  tool: ToolItem | null;
  onClose: () => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({ tool, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!tool) return null;

  const renderCalculator = () => {
    switch (tool.id) {
      case 'molar-mass':
        return <MolarMassCalc />;
      case 'equation-balancer':
        return <EquationBalancerCalc />;
      case 'stoichiometry':
        return <StoichiometryCalc />;
      case 'ph-calculator':
        return <PHCalc />;
      case 'molarity-dilution':
        return <MolarityCalc />;
      case 'percent-composition':
        return <PercentCompositionCalc />;
      case 'gibbs-free-energy':
        return <GibbsCalc />;
      case 'ideal-gas-law':
        return <IdealGasCalc />;
      case 'empirical-formula':
        return <EmpiricalFormulaCalc />;
      case 'oxidation-state':
        return <OxidationStateCalc />;
      default:
        return <div>Tool coming soon...</div>;
    }
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
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
        style={{
          background: '#E6E2D3',
          border: '1.5px solid #6F7F63',
          borderRadius: '16px',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
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
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
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
                {tool.category}
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
                {tool.badge}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.8rem',
                color: '#4E5B47',
                margin: 0,
                lineHeight: 1.2
              }}
            >
              {tool.title}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#5F6F5B', fontSize: '0.9rem' }}>{tool.subtitle}</p>
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
              padding: '0 4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Calculator Body */}
        {renderCalculator()}
      </div>
    </div>
  );
};

