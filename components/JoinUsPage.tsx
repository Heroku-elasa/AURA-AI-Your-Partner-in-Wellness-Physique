import React from 'react';
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

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('joinUsPage.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('joinUsPage.subtitle')}</p>
            </div>

            <div className="mt-16 max-w-4xl mx-auto bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-12">
                <section>
                    <h2 className="text-3xl font-bold text-teal-300 mb-2">{t('joinUsPage.roleTitle')}</h2>
                    <p className="text-gray-400">{t('joinUsPage.roleDescription')}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <section>
                        <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">{t('joinUsPage.responsibilitiesTitle')}</h3>
                        <ul className="space-y-3 text-gray-300">
                            {(t('joinUsPage.responsibilities') as string[]).map((item, index) => (
                                <IconListItem key={index}>{item}</IconListItem>
                            ))}
                        </ul>
                    </section>
                    
                    <section>
                        <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">{t('joinUsPage.skillsTitle')}</h3>
                        <ul className="space-y-3 text-gray-300">
                            {(t('joinUsPage.skills') as string[]).map((item, index) => (
                                <IconListItem key={index}>{item}</IconListItem>
                            ))}
                        </ul>
                    </section>
                </div>

                <section className="text-center pt-8 border-t border-dashed border-gray-600">
                    <h3 className="font-semibold text-white">{t('joinUsPage.collaborationType')}</h3>
                    <p className="text-teal-300">{t('joinUsPage.collaborationText')}</p>
                </section>
            </div>

            <div id="apply-form" className="mt-16 max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">{t('joinUsPage.applyTitle')}</h2>
                    <p className="mt-2 text-gray-400">{t('joinUsPage.applySubtitle')}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => setPage('our_experts')}
                        className="px-8 py-3 w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-rose-500/40 transform duration-300 hover:scale-105"
                    >
                        {t('joinUsPage.becomeCoachButton')}
                    </button>
                    <button
                        onClick={handleApplyClick}
                        className="px-8 py-3 w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-teal-500/40 transform duration-300 hover:scale-105"
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
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500"
                    >
                        {t('joinUsPage.formSubmit')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JoinUsPage;
