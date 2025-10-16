import React from 'react';
import { useLanguage } from '../types';

const SiteFooter: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer id="footer" className="bg-black/20 backdrop-blur-sm text-gray-400 border-t border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                           <svg className="h-8 w-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                             <path d="M10 3.5a1.5 1.5 0 011.396 2.21l-4.133 7.032a1.5 1.5 0 01-2.592-1.525L8.604 5.71A1.5 1.5 0 0110 3.5zM10 3.5a1.5 1.5 0 00-1.396 2.21l4.133 7.032a1.5 1.5 0 002.592-1.525L11.396 5.71A1.5 1.5 0 0010 3.5z" />
                           </svg>
                            <span className="font-bold text-xl text-white">AURA AI</span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm">{t('footer.description')}</p>
                    </div>
                    <div className="text-center md:text-right">
                         <p className="text-xs">{t('footer.copyright')}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;