import React, { useState, useMemo, useRef } from 'react';
import { ToolCategory, ToolItem } from '../../types/tool';
import { TOOLS_DATA } from '../../data/toolsData';
import { ToolModal } from './ToolModal';
import { useLanguage } from '../../i18n/LanguageContext';
import { TOOLS_TRANSLATIONS } from '../../i18n/translations/tools';
import { CategoryDropSide, CategoryChipItem } from './CategoryDropSide';

const CATEGORIES: ToolCategory[] = [
  'All',
  'Calculations',
  'Equations',
  'Solutions',
  'Thermodynamics',
  'Gas Laws',
  'Reference'
];

export const ToolsView: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const l = (en: string, fr: string, ar: string) => language === 'ar' ? ar : language === 'fr' ? fr : en;
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All');
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'calculator' | 'crashcourse'>('calculator');

  const chipsScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollChips = (dir: 'left' | 'right') => {
    if (chipsScrollRef.current) {
      const mult = isRTL ? -1 : 1;
      chipsScrollRef.current.scrollBy({ left: (dir === 'left' ? -220 : 220) * mult, behavior: 'smooth' });
    }
  };

  const filteredTools = useMemo(() => {
    const s = search.trim().toLowerCase();
    return TOOLS_DATA.filter(tool => {
      const localized = TOOLS_TRANSLATIONS[language]?.[tool.id];
      const matchSearch =
        !s ||
        tool.title.toLowerCase().includes(s) ||
        tool.desc.toLowerCase().includes(s) ||
        tool.subtitle.toLowerCase().includes(s) ||
        (localized && (
          localized.title.toLowerCase().includes(s) ||
          localized.desc.toLowerCase().includes(s) ||
          localized.subtitle.toLowerCase().includes(s)
        ));

      const matchCat = selectedCategory === 'All' || tool.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [search, selectedCategory, language]);

  const openTool = (tool: ToolItem, mode: 'calculator' | 'crashcourse') => {
    setActiveTool(tool);
    setModalInitialTab(mode);
  };

  return (
    <div className="tools-page" style={{ minHeight: '100vh', paddingBottom: '6rem', paddingTop: '100px' }}>
      {/* Featured Botanical Field Guide Hero Banner with Art Reference */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 2.5rem', padding: '0 1.5rem' }}>
        <div className="tools-hero-banner">
          {/* Left Column: Copy & Explanation */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  background: '#4E5B47',
                  color: '#FAF8F5',
                  padding: '4px 12px',
                  borderRadius: '999px'
                }}
              >
                {l('Botanical Guide & Toolkit', 'Guide Botanique & Boîte à Outils', 'الدليل والأدوات العلمية')}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#4E5B47',
                  background: 'rgba(111, 127, 99, 0.25)',
                  padding: '4px 10px',
                  borderRadius: '999px'
                }}
              >
                🌿 {l('10 Chemistry Calculators + Crash Courses', '10 Calculateurs Chimiques + Guides Express', '10 حاسبات كيميائية + شروحات مبسطة')}
              </span>
            </div>

            <h1
              className="section-title"
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                color: '#4E5B47',
                margin: '0 0 1rem',
                lineHeight: 1.2
              }}
            >
              {l('Every Chemistry Tool, Explained & Solved', 'Chaque Outil Chimique, Expliqué & Résolu', 'جميع أدوات الكيمياء، مشروحة ومحلولة')}
            </h1>

            <p style={{ color: '#5F6F5B', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
              {l(
                'Welcome to the Chemify Observatory. Whether you need a molar mass calculation, matrix equation balancing, or a step-by-step crash course breaking down complex concepts — every tool delivers precise answers and deep understanding.',
                'Bienvenue dans l’Observatoire Chemify. Que vous ayez besoin d’un calcul de masse molaire, d’un équilibrage matriciel ou d’un guide express détaillant chaque principe chimique — chaque calculateur comprend des explications pour maîtriser le concept.',
                'مرحباً بك في مرصد كيميفاي العلمي. سواء كنت بحاجة إلى حساب الكتلة المولية، أو موازنة المعادلات بالمصفوفات، أو دليل تعليمي يفكك المفاهيم المعقدة خطوة بخطوة — توفر كل حاسبة حلاً دقيقاً وشرحاً تفاعلياً.'
              )}
            </p>

            {/* Feature Highlights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#FAF8F5', border: '1px solid #6F7F63', borderRadius: '10px', padding: '10px 14px' }}>
                <div style={{ fontWeight: 700, color: '#4E5B47', fontSize: '0.9rem' }}>
                  {l('🧮 Instant Precision Solvers', '🧮 Calculs Immédiats', '🧮 حلول فورية دقيقة')}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#5F6F5B' }}>
                  {l('Live interactive calculations with auto-detected variables', 'Résolution instantanée et auto-détection', 'حسابات حية مع اكتشاف تلقائي للمتغيرات')}
                </div>
              </div>
              <div style={{ background: '#FAF8F5', border: '1px solid #6F7F63', borderRadius: '10px', padding: '10px 14px' }}>
                <div style={{ fontWeight: 700, color: '#4E5B47', fontSize: '0.9rem' }}>
                  {l('📖 Interactive Crash Courses', '📖 Guides Pédagogiques', '📖 شروحات تفاعلية')}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#5F6F5B' }}>
                  {l('Step-by-step worked examples, pitfalls to avoid & pro tips', 'Exemples corrigés, pièges à éviter & astuces', 'أمثلة محلولة ونصائح علمية لتجنب الأخطاء')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('tools-catalog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: '#4E5B47',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '10px 22px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {l('Explore 10 Tools ↓', 'Explorer les 10 Outils ↓', 'استعراض الـ 10 أدوات ↓')}
              </button>
            </div>
          </div>

          {/* Right Column: Whimsical Botanical Art Frame */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '360px',
                aspectRatio: '9 / 12',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '3px solid #6F7F63',
                boxShadow: '0 16px 36px rgba(78, 91, 71, 0.22)',
                background: '#FAF8F5'
              }}
            >
              <img
                src="assets/images/ghibli-botanical-lab.png"
                alt="Botanical Chemistry Greenhouse Art"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transition: 'transform 0.5s ease'
                }}
              />
              {/* Botanical Overlay Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(35, 42, 33, 0.88))',
                  padding: '1.25rem 1rem 0.85rem',
                  color: '#FAF8F5',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.04em' }}>
                  {l('Botanical & Chemical Sciences Observatory', 'Observatoire des Sciences Botaniques', 'مرصد العلوم النباتية والكيميائية')}
                </div>
                <div style={{ fontSize: '0.76rem', opacity: 0.85, marginTop: '2px' }}>
                  {l('Where the elegance of nature meets the precision of chemistry and math.', 'Là où la nature, les mathématiques et la curiosité se rencontrent.', 'حيث يلتقي جمال الطبيعة بدقة الرياضيات والفيزياء.')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Container */}
      <section id="tools-catalog" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
        <div
          style={{
            background: 'rgba(220, 224, 207, 0.45)',
            border: '1.5px solid #6F7F63',
            borderRadius: '18px',
            padding: '1.5rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Search bar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.tools.searchPlaceholder}
                style={{
                  width: '100%',
                  padding: isRTL ? '0.85rem 1.15rem 0.85rem 2.75rem' : '0.85rem 2.75rem 0.85rem 1.15rem',
                  borderRadius: '12px',
                  border: '1.5px solid #6F7F63',
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)'
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: isRTL ? 'auto' : '12px',
                    left: isRTL ? '12px' : 'auto',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    color: '#5F6F5B',
                    lineHeight: 1
                  }}
                  title={l('Clear search', 'Effacer la recherche', 'مسح البحث')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4E5B47', whiteSpace: 'nowrap' }}>
              {l(
                `Showing ${filteredTools.length} ${filteredTools.length === 1 ? 'tool' : 'tools'}`,
                `Affichage de ${filteredTools.length} ${filteredTools.length === 1 ? 'calculateur' : 'calculateurs'}`,
                `عرض ${filteredTools.length} ${filteredTools.length === 1 ? 'أداة' : 'أدوات'}`
              )}
            </span>
          </div>

          {/* Category Selector Chips & Drop-Side Explorer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* Master Category Explorer Drop-Side Menu */}
            <CategoryDropSide
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={cat => setSelectedCategory(cat)}
              onOpenTool={(tool, mode) => openTool(tool, mode)}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, minWidth: '240px', overflow: 'hidden' }}>
              <button
                onClick={() => scrollChips('left')}
                style={{
                  background: '#FAF8F5',
                  border: '1px solid #6F7F63',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  color: '#4E5B47',
                  fontSize: '1.1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
                aria-label="Scroll categories left"
              >
                {isRTL ? '›' : '‹'}
              </button>

              <div
                ref={chipsScrollRef}
                className="no-scrollbar"
                style={{
                  display: 'flex',
                  gap: '0.6rem',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  padding: '6px 2px'
                }}
              >
                {CATEGORIES.map(cat => (
                  <CategoryChipItem
                    key={cat}
                    category={cat}
                    isSelected={selectedCategory === cat}
                    onSelect={() => setSelectedCategory(cat)}
                    onOpenTool={(tool, mode) => openTool(tool, mode)}
                  />
                ))}
              </div>

              <button
                onClick={() => scrollChips('right')}
                style={{
                  background: '#FAF8F5',
                  border: '1px solid #6F7F63',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  color: '#4E5B47',
                  fontSize: '1.1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
                aria-label="Scroll categories right"
              >
                {isRTL ? '‹' : '›'}
              </button>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="tools-grid no-scrollbar">
            {filteredTools.map(tool => {
              const localized = TOOLS_TRANSLATIONS[language]?.[tool.id];
              const title = localized?.title || tool.title;
              const desc = localized?.desc || tool.desc;
              const catLabel = t.tools.categories[tool.category] || tool.category;
              const badgeLabel = t.tools.badges[tool.badge] || tool.badge;

              return (
                <article
                  key={tool.id}
                  className="tool-card no-scrollbar"
                  onClick={() => openTool(tool, 'calculator')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') openTool(tool, 'calculator');
                  }}
                >
                  {/* Illustration */}
                  <div className="tool-card__image-wrap">
                    <img
                      src={tool.iconPath}
                      alt={title}
                      className="tool-card__image"
                      loading="lazy"
                    />
                    <span className="tool-card__badge">{badgeLabel}</span>
                  </div>

                  {/* Card Content */}
                  <div className="tool-card__body no-scrollbar">
                    <span className="tool-card__category">{catLabel}</span>
                    <h3 className="tool-card__title">{title}</h3>
                    <p className="tool-card__desc">{desc}</p>

                    {/* Dual Action Options */}
                    <div
                      className="tool-card__footer"
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                      }}
                    >
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          openTool(tool, 'calculator');
                        }}
                        style={{
                          background: '#4E5B47',
                          color: '#FAF8F5',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 14px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(78, 91, 71, 0.25)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>{l('Launch', 'Lancer', 'تشغيل')}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          openTool(tool, 'crashcourse');
                        }}
                        style={{
                          background: '#FAF8F5',
                          color: '#4E5B47',
                          border: '1.5px solid #6F7F63',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                        title={l('Open crash course for this tool', 'Ouvrir le guide express pour cet outil', 'فتح الدليل التعليمي للأداة')}
                      >
                        <span>📖</span>
                        <span>{l('Guide', 'Guide', 'الدليل')}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: '#FAF8F5',
              border: '1.5px dashed #6F7F63',
              borderRadius: '16px'
            }}
          >
            <h3 style={{ fontSize: '1.6rem', color: '#4E5B47', marginBottom: '0.5rem' }}>
              {l('No calculators found', 'Aucun calculateur trouvé', 'لم يتم العثور على حاسبات')}
            </h3>
            <p style={{ color: '#5F6F5B', marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
              {l(
                `No tools match "${search}". Try searching with another term or reset filters.`,
                `Aucun outil ne correspond à "${search}". Essayez avec un autre terme ou réinitialisez les filtres.`,
                `لا توجد أدوات تطابق "${search}". جرب البحث باسم آخر أو أعد ضبط عوامل التصفية.`
              )}
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              style={{
                background: '#4E5B47',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {l('Reset Filters', 'Réinitialiser les filtres', 'إعادة ضبط عوامل التصفية')}
            </button>
          </div>
        )}
      </section>

      {/* Modal for active tool */}
      {activeTool && (
        <ToolModal
          tool={activeTool}
          initialTab={modalInitialTab}
          onClose={() => setActiveTool(null)}
        />
      )}
    </div>
  );
};
