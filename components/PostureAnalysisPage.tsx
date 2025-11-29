import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage, PostureAnalysisResult, CorrectiveExercise, HighlightShape } from '../types';
import { visualizePostureCorrection, generatePostureHighlights } from '../services/geminiService';

interface PostureAnalysisPageProps {
    onAnalyze: (imageBase64: string, mimeType: string, analysisType: 'posture' | 'squat') => void;
    isLoading: boolean;
    result: PostureAnalysisResult | null;
    isQuotaExhausted: boolean;
    handleApiError: (error: unknown) => string;
}

// URLs for sample images
const POSTURE_SAMPLE_URL = 'https://images.unsplash.com/photo-1599838634969-a88a45aa86a2?q=80&w=800&auto=format&fit=crop';
const SQUAT_SAMPLE_URL = 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop';


const PostureAnalysisPage: React.FC<PostureAnalysisPageProps> = ({ onAnalyze, isLoading, result, isQuotaExhausted, handleApiError }) => {
    const { language, t } = useLanguage();
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [analysisType, setAnalysisType] = useState<'posture' | 'squat'>('posture');
    const [sampleImage, setSampleImage] = useState(POSTURE_SAMPLE_URL);
    
    const [originalAnalysisImage, setOriginalAnalysisImage] = useState<{base64: string, mimeType: string} | null>(null);
    const [exercisesWithState, setExercisesWithState] = useState<CorrectiveExercise[]>([]);
    const [modalContent, setModalContent] = useState<{ original: string; generated: string; title: string; shapes: HighlightShape[] | null } | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        setSampleImage(analysisType === 'posture' ? POSTURE_SAMPLE_URL : SQUAT_SAMPLE_URL);
    }, [analysisType]);
    
    useEffect(() => {
        setExercisesWithState(result?.correctiveExercises.map(ex => ({...ex, isGenerating: false, generatedImageBase64: null, generationError: null })) || []);
    }, [result]);

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

    const startCamera = async () => {
        cleanupCamera();
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setIsCameraOn(true);
        } catch (err) {
            setCameraError(t('postureAnalysisPage.cameraError'));
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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (!context) return;
        
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        
        setOriginalAnalysisImage({ base64, mimeType: 'image/jpeg' });
        onAnalyze(base64, 'image/jpeg', analysisType);
    };
    
    const handleVisualize = async (exerciseIndex: number) => {
        if (!originalAnalysisImage || !result) return;

        const exercise = exercisesWithState[exerciseIndex];
        if (!exercise) return;

        // Step 1: Generate the corrected image
        setExercisesWithState(prev => {
            const newExercises = [...prev];
            newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], isGenerating: true, generationError: null, highlightShapes: null, isGeneratingHighlights: false };
            return newExercises;
        });

        let generatedBase64: string;
        try {
            generatedBase64 = await visualizePostureCorrection(
                originalAnalysisImage.base64,
                originalAnalysisImage.mimeType,
                result.summary,
                exercise.name,
                language
            );
            
            setExercisesWithState(prev => {
                const newExercises = [...prev];
                newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], isGenerating: false, generatedImageBase64: generatedBase64, isGeneratingHighlights: true };
                return newExercises;
            });
        } catch (err) {
            const msg = handleApiError(err);
            setExercisesWithState(prev => {
                const newExercises = [...prev];
                newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], isGenerating: false, generationError: t('postureAnalysisPage.visualizationError') };
                return newExercises;
            });
            return; // Stop if image generation fails
        }

        // Step 2: Generate the highlights
        try {
            const shapes = await generatePostureHighlights(
                originalAnalysisImage.base64,
                generatedBase64,
                originalAnalysisImage.mimeType,
                language
            );

            setExercisesWithState(prev => {
                const newExercises = [...prev];
                newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], isGeneratingHighlights: false, highlightShapes: shapes };
                return newExercises;
            });

            setModalContent({
                original: originalAnalysisImage.base64,
                generated: generatedBase64,
                title: exercise.name,
                shapes: shapes
            });

        } catch (err) {
            const msg = handleApiError(err);
            console.error("Highlight generation failed:", msg);
            // Fallback: Show the modal without highlights.
            setExercisesWithState(prev => {
                const newExercises = [...prev];
                newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], isGeneratingHighlights: false, highlightShapes: null };
                return newExercises;
            });
            setModalContent({
                original: originalAnalysisImage.base64,
                generated: generatedBase64,
                title: exercise.name,
                shapes: null
            });
        }
    };

    const severityStyles: Record<string, string> = {
        Low: 'bg-green-500/20 text-green-300',
        Medium: 'bg-yellow-500/20 text-yellow-300',
        High: 'bg-red-500/20 text-red-300',
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('postureAnalysisPage.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('postureAnalysisPage.subtitle')}</p>
            </div>

            <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column: Camera and Controls */}
                <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-center font-semibold text-gray-300 mb-2">{t('postureAnalysisPage.samplePose')}</h3>
                            <div className="relative aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                                <img src={sampleImage} alt="Sample pose" className="w-full h-full object-cover transition-opacity duration-500" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-center font-semibold text-gray-300 mb-2">{t('postureAnalysisPage.yourCamera')}</h3>
                            <div className="relative aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform -scale-x-100 ${isCameraOn ? 'block' : 'hidden'}`}></video>
                                {!isCameraOn && (
                                    <div className="text-center text-gray-500 p-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        <p className="mt-2 text-xs">{t('postureAnalysisPage.getStarted')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {cameraError && <p className="text-sm text-red-400 text-center">{cameraError}</p>}
                    
                    <button onClick={isCameraOn ? stopCamera : startCamera} className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors">
                        {isCameraOn ? t('postureAnalysisPage.stopCamera') : t('postureAnalysisPage.startCamera')}
                    </button>
                    
                    {isCameraOn && (
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">{t('postureAnalysisPage.analysisType')}</label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900/50 rounded-lg border border-gray-700">
                                    <button onClick={() => setAnalysisType('posture')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${analysisType === 'posture' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                                        {t('postureAnalysisPage.posture')}
                                    </button>
                                    <button onClick={() => setAnalysisType('squat')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${analysisType === 'squat' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                                        {t('postureAnalysisPage.squat')}
                                    </button>
                                </div>
                            </div>
                            <button onClick={handleAnalyze} disabled={isLoading || isQuotaExhausted} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                                {isLoading ? t('postureAnalysisPage.analyzing') : analysisType === 'posture' ? t('postureAnalysisPage.analyzePosture') : t('postureAnalysisPage.analyzeSquat')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column: Instructions and Results */}
                <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-white/10 min-h-[400px]">
                    <h2 className="text-2xl font-bold text-white mb-4">{isLoading || result ? t('postureAnalysisPage.resultsTitle') : t('postureAnalysisPage.instructionsTitle')}</h2>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
                            <p className="mt-4 text-gray-400">{t('postureAnalysisPage.analyzing')}</p>
                        </div>
                    ) : result ? (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="font-semibold text-teal-300 mb-2">{t('postureAnalysisPage.summary')}</h3>
                                <p className="text-sm text-gray-300 p-4 bg-gray-900/50 rounded-md border border-gray-700">{result.summary}</p>
                            </div>
                             <div>
                                <h3 className="font-semibold text-teal-300 mb-2">{t('postureAnalysisPage.keyObservations')}</h3>
                                <div className="space-y-3">
                                    {result.keyObservations.map(obs => (
                                        <div key={obs.observation} className="p-3 bg-gray-900/50 rounded-md">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-white">{obs.observation}</h4>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severityStyles[obs.severity]}`}>{t('postureAnalysisPage.severity')}: {obs.severity}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{obs.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-teal-300 mb-4">{t('postureAnalysisPage.correctiveExercises')}</h3>
                                <div className="overflow-x-auto bg-gray-900/50 rounded-lg border border-gray-700">
                                    <table className="min-w-full text-sm">
                                        <thead className="border-b border-gray-700">
                                            <tr className="text-left text-xs text-gray-200 uppercase font-bold tracking-wider">
                                                <th className="p-3">{t('assessment.report.exercise')}</th>
                                                <th className="p-3 text-center">{t('assessment.report.sets')}</th>
                                                <th className="p-3 text-center">{t('assessment.report.reps')}</th>
                                                <th className="p-3 text-center">{t('assessment.report.rest')}</th>
                                                <th className="p-3 text-center">{t('assessment.report.video')}</th>
                                                <th className="p-3 text-center">{t('postureAnalysisPage.visualizeCorrection')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {exercisesWithState.map((ex, index) => (
                                                <tr key={ex.name}>
                                                    <td className="p-3">
                                                        <p className="font-semibold text-white">{ex.name}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{ex.description}</p>
                                                    </td>
                                                    <td className="p-3 text-center font-mono font-medium text-teal-300">{ex.sets}</td>
                                                    <td className="p-3 text-center font-mono font-medium text-teal-300">{ex.reps}</td>
                                                    <td className="p-3 text-center font-mono font-medium text-teal-300">{ex.rest}</td>
                                                    <td className="p-3 text-center">
                                                        <a 
                                                            href={`https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(ex.name)}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            title={`Watch video for ${ex.name}`}
                                                            className="inline-block text-teal-300 hover:text-teal-100 transition-transform transform hover:scale-125"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                            </svg>
                                                        </a>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <button
                                                            onClick={() => handleVisualize(index)}
                                                            disabled={ex.isGenerating || ex.isGeneratingHighlights || isQuotaExhausted}
                                                            title={t('postureAnalysisPage.visualizeCorrection')}
                                                            className="p-2 rounded-full text-rose-300 bg-rose-800/70 hover:bg-rose-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            {ex.isGenerating || ex.isGeneratingHighlights ? (
                                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.046a1 1 0 01-1.28.962l-2.094-.7a1 1 0 01-.192-1.662l.533-.71a1 1 0 011.336 0l.903.602zM11.3 1.046l.903.602a1 1 0 001.336 0l.533-.71a1 1 0 00-.192-1.662l-2.094-.7a1 1 0 00-1.28.962V2a1 1 0 00.7.954zM10 7a1 1 0 011 1v1a1 1 0 11-2 0V8a1 1 0 011-1zm3.342 5.158a1 1 0 01-1.21.373l-.433-.217a1 1 0 01-.373-1.21l1.082-2.164a1 1 0 011.21-.373l.433.217a1 1 0 01.373 1.21l-1.082 2.164zM10 17a1 1 0 011 1v1.046a1 1 0 11-2 0V18a1 1 0 011-1zm-3.342-5.158a1 1 0 01-1.21-.373l-1.082-2.164a1 1 0 01.373-1.21l.433-.217a1 1 0 011.21.373l1.082 2.164a1 1 0 01-.373 1.21l-.433.217z" clipRule="evenodd" />
                                                                    <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        {ex.generationError && <p className="text-xs text-red-400 mt-1">{ex.generationError}</p>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 text-gray-300">
                             <ul className="space-y-3 text-sm">
                                {(t('postureAnalysisPage.instructions') as string[]).map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="font-bold text-teal-400 mr-2 rtl:ml-2 rtl:mr-0">{index + 1}.</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="text-center py-10 text-gray-500">
                                <p>{t('postureAnalysisPage.placeholder')}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {modalContent && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in" onClick={() => setModalContent(null)}>
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-700 m-4" onClick={e => e.stopPropagation()}>
                        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">{t('postureAnalysisPage.visualizationTitle')}: <span className="text-rose-300">{modalContent.title}</span></h3>
                            <button onClick={() => setModalContent(null)} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" aria-label={t('postureAnalysisPage.close')}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </header>
                        <main className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-center font-bold text-gray-300 mb-2">{t('postureAnalysisPage.before')}</h4>
                                <img src={`data:image/jpeg;base64,${modalContent.original}`} alt="Before correction" className="rounded-lg w-full aspect-[3/4] object-cover" />
                            </div>
                            <div>
                                <h4 className="text-center font-bold text-gray-300 mb-2">{t('postureAnalysisPage.after')}</h4>
                                <div className="relative">
                                    <img src={`data:image/png;base64,${modalContent.generated}`} alt="After correction" className="rounded-lg w-full aspect-[3/4] object-cover" />
                                    {modalContent.shapes && modalContent.shapes.length > 0 && (
                                        <svg
                                            viewBox="0 0 100 100"
                                            preserveAspectRatio="none"
                                            className="absolute inset-0 w-full h-full pointer-events-none"
                                        >
                                            {modalContent.shapes.map((shape, index) => {
                                                if (shape.type === 'circle') {
                                                    return (
                                                        <circle
                                                            key={index}
                                                            cx={shape.cx}
                                                            cy={shape.cy}
                                                            r={shape.r}
                                                            fill="none"
                                                            stroke="rgba(251, 113, 133, 0.9)"
                                                            strokeWidth="1"
                                                            className="animate-stroke-pulse"
                                                        />
                                                    );
                                                }
                                                if (shape.type === 'line') {
                                                    return (
                                                        <line
                                                            key={index}
                                                            x1={shape.x1}
                                                            y1={shape.y1}
                                                            x2={shape.x2}
                                                            y2={shape.y2}
                                                            stroke="rgba(20, 184, 166, 0.9)"
                                                            strokeWidth="1"
                                                            strokeDasharray="4 2"
                                                            className="line-draw"
                                                        />
                                                    );
                                                }
                                                return null;
                                            })}
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default PostureAnalysisPage;