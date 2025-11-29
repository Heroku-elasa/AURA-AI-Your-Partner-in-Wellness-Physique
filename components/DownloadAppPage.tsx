import React from 'react';
import { useLanguage } from '../types';

const DownloadAppPage: React.FC = () => {
    const { t } = useLanguage();

    const DownloadButton: React.FC<{ href: string; icon: React.ReactNode; text: string; subtext: string; }> = ({ href, icon, text, subtext }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gray-800/50 border border-white/10 p-4 rounded-lg hover:bg-gray-700 transition-colors transform hover:-translate-y-1 duration-300">
            <div className="text-4xl text-white">{icon}</div>
            <div>
                <p className="text-xs text-gray-400">{subtext}</p>
                <p className="font-semibold text-white">{text}</p>
            </div>
        </a>
    );

    return (
        <section className="py-16 sm:py-24 animate-fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        {t('downloadAppPage.title')}
                    </h1>
                    <p className="mt-4 text-lg text-gray-300">
                        {t('downloadAppPage.subtitle')}
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative flex justify-center">
                        <div className="absolute w-60 h-60 bg-teal-500/20 rounded-full blur-3xl"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop"
                            alt="App preview on phone"
                            className="relative w-full max-w-sm rounded-[2.5rem] border-8 border-gray-700 shadow-2xl"
                        />
                    </div>
                    
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <DownloadButton 
                                href="#" 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 16 16"><path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258C11.368.072 11.226.04 11.182.008ZM10.232 4.334a4.3 4.3 0 0 0-1.93.454c-1.53 1.05-2.61 2.92-2.61 4.908 0 1.95.98 3.65 2.53 4.8.8.6 1.66.9 2.55.9.96 0 1.7-.3 2.4-.85.73-.55 1.25-1.3 1.3-2.1H13.4c-.1.6-.4.9-.7.9-.3 0-.6-.2-.9-.5-.6-.6-.9-1.3-.9-2.2h3.8c.1-2-1.1-5.1-3.4-5.1Z"/></svg>}
                                subtext={t('downloadAppPage.appStore')}
                                text="App Store"
                            />
                             <DownloadButton 
                                href="#" 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 16 16"><path d="M13.54 2.27a2.5 2.5 0 0 0-3.52 0l-7.05 7.05A2.5 2.5 0 0 0 3.5 13H5v.5a2.5 2.5 0 0 0 5 0V13h1.5a2.5 2.5 0 0 0 2.27-3.51l-7.05-7.05Z"/><path d="M12.27 13.54a2.5 2.5 0 0 0 0-3.52l-7.05-7.05a2.5 2.5 0 0 0-3.51 2.27V13h.5a2.5 2.5 0 0 0 5 0V7.5h1.5a2.5 2.5 0 0 0 3.51 3.51Z"/></svg>} 
                                subtext={t('downloadAppPage.googlePlay')}
                                text="Google Play"
                            />
                        </div>
                        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center gap-6">
                            <div className="p-4 bg-white rounded-lg">
                                <svg className="w-28 h-28" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="M128 256a128 128 0 1 0 0-256a128 128 0 0 0 0 256ZM76 76h10v10H76Zm-10-10h10v10H66Zm-10-10h10v10H56Zm-10-10h10v10H46Zm40-10h10v10H86Zm-10-10h10v10H76Zm-10-10h10v10H66Zm-10 0h10v10H56Zm40 0h10v10H86Zm-10 0h10v10H76Zm-10 0h10v10H66Zm60 0h10v10h-10Zm-10 0h10v10h-10Zm-10 0h10v10h-10Zm-10 0h10v10h-10Zm-10 0h10v10H86Zm-10 0h10v10H76Zm20 0h10v10h-10Zm50-10h10v10h-10Zm-10-10h10v10h-10Zm-10-10h10v10h-10Zm-10-10h10v10h-10Zm-10-10h10v10h-10Zm-10 0h10v10h-10Zm40 0h10v10h-10Zm-10 0h10v10h-10Zm-10 0h10v10h-10Zm50-10h10v10h-10Zm-10-10h10v10h-10Zm-10-10h10v10h-10Zm40-10h10v10h-10Zm-10-10h10v10h-10Zm40-10h10v10h-10Zm10 140h10v10h-10Zm-10 10h10v10h-10Zm-10 10h10v10h-10Zm-10 10h10v10h-10Zm-10 10h10v10h-10Zm-10 0h10v10h-10Zm-10 0h10v10h-10Zm-10-10h10v10h-10Zm-10-10h10v10h-10Zm-10-10h10v10h-10Zm0-10h10v10h-10Zm0-10h10v10h-10Zm-10 10h10v10h-10Zm-10 0h10v10h-10Zm-10 10h10v10h-10Zm-10 10h10v10h-10Zm-10 10h10v10h-10Zm0 10h10v10h-10Zm0 10h10v10h-10Zm10 10h10v10h-10Zm10 10h10v10h-10Zm10 0h10v10h-10Zm10 0h10v10h-10Zm10-10h10v10h-10Zm10-10h10v10h-10Zm10-10h10v10h-10Zm10-10h10v10h-10Zm0-10h10v10h-10Zm-10-10h10v10h-10Zm-10-10h10v10h-10Zm-10-10h10v10h-10Zm-10 0h10v10h-10Zm-10 0h10v10h-10Zm-10 10h10v10h-10Zm0 10h10v10h-10Zm0 10h10v10h-10Zm10 10h10v10h-10Zm10 0h10v10h-10Zm10 0h10v10h-10Z"/></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{t('downloadAppPage.scanQr')}</h3>
                                <p className="text-gray-400 mt-1">{t('downloadAppPage.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default DownloadAppPage;
