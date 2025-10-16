import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ComprehensiveBeautyResult, useLanguage, CostAnalysisResult, CostAnalysisItem } from '../types';
import TreatmentSummary from './DoctorSummarySheet';

interface AnalysisDisplayProps {
  analysis: ComprehensiveBeautyResult | null;
  isLoading: boolean;
  error: string | null;
  onGetDeeperAnalysis: (conditionName: string) => void;
  onGetAcademicAnalysis: (conditionName: string) => void;
  onGenerateSummary: () => void;
  doctorSummary: string;
  isGeneratingSummary: boolean;
  doctorSummaryError: string | null;
  onFindSpecialists: (specialists: string[]) => void;
  onRequestResearch: (conditionName: string) => void;
  onCalculateCosts: () => void;
  isCalculatingCosts: boolean;
  costAnalysis: CostAnalysisResult | null;
  costsError: string | null;
  inputImage: string | null;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ 
  analysis, 
  isLoading, 
  error, 
  onGetDeeperAnalysis,
  onGetAcademicAnalysis,
  onGenerateSummary,
  doctorSummary,
  isGeneratingSummary,
  doctorSummaryError,
  onFindSpecialists,
  onRequestResearch,
  onCalculateCosts,
  isCalculatingCosts,
  costAnalysis,
  costsError,
  inputImage,
}) => {
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const summaryRef = useRef<HTMLDivElement>(null);
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);
  const [academicAnalysisCondition, setAcademicAnalysisCondition] = useState<string | null>(null);
  const [summaryStyle, setSummaryStyle] = useState<'dark' | 'light'>('dark');

  const healthConsultation = analysis?.healthConsultation;

  const handleConditionToggle = (conditionName: string) => {
    const isCurrentlyExpanded = expandedCondition === conditionName;
    const targetCondition = healthConsultation?.identifiedConditions.find(c => c.name === conditionName);

    setExpandedCondition(isCurrentlyExpanded ? null : conditionName);
    setAcademicAnalysisCondition(null); // Close academic view when toggling details

    if (!isCurrentlyExpanded && targetCondition && !targetCondition.details && !targetCondition.isLoadingDetails) {
        onGetDeeperAnalysis(conditionName);
    }
  };

  const handleAcademicAnalysisToggle = (conditionName: string) => {
      const isCurrentlyExpanded = academicAnalysisCondition === conditionName;
      const targetCondition = healthConsultation?.identifiedConditions.find(c => c.name === conditionName);

      setAcademicAnalysisCondition(isCurrentlyExpanded ? null : conditionName);
      setExpandedCondition(null); // Close details view when toggling academic

      if (!isCurrentlyExpanded && targetCondition && !targetCondition.furtherReading && !targetCondition.isLoadingFurtherReading) {
          onGetAcademicAnalysis(conditionName);
      }
  };

    const toggleSpeak = useCallback(() => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else if (healthConsultation) {
            let textToSpeak = `${t('analysisDisplay.specialistsTitle')}: ${healthConsultation.recommendedSpecialists.join(', ')}. ${t('analysisDisplay.conditionsTitle')}: `;
            healthConsultation.identifiedConditions.forEach(c => {
                textToSpeak += `${c.name}. ${c.description}. `;
            });
            textToSpeak += healthConsultation.disclaimer;

            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = language === 'fa' ? 'fa-IR' : 'en-US';
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (e) => {
                console.error("Speech synthesis error", e);
                setIsSpeaking(false);
            };
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    }, [isSpeaking, healthConsultation, language, t]);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const copySummaryToClipboard = useCallback(() => {
        if (summaryRef.current) {
            const textToCopy = summaryRef.current.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopySuccess(t('analysisDisplay.copySuccess'));
                setTimeout(() => setCopySuccess(''), 2000);
            });
        }
    }, [t]);
    
    const renderCostTable = (items: CostAnalysisItem[]) => {
        if (items.length === 0) return null;
        const totalCost = items.reduce((sum, item) => sum + item.estimatedCost, 0);
        
        return (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-700/50 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-3 font-semibold text-gray-300">{t('analysisDisplay.tableHeaderItem')}</th>
                            <th className="p-3 font-semibold text-gray-300 text-right">{t('analysisDisplay.tableHeaderCost')}</th>
                            <th className="p-3 font-semibold text-gray-300 text-center">{t('analysisDisplay.tableHeaderUnit')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {items.map((item, i) => (
                            <tr key={i} className="hover:bg-gray-800/60 transition-colors">
                                <td className="p-3 font-medium text-white">{item.name}</td>
                                <td className="p-3 text-right font-mono text-yellow-300">{item.estimatedCost.toLocaleString()}</td>
                                <td className="p-3 text-center text-gray-400">{item.unit}</td>
                            </tr>
                        ))}
                    </tbody>
                     <tfoot className="bg-gray-700/50 font-bold">
                        <tr>
                            <td className="p-3 text-white">{t('analysisDisplay.tableHeaderTotal')}</td>
                            <td className="p-3 text-right font-mono text-yellow-200">{totalCost.toLocaleString()} {t('analysisDisplay.currency')}</td>
                            <td />
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    };

  const allLowRelevance = healthConsultation && healthConsultation.identifiedConditions.length > 0 && healthConsultation.identifiedConditions.every(c => c.relevance === 'Low');

  return (
    <div className="p-6 sm:p-8 min-h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">{t('analysisDisplay.analysisTitle')}</h3>
        {analysis && !isLoading && (
            <button
                onClick={toggleSpeak}
                title={isSpeaking ? "Stop reading aloud" : "Read analysis aloud"}
                className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
                {isSpeaking ? (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                   </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3z" />
                    </svg>
                )}
            </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-rose-400"></div>
          <span className={`${language === 'fa' ? 'mr-4' : 'ml-4'} text-gray-400`}>{t('analysisDisplay.generating')}</span>
        </div>
      )}

      {error && !error.includes('(Quota Exceeded)') && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}

      {!isLoading && !analysis && !error && (
        <div className="text-center py-10 text-gray-500">
          <p>{t('analysisDisplay.placeholder1')}</p>
          <p className="text-sm">{t('analysisDisplay.placeholder2')}</p>
        </div>
      )}

      {analysis && healthConsultation && (
        <div className="space-y-12 animate-fade-in">
        
          {inputImage && (
             <section>
                 <h3 className="text-2xl font-bold text-rose-300 mb-4 border-b-2 border-rose-800 pb-2 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                    {t('analysisDisplay.yourPhoto')}
                 </h3>
                 <div className="bg-gray-900/50 p-2 rounded-lg">
                    <img src={`data:image/jpeg;base64,${inputImage}`} alt="User input for analysis" className="rounded-md mx-auto max-h-80 shadow-lg"/>
                 </div>
             </section>
          )}

          {/* --- SKIN PROFILE SECTION --- */}
          <section>
            <h3 className="text-2xl font-bold text-rose-300 mb-4 border-b-2 border-rose-800 pb-2 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {t('analysisDisplay.skinProfileTitle')}
            </h3>
            <div className="bg-gray-900/50 p-6 rounded-lg space-y-4">
                <p className="text-center"><strong className="text-white text-lg">{analysis.skinAnalysis.skinType}</strong>: {analysis.skinAnalysis.skinDescription}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-2">{t('skinAnalysis.recommendedIngredients')}</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.skinAnalysis.recommendedIngredients.map((item, i) => <span key={i} className="px-3 py-1 bg-green-900/50 text-green-300 text-xs font-medium rounded-full">{item}</span>)}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-2">{t('skinAnalysis.ingredientsToAvoid')}</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.skinAnalysis.ingredientsToAvoid.map((item, i) => <span key={i} className="px-3 py-1 bg-red-900/50 text-red-300 text-xs font-medium rounded-full">{item}</span>)}
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* --- HEALTH CONSULTATION SECTION --- */}
          <section className="space-y-8">
            {/* Disclaimer */}
            <div className="p-4 bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-300 text-sm" role="alert">
                <p>{healthConsultation.disclaimer}</p>
            </div>

            {/* Recommended Specialists */}
            <div>
                <h4 className="text-lg font-semibold text-gray-200 mb-3">{t('analysisDisplay.specialistsTitle')}</h4>
                <div className="flex flex-wrap gap-2">
                {healthConsultation.recommendedSpecialists.map((trait, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-700 text-gray-200 text-sm rounded-full">{trait}</span>
                ))}
                </div>
                {healthConsultation.recommendedSpecialists.length > 0 && (
                    <button
                    onClick={() => onFindSpecialists(healthConsultation.recommendedSpecialists)}
                    className="mt-4 text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-2"
                    >
                    <span>{t('analysisDisplay.findSpecialistsButton')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                )}
            </div>

            {/* Identified Conditions */}
            <div>
                <h4 className="text-lg font-semibold text-gray-200 mb-3">{t('analysisDisplay.conditionsTitle')}</h4>
                {allLowRelevance && (
                    <div className="mb-4 p-4 bg-gray-700/50 border border-gray-600 text-gray-300 text-sm rounded-lg" role="alert">
                        <p>{t('analysisDisplay.lowConfidenceFallback')}</p>
                    </div>
                )}
                <div className="space-y-4">
                {healthConsultation.identifiedConditions.map((condition) => (
                    <div key={condition.name} className="bg-gray-900/50 p-4 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                        <h5 className="font-semibold text-white">{condition.name}</h5>
                        <p className="text-sm text-gray-400 mt-1">{condition.description}</p>
                        </div>
                    </div>
                    <p className="text-sm mt-3 text-cyan-300 bg-cyan-900/30 p-2 rounded-md">{language === 'fa' ? 'راهنمایی' : 'Guidance'}: {condition.suggestedStep}</p>

                    <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap gap-2">
                        <button
                            onClick={() => handleConditionToggle(condition.name)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                        >
                        {expandedCondition === condition.name ? t('analysisDisplay.hideDetails') : t('analysisDisplay.viewDetails')}
                        </button>
                        <button
                            onClick={() => handleAcademicAnalysisToggle(condition.name)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                        >
                        {academicAnalysisCondition === condition.name ? t('analysisDisplay.hideDetails') : t('analysisDisplay.academicAnalysisButton')}
                        </button>
                        {condition.relevance === 'Low' && (
                            <button
                                onClick={() => onRequestResearch(condition.name)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-yellow-800/70 hover:bg-yellow-700 text-yellow-200 transition-colors"
                            >
                                {t('analysisDisplay.requestResearchButton')}
                            </button>
                        )}
                    </div>
                    
                    {expandedCondition === condition.name && (
                        <div className="mt-4 p-4 bg-gray-900/70 rounded-md border border-white/10 animate-fade-in">
                        {condition.isLoadingDetails && <p className="text-sm text-gray-400">{t('analysisDisplay.loadingDetails')}</p>}
                        {condition.detailsError && <p className="text-sm text-red-400">{condition.detailsError}</p>}
                        {condition.details && <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: condition.details }} />}
                        </div>
                    )}
                    {academicAnalysisCondition === condition.name && (
                        <div className="mt-4 p-4 bg-gray-900/70 rounded-md border border-white/10 animate-fade-in">
                        {condition.isLoadingFurtherReading && <p className="text-sm text-gray-400">{t('analysisDisplay.loadingAcademicAnalysis')}</p>}
                        {condition.furtherReadingError && <p className="text-sm text-red-400">{condition.furtherReadingError}</p>}
                        {condition.furtherReading && <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: condition.furtherReading }} />}
                        </div>
                    )}
                    </div>
                ))}
                </div>
            </div>

            {(healthConsultation.lifestyleAdvice || (healthConsultation.treatmentSuggestions && healthConsultation.treatmentSuggestions.length > 0)) && (
                    <div className="pt-8 border-t border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6 text-center">{t('analysisDisplay.treatmentSectionTitle')}</h3>
                        
                        {healthConsultation.lifestyleAdvice && (
                            <div className="mb-8">
                                <h4 className="text-lg font-semibold text-gray-200 mb-3">{t('analysisDisplay.lifestyleTitle')}</h4>
                                <blockquote className="p-4 bg-gray-900/50 border-l-4 border-rose-400 text-gray-300">
                                    {healthConsultation.lifestyleAdvice}
                                </blockquote>
                            </div>
                        )}
                        
                        {healthConsultation.treatmentSuggestions && healthConsultation.treatmentSuggestions.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold text-gray-200 mb-4">{t('analysisDisplay.treatmentSuggestionsTitle')}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {healthConsultation.treatmentSuggestions.map(idea => (
                                        <div key={idea.title} className="bg-gray-900/50 p-5 rounded-lg border border-white/10 text-center">
                                            <div className="text-4xl mb-3">{idea.icon}</div>
                                            <h5 className="font-bold text-white mb-2">{idea.title}</h5>
                                            <p className="text-sm text-gray-400">{idea.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            
             <section className="pt-8 border-t border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">{t('analysisDisplay.costAnalysisTitle')}</h3>
              {costAnalysis ? (
                <div className="bg-gray-900/50 p-6 rounded-lg animate-fade-in">
                  {renderCostTable(costAnalysis.treatmentCosts)}
                </div>
              ) : (
                <button onClick={onCalculateCosts} disabled={isCalculatingCosts} className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50 transition-colors">
                  {isCalculatingCosts ? t('analysisDisplay.calculatingCosts') : t('analysisDisplay.calculateCostsButton')}
                </button>
              )}
              {costsError && <p className="text-red-400 text-sm mt-2">{costsError}</p>}
            </section>

            {healthConsultation.followUpQuestions && healthConsultation.followUpQuestions.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-3">{t('analysisDisplay.followUpTitle')}</h4>
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-dashed border-white/20">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                            {healthConsultation.followUpQuestions.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                    </div>
                </div>
            )}
           </section>
           
          {/* --- MAKEUP & MASK SECTION --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t-2 border-dashed border-rose-800">
                 {/* Makeup Style */}
                <section>
                    <h3 className="text-xl font-bold text-rose-300 mb-4 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                        {t('analysisDisplay.makeupStyleTitle')}
                    </h3>
                    <div className="bg-gray-900/50 p-6 rounded-lg space-y-3 h-full">
                        <h4 className="font-bold text-lg text-white">{analysis.makeupStyle.styleName}</h4>
                        <p className="text-sm text-gray-400">{analysis.makeupStyle.description}</p>
                        <div className="pt-3 border-t border-white/10">
                            <h5 className="text-sm font-semibold text-gray-300 mb-2">{t('analysisDisplay.keyProducts')}</h5>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {analysis.makeupStyle.keyProducts.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                    </div>
                </section>
                 {/* Homemade Mask */}
                 <section>
                    <h3 className="text-xl font-bold text-rose-300 mb-4 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM12 6.5a2.5 2.5 0 000 5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8V5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10.5h3.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 10.5H13" /></svg>
                        {t('analysisDisplay.homemadeMaskTitle')}
                    </h3>
                    <div className="bg-gray-900/50 p-6 rounded-lg space-y-3 h-full">
                        <h4 className="font-bold text-lg text-white">{analysis.homemadeMask.maskName}</h4>
                        <p className="text-sm text-gray-400">{analysis.homemadeMask.description}</p>
                        <div className="pt-3 border-t border-white/10">
                            <h5 className="text-sm font-semibold text-gray-300 mb-2">{t('analysisDisplay.ingredients')}</h5>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {analysis.homemadeMask.ingredients.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                         <div className="pt-3 border-t border-white/10">
                            <h5 className="text-sm font-semibold text-gray-300 mb-2">{t('analysisDisplay.instructions')}</h5>
                            <p className="text-sm whitespace-pre-line">{analysis.homemadeMask.instructions}</p>
                        </div>
                    </div>
                </section>
            </div>


          <div>
            <button
              onClick={onGenerateSummary}
              disabled={isGeneratingSummary}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isGeneratingSummary ? t('analysisDisplay.generatingSummary') : t('analysisDisplay.prepareSummaryButton')}
            </button>
          </div>

          {(doctorSummary || doctorSummaryError) && (
             <div className="mt-6 animate-fade-in">
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-200">{t('treatmentSummary.title')}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{t('treatmentSummary.style')}:</span>
                        <button
                            onClick={() => setSummaryStyle('dark')}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${summaryStyle === 'dark' ? 'bg-rose-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                        >{t('treatmentSummary.modernDark')}</button>
                        <button
                            onClick={() => setSummaryStyle('light')}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${summaryStyle === 'light' ? 'bg-rose-200 text-rose-900' : 'bg-gray-700 text-gray-300'}`}
                        >{t('treatmentSummary.classicLight')}</button>
                        <button
                            onClick={copySummaryToClipboard}
                            className="text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors ml-2"
                        >
                            {copySuccess || t('treatmentSummary.copyBio')}
                        </button>
                    </div>
                </div>
                {doctorSummaryError && <p className="text-sm text-red-400 p-3 bg-red-900/30 rounded-md">{doctorSummaryError}</p>}
                {doctorSummary && (
                    <div className="overflow-hidden">
                        <TreatmentSummary ref={summaryRef} summaryHtml={doctorSummary} styleMode={summaryStyle} />
                    </div>
                )}
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisDisplay;