import React, { useState, useEffect } from 'react';
import {
  TreatmentPlan,
  useLanguage,
  AftercareInstructions,
  CostAnalysisResult,
  CostAnalysisItem,
  PreTreatmentPlanResult,
  PreTreatmentPlanItem,
} from '../types';
import { generateAftercare, calculateTreatmentCosts, generatePreTreatmentPlan } from '../services/geminiService';

interface ConsultationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: TreatmentPlan | null;
  onSave: (plan: TreatmentPlan) => void;
  handleApiError: (error: unknown) => string;
}

const TreatmentItemDisplay: React.FC<{ items: { icon: string; name: string; description: string; }[], title: string }> = ({ items, title }) => (
  <div>
    <h4 className="text-xl font-bold text-rose-300 mb-4">{title}</h4>
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-start">
          <span className="text-3xl mr-4 rtl:ml-4 rtl:mr-0">{item.icon}</span>
          <div>
            <p className="font-semibold text-white">{item.name}</p>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ConsultationDetailModal: React.FC<ConsultationDetailModalProps> = ({ isOpen, onClose, plan, onSave, handleApiError }) => {
  const { language, t } = useLanguage();

  const [aftercare, setAftercare] = useState<AftercareInstructions | null>(null);
  const [isGeneratingAftercare, setIsGeneratingAftercare] = useState(false);
  const [aftercareError, setAftercareError] = useState<string | null>(null);

  const [costAnalysis, setCostAnalysis] = useState<CostAnalysisResult | null>(null);
  const [isCalculatingCosts, setIsCalculatingCosts] = useState(false);
  const [costsError, setCostsError] = useState<string | null>(null);
  
  const [prePlan, setPrePlan] = useState<PreTreatmentPlanResult | null>(null);
  const [isGeneratingPrePlan, setIsGeneratingPrePlan] = useState(false);
  const [prePlanError, setPrePlanError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setAftercare(null);
        setAftercareError(null);
        setCostAnalysis(null);
        setCostsError(null);
        setPrePlan(null);
        setPrePlanError(null);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const handleGenerateAftercare = async () => {
    setIsGeneratingAftercare(true);
    setAftercareError(null);
    try {
      const result = await generateAftercare(plan, language);
      setAftercare(result);
    } catch (err) {
      setAftercareError(handleApiError(err));
    } finally {
      setIsGeneratingAftercare(false);
    }
  };
  
  const handleCalculateCosts = async () => {
    setIsCalculatingCosts(true);
    setCostsError(null);
    try {
      const result = await calculateTreatmentCosts(plan, language);
      setCostAnalysis(result);
    } catch (err) {
      setCostsError(handleApiError(err));
    } finally {
      setIsCalculatingCosts(false);
    }
  };
  
  const handleGeneratePrePlan = async () => {
    setIsGeneratingPrePlan(true);
    setPrePlanError(null);
    try {
      const result = await generatePreTreatmentPlan(plan, language);
      setPrePlan(result);
    } catch (err) {
      setPrePlanError(handleApiError(err));
    } finally {
      setIsGeneratingPrePlan(false);
    }
  };

  const handleSave = () => {
    onSave(plan);
    onClose();
  };
  
  const renderCostTable = (items: CostAnalysisItem[]) => {
    if (items.length === 0) return null;
    const totalCost = items.reduce((sum, item) => sum + item.estimatedCost, 0);
    
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-700/50 text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-3 font-semibold text-gray-300">{t('consultationModal.tableHeaderItem')}</th>
                        <th className="p-3 font-semibold text-gray-300 text-right">{t('consultationModal.tableHeaderCost')}</th>
                        <th className="p-3 font-semibold text-gray-300 text-center">{t('consultationModal.tableHeaderUnit')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {items.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-800/60 transition-colors">
                            <td className="p-3 font-medium text-white">{item.name}</td>
                            <td className="p-3 text-right font-mono text-yellow-300">{item.estimatedCost.toLocaleString()}</td>
                            <td className="p-3 text-center text-gray-400">{item.unit}</td>
                        </tr>
                    ))}
                </tbody>
                 <tfoot className="bg-gray-700/50 font-bold">
                    <tr>
                        <td className="p-3 text-white">{t('consultationModal.tableHeaderTotal')}</td>
                        <td className="p-3 text-right font-mono text-yellow-200">{totalCost.toLocaleString()} {t('consultationModal.currency')}</td>
                        <td />
                    </tr>
                </tfoot>
            </table>
        </div>
    );
  };
  
  const renderPrePlanSection = (items: PreTreatmentPlanItem[], title: string) => {
    if (!items || items.length === 0) return null;
    return (
        <div>
            <h4 className="font-semibold text-gray-300 mb-2">{title}</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
                {items.map((item, i) => <li key={i}><strong>{item.item}:</strong> {item.instruction}</li>)}
            </ul>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <div className="text-center flex-grow">
            <h2 className="text-2xl font-bold text-rose-300 tracking-wider">{plan.planTitle}</h2>
            <p className="text-sm text-gray-400 mt-1">{plan.concernSummary}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <main className="p-8 overflow-y-auto space-y-8">
          <section>
            <TreatmentItemDisplay items={plan.suggestedTreatments} title={t('consultationModal.treatments')} />
          </section>

          <section className="text-center space-y-4">
            <div>
                <h4 className="font-semibold text-gray-400">{t('consultationModal.disclaimerTitle')}</h4>
                <p className="text-xs text-gray-500">{plan.disclaimer}</p>
            </div>
            <button onClick={handleSave} className="px-6 py-2 bg-rose-600 text-white font-semibold rounded-md hover:bg-rose-700 transition-colors">
              {t('consultationModal.savePlan')}
            </button>
          </section>

          <div className="space-y-6 pt-6 border-t-2 border-dashed border-gray-700">
            <section>
              <h3 className="text-xl font-bold text-white mb-4">{t('consultationModal.aftercareTitle')}</h3>
              {aftercare ? (
                <div className="space-y-4 bg-gray-900/50 p-6 rounded-lg animate-fade-in">
                  <div>
                    <h4 className="font-semibold text-gray-300">{t('consultationModal.instructions')}</h4>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      {aftercare.instructions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                   <div>
                    <h4 className="font-semibold text-gray-300">{t('consultationModal.precautions')}</h4>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      {aftercare.precautions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              ) : (
                <button onClick={handleGenerateAftercare} disabled={isGeneratingAftercare} className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50">
                  {isGeneratingAftercare ? t('consultationModal.generatingAftercare') : t('consultationModal.generateAftercareButton')}
                </button>
              )}
              {aftercareError && <p className="text-red-400 text-sm mt-2">{aftercareError}</p>}
            </section>
            
            <section>
                <h3 className="text-xl font-bold text-white mb-4">{t('consultationModal.costAnalysisTitle')}</h3>
                {costAnalysis ? (
                     <div className="bg-gray-900/50 p-6 rounded-lg animate-fade-in">
                        {renderCostTable(costAnalysis.treatmentCosts)}
                     </div>
                ) : (
                    <button onClick={handleCalculateCosts} disabled={isCalculatingCosts} className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50">
                      {isCalculatingCosts ? t('consultationModal.calculatingCosts') : t('consultationModal.calculateCostsButton')}
                    </button>
                )}
                {costsError && <p className="text-red-400 text-sm mt-2">{costsError}</p>}
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-4">{t('consultationModal.prePlanTitle')}</h3>
                 {prePlan ? (
                     <div className="space-y-6 bg-gray-900/50 p-6 rounded-lg animate-fade-in">
                        {renderPrePlanSection(prePlan.oneWeekBefore, t('consultationModal.oneWeekBefore'))}
                        {renderPrePlanSection(prePlan.oneDayBefore, t('consultationModal.oneDayBefore'))}
                        {renderPrePlanSection(prePlan.dayOfTreatment, t('consultationModal.dayOf'))}
                     </div>
                ) : (
                    <button onClick={handleGeneratePrePlan} disabled={isGeneratingPrePlan} className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50">
                      {isGeneratingPrePlan ? t('consultationModal.generatingPrePlan') : t('consultationModal.generatePrePlanButton')}
                    </button>
                )}
                {prePlanError && <p className="text-red-400 text-sm mt-2">{prePlanError}</p>}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConsultationDetailModal;