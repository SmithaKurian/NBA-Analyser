/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, BarChart3, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { FacultyStats, AcademicYear } from '../utils';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<AcademicYear, FacultyStats>;
  allYears: AcademicYear[];
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, data, allYears }) => {
  const chartData = useMemo(() => {
    if (!data || !allYears) return [];
    return allYears.map(year => {
      const yearStat = data[year];
      return {
        year,
        fqi: Number(yearStat?.FQI?.toFixed(2) || 0),
        fr: Number(yearStat?.retention?.FR?.toFixed(2) || 0),
        phd: yearStat?.X || 0,
        masters: yearStat?.Y || 0,
      };
    });
  }, [data, allYears]);

  if (!isOpen) return null;

  const currentYearData = data["25-26"];
  const baselineYearData = data["20-21"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#e2e8f0]"
            >
              {/* Header */}
              <div className="px-8 py-6 bg-[#fafafa] border-b border-[#e2e8f0] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#2563eb]/10 rounded-lg text-[#2563eb]">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0f172a] uppercase tracking-tight">Accreditation Trend Analysis</h2>
                    <p className="text-xs text-[#64748b] font-medium tracking-wide font-mono">6-YEAR HISTORICAL AUDIT PERSPECTIVE</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-[#64748b]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                
                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 border border-[#e2e8f0] rounded-xl bg-[#f8fafc]">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 size={16} className="text-[#2563eb]" />
                      <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest">FQI Momentum</span>
                    </div>
                    <div className="text-2xl font-bold text-[#0f172a]">
                      + {((currentYearData?.FQI && baselineYearData?.FQI) ? ((currentYearData.FQI / baselineYearData.FQI - 1) * 100).toFixed(1) : "0.0")}%
                    </div>
                    <p className="text-[11px] text-[#64748b] mt-1 italic">Growth from 20-21 to 25-26</p>
                  </div>

                  <div className="p-5 border border-[#e2e8f0] rounded-xl bg-[#f8fafc]">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-[#10b981]" />
                      <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest">Retention Index</span>
                    </div>
                    <div className="text-2xl font-bold text-[#0f172a]">
                       {currentYearData?.retention?.FR?.toFixed(2) || "0.00"}
                    </div>
                    <p className="text-[11px] text-[#64748b] mt-1 italic">Points achieved in CAY</p>
                  </div>

                  <div className="p-5 border border-[#e2e8f0] rounded-xl bg-[#f8fafc]">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-[#2563eb]" />
                      <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest">Ph.D Growth</span>
                    </div>
                    <div className="text-2xl font-bold text-[#0f172a]">
                      150%
                    </div>
                    <p className="text-[11px] text-[#64748b] mt-1 italic">Ph.D count increase (4 to 10)</p>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* FQI & FR Trend */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-[#0f172a] uppercase tracking-widest border-l-4 border-[#2563eb] pl-3">FQI & Retention Points Trend</h3>
                    <div className="h-[300px] w-full border border-[#e2e8f0] rounded-xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="year" fontSize={11} fontWeight={600} stroke="#64748b" axisLine={false} tickLine={false} />
                          <YAxis fontSize={11} fontWeight={600} stroke="#64748b" axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold' }} />
                          <Line type="monotone" dataKey="fqi" name="FQI Index" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="fr" name="Retention Points" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Qualification Mix */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-[#0f172a] uppercase tracking-widest border-l-4 border-[#10b981] pl-3">Faculty Qualification Mix</h3>
                    <div className="h-[300px] w-full border border-[#e2e8f0] rounded-xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="year" fontSize={11} fontWeight={600} stroke="#64748b" axisLine={false} tickLine={false} />
                          <YAxis fontSize={11} fontWeight={600} stroke="#64748b" axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold' }} />
                          <Area type="monotone" dataKey="phd" name="Ph.D Faculty" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} />
                          <Area type="monotone" dataKey="masters" name="Masters Faculty" stackId="1" stroke="#cbd5e1" fill="#f1f5f9" fillOpacity={0.8} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Insight Section */}
                <div className="bg-[#f8fafc] p-6 rounded-xl border border-[#e2e8f0] flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-white rounded-full border border-[#e2e8f0] flex items-center justify-center text-[#2563eb]">
                    <Info size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-widest mb-2">Evaluator Insights</h4>
                    <p className="text-[13px] leading-relaxed text-[#64748b]">
                      The multi-year trajectory confirms a <span className="font-bold text-[#0f172a]">structured upskilling initiative</span> within the department. While total faculty strength (RF) nearly doubled to accommodate intake growth, the Ph.D ratio has been prioritized, ensuring the FQI does not dilute. Retention metrics showing a recovery in CAY indicate successful institutional policies following the expansion phase.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-4 bg-[#fafafa] border-t border-[#e2e8f0] flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-[#0f172a] text-white text-[11px] font-bold uppercase tracking-widest rounded transition-colors hover:bg-slate-800"
                >
                  Close Audit View
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
