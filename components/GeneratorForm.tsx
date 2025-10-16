import React, { useState, useEffect, useRef } from 'react';
import { SymptomDetails, useLanguage } from '../types';
import { CULTURAL_PROMPTS } from '../constants';

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
  start: () => void;
  stop: () => void;
}

interface ConsultationFormProps {
  onAnalyze: () => void;
  isLoading: boolean;
  symptoms: string;
  setSymptoms: (value: React.SetStateAction<string>) => void;
  symptomDetails: SymptomDetails;
  setSymptomDetails: (value: React.SetStateAction<SymptomDetails>) => void;
  isQuotaExhausted: boolean;
  imageBase64: string | null;
  setImageBase64: (value: React.SetStateAction<string | null>) => void;
  imageMimeType: string | null;
  setImageMimeType: (value: React.SetStateAction<string | null>) => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ 
  onAnalyze, 
  isLoading, 
  symptoms,
  setSymptoms,
  symptomDetails,
  setSymptomDetails,
  isQuotaExhausted,
  imageBase64,
  setImageBase64,
  imageMimeType,
  setImageMimeType,
}) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }
    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'fa' ? 'fa-IR' : 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setSymptoms(prev => prev ? `${prev} ${finalTranscript.trim()}` : finalTranscript.trim());
      }
    };
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
    }
    
    recognitionRef.current = recognition;
  }, [language, setSymptoms]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() && !imageBase64) {
      alert(t('assessment.form.validationError'));
      return;
    }
    onAnalyze();
  };
  
  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSymptomDetails(d => ({ ...d, [name]: value }));
  };
  
  const handleImageFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          const base64String = (e.target?.result as string).split(',')[1];
          setImageBase64(base64String);
          setImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          handleImageFile(e.target.files[0]);
      }
  };
  
  const onRemoveImage = () => {
      setImageBase64(null);
      setImageMimeType(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10">
      <h2 className="text-2xl font-bold mb-6 text-white">{t('assessment.form.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="description" className={`block text-sm font-medium text-gray-300`}>{t('assessment.form.symptomsLabel')}</label>
            <button
                type="button"
                onClick={toggleListening}
                title={isListening ? t('assessment.form.voiceInputStop') : t('assessment.form.voiceInputStart')}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/50 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                disabled={!recognitionRef.current}
            >
                {isListening ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                        <path d="M5.5 13a.5.5 0 01.5.5v1.5a4.5 4.5 0 009 0v-1.5a.5.5 0 011 0v1.5a5.5 5.5 0 01-11 0v-1.5a.5.5 0 01.5-.5z" />
                     </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm5 10.5a.5.5 0 01.5.5v.5a3.5 3.5 0 01-7 0v-.5a.5.5 0 01.5-.5h6zM5 8a1 1 0 011-1h1V6a1 1 0 112 0v1h1a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
          </div>
          <textarea
            id="description"
            rows={8}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white"
            placeholder={t('assessment.form.symptomsPlaceholder')}
          />
        </div>

        <div className="pt-4 border-t border-white/10">
          <h4 className="text-xs font-semibold text-gray-400 mb-3">{t('assessment.form.culturalPromptsTitle')}</h4>
          <div className="flex flex-wrap gap-2">
            {CULTURAL_PROMPTS[language].map((prompt: string, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => setSymptoms(prompt)}
                className="px-3 py-1.5 bg-gray-700/80 text-gray-300 text-xs font-medium rounded-full hover:bg-gray-600 hover:text-white transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Image Uploader */}
        <div className="pt-4 border-t border-white/10">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">{t('assessment.form.uploadImageTitle')}</h3>
            {imageBase64 ? (
                <div className="relative group">
                    <img src={`data:${imageMimeType};base64,${imageBase64}`} alt="User submission" className="rounded-lg w-full max-w-sm mx-auto shadow-lg" />
                    <button onClick={onRemoveImage} type="button" className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100" title={t('assessment.form.removeImage')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />
                     <input type="file" accept="image/*" capture="user" ref={cameraInputRef} onChange={onFileChange} className="hidden" />
                     <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700/80 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        <span>{t('assessment.form.uploadButton')}</span>
                     </button>
                     <button type="button" onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700/80 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                        <span>{t('assessment.form.cameraButton')}</span>
                     </button>
                </div>
            )}
        </div>

        {/* Details Form */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">{t('assessment.form.detailsTitle')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            
            <div>
              <label htmlFor="aggravatingFactors" className="block text-sm font-medium text-gray-300">{t('assessment.form.aggravatingFactors')}</label>
              <input type="text" name="aggravatingFactors" id="aggravatingFactors" value={symptomDetails.aggravatingFactors} onChange={handleDetailChange} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
            </div>

            <div>
              <label htmlFor="alleviatingFactors" className="block text-sm font-medium text-gray-300">{t('assessment.form.alleviatingFactors')}</label>
              <input type="text" name="alleviatingFactors" id="alleviatingFactors" value={symptomDetails.alleviatingFactors} onChange={handleDetailChange} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300">{t('assessment.form.duration')}</label>
              <input type="text" name="duration" id="duration" value={symptomDetails.duration} onChange={handleDetailChange} placeholder={t('assessment.form.durationPlaceholder')} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
            </div>
            
            <div>
                <label htmlFor="previousTreatments" className="block text-sm font-medium text-gray-300">{t('assessment.form.previousTreatments')}</label>
                <input type="text" name="previousTreatments" id="previousTreatments" value={symptomDetails.previousTreatments} onChange={handleDetailChange} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
            </div>

            <div>
                <label htmlFor="medications" className="block text-sm font-medium text-gray-300">{t('assessment.form.medications')}</label>
                <input type="text" name="medications" id="medications" value={symptomDetails.medications} onChange={handleDetailChange} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
            </div>

          </div>
        </div>


        <div>
          <button
            type="submit"
            disabled={isLoading || isQuotaExhausted || (!symptoms.trim() && !imageBase64)}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-rose-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isQuotaExhausted ? t('quotaErrorModal.title') : t('assessment.form.buttonText')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;