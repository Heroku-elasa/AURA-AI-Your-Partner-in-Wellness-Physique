import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage, ProductRecommendation } from '../types';

interface LiveBeautyCoachPageProps {
    onAnalyze: (imageBase64: string, mimeType: string) => void;
    isLoading: boolean;
    result: { image: string | null; recommendations: ProductRecommendation[] | null } | null;
    isQuotaExhausted: boolean;
    handleApiError: (error: unknown) => string;
}

// Map categories to Unsplash image URLs
const categoryImages: Record<string, string> = {
    'Skincare': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
    'Makeup': 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=600&auto=format&fit=crop',
    'Treatment': 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=600&auto=format&fit=crop',
    'Tool': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=600&auto=format&fit=crop',
    'Haircare': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop'
};

const LiveBeautyCoachPage: React.FC<LiveBeautyCoachPageProps> = ({ onAnalyze, isLoading, result, isQuotaExhausted, handleApiError }) => {
    const { t } = useLanguage();
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [selectedRecommendation, setSelectedRecommendation] = useState<ProductRecommendation | null>(null);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const cleanupCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            cleanupCamera();
        };
    }, [cleanupCamera]);

    const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
        videoRef.current = node;
        if (node && streamRef.current) {
            node.srcObject = streamRef.current;
            node.play().catch(err => {
                console.error("Error playing video:", err);
                setCameraError("Could not start video playback.");
            });
        }
    }, []);

    const startCamera = async () => {
        cleanupCamera();
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } });
            streamRef.current = stream;
            setIsCameraOn(true);
        } catch (err) {
            setCameraError(t('liveBeautyCoachPage.errors.generic') || 'Could not start camera.');
            handleApiError(err);
        }
    };
    
    const stopCamera = () => {
        cleanupCamera();
        setIsCameraOn(false);
    };
    
    const handleAnalyze = () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video.readyState < 2) {
            console.warn("Video stream not ready yet.");
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (!context) return;
        
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/png');
        const base64 = dataUrl.split(',')[1];
        
        setCapturedImage(dataUrl);
        onAnalyze(base64, 'image/png');
    };

    const handleShowResult = (item: ProductRecommendation) => {
        setSelectedRecommendation(item);
    };

    const getImageForCategory = (category: string) => {
        return categoryImages[category] || categoryImages['Skincare'];
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('liveBeautyCoachPage.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('liveBeautyCoachPage.subtitle')}</p>
            </div>
            
            <div className="mt-12 max-w-6xl mx-auto bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10">
                {!isCameraOn ? (
                    <div className="text-center p-8">
                        <p className="text-gray-400 mb-6">{t('liveBeautyCoachPage.getStarted')}</p>
                        <button onClick={startCamera} className="px-8 py-3 bg-fuchsia-600 text-white font-bold rounded-lg hover:bg-fuchsia-700 transition-colors shadow-lg shadow-fuchsia-500/20">
                            {t('liveBeautyCoachPage.startCamera')}
                        </button>
                        {cameraError && <p className="mt-4 text-sm text-red-400">{cameraError}</p>}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="relative aspect-video max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                            <video ref={setVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100"></video>
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-4">
                                <button onClick={handleAnalyze} disabled={isLoading || isQuotaExhausted} className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full transition-colors disabled:bg-gray-500 flex items-center gap-2 shadow-2xl">
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                                    ) : (
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.83 4h2.34a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    )}
                                    <span>{isLoading ? t('liveBeautyCoachPage.analyzing') : t('liveBeautyCoachPage.captureAndAnalyze')}</span>
                                </button>
                                <button onClick={stopCamera} className="p-4 bg-gray-700/50 hover:bg-gray-700 text-white rounded-full transition-colors shadow-2xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                </button>
                             </div>
                        </div>
                    </div>
                )}

                {(capturedImage || result) && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                        {/* Side-by-side on md screens, stacked on smaller */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Before Image Placeholder */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="font-bold text-gray-300 mb-2 text-lg">{t('liveBeautyCoachPage.before')}</h3>
                                    {capturedImage ? (
                                        <img src={capturedImage} alt="Before" className="rounded-lg w-full shadow-lg border border-white/10" />
                                    ) : (
                                        <div className="aspect-video bg-gray-700 rounded-lg border border-white/10 flex items-center justify-center text-gray-500">
                                            No image captured
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* After Image Placeholder */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="font-bold text-gray-300 mb-2 text-lg">{t('liveBeautyCoachPage.after')}</h3>
                                    {isLoading ? (
                                        <div className="relative rounded-lg w-full aspect-video bg-gray-900 overflow-hidden border border-white/10 flex items-center justify-center">
                                            {capturedImage && (
                                                <img 
                                                    src={capturedImage} 
                                                    alt="Processing" 
                                                    className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm scale-105 filter grayscale-[50%]" 
                                                />
                                            )}
                                            <div className="relative z-10 flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-sm font-medium text-fuchsia-300 animate-pulse tracking-wide">{t('liveBeautyCoachPage.analyzing')}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={result?.image || capturedImage || ''} alt="After" className="rounded-lg w-full shadow-lg border border-white/10" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-fuchsia-500 rounded-full"></span>
                                {t('liveBeautyCoachPage.recommendationsTitle')}
                            </h3>
                             {isLoading ? (
                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-64 bg-gray-800 rounded-lg border border-white/5"></div>
                                    ))}
                                 </div>
                             ) : result?.recommendations ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {result.recommendations.map((item, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => handleShowResult(item)}
                                        className="group flex flex-col bg-gray-900/50 rounded-xl border border-white/10 hover:border-fuchsia-500/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-fuchsia-900/20 w-full text-left overflow-hidden"
                                    >
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <img src={getImageForCategory(item.category)} alt={item.category} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white border border-white/20">
                                                {item.category}
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-900/30 rounded-full flex items-center justify-center group-hover:bg-fuchsia-600 transition-colors">
                                                    <svg className="w-4 h-4 text-fuchsia-400 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                </div>
                                                <h4 className="font-bold text-white group-hover:text-fuchsia-300 transition-colors line-clamp-1">{item.name}</h4>
                                            </div>
                                            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{item.description}</p>
                                        </div>
                                    </button>
                                ))}
                                </div>
                             ) : null}
                        </div>
                    </div>
                )}

            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>

            {selectedRecommendation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedRecommendation(null)}>
                    <div className="bg-gray-800 rounded-2xl border border-white/10 max-w-lg w-full shadow-2xl transform transition-all scale-100 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="h-48 w-full relative">
                             <img src={getImageForCategory(selectedRecommendation.category)} alt={selectedRecommendation.category} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                             <button onClick={() => setSelectedRecommendation(null)} className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-fuchsia-900/30 text-fuchsia-300 text-xs font-bold rounded-full border border-fuchsia-500/30">{selectedRecommendation.category}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{selectedRecommendation.name}</h3>
                            
                            <div className="bg-gray-900/50 p-5 rounded-xl border border-white/5 mb-8">
                                <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Why it matches you</h4>
                                <p className="text-gray-300 leading-relaxed text-base">{selectedRecommendation.description}</p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a 
                                    href={selectedRecommendation.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex-1 flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-fuchsia-500/25"
                                >
                                    <span>Find Online</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                                <button 
                                    onClick={() => setSelectedRecommendation(null)} 
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3.5 rounded-xl transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveBeautyCoachPage;