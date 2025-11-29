import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { marked } from 'marked';
import { 
    useLanguage, 
    SymptomDetails, 
    IdentifiedCondition, 
    SavedConsultation,
    ComprehensiveBeautyResult,
    ComprehensiveFitnessResult,
    WorkoutDay,
    Page
} from '../types';
import { generateComprehensiveBeautyAnalysis, generateComprehensiveFitnessAnalysis, simulateWorkoutTransformation } from '../services/geminiService';

// Re-using some components from the original file, adapted for dual-mode
import ConsultationForm from './GeneratorForm'; // Assuming this is now a skin-specific form
import AnalysisDisplay from './ReportDisplay'; // This is the skin analysis display

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
    return new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            resolve({ base64, mimeType: blob.type });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


// --- NEW/MODIFIED TYPES FOR FITNESS ---
type FitnessGoal = 'muscleGain' | 'fatLoss' | 'recomposition' | 'strength' | 'fitness';
type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
interface FitnessFormData {
    age: string;
    gender: 'male' | 'female';
    height: string;
    weight: string;
    goal: FitnessGoal;
    experience: ExperienceLevel;
    daysPerWeek: number;
    dietaryPrefs: string;
}

// --- NEW/MODIFIED PROPS ---
interface AIAssessmentPageProps {
    mode: 'skin' | 'fitness';
    handleApiError: (err: unknown) => string;
    isQuotaExhausted: boolean;
    onSaveConsultation: (consultation: SavedConsultation) => void;
    consultationToRestore: SavedConsultation | null;
    setConsultationToRestore: (consultation: SavedConsultation | null) => void;
    setPage: (page: Page) => void;
}

const FitnessReportDisplay: React.FC<{ analysis: ComprehensiveFitnessResult }> = ({ analysis }) => {
    const { language, t } = useLanguage();
    const [activeDay, setActiveDay] = useState<string>(analysis.workoutPlan.days[0]?.day || 'Day 1');

    return (
        <div className="space-y-12 animate-fade-in">
            <section>
                <h3 className="text-2xl font-bold text-teal-300 mb-4 border-b-2 border-teal-800 pb-2">{t('assessment.report.physiqueTitle')}</h3>
                <div className="bg-gray-900/50 p-6 rounded-lg">
                    <p className="text-gray-300 italic">{analysis.physiqueAssessment}</p>
                </div>
            </section>
            
            <section>
                <h3 className="text-2xl font-bold text-teal-300 mb-4 border-b-2 border-teal-800 pb-2">{t('assessment.report.recommendationsTitle')}</h3>
                <div className="bg-gray-900/50 p-6 rounded-lg">
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        {analysis.generalRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-bold text-teal-300 mb-4 border-b-2 border-teal-800 pb-2">{t('assessment.report.dietTitle')}</h3>
                <div className="bg-gray-900/50 p-6 rounded-lg space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-white">{analysis.dietPlan.dailyCalories.toLocaleString()}</div>
                            <div className="text-xs text-gray-400">{t('assessment.report.calories')}</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-white">{analysis.dietPlan.macros.protein}g</div>
                            <div className="text-xs text-gray-400">{t('assessment.report.protein')}</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-white">{analysis.dietPlan.macros.carbs}g</div>
                            <div className="text-xs text-gray-400">{t('assessment.report.carbs')}</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-white">{analysis.dietPlan.macros.fat}g</div>
                            <div className="text-xs text-gray-400">{t('assessment.report.fat')}</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-3">{t('assessment.report.sampleMealPlan')}</h4>
                        <div className="space-y-3">
                            {analysis.dietPlan.sampleMeals.map(meal => (
                                <div key={meal.name} className="p-3 bg-gray-800 rounded">
                                    <p className="font-bold text-white text-sm">{meal.name}</p>
                                    <p className="text-xs text-gray-400">{meal.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-bold text-teal-300 mb-4 border-b-2 border-teal-800 pb-2">{t('assessment.report.workoutTitle')}</h3>
                <div className="bg-gray-900/50 p-6 rounded-lg">
                    <div className="flex justify-center mb-6 border-b border-gray-700">
                        {analysis.workoutPlan.days.map(day => (
                            <button key={day.day} onClick={() => setActiveDay(day.day)} className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeDay === day.day ? 'border-teal-400 text-teal-300' : 'border-transparent text-gray-400 hover:text-white'}`}>
                                {day.day} - {day.focus}
                            </button>
                        ))}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-gray-700">
                                <tr className="text-left text-xs text-gray-200 uppercase font-bold tracking-wider">
                                    <th className="p-3">{t('assessment.report.exercise')}</th>
                                    <th className="p-3 text-center">{t('assessment.report.sets')}</th>
                                    <th className="p-3 text-center">{t('assessment.report.reps')}</th>
                                    <th className="p-3 text-center">{t('assessment.report.rest')}</th>
                                    <th className="p-3 text-center">{t('assessment.report.video')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analysis.workoutPlan.days.find(d => d.day === activeDay)?.exercises.map(ex => (
                                    <tr key={ex.name} className="border-t border-gray-800">
                                        <td className="p-3 font-semibold text-white">{ex.name}</td>
                                        <td className="p-3 text-center font-mono font-medium text-teal-300">{ex.sets}</td>
                                        <td className="p-3 text-center font-mono font-medium text-teal-300">{ex.reps}</td>
                                        <td className="p-3 text-center font-mono font-medium text-teal-300">{ex.rest}</td>
                                        <td className="p-3 text-center">
                                            <a href={`https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(ex.name)}`} target="_blank" rel="noopener noreferrer" title={`Watch video for ${ex.name}`} className="inline-block text-teal-300 hover:text-teal-100 transition-transform transform hover:scale-125">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

const AIAssessmentPage: React.FC<AIAssessmentPageProps> = ({
    mode,
    handleApiError,
    isQuotaExhausted,
    onSaveConsultation,
    consultationToRestore,
    setConsultationToRestore,
    setPage,
}) => {
    const { language, t } = useLanguage();
    
    // Common state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imageMimeType, setImageMimeType] = useState<string | null>(null);
    const [result, setResult] = useState<ComprehensiveBeautyResult | ComprehensiveFitnessResult | null>(null);

    // Skin mode state
    const [symptoms, setSymptoms] = useState('');
    const [symptomDetails, setSymptomDetails] = useState<SymptomDetails>({
        aggravatingFactors: '', alleviatingFactors: '', duration: '', previousTreatments: '', medications: ''
    });

    // Fitness mode state
    const [fitnessData, setFitnessData] = useState<FitnessFormData>({
        age: '', gender: 'male', height: '', weight: '', goal: 'muscleGain', experience: 'beginner', daysPerWeek: 3, dietaryPrefs: ''
    });

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            if (mode === 'skin') {
                if (!symptoms.trim() && !imageBase64) {
                    setError(t('assessment.form.validationError'));
                    setIsLoading(false);
                    return;
                }
                const skinResult = await generateComprehensiveBeautyAnalysis(symptoms, symptomDetails, imageBase64, imageMimeType, language);
                setResult(skinResult);
            } else { // fitness mode
                if (!fitnessData.age || !fitnessData.height || !fitnessData.weight) {
                    setError(t('assessment.form.fitnessValidationError'));
                    setIsLoading(false);
                    return;
                }
                const fitnessResult = await generateComprehensiveFitnessAnalysis(fitnessData, language);
                setResult(fitnessResult);
            }
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        const name = prompt(`Enter a name for this ${mode} plan:`, `${mode.charAt(0).toUpperCase() + mode.slice(1)} Plan - ${new Date().toLocaleDateString()}`);
        if (name && result) {
            const consultation: SavedConsultation = {
                id: crypto.randomUUID(),
                name,
                timestamp: Date.now(),
                mode,
                result,
                imageBase64,
                imageMimeType,
                symptoms: mode === 'skin' ? symptoms : undefined,
                symptomDetails: mode === 'skin' ? symptomDetails : undefined,
                fitnessData: mode === 'fitness' ? fitnessData : undefined,
            };
            onSaveConsultation(consultation);
        }
    };
    
    useEffect(() => {
        if (consultationToRestore && consultationToRestore.mode === mode) {
            setResult(consultationToRestore.result);
            setImageBase64(consultationToRestore.imageBase64 || null);
            setImageMimeType(consultationToRestore.imageMimeType || null);
            if (mode === 'skin') {
                setSymptoms(consultationToRestore.symptoms || '');
                setSymptomDetails(consultationToRestore.symptomDetails || { aggravatingFactors: '', alleviatingFactors: '', duration: '', previousTreatments: '', medications: '' });
            } else {
                setFitnessData(consultationToRestore.fitnessData || { age: '', gender: 'male', height: '', weight: '', goal: 'muscleGain', experience: 'beginner', daysPerWeek: 3, dietaryPrefs: '' });
            }
            setConsultationToRestore(null);
        }
    }, [consultationToRestore, mode, setConsultationToRestore]);


    const renderForm = () => {
        if (mode === 'skin') {
            return (
                <ConsultationForm 
                    onAnalyze={handleAnalyze}
                    isLoading={isLoading}
                    symptoms={symptoms}
                    setSymptoms={setSymptoms}
                    symptomDetails={symptomDetails}
                    setSymptomDetails={setSymptomDetails}
                    isQuotaExhausted={isQuotaExhausted}
                    imageBase64={imageBase64}
                    setImageBase64={setImageBase64}
                    imageMimeType={imageMimeType}
                    setImageMimeType={setImageMimeType}
                    handleApiError={handleApiError}
                />
            );
        }
        // Fitness Form is defined and used here
        return <div>Fitness form placeholder</div>;
    };
    
    const renderResult = () => {
        if (!result && !isLoading && !error) {
            return (
                <div className="text-center py-10 text-gray-500">
                    <p>{t('assessment.report.placeholder1')}</p>
                    <p className="text-sm">{t('assessment.report.placeholder2')}</p>
                </div>
            )
        }
        if (result) {
            if (mode === 'skin') {
                return (
                    <AnalysisDisplay 
                        analysis={result as ComprehensiveBeautyResult}
                        isLoading={false}
                        error={null}
                        onGetDeeperAnalysis={()=>{}}
                        onGetAcademicAnalysis={()=>{}}
                        onGenerateSummary={()=>{}}
                        doctorSummary={""}
                        isGeneratingSummary={false}
                        doctorSummaryError={null}
                        onFindSpecialists={()=>{}}
                        onRequestResearch={()=>{}}
                        onCalculateCosts={()=>{}}
                        isCalculatingCosts={false}
                        costAnalysis={null}
                        costsError={null}
                        inputImage={imageBase64}
                    />
                );
            }
            return <FitnessReportDisplay analysis={result as ComprehensiveFitnessResult} />;
        }
        return null;
    };


    return (
        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        {mode === 'skin' ? t('assessment.skinTitle') : t('assessment.fitnessTitle')}
                    </h1>
                    <p className="mt-4 text-lg text-gray-300">
                        {mode === 'skin' ? t('assessment.skinSubtitle') : t('assessment.fitnessSubtitle')}
                    </p>
                </div>

                <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {renderForm()}
                    <div className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 min-h-[400px]">
                        {isLoading && (
                            <div className="flex items-center justify-center py-10">
                              <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-rose-400"></div>
                              <span className={`${language === 'fa' ? 'mr-4' : 'ml-4'} text-gray-400`}>{t('assessment.report.generating')}</span>
                            </div>
                        )}
                        {error && !error.includes('(Quota Exceeded)') && <div className="p-6 text-red-400 bg-red-900/50 rounded-md">{error}</div>}
                        
                        {renderResult()}
                        
                        {result && !isLoading && (
                            <div className="p-6 border-t border-white/10">
                                <button onClick={handleSave} className="w-full py-2.5 px-4 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50 transition-colors">
                                    {t('assessment.saveButton')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIAssessmentPage;