import React from 'react';
import { useLanguage, Page } from '../types';

interface FranchisePageProps {
    setPage: (page: Page) => void;
}

const CanvasCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-white/10 transition-all duration-300 hover:border-rose-400/50 hover:bg-gray-800 hover:-translate-y-1">
        <div className="flex items-center gap-4 mb-3">
            <div className="flex-shrink-0 bg-rose-900/50 p-3 rounded-lg text-rose-300">{icon}</div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
);

const TeamRoleCard: React.FC<{ role: string; description: string }> = ({ role, description }) => (
    <div className="bg-gray-800/80 p-5 rounded-lg border-l-4 border-rose-500">
        <h4 className="font-semibold text-white">{role}</h4>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
);

const FranchisePage: React.FC<FranchisePageProps> = ({ setPage }) => {
    const { t } = useLanguage();
    const canvas = t('franchisePage.canvasItems');
    const teamRoles = t('franchisePage.teamRoles');

    const canvasIcons: { [key: string]: React.ReactNode } = {
        valueProposition: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
        targetMarket: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        revenueStreams: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        keyResources: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
        marketingSupport: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.584M15 18A5.973 5.973 0 0017 6h1.832c4.1 0 7.625 2.236 9.168 5.584" /></svg>,
        partnershipModel: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    };

    return (
        <div className="animate-fade-in bg-gray-900 text-white">
            <section className="relative py-24 sm:py-32 flex items-center justify-center text-center overflow-hidden">
                 <img 
                    src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop"
                    alt="Modern clinic interior"
                    className="absolute z-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                <div className="z-20 p-4 space-y-6 container mx-auto">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                        {t('franchisePage.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">{t('franchisePage.subtitle')}</p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
                <section>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            {t('franchisePage.canvasTitle')}
                        </h2>
                        <p className="mt-4 text-gray-300">
                            {t('franchisePage.canvasSubtitle')}
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {typeof canvas === 'object' && canvas && Object.entries(canvas).map(([key, value]: [string, any]) => (
                             <CanvasCard 
                                key={key} 
                                icon={canvasIcons[key]} 
                                title={value.title} 
                                description={value.description}
                             />
                        ))}
                    </div>
                </section>
                
                <section>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            {t('franchisePage.teamBuildingTitle')}
                        </h2>
                        <p className="mt-4 text-gray-300">
                            {t('franchisePage.teamBuildingSubtitle')}
                        </p>
                    </div>
                    <div className="mt-12 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                         {teamRoles.map((role: {role: string, description: string}, index: number) => (
                            <TeamRoleCard key={index} role={role.role} description={role.description} />
                         ))}
                    </div>
                </section>

                 <section className="bg-gray-800/50 p-8 sm:p-12 rounded-lg border border-rose-500/30 text-center shadow-lg">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {t('franchisePage.nextStepsTitle')}
                    </h2>
                    <p className="mt-4 text-gray-300 max-w-3xl mx-auto">
                        {t('franchisePage.nextStepsSubtitle')}
                    </p>
                    <div className="mt-10 bg-gray-900/50 p-8 rounded-lg max-w-2xl mx-auto">
                         <h3 className="text-xl font-bold text-rose-300">
                            {t('franchisePage.tokenPurchaseTitle')}
                         </h3>
                         <p className="mt-3 text-sm text-gray-400">
                            {t('franchisePage.tokenPurchaseDescription')}
                         </p>
                         <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => alert('Token purchase functionality coming soon!')}
                                className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-rose-500/40 transform duration-300 hover:scale-105"
                            >
                                {t('franchisePage.purchaseButton')}
                            </button>
                             <button
                                onClick={() => alert('Contact functionality coming soon!')}
                                className="px-8 py-3 bg-transparent border-2 border-white/70 text-white font-bold rounded-lg hover:bg-white/10 hover:border-white transition-all transform duration-300"
                            >
                                {t('franchisePage.contactButton')}
                            </button>
                         </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FranchisePage;