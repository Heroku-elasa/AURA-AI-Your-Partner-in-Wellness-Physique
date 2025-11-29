import React, { useState, useEffect, useRef } from 'react';
import { ConversationCoachState, Goal, Message, useLanguage, TrainingPath, TrainingScenario, Difficulty } from '../types';
import { TRAINING_PATHS } from '../constants';

interface ConversationCoachProps {
  state: ConversationCoachState;
  setState: React.Dispatch<React.SetStateAction<ConversationCoachState>>;
  onSendMessage: (message: string) => void;
  onEndSession: () => void;
  onStartPractice: (goal: Goal) => void;
  onNextPractice: () => void;
  onReset: (isEndingScenario?: boolean) => void;
  onFullReset: () => void;
  activePath: TrainingPath | null;
  activeScenario: TrainingScenario | null;
  onStartTrainingPath: (path: TrainingPath) => void;
  onStartScenario: (scenario: TrainingScenario, difficulty: Difficulty) => void;
  onExitTraining: () => void;
}

const partnerOptions = [
  { id: 'supportive', name: 'همراه و همدل', en: 'Supportive & Empathetic' },
  { id: 'direct', name: 'رک و منطقی', en: 'Direct & Logical' },
  { id: 'playful', name: 'شوخ و پرانرژی', en: 'Playful & Witty' },
  { id: 'reserved', name: 'متفکر و آرام', en: 'Thoughtful & Reserved' },
];

const ConversationCoach: React.FC<ConversationCoachProps> = ({
  state,
  setState,
  onSendMessage,
  onEndSession,
  onStartPractice,
  onNextPractice,
  onReset,
  onFullReset,
  activePath,
  activeScenario,
  onStartTrainingPath,
  onStartScenario,
  onExitTraining
}) => {
  const { language, t } = useLanguage();
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [difficultyModalScenario, setDifficultyModalScenario] = useState<TrainingScenario | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatHistory]);
  
  const handleSend = () => {
    if (userInput.trim()) {
      onSendMessage(userInput);
      setUserInput('');
    }
  };

  const renderMessage = (msg: Message, index: number) => (
    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xl lg:max-w-2xl px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-rose-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.parts[0].text}</p>
      </div>
    </div>
  );
  
  const renderPathSelection = () => (
    <div className="bg-gray-800/50 rounded-lg p-6 sm:p-8 shadow-lg backdrop-blur-sm border border-white/10 animate-fade-in">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{t('coach.trainingPathsTitle')}</h2>
            <p className="mt-2 text-gray-400 max-w-2xl mx-auto">{t('coach.trainingPathsSubtitle')}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRAINING_PATHS.map(path => (
                <div key={path.id} className="bg-gray-900/50 p-6 rounded-lg border border-white/10 flex flex-col items-center text-center">
                    <h3 className="text-xl font-semibold text-rose-300">{path.title[language]}</h3>
                    <p className="text-sm text-gray-400 mt-2 flex-grow">{path.description[language]}</p>
                    <button
                        onClick={() => onStartTrainingPath(path)}
                        className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-rose-500"
                    >
                        {t('coach.startPathButton')}
                    </button>
                </div>
            ))}
        </div>
    </div>
  );

  const renderActivePath = () => {
    if (!activePath) return null;
    return (
        <div className="bg-gray-800/50 rounded-lg p-6 sm:p-8 shadow-lg backdrop-blur-sm border border-white/10 animate-fade-in">
             <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-white">{activePath.title[language]}</h2>
                    <p className="mt-1 text-gray-400">{activePath.description[language]}</p>
                </div>
                <button onClick={onExitTraining} className="text-sm text-gray-400 hover:text-white">&times; {t('coach.exitTraining')}</button>
            </div>
            <div className="mt-8 space-y-4">
                {activePath.scenarios.map((scenario) => {
                    const completions = state.completedScenarios[scenario.id] || [];
                    const easyCompleted = completions.includes('easy');
                    const hardCompleted = completions.includes('hard');
                    
                    return (
                        <div key={scenario.id} className="bg-gray-900/50 p-4 rounded-lg border border-white/10 flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <h4 className="font-semibold text-white">{scenario.title[language]}</h4>
                                <p className="text-xs text-gray-400 mt-1">{scenario.description[language]}</p>
                                
                                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/15">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                                        easyCompleted 
                                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                                            : 'bg-gray-700/50 text-gray-400 border-gray-600'
                                    }`}>
                                        {easyCompleted ? '✓ ' : ''}{t('coach.easy')}
                                    </span>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                                        hardCompleted 
                                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                                            : 'bg-gray-700/50 text-gray-400 border-gray-600'
                                    }`}>
                                        {hardCompleted ? '✓ ' : ''}{t('coach.hard')}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setDifficultyModalScenario(scenario)}
                                className="self-center px-4 py-2 bg-rose-600 text-white font-semibold rounded-md hover:bg-rose-700 transition-colors text-sm shadow-lg flex-shrink-0"
                            >
                                {t('coach.practiceButton')}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };
  
  const renderAnalysis = () => (
    <div className="p-6 bg-gray-900/50 rounded-lg border border-white/10 animate-fade-in">
        {state.isLoadingAnalysis ? (
             <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-rose-400"></div>
                <p className="mt-4 text-gray-400">{t('coach.analyzing')}</p>
             </div>
        ) : state.currentAnalysis ? (
            <div className="space-y-6">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-fuchsia-500">
                        {state.activeGoal ? `${t('coach.goalAnalysisTitle')}: ${state.activeGoal.title}` : t('coach.analysisTitle')}
                    </h3>
                </div>
                
                {/* Scores */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {/* FIX: The value from Object.entries can be inferred as 'unknown'. Cast to number and filter out zero/negative scores. */}
                    {Object.entries(state.currentAnalysis.scores).filter(([, value]) => (value as number) > 0).map(([key, value]) => (
                        <div key={key} className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-rose-400">{value as number}</div>
                            <div className="text-sm text-gray-400 capitalize">{t(`coach.scores.${key}`)}</div>
                        </div>
                    ))}
                </div>

                {/* Strengths & Improvements */}
                <div>
                    <h4 className="font-semibold text-green-400 mb-2">{t('coach.strengths')}</h4>
                    <p className="text-sm text-gray-300 bg-green-900/30 p-3 rounded-md">{state.currentAnalysis.strengths}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">{t('coach.improvements')}</h4>
                    <p className="text-sm text-gray-300 bg-yellow-900/30 p-3 rounded-md">{state.currentAnalysis.areasForImprovement}</p>
                </div>

                {/* Path Suggestions */}
                {state.pathSuggestions && state.pathSuggestions.length > 0 && !state.activeGoal && (
                    <div className="pt-4 border-t border-white/10">
                        <h4 className="font-semibold text-purple-300 mb-3">{t('coach.pathSuggestionTitle')}</h4>
                        <div className="space-y-4">
                        {state.pathSuggestions.map(suggestion => {
                            const path = TRAINING_PATHS.find(p => p.id === suggestion.pathId);
                            if (!path) return null;
                            return (
                                <div key={suggestion.pathId} className="bg-purple-900/30 p-4 rounded-lg">
                                    <h5 className="font-bold text-white">{path.title[language]}</h5>
                                    <p className="text-sm text-purple-200/80 mt-1 mb-3">{suggestion.reasoning}</p>
                                    <button
                                        onClick={() => onStartTrainingPath(path)}
                                        className="text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
                                    >
                                        {t('coach.startThisPath')}
                                    </button>
                                </div>
                            );
                        })}
                        </div>
                    </div>
                )}


                {/* Goal Practice Controls */}
                {state.activeGoal ? (
                    state.practiceCount < state.activeGoal.maxPractices - 1 ? (
                        <div className="flex gap-4">
                            <button onClick={onNextPractice} className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700">{t('coach.nextPractice')}</button>
                            <button onClick={() => onReset()} className="w-full py-2 px-4 rounded-md text-sm font-medium text-gray-200 bg-gray-600 hover:bg-gray-500">{t('coach.endPractice')}</button>
                        </div>
                    ) : (
                        <button onClick={() => onReset()} className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700">{t('coach.finishAndReview')}</button>
                    )
                ) : (
                  activeScenario 
                    ? <button onClick={() => onReset(true)} className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700">{t('coach.endScenarioButton')}</button>
                    : <button onClick={() => onReset()} className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700">{t('coach.startNewChat')}</button>
                )}
            </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>{t('coach.analysisPlaceholder')}</p>
          </div>
        )}
    </div>
  );

  const renderChatInterface = () => (
    <>
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {state.chatHistory.map(renderMessage)}
        {state.isStreaming && state.chatHistory[state.chatHistory.length - 1]?.role === 'model' && (
            <div className="flex justify-start">
                <div className="max-w-xl lg:max-w-2xl px-4 py-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                   <span className="inline-block w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
                </div>
            </div>
        )}
        <div ref={chatEndRef}></div>
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center bg-gray-700 rounded-lg">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={t('coach.messagePlaceholder')}
            className="w-full bg-transparent p-3 text-gray-200 placeholder-gray-400 focus:outline-none resize-none"
            rows={1}
            disabled={state.isStreaming}
          />
          <button onClick={handleSend} disabled={state.isStreaming || !userInput.trim()} className="p-3 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    if (state.showPathSelectionScreen) return renderPathSelection();
    if (activePath && !activeScenario) return renderActivePath();
    if (state.currentAnalysis || state.isLoadingAnalysis) return renderAnalysis();
    return renderChatInterface();
  }

  return (
    <section id="dating-simulator" className="py-12 sm:py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">{t('datingSimulator.title')}</h2>
        <p className="mt-2 text-gray-400 max-w-2xl mx-auto">{t('datingSimulator.subtitle')}</p>
        <div className="mt-4 flex justify-center items-center gap-4">
            <button onClick={() => setState(prev => ({ ...prev, showPathSelectionScreen: true, activeTrainingPathId: null, activeScenarioId: null }))} className="text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors">
              {t('coach.explorePaths')}
            </button>
            <span className="text-gray-600">|</span>
            <button onClick={onFullReset} className="text-sm font-semibold text-gray-500 hover:text-red-400 transition-colors">
                {t('coach.fullReset')}
            </button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 flex flex-col min-h-[70vh]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
            <div>
              <label htmlFor="partner-select" className="text-sm font-medium text-gray-300 mr-2">{t('coach.partnerSelectLabel')}</label>
              <select
                id="partner-select"
                value={state.selectedPartnerId || ''}
                onChange={(e) => setState(prev => ({...prev, selectedPartnerId: e.target.value}))}
                className="bg-gray-700 border-gray-600 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white"
                disabled={!!activeScenario}
              >
                {partnerOptions.map(p => <option key={p.id} value={p.id}>{language === 'fa' ? p.name : p.en}</option>)}
              </select>
            </div>
            {activeScenario && (
              <div className="bg-purple-900/50 text-purple-200 text-xs font-semibold px-3 py-1.5 rounded-full text-center">
                {t('coach.trainingMode')}: {activeScenario.title[language]} ({state.activeDifficulty === 'easy' ? t('coach.easy') : t('coach.hard')})
              </div>
            )}
            {!state.currentAnalysis && !state.isLoadingAnalysis && state.chatHistory.length > 1 && (
              <button onClick={onEndSession} className="px-4 py-2 bg-yellow-600/80 hover:bg-yellow-600 text-white text-sm font-semibold rounded-md transition-colors">
                  {t('coach.endSessionButton')}
              </button>
            )}
        </div>
        
        {state.error && <div className="m-4 text-red-400 p-3 bg-red-900/50 rounded-md text-sm">{state.error}</div>}
        
        {renderContent()}

        {difficultyModalScenario && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" onClick={() => setDifficultyModalScenario(null)}>
                <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 border border-white/20" onClick={e => e.stopPropagation()}>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('coach.difficultyTitle')}</h3>
                    <p className="text-sm text-gray-400 mb-6">{difficultyModalScenario.title[language]}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Easy Mode */}
                        <div className="border border-blue-500/50 rounded-lg p-4 text-center flex flex-col">
                            <h4 className="font-bold text-blue-300">{t('coach.easy')}</h4>
                            <p className="text-xs text-gray-400 mt-2 flex-grow">{t('coach.easyReward')}: {difficultyModalScenario.easy.reward[language]}</p>
                            <button onClick={() => { onStartScenario(difficultyModalScenario, 'easy'); setDifficultyModalScenario(null); }} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md">
                                {t('coach.selectButton')}
                            </button>
                        </div>
                        {/* Hard Mode */}
                        <div className="border border-red-500/50 rounded-lg p-4 text-center flex flex-col">
                            <h4 className="font-bold text-red-300">{t('coach.hard')}</h4>
                            <p className="text-xs text-gray-400 mt-2 flex-grow">{t('coach.hardReward')}: {difficultyModalScenario.hard.reward[language]}</p>
                             <button onClick={() => { onStartScenario(difficultyModalScenario, 'hard'); setDifficultyModalScenario(null); }} className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md">
                                {t('coach.selectButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </section>
  );
};

export default ConversationCoach;