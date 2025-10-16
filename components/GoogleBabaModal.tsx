import React from 'react';
import { useLanguage, ChangelogEntry } from '../types';
import { changelogData } from '../constants';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const getTagStyle = (type: string) => {
    switch (type) {
      case 'new': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'improvement': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'fix': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTagText = (type: string) => {
    switch (type) {
      case 'new': return t('changelog.new');
      case 'improvement': return t('changelog.improvement');
      case 'fix': return t('changelog.fix');
      default: return type.toUpperCase();
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-gray-700 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-5 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-xl font-semibold leading-6 text-white">{t('changelog.title')}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            aria-label="Close"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
            <div className="space-y-8">
                {changelogData.map(entry => (
                    <section key={entry.version} aria-labelledby={`version-${entry.version}`}>
                        <div className="flex items-baseline space-x-3 rtl:space-x-reverse">
                            <h4 id={`version-${entry.version}`} className="text-2xl font-bold text-gray-100">{entry.version}</h4>
                            <p className="text-sm text-gray-400">{new Date(entry.date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <ul className="mt-4 space-y-3 border-l-2 border-gray-700 pl-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-6">
                            {entry.changes[language].map((change, index) => (
                                <li key={index} className="flex items-start gap-x-3">
                                    <span className={`flex-shrink-0 text-xs font-semibold mt-1 px-2 py-0.5 rounded-md border ${getTagStyle(change.type)}`}>
                                        {getTagText(change.type)}
                                    </span>
                                    <p className="text-gray-300">{change.text}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogModal;
