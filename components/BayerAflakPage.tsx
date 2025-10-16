import React from 'react';
import { useLanguage, Page } from '../types';

const IconCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-teal-900/20 backdrop-blur-sm border border-teal-400/20 rounded-lg p-6 text-center transition-all duration-300 hover:bg-teal-900/40 hover:-translate-y-1">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-900/50 mx-auto mb-4 border-2 border-teal-400/30">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-300">{description}</p>
    </div>
);

const StepCard: React.FC<{ icon: React.ReactNode; title: string; description: string; step: string; }> = ({ icon, title, description, step }) => (
    <div className="relative text-center p-6 bg-slate-800 rounded-lg border border-slate-700">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-teal-500 text-white h-10 w-10 flex items-center justify-center rounded-full font-bold border-4 border-slate-900">{step}</div>
        <div className="mt-8 mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
    </div>
);

const ProAthletePlatformPage: React.FC<{ setPage: (page: Page) => void; }> = ({ setPage }) => {
    const { t } = useLanguage();
    const content = t('proAthletePlatform');

    const platformIcons = {
        data: <svg className="h-10 w-10 text-teal-300"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M16 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />  <path d="M12.5 10.5 8 15" />  <path d="m16 10-8 8" /></svg>,
        performance: <svg className="h-10 w-10 text-teal-300"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round">  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
        recovery: <svg className="h-10 w-10 text-teal-300"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />  <polyline points="12 6 12 12 16 14" /></svg>,
    };

    return (
        <div className="bg-slate-900 animate-fade-in font-inter">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-teal-900/50 py-32 text-center">
                <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/double-bubble-outline.png')] opacity-10"></div>
                 <div className="container mx-auto px-4 relative z-20">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">{content.hero.title}</h1>
                    <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">{content.hero.subtitle}</p>
                    <div className="mt-8">
                        <button onClick={() => {}} className="px-8 py-3 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20">
                            {content.hero.cta}
                        </button>
                    </div>
                </div>
            </section>

            {/* Platform Pillars */}
            <section className="py-20 sm:py-28 bg-slate-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-12">{content.pillars.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <IconCard icon={platformIcons.data} title={content.pillars.data.title} description={content.pillars.data.description} />
                        <IconCard icon={platformIcons.performance} title={content.pillars.performance.title} description={content.pillars.performance.description} />
                        <IconCard icon={platformIcons.recovery} title={content.pillars.recovery.title} description={content.pillars.recovery.description} />
                    </div>
                </div>
            </section>

            {/* AI Engine */}
            <section className="py-20 sm:py-28 bg-slate-800/50">
                <div className="container mx-auto px-4">
                     <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{content.aiEngine.title}</h2>
                        <p className="mt-3 text-slate-300">{content.aiEngine.subtitle}</p>
                     </div>
                     <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <StepCard step="1" title={content.aiEngine.step1.title} description={content.aiEngine.step1.description} icon={<svg className="h-12 w-12 mx-auto text-teal-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}/>
                        <div className="text-teal-500/50 hidden md:block text-center"> <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg> </div>
                        <StepCard step="2" title={content.aiEngine.step2.title} description={content.aiEngine.step2.description} icon={<svg className="h-12 w-12 mx-auto text-teal-400" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />  <polyline points="15 3 21 3 21 9" />  <line x1="10" y1="14" x2="21" y2="3" /></svg>}/>
                        <div className="text-teal-500/50 hidden md:block text-center"> <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg> </div>
                        <StepCard step="3" title={content.aiEngine.step3.title} description={content.aiEngine.step3.description} icon={<svg className="h-12 w-12 mx-auto text-teal-400"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>}/>
                     </div>
                </div>
            </section>
            
            {/* Contact Form */}
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 max-w-2xl">
                     <div className="text-center">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{content.contact.title}</h2>
                        <p className="mt-3 text-slate-300">{content.contact.subtitle}</p>
                     </div>
                     <form className="mt-12 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">{content.contact.name}</label>
                                <input type="text" id="name" className="w-full bg-slate-800 border-slate-600 rounded-md p-3 focus:ring-teal-500 focus:border-teal-500 text-white" />
                            </div>
                            <div>
                                <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-2">{content.contact.organization}</label>
                                <input type="text" id="organization" className="w-full bg-slate-800 border-slate-600 rounded-md p-3 focus:ring-teal-500 focus:border-teal-500 text-white" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">{content.contact.email}</label>
                            <input type="email" id="email" className="w-full bg-slate-800 border-slate-600 rounded-md p-3 focus:ring-teal-500 focus:border-teal-500 text-white" />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="px-10 py-3 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20">
                                {content.contact.submit}
                            </button>
                        </div>
                     </form>
                </div>
            </section>
        </div>
    );
};

export default ProAthletePlatformPage;