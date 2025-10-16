
import React from 'react';
import { useLanguage } from '../types';

interface TreatmentSummaryProps {
  summaryHtml: string;
  styleMode: 'dark' | 'light';
}

const TreatmentSummary = React.forwardRef<HTMLDivElement, TreatmentSummaryProps>(({ summaryHtml, styleMode }, ref) => {
  const { t } = useLanguage();

  const themeClasses = {
    dark: {
      card: 'bg-gray-800 border-gray-700 text-gray-300',
      name: 'text-white',
      prose: 'prose-dark',
    },
    light: {
      card: 'bg-white border-gray-200 text-gray-700',
      name: 'text-gray-900',
      prose: 'prose-light',
    }
  };

  const currentTheme = themeClasses[styleMode];

  return (
    <div className={`p-6 rounded-lg font-sans transition-colors duration-300 ${currentTheme.card} border`}>
        <style>{`
            .prose-dark h3 { color: #fecdd3; border-bottom-color: #4b5563; font-size: 1.1rem; font-weight: 600; padding-bottom: 0.5rem; border-bottom-width: 1px; margin-top: 1.5rem; margin-bottom: 1rem; }
            .prose-dark ul { list-style-type: '⚕️ '; padding-left: 1.5rem; margin-bottom: 1rem; color: #d1d5db; }
            .prose-dark li { margin-bottom: 0.25rem; padding-left: 0.25rem; }
            .prose-dark p { line-height: 1.6; margin-bottom: 1rem; color: #d1d5db; }
            .prose-dark strong { color: #e5e7eb; }

            .prose-light h3 { color: #be123c; border-bottom-color: #e5e7eb; font-size: 1.1rem; font-weight: 600; padding-bottom: 0.5rem; border-bottom-width: 1px; margin-top: 1.5rem; margin-bottom: 1rem; }
            .prose-light ul { list-style-type: '⚕️ '; padding-left: 1.5rem; margin-bottom: 1rem; color: #374151; }
            .prose-light li { margin-bottom: 0.25rem; padding-left: 0.25rem; }
            .prose-light p { line-height: 1.6; margin-bottom: 1rem; color: #4b5563; }
            .prose-light strong { color: #1f2937; }
        `}</style>

        <div className="flex items-center space-x-4 rtl:space-x-reverse p-4 border-b ${styleMode === 'dark' ? 'border-gray-700' : 'border-gray-200'}" >
            <div className={`p-3 rounded-full ${styleMode === 'dark' ? 'bg-gray-700' : 'bg-rose-100'}`}>
                <svg className={`h-8 w-8 ${styleMode === 'dark' ? 'text-rose-300' : 'text-rose-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
            </div>
            <div>
                 <h2 className={`text-2xl font-bold ${currentTheme.name}`}>{t('treatmentSummary.namePlaceholder')}</h2>
                 <p className="text-sm">{t('treatmentSummary.locationPlaceholder')}</p>
            </div>
        </div>
      
      <main ref={ref} className={`${currentTheme.prose} max-w-none p-4`}>
        <div dangerouslySetInnerHTML={{ __html: summaryHtml }} />
      </main>

    </div>
  );
});

export default TreatmentSummary;
