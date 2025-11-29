import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { generateSpecialists } from '../services/geminiService';
import { SpecialistProfile, ConsultationResult } from '../types';
import { useLanguage } from '../types';
import { PROMPTS } from '../constants';

const parseSpecialistData = (markdown: string): SpecialistProfile[] => {
    const profiles: SpecialistProfile[] = [];
    const tableRows = markdown.split('\n').map(row => row.trim()).filter(row => row.startsWith('|') && row.endsWith('|'));

    if (tableRows.length < 2 || !tableRows.some(row => row.includes('---'))) {
        return profiles;
    }
    
    const headers = tableRows[0].split('|').map(h => h.trim().toLowerCase()).slice(1, -1);
    const headerMap: { [key: string]: number } = {};
    
    const keyMap: { [key in keyof SpecialistProfile | 'relevanceScore']?: string[] } = {
        name: ['name', 'نام'], 
        specialty: ['specialty', 'تخصص'], 
        city: ['city', 'شهر'], 
        bio: ['bio', 'بیوگرافی'],
        relevanceScore: ['relevance', 'ارتباط', 'امتیاز ارتباط']
    };

    headers.forEach((header, index) => {
        for (const key in keyMap) {
            if (keyMap[key as keyof typeof keyMap]?.some(alias => header.includes(alias))) {
                headerMap[key] = index;
                break;
            }
        }
    });

    if (headerMap.name === undefined || headerMap.city === undefined) {
        console.warn("Could not map required headers 'name' and 'city'.", headers);
        return profiles;
    }

    const dataRows = tableRows.slice(2);
    dataRows.forEach(row => {
        const columns = row.split('|').map(col => col.trim()).slice(1, -1);
        const name = columns[headerMap.name] ?? '';
        if (!name) return;
        
        const rawScore = headerMap.relevanceScore !== undefined ? columns[headerMap.relevanceScore] : '0';
        const relevanceScore = parseInt(rawScore.replace('%', '').trim() || '0', 10);
        
        profiles.push({
            id: `${name.replace(/\s/g, '-')}-${columns[headerMap.city] ?? 'unknown'}-${relevanceScore}`,
            name,
            specialty: columns[headerMap.specialty] ?? 'N/A',
            city: columns[headerMap.city] ?? 'N/A',
            bio: columns[headerMap.bio] ?? 'N/A',
            relevanceScore: isNaN(relevanceScore) ? 0 : relevanceScore,
        });
    });
    
    return profiles;
};

interface SpecialistFinderProps {
  savedSpecialists: SpecialistProfile[];
  onSaveProvider: (provider: SpecialistProfile) => void;
  onRemoveProvider: (provider: SpecialistProfile) => void;
  onClearAllSaved: () => void;
  onNoteChange: (index: number, note: string) => void;
  handleApiError: (err: unknown) => string;
  isQuotaExhausted: boolean;
  allSpecialists: SpecialistProfile[];
  onSpecialistsFound: (providers: SpecialistProfile[]) => void;
  onClearAllDbProviders: () => void;
  triggerSearch: boolean;
  onSearchTriggered: () => void;
  onRequestResearch: (topic: string) => void;
  consultationResult: ConsultationResult | null;
  symptoms: string;
}

type SortKey = 'relevanceScore' | 'city' | 'name';

const SpecialistFinder: React.FC<SpecialistFinderProps> = ({ 
    savedSpecialists,
    onSaveProvider,
    onRemoveProvider,
    onClearAllSaved,
    onNoteChange,
    handleApiError,
    isQuotaExhausted,
    allSpecialists,
    onSpecialistsFound,
    onClearAllDbProviders,
    triggerSearch,
    onSearchTriggered,
    consultationResult,
    symptoms,
}) => {
    const { language, t } = useLanguage();
    const [maxResults, setMaxResults] = useState<number>(5);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [rawTextResult, setRawTextResult] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>('relevanceScore');

    const handleSearch = useCallback(async () => {
        if (!consultationResult) {
            setError(t('specialistFinder.validationError'));
            return;
        }
        setError(null);
        setRawTextResult(null);
        setIsLoading(true);

        const conditionsText = consultationResult.identifiedConditions.map(p => p.name).join(', ');
        
        const prompt = PROMPTS.specialistFinder(language)
            .replace('{conditions}', conditionsText)
            .replace('{symptoms}', symptoms)
            .replace('{maxResults}', maxResults.toString());

        try {
            const resultText = await generateSpecialists(prompt);
            const parsed = parseSpecialistData(resultText);
            
            if (parsed.length > 0) {
                onSpecialistsFound(parsed);
            } else {
                setRawTextResult(resultText || "AI returned an empty response.");
                onSpecialistsFound([]);
            }
        } catch (err) {
            const msg = handleApiError(err);
            setError(msg);
        } finally { setIsLoading(false); }
    }, [consultationResult, symptoms, maxResults, t, handleApiError, onSpecialistsFound, language]);
    
    useEffect(() => {
      if (triggerSearch) {
        handleSearch();
        onSearchTriggered();
      }
    }, [triggerSearch, handleSearch, onSearchTriggered]);

    const isProviderSaved = useCallback((provider: SpecialistProfile): boolean => {
        return savedSpecialists.some(p => p.id === provider.id);
    }, [savedSpecialists]);

    const sortedProviders = useMemo(() => {
        return [...allSpecialists].sort((a, b) => {
            switch (sortKey) {
                case 'relevanceScore': return (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0);
                case 'city': return (a.city ?? '').localeCompare(b.city ?? '');
                case 'name': return (a.name ?? '').localeCompare(b.name ?? '');
                default: return 0;
            }
        });
    }, [allSpecialists, sortKey]);

    return (
        <section id="specialist-finder" className="py-12 sm:py-16 space-y-12">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white">{t('specialistFinder.title')}</h2>
                <p className="mt-2 text-gray-400 max-w-2xl mx-auto">{t('specialistFinder.subtitle')}</p>
            </div>

            <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
                <div>
                    <label htmlFor="max-results" className="block text-sm font-medium text-gray-300">{t('specialistFinder.maxResults')} ({maxResults})</label>
                    <input id="max-results" type="range" min="3" max="15" step="1" value={maxResults} onChange={(e) => setMaxResults(Number(e.target.value))}
                        className="mt-1 block w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                </div>
                <div>
                    <button onClick={handleSearch} disabled={isLoading || !consultationResult || isQuotaExhausted}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-rose-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? t('specialistFinder.finding') : isQuotaExhausted ? t('quotaErrorModal.title') : t('specialistFinder.findButton')}
                    </button>
                    {!consultationResult && <p className="text-xs text-center mt-2 text-yellow-400">{t('specialistFinder.validationError')}</p>}
                </div>
            </div>
            
            {savedSpecialists.length > 0 && (
                <div className="mt-12 space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-white">{t('specialistFinder.savedTitle')}</h3>
                        <button onClick={onClearAllSaved} className="px-3 py-1 bg-red-800/70 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors">{t('specialistFinder.clearAll')}</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedSpecialists.map((provider, index) => (
                            <div key={`${provider.id}-${index}`} className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 p-6 flex flex-col">
                                <h4 className="text-lg font-bold text-teal-300">{provider.name}</h4>
                                <p className="text-sm text-gray-400">{provider.specialty} - {provider.city}</p>
                                
                                <div className="text-sm text-gray-300 space-y-2 mt-4 pt-4 border-t border-white/10">
                                    <p><strong>{t('specialistFinder.bio')}:</strong> {provider.bio}</p>
                                    <p><strong>{t('specialistFinder.relevance')}:</strong> <span className="font-bold text-teal-300">{provider.relevanceScore}%</span></p>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-white/10 flex-grow">
                                    <label htmlFor={`notes-${index}`} className="block text-sm font-medium text-gray-300 mb-2">{t('specialistFinder.notesLabel')}</label>
                                    <textarea id={`notes-${index}`} rows={3}
                                        className="w-full h-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white transition-colors"
                                        placeholder={t('specialistFinder.notesPlaceholder')} value={provider.notes || ''} onChange={(e) => onNoteChange(index, e.target.value)} />
                                </div>
                                <div className="mt-6">
                                     <button onClick={() => onRemoveProvider(provider)} className="w-full text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors">{t('specialistFinder.remove')}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-12 space-y-8">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white">{t('specialistFinder.crateTitle')}</h3>
                        <p className="text-sm text-gray-400">{t('specialistFinder.crateSubtitle')}</p>
                    </div>
                    {allSpecialists.length > 0 &&
                        <button onClick={onClearAllDbProviders} className="px-3 py-1 bg-red-800/70 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors">{t('specialistFinder.clearCrate')}</button>
                    }
                </div>

                {isLoading && (
                    <div className="text-center p-8"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-rose-400 mx-auto"></div></div>
                )}
                {error && !error.includes('(Quota Exceeded)') && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                
                {!isLoading && (
                    <div className="space-y-6">
                        {sortedProviders.length > 0 ? (
                            <>
                                <div className="flex justify-end">
                                    <label htmlFor="sort-key" className="text-sm text-gray-400 self-center mr-2">{t('specialistFinder.rankBy')}:</label>
                                    <select id="sort-key" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
                                        className="bg-gray-700 border-gray-600 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white">
                                        <option value="relevanceScore">{t('specialistFinder.sort.relevance')}</option>
                                        <option value="city">{t('specialistFinder.sort.city')}</option>
                                        <option value="name">{t('specialistFinder.sort.name')}</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {sortedProviders.map((provider) => (
                                        <div key={provider.id} className="bg-gray-800/50 rounded-lg p-6 flex flex-col border border-white/10">
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-lg font-bold text-teal-300 truncate" title={provider.name}>{provider.name}</h4>
                                                    <span className="text-sm font-bold text-teal-300 bg-teal-900/50 px-3 py-1 rounded-full">{provider.relevanceScore}%</span>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-3">{provider.specialty} - {provider.city}</p>
                                                <div className="space-y-2 text-sm">
                                                    <p><strong className="text-gray-300">{t('specialistFinder.bio')}:</strong> {provider.bio}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-end">
                                                <button onClick={() => onSaveProvider(provider)} disabled={isProviderSaved(provider)} className="text-center font-semibold py-2 px-4 rounded-md transition-colors bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed">{isProviderSaved(provider) ? t('specialistFinder.saved') : t('specialistFinder.save')}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            rawTextResult ? (
                                <div className="p-6 bg-gray-800/50 border border-white/10 rounded-lg">
                                    <h4 className="font-semibold text-white mb-2">{t('specialistFinder.parseErrorTitle')}</h4>
                                    <p className="text-sm text-gray-400 mb-4">{t('specialistFinder.parseErrorSubtitle')}</p>
                                    <pre className="whitespace-pre-wrap bg-gray-900/50 p-4 rounded-md text-sm text-gray-300">{rawTextResult}</pre>
                                </div>
                            ) : (
                                !error && <div className="text-center text-gray-500 py-10 bg-gray-800/30 rounded-lg"><p>{t('specialistFinder.crateEmpty')}</p></div>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default SpecialistFinder;