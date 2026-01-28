"use client";
import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { EVRecord } from '../types/ev-data';

// Professional modern accent colors
const THEME_COLORS = {
    primary: '#6366f1',
    secondary: '#14b8a6',
    accent: '#f43f5e',
    grid: '#f1f5f9',
    text: '#64748b'
};

interface ChartProps {
    data: EVRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 ring-1 ring-black/5 z-50">
                <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-widest">{label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-slate-900 text-2xl font-black tracking-tight">
                        {payload[0].value.toLocaleString()}
                    </p>
                    <span className="text-slate-500 text-xs font-bold">Vehicles</span>
                </div>
            </div>
        );
    }
    return null;
};

export const AdoptionTrendChart: React.FC<ChartProps> = ({ data }) => {
    const yearCounts = data.reduce((acc, curr) => {
        const year = curr.modelYear;
        if (year > 2012 && year <= new Date().getFullYear()) {
            acc[year] = (acc[year] || 0) + 1;
        }
        return acc;
    }, {} as Record<number, number>);

    const chartData = Object.entries(yearCounts)
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => parseInt(a.year) - parseInt(b.year));

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100/60 h-[450px] flex flex-col premium-shadow transition-all hover:border-slate-200">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-indigo-100">
                        Historical Growth
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Adoption Velocity</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Expansion trajectory of EV registrations</p>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={THEME_COLORS.primary} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={THEME_COLORS.primary} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME_COLORS.grid} />
                        <XAxis
                            dataKey="year"
                            stroke={THEME_COLORS.text}
                            fontSize={11}
                            fontWeight={700}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke={THEME_COLORS.text}
                            fontSize={11}
                            fontWeight={700}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: THEME_COLORS.primary, strokeWidth: 2, strokeDasharray: '6 6' }} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke={THEME_COLORS.primary}
                            strokeWidth={4}
                            fill="url(#colorPrimary)"
                            animationDuration={2000}
                            activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: THEME_COLORS.primary }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const EVTypeDistributionChart: React.FC<ChartProps> = ({ data }) => {
    const typeCounts = data.reduce((acc, curr) => {
        const type = curr.evType === 'Battery Electric Vehicle (BEV)' ? 'BEV' :
            curr.evType === 'Plug-in Hybrid Electric Vehicle (PHEV)' ? 'PHEV' : 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const total = data.length;
    const chartData = Object.entries(typeCounts)
        .map(([name, value]) => ({ name, value, percent: (value / total) * 100 }))
        .sort((a, b) => b.value - a.value);

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100/60 h-[450px] flex flex-col premium-shadow">
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-emerald-100">
                    Propulsion Mix
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Market Composition</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Split between BEV and PHEV technologies</p>
            </div>

            <div className="space-y-10 flex-1">
                {chartData.map((item, index) => (
                    <div key={item.name} className="group cursor-default animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex justify-between items-end mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-indigo-500' : 'bg-teal-500'} ring-4 ${index === 0 ? 'ring-indigo-50' : 'ring-teal-50'}`}></div>
                                <span className="text-sm font-black text-slate-700 uppercase tracking-tight">
                                    {item.name === 'BEV' ? 'Pure Electric (BEV)' : 'Plug-in Hybrid (PHEV)'}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-900 font-black text-xl leading-none">{item.value.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{item.percent.toFixed(1)}% Share</p>
                            </div>
                        </div>
                        <div className="relative h-6 w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100/50">
                            <div
                                className="absolute top-0 left-0 h-full rounded-2xl transition-all duration-1000 ease-out shadow-lg"
                                style={{
                                    width: `${item.percent}%`,
                                    backgroundColor: index === 0 ? '#6366f1' : '#14b8a6',
                                    boxShadow: `0 0 20px -5px ${index === 0 ? '#6366f1' : '#14b8a6'}66`
                                }}
                            >
                                <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed text-center uppercase tracking-widest">
                    Market maturation signaling BEV dominance
                </p>
            </div>
        </div>
    );
};

export const TopManufacturersChart: React.FC<ChartProps> = ({ data }) => {
    const makeCounts = data.reduce((acc, curr) => {
        acc[curr.make] = (acc[curr.make] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(makeCounts)
        .map(([make, count]) => ({ make, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100/60 h-[450px] flex flex-col premium-shadow">
            <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-orange-100">
                    Volume Ranking
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Market Leaders</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Top manufacturing powerhouses</p>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                        barSize={24}
                        barGap={12}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={THEME_COLORS.grid} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="make"
                            type="category"
                            width={100}
                            stroke={THEME_COLORS.text}
                            fontSize={10}
                            fontWeight={800}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#475569' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 12 }} />
                        <Bar dataKey="count" radius={[0, 12, 12, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === 0 ? THEME_COLORS.primary : index === 1 ? '#818cf8' : '#cbd5e1'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
