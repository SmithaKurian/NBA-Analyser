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
  }, hasFaculty?: boolean) => void;
  // Hoisted states from App
  cayFacultyList: FacultyEntry[];
  setCayFacultyList: React.Dispatch<React.SetStateAction<FacultyEntry[]>>;
  caym1FacultyList: FacultyEntry[];
  setCaym1FacultyList: React.Dispatch<React.SetStateAction<FacultyEntry[]>>;
  caym2FacultyList: FacultyEntry[];
  setCaym2FacultyList: React.Dispatch<React.SetStateAction<FacultyEntry[]>>;
  
  calcCayFacultyList: FacultyEntry[];
  setCalcCayFacultyList: React.Dispatch<React.SetStateAction<FacultyEntry[]>>;
  calcCaym1FacultyList: FacultyEntry[];
  setCalcCaym1FacultyList: React.Dispatch<React.SetStateAction<FacultyEntry[]>>;
  calcCaym2FacultyList: FacultyEntry[];
  setCalcCaym2FacultyList: React.Dispatch<React.SetStateAction<FacultyEntry[]>>;

  cayUploadedFileName: string | null;
  setCayUploadedFileName: (name: string | null) => void;
  caym1UploadedFileName: string | null;
  setCaym1UploadedFileName: (name: string | null) => void;
  caym2UploadedFileName: string | null;
  setCaym2UploadedFileName: (name: string | null) => void;

  lastRecalculated: string | null;
  setLastRecalculated: (val: string | null) => void;

  isDirty: boolean;
  setIsDirty: (val: boolean) => void;
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

export function CR5Module({
  onCalculateResults,
  cayFacultyList,
  setCayFacultyList,
  caym1FacultyList,
  setCaym1FacultyList,
  caym2FacultyList,
  setCaym2FacultyList,
  calcCayFacultyList,
  setCalcCayFacultyList,
  calcCaym1FacultyList,
  setCalcCaym1FacultyList,
  calcCaym2FacultyList,
  setCalcCaym2FacultyList,
  cayUploadedFileName,
  setCayUploadedFileName,
  caym1UploadedFileName,
  setCaym1UploadedFileName,
  caym2UploadedFileName,
  setCaym2UploadedFileName,
  lastRecalculated,
  setLastRecalculated,
  isDirty,
  setIsDirty
}: CR5ModuleProps) {
  const [activeTab, setActiveTab] = useState('summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isRecalculating, setIsRecalculating] = useState(false);
  const isInitialMount = useRef(true);

  const [selectedDirectoryYear, setSelectedDirectoryYear] = useState<'cay' | 'caym1' | 'caym2'>('cay');

  const cayFileInputRef = useRef<HTMLInputElement>(null);
  const caym1FileInputRef = useRef<HTMLInputElement>(null);
  const caym2FileInputRef = useRef<HTMLInputElement>(null);

  const getFacultyListForYear = (year: string) => {
    if (year.includes('CAYm1')) return caym1FacultyList;
    if (year.includes('CAYm2')) return caym2FacultyList;
    return cayFacultyList; // Default to CAY
  };

  const getCalcFacultyListForYear = (year: string) => {
    if (year.includes('CAYm1')) return calcCaym1FacultyList;
    if (year.includes('CAYm2')) return calcCaym2FacultyList;
    return calcCayFacultyList;
  };

  const getFacultyList = () => {
    if (selectedDirectoryYear === 'caym1') return caym1FacultyList;
    if (selectedDirectoryYear === 'caym2') return caym2FacultyList;
    return cayFacultyList;
  };

  const getCalcFacultyList = () => {
    if (selectedDirectoryYear === 'caym1') return calcCaym1FacultyList;
    if (selectedDirectoryYear === 'caym2') return calcCaym2FacultyList;
    return calcCayFacultyList;
  };

  const getSetFacultyList = () => {
    if (selectedDirectoryYear === 'caym1') return setCaym1FacultyList;
    if (selectedDirectoryYear === 'caym2') return setCaym2FacultyList;
    return setCayFacultyList;
  };

  const deleteFaculty = (sn: number) => {
    const listSetter = getSetFacultyList();
    listSetter(prev => prev.filter(f => f.sn !== sn).map((f, i) => ({ ...f, sn: i + 1 })));
    setIsDirty(true);
  };

  const resetRosterToDefault = (yearKey: 'cay' | 'caym1' | 'caym2') => {
    if (yearKey === 'cay') {
      setCayFacultyList([]);
      setCayUploadedFileName(null);
    } else if (yearKey === 'caym1') {
      setCaym1FacultyList([]);
      setCaym1UploadedFileName(null);
    } else if (yearKey === 'caym2') {
      setCaym2FacultyList([]);
      setCaym2UploadedFileName(null);
    }
    setUploadStatus({
      type: 'success',
      message: `Cleared faculty roster and inputs for ${yearKey.toUpperCase()}.`
    });
    setIsDirty(true);
  };

  const handleFileUploadForYear = (event: React.ChangeEvent<HTMLInputElement>, yearKey: 'cay' | 'caym1' | 'caym2') => {
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
          throw new Error("No sheets found in the uploaded Excel workbook.");
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
        
        if (!jsonData || jsonData.length === 0) {
          throw new Error(`The sheet "${firstSheetName}" is empty.`);
        }

        // Detect column mapping dynamically (same robust detection)
        let headerRowIndex = 0;
        let colIdxs = {
          sn: 0,
          name: 1,
          pan: 3,
          degree: 4,
          university: 5,
          specialization: 6,
          joiningDate: 7,
          experience: 8,
          joiningDesignation: 9,
          presentDesignation: 10,
          dateDesignatedProf: 11,
          nature: 12,
          currentlyAssociated: 13,
          dateOfLeaving: 14
        };

        for (let r = 0; r < Math.min(jsonData.length, 20); r++) {
          const row = jsonData[r];
          if (row && Array.isArray(row)) {
            const rowStr = row.map(cell => String(cell || '').toLowerCase().trim());
            const hasName = rowStr.some(c => c.includes('name'));
            const hasDegree = rowStr.some(c => c.includes('degree') || c.includes('qualification') || c.includes('phd') || c.includes('ph.d'));
            const hasExp = rowStr.some(c => c.includes('exp') || c.includes('experience'));
            
            if (hasName && (hasDegree || hasExp)) {
              headerRowIndex = r;
              rowStr.forEach((val, cIdx) => {
                if (val.includes('sn') || val.includes('s.n') || val === 'sno' || val === 's.no' || val === 'serial') {
                  colIdxs.sn = cIdx;
                } else if (val.includes('date (designated') || val.includes('designated as prof') || (val.includes('designated') && val.includes('prof'))) {
                  colIdxs.dateDesignatedProf = cIdx;
                } else if (val.includes('name') || (val.includes('faculty') && !val.includes('designat') && !val.includes('joining') && !val.includes('leaving'))) {
                  colIdxs.name = cIdx;
                } else if (val.includes('pan')) {
                  colIdxs.pan = cIdx;
                } else if (val.includes('degree') || val.includes('qualification') || val.includes('highest')) {
                  colIdxs.degree = cIdx;
                } else if (val.includes('univ') || val.includes('college') || val.includes('institute')) {
                  colIdxs.university = cIdx;
                } else if (val.includes('spec') || val.includes('dept') || val.includes('branch') || val.includes('subject')) {
                  colIdxs.specialization = cIdx;
                } else if (val.includes('joining date') || val.includes('doj') || val.includes('date of joining')) {
                  colIdxs.joiningDate = cIdx;
                } else if (val.includes('exp') || val.includes('year')) {
                  colIdxs.experience = cIdx;
                } else if (val.includes('joining des') || val.includes('designation at joining') || val.includes('designation at time joining')) {
                  colIdxs.joiningDesignation = cIdx;
                } else if (val.includes('present des') || val.includes('current des') || val.includes('present designation') || val.includes('current designation') || val.includes('role') || val.includes('designation')) {
                  colIdxs.presentDesignation = cIdx;
                } else if (val.includes('nature') || val.includes('type') || val.includes('association') || val.includes('status')) {
                  colIdxs.nature = cIdx;
                } else if (val.includes('currently') || val.includes('associated') || val.includes('active') || val.includes('yes/no') || val.includes('y/n')) {
                  colIdxs.currentlyAssociated = cIdx;
                } else if (val.includes('leaving') || val.includes('date of leaving')) {
                  colIdxs.dateOfLeaving = cIdx;
                }
              });
              break;
            }
          }
        }

        const startIndex = headerRowIndex !== -1 ? headerRowIndex + 1 : 1;
        const dataRows = jsonData.slice(startIndex);

        const newFaculty: FacultyEntry[] = dataRows
          .filter(row => row && row.length > 0 && row[colIdxs.name])
          .map((row, index) => {
            const getCellStr = (idx: number, def = '') => {
              if (idx === undefined || idx < 0) return def;
              const val = row[idx];
              if (val === undefined || val === null) return def;
              return String(val).trim();
            };

            const rawExp = row[colIdxs.experience];
            let parsedExp = 0;
            if (rawExp !== undefined && rawExp !== null) {
              parsedExp = parseFloat(rawExp);
              if (isNaN(parsedExp)) parsedExp = 0;
            }

            // Determine association status
            const assocCellStr = getCellStr(colIdxs.currentlyAssociated).toLowerCase();
            let curAssoc = true;
            if (assocCellStr && (assocCellStr.startsWith('n') || assocCellStr === 'no')) {
              curAssoc = false;
            }

            return {
              sn: index + 1,
              name: getCellStr(colIdxs.name, 'Unknown Faculty'),
              pan: getCellStr(colIdxs.pan),
              degree: getCellStr(colIdxs.degree),
              university: getCellStr(colIdxs.university),
              specialization: getCellStr(colIdxs.specialization),
              joiningDate: getCellStr(colIdxs.joiningDate),
              experience: parsedExp,
              joiningDesignation: getCellStr(colIdxs.joiningDesignation),
              presentDesignation: getCellStr(colIdxs.presentDesignation, 'Assistant Professor'),
              nature: getCellStr(colIdxs.nature, 'Regular'),
              currentlyAssociated: curAssoc,
              dateDesignatedProf: getCellStr(colIdxs.dateDesignatedProf),
              dateOfLeaving: getCellStr(colIdxs.dateOfLeaving),
            };
          });

        if (newFaculty.length === 0) {
          throw new Error(`Could not extract any valid faculty rows. Please make sure that column headers are correctly matching on the sheet.`);
        }

        if (yearKey === 'cay') {
          setCayFacultyList(newFaculty);
          setCayUploadedFileName(file.name);
        } else if (yearKey === 'caym1') {
          setCaym1FacultyList(newFaculty);
          setCaym1UploadedFileName(file.name);
        } else if (yearKey === 'caym2') {
          setCaym2FacultyList(newFaculty);
          setCaym2UploadedFileName(file.name);
        }

        setUploadStatus({
          type: 'success',
          message: `File Uploaded successfully! "${file.name}" loaded for ${yearKey.toUpperCase()}: ${newFaculty.length} faculty entries compiled. Click "Recalculate Criterion 5" to compute updated scores.`
        });
        setIsDirty(true);

        // Switch to the 'faculty' tab and select this year to view
        setActiveTab('faculty');
        setSelectedDirectoryYear(yearKey);

        setTimeout(() => setUploadStatus(null), 8000);
      } catch (err: any) {
        console.error("Error reading file", file.name, err);
        setUploadStatus({
          type: 'error',
          message: `Upload failed for ${yearKey.toUpperCase()}: ${err?.message || 'Invalid format'}`
        });
      }
    };
    reader.readAsArrayBuffer(file);

    // Reset file input value
    event.target.value = '';
  };

  const calculateSFR = (data: YearData) => {
    const list = getCalcFacultyListForYear(data.year);
    if (list.length === 0) return "0.00";
    return (data.students / list.length).toFixed(2);
  };
  
  const calculateFQI = (data: YearData) => {
    const list = getCalcFacultyListForYear(data.year);
    if (list.length === 0) return "0.00";
    const rf = data.students / 20;
    const phds = list.filter(f => f.degree.toLowerCase().includes('ph.d') || f.degree.toLowerCase().includes('phd')).length;
    const masters = list.filter(f => f.degree.toLowerCase().includes('m.tech') || f.degree.toLowerCase().includes('me') || f.degree.toLowerCase().includes('master')).length;
    return (2.5 * ((10 * phds + 4 * masters) / rf)).toFixed(2);
  };

  const calculateCadre = (data: YearData) => {
    const list = getCalcFacultyListForYear(data.year);
    if (list.length === 0) return "0.00";
    const rfTotal = data.students / 20;
    const rf1 = (1/9) * rfTotal;
    const rf2 = (2/9) * rfTotal;
    const rf3 = (6/9) * rfTotal;
    
    const profs = list.filter(f => f.presentDesignation.toLowerCase().includes('prof') && !f.presentDesignation.toLowerCase().includes('assoc')).length;
    const assocProfs = list.filter(f => f.presentDesignation.toLowerCase().includes('assoc')).length;
    const asstProfs = list.filter(f => f.presentDesignation.toLowerCase().includes('asst')).length;

    const marks = (
      (Math.min(profs / rf1, 1)) + 
      (Math.min(assocProfs / rf2, 1) * 0.6) + 
      (Math.min(asstProfs / rf3, 1) * 0.4)
    ) * 12.5;
    
    return Math.min(marks, 25).toFixed(2);
  };

  const calculateRetention = (data: YearData) => {
    const list = getCalcFacultyListForYear(data.year);
    if (list.length === 0) return "0.00";
    
    const stayingMoreThan3 = list.filter(f => f.experience >= 3).length;
    const total = list.length;
    const percentage = (stayingMoreThan3 / total) * 100;
    
    if (percentage >= 85) return "10.00";
    if (percentage >= 75) return "8.00";
    if (percentage >= 65) return "6.00";
    if (percentage >= 55) return "4.00";
    return "2.00";
  };

  const averageSFR = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateSFR(curr)), 0) / 3).toFixed(2);
  const averageFQI = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateFQI(curr)), 0) / 3).toFixed(2);
  const averageCadre = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateCadre(curr)), 0) / 3).toFixed(2);
  const averageRetention = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateRetention(curr)), 0) / 3).toFixed(2);

  const activeFacultyList = getFacultyList();
  const filteredFaculty = activeFacultyList.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.presentDesignation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadSample = () => {
    const data = [
      [
        "S.N",
        "Name of the Faculty",
        "", // Blank column as shown in the template
        "PAN No.",
        "Highest Degree",
        "University",
        "Area of Specialization",
        "Date of Joining in this Institution",
        "Experience in Years in current institute",
        "Designation at Time Joining in this Institution",
        "Present Designation",
        "Date (Designated as Prof./ Associate Professor)",
        "Nature of Association (Regular/Contract/Adjunct)",
        "Currently Associated(Y/N)",
        "Date of Leaving"
      ],
      [
        1,
        "Dr. John Doe",
        "",
        "ABCDE1234F",
        "Ph.D",
        "Anna University",
        "Computer Science",
        "2018-06-15",
        8.5,
        "Assistant Professor",
        "Professor",
        "2022-09-01",
        "Regular",
        "Y",
        ""
      ],
      [
        2,
        "Jane Smith",
        "",
        "BCDEF2345G",
        "M.Tech",
        "VTU",
        "Software Engineering",
        "2021-01-10",
        3.2,
        "Assistant Professor",
        "Assistant Professor",
        "",
        "Regular",
        "Y",
        ""
      ],
      [
        3,
        "Dr. Robert Lee",
        "",
        "CDEFG3456H",
        "Ph.D",
        "IIT Madras",
        "Information Technology",
        "2015-07-20",
        11.0,
        "Associate Professor",
        "Associate Professor",
        "2019-02-14",
        "Regular",
        "Y",
        ""
      ],
      [
        4,
        "Sarah Jenkins",
        "",
        "DEFGH4567I",
        "M.S.",
        "BITS Pilani",
        "Electronics & Communication",
        "2024-08-01",
        1.8,
        "Assistant Professor",
        "Assistant Professor",
        "",
        "Regular",
        "N",
        "2025-05-30"
      ]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Faculty_Template.xlsx");
  };

  const onCalculateResultsRef = useRef(onCalculateResults);
  onCalculateResultsRef.current = onCalculateResults;

  // Sync results with the parent application only on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      if (onCalculateResultsRef.current) {
        onCalculateResultsRef.current({
          SFR: parseFloat(averageSFR),
          FQI: parseFloat(averageFQI),
          Cadre: parseFloat(averageCadre),
          Retention: parseFloat(averageRetention)
        }, calcCayFacultyList.length > 0 || calcCaym1FacultyList.length > 0 || calcCaym2FacultyList.length > 0);
      }
      isInitialMount.current = false;
    }
  }, [averageSFR, averageFQI, averageCadre, averageRetention, calcCayFacultyList.length, calcCaym1FacultyList.length, calcCaym2FacultyList.length]);

  const triggerRecalculation = () => {
    setIsRecalculating(true);
    setUploadStatus(null);
    
    setTimeout(() => {
      // Sync calculation states with new uploaded list states
      setCalcCayFacultyList(cayFacultyList);
      setCalcCaym1FacultyList(caym1FacultyList);
      setCalcCaym2FacultyList(caym2FacultyList);

      const localGetCalcList = (yr: string) => {
        if (yr.includes('CAYm1')) return caym1FacultyList;
        if (yr.includes('CAYm2')) return caym2FacultyList;
        return cayFacultyList;
      };

      const localCalcSFR = (data: YearData) => {
        const list = localGetCalcList(data.year);
        if (list.length === 0) return 0;
        return data.students / list.length;
      };

      const localCalcFQI = (data: YearData) => {
        const list = localGetCalcList(data.year);
        if (list.length === 0) return 0;
        const rf = data.students / 20;
        const phds = list.filter(f => f.degree.toLowerCase().includes('ph.d') || f.degree.toLowerCase().includes('phd')).length;
        const masters = list.filter(f => f.degree.toLowerCase().includes('m.tech') || f.degree.toLowerCase().includes('me') || f.degree.toLowerCase().includes('master')).length;
        return 2.5 * ((10 * phds + 4 * masters) / rf);
      };

      const localCalcCadre = (data: YearData) => {
        const list = localGetCalcList(data.year);
        if (list.length === 0) return 0;
        const rfTotal = data.students / 20;
        const rf1 = (1/9) * rfTotal;
        const rf2 = (2/9) * rfTotal;
        const rf3 = (6/9) * rfTotal;
        
        const profs = list.filter(f => f.presentDesignation.toLowerCase().includes('prof') && !f.presentDesignation.toLowerCase().includes('assoc')).length;
        const assocProfs = list.filter(f => f.presentDesignation.toLowerCase().includes('assoc')).length;
        const asstProfs = list.filter(f => f.presentDesignation.toLowerCase().includes('asst')).length;

        const marks = (
          (Math.min(profs / rf1, 1)) + 
          (Math.min(assocProfs / rf2, 1) * 0.6) + 
          (Math.min(asstProfs / rf3, 1) * 0.4)
        ) * 12.5;
        
        return Math.min(marks, 25);
      };

      const localCalcRetention = (data: YearData) => {
        const list = localGetCalcList(data.year);
        if (list.length === 0) return 0;
        
        const stayingMoreThan3 = list.filter(f => f.experience >= 3).length;
        const total = list.length;
        const percentage = (stayingMoreThan3 / total) * 100;
        
        if (percentage >= 85) return 10;
        if (percentage >= 75) return 8;
        if (percentage >= 65) return 6;
        if (percentage >= 55) return 4;
        return 2;
      };

      const freshSFR = (NBA_DATA.reduce((acc, curr) => acc + localCalcSFR(curr), 0) / 3).toFixed(2);
      const freshFQI = (NBA_DATA.reduce((acc, curr) => acc + localCalcFQI(curr), 0) / 3).toFixed(2);
      const freshCadre = (NBA_DATA.reduce((acc, curr) => acc + localCalcCadre(curr), 0) / 3).toFixed(2);
      const freshRetention = (NBA_DATA.reduce((acc, curr) => acc + localCalcRetention(curr), 0) / 3).toFixed(2);

      if (onCalculateResultsRef.current) {
        onCalculateResultsRef.current({
          SFR: parseFloat(freshSFR),
          FQI: parseFloat(freshFQI),
          Cadre: parseFloat(freshCadre),
          Retention: parseFloat(freshRetention)
        }, cayFacultyList.length > 0 || caym1FacultyList.length > 0 || caym2FacultyList.length > 0);
      }
      
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastRecalculated(timeString);
      setIsDirty(false);
      setIsRecalculating(false);
      
      setUploadStatus({
        type: 'success',
        message: `Criterion 5 evaluation complete! All parameters (SFR, FQI, Cadre & Retention) compiled at ${timeString} with ${cayFacultyList.length + caym1FacultyList.length + caym2FacultyList.length} total active roster members.`
      });
    }, 1200);
  };

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
        </div>
      </div>

      {/* Roster Upload Control Center */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Upload size={14} className="text-blue-600" />
              Academic Year Excel Upload Center
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Initialize or override faculty rosters for evaluation years independently.</p>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">
            3-Year Consolidated Auditing
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CAY Upload Slot */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 relative group flex flex-col justify-between hover:border-blue-400 transition-all shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider">CAY (Current Year)</span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">2025-26</span>
              </div>
              <div className="text-lg font-black text-slate-800">{cayFacultyList.length} Faculty</div>
              <div className="text-[10px] text-slate-400 font-medium mt-1 mb-4">
                {cayUploadedFileName ? (
                  <span className="text-emerald-600 font-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={11} className="mt-0.5 shrink-0" />
                    File: {cayUploadedFileName}
                  </span>
                ) : (
                  <span className="text-slate-400 font-semibold italic">No roster uploaded yet (Empty)</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <input 
                type="file" 
                ref={cayFileInputRef} 
                onChange={(e) => handleFileUploadForYear(e, 'cay')} 
                accept=".csv, .xlsx, .xls"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => cayFileInputRef.current?.click()}
                className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-extrabold text-[10px] uppercase tracking-wider transition-all border border-blue-200 cursor-pointer text-center"
              >
                Upload Excel
              </button>
              {(cayUploadedFileName || cayFacultyList.length > 0) && (
                <button
                  type="button"
                  onClick={() => resetRosterToDefault('cay')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all border border-slate-200 cursor-pointer"
                  title="Clear roster data"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* CAYm1 Upload Slot */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 relative group flex flex-col justify-between hover:border-blue-400 transition-all shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider">CAYm1 (Year - 1)</span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">2024-25</span>
              </div>
              <div className="text-lg font-black text-slate-800">{caym1FacultyList.length} Faculty</div>
              <div className="text-[10px] text-slate-400 font-medium mt-1 mb-4">
                {caym1UploadedFileName ? (
                  <span className="text-emerald-600 font-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={11} className="mt-0.5 shrink-0" />
                    File: {caym1UploadedFileName}
                  </span>
                ) : (
                  <span className="text-slate-400 font-semibold italic">No roster uploaded yet (Empty)</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <input 
                type="file" 
                ref={caym1FileInputRef} 
                onChange={(e) => handleFileUploadForYear(e, 'caym1')} 
                accept=".csv, .xlsx, .xls"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => caym1FileInputRef.current?.click()}
                className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-extrabold text-[10px] uppercase tracking-wider transition-all border border-blue-200 cursor-pointer text-center"
              >
                Upload Excel
              </button>
              {(caym1UploadedFileName || caym1FacultyList.length > 0) && (
                <button
                  type="button"
                  onClick={() => resetRosterToDefault('caym1')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all border border-slate-200 cursor-pointer"
                  title="Clear roster data"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* CAYm2 Upload Slot */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 relative group flex flex-col justify-between hover:border-blue-400 transition-all shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider">CAYm2 (Year - 2)</span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">2023-24</span>
              </div>
              <div className="text-lg font-black text-slate-800">{caym2FacultyList.length} Faculty</div>
              <div className="text-[10px] text-slate-400 font-medium mt-1 mb-4">
                {caym2UploadedFileName ? (
                  <span className="text-emerald-600 font-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={11} className="mt-0.5 shrink-0" />
                    File: {caym2UploadedFileName}
                  </span>
                ) : (
                  <span className="text-slate-400 font-semibold italic">No roster uploaded yet (Empty)</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <input 
                type="file" 
                ref={caym2FileInputRef} 
                onChange={(e) => handleFileUploadForYear(e, 'caym2')} 
                accept=".csv, .xlsx, .xls"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => caym2FileInputRef.current?.click()}
                className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-extrabold text-[10px] uppercase tracking-wider transition-all border border-blue-200 cursor-pointer text-center"
              >
                Upload Excel
              </button>
              {(caym2UploadedFileName || caym2FacultyList.length > 0) && (
                <button
                  type="button"
                  onClick={() => resetRosterToDefault('caym2')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all border border-slate-200 cursor-pointer"
                  title="Clear roster data"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recalculate Footer Panel */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${isDirty ? 'bg-amber-100' : 'bg-emerald-100'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isDirty ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-700 flex items-center gap-1.5 leading-none">
                {isDirty ? 'Roster changes detected!' : 'Evaluation scores up to date.'}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-normal">
                {isDirty 
                  ? 'Please click "Recalculate Criterion 5" to analyze uploaded profiles and rebuild NBA marks.'
                  : lastRecalculated 
                    ? `Audit completed successfully. Last verified at ${lastRecalculated}.` 
                    : 'Audited values verified with current baseline faculty database.'}
              </p>
            </div>
          </div>
          
          <button
            type="button"
            disabled={isRecalculating}
            onClick={triggerRecalculation}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md select-none border min-w-[210px] ${
              isDirty 
                ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-blue-100' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95'
            }`}
          >
            {isRecalculating ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-current shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Auditing Profiles...
              </>
            ) : (
              <>
                <Calculator size={13} strokeWidth={2.5} className="shrink-0" />
                Recalculate Criterion 5
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload status message */}
      {uploadStatus && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed transition-all ${
          uploadStatus.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : 'bg-rose-50 text-rose-950 border-rose-200'
        }`}>
          <div className="mt-0.5 shrink-0">
            <CheckCircle2 size={16} className={uploadStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-500'} />
          </div>
          <div className="flex-1 font-bold">
            {uploadStatus.message}
          </div>
          <button 
            type="button" 
            onClick={() => setUploadStatus(null)}
            className="text-slate-400 hover:text-slate-600 font-bold ml-auto cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-0 pt-2 custom-scrollbar">
        {[
          { id: 'summary', icon: LayoutDashboard, label: 'Overview' },
          { id: 'faculty', icon: Users, label: `Faculty Roster (${cayFacultyList.length + caym1FacultyList.length + caym2FacultyList.length})` },
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
                      <td className="px-8 py-4 text-center font-bold text-slate-600">{getCalcFacultyListForYear(data.year).length}</td>
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
          {/* Year selector buttons for directory */}
          <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 max-w-lg flex gap-1">
            {[
              { id: 'cay', label: 'CAY (2025-26)', count: cayFacultyList.length },
              { id: 'caym1', label: 'CAYm1 (2024-25)', count: caym1FacultyList.length },
              { id: 'caym2', label: 'CAYm2 (2023-24)', count: caym2FacultyList.length }
            ].map(y => (
              <button
                key={y.id}
                type="button"
                onClick={() => setSelectedDirectoryYear(y.id as any)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all cursor-pointer ${
                  selectedDirectoryYear === y.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                <span className="text-[9px] font-black uppercase tracking-wider">{y.label}</span>
                <span className={`text-[9px] font-bold ${selectedDirectoryYear === y.id ? 'text-blue-100' : 'text-slate-400'}`}>
                  {y.count} Members
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-grow sm:w-96 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search current roster by name, degree, designation..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Showing {filteredFaculty.length} of {activeFacultyList.length} Faculty ({selectedDirectoryYear.toUpperCase()})
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[10px] text-slate-500">
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 1 / A: S.N</span>
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 2 / B: Name of the Faculty</span>
                <span className="text-slate-400 font-bold uppercase tracking-tight">Col 3 / C: (Blank / Spacer)</span>
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 4 / D: PAN No.</span>
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 5 / E: Highest Degree</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 6 / F: University</span>
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 7 / G: Area of Specialization</span>
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 8 / H: Date of Joining in this Institution</span>
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 9 / I: Experience in Years in current institute</span>
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 10 / J: Designation at Time Joining in this Institution</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 11 / K: Present Designation</span>
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 12 / L: Date (Designated as Prof./ Associate Professor)</span>
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 13 / M: Nature of Association (Regular/Contract/Adjunct)</span>
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 14 / N: Currently Associated(Y/N)</span>
                <span className="text-slate-800 font-extrabold uppercase tracking-tight">Col 15 / O: Date of Leaving</span>
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
                  <span className="text-base font-black text-slate-800">{getCalcFacultyListForYear(data.year).length}</span>
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
                    const yearList = getCalcFacultyListForYear(data.year);
                    const phds = yearList.filter(f => f.degree.toLowerCase().includes('ph.d') || f.degree.toLowerCase().includes('phd')).length;
                    const masters = yearList.filter(f => f.degree.toLowerCase().includes('m.tech') || f.degree.toLowerCase().includes('me') || f.degree.toLowerCase().includes('master')).length;
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
                  const yearList = getCalcFacultyListForYear(data.year);
                  const profs = yearList.filter(f => f.presentDesignation.toLowerCase().includes('prof') && !f.presentDesignation.toLowerCase().includes('assoc')).length;
                  const assocProfs = yearList.filter(f => f.presentDesignation.toLowerCase().includes('assoc')).length;
                  const asstProfs = yearList.filter(f => f.presentDesignation.toLowerCase().includes('asst')).length;

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
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest border-b pb-3">Tenure Spread Analysis ({selectedDirectoryYear.toUpperCase()})</h4>
              <div className="space-y-4">
                {['experienceA', 'experienceB', 'experienceC', 'experienceD'].map((key) => {
                  const latest = NBA_DATA[0];
                  const labels: any = { experienceA: '>= 5 Years', experienceB: '3-5 Years', experienceC: '1-3 Years', experienceD: '< 1 Year' };
                  const colors: any = { experienceA: 'bg-emerald-500', experienceB: 'bg-indigo-500', experienceC: 'bg-blue-500', experienceD: 'bg-slate-300' };
                  
                  const activeList = getCalcFacultyList();
                  const count = key === 'experienceA' ? activeList.filter(f => f.experience >= 5).length : 
                               key === 'experienceB' ? activeList.filter(f => f.experience >= 3 && f.experience < 5).length :
                               key === 'experienceC' ? activeList.filter(f => f.experience >= 1 && f.experience < 3).length :
                               activeList.filter(f => f.experience < 1).length;

                  const total = activeList.length;
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
                      <td className="px-4 py-4 text-center font-bold text-slate-600">{getCalcFacultyListForYear(data.year).length}</td>
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
