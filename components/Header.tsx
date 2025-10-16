import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Page } from '../types';

interface SiteHeaderProps {
    currentPage: Page;
    setPage: (page: Page) => void;
    isAuthenticated: boolean;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    onSearchClick: () => void;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPage, setPage, isAuthenticated, onLoginClick, onLogoutClick, onSearchClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  
  const langMenuRef = useRef<HTMLDivElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
       if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setIsServicesMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handlePageChange = (page: Page) => {
      setPage(page);
      setIsMobileMenuOpen(false);
      setIsServicesMenuOpen(false);
      window.scrollTo(0, 0);
  }
  
  const navLinks = [
    { key: 'home', text: t('header.home'), action: () => handlePageChange('home') },
    { key: 'location_finder', text: t('header.locationFinder'), action: () => handlePageChange('location_finder') },
    { key: 'ai_consultant', text: t('header.aiCoach'), action: () => handlePageChange('ai_consultant') },
    { key: 'market_trends', text: t('header.marketTrends'), action: () => handlePageChange('market_trends') },
    { key: 'our_experts', text: t('header.ourExperts'), action: () => handlePageChange('our_experts') },
    { key: 'collaboration', text: t('header.collaboration'), action: () => handlePageChange('collaboration') },
    { key: 'join_us', text: t('header.joinUs'), action: () => handlePageChange('join_us') },
    { key: 'seller_hub', text: t('header.sellerHub'), action: () => handlePageChange('seller_hub') },
    { key: 'my_consultations', text: t('header.myPlans'), action: () => handlePageChange('my_consultations') },
  ];

  const servicesLinks = [
      { key: 'skin_consultation', text: t('header.skinConsultation'), action: () => handlePageChange('skin_consultation') },
      { key: 'fitness_assessment', text: t('header.fitnessAssessment'), action: () => handlePageChange('fitness_assessment') },
      { key: 'cosmetic_simulator', text: t('header.cosmeticSimulator'), action: () => handlePageChange('cosmetic_simulator') },
      { key: 'physique_simulator', text: t('header.physiqueSimulator'), action: () => handlePageChange('physique_simulator') },
  ];

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button onClick={() => setPage('home')} className="flex-shrink-0 flex items-center space-x-2 rtl:space-x-reverse transform transition-transform hover:scale-105">
               <svg className="h-8 w-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M10 3.5a1.5 1.5 0 011.396 2.21l-4.133 7.032a1.5 1.5 0 01-2.592-1.525L8.604 5.71A1.5 1.5 0 0110 3.5zM10 3.5a1.5 1.5 0 00-1.396 2.21l4.133 7.032a1.5 1.5 0 002.592-1.525L11.396 5.71A1.5 1.5 0 0010 3.5z" />
               </svg>
              <span className="font-bold text-xl text-white">AURA AI</span>
            </button>
            <nav className="hidden md:flex md:ml-10 md:space-x-1 lg:space-x-2">
              <button onClick={() => handlePageChange('home')} className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transform transition-all duration-200 hover:-translate-y-0.5 ${currentPage === 'home' ? 'text-teal-300' : ''}`}>
                {t('header.home')}
              </button>
              <div className="relative" ref={servicesMenuRef}>
                <button 
                  onClick={() => setIsServicesMenuOpen(prev => !prev)}
                  className={`flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transform transition-all duration-200 hover:-translate-y-0.5 ${servicesLinks.some(l => l.key === currentPage) ? 'text-teal-300' : ''}`}
                >
                  {t('header.aiServices')}
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${isServicesMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
                {isServicesMenuOpen && (
                    <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="p-1">
                            {servicesLinks.map(link => (
                                <button key={link.key} onClick={link.action} className={`w-full text-left block px-4 py-2 text-sm rounded-md transition-colors ${currentPage === link.key ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                    {link.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
              </div>
              {navLinks.slice(1).map(link => (
                  <button key={link.key} onClick={link.action} className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transform transition-all duration-200 hover:-translate-y-0.5 ${currentPage === link.key ? 'text-teal-300' : ''}`}>
                    {link.text}
                  </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={onSearchClick} className="flex items-center text-gray-300 hover:text-white transform transition-transform hover:scale-110" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <div className="relative" ref={langMenuRef}>
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center text-gray-300 hover:text-white transform transition-transform hover:scale-110" aria-label="Change language">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4 13l4-4M19 9l-4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                {isLangMenuOpen && (
                    <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
                        <div className="p-1" role="none">
                            <button 
                                onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} 
                                className={`w-full text-left block px-4 py-2 text-sm rounded-md transition-colors ${language === 'en' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                role="menuitem"
                            >
                                English
                            </button>
                            <button 
                                onClick={() => { setLanguage('fa'); setIsLangMenuOpen(false); }} 
                                className={`w-full text-left block px-4 py-2 text-sm rounded-md transition-colors ${language === 'fa' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                role="menuitem"
                            >
                                فارسی (Persian)
                            </button>
                            <button 
                                onClick={() => { setLanguage('ar'); setIsLangMenuOpen(false); }} 
                                className={`w-full text-left block px-4 py-2 text-sm rounded-md transition-colors ${language === 'ar' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                role="menuitem"
                            >
                                العربية (Arabic)
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="hidden sm:block">
                {isAuthenticated ? (
                    <button onClick={onLogoutClick} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors text-sm">
                        {t('header.logout')}
                    </button>
                ) : (
                    <button onClick={onLoginClick} className="px-4 py-2 bg-gray-700/50 border border-gray-500 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors text-sm">
                        {t('header.login')}
                    </button>
                )}
            </div>

            <div className="flex md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => handlePageChange('home')} className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'home' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                {t('header.home')}
              </button>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('header.aiServices')}</h3>
                 {servicesLinks.map(link => (
                    <button key={link.key} onClick={link.action} className={`w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === link.key ? 'bg-gray-900 text-white' : ''}`}>
                        {link.text}
                    </button>
                 ))}
              </div>
              {navLinks.slice(1).map(link => (
                  <button key={link.key} onClick={link.action} className={`w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === link.key ? 'bg-gray-900 text-white' : ''}`}>
                    {link.text}
                  </button>
              ))}
              <div className="pt-4 border-t border-gray-700">
                {isAuthenticated ? (
                     <button onClick={() => { onLogoutClick(); setIsMobileMenuOpen(false); }} className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        {t('header.logout')}
                    </button>
                ) : (
                    <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        {t('header.login')}
                    </button>
                )}
              </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;