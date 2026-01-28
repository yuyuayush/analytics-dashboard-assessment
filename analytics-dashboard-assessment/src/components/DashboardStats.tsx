import React from 'react';
import { EVRecord } from '../types/ev-data';
import { TrendingUp, Battery, Zap, Car, ArrowUpRight } from 'lucide-react';

interface DashboardStatsProps {
    data: EVRecord[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => {
    const totalVehicles = data.length;

    const bevCount = data.filter(r => r.evType === 'Battery Electric Vehicle (BEV)').length;
    const bevPercentage = totalVehicles > 0 ? ((bevCount / totalVehicles) * 100).toFixed(1) : '0';

    const avgRange = totalVehicles > 0
        ? (data.reduce((acc, curr) => acc + curr.electricRange, 0) / totalVehicles).toFixed(1)
        : '0';

    const makeCounts: Record<string, number> = {};
    data.forEach(r => { makeCounts[r.make] = (makeCounts[r.make] || 0) + 1; });
    const bestMake = Object.entries(makeCounts).sort((a, b) => b[1] - a[1])[0];

    const StatCard = ({ title, value, subtext, icon: Icon, colorClass, gradientClass, delay }: any) => (
        <div className={`relative overflow-hidden p-6 rounded-[2rem] bg-white border border-slate-100 premium-shadow transition-all duration-500 hover:-translate-y-1 group animate-fade-in-up ${delay}`}>
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 transition-transform duration-700 group-hover:scale-150 ${gradientClass}`}></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${colorClass} transition-colors duration-300`}>
                        <Icon size={20} />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                        Insight <ArrowUpRight size={12} className="text-slate-300" />
                    </div>
                </div>

                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1 font-display">
                    {value}
                </h3>

                <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-600 tracking-tight">{title}</p>
                    <p className="text-xs font-semibold text-slate-400/80 leading-tight">
                        {subtext}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
                title="Total Population"
                value={totalVehicles.toLocaleString()}
                subtext="Total active electric vehicle registered"
                icon={Car}
                colorClass="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                gradientClass="bg-indigo-600"
                delay="animate-delay-100"
            />
            <StatCard
                title="Market Purity (BEV)"
                value={`${bevPercentage}%`}
                subtext="Share of fully battery electric fleet"
                icon={Zap}
                colorClass="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
                gradientClass="bg-emerald-600"
                delay="animate-delay-200"
            />
            <StatCard
                title="Performance Index"
                value={`${avgRange} mi`}
                subtext="Average range per single charge"
                icon={Battery}
                colorClass="bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white"
                gradientClass="bg-sky-600"
                delay="animate-delay-300"
            />
            <StatCard
                title="Market Leader"
                value={bestMake ? bestMake[0] : 'N/A'}
                subtext={`Dominance with ${(bestMake?.[1] || 0).toLocaleString()} units`}
                icon={TrendingUp}
                colorClass="bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                gradientClass="bg-orange-600"
                delay="animate-delay-300"
            />
        </div>
    );
};
