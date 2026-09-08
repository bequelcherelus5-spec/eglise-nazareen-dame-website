import React, { useState, useEffect } from 'react';
import { PageTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Views
import { HomeView } from './components/views/HomeView';
import { AboutView } from './components/views/AboutView';
import { HistoryView } from './components/views/HistoryView';
import { LeadershipView } from './components/views/LeadershipView';
import { MinistriesEducationView } from './components/views/MinistriesEducationView';
import { EducationView } from './components/views/EducationView';
import { GalleryView } from './components/views/GalleryView';
import { EventsView } from './components/views/EventsView';
import { PrayerRequestView } from './components/views/PrayerRequestView';
import { DocumentRequestView } from './components/views/DocumentRequestView';
import { SocialProjectsView } from './components/views/SocialProjectsView';
import { NewsMediaView } from './components/views/NewsMediaView';
import { BibleGamesView } from './components/views/BibleGamesView';
import { ContactView } from './components/views/ContactView';
import { PodcastView } from './components/views/PodcastView';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { apiService, AdminUser } from './services/apiService';

// Modals
import { PrayerRequestModal } from './components/PrayerRequestModal';
import { DonationModal } from './components/DonationModal';
import { EpndEnrollmentModal } from './components/EpndEnrollmentModal';

const validViews: PageTab[] = [
  'accueil', 
  'a-propos', 
  'histoire',
  'leadership', 
  'ministeres', 
  'education', 
  'galerie',
  'evenements',
  'priere',
  'documents',
  'projets', 
  'actualites', 
  'medias', 
  'jeux-bibliques', 
  'contact',
  'podcast',
  'admin',
  'admin-login'
];

const normalizeView = (raw: string): PageTab => {
  const clean = raw.toLowerCase().trim().replace(/^#\/?/, '').replace(/^\//, '');
  switch (clean) {
    case 'home': return 'accueil';
    case 'about': return 'a-propos';
    case 'history': return 'histoire';
    case 'leadership': return 'leadership';
    case 'ministries': return 'ministeres';
    case 'education': return 'education';
    case 'gallery': return 'galerie';
    case 'news':
    case 'articles':
    case 'medias': return 'actualites';
    case 'contact': return 'contact';
    case 'prayer':
    case 'prayer-request':
    case 'priere': return 'priere';
    case 'events':
    case 'evenements': return 'evenements';
    case 'documents':
    case 'document':
    case 'demande-documents': return 'documents';
    case 'podcast':
    case 'podcasts':
    case 'audio':
    case 'predications':
    case 'messages': return 'podcast';
    case 'projets':
    case 'projects': return 'projets';
    case 'jeux-bibliques':
    case 'bible-games': return 'jeux-bibliques';
    case 'admin':
    case 'dashboard':
    case 'secretariat':
    case 'secretaire': return 'admin';
    case 'admin-login':
    case 'secretariat-login':
    case 'login': return 'admin-login';
    default:
      return validViews.includes(clean as PageTab) ? (clean as PageTab) : 'accueil';
  }
};

export default function App() {
  // Current active view parsed from URL hash or pathname
  const [currentView, setCurrentView] = useState<PageTab>(() => {
    const hash = window.location.hash;
    const pathname = window.location.pathname;
    if (hash && hash !== '#') {
      return normalizeView(hash);
    }
    if (pathname && pathname !== '/') {
      return normalizeView(pathname);
    }
    return 'accueil';
  });

  // Admin user authentication state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    return apiService.getCurrentAdmin();
  });

  // Modal states
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isEpndModalOpen, setIsEpndModalOpen] = useState(false);
  const [selectedEpndCourse, setSelectedEpndCourse] = useState<string | undefined>(undefined);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Synchronize hash with current view
  const handleNavigate = (view: PageTab | string, payload?: any) => {
    const target = normalizeView(view);
    setCurrentView(target);
    window.location.hash = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (payload?.articleId) {
      setSelectedArticleId(payload.articleId);
    }
  };

  // Listen to browser back/forward and hash changes
  useEffect(() => {
    const onHashChange = () => {
      const target = normalizeView(window.location.hash);
      if (target !== currentView) {
        setCurrentView(target);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [currentView]);

  const handleOpenEpndEnrollModal = (courseId?: string) => {
    setSelectedEpndCourse(courseId);
    setIsEpndModalOpen(true);
  };

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    handleNavigate('admin');
  };

  const handleAdminLogout = () => {
    apiService.adminLogout();
    setAdminUser(null);
    handleNavigate('admin-login');
  };

  // Determine if we are on an admin interface screen
  const isAdminView = currentView === 'admin' || currentView === 'admin-login';

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-[#D4AF37] selection:text-[#0F2C59]">
      {/* Top Header Navigation (shown on public pages) */}
      {!isAdminView && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
          onOpenDonationModal={() => setIsDonationModalOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-grow">
        {/* 1. Home */}
        {currentView === 'accueil' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
            onOpenDonationModal={() => setIsDonationModalOpen(true)}
            onOpenEpndModal={handleOpenEpndEnrollModal}
          />
        )}

        {/* 2. About */}
        {currentView === 'a-propos' && (
          <AboutView 
            onNavigate={handleNavigate}
            onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
            onOpenDonationModal={() => setIsDonationModalOpen(true)}
          />
        )}

        {/* 3. History */}
        {currentView === 'histoire' && (
          <HistoryView onNavigate={handleNavigate} />
        )}

        {/* 4. Leadership */}
        {currentView === 'leadership' && (
          <LeadershipView />
        )}

        {/* 5. Ministries */}
        {currentView === 'ministeres' && (
          <MinistriesEducationView
            onOpenEpndEnrollModal={handleOpenEpndEnrollModal}
          />
        )}

        {/* 6. Education */}
        {currentView === 'education' && (
          <EducationView
            onNavigate={handleNavigate}
            onOpenEpndEnrollModal={handleOpenEpndEnrollModal}
          />
        )}

        {/* 7. Gallery */}
        {currentView === 'galerie' && (
          <GalleryView onNavigate={handleNavigate} />
        )}

        {/* 8. Events */}
        {currentView === 'evenements' && (
          <EventsView
            onNavigate={handleNavigate}
            onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
          />
        )}

        {/* 9. News / Articles */}
        {(currentView === 'actualites' || currentView === 'medias') && (
          <NewsMediaView
            initialArticleId={selectedArticleId}
          />
        )}

        {/* 10. Document Request (Demande de Documents) */}
        {currentView === 'documents' && (
          <DocumentRequestView onNavigate={handleNavigate} />
        )}

        {/* 11. Prayer Request */}
        {currentView === 'priere' && (
          <PrayerRequestView onNavigate={handleNavigate} />
        )}

        {/* 12. Social Projects */}
        {currentView === 'projets' && (
          <SocialProjectsView
            onOpenDonationModal={() => setIsDonationModalOpen(true)}
          />
        )}

        {/* 13. Bible Games */}
        {currentView === 'jeux-bibliques' && (
          <BibleGamesView />
        )}

        {/* 14. Contact */}
        {currentView === 'contact' && (
          <ContactView />
        )}

        {/* 15. Podcasts & Messages Audio */}
        {currentView === 'podcast' && (
          <PodcastView onNavigate={handleNavigate} />
        )}

        {/* 16. Admin Login */}
        {currentView === 'admin-login' && (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToWebsite={() => handleNavigate('accueil')}
          />
        )}

        {/* 16. Admin Dashboard (Protected Route) */}
        {currentView === 'admin' && (
          adminUser ? (
            <AdminDashboard
              currentUser={adminUser}
              onLogout={handleAdminLogout}
              onNavigateToWebsite={() => handleNavigate('accueil')}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={handleAdminLoginSuccess}
              onBackToWebsite={() => handleNavigate('accueil')}
            />
          )
        )}
      </main>

      {/* Institutional Footer (shown on public pages) */}
      {!isAdminView && (
        <Footer
          onNavigate={handleNavigate}
          onOpenDonationModal={() => setIsDonationModalOpen(true)}
          onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
        />
      )}

      {/* Interactive Global Modals */}
      <PrayerRequestModal
        isOpen={isPrayerModalOpen}
        onClose={() => setIsPrayerModalOpen(false)}
      />

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />

      <EpndEnrollmentModal
        isOpen={isEpndModalOpen}
        onClose={() => setIsEpndModalOpen(false)}
        preselectedCourseId={selectedEpndCourse}
      />
    </div>
  );
}
