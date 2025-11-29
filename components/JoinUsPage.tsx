
import React, { useState } from 'react';
import { useLanguage, Page } from '../types';
import { useToast } from './Toast';

interface JoinUsPageProps {
    setPage: (page: Page) => void;
}

const IconListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <svg className="w-5 h-5 text-teal-400 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{children}</span>
    </li>
);

const JoinUsPage: React.FC<JoinUsPageProps> = ({ setPage }) => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
    const [activeRole, setActiveRole] = useState<'marketing' | 'admin'>('marketing');

    const handleApplyClick = () => {
        const formElement = document.getElementById('apply-form');
        formElement?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            addToast("Please fill in your name and email.", "error");
            return;
        }
        addToast(t('joinUsPage.applySuccess'), 'success');
        setFormData({ name: '', email: '', message: '' });
    };

    // Determine content based on active role
    const roleTitle = activeRole === 'marketing' ? t('joinUsPage.roleTitle') : t('joinUsPage.adminRoleTitle');
    const roleDescription = activeRole === 'marketing' ? t('joinUsPage.roleDescription') : t('joinUsPage.adminRoleDescription');
    const responsibilities = activeRole === 'marketing' ? t('joinUsPage.responsibilities') : t('joinUsPage.adminResponsibilities');
    const skills = activeRole === 'marketing' ? t('joinUsPage.skills') : t('joinUsPage.adminSkills');

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('joinUsPage.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('joinUsPage.subtitle')}</p>
            </div>

            {/* Role Selection Tabs */}
            <div className="mt-12 flex justify-center border-b border-gray-700 max-w-4xl mx-auto">
                <button 
                    onClick={() => setActiveRole('marketing')}
                    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeRole === 'marketing' ? 'border-teal-400 text-teal-300' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    {t('joinUsPage.roleTitle')}
                </button>
                <button 
                    onClick={() => setActiveRole('admin')}
                    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeRole === 'admin' ? 'border-rose-400 text-rose-300' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    {t('joinUsPage.adminRoleTitle')}
                </button>
            </div>

            <div className="mt-8 max-w-4xl mx-auto bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-12 animate-fade-in">
                <section>
                    <h2 className={`text-3xl font-bold mb-2 ${activeRole === 'marketing' ? 'text-teal-300' : 'text-rose-300'}`}>
                        {roleTitle}
                    </h2>
                    <p className="text-gray-400">{roleDescription}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <section>
                        <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">{t('joinUsPage.responsibilitiesTitle')}</h3>
                        <ul className="space-y-3 text-gray-300">
                            {(responsibilities as string[]).map((item, index) => (
                                <IconListItem key={index}>{item}</IconListItem>
                            ))}
                        </ul>
                    </section>
                    
                    <section>
                        <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">{t('joinUsPage.skillsTitle')}</h3>
                        <ul className="space-y-3 text-gray-300">
                            {(skills as string[]).map((item, index) => (
                                <IconListItem key={index}>{item}</IconListItem>
                            ))}
                        </ul>
                    </section>
                </div>

                <section className="text-center pt-8 border-t border-dashed border-gray-600">
                    <h3 className="font-semibold text-white">{t('joinUsPage.collaborationType')}</h3>
                    <p className={`text-${activeRole === 'marketing' ? 'teal' : 'rose'}-300`}>{t('joinUsPage.collaborationText')}</p>
                </section>
            </div>

            <div id="apply-form" className="mt-16 max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">{t('joinUsPage.applyTitle')}</h2>
                    <p className="mt-2 text-gray-400">{t('joinUsPage.applySubtitle')}</p>
                </div>
                
                {/* New WhatsApp Resume Section */}
                <div className="bg-green-900/30 p-6 rounded-lg border border-green-500/30 text-center space-y-4">
                    <h3 className="text-xl font-bold text-green-400 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                        {t('joinUsPage.whatsappResumeButton')}
                    </h3>
                    <p className="text-green-200/80">{t('joinUsPage.whatsappResumeText')}</p>
                    <a 
                        href="https://wa.me/989206263218" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20 transform hover:-translate-y-1"
                    >
                        +98 920 626 3218
                    </a>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => setPage('our_experts')}
                        className="px-8 py-3 w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-purple-500/40 transform duration-300 hover:scale-105"
                    >
                        {t('joinUsPage.becomeCoachButton')}
                    </button>
                    <button
                        onClick={handleApplyClick}
                        className={`px-8 py-3 w-full sm:w-auto bg-gradient-to-r ${activeRole === 'marketing' ? 'from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-teal-500/40' : 'from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-rose-500/40'} text-white font-bold rounded-lg transition-all shadow-lg transform duration-300 hover:scale-105`}
                    >
                        {t('joinUsPage.applyMarketingButton')}
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">{t('joinUsPage.formName')}</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} required className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">{t('joinUsPage.formEmail')}</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} required className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">{t('joinUsPage.formMessage')}</label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleFormChange} rows={4} className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"></textarea>
                    </div>
                    <button
                        type="submit"
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${activeRole === 'marketing' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-rose-600 hover:bg-rose-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500`}
                    >
                        {t('joinUsPage.formSubmit')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JoinUsPage;
