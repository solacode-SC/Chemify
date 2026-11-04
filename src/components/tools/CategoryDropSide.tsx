import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ToolCategory, ToolItem } from '../../types/tool';
import { TOOLS_DATA } from '../../data/toolsData';
import { TOOLS_TRANSLATIONS } from '../../i18n/translations/tools';
import { useLanguage } from '../../i18n/LanguageContext';

export interface CategoryInfo {
  id: ToolCategory;
  icon: string;
  titles: { en: string; fr: string; ar: string };
  descriptions: { en: string; fr: string; ar: string };
  toolIds: string[];
}

export const CATEGORY_DETAILS: Record<ToolCategory, CategoryInfo> = {
  All: {
    id: 'All',
    icon: '🌿',
    titles: {
      en: 'All Chemistry Tools',
      fr: 'Tous les Outils Chimiques',
      ar: 'جميع الأدوات الكيميائية'
    },
    descriptions: {
      en: 'Complete suite of 10 visual solvers, matrix equation balancers, and interactive crash courses.',
      fr: 'Suite complète de 10 calculateurs visuels, équilibreurs matriciels et cours express interactifs.',
      ar: 'المجموعة الكاملة المكونة من 10 حاسبات كيميائية، وموازنة معادلات بالمصفوفات، وشروحات تفاعلية.'
    },
    toolIds: [
      'molar-mass',
      'stoichiometry',
      'equation-balancer',
      'ph-calculator',
      'molarity-dilution',
      'percent-composition',
      'gibbs-free-energy',
      'ideal-gas-law',
      'empirical-formula',
      'oxidation-state'
    ]
  },
  Calculations: {
    id: 'Calculations',
    icon: '⚖️',
    titles: {
      en: 'Mass & Stoichiometry',
      fr: 'Calculs de Masse & Stœchiométrie',
      ar: 'حسابات الكتلة والستوكيومترية'
    },
    descriptions: {
      en: 'Compute molar weights, mole-to-mass ratios, theoretical yields, percent compositions, and empirical formulas.',
      fr: 'Calculez les masses molaires, rapports molaires, rendements théoriques, pourcentages massiques et formules empiriques.',
      ar: 'احسب الكتل المولية، والعلاقات الكتلية والمولية، والإنتاجية النظرية، والنسب المئوية، والصيغ الأولية.'
    },
    toolIds: ['molar-mass', 'stoichiometry', 'percent-composition', 'empirical-formula']
  },
  Equations: {
    id: 'Equations',
    icon: '⚗️',
    titles: {
      en: 'Chemical Equations & Redox',
      fr: 'Équations Chimiques & Rédox',
      ar: 'المعادلات الكيميائية والتأكسد'
    },
    descriptions: {
      en: 'Automatically balance complex reactions with matrix linear algebra and assign oxidation numbers to elements.',
      fr: 'Équilibrez automatiquement les équations par algèbre linéaire et attribuez les degrés d’oxydation aux éléments.',
      ar: 'وازن المعادلات الكيميائية المعقدة بمصفوفات الجبر الخطي وعيّن درجات التأكسد لجميع العناصر.'
    },
    toolIds: ['equation-balancer', 'oxidation-state']
  },
  Solutions: {
    id: 'Solutions',
    icon: '🧪',
    titles: {
      en: 'Solutions, pH & Acid-Base',
      fr: 'Solutions, pH & Acido-Basicité',
      ar: 'المحاليل والأحماض وpH'
    },
    descriptions: {
      en: 'Calculate pH, pOH, ion concentrations [H⁺] & [OH⁻], solution molarity from mass, and serial dilutions.',
      fr: 'Calculez pH, pOH, concentrations ioniques [H⁺] et [OH⁻], molarités de préparation et dilutions en cascade.',
      ar: 'احسب قيم pH وpOH، وتراكيز أيونات [H⁺] و[OH⁻]، والتركيز المولي للمحاليل، وعمليات التخفيف.'
    },
    toolIds: ['ph-calculator', 'molarity-dilution']
  },
  Thermodynamics: {
    id: 'Thermodynamics',
    icon: '⚡',
    titles: {
      en: 'Thermodynamics & Spontaneity',
      fr: 'Thermodynamique & Spontanéité',
      ar: 'الديناميكا الحرارية والتلقائية'
    },
    descriptions: {
      en: 'Assess reaction spontaneity from ΔG = ΔH - TΔS and determine critical equilibrium temperature boundaries.',
      fr: 'Évaluez la spontanéité d’une réaction via ΔG = ΔH - TΔS et déterminez la température d’inversion Teq.',
      ar: 'قيّم التلقائية الديناميكية الحرارية عبر علاقة ΔG = ΔH - TΔS وحدد درجة حرارة التوازن والانعكاس.'
    },
    toolIds: ['gibbs-free-energy']
  },
  'Gas Laws': {
    id: 'Gas Laws',
    icon: '🎈',
    titles: {
      en: 'Ideal Gas Laws (PV = nRT)',
      fr: 'Lois des Gaz Parfaits (PV = nRT)',
      ar: 'قوانين الغازات المثالية (PV = nRT)'
    },
    descriptions: {
      en: 'Solve for pressure, volume, moles, or temperature in PV = nRT across multi-unit engineering systems.',
      fr: 'Résolvez pour la pression, le volume, les moles ou la température dans PV = nRT avec conversions d’unités.',
      ar: 'احسب الضغط أو الحجم أو كمية المادة أو درجة الحرارة في علاقة PV = nRT بمختلف الوحدات القياسية.'
    },
    toolIds: ['ideal-gas-law']
  },
  Reference: {
    id: 'Reference',
    icon: '📚',
    titles: {
      en: 'Chemical Reference & Rules',
      fr: 'Références & Règles Chimiques',
      ar: 'المراجع والقواعد الكيميائية'
    },
    descriptions: {
      en: 'Quick reference tools for oxidation state rules, pH color spectrums, and standard molar weights.',
      fr: 'Outils de référence rapide pour les règles d’oxydation, spectres colorimétriques de pH et masses standards.',
      ar: 'أدوات مرجعية سريعة لقواعد درجات التأكسد، وأطياف ألوان pH، والكتل الذرية القياسية.'
    },
    toolIds: ['oxidation-state', 'ph-calculator', 'molar-mass']
  }
};

interface CategoryDropSideProps {
  categories: ToolCategory[];
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  onOpenTool: (tool: ToolItem, mode: 'calculator' | 'crashcourse') => void;
}

/**
 * Drop-Side Category Explorer:
 * Renders an "Explore Categories 🌿 ▾" trigger that opens a multi-level
 * flyout menu where hovering over any category in the list displays a drop-side
 * preview panel on the right (or left in RTL) showing its detailed summary, tools,
 * and quick-launch buttons.
 */
export const CategoryDropSide: React.FC<CategoryDropSideProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenTool
}) => {
  const { language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<ToolCategory>(selectedCategory || 'All');
  const containerRef = useRef<HTMLDivElement | null>(null);

  const l = (en: string, fr: string, ar: string) => (language === 'ar' ? ar : language === 'fr' ? fr : en);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeCategoryInfo = CATEGORY_DETAILS[hoveredCategory] || CATEGORY_DETAILS.All;
  const activeTitle = activeCategoryInfo.titles[language] || activeCategoryInfo.titles.en;
  const activeDesc = activeCategoryInfo.descriptions[language] || activeCategoryInfo.descriptions.en;

  const categoryTools = useMemo(() => {
    return activeCategoryInfo.toolIds
      .map(id => TOOLS_DATA.find(t => t.id === id))
      .filter((t): t is ToolItem => Boolean(t));
  }, [activeCategoryInfo]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Drop-Side Explorer Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isOpen ? '#4E5B47' : '#DCE0CF',
          color: isOpen ? '#FAF8F5' : '#4E5B47',
          border: '1.5px solid #6F7F63',
          borderRadius: '999px',
          padding: '8px 18px',
          fontWeight: 700,
          fontSize: '0.88rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
        aria-expanded={isOpen}
      >
        <span>🌿</span>
        <span>{l('Explore Categories', 'Explorer les Catégories', 'استكشاف الأقسام')}</span>
        <span style={{ fontSize: '0.75rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
          ▾
        </span>
      </button>

      {/* Drop-Side Multi-Level Flyout Container */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            [isRTL ? 'right' : 'left']: 0,
            zIndex: 120,
            background: '#FAF8F5',
            border: '2px solid #6F7F63',
            borderRadius: '16px',
            boxShadow: '0 16px 38px rgba(78, 91, 71, 0.22)',
            display: 'grid',
            gridTemplateColumns: '230px 370px',
            minWidth: '600px',
            maxWidth: '92vw',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {/* Side Menu (Column 1): List of Categories with Hover */}
          <div
            style={{
              background: '#EDEAE1',
              borderRight: isRTL ? 'none' : '1.5px solid rgba(111, 127, 99, 0.3)',
              borderLeft: isRTL ? '1.5px solid rgba(111, 127, 99, 0.3)' : 'none',
              padding: '10px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ padding: '6px 10px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', letterSpacing: '0.06em' }}>
              {l('Chemistry Branches', 'Branches Chimiques', 'فروع الكيمياء')}
            </div>

            {categories.map(cat => {
              const info = CATEGORY_DETAILS[cat] || CATEGORY_DETAILS.All;
              const title = info.titles[language] || info.titles.en;
              const isHovered = hoveredCategory === cat;
              const isCurrent = selectedCategory === cat;

              return (
                <div
                  key={cat}
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onClick={() => {
                    onSelectCategory(cat);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isHovered ? '#4E5B47' : isCurrent ? 'rgba(78, 91, 71, 0.12)' : 'transparent',
                    color: isHovered ? '#FAF8F5' : '#4E5B47',
                    fontWeight: isHovered || isCurrent ? 700 : 600,
                    fontSize: '0.86rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span style={{ fontSize: '1.05rem', flexShrink: 0 }}>{info.icon}</span>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{title}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      opacity: isHovered ? 0.9 : 0.65,
                      flexShrink: 0,
                      transform: isRTL ? 'rotate(180deg)' : 'none'
                    }}
                  >
                    →
                  </span>
                </div>
              );
            })}
          </div>

          {/* Drop-Side Preview Panel (Column 2): Dynamic Tools Preview */}
          <div
            style={{
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#FAF8F5',
              maxHeight: '440px',
              overflowY: 'auto'
            }}
            className="no-scrollbar"
          >
            {/* Header of Active Branch */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{activeCategoryInfo.icon}</span>
                  <h4
                    style={{
                      margin: 0,
                      color: '#4E5B47',
                      fontSize: '1.05rem',
                      fontFamily: "var(--font-heading, 'Playfair Display', serif)"
                    }}
                  >
                    {activeTitle}
                  </h4>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: '#DCE0CF',
                    color: '#4E5B47',
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}
                >
                  {categoryTools.length} {l('tools', 'outils', 'أدوات')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#5F6F5B', lineHeight: 1.5 }}>
                {activeDesc}
              </p>
            </div>

            {/* List of tools in this branch */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categoryTools.map(t => {
                const localized = TOOLS_TRANSLATIONS[language]?.[t.id];
                const title = localized?.title || t.title;

                return (
                  <div
                    key={t.id}
                    style={{
                      background: '#FAF8F5',
                      border: '1px solid rgba(111, 127, 99, 0.35)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <img
                        src={t.iconPath}
                        alt={title}
                        style={{ width: '28px', height: '28px', objectFit: 'contain', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <strong
                          style={{
                            fontSize: '0.84rem',
                            color: '#4E5B47',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {title}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: '#7E8E76' }}>
                          {t.badge}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button
                        onClick={() => {
                          onOpenTool(t, 'calculator');
                          setIsOpen(false);
                        }}
                        style={{
                          background: '#4E5B47',
                          color: '#FAF8F5',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        title={l('Open live solver', 'Ouvrir le solveur', 'تشغيل الحلّال')}
                      >
                        🧮
                      </button>
                      <button
                        onClick={() => {
                          onOpenTool(t, 'crashcourse');
                          setIsOpen(false);
                        }}
                        style={{
                          background: '#EDEAE1',
                          color: '#4E5B47',
                          border: '1px solid #6F7F63',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        title={l('Open crash course guide', 'Ouvrir le guide', 'فتح الدليل')}
                      >
                        📖
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filter by Category CTA */}
            <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(111, 127, 99, 0.2)' }}>
              <button
                onClick={() => {
                  onSelectCategory(hoveredCategory);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  background: '#4E5B47',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>{l(`Show all in "${activeTitle}"`, `Afficher tout dans "${activeTitle}"`, `عرض الكل في "${activeTitle}"`)}</span>
                <span>↓</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface CategoryChipItemProps {
  category: ToolCategory;
  isSelected: boolean;
  onSelect: () => void;
  onOpenTool: (tool: ToolItem, mode: 'calculator' | 'crashcourse') => void;
}

/**
 * Individual Category Chip with Drop-Side Hover Preview Popover.
 * Hovering reveals tools and description for that specific branch of chemistry.
 * Uses viewport-safe fixed positioning to prevent clipping by overflow containers.
 */
export const CategoryChipItem: React.FC<CategoryChipItemProps> = ({
  category,
  isSelected,
  onSelect,
  onOpenTool
}) => {
  const { language, isRTL } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const hoverTimeoutRef = useRef<any>(null);
  const l = (en: string, fr: string, ar: string) => (language === 'ar' ? ar : language === 'fr' ? fr : en);

  const info = CATEGORY_DETAILS[category] || CATEGORY_DETAILS.All;
  const title = info.titles[language] || info.titles.en;
  const desc = info.descriptions[language] || info.descriptions.en;

  const tools = useMemo(() => {
    return info.toolIds
      .map(id => TOOLS_DATA.find(t => t.id === id))
      .filter((t): t is ToolItem => Boolean(t));
  }, [info]);

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const popoverWidth = 320;
    let left: number;
    if (isRTL) {
      left = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, rect.right - popoverWidth));
    } else {
      left = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, rect.left));
    }
    setCoords({
      top: rect.bottom + 8,
      left
    });
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsHovered(true);
    }, 180);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 220);
  };

  useEffect(() => {
    if (!isHovered) return;
    const handleScroll = () => setIsHovered(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHovered]);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        onClick={onSelect}
        style={{
          whiteSpace: 'nowrap',
          padding: '8px 18px',
          borderRadius: '999px',
          fontSize: '0.88rem',
          fontWeight: 600,
          cursor: 'pointer',
          border: '1.5px solid #6F7F63',
          background: isSelected ? '#4E5B47' : '#FAF8F5',
          color: isSelected ? '#FAF8F5' : '#4E5B47',
          boxShadow: isSelected ? '0 2px 8px rgba(78, 91, 71, 0.25)' : 'var(--shadow-sm)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span>{info.icon}</span>
        <span>{title}</span>
        {category !== 'All' && (
          <span
            style={{
              fontSize: '0.72rem',
              opacity: 0.85,
              background: isSelected ? 'rgba(255,255,255,0.22)' : 'rgba(78, 91, 71, 0.1)',
              padding: '1px 6px',
              borderRadius: '999px'
            }}
          >
            {tools.length}
          </span>
        )}
      </button>

      {/* Drop-side / Hover preview popover with fixed coordinates */}
      {isHovered && category !== 'All' && coords && (
        <div
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            setIsHovered(true);
          }}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            zIndex: 9999,
            background: '#FAF8F5',
            border: '2px solid #6F7F63',
            borderRadius: '14px',
            padding: '14px 16px',
            boxShadow: '0 14px 34px rgba(78, 91, 71, 0.22)',
            width: '320px',
            animation: 'fadeIn 0.18s ease'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.15rem' }}>{info.icon}</span>
              <strong style={{ fontSize: '0.92rem', color: '#4E5B47', fontFamily: "var(--font-heading, 'Playfair Display', serif)" }}>
                {title}
              </strong>
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#DCE0CF', color: '#4E5B47', padding: '2px 7px', borderRadius: '999px' }}>
              {tools.length} {l('tools', 'outils', 'أدوات')}
            </span>
          </div>

          <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#5F6F5B', lineHeight: 1.5 }}>
            {desc}
          </p>

          {/* Quick tools list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
            {tools.map(tool => {
              const localized = TOOLS_TRANSLATIONS[language]?.[tool.id];
              const tTitle = localized?.title || tool.title;
              return (
                <div
                  key={tool.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: '#EDEAE1',
                    gap: '6px'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4E5B47', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tTitle}
                  </span>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsHovered(false);
                        onOpenTool(tool, 'calculator');
                      }}
                      style={{
                        background: '#4E5B47',
                        color: '#FAF8F5',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        fontSize: '0.7rem',
                        cursor: 'pointer'
                      }}
                      title={l('Open calculator', 'Ouvrir le calculateur', 'تشغيل الحاسبة')}
                    >
                      🧮
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsHovered(false);
                        onOpenTool(tool, 'crashcourse');
                      }}
                      style={{
                        background: '#FAF8F5',
                        color: '#4E5B47',
                        border: '1px solid #6F7F63',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        fontSize: '0.7rem',
                        cursor: 'pointer'
                      }}
                      title={l('Open guide', 'Ouvrir le guide', 'فتح الدليل')}
                    >
                      📖
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setIsHovered(false);
              onSelect();
            }}
            style={{
              width: '100%',
              background: '#4E5B47',
              color: '#FAF8F5',
              border: 'none',
              borderRadius: '6px',
              padding: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {l('Filter by this category', 'Filtrer par cette catégorie', 'تصفية حسب هذا القسم')}
          </button>
        </div>
      )}
    </div>
  );
};
