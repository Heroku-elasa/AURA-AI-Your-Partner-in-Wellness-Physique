import React, { useState } from 'react';
import { useLanguage, SearchTrend } from '../types';
import { generateMarketingContent, analyzeSearchTrends } from '../services/geminiService';
import { marked } from 'marked';
import { useToast } from './Toast';
import { MOCK_USER_SEARCHES } from '../constants';

interface TrendHubPageProps {
    handleApiError: (err: unknown) => string;
}

type ContentType = 'blog' | 'instagram' | 'twitter';
type Tone = 'professional' | 'friendly' | 'inspirational' | 'scientific';

const TrendHubPage: React.FC<TrendHubPageProps> = ({ handleApiError }) => {
    const { language, t } = useLanguage();
    const { addToast } = useToast();

    const [isLoadingTrends, setIsLoadingTrends] = useState(false);
    const [trends, setTrends] = useState<SearchTrend[] | null>(null);
    const [trendsError, setTrendsError] = useState<string | null>(null);

    const [selectedTrend, setSelectedTrend] = useState<SearchTrend | null>(null);
    const [contentType, setContentType] = useState<ContentType>('blog');
    const [tone, setTone] = useState<Tone>('professional');
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [contentError, setContentError] = useState<string | null>(null);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    
    const handleAnalyzeTrends = async () => {
        setIsLoadingTrends(true);
        setTrendsError(null);
        setTrends(null);
        try {
            const result = await analyzeSearchTrends(MOCK_USER_SEARCHES, language);
            setTrends(result);
        } catch(err) {
            setTrendsError(handleApiError(err));
        } finally {
            setIsLoadingTrends(false);
        }
    };
    
    const handleCreateContent = async (trend: SearchTrend) => {
        setSelectedTrend(trend);
        setIsLoadingContent(true);
        setContentError(null);
        setGeneratedContent(null);
        try {
            const content = await generateMarketingContent(trend.topic, contentType, tone, language);
            setGeneratedContent(content);
        } catch(err) {
            setContentError(handleApiError(err));
        } finally {
            setIsLoadingContent(false);
        }
    };
    
    const handleCopy = () => {
        if (generatedContent) {
            navigator.clipboard.writeText(generatedContent)
                .then(() => addToast(t('contentCreator.copySuccess'), 'success'))
                .catch(err => addToast('Failed to copy text.', 'error'));
        }
    };
    
    const TrendCard: React.FC<{ trend: SearchTrend }> = ({ trend }) => {
        const volumeStyles = {
            High: 'bg-red-500/20 text-red-300',
            Medium: 'bg-yellow-500/20 text-yellow-300',
            Low: 'bg-green-500/20 text-green-300',
        };
        const isSelected = selectedTrend?.topic === trend.topic;
        
        return (
            <div className={`bg-gray-800/50 p-6 rounded-lg border border-white/10 transition-all ${isSelected ? 'ring-2 ring-rose-500' : ''}`}>
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white">{trend.topic}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${volumeStyles[trend.search_volume]}`}>{trend.search_volume} Volume</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">{trend.reasoning}</p>
                <button 
                    onClick={() => handleCreateContent(trend)}
                    className="mt-4 w-full sm:w-auto px-4 py-2 bg-rose-600 text-white font-semibold rounded-md hover:bg-rose-700 transition-colors text-sm"
                >
                    {t('trendHub.createContentButton')}
                </button>
            </div>
        );
    };

    const renderGeneratedContent = () => {
        if (!selectedTrend) return null;
        if (isLoadingContent) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-rose-400"></div>
                    <p className="mt-4 text-gray-400">{t('contentCreator.generating')}</p>
                </div>
            );
        }
        if (contentError) {
             return <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{contentError}</div>;
        }
        if (generatedContent) {
            const htmlResult = marked.parse(generatedContent);
            return (
                 <div className="animate-fade-in relative">
                     <button 
                        onClick={handleCopy}
                        className="absolute top-2 right-2 rtl:left-2 rtl:right-auto px-3 py-1.5 bg-gray-700/80 text-gray-300 text-xs font-medium rounded-md hover:bg-gray-600 hover:text-white transition-colors"
                    >
                        {t('contentCreator.copyButton')}
                    </button>
                    <div
                        className="prose prose-sm sm:prose-base prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: htmlResult }}
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('trendHub.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('trendHub.subtitle')}</p>
            </div>

            <div className="mt-12 max-w-4xl mx-auto space-y-12">
                <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
                    <div className="text-center">
                        <button 
                            onClick={handleAnalyzeTrends} 
                            disabled={isLoadingTrends}
                            className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isLoadingTrends ? t('trendHub.analyzing') : t('trendHub.analyzeButton')}
                        </button>
                    </div>
                    {isLoadingTrends && (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
                            <p className="mt-4 text-gray-400">{t('trendHub.analyzing')}</p>
                        </div>
                    )}
                    {trendsError && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{trendsError}</div>}
                    {!isLoadingTrends && !trends && !trendsError && (
                        <div className="text-center py-10 text-gray-500">
                            <p>{t('trendHub.placeholder')}</p>
                        </div>
                    )}
                    {trends && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-2xl font-bold text-white text-center">{t('trendHub.trendsTitle')}</h2>
                            {trends.map(trend => <TrendCard key={trend.topic} trend={trend} />)}
                        </div>
                    )}
                </div>

                {selectedTrend && (
                    <div className="bg-gray-800/50 rounded-lg p-6 sm:p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
                        <h2 className="text-2xl font-bold text-white">{t('trendHub.contentCreationTitle')}: <span className="text-rose-300">{selectedTrend.topic}</span></h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">{t('contentCreator.contentTypeLabel')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(t('contentCreator.contentTypes')).map(([key, value]) => (
                                        <button key={key} onClick={() => setContentType(key as ContentType)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors w-full ${contentType === key ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{value as string}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">{t('contentCreator.toneLabel')}</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(t('contentCreator.tones')).map(([key, value]) => (
                                        <button key={key} onClick={() => setTone(key as Tone)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors w-full ${tone === key ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{value as string}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                         <button 
                            onClick={() => handleCreateContent(selectedTrend)}
                            disabled={isLoadingContent}
                            className="w-full sm:w-auto px-6 py-2 bg-rose-600 text-white font-semibold rounded-md hover:bg-rose-700 transition-colors disabled:bg-gray-500"
                        >
                            {t('contentCreator.generateButton')}
                        </button>
                        <div className="pt-4 border-t border-white/10 min-h-[200px]">
                            {renderGeneratedContent()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendHubPage;