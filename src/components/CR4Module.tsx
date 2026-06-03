/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Table, CheckCircle2, ArrowRight, TrendingUp, Save } from 'lucide-react';

interface RowData {
  [key: string]: string;
}

interface SectionConfig {
  id: string;
  title: string;
  subtitle: string;
  years: string[];
  fields: { id: string; label: string; placeholder: string; description: string }[];
  calculate: (data: RowData) => number;
  formula: string;
}

const SECTIONS: SectionConfig[] = [
  {
    id: 'ER',
    title: 'SECTION 1: ENROLLMENT RATIO (ER)',
    subtitle: 'Students enrolled in the First Year on average over 3 academic years',
    years: ['CAY (25-26)', 'CAYm1 (24-25)', 'CAYm2 (23-24)'],
    fields: [
      { id: 'N', label: 'N', placeholder: '120', description: 'Sanctioned intake of the program' },
      { id: 'N1', label: 'N1', placeholder: '112', description: 'Total no. of students admitted in 1st year (Adjusted)' },
      { id: 'N4', label: 'N4', placeholder: '5', description: 'Total no. of students admitted via supernumerary quotas' },
    ],
    calculate: (d) => {
      const n = parseFloat(d.N) || 0;
      const n1 = parseFloat(d.N1) || 0;
      const n4 = parseFloat(d.N4) || 0;
      return n > 0 ? (n1 + n4) / n : 0;
    },
    formula: 'ER = (N1 + N4) / N',
  },
  {
    id: 'SR',
    title: 'SECTION 2: SUCCESS RATE (SR)',
    subtitle: 'Students graduated within the stipulated course duration',
    years: ['LYG (21-22)', 'LYGm1 (20-21)', 'LYGm2 (19-20)'],
    fields: [
      { id: 'A', label: 'A*', placeholder: '125', description: 'Total admitted including lateral entry (Adjusted)' },
      { id: 'B', label: 'B', placeholder: '98', description: 'Number of students graduated from the program' },
    ],
    calculate: (d) => {
      const a = parseFloat(d.A) || 0;
      const b = parseFloat(d.B) || 0;
      return a > 0 ? (b / a) * 100 : 0;
    },
    formula: 'SR = (B / A) × 100',
  },
  {
    id: 'API1',
    title: 'SECTION 3: ACADEMIC PERFORMANCE (API) – 1ST YEAR',
    subtitle: 'Academic performance assessment for students in their first year',
    years: ['CAYm1 (24-25)', 'CAYm2 (23-24)', 'CAYm3 (22-23)'],
    fields: [
      { id: 'X', label: 'X', placeholder: '7.8', description: 'Mean GPA or (Mean Percentage / 10)' },
      { id: 'Y', label: 'Y', placeholder: '110', description: 'Total number of successful students' },
      { id: 'Z', label: 'Z', placeholder: '120', description: 'Total number of students appeared' },
    ],
    calculate: (d) => {
      const x = parseFloat(d.X) || 0;
      const y = parseFloat(d.Y) || 0;
      const z = parseFloat(d.Z) || 0;
      return z > 0 ? x * (y / z) : 0;
    },
    formula: 'API = X × (Y / Z)',
  },
  {
    id: 'API2',
    title: 'SECTION 3: ACADEMIC PERFORMANCE (API) – 2ND YEAR',
    subtitle: 'Academic performance assessment for students in their second year',
    years: ['CAYm1 (24-25)', 'CAYm2 (23-24)', 'CAYm3 (22-23)'],
    fields: [
      { id: 'X', label: 'X', placeholder: '8.2', description: 'Mean GPA or (Mean Percentage / 10)' },
      { id: 'Y', label: 'Y', placeholder: '105', description: 'Total number of successful students' },
      { id: 'Z', label: 'Z', placeholder: '115', description: 'Total number of students appeared' },
    ],
    calculate: (d) => {
      const x = parseFloat(d.X) || 0;
      const y = parseFloat(d.Y) || 0;
      const z = parseFloat(d.Z) || 0;
      return z > 0 ? x * (y / z) : 0;
    },
    formula: 'API = X × (Y / Z)',
  },
  {
    id: 'API3',
    title: 'SECTION 3: ACADEMIC PERFORMANCE (API) – 3RD YEAR',
    subtitle: 'Academic performance assessment for students in their third year',
    years: ['CAYm1 (24-25)', 'CAYm2 (23-24)', 'CAYm3 (22-23)'],
    fields: [
      { id: 'X', label: 'X', placeholder: '8.4', description: 'Mean GPA or (Mean Percentage / 10)' },
      { id: 'Y', label: 'Y', placeholder: '102', description: 'Total number of successful students' },
      { id: 'Z', label: 'Z', placeholder: '112', description: 'Total number of students appeared' },
    ],
    calculate: (d) => {
      const x = parseFloat(d.X) || 0;
      const y = parseFloat(d.Y) || 0;
      const z = parseFloat(d.Z) || 0;
      return z > 0 ? x * (y / z) : 0;
    },
    formula: 'API = X × (Y / Z)',
  },
  {
    id: 'PI',
    title: 'SECTION 4: PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP',
    subtitle: 'Transition data for final year graduating students',
    years: ['LYG (21-22)', 'LYGm1 (20-21)', 'LYGm2 (19-20)'],
    fields: [
      { id: 'FS', label: 'FS*', placeholder: '120', description: 'Total final year students' },
      { id: 'X', label: 'X', placeholder: '92', description: 'Placed students' },
      { id: 'Y', label: 'Y', placeholder: '12', description: 'Higher studies' },
      { id: 'Z', label: 'Z', placeholder: '3', description: 'Entrepreneurship' },
    ],
    calculate: (d) => {
      const fs = parseFloat(d.FS) || 0;
      const x = parseFloat(d.X) || 0;
      const y = parseFloat(d.Y) || 0;
      const z = parseFloat(d.Z) || 0;
      return fs > 0 ? ((x + y + z) / fs) * 100 : 0;
    },
    formula: 'P = ((X + Y + Z) / FS) × 100',
  },
];

interface CR4ModuleProps {
  onCalculateResults?: (results: {
    ER: number;
    SR: number;
    API1: number;
    API2: number;
    API3: number;
    PI: number;
  }) => void;
}

export function CR4Module({ onCalculateResults }: CR4ModuleProps) {
  const [formData, setFormData] = useState<Record<string, Record<string, RowData>>>({});
  const [isCalculated, setIsCalculated] = useState(false);

  const handleInputChange = (sectionId: string, year: string, fieldId: string, value: string) => {
    setIsCalculated(false);
    setFormData((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [year]: {
          ...prev[sectionId]?.[year],
          [fieldId]: value,
        },
      },
    }));
  };

  const getCalculatedValue = (sectionId: string, year: string) => {
    const config = SECTIONS.find((s) => s.id === sectionId);
    if (!config) return 0;
    const data = formData[sectionId]?.[year] || {};
    return config.calculate(data);
  };

  const getSectionAverage = (sectionId: string) => {
    const config = SECTIONS.find((s) => s.id === sectionId);
    if (!config) return 0;
    return config.years.reduce((sum, year) => sum + getCalculatedValue(sectionId, year), 0) / config.years.length;
  };

  const handleAuditClick = () => {
    setIsCalculated(true);
    if (onCalculateResults) {
      onCalculateResults({
        ER: getSectionAverage('ER'),
        SR: getSectionAverage('SR'),
        API1: getSectionAverage('API1'),
        API2: getSectionAverage('API2'),
        API3: getSectionAverage('API3'),
        PI: getSectionAverage('PI'),
      });
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Action Header */}
      <div className="sticky top-20 z-40 py-2 pointer-events-none">
         <div className="max-w-6xl mx-auto flex justify-end pointer-events-auto">
            <button 
              onClick={handleAuditClick}
              className={`flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:translate-y-0 group ${isCalculated ? 'bg-green-600 shadow-green-600/30' : ''}`}
            >
              {isCalculated ? <CheckCircle2 size={20} /> : <Calculator size={20} className="group-hover:rotate-12 transition-transform" />}
              {isCalculated ? 'Audit Recalculated' : 'Run CR4(2) Audit Calculation'}
            </button>
         </div>
      </div>

      {SECTIONS.map((section, idx) => (
        <motion.section
          key={section.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
        >
          <div className="px-10 py-8 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                   <Table size={16} />
                </div>
                {section.title}
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 ml-11 border-l-2 border-slate-200 pl-2">
                {section.subtitle}
              </p>
            </div>
            <div className="px-4 py-2 bg-blue-50 text-blue-700 text-[11px] font-black border border-blue-100 rounded-xl uppercase tracking-widest shadow-sm">
              <span className="opacity-50 mr-2">Formula:</span>
              {section.formula}
            </div>
          </div>

          <div className="p-10 overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/4">Input Variables</th>
                  {section.years.map((year) => (
                    <th key={year} className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {section.fields.map((field) => (
                  <tr key={field.id} className="group transition-colors rounded-xl hover:bg-slate-50/40">
                    <td className="py-6 pr-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 flex items-center gap-2">
                           <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                              {field.label}
                           </div>
                           {field.description}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight italic pl-7">
                          VARIABLE: {field.label}
                        </span>
                      </div>
                    </td>
                    {section.years.map((year) => (
                      <td key={year} className="py-6 text-center">
                        <div className="relative inline-block">
                          <input
                            type="number"
                            placeholder={field.placeholder}
                            value={formData[section.id]?.[year]?.[field.id] || ''}
                            onChange={(e) => handleInputChange(section.id, year, field.id, e.target.value)}
                            className="w-32 px-4 py-3 text-base font-black border-2 border-slate-100 bg-slate-50 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white outline-none transition-all text-center placeholder:text-slate-200"
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Result Row */}
                <tr className="bg-slate-50/50">
                  <td className="py-8 pl-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                        <TrendingUp size={20} />
                      </div>
                      <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Calculated Metrics</span>
                    </div>
                  </td>
                  {section.years.map((year) => {
                    const val = getCalculatedValue(section.id, year);
                    return (
                      <td key={year} className="py-8 text-center">
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={isCalculated ? 'calc' : 'idle'}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-2xl font-black tabular-nums transition-colors duration-500 ${isCalculated ? 'text-green-600' : 'text-slate-300'}`}
                          >
                            {val.toFixed(2)}
                            {section.id === 'SR' || section.id === 'PI' ? '%' : ''}
                          </motion.div>
                        </AnimatePresence>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-10 py-8 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-px h-8 bg-blue-500/30" />
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Session Performance</p>
                <p className="text-xs font-bold text-slate-400">Aggregated average score across all years</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg Score</p>
                 <div className={`text-4xl font-black tabular-nums leading-none transition-colors duration-500 ${isCalculated ? 'text-blue-500' : 'text-slate-700'}`}>
                    {getSectionAverage(section.id).toFixed(2)}
                    {section.id === 'SR' || section.id === 'PI' ? '%' : ''}
                 </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shadow-inner">
                <ArrowRight size={24} />
              </div>
            </div>
          </div>
        </motion.section>
      ))}

      {/* Summary Module */}
      <section className="bg-slate-900 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tighter mb-2">CR4(2) Executive Summary</h2>
            <p className="text-slate-400 text-sm font-medium">Consolidated audit scores across all student performance sub-criteria.</p>
          </div>
          <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
            <Save size={16} />
            Export Audit Report
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SECTIONS.map((s, i) => (
            <div key={s.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.07] transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                  <span className="text-xs font-black">0{i+1}</span>
                </div>
                <div className="px-2 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Final score
                </div>
              </div>
              <h4 className="text-sm font-black text-slate-200 uppercase tracking-tight mb-6 line-clamp-1">{s.title}</h4>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-black tracking-tighter transition-colors duration-500 ${isCalculated ? 'text-blue-500' : 'text-slate-800'}`}>
                  {getSectionAverage(s.id).toFixed(2)}
                  {s.id === 'SR' || s.id === 'PI' ? '%' : ''}
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase ml-1">Avg</span>
              </div>
            </div>
          ))}
          
          <div className="p-6 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-600/20 flex flex-col justify-between">
            <div>
               <h4 className="text-lg font-black tracking-tight mb-2">Overall Compliance</h4>
               <p className="text-blue-100 text-xs font-medium leading-relaxed">Average of all criterion benchmarks for the current accreditation cycle.</p>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <div className="text-6xl font-black tracking-tighter leading-none">
                {(SECTIONS.reduce((sum, s) => sum + getSectionAverage(s.id), 0) / SECTIONS.length).toFixed(2)}
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
