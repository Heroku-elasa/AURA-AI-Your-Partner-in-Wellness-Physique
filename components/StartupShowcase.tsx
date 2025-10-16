import React, { useState } from 'react';
import { useLanguage, DoctorProfile } from '../types';

const OurExpertsPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'coaches' | 'doctors'>('coaches');
  
  const coaches: DoctorProfile[] = t('ourExperts.coaches');
  const doctors: DoctorProfile[] = t('ourExperts.doctors');
  
  const headers: { [key: string]: string } = t('ourExperts.tableHeaders');
  
  const dataToShow = activeTab === 'coaches' ? coaches : doctors;
  const certificationLabel = activeTab === 'coaches' ? headers.certification : headers.license;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          {t('ourExperts.title')}
        </h1>
        <p className="mt-4 text-lg text-gray-300">{t('ourExperts.subtitle')}</p>
      </div>
      
      <div className="mt-12 max-w-6xl mx-auto">
        <div className="mb-8 flex justify-center border-b border-gray-700">
            <button 
                onClick={() => setActiveTab('coaches')}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'coaches' ? 'border-teal-400 text-teal-300' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
                {t('ourExperts.tabs.coaches')}
            </button>
            <button 
                onClick={() => setActiveTab('doctors')}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'doctors' ? 'border-rose-400 text-rose-300' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
                {t('ourExperts.tabs.doctors')}
            </button>
        </div>

        <div className="bg-gray-800/50 border border-white/10 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/60">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">{headers.name}</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">{headers.specialty}</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white hidden md:table-cell">{headers.bio}</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">{certificationLabel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-900/30">
                {dataToShow.map((expert) => (
                  <tr key={expert.name} className="hover:bg-gray-800/40 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{expert.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{expert.specialty}</td>
                    <td className="whitespace-normal px-3 py-4 text-sm text-gray-400 hidden md:table-cell">{expert.bio}</td>
                    <td className={`whitespace-nowrap px-3 py-4 text-sm font-semibold ${activeTab === 'coaches' ? 'text-teal-400' : 'text-rose-400'}`}>{expert.licenseNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurExpertsPage;