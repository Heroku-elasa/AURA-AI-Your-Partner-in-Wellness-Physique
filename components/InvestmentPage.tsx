import React from 'react';
import { useLanguage, Page } from '../types';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-gray-800/50 p-6 sm:p-8 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 ${className}`}>
        {children}
    </div>
);

interface CollaborationPageProps {
    setPage: (page: Page) => void;
}

const CollaborationPage: React.FC<CollaborationPageProps> = ({ setPage }) => {
    const { t } = useLanguage();
    const canvasItems: { [key: string]: string } = t('collaborationPage.canvasItems');

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        {t('collaborationPage.title')}
                    </h1>
                </div>

                <Card>
                    <h2 className="text-2xl font-bold text-rose-300 mb-4">{t('collaborationPage.goalTitle')}</h2>
                    <p className="text-gray-300 leading-relaxed">{t('collaborationPage.goalText')}</p>
                </Card>

                <Card>
                    <h2 className="text-2xl font-bold text-rose-300 mb-4">{t('collaborationPage.canvasTitle')}</h2>
                    <ul className="space-y-3 text-gray-300">
                        {Object.values(canvasItems).map((item, index) => (
                           <li key={index} className="flex items-start">
                             <svg className="w-5 h-5 text-green-400 mr-2 rtl:ml-2 rtl:mr-0 flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span>{item}</span>
                           </li>
                        ))}
                    </ul>
                </Card>

                <Card>
                    <h2 className="text-2xl font-bold text-rose-300 mb-4">{t('collaborationPage.statusTitle')}</h2>
                    <div className="text-center">
                        <p className="text-5xl font-bold text-white">{t('collaborationPage.progressLabel')}</p>
                        <p className="text-gray-400 mt-2">{t('collaborationPage.statusText')}</p>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-2xl font-bold text-rose-300 mb-6">{t('collaborationPage.methodsTitle')}</h2>
                    <div className="space-y-8">
                        <div className="pt-6 border-t border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-3">{t('collaborationPage.seedTitle')}</h3>
                            <p className="text-gray-300 mb-4">{t('collaborationPage.seedText')}</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href="/agreement.pdf"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-lg text-center"
                                >
                                    {t('collaborationPage.viewContractButton')}
                                </a>
                                <a 
                                    href="https://wa.me/989123456789" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors shadow-lg text-center"
                                >
                                    {t('collaborationPage.contactWhatsAppButton')}
                                </a>
                            </div>
                        </div>

                         <div className="pt-6 border-t border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-3">{t('collaborationPage.franchiseTitle')}</h3>
                            <p className="text-gray-300 mb-4">{t('collaborationPage.franchiseText')}</p>
                            <button 
                                onClick={() => setPage('franchise')}
                                className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors shadow-lg"
                            >
                                {t('collaborationPage.franchiseButton')}
                            </button>
                        </div>
                        
                        <div className="pt-6 border-t border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-3">{t('collaborationPage.crowdfundingTitle')}</h3>
                            <p className="text-gray-300 mb-4">{t('collaborationPage.crowdfundingText')}</p>
                            <button
                                disabled 
                                className="inline-block px-6 py-3 bg-gray-600 text-white font-semibold rounded-md transition-colors shadow-lg cursor-not-allowed"
                            >
                                {t('collaborationPage.buyTokenButton')}
                            </button>
                        </div>

                    </div>
                </Card>

            </div>
        </div>
    );
};

export default CollaborationPage;