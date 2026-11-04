import React, { useMemo } from 'react';
import katex from 'katex';

interface MathEquationProps {
  equation: string;
  displayMode?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Safely renders LaTeX equations using KaTeX.
 * If KaTeX rendering encounters an edge case, it gracefully falls back
 * to cleanly formatted readable text with LTR direction.
 */
export const MathEquation: React.FC<MathEquationProps> = ({
  equation,
  displayMode = true,
  className = '',
  style
}) => {
  const renderedHtml = useMemo(() => {
    if (!equation) return '';
    try {
      // Normalize common chemical/math text notations if needed
      let formatted = equation.trim();
      
      // KaTeX render with error recovery
      return katex.renderToString(formatted, {
        displayMode,
        throwOnError: false,
        output: 'htmlAndMathml',
        trust: true
      });
    } catch (err) {
      console.warn('KaTeX render warning:', err);
      return '';
    }
  }, [equation, displayMode]);

  if (!renderedHtml) {
    return (
      <span className={`formula-ltr ${className}`} style={{ direction: 'ltr', unicodeBidi: 'isolate', ...style }}>
        {equation}
      </span>
    );
  }

  return (
    <div
      className={`math-equation-wrap formula-ltr ${className}`}
      style={{
        direction: 'ltr',
        unicodeBidi: 'isolate',
        textAlign: 'center',
        overflowX: 'auto',
        maxWidth: '100%',
        padding: displayMode ? '6px 0' : '0',
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

