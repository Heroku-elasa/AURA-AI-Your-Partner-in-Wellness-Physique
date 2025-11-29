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
import ContentCreatorPage from './components/ContentCreatorPage';
import TrendHubPage from './components/TrendHubPage';
import BaristaStylerPage from './components/BaristaStyler';
import AnalyticsPage from './components/AnalyticsPage';
import PostureAnalysisPage from './components/PostureAnalysisPage';
import UserProfilePage from './components/UserProfilePage';
import ConversationCoach from './components/DatingSimulator';
import LiveBeautyCoachPage from './components/LiveBeautyCoachPage';
import ErrorBoundary from './components/ErrorBoundary';
import { Page, SavedConsultation, ProviderSearchResult, Message, SearchResultItem, useLanguage, BaristaStyleResult, SiteAnalyticsData, PostureAnalysisResult, ConversationCoachState, TrainingPath, TrainingScenario, Difficulty, Goal, ProductRecommendation } from './types';
import { useToast } from './components/Toast';
import { initDB, saveConsultation as saveDb, getAllSavedConsultations, deleteConsultation as deleteDb } from './services/dbService';
import { performSemanticSearch, findLocalProviders, generateBaristaImage, generateBaristaMusicTheme, generateSiteAnalytics, analyzePostureAndMovement, sendCoachMessage, analyzeConversation, suggestTrainingPaths, performLiveBeautification, getBeautyRecommendations } from './services/geminiService';
import { TRAINING_PATHS } from './constants';


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
  
  // Barista Styler State
  const [baristaStyleResult, setBaristaStyleResult] = useState<BaristaStyleResult | null>(null);
  const [isGeneratingBaristaStyle, setIsGeneratingBaristaStyle] = useState(false);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState<SiteAnalyticsData | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Posture Analysis State
  const [postureAnalysisResult, setPostureAnalysisResult] = useState<PostureAnalysisResult | null>(null);
  const [isAnalyzingPosture, setIsAnalyzingPosture] = useState(false);
  
  // Live Beauty Coach State
  const [liveBeautyAnalysisResult, setLiveBeautyAnalysisResult] = useState<{ image: string | null; recommendations: ProductRecommendation[] | null } | null>(null);
  const [isAnalyzingLiveBeauty, setIsAnalyzingLiveBeauty] = useState(false);
  
  // Conversation Coach State
  const initialCoachState: ConversationCoachState = {
    chatHistory: [{ role: 'model', parts: [{ text: "Hello! I'm your conversation coach. Let's practice your social skills. You can start by telling me about a recent conversation, or we can jump into a training scenario." }] }],
    isStreaming: false,
    isLoadingAnalysis: false,
    currentAnalysis: null,
    error: null,
    activeGoal: null,
    practiceCount: 0,
    showPathSelectionScreen: false,
    activeTrainingPathId: null,
    activeScenarioId: null,
    activeDifficulty: null,
    completedScenarios: {},
    pathSuggestions: null,
    selectedPartnerId: 'supportive'
  };
  const [conversationCoachState, setConversationCoachState] = useState<ConversationCoachState>(initialCoachState);



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
  
  useEffect(() => {
    // Proactively check camera permissions when navigating to pages that need it.
    if (currentPage === 'skin_consultation' || currentPage === 'posture_analysis' || currentPage === 'live_beauty_coach' || currentPage === 'cosmetic_simulator') {
        if (navigator.permissions?.query) {
            navigator.permissions.query({ name: 'camera' as PermissionName })
                .then((permissionStatus) => {
                    if (permissionStatus.state === 'denied') {
                        addToast(t('permissions.cameraDenied'), "info");
                    }
                })
                .catch(err => {
                    console.warn("Could not query for camera permission:", err);
                });
        }
    }
  }, [currentPage, addToast, t]);

  const handleApiError = (error: unknown): string => {
    let message = "An unexpected error occurred. Please try again.";
    
    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    }
    
    // The Gemini service now provides a specific message for quota errors.
    if (message.toLowerCase().includes('quota')) {
        setIsQuotaExhausted(true);
    }
    
    addToast(message, 'error');
    return message; // This is used to set local error state in some components
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPage('home');
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
      
      let location: { lat: number; lon: number } | null = null;
      
      if (searchMethod === 'geo') {
          try {
              location = await new Promise((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(
                      position => resolve({
                          lat: position.coords.latitude,
                          lon: position.coords.longitude
                      }),
                      error => reject(error), // Reject the promise on error
                      { timeout: 10000 }
                  );
              });
          } catch (error: any) {
              console.error(`Geolocation error (Code: ${error.code}): ${error.message}`);
              let toastMessage: string;
              switch(error.code) {
                  case error.PERMISSION_DENIED:
                      toastMessage = t('locationFinder.errors.permissionDenied');
                      break;
                  case error.POSITION_UNAVAILABLE:
                      toastMessage = t('locationFinder.errors.positionUnavailable');
                      break;
                  case error.TIMEOUT:
                      toastMessage = t('locationFinder.errors.timeout');
                      break;
                  default:
                      toastMessage = t('locationFinder.errors.generic');
                      break;
              }
              addToast(`${toastMessage} ${t('locationFinder.errors.searchingWithoutLocation')}`, 'info');
              // location remains null, allowing search to continue without it.
          }
      }

      try {
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
          { name: t('header.contentCreator'), target: 'content_creator', description: t('contentCreator.subtitle') },
          { name: t('header.trendHub'), target: 'trend_hub', description: t('trendHub.subtitle') },
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

  const handleGenerateBaristaStyle = async (description: string) => {
    setIsGeneratingBaristaStyle(true);
    
    const initialResultState: BaristaStyleResult = {
        isLoadingFemaleOutfits: true,
        femaleOutfitUrls: null,
        isLoadingMaleOutfits: true,
        maleOutfitUrls: null,
        isLoadingCounterDesigns: true,
        counterUrls: null,
        musicTheme: '...',
    };
    setBaristaStyleResult(initialResultState);

    const femalePrompt = `Photorealistic image of a female barista uniform inspired by this cafe theme: "${description}". The image should show the full outfit (top, apron, pants/skirt) on a mannequin or against a neutral background. Focus on a stylish, practical, and clean look.`;
    const malePrompt = `Photorealistic image of a male barista uniform inspired by this cafe theme: "${description}". The image should show the full outfit (top, apron, pants) on a mannequin or against a neutral background. Focus on a stylish, practical, and clean look.`;
    const counterPrompt = `Photorealistic image of a coffee shop counter design and ambiance inspired by this theme: "${description}". Show the main counter, espresso machine, pastry display, and general lighting. The style should be appealing and professional.`;

    const femalePromise = generateBaristaImage(femalePrompt)
        .then(base64 => setBaristaStyleResult(prev => prev ? ({ ...prev, femaleOutfitUrls: [`data:image/png;base64,${base64}`] }) : prev))
        .catch(err => { handleApiError(err); })
        .finally(() => setBaristaStyleResult(prev => prev ? ({ ...prev, isLoadingFemaleOutfits: false }) : prev));
        
    const malePromise = generateBaristaImage(malePrompt)
        .then(base64 => setBaristaStyleResult(prev => prev ? ({ ...prev, maleOutfitUrls: [`data:image/png;base64,${base64}`] }) : prev))
        .catch(err => { handleApiError(err); })
        .finally(() => setBaristaStyleResult(prev => prev ? ({ ...prev, isLoadingMaleOutfits: false }) : prev));

    const counterPromise = generateBaristaImage(counterPrompt)
        .then(base64 => setBaristaStyleResult(prev => prev ? ({ ...prev, counterUrls: [`data:image/png;base64,${base64}`] }) : prev))
        .catch(err => { handleApiError(err); })
        .finally(() => setBaristaStyleResult(prev => prev ? ({ ...prev, isLoadingCounterDesigns: false }) : prev));
        
    const musicPromise = generateBaristaMusicTheme(description, language)
        .then(theme => setBaristaStyleResult(prev => prev ? ({ ...prev, musicTheme: theme }) : prev))
        .catch(err => {
            handleApiError(err);
            setBaristaStyleResult(prev => prev ? ({ ...prev, musicTheme: 'Error generating music theme.' }) : prev);
        });

    await Promise.allSettled([femalePromise, malePromise, counterPromise, musicPromise]);

    setIsGeneratingBaristaStyle(false);
  };

  const handleFetchAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
        const data = await generateSiteAnalytics(language);
        setAnalyticsData(data);
    } catch (err) {
        handleApiError(err);
    } finally {
        setIsLoadingAnalytics(false);
    }
  };

  const handlePostureAnalysis = async (imageBase64: string, mimeType: string, analysisType: 'posture' | 'squat') => {
    setIsAnalyzingPosture(true);
    setPostureAnalysisResult(null);
    try {
        const result = await analyzePostureAndMovement(imageBase64, mimeType, analysisType, language);
        setPostureAnalysisResult(result);
    } catch (err) {
        handleApiError(err);
    } finally {
        setIsAnalyzingPosture(false);
    }
  };
  
  const handleLiveBeautyAnalysis = async (imageBase64: string, mimeType: string) => {
    setIsAnalyzingLiveBeauty(true);
    setLiveBeautyAnalysisResult(null);
    try {
        const [imageResult, recommendationsResult] = await Promise.all([
            performLiveBeautification(imageBase64, mimeType, language),
            getBeautyRecommendations(imageBase64, mimeType, language)
        ]);
        setLiveBeautyAnalysisResult({
            image: `data:image/png;base64,${imageResult}`,
            recommendations: recommendationsResult,
        });
    } catch (err) {
        handleApiError(err);
    } finally {
        setIsAnalyzingLiveBeauty(false);
    }
  };
  
  // --- CONVERSATION COACH HANDLERS ---
    const handleCoachSendMessage = async (message: string) => {
        const userMessage: Message = { role: 'user', parts: [{ text: message }] };
        const newHistory = [...conversationCoachState.chatHistory, userMessage];

        setConversationCoachState(prev => ({ ...prev, chatHistory: newHistory, isStreaming: true, error: null }));

        try {
            const activeScenario = TRAINING_PATHS.flatMap(p => p.scenarios).find(s => s.id === conversationCoachState.activeScenarioId);
            const partner = t('coach.partners').find((p: any) => p.id === conversationCoachState.selectedPartnerId) || t('coach.partners')[0];
            
            const aiResponseText = await sendCoachMessage(
                newHistory,
                language,
                partner,
                activeScenario,
                conversationCoachState.activeDifficulty
            );

            const aiResponse: Message = { role: 'model', parts: [{ text: aiResponseText }] };
            setConversationCoachState(prev => ({ ...prev, chatHistory: [...prev.chatHistory, aiResponse] }));

        } catch (err) {
            const msg = handleApiError(err);
            setConversationCoachState(prev => ({ ...prev, error: msg }));
        } finally {
            setConversationCoachState(prev => ({ ...prev, isStreaming: false }));
        }
    };

    const handleEndCoachSession = async () => {
        setConversationCoachState(prev => ({ ...prev, isLoadingAnalysis: true, error: null }));
        try {
            const [analysis, suggestions] = await Promise.all([
                analyzeConversation(conversationCoachState.chatHistory, language),
                suggestTrainingPaths(conversationCoachState.chatHistory, language)
            ]);
            setConversationCoachState(prev => ({ ...prev, currentAnalysis: analysis, pathSuggestions: suggestions }));
        } catch (err) {
            const msg = handleApiError(err);
            setConversationCoachState(prev => ({ ...prev, error: msg, currentAnalysis: null }));
        } finally {
            setConversationCoachState(prev => ({ ...prev, isLoadingAnalysis: false }));
        }
    };

    const handleCoachReset = (isEndingScenario = false) => {
        setConversationCoachState(prev => {
            const newState: Partial<ConversationCoachState> = {
                currentAnalysis: null,
                isLoadingAnalysis: false,
                pathSuggestions: null,
                error: null,
            };
            if (isEndingScenario) {
                // Keep training context, but reset chat for next scenario
                newState.chatHistory = [{ role: 'model', parts: [{ text: t('coach.scenarioEnded') }] }];
                newState.activeScenarioId = null;
                newState.activeDifficulty = null;
            } else {
                // Soft reset, go back to path selection or initial screen
                newState.chatHistory = initialCoachState.chatHistory;
                newState.showPathSelectionScreen = prev.activeTrainingPathId ? true : false;
                newState.activeScenarioId = null;
                newState.activeDifficulty = null;
            }
            return { ...prev, ...newState };
        });
    };
    
    const handleFullCoachReset = () => {
        setConversationCoachState(initialCoachState);
    };

    const handleStartTrainingPath = (path: TrainingPath) => {
        setConversationCoachState(prev => ({
            ...prev,
            activeTrainingPathId: path.id,
            showPathSelectionScreen: false,
            chatHistory: [{ role: 'model', parts: [{ text: `Training Path Started: ${path.title[language]}` }] }]
        }));
    };
    
    const handleStartScenario = (scenario: TrainingScenario, difficulty: Difficulty) => {
         setConversationCoachState(prev => ({
            ...prev,
            activeScenarioId: scenario.id,
            activeDifficulty: difficulty,
            chatHistory: [{ role: 'model', parts: [{ text: `Starting scenario: ${scenario.title[language]} (${difficulty}). ${t('coach.scenarioStartPrompt')}` }] }]
        }));
    };
    
    const handleExitTraining = () => {
        setConversationCoachState(prev => ({
            ...prev,
            activeTrainingPathId: null,
            activeScenarioId: null,
            activeDifficulty: null,
            showPathSelectionScreen: true
        }));
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
       case 'posture_analysis':
        return <PostureAnalysisPage
            onAnalyze={handlePostureAnalysis}
            isLoading={isAnalyzingPosture}
            result={postureAnalysisResult}
            isQuotaExhausted={isQuotaExhausted}
            handleApiError={handleApiError}
        />;
       case 'live_beauty_coach':
        return <LiveBeautyCoachPage
            onAnalyze={handleLiveBeautyAnalysis}
            isLoading={isAnalyzingLiveBeauty}
            result={liveBeautyAnalysisResult}
            isQuotaExhausted={isQuotaExhausted}
            handleApiError={handleApiError}
        />;
       case 'conversation_coach':
        const activePath = TRAINING_PATHS.find(p => p.id === conversationCoachState.activeTrainingPathId);
        const activeScenario = activePath?.scenarios.find(s => s.id === conversationCoachState.activeScenarioId);
        return <ConversationCoach
            state={conversationCoachState}
            setState={setConversationCoachState}
            onSendMessage={handleCoachSendMessage}
            onEndSession={handleEndCoachSession}
            onReset={handleCoachReset}
            onFullReset={handleFullCoachReset}
            activePath={activePath || null}
            activeScenario={activeScenario || null}
            onStartTrainingPath={handleStartTrainingPath}
            onStartScenario={handleStartScenario}
            onExitTraining={handleExitTraining}
            // Dummy props for practice goals not yet implemented
            onStartPractice={(goal: Goal) => {}}
            onNextPractice={() => {}}
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
      case 'user_profile':
         return <UserProfilePage
            savedConsultations={savedConsultations}
            onDelete={handleDeleteConsultation}
            onRestore={handleRestoreConsultation}
            setPage={setPage}
            onLogoutClick={handleLogout}
        />;
      case 'download_app':
        return <DownloadAppPage />;
      case 'content_creator':
        return <ContentCreatorPage handleApiError={handleApiError} />;
      case 'trend_hub':
        return <TrendHubPage handleApiError={handleApiError} />;
      case 'barista_styler':
        return <BaristaStylerPage 
          onGenerate={handleGenerateBaristaStyle}
          isLoading={isGeneratingBaristaStyle}
          error={null}
          result={baristaStyleResult}
          isQuotaExhausted={isQuotaExhausted}
        />;
      case 'analytics':
        return <AnalyticsPage
            data={analyticsData}
            isLoading={isLoadingAnalytics}
            onRefresh={handleFetchAnalytics}
            isQuotaExhausted={isQuotaExhausted}
        />;
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
            <ErrorBoundary>
                {renderPage()}
            </ErrorBoundary>
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