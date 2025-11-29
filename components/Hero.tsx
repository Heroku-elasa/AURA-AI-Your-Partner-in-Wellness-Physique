import React, { useState } from 'react';
import { useLanguage, Page } from '../types';

interface HomePageProps {
    setPage: (page: Page) => void;
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className }) => {
    const cosmeticClass = "h-12 w-12 text-rose-400 mb-4";
    const fitnessClass = "h-12 w-12 text-teal-400 mb-4";
    const b2bClass = "h-12 w-12 text-purple-400 mb-4 mx-auto";


    switch (name) {
        // Cosmetic
        case 'laser': return <svg xmlns="http://www.w3.org/2000/svg" className={cosmeticClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
        case 'injectables': return <svg xmlns="http://www.w3.org/2000/svg" className={cosmeticClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        case 'facial': return <svg xmlns="http://www.w3.org/2000/svg" className={cosmeticClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" /></svg>;
        case 'skincare': return <svg xmlns="http://www.w3.org/2000/svg" className={cosmeticClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.47 2.118 2.25 2.25 0 01-2.47-2.118c0-.62.28-1.2.752-1.584.572-.472.93-1.204.93-2.002a2.25 2.25 0 00-2.25-2.25c-.832 0-1.612.445-2.031 1.212a3 3 0 00-4.134 4.134 2.25 2.25 0 012.118 2.47 2.25 2.25 0 01-2.118 2.47c-1.196 0-2.242-.88-2.47-2.118a3 3 0 00-1.128-5.78 2.25 2.25 0 01-2.118-2.47c.228-1.238 1.272-2.282 2.51-2.47a3 3 0 005.78-1.128 2.25 2.25 0 012.47-2.118 2.25 2.25 0 012.47 2.118c0 .62-.28 1.2-.752 1.584-.572-.472-.93 1.204-.93 2.002a2.25 2.25 0 002.25 2.25c.832 0 1.612.445 2.031 1.212a3 3 0 004.134-4.134 2.25 2.25 0 01-2.118-2.47 2.25 2.25 0 012.118-2.47c1.196 0 2.242.88 2.47 2.118a3 3 0 001.128 5.78z" /></svg>;
        // Fitness
        case 'workout': return <svg xmlns="http://www.w3.org/2000/svg" className={fitnessClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /><path d="M4.5 10.5h15" /></svg>;
        case 'nutrition': return <svg xmlns="http://www.w3.org/2000/svg" className={fitnessClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.25278C12 6.25278 6.25 3.00001 3.75 3.00001C1.25 3.00001 0 5.25278 0 7.75278C0 11.2528 3.75 14.2528 3.75 14.2528C3.75 14.2528 3.75 21 7.5 21C11.25 21 11.25 14.2528 11.25 14.2528C11.25 14.2528 15 11.2528 15 7.75278C15 5.25278 13.75 3.00001 11.25 3.00001C8.75 3.00001 3.75 6.25278 3.75 6.25278" /><path d="M12.75 21C16.5 21 16.5 14.2528 16.5 14.2528C16.5 14.2528 20.25 11.2528 20.25 7.75278C20.25 5.25278 19 3.00001 16.5 3.00001C14 3.00001 8.25 6.25278 8.25 6.25278" /></svg>;
        case 'physique': return <svg xmlns="http://www.w3.org/2000/svg" className={fitnessClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
        case 'wellness': return <svg xmlns="http://www.w3.org/2000/svg" className={fitnessClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
        // B2B
        case 'analytics': return <svg xmlns="http://www.w3.org/2000/svg" className={b2bClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" /></svg>;
        case 'content': return <svg xmlns="http://www.w3.org/2000/svg" className={b2bClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
        case 'engagement': return <svg xmlns="http://www.w3.org/2000/svg" className={b2bClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H17zM5 12V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" /></svg>;
        default: return null;
    }
};

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
  const { t } = useLanguage();
  const cosmeticServices: { icon: string, title: string, description: string }[] = t('hero.cosmeticServices');
  const fitnessServices: { icon: string, title: string, description: string }[] = t('hero.fitnessServices');
  const aiFitnessExplanation = t('hero.aiFitnessExplanation');
  const b2bFeatures: { icon: string, title: string, description: string }[] = t('b2bCta.features');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);


  return (
    <div className="animate-fade-in bg-gray-900 text-white">
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
             <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop" alt="Fitness background" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"/>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-10"></div>
        <div className="z-20 p-4 space-y-6">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
            dangerouslySetInnerHTML={{ __html: t('hero.title') }}
          />
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">{t('hero.subtitle')}</p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setPage('skin_consultation')}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all text-lg shadow-lg hover:shadow-rose-500/40 transform duration-300 hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 rtl:ml-3 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" />
                </svg>
                {t('hero.button1')}
              </button>
              <button
                onClick={() => setPage('fitness_assessment')}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all text-lg shadow-lg hover:shadow-teal-500/40 transform duration-300 hover:scale-105 animate-pulse-glow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 rtl:ml-3 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('hero.button2')}
              </button>
               <button
                onClick={() => setPage('live_beauty_coach')}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold rounded-lg hover:from-fuchsia-600 hover:to-purple-600 transition-all text-lg shadow-lg hover:shadow-fuchsia-500/40 transform duration-300 hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 rtl:ml-3 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {t('hero.button5')}
              </button>
              <button
                onClick={() => setPage('posture_analysis')}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all text-lg shadow-lg hover:shadow-purple-500/40 transform duration-300 hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 rtl:ml-3 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
                {t('hero.button3')}
              </button>
               <button
                onClick={() => setPage('conversation_coach')}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all text-lg shadow-lg hover:shadow-amber-500/40 transform duration-300 hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 rtl:ml-3 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H17z" />
                </svg>
                {t('hero.button4')}
              </button>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {t('hero.servicesTitle')}
                </h2>
                <p className="mt-4 text-lg text-gray-300">
                    {t('hero.servicesSubtitle')}
                </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-2xl font-bold text-rose-300 mb-8 text-center">Aesthetic Services</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {cosmeticServices.map((service, index) => (
                            <button 
                                key={index} 
                                onClick={() => setPage('skin_consultation')}
                                className="bg-gray-800/50 p-6 rounded-lg border border-white/10 text-left transition-all duration-300 hover:border-rose-400/50 hover:bg-gray-800 hover:-translate-y-2 group"
                            >
                                <Icon name={service.icon} />
                                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">{service.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="text-2xl font-bold text-teal-300 mb-8 text-center">Fitness & Physique</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {fitnessServices.map((service, index) => (
                            <button 
                                key={index} 
                                onClick={() => setPage('fitness_assessment')}
                                className="bg-gray-800/50 p-6 rounded-lg border border-white/10 text-left transition-all duration-300 hover:border-teal-400/50 hover:bg-gray-800 hover:-translate-y-2 group"
                            >
                                <Icon name={service.icon} />
                                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">{service.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>
      
      {/* AI Fitness Explanation Section */}
      <section className="py-20 sm:py-28 bg-gray-800/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {aiFitnessExplanation.title}
            </h2>
            <p className="mt-4 text-lg text-gray-300">
                {aiFitnessExplanation.subtitle}
            </p>
          </div>
          <div className="mt-16 max-w-4xl mx-auto space-y-4">
            {aiFitnessExplanation.points.map((point: {title: string, description: string}, index: number) => (
              <div key={index} className="border border-white/10 rounded-lg overflow-hidden transition-all duration-300 bg-gray-900/30">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-900/50 transition-colors"
                  aria-expanded={openAccordion === index}
                  aria-controls={`accordion-content-${index}`}
                >
                  <h3 className="text-lg font-semibold text-white">{point.title}</h3>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 text-teal-400 transition-transform duration-300 transform ${openAccordion === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  id={`accordion-content-${index}`}
                  className={`transition-all duration-500 ease-in-out grid ${openAccordion === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="p-5 bg-gray-800/50 text-gray-300 border-t border-white/10">
                      <p className="leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Marketing & Content Section */}
      <section className="py-20 sm:py-28 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {t('b2bCta.title')}
                </h2>
                <p className="mt-4 text-lg text-gray-300">
                    {t('b2bCta.subtitle')}
                </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {b2bFeatures.map((feature, index) => (
                     <div key={index} className="bg-gray-800/50 p-6 rounded-lg border border-white/10 text-center transition-all duration-300 hover:border-purple-400/50 hover:bg-gray-800 hover:-translate-y-2 group">
                        <Icon name={feature.icon} />
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{feature.title}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => setPage('collaboration')}
                    className="px-8 py-3 w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-purple-500/40 transform duration-300 hover:scale-105"
                >
                    {t('b2bCta.ctaButton1')}
                </button>
                <button
                    onClick={() => setPage('join_us')}
                    className="px-8 py-3 w-full sm:w-auto bg-transparent border-2 border-white/70 text-white font-bold rounded-lg hover:bg-white/10 hover:border-white transition-all transform duration-300"
                >
                    {t('b2bCta.ctaButton2')}
                </button>
            </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;