/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Table, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Save, 
  Upload, 
  Download, 
  Trash2, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';

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
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const clearUploadedData = () => {
    setFormData({});
    setUploadedFileName(null);
    setIsCalculated(false);
    setUploadStatus({
      type: 'success',
      message: "Cleared all uploaded data. Inputs reset to default."
    });
  };

  const downloadC4Template = () => {
    const headers = ["Section Code", "Section Name", "Academic Year label", "Variable Code", "Variable Name / Description", "Value"];
    const rows = [
      headers,
      ["ER", "ENROLLMENT RATIO (ER)", "CAY (25-26)", "N", "Sanctioned intake of the program", 120],
      ["ER", "ENROLLMENT RATIO (ER)", "CAY (25-26)", "N1", "Total no. of students admitted in 1st year (Adjusted)", 112],
      ["ER", "ENROLLMENT RATIO (ER)", "CAY (25-26)", "N4", "Total no. of students admitted via supernumerary quotas", 5],
      ["ER", "ENROLLMENT RATIO (ER)", "CAYm1 (24-25)", "N", "Sanctioned intake of the program", 120],
      ["ER", "ENROLLMENT RATIO (ER)", "CAYm1 (24-25)", "N1", "Total no. of students admitted in 1st year (Adjusted)", 108],
      ["ER", "ENROLLMENT RATIO (ER)", "CAYm1 (24-25)", "N4", "Total no. of students admitted via supernumerary quotas", 8],
      ["ER", "ENROLLMENT RATIO (ER)", "CAYm2 (23-24)", "N", "Sanctioned intake of the program", 120],
      ["ER", "ENROLLMENT RATIO (ER)", "CAYm2 (23-24)", "N1", "Total no. of students admitted in 1st year (Adjusted)", 115],
      ["ER", "ENROLLMENT RATIO (ER)", "CAYm2 (23-24)", "N4", "Total no. of students admitted via supernumerary quotas", 3],

      ["SR", "SUCCESS RATE (SR)", "LYG (21-22)", "A", "Total admitted including lateral entry (Adjusted)", 125],
      ["SR", "SUCCESS RATE (SR)", "LYG (21-22)", "B", "Number of students graduated from the program", 98],
      ["SR", "SUCCESS RATE (SR)", "LYGm1 (20-21)", "A", "Total admitted including lateral entry (Adjusted)", 120],
      ["SR", "SUCCESS RATE (SR)", "LYGm1 (20-21)", "B", "Number of students graduated from the program", 94],
      ["SR", "SUCCESS RATE (SR)", "LYGm2 (19-20)", "A", "Total admitted including lateral entry (Adjusted)", 130],
      ["SR", "SUCCESS RATE (SR)", "LYGm2 (19-20)", "B", "Number of students graduated from the program", 105],

      ["API1", "ACADEMIC PERFORMANCE (API) - 1ST YEAR", "CAYm1 (24-25)", "X", "Mean GPA or (Mean Percentage / 10)", 7.8],
      ["API1", "ACADEMIC PERFORMANCE (API) - 1ST YEAR", "CAYm1 (24-25)", "Y", "Total number of successful students", 110],
      ["API1", "ACADEMIC PERFORMANCE (API) - 1ST YEAR", "CAYm1 (24-25)", "Z", "Total number of students appeared", 120],
      ["API1", "ACADEMIC PERFORMANCE (API) - 1ST YEAR", "CAYm2 (23-24)", "X", "Mean GPA or (Mean Percentage / 10)", 7.5],
      ["API1", "ACADEMIC PERFORMANCE (API) - 1ST YEAR", "CAYm2 (23-24)", "Y", "Total number of successful students", 105],
      ["API1", "ACADEMIC PERFORMANCE (API) - 1ST YEAR", "CAYm2 (23-24)", "Z", "Total number of students appeared", 115],
      ["API1", "ACADEMIC PERFORMANCE (API) - 1ST YEAR", "CAYm3 (22-23)", "X", "Mean GPA or (Mean Percentage / 10)", 7.2],
      ["API1", "ACADEMIC PERFORMANCE (API) - 1ST YEAR", "CAYm3 (22-23)", "Y", "Total number of successful students", 98],
      ["API1", "ACADEMIC PERFORMANCE (API) - 1ST YEAR", "CAYm3 (22-23)", "Z", "Total number of students appeared", 110],

      ["API2", "ACADEMIC PERFORMANCE (API) - 2ND YEAR", "CAYm1 (24-25)", "X", "Mean GPA or (Mean Percentage / 10)", 8.2],
      ["API2", "ACADEMIC PERFORMANCE (API) - 2ND YEAR", "CAYm1 (24-25)", "Y", "Total number of successful students", 105],
      ["API2", "ACADEMIC PERFORMANCE (API) - 2ND YEAR", "CAYm1 (24-25)", "Z", "Total number of students appeared", 115],
      ["API2", "ACADEMIC PERFORMANCE (API) - 2ND YEAR", "CAYm2 (23-24)", "X", "Mean GPA or (Mean Percentage / 10)", 8.0],
      ["API2", "ACADEMIC PERFORMANCE (API) - 2ND YEAR", "CAYm2 (23-24)", "Y", "Total number of successful students", 100],
      ["API2", "ACADEMIC PERFORMANCE (API) - 2ND YEAR", "CAYm2 (23-24)", "Z", "Total number of students appeared", 110],
      ["API2", "ACADEMIC PERFORMANCE (API) - 2ND YEAR", "CAYm3 (22-23)", "X", "Mean GPA or (Mean Percentage / 10)", 7.9],
      ["API2", "ACADEMIC PERFORMANCE (API) - 2ND YEAR", "CAYm3 (22-23)", "Y", "Total number of successful students", 95],
      ["API2", "ACADEMIC PERFORMANCE (API) - 2ND YEAR", "CAYm3 (22-23)", "Z", "Total number of students appeared", 105],

      ["API3", "ACADEMIC PERFORMANCE (API) - 3RD YEAR", "CAYm1 (24-25)", "X", "Mean GPA or (Mean Percentage / 10)", 8.4],
      ["API3", "ACADEMIC PERFORMANCE (API) - 3RD YEAR", "CAYm1 (24-25)", "Y", "Total number of successful students", 102],
      ["API3", "ACADEMIC PERFORMANCE (API) - 3RD YEAR", "CAYm1 (24-25)", "Z", "Total number of students appeared", 112],
      ["API3", "ACADEMIC PERFORMANCE (API) - 3RD YEAR", "CAYm2 (23-24)", "X", "Mean GPA or (Mean Percentage / 10)", 8.3],
      ["API3", "ACADEMIC PERFORMANCE (API) - 3RD YEAR", "CAYm2 (23-24)", "Y", "Total number of successful students", 98],
      ["API3", "ACADEMIC PERFORMANCE (API) - 3RD YEAR", "CAYm2 (23-24)", "Z", "Total number of students appeared", 108],
      ["API3", "ACADEMIC PERFORMANCE (API) - 3RD YEAR", "CAYm3 (22-23)", "X", "Mean GPA or (Mean Percentage / 10)", 8.1],
      ["API3", "ACADEMIC PERFORMANCE (API) - 3RD YEAR", "CAYm3 (22-23)", "Y", "Total number of successful students", 92],
      ["API3", "ACADEMIC PERFORMANCE (API) - 3RD YEAR", "CAYm3 (22-23)", "Z", "Total number of students appeared", 102],

      ["PI", "PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP", "LYG (21-22)", "FS", "Total final year students", 120],
      ["PI", "PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP", "LYG (21-22)", "X", "Placed students", 92],
      ["PI", "PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP", "LYG (21-22)", "Y", "Higher studies", 12],
      ["PI", "PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP", "LYG (21-22)", "Z", "Entrepreneurship", 3],
      ["PI", "PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP", "LYGm1 (20-21)", "FS", "Total final year students", 115],
      ["PI", "PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP", "LYGm1 (20-21)", "X", "Placed students", 85],
      ["PI", "PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP", "LYGm1 (20-21)", "Y", "Higher studies", 15],
      ["PI", "PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP", "LYGm1 (20-21)", "Z", "Entrepreneurship", 2],
      ["PI", "PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP", "LYGm2 (19-20)", "FS", "Total final year students", 125],
      ["PI", "PLACEMENT / HIGHER STUDIES5 / ENTREPRENEURSHIP", "LYGm2 (19-20)", "X", "Placed students", 95],
      ["PI", "PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP", "LYGm2 (19-20)", "Y", "Higher studies", 18],
      ["PI", "PLACEMENT / HIGHER STUDIES / ENTREPRENEURSHIP", "LYGm2 (19-20)", "Z", "Entrepreneurship", 4],
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CR4_Metrics");
    XLSX.writeFile(wb, "CR4_Accreditation_Template.xlsx");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (!result) throw new Error("Could not read file results.");

        const data = new Uint8Array(result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error("No sheets found in Excel file.");
        }

        const ws = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        if (jsonData.length < 2) {
          throw new Error("Excel file is empty or missing headers.");
        }

        // Smart column finder
        let colIdxs = {
          section: 0,
          year: 2,
          variable: 3,
          value: 5
        };

        const headerRow = jsonData[0];
        headerRow.forEach((h, idx) => {
          if (!h) return;
          const s = String(h).toLowerCase().trim();
          if (s.includes('section code') || s === 'section' || s === 'code') {
            colIdxs.section = idx;
          } else if (s.includes('academic year') || s.includes('year') || s.includes('period')) {
            colIdxs.year = idx;
          } else if (s.includes('variable code') || s.includes('variable') || s === 'token') {
            colIdxs.variable = idx;
          } else if (s.includes('value') || s.includes('count') || s.includes('score')) {
            colIdxs.value = idx;
          }
        });

        const newFormData: Record<string, Record<string, RowData>> = { ...formData };
        let parsedCount = 0;

        for (let r = 1; r < jsonData.length; r++) {
          const row = jsonData[r];
          if (!row || row.length === 0) continue;

          const getCellStr = (idx: number, def = '') => {
            if (idx === undefined || idx < 0) return def;
            const val = row[idx];
            if (val === undefined || val === null) return def;
            return String(val).trim();
          };

          const secCode = getCellStr(colIdxs.section).toUpperCase();
          const yearStr = getCellStr(colIdxs.year);
          const varCode = getCellStr(colIdxs.variable).toUpperCase();
          const rawVal = getCellStr(colIdxs.value);

          if (!secCode || !yearStr || !varCode || rawVal === '') continue;

          // Find matching section configuration
          const sectionConfig = SECTIONS.find(s => s.id.toLowerCase() === secCode.toLowerCase());
          if (!sectionConfig) continue;

          // Fuzzy match target academic year label
          const matchingYear = sectionConfig.years.find(y => {
            const yClean = y.toLowerCase().replace(/[^a-z0-9]/g, '');
            const valClean = yearStr.toLowerCase().replace(/[^a-z0-9]/g, '');
            return yClean.includes(valClean) || valClean.includes(yClean) || yClean.startsWith(valClean) || valClean.startsWith(yClean);
          });

          if (!matchingYear) continue;

          // Verify if variable code is supported in this section
          const hasField = sectionConfig.fields.some(f => f.id === varCode);
          if (!hasField) continue;

          if (!newFormData[secCode]) {
            newFormData[secCode] = {};
          }
          if (!newFormData[secCode][matchingYear]) {
            newFormData[secCode][matchingYear] = {};
          }

          newFormData[secCode][matchingYear][varCode] = rawVal;
          parsedCount++;
        }

        if (parsedCount === 0) {
          throw new Error("Could not parse any matching metrics from sheet. Ensure Col A is Section Code and Col D is Variable Code.");
        }

        setFormData(newFormData);
        setUploadedFileName(file.name);
        setUploadStatus({
          type: 'success',
          message: `Successfully parsed and synchronized ${parsedCount} metrics from '${file.name}'!`
        });

        setIsCalculated(true);
        if (onCalculateResults) {
          const getSectionAverageWithData = (sectId: string) => {
            const config = SECTIONS.find((s) => s.id === sectId);
            if (!config) return 0;
            return config.years.reduce((sum, year) => {
              const data = newFormData[sectId]?.[year] || {};
              return sum + config.calculate(data);
            }, 0) / config.years.length;
          };

          onCalculateResults({
            ER: getSectionAverageWithData('ER'),
            SR: getSectionAverageWithData('SR'),
            API1: getSectionAverageWithData('API1'),
            API2: getSectionAverageWithData('API2'),
            API3: getSectionAverageWithData('API3'),
            PI: getSectionAverageWithData('PI'),
          });
        }

      } catch (err: any) {
        setUploadStatus({
          type: 'error',
          message: err.message || "Failed to parse excel file."
        });
      }
    };
    reader.onerror = () => {
      setUploadStatus({
        type: 'error',
        message: "An error occurred reading the uploaded file."
      });
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Excel Upload and Information Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 flex flex-col gap-8 max-w-6xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl shrink-0 mt-0.5">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1 font-black uppercase tracking-widest leading-none">
                CRITERIA 4 BULK INTEGRATION
              </span>
              <h2 className="text-2xl font-black tracking-tight text-slate-950 mt-2">
                Excel Data Import & Auto-Analysis
              </h2>
              <p className="text-slate-455 text-xs font-semibold mt-1">
                Download the spreadsheet template, fill in student enrollment/placement scores, and upload files to analyze instantly.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadC4Template}
              className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 cursor-pointer"
            >
              <Download size={14} />
              Download Template
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/10 cursor-pointer"
            >
              <Upload size={14} />
              Upload Excel Sheet
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".csv, .xlsx, .xls"
              className="hidden"
            />
          </div>
        </div>

        {uploadStatus && (
          <div className={`p-4 rounded-xl flex items-center justify-between text-xs font-bold ${
            uploadStatus.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' 
            : 'bg-rose-50 border border-rose-100 text-rose-800'
          }`}>
            <span className="flex items-center gap-2">
              {uploadStatus.type === 'success' ? <CheckCircle2 size={16} /> : <X size={16} className="rotate-45" />}
              {uploadStatus.message}
            </span>
            {uploadedFileName && (
              <button 
                onClick={clearUploadedData}
                className="flex items-center gap-1.5 ml-4 px-2.5 py-1 bg-white/60 hover:bg-white text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200/50 uppercase text-[10px] font-black transition-all cursor-pointer"
              >
                <Trash2 size={11} />
                Reset Data
              </button>
            )}
          </div>
        )}

        {/* Map specifications */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest leading-none">
            Excel Column Mapping Protocol
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[10px] text-slate-500 font-bold">
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col A / Section Code</span>
              <span className="text-slate-400 font-medium font-bold uppercase tracking-tight">Accepts: ER, SR, API1, API2, API3, PI</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col B / Section Title</span>
              <span className="text-slate-400 font-medium font-bold uppercase tracking-tight">Enrollment Ratio, Success Rate, API, Placement</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col C / Academic Year</span>
              <span className="text-slate-400 font-medium font-bold uppercase tracking-tight">e.g. CAY (25-26), LYG (21-22), CAYm1 (24-25), etc.</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col D & F / Variable & Value</span>
              <span className="text-slate-400 font-medium font-bold uppercase tracking-tight">Token field (N, X, B, FS etc.) and numeric value</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Header */}
      <div className="sticky top-20 z-40 py-2 pointer-events-none">
         <div className="max-w-6xl mx-auto flex justify-end pointer-events-auto">
            <button 
              onClick={handleAuditClick}
              className={`flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:translate-y-0 group cursor-pointer ${isCalculated ? 'bg-green-600 shadow-green-600/30' : ''}`}
            >
              {isCalculated ? <CheckCircle2 size={20} /> : <Calculator size={20} className="group-hover:rotate-12 transition-transform" />}
              {isCalculated ? 'Run CR4(2) Audit Calculation' : 'Run CR4 Audit Calculation'}
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
