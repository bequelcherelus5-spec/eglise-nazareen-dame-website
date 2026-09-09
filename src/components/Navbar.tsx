import React, { useState, useEffect } from 'react';
import { PageTab } from '../types';
import { CHURCH_INFO } from '../data/churchData';
import brandLogoImg from '../assets/images/regenerated_image_1788797095916.jpg';
import { 
  Menu, 
  X, 
  Heart, 
  Gift, 
  Phone, 
  Clock, 
  Gamepad2, 
  Sparkles,
  ChevronDown,
  BookOpen,
  Users,
  GraduationCap,
  Camera,
  Calendar,
  Newspaper,
  Compass,
  MapPin,
  Radio
} from 'lucide-react';

interface NavbarProps {
  currentView?: PageTab | string;
  currentTab?: PageTab | string;
  onNavigate?: (tab: PageTab, payload?: any) => void;
  onSelectTab?: (tab: PageTab) => void;
  onOpenPrayerModal: () => void;
  onOpenDonationModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  currentTab,
  onNavigate,
  onSelectTab,
  onOpenPrayerModal,
  onOpenDonationModal
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeTab = (currentView || currentTab || 'accueil') as PageTab;

  // Scroll Lock on background page & Escape key handling when Navigation Menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // 1. Lock background page scrolling
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyPaddingRight = document.body.style.paddingRight;
      const originalOverscroll = document.body.style.overscrollBehavior;

      // Prevent page layout shift caused by scrollbar disappearing
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'contain';
      document.body.classList.add('menu-scroll-lock');
      document.documentElement.classList.add('menu-scroll-lock');

      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // 2. Keyboard accessibility: close menu with Escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overscrollBehavior = originalOverscroll;
        document.body.style.paddingRight = originalBodyPaddingRight;
        document.body.classList.remove('menu-scroll-lock');
        document.documentElement.classList.remove('menu-scroll-lock');
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isMenuOpen]);

  const handleNavClick = (tab: PageTab) => {
    if (onNavigate) {
      onNavigate(tab);
    } else if (onSelectTab) {
      onSelectTab(tab);
    }
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Primary desktop items (fast 1-click access)
  const primaryNavItems: { tab: PageTab; label: string }[] = [
    { tab: 'accueil', label: 'Accueil' },
    { tab: 'a-propos', label: 'À Propos' },
    { tab: 'histoire', label: 'Histoire' },
    { tab: 'leadership', label: 'Leadership' },
    { tab: 'ministeres', label: 'Ministères' },
    { tab: 'education', label: 'Éducation' },
    { tab: 'galerie', label: 'Galerie' },
    { tab: 'evenements', label: 'Cultes' },
    { tab: 'actualites', label: 'Actualités' },
  ];

  // Thematic categories for the full navigation menu panel (all 17 pages)
  const navCategories = [
    {
      title: "L'Église & Foi",
      icon: Users,
      items: [
        { tab: 'accueil' as PageTab, label: 'Accueil', desc: 'Portail officiel de la communauté' },
        { tab: 'a-propos' as PageTab, label: 'À Propos', desc: 'Confession de foi & doctrine nazaréenne' },
        { tab: 'histoire' as PageTab, label: 'Histoire de Damé', desc: 'Fondation en 1979 et 47 ans d\'impact' },
        { tab: 'leadership' as PageTab, label: 'Leadership & Conseil', desc: 'Pasteurs et comité exécutif' },
        { tab: 'galerie' as PageTab, label: 'Galerie & Patrimoine', desc: 'Photos historiques et souvenirs de foi' },
      ]
    },
    {
      title: "Cultes & Vie Spirituelle",
      icon: Sparkles,
      items: [
        { tab: 'evenements' as PageTab, label: 'Cultes & Événements', desc: 'Horaires du dimanche et assemblées' },
        { tab: 'actualites' as PageTab, label: 'Actualités & Enseignements', desc: 'Dernières nouvelles et méditations' },
        { tab: 'podcast' as PageTab, label: 'Podcasts & Messages Audio', badge: 'Audio', desc: 'Prédications et louanges' },
        { tab: 'priere' as PageTab, label: 'Demande de Prière', badge: 'Intercession', desc: 'Déposer une requête pastorale' },
      ]
    },
    {
      title: "Éducation & Jeunesse",
      icon: GraduationCap,
      items: [
        { tab: 'ministeres' as PageTab, label: 'Ministères de l\'Église', desc: 'Jeunesse, Dames, Hommes, Enfants' },
        { tab: 'education' as PageTab, label: 'Éducation (École & EPND)', desc: 'École Nazareth et formation technique' },
        { tab: 'jeux-educatifs' as PageTab, label: 'Jeux Éducatifs (1ère - 9ème AF)', badge: 'École', desc: 'Exercices et apprentissages interactifs' },
        { tab: 'examens' as PageTab, label: 'Préparation Examens Officiels', badge: '9ème AF', desc: 'Sujets révisés et tests d\'évaluation' },
      ]
    },
    {
      title: "Actions & Communauté",
      icon: Compass,
      items: [
        { tab: 'projets' as PageTab, label: 'Projets Sociaux', desc: 'Partenariats CDEJ, Digicel & entraide' },
        { tab: 'documents' as PageTab, label: 'Demande de Documents', badge: 'Greffe', desc: 'Actes de baptême, attestations officielles' },
        { tab: 'jeux-bibliques' as PageTab, label: 'Jeux Bibliques Éducatifs', badge: 'Interactif', desc: 'Quiz, défis et Tableau des Champions' },
        { tab: 'contact' as PageTab, label: 'Contact & Accès', desc: 'Localisation à Môle-Saint-Nicolas, Haïti' },
      ]
    }
  ];

  // Flat list of all 17 navigation items for mobile quick count
  const allNavItemsCount = navCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
      {/* Top Banner (Address, District, Emergency, Motto) */}
      <div className="bg-[#0F2C59] text-white py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="inline-flex items-center gap-1 text-[#D4AF37] font-bold tracking-wider uppercase text-[11px]">
              <Sparkles className="h-3 w-3" />
              {CHURCH_INFO.motto}
            </span>
            <span className="hidden md:inline-block text-slate-400">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
              Culte Dominical : Dimanche 08h00 - 11h30
            </span>
            <span className="hidden lg:inline-block text-slate-400">|</span>
            <span className="hidden lg:inline-block text-slate-300">
              {CHURCH_INFO.district} • Môle-Saint-Nicolas, Haïti
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <a 
              href={`tel:${CHURCH_INFO.phone}`} 
              className="inline-flex items-center gap-1 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="h-3 w-3 text-[#D4AF37]" />
              <span className="font-semibold">{CHURCH_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Church Name */}
          <button 
            id="brand-logo-btn"
            onClick={() => handleNavClick('accueil')}
            className="flex items-center gap-3 text-left group focus:outline-none shrink-0 cursor-pointer"
          >
            {/* Official Church Logo Seal */}
            <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#081B36] p-1 shadow-md border-2 border-[#D4AF37] group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src={brandLogoImg} 
                alt="Sceau Officiel Église du Nazaréen de Damé" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Haïti • Bas Nord-Ouest
              </span>
              <h1 className="text-sm sm:text-base md:text-lg font-bold font-display tracking-tight text-[#0F2C59] leading-tight group-hover:text-[#1E4682] transition-colors">
                ÉGLISE DU NAZARÉEN DE DAMÉ
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                Fondée en 1979 • {CHURCH_INFO.leadPastor}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links (Fast Access) */}
          <nav className="hidden xl:flex items-center gap-1">
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  id={`nav-link-${item.tab}`}
                  onClick={() => handleNavClick(item.tab)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0F2C59] text-white shadow-sm'
                      : 'text-slate-700 hover:text-[#0F2C59] hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Desktop "Toutes les pages" Button with ☰ */}
            <button
              id="desktop-menu-toggle-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`ml-1 px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border ${
                isMenuOpen
                  ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-sm ring-2 ring-[#D4AF37]/40'
                  : 'text-slate-700 hover:text-[#0F2C59] hover:bg-slate-100 border-slate-200'
              }`}
              aria-expanded={isMenuOpen}
              aria-label="Toutes les pages (menu principal)"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4 text-[#D4AF37]" />
              ) : (
                <Menu className="h-4 w-4 text-[#0F2C59]" />
              )}
              <span>{isMenuOpen ? 'Fermer' : 'Toutes les pages (☰)'}</span>
            </button>
          </nav>

          {/* Action CTAs & Global Menu Button */}
          <div className="flex items-center gap-2">
            <button
              id="header-prayer-btn"
              onClick={() => handleNavClick('priere')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#0F2C59]/20 bg-white px-3 py-2 text-xs font-semibold text-[#0F2C59] hover:bg-[#0F2C59]/5 transition-colors cursor-pointer"
            >
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              <span>Prière</span>
            </button>
            <button
              id="header-donation-btn"
              onClick={onOpenDonationModal}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-3.5 py-2 text-xs font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-colors shadow-xs cursor-pointer"
            >
              <Gift className="h-3.5 w-3.5" />
              <span>Faire un don</span>
            </button>

            {/* Quick Games Shortcut for mobile */}
            <button
              id="mobile-quick-games-btn"
              onClick={() => handleNavClick('jeux-bibliques')}
              className="sm:hidden p-2 text-[#0F2C59] bg-[#D4AF37]/20 rounded-lg hover:bg-[#D4AF37]/40 cursor-pointer"
              aria-label="Jeux Bibliques"
            >
              <Gamepad2 className="h-5 w-5 text-[#0F2C59]" />
            </button>

            {/* Universal Menu Button (☰ / ✕) - Visible on Mobile, Tablet, and Compact Desktop */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`xl:hidden inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:text-[#0F2C59] hover:bg-slate-100 transition-colors focus:outline-none border border-slate-200 shadow-2xs cursor-pointer ${
                isMenuOpen ? 'bg-slate-100 ring-2 ring-[#0F2C59]/20' : ''
              }`}
              aria-label={isMenuOpen ? "Fermer le menu" : "Menu principal (toutes les pages)"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-[#0F2C59]" />
              ) : (
                <Menu className="h-6 w-6 text-[#0F2C59]" />
              )}
              <span className="hidden sm:inline text-xs font-bold text-[#0F2C59]">
                {isMenuOpen ? 'Fermer' : 'Menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Backdrop Overlay (Locks clicks, touches and background scrolling) */}
      {isMenuOpen && (
        <div
          id="navigation-menu-backdrop"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 top-[114px] max-lg:top-[76px] z-40 bg-slate-950/65 backdrop-blur-xs transition-opacity duration-200 touch-none"
          aria-hidden="true"
        />
      )}

      {/* 2. Full Navigation Panel with Dedicated Internal Scroll */}
      {isMenuOpen && (
        <div
          id="main-navigation-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal de navigation"
          className="absolute top-full left-0 right-0 w-full bg-white border-b-2 border-[#D4AF37] shadow-2xl z-50 flex flex-col max-h-[calc(100dvh-114px)] max-sm:max-h-[calc(100dvh-78px)] overflow-hidden animate-fade-in"
        >
          {/* Top Panel Header (Fixed, non-scrolling) */}
          <div className="shrink-0 bg-slate-50 border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#0F2C59] flex items-center justify-center text-[#D4AF37] shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0F2C59] font-display">
                  Navigation Générale • Église du Nazaréen de Damé
                </h3>
                <p className="text-[11px] text-slate-500">
                  {allNavItemsCount} pages et services paroissiaux disponibles
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0F2C59] bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Fermer le menu"
            >
              <X className="h-4 w-4" />
              <span>Fermer (Échap)</span>
            </button>
          </div>

          {/* Scrollable Content Body with REAL internal vertical scroll */}
          <div
            id="nav-menu-scrollable-content"
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain nav-menu-scroll px-4 sm:px-6 lg:px-8 py-5 space-y-6 focus:outline-none"
            tabIndex={0}
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {navCategories.map((category, catIdx) => {
                const IconComponent = category.icon;
                return (
                  <div key={catIdx} className="space-y-3">
                    {/* Category Title */}
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                      <div className="h-6 w-6 rounded-md bg-[#0F2C59]/10 text-[#0F2C59] flex items-center justify-center">
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
                        {category.title}
                      </h4>
                    </div>

                    {/* Category Links */}
                    <div className="space-y-1.5">
                      {category.items.map((item) => {
                        const isActive = activeTab === item.tab;
                        return (
                          <button
                            key={item.tab}
                            id={`nav-drawer-item-${item.tab}`}
                            onClick={() => handleNavClick(item.tab)}
                            className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex flex-col gap-0.5 ${
                              isActive
                                ? 'bg-[#0F2C59] text-white shadow-sm ring-1 ring-[#D4AF37]'
                                : 'hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold flex items-center gap-1.5">
                                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? 'bg-[#D4AF37]' : 'bg-slate-300'}`} />
                                {item.label}
                              </span>
                              {item.badge && (
                                <span 
                                  style={item.tab === 'examens' ? { backgroundColor: '#ccd437' } : undefined}
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0 ${
                                    isActive 
                                      ? 'bg-[#D4AF37] text-[#0F2C59]' 
                                      : 'bg-[#0F2C59]/10 text-[#0F2C59]'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span className={`text-[10px] pl-3 ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                              {item.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pastoral Scripture banner inside scroll area */}
            <div className="max-w-7xl mx-auto pt-4 border-t border-slate-200">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
                <div>
                  <span className="font-bold text-amber-950 block">« Sainteté à l’Éternel » — Devise officielle</span>
                  <span className="text-amber-800 text-[11px]">Église du Nazaréen de Damé • Fondée en 1979 sous la direction pastorale du Rév. Louicius Trésilus.</span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-semibold block text-[11px]">Dimanche 08h00 - 11h30</span>
                  <span className="text-[10px] text-amber-700">Môle-Saint-Nicolas, Haïti</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel Footer (Fixed, non-scrolling) */}
          <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="panel-prayer-btn"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleNavClick('priere');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#0F2C59] py-2 px-3.5 text-xs font-bold text-[#0F2C59] hover:bg-white transition-colors cursor-pointer"
              >
                <Heart className="h-4 w-4 text-rose-500" />
                <span>Demander une Prière</span>
              </button>

              <button
                id="panel-donation-btn"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenDonationModal();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49e29] py-2 px-3.5 text-xs font-bold text-[#0F2C59] transition-colors shadow-xs cursor-pointer"
              >
                <Gift className="h-4 w-4" />
                <span>Faire un Don</span>
              </button>

              <button
                id="panel-games-btn"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleNavClick('jeux-bibliques');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2C59] hover:bg-[#1A3D73] text-white py-2 px-3.5 text-xs font-bold transition-colors cursor-pointer"
              >
                <Gamepad2 className="h-4 w-4 text-[#D4AF37]" />
                <span>Jeux Bibliques</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <a href={`tel:${CHURCH_INFO.phone}`} className="hover:text-[#0F2C59] font-medium flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>{CHURCH_INFO.phone}</span>
              </a>
              <span className="hidden sm:inline text-slate-300">|</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-600 hover:text-[#0F2C59] font-bold cursor-pointer underline decoration-dotted"
              >
                Fermer le menu
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
