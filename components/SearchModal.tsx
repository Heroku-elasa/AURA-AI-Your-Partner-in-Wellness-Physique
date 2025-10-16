
import React, { useState } from 'react';
import { useLanguage, SearchResultItem, Page } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
  results: SearchResultItem[] | null;
  error: string | null;
  onNavigate: (page: Page) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  isLoading,
  results,
  error,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };
  
  const hasResults = results && results.length > 0;
  const noResultsFound = results && results.length === 0;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex flex-col items-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div
        className="w-full max-w-2xl mt-12 sm:mt-20"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h1 id="search-modal-title" className="text-xl font-bold text-white">{t('searchModal.title')}</h1>
            <button onClick={onClose} className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white" aria-label="Close search">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-800 border border-white/20 rounded-lg p-2 shadow-lg">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('searchModal.placeholder')}
            className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-3 text-lg focus:outline-none"
            autoFocus
          />
          <button type="submit" disabled={isLoading} className="px-6 py-3 bg-rose-600 text-white font-semibold rounded-md hover:bg-rose-700 transition-colors disabled:bg-gray-500">
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
            ) : t('searchModal.searchButton')}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-300">
            {!isLoading && !results && !error && (
                <div className="animate-fade-in">
                    <h2 className="font-semibold mb-3">{t('searchModal.suggestionsTitle')}</h2>
                    <div className="flex flex-wrap gap-2">
                        {t('searchModal.suggestionQueries').map((suggestion: string, index: number) => (
                            <button key={index} onClick={() => handleSuggestionClick(suggestion)} className="px-3 py-1.5 bg-gray-700/80 hover:bg-gray-600 rounded-full transition-colors">
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="mt-8 max-h-[50vh] overflow-y-auto pr-2">
            {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
            
            {hasResults && (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="font-semibold text-white">{t('searchModal.resultsTitle')}</h2>
                    {results.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => onNavigate(item.targetPage)}
                            className="w-full text-left bg-gray-800/70 p-4 rounded-lg border border-transparent hover:border-rose-500 hover:bg-gray-800 transition-all group"
                        >
                            <h3 className="font-bold text-rose-300 group-hover:underline">{item.title}</h3>
                            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                        </button>
                    ))}
                </div>
            )}

            {noResultsFound && (
                <div className="text-center p-8 text-gray-500 bg-gray-800/50 rounded-lg">
                    <p>{t('searchModal.noResults')}</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default SearchModal;
