import React from 'react';
import path from 'path';
import { promises as fs } from 'fs';
import Papa from 'papaparse';
import { EVRecord } from '../types/ev-data';
import { DashboardStats } from '../components/DashboardStats';
import { AdoptionTrendChart, EVTypeDistributionChart, TopManufacturersChart } from '../components/Charts';
import { DataTable } from '../components/DataTable';
import {
  BarChart3,
  LayoutDashboard,
  Car,
  Globe,
  Settings,
  LogOut,
  Search,
  Sparkles,
  Zap
} from 'lucide-react';

async function getEVData(): Promise<EVRecord[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'Electric_Vehicle_Population_Data.csv');
  const fileContent = await fs.readFile(filePath, 'utf8');

  const result = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const formattedData: EVRecord[] = result.data.map((row: any) => ({
    vin: row["VIN (1-10)"],
    county: row.County,
    city: row.City,
    state: row.State,
    postalCode: row["Postal Code"],
    modelYear: parseInt(row["Model Year"], 10) || 0,
    make: row.Make,
    model: row.Model,
    evType: row["Electric Vehicle Type"],
    cafvEligibility: row["Clean Alternative Fuel Vehicle (CAFV) Eligibility"],
    electricRange: parseInt(row["Electric Range"], 10) || 0,
    baseMsrp: parseInt(row["Base MSRP"], 10) || 0,
    legislativeDistrict: row["Legislative District"],
    dolVehicleId: row["DOL Vehicle ID"],
    vehicleLocation: row["Vehicle Location"],
    electricUtility: row["Electric Utility"],
    censusTract: row["2020 Census Tract"]
  })).filter((r: unknown) => (r as EVRecord).vin);

  return formattedData;
}

export default async function Home() {
  const data = await getEVData();

  const countyCounts: Record<string, number> = {};
  data.forEach(r => { countyCounts[r.county] = (countyCounts[r.county] || 0) + 1; });
  const topCounty = Object.entries(countyCounts).sort((a, b) => b[1] - a[1])[0];
  const topCountyPercent = topCounty ? ((topCounty[1] / data.length) * 100).toFixed(1) : 0;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap className="text-white w-5 h-5 fill-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter">VOLT<span className="text-indigo-600 italic">SYNC</span></h1>
        </div>

        <nav className="space-y-2 flex-1">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-4">Main Menu</div>
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm transition-all shadow-sm">
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all">
            <Car size={18} />
            Inventory
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all">
            <Globe size={18} />
            Geographical
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all">
            <BarChart3 size={18} />
            Reports
          </a>
        </nav>

        <div className="space-y-4 pt-6 border-t border-slate-50">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all">
            <Settings size={18} />
            Settings
          </a>
          <div className="p-4 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-1">Database</p>
              <p className="text-white text-xs font-bold leading-tight">Syncing Live<br />WA Population</p>
            </div>
            <Sparkles className="absolute -right-2 -bottom-2 text-white/10 w-16 h-16 group-hover:scale-125 transition-transform duration-700" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl w-full max-w-md border border-slate-100">
              <Search className="text-slate-400" size={18} />
              <input type="text" placeholder="Search insights or records..." className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-slate-400" />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-700 leading-none">Healthy</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
                <LogOut size={18} />
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 lg:p-12 max-w-[1400px] mx-auto w-full">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <LayoutDashboard size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Dashboard</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">EV Strategic <span className="text-indigo-600">Overview</span></h2>
              <p className="text-slate-500 mt-4 text-base font-medium max-w-xl">Deep dive into Washington state's electric vehicle population, adoption trends, and manufacturer market share.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">Export Data</button>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Live Connect</button>
            </div>
          </div>

          <DashboardStats data={data} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
            <div className="xl:col-span-2 space-y-8">
              <AdoptionTrendChart data={data} />

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 premium-shadow">
                <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight uppercase text-center md:text-left underline decoration-indigo-200 underline-offset-8">Fleet Registry Explorer</h3>
                <div className="overflow-hidden rounded-3xl border border-slate-100">
                  <DataTable data={data.slice(0, 100)} />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <EVTypeDistributionChart data={data} />
              <TopManufacturersChart data={data} />

              <div className="relative overflow-hidden rounded-[2.5rem] p-10 bg-[#0f172a] shadow-2xl group border border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-6">Regional Powerhouse</span>
                  <h3 className="text-white text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Dominant County</h3>
                  <h4 className="text-5xl font-black text-white tracking-tighter mb-4">{topCounty ? topCounty[0] : 'N/A'}</h4>
                  <p className="text-slate-400 font-medium leading-relaxed mb-8">
                    Washington's epicenter for EV adoption, contributing <span className="text-white font-bold">{topCountyPercent}%</span> to the statewide population.
                  </p>

                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full w-[0%] animate-[grow_1.5s_ease-out_forwards]" style={{ width: `${topCountyPercent}%` } as any}></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Adoption Level</span>
                    <span className="text-indigo-400">{topCountyPercent}% Total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
