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
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 16 16"><path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.525-2.979 1.525-2.979s1.438-.986 1.396-2.451c-.04-.13-1.046-.223-2.13-2.223-.902-.82-.963-1.207-.91-1.234.052-.027 1.08.08 2.343.957.975.68 1.757 1.57 1.757 1.57s.114.135.114.269c0 .135-.07.244-.223.418-.328.378-1.795 1.738-1.795 3.545 0 1.52.54 2.153.642 2.248.092.085.205.135.37.135.215 0 .38-.09.522-.246.143-.156.45-.572.822-1.21.372-.638.64-.864.64-.864s.069-.085.069-.17c0-.135-.09-.231-.21-.308-.11-.07-.243-.16-.38-.256-.128-.095-.25-.192-.354-.288-.11-.095-.17-.18-.17-.24s.04-.12.12-.18c.08-.06.17-.11.25-.15.08-.04.14-.07.14-.07s.046-.028.046-.068c0-.04-.02-.08-.06-.11a.3.3 0 0 0-.21-.084c-.09 0-.17.025-.22.068-.05.043-.1.09-.1.135s.01.07.01.07l.004.008c.018.04.03.07.03.11 0 .04-.01.08-.04.11-.03.03-.07.05-.12.07-.05.02-.1.03-.1.03s-.04.01-.05.01a.1.1 0 0 1-.09-.01c-.05-.02-.09-.05-.12-.08-.03-.03-.05-.06-.06-.1a.1.1 0 0 1 .01-.09c.01-.02.04-.04.07-.06.03-.02.06-.03.1-.04.04-.01.09-.01.14-.01.12 0 .23.04.3.12.08.08.1.18.1.28 0 .1-.04.2-.12.28-.08.08-.18.1-.28.1-.07 0-.13-.01-.18-.04a.2.2 0 0 1-.11-.16c-.01-.05.01-.1.04-.15.03-.05.07-.09.12-.12.05-.03.1-.05.16-.06.06-.01.12 0 .17.02.05.02.1.05.14.09.04.04.06.08.08.13.02.05.02.11.01.17a.6.6 0 0 1-.14.24.8.8 0 0 1-.2.18c-.01.01-.01.01-.02.01a.3.3 0 0 1-.18.06h-.02a.2.2 0 0 1-.12-.04c-.04-.03-.07-.06-.09-.1-.02-.04-.02-.08-.01-.13s.02-.09.04-.13a.2.2 0 0 1 .08-.09c.03-.02.07-.03.11-.03s.08.01.11.02a.1.1 0 0 1 .07.06c.02.03.02.06.01.1a.2.2 0 0 1-.06.09.2.2 0 0 1-.09.05c-.03.01-.06.01-.08.01-.03 0-.06 0-.09-.01-.03-.01-.05-.02-.07-.04-.02-.02-.03-.04-.04-.06a.14.14 0 0 1 0-.08c.01-.03.02-.05.04-.07.02-.02.04-.03.07-.04a.1.1 0 0 1 .08-.01c.03.01.06.02.08.04.02.02.03.04.04.07.01.03.01.06 0 .09a.2.2 0 0 1-.05.08.2.2 0 0 1-.08.04c-.03.01-.06.01-.08.01s-.06 0-.08-.01a.2.2 0 0 1-.08-.04.2.2 0 0 1-.05-.08.2.2 0 0 1 0-.1c.01-.03.03-.06.06-.09.03-.03.06-.05.1-.06.04-.01.08-.01.13-.01.05 0 .1.01.14.02.04.01.08.03.12.06.04.03.07.06.1.1.03.04.05.08.06.13.01.05.01.1 0 .16a.7.7 0 0 1-.12.27.9.9 0 0 1-.22.2c-.1.07-.22.13-.35.19-.13.06-.27.12-.4.18s-.24.1-.33.13ZM8.243 3.323c.046-.052.12-.09.21-.118.09-.028.19-.028.28.004.09.032.17.08.24.15.07.07.12.16.15.25.03.09.03.19.004.28-.028.09-.08.17-.15.24-.07.07-.16.12-.25.15a.4.4 0 0 1-.28.004.4.4 0 0 1-.21-.118.4.4 0 0 1-.15-.24.4.4 0 0 1 .004-.28.4.4 0 0 1 .118-.21Zm.394 5.927c.333-1.124.77-2.115 1.33-2.954.56-.84 1.28-1.543 2.15-2.095.87-.552 1.83-.83 2.87-.83.82 0 1.5.15 2.05.45.55.3.98.71 1.28 1.2.3.5.45 1.08.45 1.75 0 .63-.16 1.2-.48 1.73-.32.53-.78 1-1.38 1.43-.6.43-1.35.73-2.25.9-.9.17-1.93.17-3.08.02-.75-.1-1.44-.3-2.08-.6-.64-.3-1.2-.7-1.7-1.1-.5-.4-.9-.8-1.2-1.2-.3-.4-.5-.8-.6-1.1Zm2.163 9.227c.03-.1.05-.2.05-.3 0-.1-.02-.2-.05-.3-.03-.1-.08-.18-.14-.25s-.14-.1-.22-.1-.16.03-.22.1c-.06.07-.1.15-.14.25-.03.1-.05.2-.05.3s.02.2.05.3c.03.1.08.18.14.25s.14.1.22.1.16-.03.22-.1c.06-.07.1-.15.14-.25Z"/></svg>}, 
                                subtext: t('downloadAppPage.appStore'),
                                text: "App Store"
                            />
                             <DownloadButton 
                                href="#" 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 16 16"><path d="M13.54 2.27a2.5 2.5 0 0 0-3.52 0l-7.05 7.05A2.5 2.5 0 0 0 3.5 13H5v.5a2.5 2.5 0 0 0 5 0V13h1.5a2.5 2.5 0 0 0 2.27-3.51l-7.05-7.05Z"/><path d="M12.27 13.54a2.5 2.5 0 0 0 0-3.52l-7.05-7.05a2.5 2.5 0 0 0-3.51 2.27V13h.5a2.5 2.5 0 0 0 5 0V7.5h1.5a2.5 2.5 0 0 0 3.51 3.51Z"/></svg>}, 
                                subtext: t('downloadAppPage.googlePlay'),
                                text: "Google Play"
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
