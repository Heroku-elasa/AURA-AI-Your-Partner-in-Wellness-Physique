
import React from 'react';
import { useLanguage } from '../types';

interface ResearchRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
}

const ResearchRequestModal: React.FC<ResearchRequestModalProps> = ({ isOpen, onClose, topic }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border border-green-500/50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-900">
            <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-5 text-lg font-semibold leading-6 text-white">{t('researchRequestModal.title')}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: t('researchRequestModal.body').replace('{topic}', `<strong class="text-green-300">${topic}</strong>`) }} />
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:text-sm"
          >
            {t('researchRequestModal.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchRequestModal;
