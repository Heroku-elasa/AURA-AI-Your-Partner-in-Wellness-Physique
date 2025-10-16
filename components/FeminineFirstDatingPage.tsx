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
                <h3 className="text-2xl font-bold text-teal-300 mb-4 border-b-2 border-teal-800 pb-2">{t('assessment.report.workoutTitle')} ({analysis.workoutPlan.split})</h3>
                <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                    <div className="flex border-b border-gray-700 overflow-x-auto">
                        {analysis.workoutPlan.days.map(day => (
                            <button 
                                key={day.day}
                                onClick={() => setActiveDay(day.day)}
                                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${activeDay === day.day ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                {day.day}: {day.focus}
                            </button>
                        ))}
                    </div>
                    <div className="p-6">
                        {analysis.workoutPlan.days.filter(d => d.day === activeDay).map(day => (
                            <div key={day.day} className="space-y-4">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-xs text-gray-200 uppercase font-bold tracking-wider">
                                                <th className="p-2">{t('assessment.report.exercise')}</th>
                                                <th className="p-2 text-center">{t('assessment.report.sets')}</th>
                                                <th className="p-2 text-center">{t('assessment.report.reps')}</th>
                                                <th className="p-2 text-center">{t('assessment.report.rest')}</th>
                                                <th className="p-2 text-center">{t('assessment.report.video')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {day.exercises.map(ex => (
                                                <tr key={ex.name}>
                                                    <td className="p-2 font-semibold text-white">{ex.name}</td>
                                                    <td className="p-2 text-center font-mono font-medium text-teal-300">{ex.sets}</td>
                                                    <td className="p-2 text-center font-mono font-medium text-teal-300">{ex.reps}</td>
                                                    <td className="p-2 text-center font-mono font-medium text-teal-300">{ex.rest}</td>
                                                    <td className="p-2 text-center">
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
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
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
    setPage
}) => {
    const { language, t } = useLanguage();

    // Common State
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imageMimeType, setImageMimeType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<ComprehensiveBeautyResult | ComprehensiveFitnessResult | null>(null);
    
    // Skin-specific State
    const [symptoms, setSymptoms] = useState('');
    const [symptomDetails, setSymptomDetails] = useState<SymptomDetails>({ aggravatingFactors: '', alleviatingFactors: '', duration: '', previousTreatments: '', medications: '' });

    // Fitness-specific State
    const [fitnessData, setFitnessData] = useState<FitnessFormData>({ age: '', gender: 'male', height: '', weight: '', goal: 'muscleGain', experience: 'beginner', daysPerWeek: 3, dietaryPrefs: '' });
    
    // Fitness Simulator State
    const [simulatedWorkoutImage, setSimulatedWorkoutImage] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationDays, setSimulationDays] = useState(4);
    const [simulationIntensity, setSimulationIntensity] = useState(3); // 1-5 scale
    const [simulationError, setSimulationError] = useState<string|null>(null);
    const [isLoadingDefaultImage, setIsLoadingDefaultImage] = useState(false);


    useEffect(() => {
        if (consultationToRestore) {
            setImageBase64(consultationToRestore.imageBase64 || null);
            setImageMimeType(consultationToRestore.imageMimeType || null);
            setAnalysisResult(consultationToRestore.result);
            if (consultationToRestore.mode === 'skin' && mode === 'skin') {
                setSymptoms(consultationToRestore.symptoms || '');
                setSymptomDetails(consultationToRestore.symptomDetails || { aggravatingFactors: '', alleviatingFactors: '', duration: '', previousTreatments: '', medications: '' });
            } else if (consultationToRestore.mode === 'fitness' && mode === 'fitness') {
                setFitnessData(consultationToRestore.fitnessData || { age: '', gender: 'male', height: '', weight: '', goal: 'muscleGain', experience: 'beginner', daysPerWeek: 3, dietaryPrefs: '' });
            }
            setConsultationToRestore(null);
        }
    }, [consultationToRestore, setConsultationToRestore, mode]);


    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            if (mode === 'skin') {
                const result = await generateComprehensiveBeautyAnalysis(symptoms, symptomDetails, language, imageBase64, imageMimeType);
                if ('error' in result) {
                    setError(result.error);
                } else {
                    setAnalysisResult(result);
                }
            } else { // mode === 'fitness'
                const result = await generateComprehensiveFitnessAnalysis(fitnessData, language, imageBase64, imageMimeType);
                 if ('error' in result) {
                    setError(result.error);
                } else {
                    setAnalysisResult(result);
                }
            }
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCurrentPlan = () => {
        const name = prompt(`Enter a name for this ${mode} plan:`, `${mode.charAt(0).toUpperCase() + mode.slice(1)} Plan ${new Date().toLocaleDateString()}`);
        if (name && analysisResult) {
            const newPlan: SavedConsultation = {
                id: crypto.randomUUID(),
                name,
                timestamp: Date.now(),
                mode,
                symptoms: mode === 'skin' ? symptoms : undefined,
                symptomDetails: mode === 'skin' ? symptomDetails : undefined,
                fitnessData: mode === 'fitness' ? fitnessData : undefined,
                result: analysisResult,
                imageBase64: imageBase64,
                imageMimeType: imageMimeType
            };
            onSaveConsultation(newPlan);
        }
    };
    
    const handleSimulateWorkout = async () => {
        if (!imageBase64 || !imageMimeType) return;

        const fitnessResult = analysisResult as ComprehensiveFitnessResult | null;
        if (mode !== 'fitness' || !fitnessResult?.workoutPlan) {
            setSimulationError(t('assessment.workoutSimulator.planRequiredError'));
            return;
        }

        setIsSimulating(true);
        setSimulationError(null);
        try {
            const resultBase64 = await simulateWorkoutTransformation(
                imageBase64,
                imageMimeType,
                simulationDays,
                simulationIntensity,
                fitnessData.goal,
                fitnessData.gender,
                fitnessResult.workoutPlan
            );
            setSimulatedWorkoutImage(`data:${imageMimeType};base64,${resultBase64}`);
        } catch(err) {
            const msg = handleApiError(err);
            setSimulationError(msg);
        } finally {
            setIsSimulating(false);
        }
    };

    const handleUseDefaultImage = async (gender: 'male' | 'female') => {
        setIsLoadingDefaultImage(true);
        setError(null);
        // Royalty-free images suitable for a "before" fitness photo.
        const MALE_DEFAULT_URL = 'https://images.unsplash.com/photo-1548083424-33d856d1a58c?q=80&w=800&auto=format&fit=crop';
        const FEMALE_DEFAULT_URL = 'https://images.unsplash.com/photo-1577221084712-45b044c69818?q=80&w=800&auto=format&fit=crop';
        const url = gender === 'male' ? MALE_DEFAULT_URL : FEMALE_DEFAULT_URL;

        try {
            const { base64, mimeType } = await fetchImageAsBase64(url);
            setImageBase64(base64);
            setImageMimeType(mimeType);
            if (mode === 'fitness') {
                setFitnessData(prev => ({ ...prev, gender }));
            }
        } catch (err) {
            const msg = handleApiError(err);
            setError(msg);
        } finally {
            setIsLoadingDefaultImage(false);
        }
    };
    
    const pageTitle = mode === 'skin' ? t('assessment.skinTitle') : t('assessment.fitnessTitle');
    const pageSubtitle = mode === 'skin' ? t('assessment.skinSubtitle') : t('assessment.fitnessSubtitle');

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className={`text-4xl sm:text-5xl font-extrabold text-white tracking-tight`}>{pageTitle}</h1>
                <p className="mt-4 text-lg text-gray-300">{pageSubtitle}</p>
            </div>
            
            <div className="mt-12 max-w-4xl mx-auto">
                 {mode === 'skin' ? (
                     <ConsultationForm 
                        isLoading={isLoading}
                        isQuotaExhausted={isQuotaExhausted}
                        onAnalyze={handleAnalyze}
                        symptoms={symptoms}
                        setSymptoms={setSymptoms}
                        symptomDetails={symptomDetails}
                        setSymptomDetails={setSymptomDetails}
                        imageBase64={imageBase64}
                        setImageBase64={setImageBase64}
                        imageMimeType={imageMimeType}
                        setImageMimeType={setImageMimeType}
                    />
                 ) : (
                    <FitnessForm
                        isLoading={isLoading}
                        isQuotaExhausted={isQuotaExhausted}
                        onAnalyze={handleAnalyze}
                        fitnessData={fitnessData}
                        setFitnessData={setFitnessData}
                        imageBase64={imageBase64}
                        setImageBase64={setImageBase64}
                        imageMimeType={imageMimeType}
                        setImageMimeType={setImageMimeType}
                    />
                 )}
                 
                <div className="mt-8 bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-white/10">
                    {isLoading && (
                        <div className="flex items-center justify-center py-10">
                            <div className={`w-8 h-8 border-4 border-dashed rounded-full animate-spin ${mode === 'skin' ? 'border-rose-400' : 'border-teal-400'}`}></div>
                            <span className="ml-4 rtl:mr-4 rtl:ml-0 text-gray-400">{t('assessment.report.generating')}</span>
                        </div>
                    )}
                    {error && <div className="m-4 text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                    {!isLoading && !analysisResult && !error && (
                        <div className="text-center py-10 text-gray-500">
                            <p>{t('assessment.report.placeholder1')}</p>
                            <p className="text-sm">{t('assessment.report.placeholder2')}</p>
                        </div>
                    )}
                    
                    {analysisResult && mode === 'skin' && (
                        <AnalysisDisplay 
                            isLoading={isLoading}
                            error={error}
                            analysis={analysisResult as ComprehensiveBeautyResult}
                            onGetDeeperAnalysis={() => {}}
                            onGetAcademicAnalysis={() => {}}
                            onGenerateSummary={() => {}}
                            doctorSummary=""
                            isGeneratingSummary={false}
                            doctorSummaryError={null}
                            onFindSpecialists={() => {}}
                            onRequestResearch={() => {}}
                            onCalculateCosts={() => {}}
                            isCalculatingCosts={false}
                            costAnalysis={null}
                            costsError={null}
                            inputImage={imageBase64}
                        />
                    )}

                    {analysisResult && mode === 'fitness' && (
                        <div className="p-6 sm:p-8">
                            <FitnessReportDisplay analysis={analysisResult as ComprehensiveFitnessResult} />
                        </div>
                    )}
                </div>

                {mode === 'fitness' && analysisResult && (
                    <WorkoutSimulator
                        imageBase64={imageBase64}
                        imageMimeType={imageMimeType}
                        simulatedImageUrl={simulatedWorkoutImage}
                        isSimulating={isSimulating}
                        onSimulate={handleSimulateWorkout}
                        simulationDays={simulationDays}
                        setSimulationDays={setSimulationDays}
                        simulationIntensity={simulationIntensity}
                        setSimulationIntensity={setSimulationIntensity}
                        simulationError={simulationError}
                        isLoadingDefaultImage={isLoadingDefaultImage}
                        onUseDefaultImage={handleUseDefaultImage}
                    />
                )}

                {analysisResult && (
                    <div className="text-center mt-8">
                        <button
                            onClick={handleSaveCurrentPlan}
                            className={`px-8 py-3 text-white font-semibold rounded-md transition-all text-lg shadow-lg ${mode === 'skin' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-teal-600 hover:bg-teal-700'}`}
                        >
                            {t('assessment.saveButton')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- NEW FITNESS FORM COMPONENT ---
interface FitnessFormProps {
  onAnalyze: () => void;
  isLoading: boolean;
  isQuotaExhausted: boolean;
  fitnessData: FitnessFormData;
  setFitnessData: (value: React.SetStateAction<FitnessFormData>) => void;
  imageBase64: string | null;
  setImageBase64: (value: React.SetStateAction<string | null>) => void;
  imageMimeType: string | null;
  setImageMimeType: (value: React.SetStateAction<string | null>) => void;
}
const FitnessForm: React.FC<FitnessFormProps> = ({ onAnalyze, isLoading, isQuotaExhausted, fitnessData, setFitnessData, imageBase64, setImageBase64, imageMimeType, setImageMimeType }) => {
    const { t } = useLanguage();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const cameraInputRef = React.useRef<HTMLInputElement>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFitnessData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = (event.target?.result as string).split(',')[1];
                setImageBase64(base64String);
                setImageMimeType(file.type);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveImage = () => {
        setImageBase64(null);
        setImageMimeType(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!fitnessData.age || !fitnessData.height || !fitnessData.weight) {
            alert(t('assessment.form.fitnessValidationError'));
            return;
        }
        onAnalyze();
    };
    
    const PresetButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
        <button
            type="button"
            onClick={onClick}
            className="px-3 py-1 bg-gray-600/50 text-gray-300 text-xs font-medium rounded-full hover:bg-gray-600 hover:text-white transition-colors"
        >
            {children}
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-8">
            {/* Stats Section */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">{t('assessment.form.statsTitle')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
                    <div>
                        <label className="text-sm text-gray-400">{t('assessment.form.ageLabel')}</label>
                        <input type="text" inputMode="numeric" name="age" value={fitnessData.age} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md text-white mt-1" required />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(t('assessment.form.presets.age') as string[]).map(p => <PresetButton key={p} onClick={() => setFitnessData(f => ({...f, age: p}))}>{p}</PresetButton>)}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">{t('assessment.form.genderLabel')}</label>
                        <select name="gender" value={fitnessData.gender} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md text-white mt-1" required>
                            <option value="male">{t('assessment.form.genders.male')}</option>
                            <option value="female">{t('assessment.form.genders.female')}</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">{t('assessment.form.heightLabel')}</label>
                        <input type="text" inputMode="numeric" name="height" value={fitnessData.height} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md text-white mt-1" required/>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(t('assessment.form.presets.height') as string[]).map(p => <PresetButton key={p} onClick={() => setFitnessData(f => ({...f, height: p}))}>{p}</PresetButton>)}
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">{t('assessment.form.weightLabel')}</label>
                        <input type="text" inputMode="numeric" name="weight" value={fitnessData.weight} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md text-white mt-1" required/>
                         <div className="flex flex-wrap gap-2 mt-2">
                            {(t('assessment.form.presets.weight') as string[]).map(p => <PresetButton key={p} onClick={() => setFitnessData(f => ({...f, weight: p}))}>{p}</PresetButton>)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Goals Section */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">{t('assessment.form.goalsTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="text-sm text-gray-400">{t('assessment.form.goalLabel')}</label>
                        <select name="goal" value={fitnessData.goal} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md text-white mt-1" required>
                           {Object.entries(t('assessment.form.goals')).map(([key, value]) => <option key={key} value={key}>{value as string}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">{t('assessment.form.experienceLabel')}</label>
                        <select name="experience" value={fitnessData.experience} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md text-white mt-1" required>
                           {Object.entries(t('assessment.form.experiences')).map(([key, value]) => <option key={key} value={key}>{value as string}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="mt-4">
                    <label className="text-sm text-gray-400 block mb-2">{t('assessment.form.daysLabel')}: <span className="font-bold text-white">{fitnessData.daysPerWeek}</span></label>
                    <input type="range" name="daysPerWeek" min="1" max="7" value={fitnessData.daysPerWeek} onChange={(e) => setFitnessData(p => ({...p, daysPerWeek: Number(e.target.value)}))} className="w-full accent-teal-500" />
                </div>
                 <div className="mt-4">
                    <label className="text-sm text-gray-400">{t('assessment.form.dietLabel')}</label>
                    <textarea name="dietaryPrefs" value={fitnessData.dietaryPrefs} onChange={handleChange} rows={2} placeholder={t('assessment.form.dietPlaceholder')} className="w-full bg-gray-700 p-2 rounded-md text-white mt-1"></textarea>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {(t('assessment.form.presets.diet') as string[]).map(p => <PresetButton key={p} onClick={() => setFitnessData(f => ({...f, dietaryPrefs: p}))}>{p}</PresetButton>)}
                    </div>
                </div>
            </div>

            {/* Image Uploader */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">{t('assessment.form.uploadImageTitle')}</h3>
                {imageBase64 ? (
                    <div className="relative group max-w-sm mx-auto">
                        <img src={`data:${imageMimeType};base64,${imageBase64}`} alt="User submission" className="rounded-lg w-full shadow-lg" />
                        <button onClick={handleRemoveImage} type="button" className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-red-600" title={t('assessment.form.removeImage')}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                         <input type="file" accept="image/*" capture="user" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
                         <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700/80 rounded-md hover:bg-gray-600 transition-colors">{t('assessment.form.uploadButton')}</button>
                         <button type="button" onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700/80 rounded-md hover:bg-gray-600 transition-colors">{t('assessment.form.cameraButton')}</button>
                    </div>
                )}
            </div>

            <button type="submit" disabled={isLoading || isQuotaExhausted} className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-500 transition-colors">
                 {isLoading ? t('assessment.report.generating') : isQuotaExhausted ? t('quotaErrorModal.title') : t('assessment.form.fitnessButtonText')}
            </button>
        </form>
    );
};

interface WorkoutSimulatorProps {
    imageBase64: string | null;
    imageMimeType: string | null;
    simulatedImageUrl: string | null;
    isSimulating: boolean;
    onSimulate: () => void;
    simulationDays: number;
    setSimulationDays: (days: number) => void;
    simulationIntensity: number;
    setSimulationIntensity: (intensity: number) => void;
    simulationError: string | null;
    isLoadingDefaultImage: boolean;
    onUseDefaultImage: (gender: 'male' | 'female') => void;
}

const WorkoutSimulator: React.FC<WorkoutSimulatorProps> = ({ imageBase64, imageMimeType, simulatedImageUrl, isSimulating, onSimulate, simulationDays, setSimulationDays, simulationIntensity, setSimulationIntensity, simulationError, isLoadingDefaultImage, onUseDefaultImage }) => {
    const { t } = useLanguage();
    const intensityLevels = t('assessment.workoutSimulator.intensityLevels');

    return (
        <div className="mt-8 bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-center text-white">{t('assessment.workoutSimulator.title')}</h2>
            <p className="text-center text-gray-400 mt-2 text-sm">{t('assessment.workoutSimulator.subtitle')}</p>
            
            {!imageBase64 ? (
                <div className="text-center mt-8 text-yellow-400 bg-yellow-900/30 p-6 rounded-md">
                    <p className="mb-4">{t('assessment.workoutSimulator.uploadPrompt')}</p>
                    {isLoadingDefaultImage ? (
                        <div className="flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>
                            <span className="ml-3 rtl:mr-3 rtl:ml-0">{t('assessment.workoutSimulator.loadingDefault')}</span>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => onUseDefaultImage('male')}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors"
                            >
                                {t('assessment.workoutSimulator.useMaleDefault')}
                            </button>
                            <button
                                onClick={() => onUseDefaultImage('female')}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors"
                            >
                                {t('assessment.workoutSimulator.useFemaleDefault')}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
              <>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-center font-bold text-gray-300 mb-2">{t('assessment.workoutSimulator.before')}</h3>
                    <div className="aspect-[3/4] bg-gray-900/50 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                        <img src={`data:${imageMimeType};base64,${imageBase64}`} alt="Before" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-center font-bold text-gray-300 mb-2">{t('assessment.workoutSimulator.after')}</h3>
                    <div className="aspect-[3/4] bg-gray-900/50 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden">
                        <img src={simulatedImageUrl || `data:${imageMimeType};base64,${imageBase64}`} alt="After" className="w-full h-full object-cover" />
                        {isSimulating && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-10">
                                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
                                <p className="mt-4 text-sm">{t('assessment.workoutSimulator.simulating')}</p>
                            </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 max-w-md mx-auto space-y-6">
                  <div>
                    <label htmlFor="sim-days" className="block text-sm font-medium text-gray-300 mb-2">{t('assessment.workoutSimulator.daysLabel')}: <span className="font-bold text-white">{simulationDays}</span></label>
                    <input id="sim-days" type="range" min="1" max="7" step="1" value={simulationDays} onChange={(e) => setSimulationDays(Number(e.target.value))} className="w-full accent-teal-500" />
                  </div>
                  <div>
                    <label htmlFor="sim-intensity" className="block text-sm font-medium text-gray-300 mb-2">{t('assessment.workoutSimulator.intensityLabel')}: <span className="font-bold text-white">{intensityLevels[simulationIntensity]}</span></label>
                    <input id="sim-intensity" type="range" min="1" max="5" step="1" value={simulationIntensity} onChange={(e) => setSimulationIntensity(Number(e.target.value))} className="w-full accent-teal-500" />
                  </div>
                  {simulationError && <p className="text-red-400 bg-red-900/30 p-3 rounded-md text-sm text-center">{simulationError}</p>}
                  <button onClick={onSimulate} disabled={isSimulating} className="w-full py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors disabled:bg-gray-500">
                    {isSimulating ? t('assessment.workoutSimulator.simulating') : t('assessment.workoutSimulator.simulateButton')}
                  </button>
                </div>
              </>
            )}
        </div>
    );
};


export default AIAssessmentPage;