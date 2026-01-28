"use client";

import React, { useState } from 'react';
import { EVRecord } from '../types/ev-data';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface DataTableProps {
    data: EVRecord[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof EVRecord; direction: 'asc' | 'desc' } | null>(null);

    const itemsPerPage = 8;

    // Filter
    const filteredData = data.filter(record =>
        record.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    const sortedData = React.useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    const requestSort = (key: keyof EVRecord) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="bg-white">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <SlidersHorizontal size={18} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Fleet Inventory</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Granular vehicle disclosure</p>
                    </div>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search model, make, city..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-bold placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            <div className="overflow-x-auto px-4 pb-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                            <th className="px-6 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => requestSort('vin')}>
                                <div className="flex items-center gap-2">VIN <ArrowUpDown size={12} /></div>
                            </th>
                            <th className="px-6 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => requestSort('make')}>
                                <div className="flex items-center gap-2">Build <ArrowUpDown size={12} /></div>
                            </th>
                            <th className="px-6 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => requestSort('city')}>
                                <div className="flex items-center gap-2">Location <ArrowUpDown size={12} /></div>
                            </th>
                            <th className="px-6 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => requestSort('evType')}>
                                <div className="flex items-center gap-2">Category <ArrowUpDown size={12} /></div>
                            </th>
                            <th className="px-6 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => requestSort('electricRange')}>
                                <div className="flex items-center gap-2 text-right justify-end pr-2">Max Range <ArrowUpDown size={12} /></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {currentData.length > 0 ? currentData.map((record) => (
                            <tr key={record.vin} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-5">
                                    <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md group-hover:bg-white transition-colors">
                                        {record.vin.slice(0, 10)}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-900 leading-none mb-1">{record.make}</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{record.model} ({record.modelYear})</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-slate-600">
                                    {record.city}, {record.state}
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${record.evType === 'Battery Electric Vehicle (BEV)'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                        }`}>
                                        {record.evType === 'Battery Electric Vehicle (BEV)' ? 'BEV' : 'PHEV'}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-black text-slate-900">{record.electricRange}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">EPA Miles</span>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                                            <Search size={24} />
                                        </div>
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching records found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Displaying <span className="text-slate-900">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, sortedData.length)}</span> of <span className="text-slate-900">{sortedData.length}</span> entries
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg">
                            {currentPage}
                        </span>
                        <span className="text-xs font-bold text-slate-300">of</span>
                        <span className="text-xs font-black text-slate-500">{totalPages || 1}</span>
                    </div>
                    <button
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
