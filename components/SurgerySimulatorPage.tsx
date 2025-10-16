import React, { useState, useRef } from 'react';
import { useLanguage, SurgeryType, ProcedureIntensity, LipAugmentationIntensity } from '../types';
import { simulateSurgery } from '../services/geminiService';

interface SurgerySimulatorPageProps {
    handleApiError: (err: unknown) => string;
}

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
            <path
                d={pathData}
                fill="none"
                stroke="rgba(255, 255, 0, 0.9)"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="animate-stroke-pulse"
                strokeLinecap="round"
            />
        </svg>
    );
};


const IntensityControl: React.FC<{
    label: string;
    value: number;
    onDecrease: () => void;
    onIncrease: () => void;
    disabled: boolean;
}> = ({ label, value, onDecrease, onIncrease, disabled }) => {
    const MIN_INTENSITY = 1;
    const MAX_INTENSITY = 5;
    return (
        <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-gray-300">{label}</span>
            <div className="flex items-center gap-3 bg-gray-900/50 rounded-full">
                <button 
                    onClick={onDecrease} 
                    disabled={disabled || value <= MIN_INTENSITY} 
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-600 text-white disabled:opacity-50 hover:bg-gray-500 transition-colors"
                    aria-label={`Decrease ${label} intensity`}
                >
                    -
                </button>
                <span className="font-bold text-lg w-6 text-center text-white">{value}</span>
                <button 
                    onClick={onIncrease} 
                    disabled={disabled || value >= MAX_INTENSITY} 
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-600 text-white disabled:opacity-50 hover:bg-gray-500 transition-colors"
                    aria-label={`Increase ${label} intensity`}
                >
                    +
                </button>
            </div>
        </div>
    );
}

const SurgerySimulatorPage: React.FC<SurgerySimulatorPageProps> = ({ handleApiError }) => {
    const { language, t } = useLanguage();

    const [originalImage, setOriginalImage] = useState<{ base64: string; mimeType: string; url: string; } | null>(null);
    const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
    const [activeProcedure, setActiveProcedure] = useState<SurgeryType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingDefaultImage, setIsLoadingDefaultImage] = useState(false);
    const [showHighlight, setShowHighlight] = useState(false);
    
    const [intensities, setIntensities] = useState<Record<SurgeryType, ProcedureIntensity>>({
        rhinoplasty: 1,
        blepharoplasty: 1,
        genioplasty: 1,
        lipAugmentation: { upper: 1, lower: 1 },
        facelift: 1,
        jawSurgery: 1,
    });


    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    
    const MIN_INTENSITY = 1;
    const MAX_INTENSITY = 5;

    const handleImageFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            const base64String = dataUrl.split(',')[1];
            setOriginalImage({ base64: base64String, mimeType: file.type, url: dataUrl });
            setSimulatedImage(dataUrl); // Set 'after' to be same as 'before' initially
            setError(null);
            setShowHighlight(false);
        };
        reader.readAsDataURL(file);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageFile(e.target.files[0]);
        }
    };
    
    const onRemoveImage = () => {
        setOriginalImage(null);
        setSimulatedImage(null);
        setActiveProcedure(null);
        setError(null);
        setShowHighlight(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    };

    const handleUseDefaultImage = async (gender: 'male' | 'female') => {
        setIsLoadingDefaultImage(true);
        setError(null);
        const MALE_DEFAULT_URL = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop';
        const FEMALE_DEFAULT_URL = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop';
        const url = gender === 'male' ? MALE_DEFAULT_URL : FEMALE_DEFAULT_URL;
    
        try {
            const { base64, mimeType, url: dataUrl } = await fetchImageAsBase64(url);
            setOriginalImage({ base64, mimeType, url: dataUrl });
            setSimulatedImage(dataUrl);
            setShowHighlight(false);
        } catch (err) {
            const msg = handleApiError(err);
            setError(msg);
        } finally {
            setIsLoadingDefaultImage(false);
        }
    };
    
    const handleIntensityChange = (procedure: SurgeryType, direction: 'inc' | 'dec') => {
        if (procedure === 'lipAugmentation') return;

        setIntensities(prev => {
            const current = prev[procedure] as number;
            const newValue = direction === 'inc' ? Math.min(MAX_INTENSITY, current + 1) : Math.max(MIN_INTENSITY, current - 1);
            if (newValue === current) return prev;
            return { ...prev, [procedure]: newValue };
        });
    };
    
    const handleLipIntensityChange = (part: 'upper' | 'lower', direction: 'inc' | 'dec') => {
        setIntensities(prev => {
            const current = prev.lipAugmentation as LipAugmentationIntensity;
            const currentPartValue = current[part];
            const newValue = direction === 'inc' ? Math.min(MAX_INTENSITY, currentPartValue + 1) : Math.max(MIN_INTENSITY, currentPartValue - 1);
            if (newValue === currentPartValue) return prev;
            
            const newLipIntensity = { ...current, [part]: newValue };
            return { ...prev, lipAugmentation: newLipIntensity };
        });
    };

    const handleSimulate = async (procedure: SurgeryType) => {
        if (!originalImage) return;

        setIsLoading(true);
        setActiveProcedure(procedure);
        setError(null);
        setShowHighlight(false);
        
        // Optimistically show original image in 'after' panel while loading
        setSimulatedImage(originalImage.url);

        try {
            const resultBase64 = await simulateSurgery(originalImage.base64, originalImage.mimeType, procedure, intensities[procedure], language);
            setSimulatedImage(`data:${originalImage.mimeType};base64,${resultBase64}`);
        } catch (err) {
            const msg = handleApiError(err);
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleResetSimulation = () => {
        if (originalImage) {
            setSimulatedImage(originalImage.url);
        }
        setActiveProcedure(null);
        setError(null);
        setShowHighlight(false);
    };
    
    const procedures: { id: SurgeryType; name: string; icon: React.ReactNode }[] = [
        { id: 'rhinoplasty', name: t('aiSurgerySimulator.procedures.rhinoplasty'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12V13.5C20 16.5376 17.5376 19 14.5 19C12.481 19 10.723 17.8441 9.80951 16.1905C9.23114 15.2208 8.1368 14.25 6.5 14.25C4.567 14.25 3 15.817 3 17.75" /></svg> },
        { id: 'blepharoplasty', name: t('aiSurgerySimulator.procedures.blepharoplasty'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
        { id: 'genioplasty', name: t('aiSurgerySimulator.procedures.genioplasty'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12ZM12 12C10.6863 12 9.5 13.3431 9.5 15V19.5H14.5V15C14.5 13.3431 13.3137 12 12 12Z"/></svg> },
        { id: 'lipAugmentation', name: t('aiSurgerySimulator.procedures.lipAugmentation'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M5 10C5 7.23858 7.23858 5 10 5H14C16.7614 5 19 7.23858 19 10V10.5C19 12.1569 17.6569 13.5 16 13.5H8C6.34315 13.5 5 12.1569 5 10.5V10Z" /><path d="M5 14C5 15.6569 6.34315 17 8 17H16C17.6569 17 19 15.6569 19 14" /></svg> },
        { id: 'facelift', name: t('aiSurgerySimulator.procedures.facelift'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M13 5C13 3.34315 11.6569 2 10 2C8.34315 2 7 3.34315 7 5" /><path d="M7 5C7 7.76142 9.23858 10 12 10C14.7614 10 17 7.76142 17 5" /><path d="M7 5V19C7 20.6569 8.34315 22 10 22H14C15.6569 22 17 20.6569 17 19V5" /></svg> },
        { id: 'jawSurgery', name: t('aiSurgerySimulator.procedures.jawSurgery'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M4 14C4 16.7614 6.23858 19 9 19H15C17.7614 19 20 16.7614 20 14V12C20 9.23858 17.7614 7 15 7H9C6.23858 7 4 9.23858 4 12V14Z" /></svg> },
    ];


    const ImageViewer: React.FC<{ title: string; imageUrl: string | null; isLoading: boolean; procedure: SurgeryType | null; showHighlight?: boolean; }> = ({ title, imageUrl, isLoading, procedure, showHighlight = false }) => (
        <div className="flex-1">
            <h3 className="text-center font-bold text-gray-300 mb-2">{title}</h3>
            <div className="aspect-[3/4] bg-gray-900/50 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <p className="text-gray-500">{t('aiSurgerySimulator.uploadPrompt')}</p>
                )}
                 {isLoading && procedure && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-10">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-rose-400"></div>
                        <p className="mt-4 text-sm">{t('aiSurgerySimulator.generating')}</p>
                    </div>
                 )}
                 {showHighlight && procedure && <HighlightOverlay procedure={procedure} />}
            </div>
            {simulatedImage && originalImage && simulatedImage !== originalImage.url && title === t('aiSurgerySimulator.after') && activeProcedure && (
                <p className="text-center text-xs text-gray-400 mt-2">
                    {t('aiSurgerySimulator.simulatedEffectText').replace('{procedure}', procedures.find(p => p.id === activeProcedure)?.name || '')}
                </p>
            )}
        </div>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('aiSurgerySimulator.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('aiSurgerySimulator.subtitle')}</p>
            </div>

            {!originalImage ? (
                <div className="mt-12 max-w-lg mx-auto bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-6 text-center">
                    <h2 className="text-2xl font-bold text-white">{t('aiSurgerySimulator.uploadTitle')}</h2>
                    <p className="text-gray-400">{t('aiSurgerySimulator.uploadPrompt')}</p>
                     {isLoadingDefaultImage ? (
                        <div className="flex items-center justify-center py-3">
                            <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>
                            <span className="ml-3 rtl:mr-3 rtl:ml-0">{t('aiSurgerySimulator.loadingDefault')}</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button type="button" onClick={() => handleUseDefaultImage('female')} className="w-full py-3 px-4 bg-gray-700/80 text-gray-200 rounded-md hover:bg-gray-600 transition-colors">{t('aiSurgerySimulator.useDefaultFemaleFace')}</button>
                            <button type="button" onClick={() => handleUseDefaultImage('male')} className="w-full py-3 px-4 bg-gray-700/80 text-gray-200 rounded-md hover:bg-gray-600 transition-colors">{t('aiSurgerySimulator.useDefaultMaleFace')}</button>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />
                            <input type="file" accept="image/*" capture="user" ref={cameraInputRef} onChange={onFileChange} className="hidden" />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700/80 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white transition-colors">{t('aiSurgerySimulator.uploadButton')}</button>
                            <button type="button" onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700/80 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white transition-colors">{t('aiSurgerySimulator.cameraButton')}</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
                    {/* Controls Column */}
                    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
                        <h2 className="text-xl font-bold text-white">{t('aiSurgerySimulator.proceduresTitle')}</h2>
                        <div className="space-y-3">
                            {procedures.map(proc => {
                                const isLipAug = proc.id === 'lipAugmentation';
                                const lipIntensities = intensities.lipAugmentation as LipAugmentationIntensity;

                                return (
                                    <div 
                                        key={proc.id}
                                        className={`p-3 rounded-lg transition-all duration-300 ${
                                            activeProcedure === proc.id 
                                            ? 'bg-rose-900/50 ring-2 ring-rose-500' 
                                            : 'bg-gray-700/50 hover:bg-gray-700'
                                        }`}
                                    >
                                        <button
                                            onClick={() => handleSimulate(proc.id)}
                                            disabled={isLoading}
                                            className="w-full flex items-center gap-3 text-left disabled:cursor-not-allowed"
                                        >
                                            {proc.icon}
                                            <span className="flex-grow text-sm font-semibold text-white">{proc.name}</span>
                                            {isLoading && activeProcedure === proc.id && <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white"></div>}
                                        </button>
                                        
                                        {!isLipAug ? (
                                             <div className="mt-2 pl-9">
                                                <IntensityControl 
                                                    label={""} // No label needed for this layout
                                                    value={intensities[proc.id] as number}
                                                    onDecrease={() => handleIntensityChange(proc.id, 'dec')}
                                                    onIncrease={() => handleIntensityChange(proc.id, 'inc')}
                                                    disabled={isLoading}
                                                />
                                             </div>
                                        ) : (
                                            <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                                                <IntensityControl 
                                                    label={t('aiSurgerySimulator.upperLip')}
                                                    value={lipIntensities.upper}
                                                    onDecrease={() => handleLipIntensityChange('upper', 'dec')}
                                                    onIncrease={() => handleLipIntensityChange('upper', 'inc')}
                                                    disabled={isLoading}
                                                />
                                                <IntensityControl 
                                                    label={t('aiSurgerySimulator.lowerLip')}
                                                    value={lipIntensities.lower}
                                                    onDecrease={() => handleLipIntensityChange('lower', 'dec')}
                                                    onIncrease={() => handleLipIntensityChange('lower', 'inc')}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                            <button onClick={handleResetSimulation} className="w-full py-2 px-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md transition-colors">{t('aiSurgerySimulator.reset')}</button>
                            <button onClick={onRemoveImage} className="w-full py-2 px-3 bg-red-800/80 hover:bg-red-700 text-white font-semibold rounded-md transition-colors">{t('aiSurgerySimulator.removeImage')}</button>
                        </div>
                    </div>
                    
                    {/* Image Viewer Column */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-8">
                            <ImageViewer title={t('aiSurgerySimulator.before')} imageUrl={originalImage.url} isLoading={false} procedure={null} />
                            <ImageViewer title={t('aiSurgerySimulator.after')} imageUrl={simulatedImage} isLoading={isLoading} procedure={activeProcedure} showHighlight={showHighlight} />
                        </div>
                        {error && <div className="text-center text-red-400 p-3 bg-red-900/50 rounded-md">{error}</div>}
                        {simulatedImage && originalImage && simulatedImage !== originalImage.url && !isLoading && (
                            <div className="text-center">
                                <button
                                    onClick={() => setShowHighlight(!showHighlight)}
                                    className="px-6 py-2 bg-gray-700/80 text-gray-200 rounded-full hover:bg-gray-600 hover:text-white transition-colors text-sm font-semibold flex items-center gap-2 mx-auto"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>{showHighlight ? t('aiSurgerySimulator.hideChanges') : t('aiSurgerySimulator.showChanges')}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SurgerySimulatorPage;