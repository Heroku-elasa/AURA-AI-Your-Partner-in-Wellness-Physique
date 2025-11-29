import React from 'react';
import { SavedConsultation, useLanguage, Page, Language } from '../types';

interface UserProfilePageProps {
  savedConsultations: SavedConsultation[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  setPage: (page: Page) => void;
  onLogoutClick: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  savedConsultations,
  onRestore,
  onDelete,
  setPage,
  onLogoutClick,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const handleDeleteClick = (id: string, name: string) => {
    const confirmationMessage = t('myPlansPage.deleteConfirm').replace('{name}', name);
    if (window.confirm(confirmationMessage)) {
      onDelete(id);
    }
  };

  const LanguageButton: React.FC<{ lang: Language; name: string }> = ({ lang, name }) => (
    <button
      onClick={() => setLanguage(lang)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        language === lang ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {name}
    </button>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('profilePage.title')}</h1>
        <p className="mt-4 text-lg text-gray-300">{t('profilePage.subtitle')}</p>
      </div>

      <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Info & Settings */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">{t('profilePage.userInfo')}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-700 ring-2 ring-offset-2 ring-offset-gray-800 ring-teal-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <p className="font-semibold text-white">{t('profilePage.welcome')}</p>
                <p className="text-sm text-gray-400">{t('profilePage.email')}: {t('profilePage.mockEmail')}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">{t('profilePage.settings')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('profilePage.language')}</label>
                <div className="grid grid-cols-3 gap-2">
                  <LanguageButton lang="en" name="English" />
                  <LanguageButton lang="fa" name="فارسی" />
                  <LanguageButton lang="ar" name="العربية" />
                </div>
              </div>
            </div>
          </div>
           <button
              onClick={onLogoutClick}
              className="w-full py-3 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
              {t('header.logout')}
            </button>
        </div>

        {/* Right Column: Saved Plans */}
        <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">{t('profilePage.myPlans')}</h2>
          {savedConsultations.length > 0 ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {savedConsultations.map(plan => (
                <div key={plan.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 transition-all hover:border-teal-500/50">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                        <p className={`font-semibold ${plan.mode === 'skin' ? 'text-rose-300' : 'text-teal-300'}`}>{plan.name}</p>
                        <p className="text-xs text-gray-400 mt-1">
                             {t('myPlansPage.savedOn')} {new Date(plan.timestamp).toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US')}
                        </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      <button onClick={() => onRestore(plan.id)} title={t('myPlansPage.restore')} className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-teal-400 transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                      </button>
                      <button onClick={() => handleDeleteClick(plan.id, plan.name)} title={t('myPlansPage.delete')} className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-red-400 transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center border border-dashed border-gray-600 rounded-lg p-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2-2H5a2 2 0 01-2-2z" /></svg>
              <h3 className="mt-2 text-lg font-medium text-white">{t('myPlansPage.emptyTitle')}</h3>
              <p className="mt-1 text-sm text-gray-400">{t('myPlansPage.emptyText')}</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setPage('skin_consultation')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-all transform hover:-translate-y-1"
                >
                  {t('myPlansPage.goBackButton')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;