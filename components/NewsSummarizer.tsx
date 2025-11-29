import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage, MarketTrendsResult, InDepthAnalysis, SWOTAnalysis, QuickSummary, MarketAnalysisMode, Source } from '../types';
import { generateMarketAnalysis } from '../services/geminiService';

interface MarketTrendsPageProps {
    handleApiError: (err: unknown) => string;
}

const parseMarketAnalysis = (jsonResponse: string, mode: MarketAnalysisMode): MarketTrendsResult => {
    const { text, sources } = JSON.parse(jsonResponse);

    const getSectionContent = (header: string): string => {
        const regex = new RegExp(`(?:##|###) ${header}\\n([\\s\\S]*?)(?=\\n##|\\n###|$)`, 'i');
        const match = text.match(regex);
        return match ? match[1].trim() : '';
    };

    const getBulletedList = (header: string): string[] => {
        const content = getSectionContent(header);
        return content.split('\n').map(s => s.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
    };

    const getSuggestedQueries = (): string[] => {
        const regex = /(?:##|###) (?:Suggested Queries|Related Topics)\s*([\s\\S]*)/i;
        const match = text.match(regex);
        if (match && match[1]) {
            return match[1].split('\n').map(q => q.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
        }
        return [];
    };

    const suggestedQueries = getSuggestedQueries();

    switch (mode) {
        case 'in-depth':
            const trendsContent = getSectionContent('Emerging Trends');
            const emergingTrends = trendsContent.split('\n').map(line => {
                const match = line.match(/\*\*(.*?):\*\*\s*(.*)/);
                if (match) {
                    return { name: match[1].trim(), description: match[2].trim() };
                }
                return null;
            }).filter((t): t is { name: string; description: string } => t !== null);

            return {
                type: 'in-depth',
                keyInsights: getBulletedList('Key Insights'),
                detailedSummary: getSectionContent('Detailed Summary'),
                emergingTrends,
                opportunities: getBulletedList('Opportunities'),
                risks: getBulletedList('Risks'),
                sources,
                suggestedQueries,
            };
        case 'swot':
            return {
                type: 'swot',
                strengths: getBulletedList('Strengths'),
                weaknesses: getBulletedList('Weaknesses'),
                opportunities: getBulletedList('Opportunities'),
                threats: getBulletedList('Threats'),
                sources,
                suggestedQueries,
            };
        case 'quick':
        default:
             const summaryMatch = text.match(/([\s\\S]*?)(?=\n(?:##|###) (?:Suggested Queries|Related Topics)|$)/);
            return {
                type: 'quick',
                summary: summaryMatch ? summaryMatch[0].trim().replace(/^##\s*Summary\s*\n/i, '') : text.trim(),
                sources,
                suggestedQueries,
            };
    }
};

const MarketTrendsPage: React.FC<MarketTrendsPageProps> = ({ handleApiError }) => {
    const { language, t } = useLanguage();
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<MarketTrendsResult | null>(null);
    const [mode, setMode] = useState<MarketAnalysisMode>('quick');
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

    const loadingMessages = useMemo(() => [
        t('marketTrends.loading.scanning'),
        t('marketTrends.loading.synthesizing'),
        t('marketTrends.loading.extracting'),
        t('marketTrends.loading.compiling'),
    ], [t]);

    useEffect(() => {
        if (isLoading) {
            setLoadingMessageIndex(0);
            const interval = setInterval(() => {
                setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [isLoading, loadingMessages]);


    const handleSearch = async (searchQuery = query) => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const rawResult = await generateMarketAnalysis(searchQuery, language, mode);
            const parsedResult = parseMarketAnalysis(rawResult, mode);
            setResult(parsedResult);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedQueryClick = (suggestion: string) => {
        setQuery(suggestion);
        handleSearch(suggestion);
    };

    const handleResultSuggestedQuery = (suggestedQuery: string) => {
        setQuery(suggestedQuery);
        handleSearch(suggestedQuery);
    };
    
    const InDepthResult: React.FC<{ analysis: InDepthAnalysis }> = ({ analysis }) => {
        const [openSection, setOpenSection] = useState<string>('keyInsights');

        const sections = [
            { id: 'keyInsights', title: t('marketTrends.results.keyInsights'), content: <ul className="list-disc list-inside space-y-2 text-gray-300">{analysis.keyInsights.map((item, i) => <li key={i}>{item}</li>)}</ul>, hasContent: analysis.keyInsights.length > 0 },
            { id: 'detailedSummary', title: t('marketTrends.results.detailedSummary'), content: <p className="text-gray-300 whitespace-pre-wrap">{analysis.detailedSummary}</p>, hasContent: !!analysis.detailedSummary },
            { id: 'emergingTrends', title: t('marketTrends.results.emergingTrends'), content: <div className="space-y-3">{analysis.emergingTrends.map(t => <p key={t.name}><strong>{t.name}:</strong> {t.description}</p>)}</div>, hasContent: analysis.emergingTrends.length > 0 },
            { id: 'opportunities', title: t('marketTrends.results.opportunities'), content: <ul className="list-disc list-inside space-y-2 text-gray-300">{analysis.opportunities.map((item, i) => <li key={i}>{item}</li>)}</ul>, hasContent: analysis.opportunities.length > 0 },
            { id: 'risks', title: t('marketTrends.results.risks'), content: <ul className="list-disc list-inside space-y-2 text-gray-300">{analysis.risks.map((item, i) => <li key={i}>{item}</li>)}</ul>, hasContent: analysis.risks.length > 0 },
        ].filter(s => s.hasContent);
    
        return (
            <div className="space-y-3">
            {sections.map(section => (
                <div key={section.id} className="border border-white/10 rounded-lg overflow-hidden transition-all duration-300 bg-gray-900/30">
                    <button 
                      onClick={() => setOpenSection(openSection === section.id ? '' : section.id)}
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-900/50 transition-colors"
                      aria-expanded={openSection === section.id}
                    >
                      <h3 className="font-semibold text-teal-300">{section.title}</h3>
                      <svg 
                        className={`h-5 w-5 text-gray-400 transition-transform duration-300 transform ${openSection === section.id ? 'rotate-180' : ''}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`transition-all duration-500 ease-in-out grid ${openSection === section.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="p-4 border-t border-white/10 text-sm">
                          {section.content}
                        </div>
                      </div>
                    </div>
                </div>
            ))}
            </div>
        );
    };

    const SWOTResult: React.FC<{ analysis: SWOTAnalysis }> = ({ analysis }) => {
        const swotItems = [
            { title: t('marketTrends.results.strengths'), items: analysis.strengths, color: 'green' },
            { title: t('marketTrends.results.weaknesses'), items: analysis.weaknesses, color: 'yellow' },
            { title: t('marketTrends.results.opportunities'), items: analysis.opportunities, color: 'blue' },
            { title: t('marketTrends.results.threats'), items: analysis.threats, color: 'red' },
        ];

        const colorClasses: { [key: string]: string } = {
            green: 'border-green-500/50 text-green-300',
            yellow: 'border-yellow-500/50 text-yellow-300',
            blue: 'border-blue-500/50 text-blue-300',
            red: 'border-red-500/50 text-red-300',
        };

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {swotItems.map(section => (
                    section.items.length > 0 &&
                    <div key={section.title} className={`bg-gray-900/50 p-6 rounded-lg border-t-4 ${colorClasses[section.color]}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${colorClasses[section.color]}`}>{section.title}</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                            {section.items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        );
    };
    
     const Sources: React.FC<{ sources: Source[] }> = ({ sources }) => (
        <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2-2H6a2 2 0 01-2-2V5zm3 1a1 1 0 000 2h6a1 1 0 100-2H7zM7 9a1 1 0 100 2h6a1 1 0 100-2H7zm4 3a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd" /></svg>
                {t('marketTrends.sources')}
            </h3>
            <div className="space-y-2 text-sm">
            {sources.map((source, index) => (
                <a key={index} href={source.uri} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg border border-transparent hover:border-white/10 transition-all group">
                    <p className="font-semibold text-teal-300 group-hover:underline truncate" title={source.title || 'Untitled Source'}>{source.title || 'Untitled Source'}</p>
                    <p className="text-gray-400 text-xs truncate mt-1">{source.uri}</p>
                </a>
            ))}
            </div>
        </div>
    );
    
    const SuggestedQueries: React.FC<{ queries: string[] }> = ({ queries }) => (
        <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                {t('marketTrends.relatedTopics')}
            </h3>
            <div className="flex flex-wrap gap-3">
            {queries.map((q, index) => (
                <button key={index} onClick={() => handleResultSuggestedQuery(q)} className="flex items-center gap-2 px-4 py-2 bg-gray-700/80 text-gray-200 text-sm font-medium rounded-full hover:bg-gray-600 hover:text-white transition-all transform hover:scale-105">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                    <span>{q}</span>
                </button>
            ))}
            </div>
        </div>
    );

    const DecorativeGraph = () => (
        <svg className="absolute top-0 right-0 h-48 w-48 text-teal-500/5 -z-10 transform translate-x-1/3 -translate-y-1/3" stroke="currentColor" fill="none" viewBox="0 0 100 100">
            <circle cx="20" cy="20" r="2" strokeWidth="1" />
            <circle cx="80" cy="20" r="2" strokeWidth="1" />
            <circle cx="50" cy="50" r="3" strokeWidth="1" fill="currentColor" />
            <circle cx="20" cy="80" r="2" strokeWidth="1" />
            <circle cx="80" cy="80" r="2" strokeWidth="1" />
            <path d="M20 20 L50 50 L80 20" strokeDasharray="2 2" strokeWidth="0.5" />
            <path d="M20 80 L50 50 L80 80" strokeDasharray="2 2" strokeWidth="0.5" />
            <path d="M20 20 L20 80" strokeDasharray="2 2" strokeWidth="0.5" />
            <path d="M80 20 L80 80" strokeDasharray="2 2" strokeWidth="0.5" />
        </svg>
    );

    return (
        <section id="market-trends" className="py-16 sm:py-24 animate-fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('marketTrends.title')}</h1>
                    <p className="mt-4 text-lg text-gray-300">{t('marketTrends.subtitle')}</p>
                </div>

                <div className="mt-12 max-w-2xl mx-auto space-y-4">
                    <div className="grid grid-cols-3 gap-2 p-1 bg-gray-800/50 rounded-lg border border-white/10">
                        {(['quick', 'in-depth', 'swot'] as MarketAnalysisMode[]).map(m => (
                            <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === m ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                                {t(`marketTrends.analysisModes.${m}`)}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex items-center bg-gray-800/50 border border-white/10 rounded-lg shadow-md p-2">
                        <input
                            type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('marketTrends.searchPlaceholder')}
                            className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-2 focus:outline-none"
                        />
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors disabled:bg-gray-500">
                            {isLoading ? t('marketTrends.searching') : t('marketTrends.searchButton')}
                        </button>
                    </form>
                    <div className="text-center">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <span className="text-sm text-gray-400">{t('marketTrends.suggestionsLabel')}:</span>
                            {(t('marketTrends.suggestions') as string[]).map((suggestion: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestedQueryClick(suggestion)}
                                    className="px-3 py-1.5 bg-gray-700/80 text-gray-300 text-xs font-medium rounded-full hover:bg-gray-600 hover:text-white transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="mt-12">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
                            <p className="mt-4 text-gray-400 transition-opacity duration-500" key={loadingMessageIndex}>
                                {loadingMessages[loadingMessageIndex]}
                            </p>
                        </div>
                    )}
                    {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                    {!isLoading && !result && !error && (
                        <div className="text-center py-10 text-gray-500 bg-gray-800/20 rounded-lg">
                            <p>{t('marketTrends.placeholder')}</p>
                        </div>
                    )}
                    {result && (
                        <div className="animate-fade-in bg-gray-800/30 p-6 sm:p-8 rounded-lg mt-8 border border-white/10 space-y-10 relative overflow-hidden">
                            <DecorativeGraph />
                            {result.type === 'quick' && 
                                <div className="prose prose-invert prose-sm max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: (result as QuickSummary).summary.replace(/\n/g, '<br />') }} />
                            }
                            {result.type === 'in-depth' && <InDepthResult analysis={result as InDepthAnalysis} />}
                            {result.type === 'swot' && <SWOTResult analysis={result as SWOTAnalysis} />}
                            
                            {(result.sources && result.sources.length > 0) && <Sources sources={result.sources} />}
                            {(result.suggestedQueries && result.suggestedQueries.length > 0) && <SuggestedQueries queries={result.suggestedQueries} />}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MarketTrendsPage;