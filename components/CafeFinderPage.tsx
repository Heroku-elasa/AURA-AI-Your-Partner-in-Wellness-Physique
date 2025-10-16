import React, { useState } from 'react';
import { useLanguage, ProviderSearchResult } from '../types';

interface LocationFinderPageProps {
  onSearch: (searchMethod: 'geo' | 'text', query: string, searchType: 'clinics' | 'doctors' | 'gyms' | 'coaches') => void;
  isLoading: boolean;
  results: ProviderSearchResult[] | null;
  isQuotaExhausted: boolean;
}

const ProviderCard: React.FC<{ provider: ProviderSearchResult }> = ({ provider }) => {
    const { t } = useLanguage();

    const ActionButton: React.FC<{ href: string; children: React.ReactNode, isExternal?: boolean }> = ({ href, children, isExternal = false }) => (
        <a 
            href={href} 
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noopener noreferrer' : ''}
            className="flex-1 text-center py-2 px-3 bg-gray-700/60 hover:bg-gray-700 text-gray-300 hover:text-white rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2"
        >
            {children}
        </a>
    );

    const isFitness = provider.type === 'gym' || provider.type === 'coach';
    const themeColor = isFitness ? 'teal' : 'rose';

    return (
      <div className={`bg-gray-900/70 border border-white/10 rounded-lg p-6 shadow-2xl backdrop-blur-sm animate-fade-in h-full flex flex-col`}>
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                 <h3 className={`text-xl font-bold text-${themeColor}-300 tracking-tight`}>{provider.name}</h3>
                 {provider.distance && provider.distance !== 'N/A' && (
                    <span className={`text-xs font-semibold bg-${themeColor}-900/50 text-${themeColor}-300 px-2.5 py-1 rounded-full flex-shrink-0 ml-2`}>{provider.distance}</span>
                 )}
            </div>
            {(provider.specialty) && (
                <p className={`text-sm font-medium text-${themeColor}-200/90`}>{provider.specialty}</p>
            )}
            <p className="text-sm text-gray-400 mt-2 mb-4">{provider.description}</p>
            
            {(provider.services) && provider.services.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">{t('locationFinder.services')}</h4>
                    <div className="flex flex-wrap gap-2">
                        {provider.services.map((item, i) => (
                            <span key={i} className="px-2.5 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded-full">{item}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-700 text-sm text-gray-400 space-y-4">
             <p className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${themeColor}-400 flex-shrink-0 mt-0.5`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                <span>{provider.address}</span>
            </p>
            <div className="flex items-center gap-2">
                <ActionButton href={`tel:${provider.phone}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                    <span>Call</span>
                </ActionButton>
                <ActionButton href={provider.website} isExternal={true}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>
                    <span>Website</span>
                </ActionButton>
                <ActionButton href={`https://wa.me/${provider.whatsapp?.replace(/[^0-9]/g, '')}`} isExternal={true}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                    <span>WhatsApp</span>
                </ActionButton>
            </div>
        </div>
      </div>
    );
};


const LocationFinderPage: React.FC<LocationFinderPageProps> = ({
  onSearch,
  isLoading,
  results,
  isQuotaExhausted,
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'beauty' | 'fitness'>('fitness');
  const [searchType, setSearchType] = useState<'entity' | 'person'>('entity');
  const [queryError, setQueryError] = useState<string | null>(null);

  const handleTextSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setQueryError(t('validation.required'));
      return;
    }
    setQueryError(null);
    const type = searchCategory === 'beauty' ? (searchType === 'entity' ? 'clinics' : 'doctors') : (searchType === 'entity' ? 'gyms' : 'coaches');
    onSearch('text', query, type);
  };
  
  const handleGeoSearchClick = () => {
      const type = searchCategory === 'beauty' ? (searchType === 'entity' ? 'clinics' : 'doctors') : (searchType === 'entity' ? 'gyms' : 'coaches');
      const geoQuery = `nearby ${type}`;
      setQuery(''); // Clear text field for geo search
      setQueryError(null);
      onSearch('geo', geoQuery, type);
  };

  const currentSearchType = searchCategory === 'beauty' ? (searchType === 'entity' ? 'clinics' : 'doctors') : (searchType === 'entity' ? 'gyms' : 'coaches');

  return (
    <section id="location-finder" className="py-16 sm:py-24 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t('locationFinder.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            {t('locationFinder.subtitle')}
          </p>
        </div>

        <div className="mt-12 max-w-2xl mx-auto space-y-6">
            <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block text-center">{t('locationFinder.searchCategoryLabel')}</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-800/50 rounded-lg border border-white/10">
                    <button onClick={() => setSearchCategory('fitness')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${searchCategory === 'fitness' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                        {t('locationFinder.categoryFitness')}
                    </button>
                     <button onClick={() => setSearchCategory('beauty')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${searchCategory === 'beauty' ? 'bg-rose-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                        {t('locationFinder.categoryBeauty')}
                    </button>
                </div>
            </div>
            <div>
                 <div className="grid grid-cols-2 gap-2 p-1 bg-gray-800/50 rounded-lg border border-white/10">
                    <button onClick={() => setSearchType('entity')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${searchType === 'entity' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                       {searchCategory === 'fitness' ? t('locationFinder.searchTypeGyms') : t('locationFinder.searchTypeClinics')}
                    </button>
                     <button onClick={() => setSearchType('person')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${searchType === 'person' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                        {searchCategory === 'fitness' ? t('locationFinder.searchTypeCoaches') : t('locationFinder.searchTypeDoctors')}
                    </button>
                </div>
            </div>

            <form onSubmit={handleTextSearchSubmit}>
                <div className={`flex items-center bg-gray-800/50 border rounded-lg shadow-md p-2 transition-colors ${queryError ? 'border-red-500 ring-2 ring-red-500/50' : 'border-white/10'}`}>
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          if (queryError) setQueryError(null);
                        }}
                        placeholder={t('locationFinder.searchPlaceholder')}
                        className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-2 focus:outline-none"
                        aria-label={t('locationFinder.searchPlaceholder')}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || isQuotaExhausted} 
                        className={`px-6 py-2 text-white font-semibold rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed ${searchCategory === 'fitness' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                    >
                        {t('locationFinder.searchButtonText')}
                    </button>
                </div>
                {queryError && <p className="mt-2 text-sm text-red-400 text-center animate-fade-in">{queryError}</p>}
            </form>

            <div className="text-center text-gray-400 flex items-center justify-center">
                <span className="flex-grow border-t border-gray-700"></span>
                <span className="px-4 text-sm font-semibold">{t('locationFinder.or')}</span>
                <span className="flex-grow border-t border-gray-700"></span>
            </div>

            <div>
              <button
                onClick={handleGeoSearchClick}
                disabled={isLoading || isQuotaExhausted}
                className="w-full flex justify-center items-center gap-3 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {isLoading ? t('locationFinder.searching') : isQuotaExhausted ? t('quotaErrorModal.title') : t('locationFinder.geoSearchButton')}
              </button>
            </div>
        </div>

        <div className="mt-16">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
              <p className="mt-4 text-gray-400">{t('locationFinder.searching')}</p>
            </div>
          )}
          
          {!isLoading && !results && (
            <div className="text-center py-10 text-gray-500 bg-gray-800/20 rounded-lg max-w-3xl mx-auto">
              <p>{t('locationFinder.placeholder')}</p>
            </div>
          )}

          {results && (
            <div className="space-y-10">
              <h2 className="text-3xl font-bold text-white text-center">{t('locationFinder.resultsTitle')}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {results.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                 ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationFinderPage;