import React, { useState } from 'react';
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

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              id="header-prayer-btn"
              onClick={() => handleNavClick('priere')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#0F2C59]/20 bg-white px-3 py-2 text-xs font-semibold text-[#0F2C59] hover:bg-[#0F2C59]/5 transition-colors"
            >
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              Prière
            </button>
            <button
              id="header-donation-btn"
              onClick={onOpenDonationModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-3.5 py-2 text-xs font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-colors shadow-sm"
            >
              <Gift className="h-3.5 w-3.5" />
              Faire un don
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-quick-games-btn"
              onClick={() => handleNavClick('jeux-bibliques')}
              className="p-2 text-[#0F2C59] bg-[#D4AF37]/20 rounded-lg hover:bg-[#D4AF37]/40"
              aria-label="Jeux Bibliques"
            >
              <Gamepad2 className="h-5 w-5 text-[#0F2C59]" />
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu with all pages */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fade-in shadow-xl max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-1">
            {allNavItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#0F2C59] text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded bg-[#D4AF37] px-2 py-0.5 text-[10px] font-bold text-[#0F2C59]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick('priere');
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#0F2C59] py-2.5 text-xs font-bold text-[#0F2C59] hover:bg-slate-50"
            >
              <Heart className="h-4 w-4 text-rose-500" />
              Demander Prière
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonationModal();
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-2.5 text-xs font-bold text-[#0F2C59] hover:bg-[#B38E22]"
            >
              <Gift className="h-4 w-4" />
              Faire un Don
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
