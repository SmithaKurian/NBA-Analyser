/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Users, 
  GraduationCap, 
  Ratio, 
  ChevronRight, 
  FileText, 
  Calculator,
  UserCheck,
  TrendingDown,
  LayoutDashboard,
  Upload,
  Search,
  Plus,
  Trash2,
  X,
  Download,
  CheckCircle2
} from 'lucide-react';
import { NBA_DATA, INITIAL_FACULTY, FacultyEntry, YearData } from '../data';

interface CR5ModuleProps {
  onCalculateResults?: (results: {
    SFR: number;
    FQI: number;
    Cadre: number;
    Retention: number;
  }) => void;
}

const StatCard = ({ title, value, label, subtitle, color }: { title: string, value: string, label: string, subtitle?: string, color: string }) => (
  <div className={`p-6 rounded-2xl border transition-all duration-300 ${color} shadow-sm hover:shadow-md`}>
    <h3 className="text-xs font-bold uppercase tracking-wider opacity-80">{title}</h3>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-3xl font-black tracking-tight">{value}</span>
      <span className="text-sm font-bold opacity-70">{label}</span>
    </div>
    {subtitle && <p className="mt-2 text-[10px] font-medium opacity-60 italic">{subtitle}</p>}
  </div>
);

export function CR5Module({ onCalculateResults }: CR5ModuleProps) {
  const [activeTab, setActiveTab] = useState('summary');
  const [facultyList, setFacultyList] = useState<FacultyEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteFaculty = (sn: number) => {
    setFacultyList(prev => prev.filter(f => f.sn !== sn).map((f, i) => ({ ...f, sn: i + 1 })));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const accumulatedFaculty: FacultyEntry[] = [];
    let processedCount = 0;

    Array.from(files).forEach((item) => {
      const file = item as File;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
          
          const newFaculty: FacultyEntry[] = jsonData.slice(1)
            .filter(row => row && row.length > 0 && row[1]) 
            .map((row, index) => {
              return {
                sn: index + 1,
                name: String(row[1] || 'Unknown').trim(),
                pan: String(row[2] || '').trim(),
                degree: String(row[3] || '').trim(),
                university: String(row[4] || '').trim(),
                specialization: String(row[5] || '').trim(),
                joiningDate: String(row[6] || '').trim(),
                experience: parseFloat(row[7]) || 0,
                joiningDesignation: String(row[8] || '').trim(),
                presentDesignation: String(row[9] || '').trim(),
                nature: String(row[10] || 'Regular').trim(),
                currentlyAssociated: String(row[11])?.toLowerCase().startsWith('y') || row[11] === "" || true,
              };
            });
          accumulatedFaculty.push(...newFaculty);
        } catch (err) {
          console.error("Error reading file", file.name, err);
        }
        
        processedCount++;
        if (processedCount === files.length) {
          setFacultyList(prev => {
            const combined = [...prev, ...accumulatedFaculty];
            return combined.map((f, i) => ({ ...f, sn: i + 1 }));
          });
        }
      };
      reader.readAsArrayBuffer(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const calculateSFR = (data: YearData) => {
    if (facultyList.length === 0) return "0.00";
    return (data.students / facultyList.length).toFixed(2);
  };
  
  const calculateFQI = (data: YearData) => {
    if (facultyList.length === 0) return "0.00";
    const rf = data.students / 20;
    const phds = facultyList.filter(f => f.degree.toLowerCase().includes('ph.d') || f.degree.toLowerCase().includes('phd')).length;
    const masters = facultyList.filter(f => f.degree.toLowerCase().includes('m.tech') || f.degree.toLowerCase().includes('me') || f.degree.toLowerCase().includes('master')).length;
    return (2.5 * ((10 * phds + 4 * masters) / rf)).toFixed(2);
  };

  const calculateCadre = (data: YearData) => {
    if (facultyList.length === 0) return "0.00";
    const rfTotal = data.students / 20;
    const rf1 = (1/9) * rfTotal;
    const rf2 = (2/9) * rfTotal;
    const rf3 = (6/9) * rfTotal;
    
    const profs = facultyList.filter(f => f.presentDesignation.toLowerCase().includes('prof') && !f.presentDesignation.toLowerCase().includes('assoc')).length;
    const assocProfs = facultyList.filter(f => f.presentDesignation.toLowerCase().includes('assoc')).length;
    const asstProfs = facultyList.filter(f => f.presentDesignation.toLowerCase().includes('asst')).length;

    const marks = (
      (Math.min(profs / rf1, 1)) + 
      (Math.min(assocProfs / rf2, 1) * 0.6) + 
      (Math.min(asstProfs / rf3, 1) * 0.4)
    ) * 12.5;
    
    return Math.min(marks, 25).toFixed(2);
  };

  const calculateRetention = (data: YearData) => {
    if (facultyList.length === 0) return "0.00";
    
    const stayingMoreThan3 = facultyList.filter(f => f.experience >= 3).length;
    const total = facultyList.length;
    const percentage = (stayingMoreThan3 / total) * 100;
    
    if (percentage >= 85) return "10.00";
    if (percentage >= 75) return "8.00";
    if (percentage >= 65) return "6.00";
    if (percentage >= 55) return "4.00";
    return "2.00";
  };

  const averageSFR = facultyList.length === 0 ? "0.00" : (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateSFR(curr)), 0) / 3).toFixed(2);
  const averageFQI = facultyList.length === 0 ? "0.00" : (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateFQI(curr)), 0) / 3).toFixed(2);
  const averageCadre = facultyList.length === 0 ? "0.00" : (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateCadre(curr)), 0) / 3).toFixed(2);
  const averageRetention = facultyList.length === 0 ? "0.00" : (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateRetention(curr)), 0) / 3).toFixed(2);

  const filteredFaculty = facultyList.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.presentDesignation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadSample = () => {
    const data = [
      ["SN", "Faculty Name", "PAN", "Degree", "University", "Specialization", "Joining Date", "Experience (Years)", "Joining Designation", "Present Designation", "Nature", "Currently Associated (Y/N)"],
      [1, "Dr. John Doe", "ABCDE1234F", "Ph.D", "Anna University", "CSE", "2018-06-15", 8.5, "Assistant Professor", "Professor", "Regular", "Y"],
      [2, "Jane Smith", "BCDEF2345G", "M.Tech", "VTU", "Software Engineering", "2021-01-10", 3.2, "Assistant Professor", "Assistant Professor", "Contract", "Y"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Faculty_Template.xlsx");
  };

  const onCalculateResultsRef = useRef(onCalculateResults);
  onCalculateResultsRef.current = onCalculateResults;

  // Sync results with the parent application
  useEffect(() => {
    if (onCalculateResultsRef.current) {
      onCalculateResultsRef.current({
        SFR: parseFloat(averageSFR),
        FQI: parseFloat(averageFQI),
        Cadre: parseFloat(averageCadre),
        Retention: parseFloat(averageRetention)
      });
    }
  }, [averageSFR, averageFQI, averageCadre, averageRetention]);

  return (
    <div className="space-y-8 pb-12">
      {/* Banner / Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 tracking-tight">
            <Users className="text-blue-400" />
            Faculty Audit Workspace
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">Upload, manage, and calculate NBA Criterion 5 parameters in real-time.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            type="button"
            onClick={downloadSample}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-slate-700 pointer-events-auto cursor-pointer"
          >
            <Download size={14} />
            Template
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv, .xlsx, .xls" 
            multiple
            className="hidden"
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg pointer-events-auto cursor-pointer"
          >
            <Upload size={14} />
            Excel Upload
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-0 pt-2 custom-scrollbar">
        {[
          { id: 'summary', icon: LayoutDashboard, label: 'Overview' },
          { id: 'faculty', icon: Users, label: `Faculty Roster (${facultyList.length})` },
          { id: '5.1', icon: Ratio, label: '5.1 SFR' },
          { id: '5.2', icon: GraduationCap, label: '5.2 FQI' },
          { id: '5.3', icon: UserCheck, label: '5.3 Cadre' },
          { id: '5.5', icon: TrendingDown, label: '5.5 Retention' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id 
              ? 'border-blue-600 text-blue-600 font-extrabold' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview/Summary Section */}
      {activeTab === 'summary' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Avg 5.1 SFR" value={averageSFR} label=": 1" subtitle="3 Year Average (Max 30)" color="bg-blue-50 text-blue-900 border-blue-100" />
            <StatCard title="Avg 5.2 FQI" value={averageFQI} label="Pts" subtitle="Qualification Index (Max 25)" color="bg-emerald-50 text-emerald-900 border-emerald-100" />
            <StatCard title="Avg 5.3 Cadre" value={averageCadre} label="Pts" subtitle="Cadre Proportion (Max 25)" color="bg-indigo-50 text-indigo-900 border-indigo-100" />
            <StatCard title="Avg 5.5 Retention" value={averageRetention} label="/ 10" subtitle="Experience Metric (Max 10)" color="bg-slate-50 text-slate-900 border-slate-200" />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2 text-slate-800 uppercase tracking-wider">
                <FileText className="text-blue-600" size={16} />
                Consolidated Faculty Assessment
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#fcfcfc] text-slate-500 uppercase text-[10px] font-black tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-left">Academic Year</th>
                    <th className="px-8 py-4 text-center">Students (S)</th>
                    <th className="px-8 py-4 text-center">Faculty (F)</th>
                    <th className="px-8 py-4 text-center">SFR</th>
                    <th className="px-8 py-4 text-center">FQI</th>
                    <th className="px-8 py-4 text-center">Cadre Marks</th>
                    <th className="px-8 py-4 text-center">Retention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {NBA_DATA.map((data, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4 font-bold text-slate-900">{data.year}</td>
                      <td className="px-8 py-4 text-center font-bold text-slate-600">{data.students}</td>
                      <td className="px-8 py-4 text-center font-bold text-slate-600">{facultyList.length}</td>
                      <td className="px-8 py-4 text-center">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-black">
                          {calculateSFR(data)}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-center text-emerald-600 font-black">{calculateFQI(data)}</td>
                      <td className="px-8 py-4 text-center text-indigo-600 font-black">{calculateCadre(data)}</td>
                      <td className="px-8 py-4 text-center text-slate-700 font-black">{calculateRetention(data)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Directory Section */}
      {activeTab === 'faculty' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-grow sm:w-96 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search roster by name, degree, designation..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Showing {filteredFaculty.length} of {facultyList.length} Faculty
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-xs text-left min-w-[750px]">
                <thead className="bg-[#fcfcfc] border-b border-slate-100 text-[10px] uppercase font-black text-slate-400">
                  <tr>
                    <th className="px-6 py-4">S.N.</th>
                    <th className="px-6 py-4">Faculty Name</th>
                    <th className="px-6 py-4 text-center">Degree</th>
                    <th className="px-6 py-4 text-center">Experience</th>
                    <th className="px-6 py-4 text-center">Designation</th>
                    <th className="px-6 py-4 text-center">Association</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFaculty.length > 0 ? (
                    filteredFaculty.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 text-slate-400 font-mono font-medium">{f.sn}</td>
                        <td className="px-6 py-4 font-black text-slate-800">{f.name}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                            {f.degree}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-black text-blue-600">{f.experience.toFixed(1)} Yrs</td>
                        <td className="px-6 py-4 text-center text-slate-500 font-semibold">{f.presentDesignation}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded ${f.nature === 'Regular' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {f.nature}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className={`w-2 h-2 rounded-full mx-auto ${f.currentlyAssociated ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            type="button"
                            onClick={() => deleteFaculty(f.sn)}
                            className="p-1 px-2 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                            <Users size={24} />
                          </div>
                          <div>
                            <p className="text-slate-800 font-bold">No faculty records found.</p>
                            <p className="text-slate-400 text-[11px] mt-1">Please upload an excel sheet to input faculty data and compute index values.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Excel Import Mapping Specification</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[10px] font-bold text-slate-500">
              <div className="flex flex-col gap-1">
                <span className="text-slate-700 font-bold uppercase tracking-tight">Column 1: Serial Number (SN)</span>
                <span className="text-slate-700 font-bold uppercase tracking-tight">Column 2: Faculty Name</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-700 font-bold uppercase tracking-tight">Column 3: Permanent Account No / PAN</span>
                <span className="text-slate-700 font-bold uppercase tracking-tight">Column 4: Highest Degree Earned</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-700 font-bold uppercase tracking-tight">Column 8: Total Experience (Years)</span>
                <span className="text-slate-700 font-bold uppercase tracking-tight">Column 10: Current Designation</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-700 font-bold uppercase tracking-tight">Column 11: Nature of Association</span>
                <span className="text-slate-700 font-bold uppercase tracking-tight">Column 12: Associated Y/N</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 5.1 Student Faculty Ratio */}
      {activeTab === '5.1' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-8 bg-blue-900 text-white rounded-3xl shadow-lg">
            <h2 className="text-2xl font-black mb-3 flex items-center gap-3 tracking-tight">
              <Ratio />
              5.1 Student-Faculty Ratio
            </h2>
            <p className="opacity-80 max-w-2xl text-xs font-semibold leading-relaxed">SFR calculation checks current student intake ratios against the active roster size. Ideal ratio is 1:15 to 1:20.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NBA_DATA.map((data, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-base font-black text-slate-950 border-b pb-3">{data.year}</h4>
                <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold">
                  <span className="text-[10px] uppercase text-slate-400">Students (S)</span>
                  <span className="text-base font-black text-slate-800">{data.students}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold">
                  <span className="text-[10px] uppercase text-slate-400">Regular Faculty (F)</span>
                  <span className="text-base font-black text-slate-800">{facultyList.length}</span>
                </div>
                <div className="pt-3 text-center border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ratio (Students/Faculty)</p>
                  <p className="text-3xl font-black text-blue-600">{calculateSFR(data)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 5.2 Faculty Qualification */}
      {activeTab === '5.2' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-8 bg-emerald-800 text-white rounded-3xl shadow-lg">
            <h2 className="text-2xl font-black mb-3 flex items-center gap-3 tracking-tight">
              <GraduationCap />
              5.2 Faculty Qualification Index
            </h2>
            <p className="opacity-80 text-xs font-semibold leading-relaxed">Index formulated as FQI = 2.5 * [(10X + 4Y) / RF]. Where X is PhD count, Y is Masters count, and RF is the required faculty strength (S / 20).</p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center">
                <thead className="bg-[#fcfcfc] border-b text-[10px] uppercase font-black text-slate-400">
                  <tr>
                    <th className="py-4 text-left px-8">Academic Year</th>
                    <th className="py-4">PhD Faculty Count (X)</th>
                    <th className="py-4">Masters Faculty Count (Y)</th>
                    <th className="py-4">Required Faculty (RF)</th>
                    <th className="py-4 text-emerald-600">Calculated FQI Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {NBA_DATA.map((data, idx) => {
                    const phds = facultyList.filter(f => f.degree.toLowerCase().includes('ph.d') || f.degree.toLowerCase().includes('phd')).length;
                    const masters = facultyList.filter(f => f.degree.toLowerCase().includes('m.tech') || f.degree.toLowerCase().includes('me') || f.degree.toLowerCase().includes('master')).length;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 text-left px-8 text-slate-900">{data.year}</td>
                        <td className="py-5 text-base font-black text-slate-800">{phds}</td>
                        <td className="py-5 text-base font-black text-slate-800">{masters}</td>
                        <td className="py-5 text-slate-400">{(data.students / 20).toFixed(1)}</td>
                        <td className="py-5 text-2xl font-black text-emerald-600">{calculateFQI(data)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Section 5.3 Faculty Cadre Proportion */}
      {activeTab === '5.3' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-8 bg-indigo-900 text-white rounded-3xl shadow-lg">
            <h2 className="text-2xl font-black mb-3 flex items-center gap-3 tracking-tight">
              <UserCheck />
              5.3 Faculty Cadre Proportion
            </h2>
            <p className="opacity-80 text-xs font-semibold leading-relaxed">Cadre Proportion points verify structural balance within teachers. Standard model: 1 Professor : 2 Associate Professors : 6 Assistant Professors.</p>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-xs text-center min-w-[700px]">
              <thead>
                <tr className="border-b bg-[#fcfcfc] text-[10px] uppercase font-black text-slate-500">
                  <th rowSpan={2} className="px-6 py-4 text-left border-r border-slate-100">Academic Year</th>
                  <th colSpan={2} className="px-4 py-2 border-b border-slate-100 border-r border-slate-100">Professors</th>
                  <th colSpan={2} className="px-4 py-2 border-b border-slate-100 border-r border-slate-100">Associate Profs</th>
                  <th colSpan={2} className="px-4 py-2 border-b border-slate-100 border-r border-slate-100">Assistant Profs</th>
                  <th rowSpan={2} className="px-6 py-4 text-indigo-600 font-black">Awarded Marks</th>
                </tr>
                <tr className="border-b bg-[#fcfcfc] text-[10px] uppercase font-black text-slate-400">
                  <th className="px-4 py-2 border-r border-slate-100">Required</th>
                  <th className="px-4 py-2 border-r border-slate-100 text-slate-800 font-black">Available</th>
                  <th className="px-4 py-2 border-r border-slate-100">Required</th>
                  <th className="px-4 py-2 border-r border-slate-100 text-slate-800 font-black">Available</th>
                  <th className="px-4 py-2 border-r border-slate-100">Required</th>
                  <th className="px-4 py-2 border-r border-slate-100 text-slate-800 font-black">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold border-t border-slate-100">
                {NBA_DATA.map((data, idx) => {
                  const rf = data.students / 20;
                  const profs = facultyList.filter(f => f.presentDesignation.toLowerCase().includes('prof') && !f.presentDesignation.toLowerCase().includes('assoc')).length;
                  const assocProfs = facultyList.filter(f => f.presentDesignation.toLowerCase().includes('assoc')).length;
                  const asstProfs = facultyList.filter(f => f.presentDesignation.toLowerCase().includes('asst')).length;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-left border-r border-slate-100 text-slate-900">{data.year}</td>
                      <td className="px-4 py-4 border-r border-slate-100 text-slate-400 font-mono">{(rf / 9).toFixed(1)}</td>
                      <td className="px-4 py-4 border-r border-slate-100 font-black text-slate-800 text-base">{profs}</td>
                      <td className="px-4 py-4 border-r border-slate-100 text-slate-400 font-mono">{(2 * rf / 9).toFixed(1)}</td>
                      <td className="px-4 py-4 border-r border-slate-100 font-black text-slate-800 text-base">{assocProfs}</td>
                      <td className="px-4 py-4 border-r border-slate-100 text-slate-400 font-mono">{(6 * rf / 9).toFixed(1)}</td>
                      <td className="px-4 py-4 border-r border-slate-100 font-black text-slate-800 text-base">{asstProfs}</td>
                      <td className="px-6 py-4 text-xl font-black text-indigo-600">{calculateCadre(data)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 5.5 Faculty Retention */}
      {activeTab === '5.5' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-8 bg-[#1e293b] text-white rounded-3xl shadow-lg">
            <h2 className="text-2xl font-black mb-3 flex items-center gap-3 tracking-tight">
              <TrendingDown />
              5.5 Faculty Retention
            </h2>
            <p className="opacity-80 text-xs font-semibold leading-relaxed">Tenure length measures overall institution stability. Highly experienced faculty staying for 3+ years ensures higher points.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest border-b pb-3">Tenure Spread Analysis</h4>
              <div className="space-y-4">
                {['experienceA', 'experienceB', 'experienceC', 'experienceD'].map((key) => {
                  const latest = NBA_DATA[0];
                  const labels: any = { experienceA: '>= 5 Years', experienceB: '3-5 Years', experienceC: '1-3 Years', experienceD: '< 1 Year' };
                  const colors: any = { experienceA: 'bg-emerald-500', experienceB: 'bg-indigo-500', experienceC: 'bg-blue-500', experienceD: 'bg-slate-300' };
                  
                  const count = key === 'experienceA' ? facultyList.filter(f => f.experience >= 5).length : 
                               key === 'experienceB' ? facultyList.filter(f => f.experience >= 3 && f.experience < 5).length :
                               key === 'experienceC' ? facultyList.filter(f => f.experience >= 1 && f.experience < 3).length :
                               facultyList.filter(f => f.experience < 1).length;

                  const total = facultyList.length;
                  const percentage = total > 0 ? (count / total * 100).toFixed(1) : "0.0";
                  
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="font-bold text-slate-700">{labels[key]}</span>
                        <span className="text-slate-400 font-mono">{count} Member(s) ({percentage}%)</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                        <div className={`h-full ${colors[key]} transition-all duration-700`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest border-b pb-3">Yearly Retention Metrics</h4>
              <table className="w-full text-xs">
                <thead className="bg-[#fcfcfc] text-[10px] uppercase font-black text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Academic Year</th>
                    <th className="px-4 py-3 text-center">Roster Strength</th>
                    <th className="px-4 py-3 text-center text-emerald-600">Marks (Max 10)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {NBA_DATA.map((data, idx) => (
                    <tr key={idx} className="font-bold">
                      <td className="px-4 py-4 text-slate-800">{data.year}</td>
                      <td className="px-4 py-4 text-center font-bold text-slate-600">{facultyList.length}</td>
                      <td className="px-4 py-4 text-center text-emerald-600 font-extrabold text-base">{calculateRetention(data)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
