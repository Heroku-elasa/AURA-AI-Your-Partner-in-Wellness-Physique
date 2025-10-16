import React, { useState } from 'react';
import { useLanguage, SkinAnalysisResult } from '../types';

interface SkinAnalysisPageProps {
  onAnalyze: (description: string) => void;
  isLoading: boolean;
  analysis: SkinAnalysisResult | null;
  isQuotaExhausted: boolean;
}

const SkinAnalysisPage: React.FC<SkinAnalysisPageProps> = ({
  onAnalyze,
  isLoading,
  analysis,
  isQuotaExhausted,
}) => {
  const { t } = useLanguage();
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setFormError(t('validation.required'));
      return;
    }
    setFormError(null);
    onAnalyze(description);
  };

  const ReportSection: React.FC<{ title: string; children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div>
      <div className="flex items-center mb-4">
        <span className="text-rose-400 text-2xl p-2 bg-gray-900/50 rounded-lg mr-4 rtl:ml-4 rtl:mr-0">{icon}</span>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <div className="pl-14 rtl:pr-14 text-gray-300">{children}</div>
    </div>
  );

  return (
    <section id="skin-analysis" className="py-16 sm:py-24 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t('skinAnalysis.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            {t('skinAnalysis.subtitle')}
          </p>
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">{t('skinAnalysis.descriptionLabel')}</label>
              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (formError) setFormError(null);
                }}
                className={`mt-1 block w-full bg-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm text-white transition-colors ${formError ? 'border-red-500 ring-2 ring-red-500/50 focus:border-red-500' : 'border-gray-600 focus:outline-none focus:ring-rose-500 focus:border-rose-500'}`}
                placeholder={t('skinAnalysis.descriptionPlaceholder')}
              />
              {formError && <p className="mt-2 text-sm text-red-400 animate-fade-in">{formError}</p>}
            </div>
            <div className="pt-2">
                <h4 className="text-xs font-semibold text-gray-400 mb-2">{t('skinAnalysis.suggestionsTitle')}</h4>
                <div className="flex flex-wrap gap-2">
                    {t('skinAnalysis.suggestions').map((suggestion: string, index: number) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setDescription(suggestion);
                              if (formError) setFormError(null);
                            }}
                            className="px-3 py-1.5 bg-gray-700/80 text-gray-300 text-xs font-medium rounded-full hover:bg-gray-600 hover:text-white transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading || isQuotaExhausted}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-rose-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t('skinAnalysis.analyzing') : isQuotaExhausted ? t('quotaErrorModal.title') : t('skinAnalysis.buttonText')}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-rose-400"></div>
                <p className="mt-4 text-gray-400">{t('skinAnalysis.analyzing')}</p>
              </div>
            )}
            {!isLoading && !analysis && (
              <div className="text-center py-10 text-gray-500 bg-gray-800/20 rounded-lg max-w-3xl mx-auto">
                <p>{t('skinAnalysis.placeholder')}</p>
              </div>
            )}
            {analysis && (
                <div className="animate-fade-in bg-gray-800/30 p-8 rounded-lg mt-12 border border-white/10">
                    <header className="text-center border-b-2 border-dashed border-rose-700 pb-6 mb-8">
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">{t('skinAnalysis.analysisTitle')}</h2>
                        <p className="text-4xl font-extrabold text-rose-300 mt-2">{analysis.skinType}</p>
                        <p className="text-gray-300 mt-4 max-w-3xl mx-auto">{analysis.skinDescription}</p>
                    </header>

                    <div className="space-y-10">
                        <ReportSection title={t('skinAnalysis.keyCharacteristics')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                            <ul className="list-disc list-inside space-y-2">
                                {analysis.keyCharacteristics.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </ReportSection>

                        <ReportSection title={t('skinAnalysis.recommendedIngredients')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 16a3.5 3.5 0 01-3.5-3.5V2.5A2.5 2.5 0 014.5 0h11A2.5 2.5 0 0118 2.5v10a3.5 3.5 0 01-3.5 3.5h-9zM4 6.5A1.5 1.5 0 005.5 8h9a1.5 1.5 0 000-3h-9A1.5 1.5 0 004 6.5z" /></svg>}>
                            <div className="flex flex-wrap gap-3">
                                {analysis.recommendedIngredients.map((item, i) => <span key={i} className="px-3 py-1.5 bg-green-900/50 text-green-300 text-sm font-medium rounded-full">{item}</span>)}
                            </div>
                        </ReportSection>
                        
                         <ReportSection title={t('skinAnalysis.ingredientsToAvoid')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}>
                            <div className="flex flex-wrap gap-3">
                                {analysis.ingredientsToAvoid.map((item, i) => <span key={i} className="px-3 py-1.5 bg-red-900/50 text-red-300 text-sm font-medium rounded-full">{item}</span>)}
                            </div>
                        </ReportSection>

                        <ReportSection title={t('skinAnalysis.actionableSuggestions')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}>
                            <ul className="list-disc list-inside space-y-2">
                                {analysis.actionableSuggestions.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </ReportSection>
                    </div>
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default SkinAnalysisPage;
