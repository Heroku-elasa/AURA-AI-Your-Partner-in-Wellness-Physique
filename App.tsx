import React, { useState, useEffect } from 'react';
import SiteHeader from './components/Header';
import HomePage from './components/Hero';
import MyPlansPage from './components/ReportGenerator';
import SiteFooter from './components/Footer';
import QuotaErrorModal from './components/QuotaErrorModal';
import ChangelogModal from './components/GoogleBabaModal';
import LoginModal from './components/LoginModal';
import AICoachChatPage from './components/BaristaCoach';
import MarketTrendsPage from './components/NewsSummarizer';
import OurExpertsPage from './components/StartupShowcase';
import CollaborationPage from './components/InvestmentPage';
import LocationFinderPage from './components/CafeFinderPage';
import AIAssessmentPage from './components/FeminineFirstDatingPage';
import FranchisePage from './components/FranchisePage';
import SellerHubPage from './components/SellerHubPage';
import SimulatorPage from './components/SurgerySimulatorPage';
import SearchModal from './components/SearchModal';
import ProAthletePlatformPage from './components/BayerAflakPage';
import JoinUsPage from './components/JoinUsPage';
import DownloadAppPage from './components/DownloadAppPage';
import { Page, SavedConsultation, ProviderSearchResult, Message, SearchResultItem, useLanguage } from './types';
import { useToast } from './components/Toast';
import { initDB, saveConsultation as saveDb, getAllSavedConsultations, deleteConsultation as deleteDb } from './services/dbService';
import { performSemanticSearch, findLocalProviders } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setPage] = useState<Page>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // My Plans State
  const [savedConsultations, setSavedConsultations] = useState<SavedConsultation[]>([]);
  const [consultationToRestore, setConsultationToRestore] = useState<SavedConsultation | null>(null);

  // AI Coach Chat State
  const [chatHistory, setChatHistory] = useState<Message[]>([{ role: 'model', parts: [{ text: "Hello! I am AURA AI. How can I help you with your wellness, beauty, and fitness goals today?" }] }]);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Location Finder State
  const [providerResults, setProviderResults] = useState<ProviderSearchResult[] | null>(null);
  const [isFindingProviders, setIsFindingProviders] = useState(false);
  
  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { addToast } = useToast();
  const { language, t } = useLanguage();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        const consultations = await getAllSavedConsultations();
        setSavedConsultations(consultations);
      } catch (error) {
        console.error("Failed to initialize DB:", error);
        addToast("Could not load saved plans.", "error");
      }
    };
    initialize();
  }, [addToast]);
  
  const handleApiError = (error: unknown): string => {
    let message = "An unexpected error occurred.";
    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    }
    
    if (message.includes('429') || message.includes('quota')) {
        setIsQuotaExhausted(true);
        message = "API quota exceeded. Please check your billing or try again later.";
    }
    
    addToast(message, 'error');
    return message;
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    addToast("You have been logged out.", "info");
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    addToast("Login successful!", "success");
  };
  
  const handleSaveConsultation = async (consultation: SavedConsultation) => {
    try {
        await saveDb(consultation);
        // Refresh the list from DB to ensure consistency
        const updatedConsultations = await getAllSavedConsultations();
        setSavedConsultations(updatedConsultations);
        addToast("Plan saved successfully!", "success");
    } catch (error) {
        handleApiError(error);
    }
  };

  const handleDeleteConsultation = async (id: string) => {
    try {
      await deleteDb(id);
      const updatedConsultations = savedConsultations.filter(p => p.id !== id);
      setSavedConsultations(updatedConsultations);
      addToast("Plan deleted successfully.", "success");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRestoreConsultation = (id: string) => {
      const consultation = savedConsultations.find(p => p.id === id);
      if (consultation) {
          setConsultationToRestore(consultation);
          const pageToOpen = consultation.mode === 'fitness' ? 'fitness_assessment' : 'skin_consultation';
          setPage(pageToOpen);
          addToast(`Restored "${consultation.name}".`, 'info');
      }
  };

  const handleAiSendMessage = (message: string) => {
      // Mock AI response
      const userMessage: Message = { role: 'user', parts: [{ text: message }] };
      setChatHistory(prev => [...prev, userMessage]);
      setIsStreaming(true);
      setTimeout(() => {
          const aiResponse: Message = { role: 'model', parts: [{ text: "This is a simulated AI response. The full AI logic is not implemented in this demo." }] };
          setChatHistory(prev => [...prev, aiResponse]);
          setIsStreaming(false);
      }, 1500);
  };
  
  const handleProviderSearch = async (
    searchMethod: 'geo' | 'text',
    query: string,
    searchType: 'clinics' | 'doctors' | 'gyms' | 'coaches'
  ) => {
      setIsFindingProviders(true);
      setProviderResults(null);
      try {
          let location: { lat: number; lon: number } | null = null;
          if (searchMethod === 'geo') {
              try {
                  location = await new Promise((resolve, reject) => {
                      navigator.geolocation.getCurrentPosition(
                          position => resolve({
                              lat: position.coords.latitude,
                              lon: position.coords.longitude
                          }),
                          error => {
                            console.error(`Geolocation error (Code: ${error.code}): ${error.message}`);
                            addToast(`Geolocation failed: ${error.message}. Searching without location.`, 'info');
                            resolve(null); // Resolve with null instead of rejecting
                          },
                          { timeout: 10000 }
                      );
                  });
              } catch (geoError) {
                  console.error("Geolocation promise error:", geoError);
                  addToast("Could not get your location.", "error");
              }
          }
          const results = await findLocalProviders(query, searchType, location, language);
          setProviderResults(results);
      } catch (err) {
          handleApiError(err);
      } finally {
          setIsFindingProviders(false);
      }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchResults(null);
    setSearchError(null);

    try {
      const cosmeticServices = t('hero.cosmeticServices');
      const fitnessServices = t('hero.fitnessServices');
      const experts = t('ourExperts.coaches').concat(t('ourExperts.doctors'));
      
      const pages = [
          { name: t('header.skinConsultation'), target: 'skin_consultation', description: t('assessment.skinSubtitle') },
          { name: t('header.fitnessAssessment'), target: 'fitness_assessment', description: t('assessment.fitnessSubtitle') },
          { name: t('header.locationFinder'), target: 'location_finder', description: t('locationFinder.subtitle') },
          { name: t('header.aiCoach'), target: 'ai_consultant', description: t('aiCoach.subtitle') },
          { name: t('header.marketTrends'), target: 'market_trends', description: t('marketTrends.subtitle') },
          { name: t('header.ourExperts'), target: 'our_experts', description: t('ourExperts.subtitle') },
          { name: t('header.collaboration'), target: 'collaboration', description: t('collaborationPage.goalText') },
          { name: t('header.joinUs'), target: 'join_us', description: t('joinUsPage.subtitle') },
          { name: t('header.myPlans'), target: 'my_consultations', description: t('myPlansPage.subtitle') },
          { name: t('header.downloadApp'), target: 'download_app', description: t('downloadAppPage.subtitle') },
      ];

      const searchIndex = `
        Services available at AURA AI: ${JSON.stringify(cosmeticServices.concat(fitnessServices))}.
        Experts at AURA AI: ${JSON.stringify(experts)}.
        Website Pages: ${JSON.stringify(pages)}.
      `;

      const results = await performSemanticSearch(query, searchIndex, language);
      setSearchResults(results);
    } catch (err) {
      const msg = handleApiError(err);
      setSearchError(msg);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNavigateFromSearch = (page: Page) => {
    setPage(page);
    setIsSearchModalOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setPage={setPage} />;
      case 'skin_consultation':
        return <AIAssessmentPage
            mode="skin" 
            handleApiError={handleApiError} 
            isQuotaExhausted={isQuotaExhausted}
            onSaveConsultation={handleSaveConsultation}
            consultationToRestore={consultationToRestore}
            setConsultationToRestore={setConsultationToRestore}
            setPage={setPage}
        />;
      case 'fitness_assessment':
        return <AIAssessmentPage
            mode="fitness" 
            handleApiError={handleApiError} 
            isQuotaExhausted={isQuotaExhausted}
            onSaveConsultation={handleSaveConsultation}
            consultationToRestore={consultationToRestore}
            setConsultationToRestore={setConsultationToRestore}
            setPage={setPage}
        />;
      case 'location_finder':
        return <LocationFinderPage 
            onSearch={handleProviderSearch}
            isLoading={isFindingProviders}
            results={providerResults}
            isQuotaExhausted={isQuotaExhausted}
        />;
      case 'ai_consultant':
        return <AICoachChatPage 
            chatHistory={chatHistory} 
            isStreaming={isStreaming} 
            onSendMessage={handleAiSendMessage}
        />;
      case 'market_trends':
        return <MarketTrendsPage handleApiError={handleApiError} />;
      case 'our_experts':
        return <OurExpertsPage />;
      case 'collaboration':
        return <CollaborationPage setPage={setPage} />;
      case 'franchise':
        return <FranchisePage setPage={setPage} />;
      case 'seller_hub':
        return <SellerHubPage handleApiError={handleApiError} />;
      case 'cosmetic_simulator':
        return <SimulatorPage mode="cosmetic" handleApiError={handleApiError} />;
      case 'physique_simulator':
        return <SimulatorPage mode="physique" handleApiError={handleApiError} />;
      case 'case_study_bayer_aflak':
        return <ProAthletePlatformPage setPage={setPage} />;
      case 'join_us':
        return <JoinUsPage setPage={setPage} />;
      case 'my_consultations':
        return <MyPlansPage 
            savedConsultations={savedConsultations} 
            onDelete={handleDeleteConsultation}
            onRestore={handleRestoreConsultation}
            setPage={setPage} 
        />;
      case 'download_app':
        return <DownloadAppPage />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
      <div className="bg-gray-900 text-white font-sans">
        <SiteHeader
          currentPage={currentPage}
          setPage={setPage}
          isAuthenticated={isAuthenticated}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onLogoutClick={handleLogout}
          onSearchClick={() => setIsSearchModalOpen(true)}
        />
        <main>
            {renderPage()}
        </main>
        <SiteFooter />
        <QuotaErrorModal isOpen={isQuotaExhausted} onClose={() => setIsQuotaExhausted(false)} />
        <ChangelogModal isOpen={isChangelogModalOpen} onClose={() => setIsChangelogModalOpen(false)} />
        <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
            onLogin={handleLogin} 
        />
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onSearch={handleSearch}
          isLoading={isSearching}
          results={searchResults}
          error={searchError}
          onNavigate={handleNavigateFromSearch}
        />
      </div>
  );
};

export default App;