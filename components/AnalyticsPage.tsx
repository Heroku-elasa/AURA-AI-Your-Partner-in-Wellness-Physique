import React, { useState, useEffect } from 'react';
import { useLanguage, SiteAnalyticsData } from '../types';

interface AnalyticsPageProps {
  data: SiteAnalyticsData | null;
  isLoading: boolean;
  onRefresh: () => void;
  isQuotaExhausted: boolean;
}

const useCountUp = (end: number, duration = 1500): number => {
    const [count, setCount] = useState(0);
    const frameRate = 60;
    const totalFrames = Math.round(duration / (1000 / frameRate));

    useEffect(() => {
        if (end === 0) {
            setCount(0);
            return;
        }
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = (frame / totalFrames);
            // Ease-out cubic easing function
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.round(end * easedProgress);
            setCount(currentCount);

            if (frame === totalFrames) {
                clearInterval(counter);
            }
        }, 1000 / frameRate);

        return () => clearInterval(counter);
    }, [end, duration]);

    return count;
};

const StatCard: React.FC<{ title: string; value: number; isLive?: boolean }> = ({ title, value, isLive = false }) => {
    const displayValue = useCountUp(value);
    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10 text-center">
            <div className="flex items-center justify-center gap-2">
                {isLive && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span></span>}
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
            </div>
            <p className="text-4xl font-extrabold text-white mt-2">{displayValue.toLocaleString()}</p>
        </div>
    );
};

const BarChart: React.FC<{ data: { source: string; percentage: number }[] }> = ({ data }) => {
    const colors = ['bg-teal-500', 'bg-rose-500', 'bg-purple-500', 'bg-yellow-500'];
    return (
        <div className="space-y-3">
            {data.map((item, index) => (
                <div key={item.source}>
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-medium text-gray-300">{item.source}</span>
                        <span className="font-mono text-white">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className={`${colors[index % colors.length]} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const WorldMap: React.FC<{ countries: { country: string, visitors: number, flag: string }[] }> = ({ countries }) => {
    const coords: Record<string, { x: string; y: string; }> = {
        'USA': { x: '25%', y: '35%' }, 'United States': { x: '25%', y: '35%' },
        'Germany': { x: '48%', y: '30%' },
        'Brazil': { x: '35%', y: '65%' },
        'Iran': { x: '58%', y: '40%' },
        'Japan': { x: '80%', y: '38%' },
        'Australia': { x: '82%', y: '75%' },
        'Canada': { x: '26%', y: '25%' },
        'United Arab Emirates': { x: '59%', y: '45%' },
        'France': { x: '46%', y: '33%' },
    };

    return (
        <div className="relative aspect-video bg-gray-900/50 p-2 rounded-lg border border-white/10">
            <svg viewBox="0 0 1000 500" className="w-full h-full">
                <path d="M500 0L490 20L510 20L500 0ZM500 500L490 480L510 480L500 500ZM0 250L20 240L20 260L0 250ZM1000 250L980 240L980 260L1000 250Z M910 390L920 380L915 370L905 380L910 390Z M80 150L70 160L75 170L85 160L80 150Z M250 120L260 110L255 100L245 110L250 120Z M750 120L760 110L755 100L745 110L750 120Z M150 400L160 390L155 380L145 390L150 400Z M850 400L860 390L855 380L845 390L850 400Z M400 80L410 70L405 60L395 70L400 80Z M600 80L610 70L605 60L595 70L600 80Z" fill="#1f2937" />
                <path d="M500,250 C450,150 350,150 300,250 S150,350 200,450 L300,400 L400,450 L500,400 L600,450 L700,400 L800,450 C850,350 750,150 700,250 S550,150 500,250 Z" fill="#374151" />
            </svg>
            {countries.map(c => {
                if (coords[c.country]) {
                    return (
                        <div key={c.country} className="absolute group" style={{ left: coords[c.country].x, top: coords[c.country].y, transform: 'translate(-50%, -50%)' }}>
                             <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                            </span>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {c.flag} {c.country} - {c.visitors.toLocaleString()}
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};


const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ data, isLoading, onRefresh, isQuotaExhausted }) => {
    const { t } = useLanguage();

    useEffect(() => {
        if (!data && !isLoading) {
            onRefresh();
        }
    }, [data, isLoading, onRefresh]);

    const renderSkeleton = () => (
        <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-700 rounded-lg"></div>)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-700 rounded-lg"></div>
                <div className="space-y-6">
                    <div className="h-48 bg-gray-700 rounded-lg"></div>
                    <div className="h-48 bg-gray-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
                <div className="max-w-3xl">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('analyticsPage.title')}</h1>
                    <p className="mt-2 text-lg text-gray-300">{t('analyticsPage.subtitle')}</p>
                </div>
                <button onClick={onRefresh} disabled={isLoading || isQuotaExhausted} className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                    {t('analyticsPage.refreshButton')}
                </button>
            </div>

            {isLoading && !data ? renderSkeleton() : data ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title={t('analyticsPage.liveVisitors')} value={data.liveVisitors} isLive />
                        <StatCard title={t('analyticsPage.today')} value={data.todayVisitors} />
                        <StatCard title={t('analyticsPage.thisWeek')} value={data.weeklyVisitors} />
                        <StatCard title={t('analyticsPage.thisMonth')} value={data.monthlyVisitors} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4">{t('analyticsPage.topCountries')}</h3>
                            <WorldMap countries={data.topCountries} />
                            <ul className="mt-4 space-y-2">
                                {data.topCountries.map(c => (
                                    <li key={c.country} className="flex justify-between items-center text-sm">
                                        <span className="flex items-center gap-2 text-gray-300">{c.flag} {c.country}</span>
                                        <span className="font-mono font-semibold text-white">{c.visitors.toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-8">
                             <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4">{t('analyticsPage.trafficSources')}</h3>
                                <BarChart data={data.trafficSources} />
                            </div>
                            <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4">{t('analyticsPage.deviceBreakdown')}</h3>
{/* FIX: Map the deviceBreakdown data to match the { source, percentage } structure expected by the BarChart component. */}
                                <BarChart data={data.deviceBreakdown.map(item => ({ source: item.device, percentage: item.percentage }))} />
                            </div>
                        </div>
                    </div>
                     <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">{t('analyticsPage.topPages')}</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="border-b border-gray-700 text-gray-400">
                                    <tr>
                                        <th className="py-2 px-3">{t('analyticsPage.page')}</th>
                                        <th className="py-2 px-3 text-right">{t('analyticsPage.views')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.topPages.map(page => (
                                        <tr key={page.path} className="border-b border-gray-800">
                                            <td className="py-3 px-3 text-teal-400 font-medium">{page.path}</td>
                                            <td className="py-3 px-3 text-right font-mono text-white">{page.views.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-gray-800/30 p-6 rounded-lg border border-dashed border-gray-600">
                        <h3 className="text-lg font-semibold text-white mb-2">{t('analyticsPage.howToConnect')}</h3>
                        <p className="text-sm text-gray-400">{t('analyticsPage.howToConnectBody')}</p>
                    </div>
                </div>
            ) : (
                 <div className="text-center py-20 text-gray-500 bg-gray-800/20 rounded-lg">
                    <p>Could not load analytics data. Please try refreshing.</p>
                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;
