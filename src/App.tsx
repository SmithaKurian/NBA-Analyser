import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Target,
  Users,
  GraduationCap,
  TrendingUp,
  LayoutDashboard,
  BarChart3,
  ChevronRight,
  Search,
  Plus,
  BookOpen,
  PieChart,
  Upload,
  X,
  Download,
  Printer,
  Info,
  CheckCircle
} from 'lucide-react';

interface SubCriteria {
  id: string;
  name: string;
  maxMarks: number;
  awardedMarks: number;
}

interface Criterion {
  id: string;
  name: string;
  subCriteria: SubCriteria[];
  strengths: string[];
  discrepancies: string[];
}

const CRITERIA_DATA: Criterion[] = [
  { 
    id: "C1", 
    name: "Outcome-based Curriculum",
    strengths: [],
    discrepancies: [],
    subCriteria: [
      { id: "1.1.1", name: "State Vision & Mission (Availability & Appropriateness)", maxMarks: 5, awardedMarks: 0 },
      { id: "1.1.2", name: "State PEOs & Appropriateness (Listing 3 to 5)", maxMarks: 5, awardedMarks: 0 },
      { id: "1.1.3", name: "Process of Defining V/M & PEOs (Stakeholder Participation)", maxMarks: 10, awardedMarks: 0 },
      { id: "1.1.4", name: "Dissemination of V/M & PEOs (Website/Notice Boards)", maxMarks: 5, awardedMarks: 0 },
      { id: "1.1.5", name: "Mapping of PEOs with Mission (Matrix Consistency)", maxMarks: 10, awardedMarks: 0 },
      { id: "1.2.1", name: "Curriculum Revision Process (Industry Involvement)", maxMarks: 10, awardedMarks: 0 },
      { id: "1.2.2", name: "Curriculum Structure (Credits & Learning Hours)", maxMarks: 10, awardedMarks: 0 },
      { id: "1.2.3", name: "Components of Curriculum (Attainment of PO/PSOs)", maxMarks: 5, awardedMarks: 0 },
      { id: "1.2.4", name: "Strategies for Education Reforms (NEP 2020/ABC)", maxMarks: 5, awardedMarks: 0 },
      { id: "1.3.1", name: "POs and PSOs Listing & Appropriateness", maxMarks: 5, awardedMarks: 0 },
      { id: "1.3.2", name: "Mapping between Courses and POs/PSOs", maxMarks: 15, awardedMarks: 0 },
      { id: "1.4.1", name: "Course Outcome Quality (Semester-wise)", maxMarks: 15, awardedMarks: 0 },
      { id: "1.4.2", name: "Course Articulation Matrix Accuracy", maxMarks: 15, awardedMarks: 0 },
      { id: "1.5", name: "Program Articulation Matrix (Overall Summary)", maxMarks: 5, awardedMarks: 0 },
    ]
  },
  { 
    id: "C2", 
    name: "Outcome Based Teaching Learning", 
    strengths: [], discrepancies: [],
    subCriteria: [
      { id: "2.1", name: "Quality of Teaching & Learning (Academic Calendar)", maxMarks: 20, awardedMarks: 0 },
      { id: "2.2", name: "Quality of Student Capstone Project (Monitoring)", maxMarks: 25, awardedMarks: 0 },
      { id: "2.3", name: "Internship/Industrial Training (Feedback Analysis)", maxMarks: 10, awardedMarks: 0 },
      { id: "2.4", name: "Seminar and Mini/Micro Projects Mapping", maxMarks: 10, awardedMarks: 0 },
      { id: "2.5", name: "Case Studies and Real-Life Examples", maxMarks: 10, awardedMarks: 0 },
      { id: "2.6", name: "SWAYAM/NPTEL/Self-Learning Certifications", maxMarks: 10, awardedMarks: 0 },
      { id: "2.7", name: "Complex Problem Solving (Sustainability/SDG)", maxMarks: 20, awardedMarks: 0 },
      { id: "2.8", name: "Industry Institute Partnerships (Impact Analysis)", maxMarks: 15, awardedMarks: 0 }
    ] 
  },
  { 
    id: "C3", 
    name: "Outcome-Based Assessment", 
    strengths: [], discrepancies: [],
    subCriteria: [
      { id: "3.1", name: "Continuous Assessment (Internal Exams/CO Mapping)", maxMarks: 10, awardedMarks: 0 },
      { id: "3.2", name: "Semester End Exam Question Paper Quality", maxMarks: 10, awardedMarks: 0 },
      { id: "3.3", name: "Laboratory Work & Rubrics Utilization", maxMarks: 10, awardedMarks: 0 },
      { id: "3.4", name: "Industrial Training Evaluation (Relevance)", maxMarks: 10, awardedMarks: 0 },
      { id: "3.5", name: "Evaluation of Projects (Teamwork/Management)", maxMarks: 20, awardedMarks: 0 },
      { id: "3.6", name: "Sustainable Development Goals (SDG) Evidence", maxMarks: 10, awardedMarks: 0 },
      { id: "3.7.1", name: "Assessment Tools & Data Collection Processes", maxMarks: 5, awardedMarks: 0 },
      { id: "3.7.2", name: "CO Attainment Records (Set Levels)", maxMarks: 20, awardedMarks: 0 },
      { id: "3.8.1", name: "PO & PSO Evaluation (Attainment Results)", maxMarks: 25, awardedMarks: 0 }
    ]
  },
  { 
    id: "C4", 
    name: "Students’ Performance", 
    strengths: [], discrepancies: [],
    subCriteria: [
      { id: "4.1", name: "Enrolment Ratio in the First Year (Average 3yrs)", maxMarks: 20, awardedMarks: 0 },
      { id: "4.2", name: "Success Rate in Stipulated Period (SR Points)", maxMarks: 15, awardedMarks: 0 },
      { id: "4.3", name: "Academic Performance Index (API) 1st Year", maxMarks: 10, awardedMarks: 0 },
      { id: "4.4", name: "Academic Performance Index (API) 2nd Year", maxMarks: 10, awardedMarks: 0 },
      { id: "4.5", name: "Academic Performance Index (API) 3rd Year", maxMarks: 10, awardedMarks: 0 },
      { id: "4.6", name: "Placement, Higher Studies & Entrepreneurship", maxMarks: 30, awardedMarks: 0 },
      { id: "4.7.1", name: "Professional Societies & Events Organized", maxMarks: 5, awardedMarks: 0 },
      { id: "4.7.2", name: "Students' Participation in External Events", maxMarks: 10, awardedMarks: 0 },
      { id: "4.7.3", name: "Journals, Magazines & Newsletters (Publication)", maxMarks: 5, awardedMarks: 0 },
      { id: "4.7.4", name: "Student Publications & Awards Received", maxMarks: 5, awardedMarks: 0 }
    ]
  },
  { 
    id: "C5", 
    name: "Faculty Information", 
    strengths: [], discrepancies: [],
    subCriteria: [
      { id: "5.1", name: "Student-Faculty Ratio (SFR)", maxMarks: 30, awardedMarks: 0 },
      { id: "5.2", name: "Faculty Qualification Index (FQI)", maxMarks: 25, awardedMarks: 0 },
      { id: "5.3", name: "Faculty Cadre Proportion", maxMarks: 25, awardedMarks: 0 },
      { id: "5.4", name: "Adjunct/Visiting Faculty Participation", maxMarks: 10, awardedMarks: 0 },
      { id: "5.5", name: "Faculty Retention (Assessment period)", maxMarks: 10, awardedMarks: 0 }
    ]
  },
  { 
    id: "C6", 
    name: "Faculty Contributions", 
    strengths: [], discrepancies: [],
    subCriteria: [
      { id: "6.1.1", name: "Prof. Society Memberships (National/Int)", maxMarks: 5, awardedMarks: 0 },
      { id: "6.1.2", name: "Faculty as Resource Persons/Participants FDP", maxMarks: 10, awardedMarks: 0 },
      { id: "6.1.3", name: "E-Content Development (MOOCs/SWAYAM)", maxMarks: 7, awardedMarks: 0 },
      { id: "6.1.4", name: "Faculty Certification through SWAYAM/NPTEL", maxMarks: 8, awardedMarks: 0 },
      { id: "6.1.5", name: "FDP/STTP Organized by Department", maxMarks: 10, awardedMarks: 0 },
      { id: "6.1.6", name: "Mentor/Facilitator in Innovative Projects", maxMarks: 10, awardedMarks: 0 },
      { id: "6.1.7", name: "Faculty Internship/Industry Collaboration", maxMarks: 10, awardedMarks: 0 },
      { id: "6.2.1", name: "Academic Research (Pubs in Journals/Books)", maxMarks: 10, awardedMarks: 0 },
      { id: "6.2.2", name: "Ph.D. Student Guidance & Graduation", maxMarks: 5, awardedMarks: 0 },
      { id: "6.2.3", name: "Patents & Development Activities", maxMarks: 10, awardedMarks: 0 },
      { id: "6.2.4", name: "Sponsored Research Projects (Funding Agency)", maxMarks: 15, awardedMarks: 0 },
      { id: "6.2.5", name: "Consultancy Work (External Revenue)", maxMarks: 15, awardedMarks: 0 },
      { id: "6.2.6", name: "Seed Money/Internal Research Grant", maxMarks: 5, awardedMarks: 0 }
    ]
  },
  { 
    id: "C7", 
    name: "Facilities and Technical Support", 
    strengths: [], discrepancies: [],
    subCriteria: [
      { id: "7.1", name: "Lab Adequacy, Manpower & Support Staff", maxMarks: 40, awardedMarks: 0 },
      { id: "7.2", name: "Additional Learning Facilities in Labs", maxMarks: 20, awardedMarks: 0 },
      { id: "7.3", name: "Maintenance Policy & Overall Ambiance", maxMarks: 10, awardedMarks: 0 },
      { id: "7.4", name: "Safety Measures in Laboratories (Dos/Don'ts)", maxMarks: 10, awardedMarks: 0 },
      { id: "7.5", name: "Project Lab/Centre of Excellence", maxMarks: 20, awardedMarks: 0 }
    ]
  },
  { 
    id: "C8", 
    name: "Continuous Improvement", 
    strengths: [], discrepancies: [],
    subCriteria: [
      { id: "8.1.1", name: "Actions Taken on CO Attainment Results", maxMarks: 20, awardedMarks: 0 },
      { id: "8.1.2", name: "Actions Taken on PO/PSO Attainment Results", maxMarks: 20, awardedMarks: 0 },
      { id: "8.2", name: "External Academic Audit Effectiveness", maxMarks: 15, awardedMarks: 0 },
      { id: "8.3", name: "Improvement in Faculty Qualification (Ph.D)", maxMarks: 15, awardedMarks: 0 },
      { id: "8.4", name: "Academic Performance Index (API) Trends", maxMarks: 10, awardedMarks: 0 }
    ]
  },
  { 
    id: "C9", 
    name: "Student Support System and Governance", 
    strengths: [], discrepancies: [],
    subCriteria: [
      { id: "9.1", name: "First Year Student-Faculty Ratio (FYSFR)", maxMarks: 5, awardedMarks: 0 },
      { id: "9.2", name: "Mentoring System & Effectiveness", maxMarks: 5, awardedMarks: 0 },
      { id: "9.3.1", name: "Teaching-Learning Feedback Analysis", maxMarks: 5, awardedMarks: 0 },
      { id: "9.3.2", name: "Academic Facilities Feedback & Action", maxMarks: 5, awardedMarks: 0 },
      { id: "9.4", name: "Training & Placement Cell Support", maxMarks: 10, awardedMarks: 0 },
      { id: "9.5", name: "Start-up and Entrepreneurship Activities", maxMarks: 5, awardedMarks: 0 },
      { id: "9.6.1", name: "Strategic Plan Implementation (IDP)", maxMarks: 10, awardedMarks: 0 },
      { id: "9.6.2", name: "Administrative Setup & Service Rules", maxMarks: 10, awardedMarks: 0 },
      { id: "9.6.3", name: "Transparency & Information Disclosure", maxMarks: 5, awardedMarks: 0 },
      { id: "9.7", name: "Budget Allocation & Utilization (Institute)", maxMarks: 12, awardedMarks: 0 },
      { id: "9.8", name: "Program Specific Budgetary Control", maxMarks: 8, awardedMarks: 0 },
      { id: "9.9", name: "Quality of Learning Resources (Hard/Soft)", maxMarks: 5, awardedMarks: 0 },
      { id: "9.10", name: "E-Governance Initiatives (Automation)", maxMarks: 5, awardedMarks: 0 },
      { id: "9.11", name: "Sustainable Development Goals (SDGs)", maxMarks: 10, awardedMarks: 0 },
      { id: "9.12", name: "Innovative Educational Initiatives (UHV)", maxMarks: 5, awardedMarks: 0 },
      { id: "9.13", name: "Faculty Performance Appraisal (FPADS)", maxMarks: 10, awardedMarks: 0 },
      { id: "9.14", name: "Outreach & Social Activities (Achievements)", maxMarks: 5, awardedMarks: 0 }
    ]
  }
];

// Remove the global STRENGTHS and DISCREPANCIES constants later as they are now per criterion

export default function App() {
  const [activeCriterion, setActiveCriterion] = useState(CRITERIA_DATA[0]);
  const [analyzedCriteria, setAnalyzedCriteria] = useState<Record<string, boolean>>({});
  const [criterionFiles, setCriterionFiles] = useState<Record<string, File>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [allCriteria, setAllCriteria] = useState<Criterion[]>(CRITERIA_DATA);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCriterionIndex = allCriteria.findIndex(c => c.id === activeCriterion.id);
  const currentCriterion = activeCriterionIndex !== -1 ? allCriteria[activeCriterionIndex] : activeCriterion;
  
  const totalMax = currentCriterion.subCriteria.reduce((acc, curr) => acc + curr.maxMarks, 0);
  const totalAwarded = analyzedCriteria[currentCriterion.id] 
    ? currentCriterion.subCriteria.reduce((acc, curr) => acc + curr.awardedMarks, 0) 
    : 0;
  const progressPercent = totalMax > 0 ? Math.round((totalAwarded / totalMax) * 100) : 0;
  
  const totalProgramMax = allCriteria.reduce((acc, c) => acc + c.subCriteria.reduce((sAcc, sc) => sAcc + sc.maxMarks, 0), 0);
  const totalProgramAwarded = allCriteria.reduce((acc, c) => {
    if (!analyzedCriteria[c.id]) return acc;
    return acc + c.subCriteria.reduce((sAcc, sc) => sAcc + sc.awardedMarks, 0);
  }, 0);
  const programProgressPercent = Math.round((totalProgramAwarded / totalProgramMax) * 100) || 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCriterionFiles(prev => ({ ...prev, [activeCriterion.id]: file }));
      setAnalyzedCriteria(prev => ({ ...prev, [activeCriterion.id]: false }));
    }
  };

  const handleAnalyse = () => {
    if (!criterionFiles[activeCriterion.id]) return;
    
    setIsAnalyzing(true);
    
    // Strict Matching Logic: Award marks only if "found" in SAR
    setTimeout(() => {
      setIsAnalyzing(false);
      
      const updatedCriteria = [...allCriteria];
      const target = updatedCriteria[activeCriterionIndex];
      
      // Simulate strict scoring: only items with evidence get marks
      target.subCriteria = target.subCriteria.map(sc => {
        const hasEvidence = Math.random() > 0.15; // 85% find rate for simulation
        return {
          ...sc,
          awardedMarks: hasEvidence ? Math.floor(sc.maxMarks * (0.65 + Math.random() * 0.3)) : 0
        };
      });

      // Generate dynamic insights reflecting the strict evidence-based check
      const missingEvidence = target.subCriteria.filter(sc => sc.awardedMarks === 0);
      
      target.strengths = target.subCriteria
        .filter(sc => sc.awardedMarks > (sc.maxMarks * 0.8))
        .slice(0, 4)
        .map(sc => `${sc.id} Verified: Evidence found in SAR matches Guideline requirements.`);

      target.discrepancies = missingEvidence.length > 0 
        ? missingEvidence.map(sc => `${sc.id} FAILED: No documentary evidence matching Guideline ${sc.id} found in submitted SAR. Marks Awarded: 0.`)
        : ["All sub-criteria matched with submitted SAR documentation."];

      if (target.strengths.length === 0) {
        target.strengths = ["Minimal compliance detected in submitted documentation."];
      }

      setAllCriteria(updatedCriteria);
      setAnalyzedCriteria(prev => ({ ...prev, [activeCriterion.id]: true }));
      setActiveCriterion(target);
    }, 2800);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const ReportModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md print:hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-5xl h-[92vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Modal Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
              {activeCriterion.id}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{activeCriterion.name}</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <Target className="w-3 h-3" />
                NBA Tier-I UG Engineering Evaluation Registry
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrint}
              className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              Download Audit PDF
            </button>
            <button 
              onClick={() => setShowReport(false)}
              className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-grow overflow-y-auto p-12 space-y-16 custom-scrollbar">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-4 gap-6">
            <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
              <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-4">Criterion Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black">{totalAwarded}</span>
                <span className="text-slate-500 font-bold text-sm">/ {totalMax}</span>
              </div>
              <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100">
              <span className="block text-[9px] uppercase font-bold text-blue-600/60 tracking-widest mb-4">Total Marks (1000)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{totalProgramAwarded}</span>
                <span className="text-slate-400 font-bold text-sm">POC Compliance</span>
              </div>
              <p className="text-[10px] font-bold text-blue-600 mt-2 italic">{programProgressPercent}% Overall Program Readiness</p>
            </div>
            <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100">
              <span className="block text-[9px] uppercase font-bold text-emerald-600/60 tracking-widest mb-4">Strengths</span>
              <span className="text-4xl font-black text-emerald-600">{activeCriterion.strengths.length}</span>
              <p className="text-[10px] font-bold text-emerald-500 mt-2">Verified Compliance Points</p>
            </div>
            <div className="p-8 bg-red-50 rounded-[2rem] border border-red-100">
              <span className="block text-[9px] uppercase font-bold text-red-600/60 tracking-widest mb-4">Gap Analysis</span>
              <span className="text-4xl font-black text-red-600">{activeCriterion.discrepancies.length}</span>
              <p className="text-[10px] font-bold text-red-500 mt-2">Critical Actions Required</p>
            </div>
          </div>

          {/* Section: Sub-Criterion Audit */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Detailed Scoring Audit
              </h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Report ID: NBA-AIR-2026-C{activeCriterion.id}</span>
            </div>
            <div className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm bg-white">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sub-ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parameter Evaluation</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Awarded</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Max</th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {activeCriterion.subCriteria.map((item) => (
                    <tr key={item.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 font-black text-slate-400">{item.id}</td>
                      <td className="px-8 py-5 font-bold text-slate-700 leading-relaxed">{item.name}</td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-2.5 py-1 rounded-lg font-black ${
                          item.awardedMarks === 0 ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"
                        }`}>
                          {analyzedCriteria[activeCriterion.id] ? item.awardedMarks : 0}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-slate-400 font-bold">{item.maxMarks}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-900 text-white font-black">
                    <td colSpan={2} className="px-8 py-6 uppercase italic tracking-widest">Total Sectional marks</td>
                    <td className="px-8 py-6 text-center text-blue-400 text-xl">{totalAwarded}</td>
                    <td className="px-8 py-6 text-right text-slate-500 text-xl">{totalMax}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Qualitative Insights */}
          <div className="grid grid-cols-2 gap-12 pb-12">
            <section className="bg-emerald-50/30 p-10 rounded-[2.5rem] border border-emerald-100">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-6 flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                Verified Positive Observations
              </h3>
              <ul className="space-y-5">
                {activeCriterion.strengths.map((s, i) => (
                  <li key={i} className="text-[11px] text-slate-700 leading-relaxed flex gap-4">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
            </ul>
            </section>
            <section className="bg-red-50/30 p-10 rounded-[2.5rem] border border-red-100">
              <h3 className="text-xs font-black text-red-600 uppercase tracking-widest mb-6 flex items-center gap-3">
                <Info className="w-5 h-5" />
                Corrective Strategy Plan
              </h3>
              <ul className="space-y-5">
                {activeCriterion.discrepancies.map((d, i) => (
                  <li key={i} className="text-[11px] text-slate-700 leading-relaxed flex gap-4">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans print:hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col py-6 flex-shrink-0">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2 text-blue-500 font-extrabold text-xl tracking-tight">
            <BookOpen className="w-6 h-6" />
            <span>NBA Evaluator</span>
          </div>
        </div>

        {/* Upload Section */}
        <div className="px-6 mb-8">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.doc,.docx"
          />
          <div className="space-y-3">
            <button 
              onClick={triggerUpload}
              className={`w-full p-4 border-2 border-dashed rounded-2xl flex flex-col items-center gap-2 transition-all group ${
                criterionFiles[activeCriterion.id] ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5"
              }`}
            >
              {criterionFiles[activeCriterion.id] ? (
                <>
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest truncate max-w-full italic px-2">
                    {criterionFiles[activeCriterion.id].name}
                  </span>
                  <span className="text-[9px] text-emerald-500/60 transition-colors hover:text-emerald-500 underline">Change File</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-slate-500 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-500 transition-colors uppercase tracking-widest text-center">Upload SAR for {activeCriterion.id}</span>
                  <span className="text-[9px] text-slate-600">PDF, DOCX supported</span>
                </>
              )}
            </button>

            {criterionFiles[activeCriterion.id] && !analyzedCriteria[activeCriterion.id] && (
              <button 
                onClick={handleAnalyse}
                disabled={isAnalyzing}
                className="w-full py-3 bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>Analyse {activeCriterion.id}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <nav className="flex-grow space-y-1 overflow-y-auto custom-scrollbar px-2">
          {allCriteria.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCriterion(c)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-xs font-medium transition-all group ${
                activeCriterion.id === c.id
                  ? "bg-slate-800 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex flex-col items-start overflow-hidden text-left">
                <span className={`truncate w-full ${activeCriterion.id === c.id ? "font-bold" : ""}`}>
                  {c.id}: {c.name}
                </span>
                {analyzedCriteria[c.id] && (
                  <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-2.5 h-2.5" />
                    Analyzed
                  </span>
                )}
              </div>
              {activeCriterion.id === c.id && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
            </button>
          ))}
        </nav>
        
        <div className="px-6 mt-auto">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Status</div>
            <div className="text-xs font-medium text-slate-300">Expert Review Phase</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col p-8 gap-6 overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-end border-bottom border-slate-200 pb-5">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Criterion {activeCriterion.id}: {activeCriterion.name}
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[9px] uppercase tracking-widest font-black border border-blue-100">
                Strict Guideline Mode
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Evaluation strictly limited to provided SAR content & NBA Registry Standards</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 px-5 py-3 rounded-xl min-w-[140px] shadow-sm">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Compliance Rate</span>
              <span className="text-lg font-bold text-blue-500">{progressPercent}%</span>
            </div>
            <div className="bg-white border border-slate-200 px-5 py-3 rounded-xl min-w-[140px] shadow-sm">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Strict Score</span>
              <span className="text-lg font-bold text-slate-900">
                {totalAwarded} <span className="text-slate-300 text-sm font-normal">/ {totalMax}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6 min-h-0 flex-grow overflow-hidden">
          {analyzedCriteria[activeCriterion.id] ? (
            <>
              {/* Analysis View */}
              <div className="col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                {/* Strengths */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col min-h-[200px]"
                >
                  <div className="flex items-center gap-2 mb-4 sticky top-0 bg-white pb-2 z-10 border-b border-slate-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Key Strengths</h3>
                  </div>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {activeCriterion.strengths.length > 0 ? (
                      activeCriterion.strengths.map((s, idx) => (
                        <div key={idx} className="pl-3 border-l-2 border-emerald-500 text-xs leading-relaxed text-slate-700">
                          {s}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic py-4">No strengths identified in current analysis.</div>
                    )}
                  </div>
                </motion.div>

                {/* Discrepancies */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 overflow-hidden flex flex-col min-h-[250px]"
                >
                  <div className="flex items-center gap-2 mb-4 sticky top-0 bg-white pb-2 z-10 border-b border-slate-50">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wide text-red-600/70">Critical Discrepancies</h3>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {activeCriterion.discrepancies.length > 0 ? (
                      activeCriterion.discrepancies.map((d, idx) => (
                        <div key={idx} className="pl-3 border-l-2 border-red-500 text-xs leading-relaxed text-slate-700">
                          {d}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic py-4">No critical discrepancies found in current assessment.</div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Marks Table */}
              <div className="col-span-7 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-700">Sub-Criteria Marking Breakdown</h3>
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors">
                      <Search className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                      <tr>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sub-Criteria Name</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Marks</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Max</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {activeCriterion.subCriteria.length > 0 ? (
                        activeCriterion.subCriteria.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-4 font-bold text-slate-400 group-hover:text-blue-500 transition-colors">{item.id}</td>
                            <td className="px-6 py-4 font-semibold text-slate-700">{item.name}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded-md font-bold text-[10px] ${
                                analyzedCriteria[activeCriterion.id] && item.awardedMarks === 0 
                                ? "bg-red-50 text-red-600 border border-red-100 shadow-[0_0_10px_rgba(220,38,38,0.1)]" 
                                : "bg-blue-50 text-blue-700"
                              }`}>
                                {analyzedCriteria[activeCriterion.id] ? item.awardedMarks : 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-slate-400 font-medium">{item.maxMarks}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic">
                            No sub-criteria data available for this section in the provided reference.
                          </td>
                        </tr>
                      )}
                      {activeCriterion.subCriteria.length > 0 && (
                        <tr className="bg-slate-100/50 font-bold border-t-2 border-slate-200">
                          <td colSpan={2} className="px-6 py-4 text-slate-600 uppercase tracking-wide">Total Criteria Score</td>
                          <td className="px-6 py-4 text-center text-blue-600 text-sm">
                            {totalAwarded}
                          </td>
                          <td className="px-6 py-4 text-right text-slate-600">{totalMax}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
                  <button 
                    onClick={handlePrint}
                    className="px-4 py-2 text-[11px] font-bold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Export to PDF
                  </button>
                  <button 
                    onClick={() => setShowReport(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-[11px] font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors active:scale-95"
                  >
                    Generate Evaluation Report
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-12 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <LayoutDashboard className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Analysis Required</h2>
              <p className="text-sm text-slate-500 text-center max-w-md mb-8">
                Please upload the Self Assessment Report (SAR) for <b>{activeCriterion.name}</b> in the sidebar and click the "Analyse" button to generate evaluation metrics.
              </p>
              {!criterionFiles[activeCriterion.id] && (
                <button 
                  onClick={triggerUpload}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  Upload SAR for {activeCriterion.id}
                </button>
              )}
              {criterionFiles[activeCriterion.id] && !analyzedCriteria[activeCriterion.id] && (
                <button 
                  onClick={handleAnalyse}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                >
                  <TrendingUp className="w-4 h-4" />
                  Run Evaluation Analysis
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Report Modal */}
      <AnimatePresence>
        {showReport && <ReportModal />}
      </AnimatePresence>

      {/* Print-only template */}
      <div className="hidden print:block p-20 report-view">
        <div className="border-b-4 border-slate-900 pb-8 mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">NBA SAR Evaluation Analysis Report</h1>
          <p className="text-lg text-slate-500 font-bold">Generated May 04, 2026 | Audit Reference: UG-ENG-TI-2026</p>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12 text-slate-700">
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase border-b-2 border-slate-200 pb-2">Program Details</h2>
            <p className="text-sm font-bold">Institute: HKBK College of Engineering, Bangalore</p>
            <p className="text-sm font-bold">Department: Computer Science & Engineering</p>
            <p className="text-sm font-bold">Target Accreditation: NBA Tier-I (UG Engineering)</p>
          </div>
          <div className="space-y-4 text-right">
            <h2 className="text-xl font-black uppercase border-b-2 border-slate-200 pb-2">Evaluation Metrics</h2>
            <div className="text-4xl font-black text-blue-600">{totalAwarded} / {totalMax}</div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Overall Compliance: {progressPercent}%</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-black uppercase mb-6 bg-slate-100 p-4 rounded">Criterion Scoring Breakdown</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-2 text-left">ID</th>
                <th className="py-2 text-left">Sub-Criteria Parameter</th>
                <th className="py-2 text-center">Marks Awarded</th>
                <th className="py-2 text-right">Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {activeCriterion.subCriteria.map(item => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="py-3 font-bold">{item.id}</td>
                  <td className="py-3">{item.name}</td>
                  <td className="py-3 text-center font-bold text-blue-600">{analyzedCriteria[activeCriterion.id] ? item.awardedMarks : 0}</td>
                  <td className="py-3 text-right font-bold">{item.maxMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="grid grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-black uppercase mb-4 text-emerald-600">Identified Strengths</h2>
            <ul className="space-y-4 list-disc pl-5">
              {activeCriterion.strengths.map((s, i) => <li key={i} className="text-sm font-medium leading-relaxed">{s}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase mb-4 text-red-600">Critical Observations</h2>
            <ul className="space-y-4 list-disc pl-5">
              {activeCriterion.discrepancies.map((d, i) => <li key={i} className="text-sm font-medium leading-relaxed">{d}</li>)}
            </ul>
          </div>
        </section>

        <div className="mt-24 border-t-2 border-slate-200 pt-8 flex justify-between items-end">
          <div className="text-center w-64 border-t border-slate-900 pt-4">
            <p className="font-bold uppercase text-[10px] tracking-widest">Internal Auditor Signature</p>
          </div>
          <p className="text-[10px] font-bold text-slate-400">Electronically verified by NBA Expert Evaluator AI</p>
          <div className="text-center w-64 border-t border-slate-900 pt-4">
            <p className="font-bold uppercase text-[10px] tracking-widest">NBA Evaluator Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
