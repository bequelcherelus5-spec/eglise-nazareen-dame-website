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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const activeTab = (currentView || currentTab || 'accueil') as PageTab;

  // Scroll Lock on background page & Escape key handling when Navigation Menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      // 1. Lock background page scrolling
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyPaddingRight = document.body.style.paddingRight;

      // Prevent page layout shift caused by scrollbar disappearing
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // 2. Keyboard accessibility: close menu with Escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.paddingRight = originalBodyPaddingRight;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (tab: PageTab) => {
    if (onNavigate) {
      onNavigate(tab);
    } else if (onSelectTab) {
      onSelectTab(tab);
    }
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Primary desktop items (most frequently accessed)
  const primaryNavItems: { tab: PageTab; label: string; icon?: any }[] = [
    { tab: 'accueil', label: 'Accueil' },
    { tab: 'a-propos', label: 'À Propos' },
    { tab: 'histoire', label: 'Histoire' },
    { tab: 'leadership', label: 'Leadership' },
    { tab: 'ministeres', label: 'Ministères' },
    { tab: 'education', label: 'Éducation & EPND' },
    { tab: 'galerie', label: 'Galerie' },
    { tab: 'evenements', label: 'Cultes & Événements' },
    { tab: 'actualites', label: 'Actualités' },
  ];

  // Secondary items in "Plus" dropdown
  const secondaryNavItems: { tab: PageTab; label: string; badge?: string; icon?: any }[] = [
    { tab: 'jeux-educatifs', label: 'Jeux Éducatifs (1ère - 9ème AF)', badge: 'École Nazareth', icon: BookOpen },
    { tab: 'examens', label: 'Préparation Examens (9ème AF)', badge: 'Officiel', icon: GraduationCap },
    { tab: 'podcast', label: 'Podcasts & Prédications', badge: 'Audio', icon: Radio },
    { tab: 'documents', label: 'Demande de Documents', badge: 'Greffe' },
    { tab: 'priere', label: 'Demande de Prière', badge: 'Intercession' },
    { tab: 'projets', label: 'Projets Sociaux' },
    { tab: 'jeux-bibliques', label: 'Jeux Bibliques', badge: 'Interactif' },
    { tab: 'contact', label: 'Contact & Accès' },
  ];

  // All navigation items for mobile drawer
  const allNavItems: { tab: PageTab; label: string; badge?: string }[] = [
    { tab: 'accueil', label: 'Accueil' },
    { tab: 'a-propos', label: 'À Propos (Foi & Doctrine)' },
    { tab: 'histoire', label: 'Histoire de Damé (1979 - 2026)' },
    { tab: 'leadership', label: 'Leadership & Conseil Pastoral' },
    { tab: 'ministeres', label: 'Ministères de l\'Église' },
    { tab: 'education', label: 'Éducation (École Nazareth & EPND)' },
    { tab: 'jeux-educatifs', label: 'Jeux Éducatifs (1ère à 9ème AF)', badge: 'Nouveau' },
    { tab: 'examens', label: 'Plateforme Préparation Examens', badge: 'Officiel' },
    { tab: 'galerie', label: 'Galerie Photos & Patrimoine' },
    { tab: 'evenements', label: 'Cultes, Horaires & Événements' },
    { tab: 'actualites', label: 'Actualités & Enseignements' },
    { tab: 'podcast', label: 'Podcasts & Messages Audio', badge: 'Nouveau' },
    { tab: 'documents', label: 'Demande de Documents', badge: 'Officiel' },
    { tab: 'priere', label: 'Demande de Prière & Intercession', badge: 'Prière' },
    { tab: 'projets', label: 'Projets Sociaux (CDEJ & Digicel)' },
    { tab: 'jeux-bibliques', label: 'Jeux Bibliques Éducatifs', badge: 'Interactif' },
    { tab: 'contact', label: 'Contact & Accès' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
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
            className="flex items-center gap-3 text-left group focus:outline-none shrink-0"
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

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center gap-0.5">
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  id={`nav-link-${item.tab}`}
                  onClick={() => handleNavClick(item.tab)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#0F2C59] text-white shadow-sm'
                      : 'text-slate-700 hover:text-[#0F2C59] hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* "Plus" Dropdown for additional items */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                  secondaryNavItems.some(i => i.tab === activeTab)
                    ? 'bg-[#0F2C59] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Plus</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                  {secondaryNavItems.map((item) => {
                    const isSubActive = activeTab === item.tab;
                    return (
                      <button
                        key={item.tab}
                        onClick={() => handleNavClick(item.tab)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSubActive
                            ? 'bg-[#0F2C59] text-white'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="rounded bg-[#D4AF37] px-1.5 py-0.5 text-[9px] font-bold text-[#0F2C59]">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Medium Desktop Compact Nav (for xl to 2xl screens) */}
          <nav className="hidden lg:flex 2xl:hidden items-center gap-1">
            <button
              onClick={() => handleNavClick('accueil')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg ${activeTab === 'accueil' ? 'bg-[#0F2C59] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Accueil
            </button>
            <button
              onClick={() => handleNavClick('a-propos')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg ${activeTab === 'a-propos' ? 'bg-[#0F2C59] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              À Propos
            </button>
            <button
              onClick={() => handleNavClick('histoire')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg ${activeTab === 'histoire' ? 'bg-[#0F2C59] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Histoire
            </button>
            <button
              onClick={() => handleNavClick('leadership')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg ${activeTab === 'leadership' ? 'bg-[#0F2C59] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Direction
            </button>
            <button
              onClick={() => handleNavClick('education')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg ${activeTab === 'education' ? 'bg-[#0F2C59] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Éducation
            </button>
            <button
              onClick={() => handleNavClick('galerie')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg ${activeTab === 'galerie' ? 'bg-[#0F2C59] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Galerie
            </button>
            <button
              onClick={() => handleNavClick('evenements')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg ${activeTab === 'evenements' ? 'bg-[#0F2C59] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Cultes
            </button>

            {/* Compact More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="px-2 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-1"
              >
                <span>Toutes les pages</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {moreMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  {allNavItems.map((item) => (
                    <button
                      key={item.tab}
                      onClick={() => handleNavClick(item.tab)}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between ${
                        activeTab === item.tab ? 'bg-[#0F2C59] text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="rounded bg-[#D4AF37] px-1 py-0.5 text-[8px] font-bold text-[#0F2C59]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Action CTAs & Global Menu Toggle (Desktop, Tablet & Mobile) */}
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

            {/* Main Menu Button (☰ / ✕) - Visible on Desktop, Tablet & Mobile */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:text-[#0F2C59] hover:bg-slate-100 transition-colors focus:outline-none border border-slate-200 shadow-2xs cursor-pointer"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Menu principal (toutes les pages)"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-[#0F2C59]" />
              ) : (
                <Menu className="h-5 w-5 text-[#0F2C59]" />
              )}
              <span className="hidden sm:inline text-xs font-bold text-[#0F2C59]">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Backdrop Overlay (Locks clicks, touches and background scrolling) */}
      {mobileMenuOpen && (
        <div
          id="navigation-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs transition-opacity duration-300 touch-none"
          aria-hidden="true"
        />
      )}

      {/* 2. Navigation Drawer Panel with Dedicated Internal Scroll (Max height adapted to screen) */}
      {mobileMenuOpen && (
        <aside
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal de navigation"
          className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-full sm:max-w-md md:max-w-lg bg-white shadow-2xl transition-transform duration-300 ease-in-out border-l border-slate-200 h-full max-h-screen max-h-[100dvh]"
        >
          {/* Top Bar of the Menu (Fixed header, never scrolls away) */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#0F2C59] text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#081B36] p-0.5 border border-[#D4AF37] overflow-hidden shadow">
                <img 
                  src={brandLogoImg} 
                  alt="Sceau de l'Église du Nazaréen de Damé" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Navigation Principale
                </span>
                <h2 className="text-xs sm:text-sm font-bold font-display tracking-tight text-white leading-tight">
                  ÉGLISE DU NAZARÉEN DE DAMÉ
                </h2>
                <p className="text-[10px] text-slate-300">
                  {allNavItems.length} rubriques & services paroissiaux
                </p>
              </div>
            </div>

            {/* Close Button (✕) */}
            <button
              id="close-navigation-drawer-btn"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              aria-label="Fermer le menu"
              title="Fermer le menu (Échap)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Dedicated Internal Scroll Area: ALL 17 pages are scrollable here */}
          <div 
            id="navigation-menu-scrollable-content"
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-1.5 nav-menu-scroll focus:outline-none"
            tabIndex={0}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1 flex items-center justify-between">
              <span>Toutes les Pages ({allNavItems.length}) :</span>
              <span className="text-[10px] text-[#D4AF37] font-semibold">Faites défiler ↓</span>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {allNavItems.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    id={`drawer-nav-item-${item.tab}`}
                    onClick={() => handleNavClick(item.tab)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#0F2C59] text-white font-bold shadow-sm ring-1 ring-[#D4AF37]'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#0F2C59]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? 'bg-[#D4AF37]' : 'bg-slate-300'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span 
                        style={item.tab === 'examens' ? { backgroundColor: '#ccd437' } : undefined}
                        className="rounded-full bg-[#D4AF37] px-2 py-0.5 text-[10px] font-bold text-[#0F2C59] shrink-0 ml-2 shadow-2xs"
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pastoral verse & info at end of list */}
            <div className="mt-4 pt-3 border-t border-slate-100 px-2 space-y-2">
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900">
                <span className="font-bold block text-amber-950 mb-0.5">« Sainteté à l’Éternel »</span>
                <span>Culte Dominical : Dimanche 08h00 - 11h30 • Môle-Saint-Nicolas, Haïti</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer (Fixed inside drawer, never pushed off) */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                id="drawer-prayer-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('priere');
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#0F2C59] py-2.5 px-3 text-xs font-bold text-[#0F2C59] hover:bg-white transition-colors cursor-pointer"
              >
                <Heart className="h-4 w-4 text-rose-500" />
                <span>Prière</span>
              </button>
              <button
                id="drawer-donation-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDonationModal();
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] hover:bg-[#c49e29] py-2.5 px-3 text-xs font-bold text-[#0F2C59] transition-colors shadow-xs cursor-pointer"
              >
                <Gift className="h-4 w-4" />
                <span>Faire un Don</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 px-1">
              <a href={`tel:${CHURCH_INFO.phone}`} className="hover:text-[#0F2C59] font-medium flex items-center gap-1">
                <Phone className="h-3 w-3 text-[#D4AF37]" />
                <span>{CHURCH_INFO.phone}</span>
              </a>
              <span className="text-[10px] text-slate-400">Damé © 1979 - 2026</span>
            </div>
          </div>
        </aside>
      )}
    </header>
  );
};
