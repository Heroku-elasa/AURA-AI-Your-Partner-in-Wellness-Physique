
import React, { useState } from 'react';
import { useLanguage } from '../types';
import { generateMarketingContent } from '../services/geminiService';
import { marked } from 'marked';
import { useToast } from './Toast';

interface ContentCreatorPageProps {
    handleApiError: (err: unknown) => string;
}

type ContentType = 'blog' | 'instagram' | 'twitter';
type Tone = 'professional' | 'friendly' | 'inspirational' | 'scientific';

const ContentCreatorPage: React.FC<ContentCreatorPageProps> = ({ handleApiError }) => {
    const { language, t } = useLanguage();
    const { addToast } = useToast();

    const [topic, setTopic] = useState('');
    const [contentType, setContentType] = useState<ContentType>('blog');
    const [tone, setTone] = useState<Tone>('professional');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError(t('validation.required'));
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const generatedContent = await generateMarketingContent(topic, contentType, tone, language);
            setResult(generatedContent);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result)
                .then(() => addToast(t('contentCreator.copySuccess'), 'success'))
                .catch(err => addToast('Failed to copy text.', 'error'));
        }
    };
    
    const renderResult = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-rose-400"></div>
                    <p className="mt-4 text-gray-400">{t('contentCreator.generating')}</p>
                </div>
            );
        }
        if (error) {
            return <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>;
        }
        if (result) {
            const htmlResult = marked.parse(result);
            return (
                <div className="animate-fade-in bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Generated Content
                        </h3>
                        <button 
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/80 text-gray-300 text-xs font-medium rounded-md hover:bg-gray-600 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            {t('contentCreator.copyButton')}
                        </button>
                    </div>
                    <div className="p-8 bg-gray-900/50">
                        <div
                            className="prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: htmlResult }}
                        />
                    </div>
                </div>
            );
        }
        return (
            <div className="text-center py-20 text-gray-500">
                <p>{t('contentCreator.placeholder')}</p>
            </div>
        );
    };

    const OptionButton: React.FC<{
      onClick: () => void;
      isActive: boolean;
      children: React.ReactNode;
    }> = ({ onClick, isActive, children }) => (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors w-full ${isActive ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('contentCreator.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('contentCreator.subtitle')}</p>
            </div>

            <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-start">
                {/* Controls */}
                <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-white/10 space-y-6 lg:sticky lg:top-28">
                     <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">{t('contentCreator.topicLabel')}</label>
                        <textarea
                            id="topic"
                            rows={4}
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={t('contentCreator.topicPlaceholder')}
                            className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t('contentCreator.contentTypeLabel')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(t('contentCreator.contentTypes')).map(([key, value]) => (
                                <OptionButton key={key} onClick={() => setContentType(key as ContentType)} isActive={contentType === key}>
                                    {value as string}
                                </OptionButton>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t('contentCreator.toneLabel')}</label>
                        <div className="grid grid-cols-2 gap-2">
                             {Object.entries(t('contentCreator.tones')).map(([key, value]) => (
                                <OptionButton key={key} onClick={() => setTone(key as Tone)} isActive={tone === key}>
                                    {value as string}
                                </OptionButton>
                            ))}
                        </div>
                    </div>
                    
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-rose-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? t('contentCreator.generating') : t('contentCreator.generateButton')}
                    </button>
                </div>

                {/* Result */}
                <div className="min-h-[400px]">
                    {renderResult()}
                </div>
            </div>
        </div>
    );
};

export default ContentCreatorPage;
