import React from 'react';
import { SavedConsultation, useLanguage, Page } from '../types';

interface MyPlansPageProps {
  savedConsultations: SavedConsultation[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  setPage: (page: Page) => void;
}

const MyPlansPage: React.FC<MyPlansPageProps> = ({ savedConsultations, onRestore, onDelete, setPage }) => {
  const { language, t } = useLanguage();

  const handleDeleteClick = (id: string, name: string) => {
    const confirmationMessage = t('myPlansPage.deleteConfirm').replace('{name}', name);
    if (window.confirm(confirmationMessage)) {
      onDelete(id);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          {t('myPlansPage.title')}
        </h1>
        <p className="mt-4 text-lg text-gray-300">{t('myPlansPage.subtitle')}</p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto">
        {savedConsultations.length > 0 ? (
          <div className="space-y-6">
            {savedConsultations.map(plan => (
              <div key={plan.id} className="bg-gray-800/50 border border-white/10 rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                   <p className="text-lg font-semibold text-white truncate pr-2">{plan.name}</p>
                   <div className="flex-shrink-0 flex items-center space-x-2">
                     <button onClick={() => onRestore(plan.id)} title={t('myPlansPage.restore')} className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-blue-400 transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                     </button>
                     <button onClick={() => handleDeleteClick(plan.id, plan.name)} title={t('myPlansPage.delete')} className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-red-400 transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                     </button>
                   </div>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  <time dateTime={new Date(plan.timestamp).toISOString()}>
                    {t('myPlansPage.savedOn')} {new Date(plan.timestamp).toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US')}
                  </time>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-800/50 border border-dashed border-gray-600 rounded-lg p-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2-2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-white">{t('myPlansPage.emptyTitle')}</h3>
            <p className="mt-1 text-sm text-gray-400">{t('myPlansPage.emptyText')}</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setPage('skin_consultation')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-all transform hover:-translate-y-1"
              >
                {t('myPlansPage.goBackButton')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlansPage;