import React, { useState, useRef } from 'react';
import { useLanguage, SurgeryType, ProcedureIntensity, LipAugmentationIntensity } from '../types';
import { simulateSurgery, generatePhotoshootImage, beautifyImage } from '../services/geminiService';

interface SurgerySimulatorPageProps {
    mode: 'cosmetic' | 'physique';
    handleApiError: (err: unknown) => string;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const fetchImageAsBase64 = async (url: string) => {
    // A simple CORS proxy to prevent tainted canvas errors when fetching images from another domain.
    const proxyUrl = `https://cors-proxy.felipe-project.workers.dev/?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise<{ base64: string; mimeType: string; url: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            resolve({ base64, mimeType: blob.type, url: dataUrl });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const HIGHLIGHT_AREAS: Record<SurgeryType, string> = {
    rhinoplasty: "M 125,140 C 120,170 120,190 125,220 L 175,220 C 180,190 180,170 175,140 Z",
    blepharoplasty: "M 70,140 C 90,130 130,130 150,140 Q 130,155 90,155 Q 70,150 70,140 Z M 150,140 C 170,130 210,130 230,140 Q 210,155 170,155 Q 150,150 150,140 Z",
    lipAugmentation: "M 100,240 Q 150,230 200,240 Q 150,270 100,240 Z",
    genioplasty: "M 110,280 C 130,310 170,310 190,280 L 150,295 Z",
    jawSurgery: "M 60,200 C 90,280 110,300 150,300 C 190,300 210,280 240,200",
    facelift: "M 60,160 C 90,240 100,280 120,280 L 180,280 C 200,280 210,240 240,160",
};

const HighlightOverlay: React.FC<{ procedure: SurgeryType }> = ({ procedure }) => {
    const pathData = HIGHLIGHT_AREAS[procedure];
    if (!pathData) return null;

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none animate-fade-in"
            viewBox="0 0 300 400" // Corresponds to aspect-[3/4]
            preserveAspectRatio="xMidYMid slice"
        >
            <defs>
                <mask id="highlight-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <path d={pathData} fill="black" />
                </mask>
                <radialGradient id="glow-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
            </defs>
            <rect
                width="100%"
                height="100%"
                fill="url(#glow-gradient)"
                mask="url(#highlight-mask)"
                className="animate-pulse"
            />
            <path
                d={pathData}
                fill="none"
                stroke="rgba(251, 113, 133, 0.8)" // rose-400
                strokeWidth="2"
                className="line-draw"
            />
        </svg>
    );
};


const SurgerySimulatorPage: React.FC<SurgerySimulatorPageProps> = ({ mode, handleApiError }) => {
    const { language, t } = useLanguage();

    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    
    const [simulatedImageUrl, setSimulatedImageUrl] = useState<string | null>(null);
    const [simulatedBase64, setSimulatedBase64] = useState<string | null>(null);
    
    const [activeProcedure, setActiveProcedure] = useState<SurgeryType>('rhinoplasty');
    const [intensity, setIntensity] = useState<ProcedureIntensity>(3);
    
    const [isSimulating, setIsSimulating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingDefault, setIsLoadingDefault] = useState(false);
    const [showHighlights, setShowHighlights] = useState(false);

    const [activeTab, setActiveTab] = useState<'procedures' | 'photoshoot' | 'glamour'>('procedures');
    const [photoshootPrompt, setPhotoshootPrompt] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const MALE_DEFAULT_URL = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop';
    const FEMALE_DEFAULT_URL = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop';
    
    const handleProcedureChange = (proc: SurgeryType) => {
        setActiveProcedure(proc);
        if (proc === 'lipAugmentation') {
            setIntensity({ upper: 3, lower: 3 });
        } else {
            setIntensity(3);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
                handleApiError(`Unsupported file type. Please upload a JPEG, PNG, or WebP image.`);
                return;
            }

            if (file.size > MAX_FILE_SIZE_BYTES) {
                handleApiError(`File is too large. Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = (e.target?.result as string).split(',')[1];
                setBase64Image(base64String);
                setMimeType(file.type);
                setOriginalImageUrl(URL.createObjectURL(file));
                // Reset simulation on new image
                setSimulatedImageUrl(null);
                setSimulatedBase64(null);
                setError(null);
            };
            reader.onerror = () => {
                handleApiError('An error occurred while reading the file.');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setBase64Image(null);
        setMimeType(null);
        setOriginalImageUrl(null);
        setSimulatedImageUrl(null);
        setSimulatedBase64(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    };

    const handleUseDefaultImage = async (gender: 'male' | 'female') => {
        setIsLoadingDefault(true);
        handleRemoveImage();
        const url = gender === 'male' ? MALE_DEFAULT_URL : FEMALE_DEFAULT_URL;
        try {
            const { base64, mimeType, url: dataUrl } = await fetchImageAsBase64(url);
            setBase64Image(base64);
            setMimeType(mimeType);
            setOriginalImageUrl(dataUrl);
        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoadingDefault(false);
        }
    };

    const handleSimulate = async () => {
        if (!base64Image || !mimeType) return;
        setIsSimulating(true);
        setError(null);
        try {
            const resultBase64 = await simulateSurgery(base64Image, mimeType, activeProcedure, intensity, language);
            setSimulatedBase64(resultBase64);
            setSimulatedImageUrl(`data:image/png;base64,${resultBase64}`);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsSimulating(false);
        }
    };

    const handleGeneratePhotoshoot = async () => {
        if (!base64Image || !mimeType || !photoshootPrompt.trim()) return;
        setIsSimulating(true);
        setError(null);
        try {
            const resultBase64 = await generatePhotoshootImage(base64Image, mimeType, photoshootPrompt, language);
            setSimulatedBase64(resultBase64);
            setSimulatedImageUrl(`data:image/png;base64,${resultBase64}`);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsSimulating(false);
        }
    };
    
    const handleBeautify = async () => {
        if (!base64Image || !mimeType) return;
        setIsSimulating(true);
        setError(null);
        try {
            const resultBase64 = await beautifyImage(base64Image, mimeType, language);
            setSimulatedBase64(resultBase64);
            setSimulatedImageUrl(`data:image/png;base64,${resultBase64}`);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsSimulating(false);
        }
    };

    const handleResetSimulation = () => {
        setSimulatedImageUrl(null);
        setSimulatedBase64(null);
        setShowHighlights(false);
    };
    
    const handleTabChange = (tab: 'procedures' | 'photoshoot' | 'glamour') => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            handleResetSimulation();
        }
    };

    const IntensitySlider: React.FC = () => {
        if (activeProcedure === 'lipAugmentation') {
            const lipIntensity = intensity as LipAugmentationIntensity;
            return (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300">{t('aiSurgerySimulator.upperLip')}: {lipIntensity.upper}</label>
                        <input type="range" min="1" max="5" value={lipIntensity.upper} onChange={e => setIntensity({ ...lipIntensity, upper: Number(e.target.value) })} className="w-full accent-rose-500" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">{t('aiSurgerySimulator.lowerLip')}: {lipIntensity.lower}</label>
                        <input type="range" min="1" max="5" value={lipIntensity.lower} onChange={e => setIntensity({ ...lipIntensity, lower: Number(e.target.value) })} className="w-full accent-rose-500" />
                    </div>
                </div>
            );
        }
        return (
            <div>
                 <label className="text-sm font-medium text-gray-300">Intensity: {intensity as number}</label>
                 <input type="range" min="1" max="5" value={intensity as number} onChange={e => setIntensity(Number(e.target.value))} className="w-full accent-rose-500" />
            </div>
        );
    };

    return (
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('aiSurgerySimulator.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('aiSurgerySimulator.subtitle')}</p>
            </div>

            <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Image Display */}
                <div className="lg:col-span-2">
                    {base64Image ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-center font-bold text-gray-300 mb-2">{t('aiSurgerySimulator.before')}</h3>
                                <div className="aspect-[3/4] bg-gray-900/50 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                                     <img src={originalImageUrl!} alt="Before" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-center font-bold text-gray-300 mb-2">{t('aiSurgerySimulator.after')}</h3>
                                <div className="relative aspect-[3/4] bg-gray-900/50 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                                    <img src={simulatedImageUrl || originalImageUrl!} alt="After" className="w-full h-full object-cover" />
                                    {isSimulating && (
                                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-10">
                                            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-rose-400"></div>
                                            <p className="mt-4 text-sm">{t('aiSurgerySimulator.generating')}</p>
                                        </div>
                                    )}
                                    {showHighlights && simulatedImageUrl && activeTab === 'procedures' && <HighlightOverlay procedure={activeProcedure} />}
                                </div>
                            </div>
                        </div>
                    ) : (
                         <div className="aspect-video bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-8 text-center">
                            <h3 className="text-lg font-semibold text-white">{t('aiSurgerySimulator.uploadTitle')}</h3>
                            <p className="text-sm text-gray-400 mt-2">{t('aiSurgerySimulator.uploadPrompt')}</p>
                            {isLoadingDefault && (
                                <div className="mt-4 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>
                                    <span className="ml-3 rtl:mr-3 rtl:ml-0">{t('aiSurgerySimulator.loadingDefault')}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Controls */}
                <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-white/10 space-y-6 lg:sticky lg:top-28">
                     {base64Image ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-900/50 rounded-lg border border-gray-700">
                                <button onClick={() => handleTabChange('procedures')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'procedures' ? 'bg-rose-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                                    {t('aiSurgerySimulator.proceduresTitle')}
                                </button>
                                <button onClick={() => handleTabChange('photoshoot')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'photoshoot' ? 'bg-rose-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                                    {t('aiSurgerySimulator.photoshootTab')}
                                </button>
                                <button onClick={() => handleTabChange('glamour')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'glamour' ? 'bg-rose-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                                    {t('aiSurgerySimulator.glamourTab')}
                                </button>
                            </div>

                            {activeTab === 'procedures' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h3 className="text-lg font-semibold text-white">{t('aiSurgerySimulator.proceduresTitle')}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(t('aiSurgerySimulator.procedures')).map(([key, value]) => (
                                            <button key={key} onClick={() => handleProcedureChange(key as SurgeryType)} className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors text-center ${activeProcedure === key ? 'bg-rose-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{value as string}</button>
                                        ))}
                                    </div>
                                    <IntensitySlider />
                                    <button onClick={handleSimulate} disabled={isSimulating} className="w-full py-3 bg-rose-600 text-white font-semibold rounded-md hover:bg-rose-700 transition-colors disabled:bg-gray-500">{t('aiSurgerySimulator.generating')}</button>
                                </div>
                            )}

                            {activeTab === 'photoshoot' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h3 className="text-lg font-semibold text-white">{t('aiSurgerySimulator.photoshootTitle')}</h3>
                                    <p className="text-sm text-gray-400">{t('aiSurgerySimulator.photoshootDescription')}</p>
                                    <textarea value={photoshootPrompt} onChange={(e) => setPhotoshootPrompt(e.target.value)} placeholder={t('aiSurgerySimulator.photoshootPromptPlaceholder')} rows={3} className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
                                    <button onClick={handleGeneratePhotoshoot} disabled={isSimulating} className="w-full py-3 bg-rose-600 text-white font-semibold rounded-md hover:bg-rose-700 transition-colors disabled:bg-gray-500">{t('aiSurgerySimulator.generatePhotoshootButton')}</button>
                                </div>
                            )}
                            
                            {activeTab === 'glamour' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h3 className="text-lg font-semibold text-white">{t('aiSurgerySimulator.glamourTitle')}</h3>
                                    <p className="text-sm text-gray-400">{t('aiSurgerySimulator.glamourDescription')}</p>
                                    <button onClick={handleBeautify} disabled={isSimulating} className="w-full py-3 bg-rose-600 text-white font-semibold rounded-md hover:bg-rose-700 transition-colors disabled:bg-gray-500">
                                        {t('aiSurgerySimulator.beautifyButton')}
                                    </button>
                                </div>
                            )}
                            
                            {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md text-sm text-center">{error}</p>}
                            
                            {simulatedImageUrl && (
                                <div className="flex gap-2 pt-6 border-t border-white/10">
                                     {activeTab === 'procedures' && <button onClick={() => setShowHighlights(!showHighlights)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors">{showHighlights ? t('aiSurgerySimulator.hideChanges') : t('aiSurgerySimulator.showChanges')}</button>}
                                     <button onClick={handleResetSimulation} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors">{t('aiSurgerySimulator.reset')}</button>
                                </div>
                            )}

                            <button onClick={handleRemoveImage} className="w-full text-center text-sm text-gray-400 hover:text-white mt-2">{t('aiSurgerySimulator.removeImage')}</button>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <input type="file" accept="image/*" capture="user" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors">{t('aiSurgerySimulator.uploadButton')}</button>
                            <button onClick={() => cameraInputRef.current?.click()} className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors">{t('aiSurgerySimulator.cameraButton')}</button>
                            <div className="flex items-center text-xs text-gray-400">
                                <div className="flex-grow border-t border-gray-600"></div>
                                <span className="flex-shrink mx-2">OR</span>
                                <div className="flex-grow border-t border-gray-600"></div>
                            </div>
                            <button onClick={() => handleUseDefaultImage('male')} className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors text-sm">{t('aiSurgerySimulator.useDefaultMaleFace')}</button>
                            <button onClick={() => handleUseDefaultImage('female')} className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors text-sm">{t('aiSurgerySimulator.useDefaultFemaleFace')}</button>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default SurgerySimulatorPage;