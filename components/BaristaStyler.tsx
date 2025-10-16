import React, { useState } from 'react';
import { useLanguage, BaristaStyleResult } from '../types';

interface BaristaStylerPageProps {
  onGenerate: (description: string) => void;
  isLoading: boolean;
  error: string | null;
  result: BaristaStyleResult | null;
  isQuotaExhausted: boolean;
}

interface ImageCardProps {
    title: string;
    imageUrl: string | null;
    isLoading: boolean;
    aspectRatio?: '3/4' | '4/3';
}

const ImageCard: React.FC<ImageCardProps> = ({ title, imageUrl, isLoading, aspectRatio = '3/4' }) => {
    const { t } = useLanguage();
    const aspectClass = aspectRatio === '4/3' ? 'aspect-[4/3]' : 'aspect-[3/4]';
    return (
        <div className="bg-gray-900/50 rounded-lg border border-white/10 overflow-hidden">
            <div className={`${aspectClass} bg-gray-800 flex items-center justify-center`}>
                {isLoading && (
                    <div className="flex flex-col items-center text-center text-gray-400">
                        <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-brown-400"></div>
                        <span className="text-xs mt-2">{t('baristaStyler.generatingImage')}</span>
                    </div>
                )}
                {!isLoading && imageUrl && <img src={imageUrl} alt={title} className="w-full h-full object-cover" />}
                {!isLoading && !imageUrl && (
                    <div className="flex flex-col items-center text-center text-red-400 p-4">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs mt-2">{t('baristaStyler.imageFailed')}</span>
                    </div>
                )}
            </div>
            <h3 className="font-semibold text-white p-4 text-center">{title}</h3>
        </div>
    );
};


const BaristaStylerPage: React.FC<BaristaStylerPageProps> = ({
  onGenerate,
  isLoading,
  error,
  result,
  isQuotaExhausted,
}) => {
  const { t } = useLanguage();
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert(t('baristaStyler.validationError'));
      return;
    }
    onGenerate(description);
  };

  return (
    <section id="barista-styler" className="py-16 sm:py-24 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t('baristaStyler.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            {t('baristaStyler.subtitle')}
          </p>
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">{t('baristaStyler.descriptionLabel')}</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-500 focus:border-brown-500 sm:text-sm text-white"
                placeholder={t('baristaStyler.descriptionPlaceholder')}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brown-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t('baristaStyler.generating') : isQuotaExhausted ? t('quotaErrorModal.title') : t('baristaStyler.buttonText')}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12">
            {(isLoading && !result) && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-brown-400"></div>
                <p className="mt-4 text-gray-400">{t('baristaStyler.generating')}</p>
              </div>
            )}
            {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md max-w-3xl mx-auto">{error}</div>}
            
            {!isLoading && !result && !error && (
              <div className="text-center py-10 text-gray-500 bg-gray-800/20 rounded-lg max-w-3xl mx-auto">
                <p>{t('baristaStyler.placeholder')}</p>
              </div>
            )}

            {result && (
                <div className="animate-fade-in space-y-10">
                    <div className="text-center">
                         <h2 className="text-3xl font-bold text-white tracking-tight">{t('baristaStyler.resultsTitle')}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <ImageCard title={t('baristaStyler.femaleStyle')} imageUrl={result.femaleOutfitUrls?.[0] ?? null} isLoading={result.isLoadingFemaleOutfits} aspectRatio="3/4" />
                        <ImageCard title={t('baristaStyler.maleStyle')} imageUrl={result.maleOutfitUrls?.[0] ?? null} isLoading={result.isLoadingMaleOutfits} aspectRatio="3/4" />
                        <div className="md:col-span-2">
                           <ImageCard title={t('baristaStyler.counterDesign')} imageUrl={result.counterUrls?.[0] ?? null} isLoading={result.isLoadingCounterDesigns} aspectRatio="4/3" />
                        </div>
                    </div>
                     <div className="bg-gray-800/30 p-8 rounded-lg max-w-3xl mx-auto">
                        <div className="flex items-center mb-3">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown-400 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" /></svg>
                            <h3 className="text-lg font-semibold text-white">{t('baristaStyler.musicTheme')}</h3>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{result.musicTheme || "..."}</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default BaristaStylerPage;