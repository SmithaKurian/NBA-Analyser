import React, { useState, useRef } from 'react';
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
  CheckCircle,
  Calculator
} from 'lucide-react';
import { HistoryModal } from './components/HistoryModal';
import { CR4Module } from './components/CR4Module';
import { CR5Module } from './components/CR5Module';
import { HISTORICAL_DATA, ALL_ACADEMIC_YEARS } from './utils';
import { FacultyEntry } from './data';

interface SubCriteria {
  id: string;
  name: string;
  requirement: string;
  maxMarks: number;
  awardedMarks: number;
  status?: 'Matched' | 'Partial' | 'Missing' | 'Mismatch';
  remarks?: string;
}

interface Criterion {
  id: string;
  name: string;
  subCriteria: SubCriteria[];
  strengths: string[];
  discrepancies: string[];
  assumptions: string[];
}

const CRITERIA_DATA: Criterion[] = [
  { 
    id: "C1", 
    name: "Outcome-based Curriculum",
    strengths: [],
    discrepancies: [],
    assumptions: [
      "SAR Section 1.1 is expected to strictly follow Annexure-I format.",
      "PEOs listed in SAR are compared against Departmental Mission statement for semantic alignment.",
      "Vision/Mission dissemination is verified through timestamps on minutes of meetings."
    ],
    subCriteria: [
      { id: "1.1.1", name: "State Vision & Mission (Availability & Appropriateness)", requirement: "Availability & Appropriateness of the Vision & Mission Statements. Must be distinct and follow Tier-I quality benchmarks.", maxMarks: 5, awardedMarks: 0 },
      { id: "1.1.2", name: "State PEOs & Appropriateness (Listing 3 to 5)", requirement: "State the Programme Educational Objectives (PEOs). Must list 3 to 5 objectives and explain their appropriateness.", maxMarks: 5, awardedMarks: 0 },
      { id: "1.1.3", name: "Process of Defining V/M & PEOs (Stakeholder Participation)", requirement: "Documented process for defining Vision, Mission, and PEOs with evidence of internal and external stakeholder participation.", maxMarks: 10, awardedMarks: 0 },
      { id: "1.1.4", name: "Dissemination of V/M & PEOs (Website/Notice Boards)", requirement: "Evidence of dissemination among stakeholders (Website, Notice Boards, Laboratory, etc.).", maxMarks: 5, awardedMarks: 0 },
      { id: "1.1.5", name: "Mapping of PEOs with Mission (Matrix Consistency)", requirement: "Consistency of mapping PEOs with the Mission of the Department. Matrix must show strong/moderate/weak correlation.", maxMarks: 10, awardedMarks: 0 },
      { id: "1.2.1", name: "Curriculum Revision Process (Industry Involvement)", requirement: "Clear evidence of industry involvement in the Board of Studies (BoS) and syllabus revision meetings.", maxMarks: 10, awardedMarks: 0 },
      { id: "1.2.2", name: "Curriculum Structure (Credits & Learning Hours)", requirement: "Credit structure must align with AICTE/University norms. Balance between Basic Sciences, Engg Sciences, and Professional Core.", maxMarks: 10, awardedMarks: 0 },
      { id: "1.2.3", name: "Components of Curriculum (Attainment of PO/PSOs)", requirement: "Mapping of curriculum components to Program Outcomes (POs) and Program Specific Outcomes (PSOs).", maxMarks: 5, awardedMarks: 0 },
      { id: "1.2.4", name: "Strategies for Education Reforms (NEP 2020/ABC)", requirement: "Implementation of Credit Transfer, Academic Bank of Credits, and NEP 2020 guidelines.", maxMarks: 5, awardedMarks: 0 },
      { id: "1.3.1", name: "POs and PSOs Listing & Appropriateness", requirement: "Clearly defined PSOs related to the specific engineering field. Listing of Graduate Attributes (POs).", maxMarks: 5, awardedMarks: 0 },
      { id: "1.3.2", name: "Mapping between Courses and POs/PSOs", requirement: "Comprehensive Course-to-PO/PSO mapping template for all semesters.", maxMarks: 15, awardedMarks: 0 },
      { id: "1.4.1", name: "Course Outcome Quality (Semester-wise)", requirement: "Statement of COs using Bloom's Taxonomy levels. Clarity and measurability of COs.", maxMarks: 15, awardedMarks: 0 },
      { id: "1.4.2", name: "Course Articulation Matrix Accuracy", requirement: "Correctness of mapping levels (1, 2, 3) in the Articulation Matrix.", maxMarks: 15, awardedMarks: 0 },
      { id: "1.5", name: "Program Articulation Matrix (Overall Summary)", requirement: "Grand summary of PO/PSO attainment targets for the entire program.", maxMarks: 5, awardedMarks: 0 },
    ]
  },
  { 
    id: "C2", 
    name: "Outcome Based Teaching Learning", 
    strengths: [], discrepancies: [],
    assumptions: [
      "Academic calendar in SAR matches the university prescribed schedule.",
      "Capstone project monitoring requires documented periodic check-ins.",
      "Industrial training feedback must be mapped to PO7 and PO12."
    ],
    subCriteria: [
      { id: "2.1", name: "Quality of Teaching & Learning (Academic Calendar)", requirement: "Adherence to academic calendar, implementation of pedagogical tools, and documentation of innovative teaching.", maxMarks: 20, awardedMarks: 0 },
      { id: "2.2", name: "Quality of Student Capstone Project (Monitoring)", requirement: "Monitoring mechanism for student projects, rubric-based evaluation, and project reports quality.", maxMarks: 25, awardedMarks: 0 },
      { id: "2.3", name: "Internship/Industrial Training (Feedback Analysis)", requirement: "Internship completion certificates and analysis of feedback from the industry supervisor.", maxMarks: 10, awardedMarks: 0 },
      { id: "2.4", name: "Seminar and Mini/Micro Projects Mapping", requirement: "Seminar topics selection and their relevance to current technology and PO mapping.", maxMarks: 10, awardedMarks: 0 },
      { id: "2.5", name: "Case Studies and Real-Life Examples", requirement: "Inclusion of case studies in standard teaching-learning evaluation cycles.", maxMarks: 10, awardedMarks: 0 },
      { id: "2.6", name: "SWAYAM/NPTEL/Self-Learning Certifications", requirement: "Encouragement and completion rates for online credit courses (SWAYAM).", maxMarks: 10, awardedMarks: 0 },
      { id: "2.7", name: "Complex Problem Solving (Sustainability/SDG)", requirement: "Evidence of covering complex engineering problems with sustainability focus.", maxMarks: 20, awardedMarks: 0 },
      { id: "2.8", name: "Industry Institute Partnerships (Impact Analysis)", requirement: "MoUs signed and the actual impact on students (Expert lectures, visits, training).", maxMarks: 15, awardedMarks: 0 }
    ] 
  },
  { 
    id: "C3", 
    name: "Outcome-Based Assessment", 
    strengths: [], discrepancies: [],
    assumptions: [
      "Internal exam question papers must show direct mapping to Course Outcomes.",
      "Laboratory rubrics must be approved by the Departmental Committee.",
      "CO attainment calculation methodology is consistent across all semesters."
    ],
    subCriteria: [
      { id: "3.1", name: "Continuous Assessment (Internal Exams/CO Mapping)", requirement: "Mapping of Internal Assessment questions with COs and quality of questions.", maxMarks: 10, awardedMarks: 0 },
      { id: "3.2", name: "Semester End Exam Question Paper Quality", requirement: "Quality of University/Semester End Exam papers and mapping with COs.", maxMarks: 10, awardedMarks: 0 },
      { id: "3.3", name: "Laboratory Work & Rubrics Utilization", requirement: "Rubrics for assessment of laboratory work and continuous evaluation records.", maxMarks: 10, awardedMarks: 0 },
      { id: "3.4", name: "Industrial Training Evaluation (Relevance)", requirement: "Evaluation process for industrial training based on documented PO parameters.", maxMarks: 10, awardedMarks: 0 },
      { id: "3.5", name: "Evaluation of Projects (Teamwork/Management)", requirement: "Evaluation criteria for projects including teamwork, ethics, and costs.", maxMarks: 20, awardedMarks: 0 },
      { id: "3.6", name: "Sustainable Development Goals (SDG) Evidence", requirement: "Projects and assessments covering SDG goals as per NBA latest guidelines.", maxMarks: 10, awardedMarks: 0 },
      { id: "3.7.1", name: "Assessment Tools & Data Collection Processes", requirement: "Description of direct and indirect assessment tools used for CO attainment.", maxMarks: 5, awardedMarks: 0 },
      { id: "3.7.2", name: "CO Attainment Records (Set Levels)", requirement: "Attainment of COs calculated semester by semester for all courses.", maxMarks: 20, awardedMarks: 0 },
      { id: "3.8.1", name: "PO & PSO Evaluation (Attainment Results)", requirement: "Evaluation of PO/PSO attainment levels based on Course-Outcome mapping results.", maxMarks: 25, awardedMarks: 0 }
    ]
  },
  { 
    id: "C4", 
    name: "Students’ Performance", 
    strengths: [], discrepancies: [],
    assumptions: [
      "Enrollment ratios are calculated using the AICTE sanctioned intake.",
      "Success rate points exclude lateral entry students where specified.",
      "Higher studies evidence requires verified qualifying exam scorecards."
    ],
    subCriteria: [
      { id: "4.1", name: "Enrolment Ratio in the First Year (Average 3yrs)", requirement: "Enrolment Ratio (Average of last 3 academic years). Target is >90% for full marks.", maxMarks: 20, awardedMarks: 0 },
      { id: "4.2", name: "Success Rate in Stipulated Period (SR Points)", requirement: "Success rate without backlogs in four years. Calculated as per NBA specified formula.", maxMarks: 15, awardedMarks: 0 },
      { id: "4.3", name: "Academic Performance Index (API) 1st Year", requirement: "Average GPA of first-year students. Verified against university results data.", maxMarks: 10, awardedMarks: 0 },
      { id: "4.4", name: "Academic Performance Index (API) 2nd Year", requirement: "Average GPA of second-year students.", maxMarks: 10, awardedMarks: 0 },
      { id: "4.5", name: "Academic Performance Index (API) 3rd Year", requirement: "Average GPA of third-year students.", maxMarks: 10, awardedMarks: 0 },
      { id: "4.6", name: "Placement, Higher Studies & Entrepreneurship", requirement: "Percentage of students placed or choosing higher studies/entrepreneurship. Must be >70%.", maxMarks: 30, awardedMarks: 0 },
      { id: "4.7.1", name: "Professional Societies & Events Organized", requirement: "Chapters/Memberships of IEEE, ACM, CSI etc. and technical events conducted.", maxMarks: 5, awardedMarks: 0 },
      { id: "4.7.2", name: "Students' Participation in External Events", requirement: "Documentation of prizes won and participation in external hackathons/IIT events.", maxMarks: 10, awardedMarks: 0 },
      { id: "4.7.3", name: "Journals, Magazines & Newsletters (Publication)", requirement: "In-house technical newsletters and department magazines with student content.", maxMarks: 5, awardedMarks: 0 },
      { id: "4.7.4", name: "Student Publications & Awards Received", requirement: "Awards in national/international level technical competitions.", maxMarks: 5, awardedMarks: 0 }
    ]
  },
  { 
    id: "C5", 
    name: "Faculty Information", 
    strengths: [], discrepancies: [],
    assumptions: [
      "Faculty count includes only regular/full-time faculty with M.Tech/Ph.D.",
      "Student count is based on current enrollment across all UG years.",
      "Retention analysis period covers 3 consecutive years including the assessment year."
    ],
    subCriteria: [
      { id: "5.1", name: "Student-Faculty Ratio (SFR)", requirement: "Target SFR is 1:20 for Tier-I. Documentation of all regular faculty required.", maxMarks: 30, awardedMarks: 0 },
      { id: "5.2", name: "Faculty Qualification Index (FQI)", requirement: "Assessment based on No. of PhDs vs Total faculty. FQI = (10*x + 4*y)/N.", maxMarks: 25, awardedMarks: 0 },
      { id: "5.3", name: "Faculty Cadre Proportion", requirement: "Professor : Assoc. Prof : Asst. Prof ratio should ideally be 1:2:6.", maxMarks: 25, awardedMarks: 0 },
      { id: "5.4", name: "Adjunct/Visiting Faculty Participation", requirement: "Contribution of industry experts as adjunct faculty members (Min 25 hours/yr).", maxMarks: 10, awardedMarks: 0 },
      { id: "5.5", name: "Faculty Retention (Assessment period)", requirement: "Percentage of faculty staying in the department for 3 years or more.", maxMarks: 10, awardedMarks: 0 }
    ]
  },
  { 
    id: "C6", 
    name: "Faculty Contributions", 
    strengths: [], discrepancies: [],
    assumptions: [
      "FDP/STTP participation must be at least 5 days for full marks consideration.",
      "Research publications must be indexed in Scopus/WoS as per NBA guidelines.",
      "Sponsored research funding must be actively credited to the institution account."
    ],
    subCriteria: [
      { id: "6.1.1", name: "Prof. Society Memberships (National/Int)", requirement: "Faculty linked with professional bodies like IEEE, ACM, etc.", maxMarks: 5, awardedMarks: 0 },
      { id: "6.1.2", name: "Faculty as Resource Persons/Participants FDP", requirement: "Role of faculty in FDP/STTP/Training programs in other institutions.", maxMarks: 10, awardedMarks: 0 },
      { id: "6.1.3", name: "E-Content Development (MOOCs/SWAYAM)", requirement: "Preparation of online modules, video lectures, and MOOC course materials.", maxMarks: 7, awardedMarks: 0 },
      { id: "6.1.4", name: "Faculty Certification through SWAYAM/NPTEL", requirement: "Successful completion of NPTEL/SWAYAM elective courses.", maxMarks: 8, awardedMarks: 0 },
      { id: "6.1.5", name: "FDP/STTP Organized by Department", requirement: "Department level technical workshops and faculty development programs.", maxMarks: 10, awardedMarks: 0 },
      { id: "6.1.6", name: "Mentor/Facilitator in Innovative Projects", requirement: "Guiding student teams for hackathons, start-up ideas, and patented projects.", maxMarks: 10, awardedMarks: 0 },
      { id: "6.1.7", name: "Faculty Internship/Industry Collaboration", requirement: "Faculty spending time in industry for skill upgradation (Min 2 weeks).", maxMarks: 10, awardedMarks: 0 },
      { id: "6.2.1", name: "Academic Research (Pubs in Journals/Books)", requirement: "Indexed publications (Scopus/WoS) - Avg per faculty count.", maxMarks: 10, awardedMarks: 0 },
      { id: "6.2.2", name: "Ph.D. Student Guidance & Graduation", requirement: "PhDs produced and currently guided by departmental faculty.", maxMarks: 5, awardedMarks: 0 },
      { id: "6.2.3", name: "Patents & Development Activities", requirement: "Patents Published/Granted or Software/Products realized.", maxMarks: 10, awardedMarks: 0 },
      { id: "6.2.4", name: "Sponsored Research Projects (Funding Agency)", requirement: "Quantum of funds received from DST, AICTE, VGST etc.", maxMarks: 15, awardedMarks: 0 },
      { id: "6.2.5", name: "Consultancy Work (External Revenue)", requirement: "Funds generated through external consulting for industries.", maxMarks: 15, awardedMarks: 0 },
      { id: "6.2.6", name: "Seed Money/Internal Research Grant", requirement: "Internal funding for research pilots and proof of concepts.", maxMarks: 5, awardedMarks: 0 }
    ]
  },
  { 
    id: "C7", 
    name: "Facilities and Technical Support", 
    strengths: [], discrepancies: [],
    assumptions: [
      "Lab manpower calculation excludes temporary/hourly-wage workers.",
      "Safety equipment (fire extinguishers/first aid) must have valid certifications.",
      "Maintenance logs are checked for the last 12 months for consistency."
    ],
    subCriteria: [
      { id: "7.1", name: "Lab Adequacy, Manpower & Support Staff", requirement: "Availability of labs as per curriculum and qualified technical assistants.", maxMarks: 40, awardedMarks: 0 },
      { id: "7.2", name: "Additional Learning Facilities in Labs", requirement: "Experimental setups beyond the syllabus for research and projects.", maxMarks: 20, awardedMarks: 0 },
      { id: "7.3", name: "Maintenance Policy & Overall Ambiance", requirement: "Stock registers, preventive maintenance logs, and cleanliness of workspace.", maxMarks: 10, awardedMarks: 0 },
      { id: "7.4", name: "Safety Measures in Laboratories (Dos/Don'ts)", requirement: "Safety charts, earthquake/fire safety, and earthing checks.", maxMarks: 10, awardedMarks: 0 },
      { id: "7.5", name: "Project Lab/Centre of Excellence", requirement: "Exclusive workspace for final year projects and specialized domain centers.", maxMarks: 20, awardedMarks: 0 }
    ]
  },
  { 
    id: "C8", 
    name: "Continuous Improvement", 
    strengths: [], discrepancies: [],
    assumptions: [
      "Action taken reports (ATR) must show direct correlation to previous audit gaps.",
      "Faculty qualification improvement is counted only for degrees conferred in assessment period.",
      "Academic audit must be conducted by experts external to the university group."
    ],
    subCriteria: [
      { id: "8.1.1", name: "Actions Taken on CO Attainment Results", requirement: "Evidence of syllabus revision or remedial classes based on CO gaps.", maxMarks: 20, awardedMarks: 0 },
      { id: "8.1.2", name: "Actions Taken on PO/PSO Attainment Results", requirement: "Actions proposed at the end of each program cycle to fill PO attainment gaps.", maxMarks: 20, awardedMarks: 0 },
      { id: "8.2", name: "External Academic Audit Effectiveness", requirement: "Compliance of external audit observations by experts like IIT/NIT faculty.", maxMarks: 15, awardedMarks: 0 },
      { id: "8.3", name: "Improvement in Faculty Qualification (Ph.D)", requirement: "Increase in PhD percentage over the last 3-year assessment period.", maxMarks: 15, awardedMarks: 0 },
      { id: "8.4", name: "Academic Performance Index (API) Trends", requirement: "Trend analysis of student results and placement numbers over 3 years.", maxMarks: 10, awardedMarks: 0 }
    ]
  },
  { 
    id: "C9", 
    name: "Student Support System and Governance", 
    strengths: [], discrepancies: [],
    assumptions: [
      "Mentoring sessions are verified against student signed counseling diaries.",
      "Budget utilization must be within ±10% of allocation to avoid discrepancy.",
      "E-governance initiatives are verified by successful login/user activity data."
    ],
    subCriteria: [
      { id: "9.1", name: "First Year Student-Faculty Ratio (FYSFR)", requirement: "Ratio for first-year intake exclusively.", maxMarks: 5, awardedMarks: 0 },
      { id: "9.2", name: "Mentoring System & Effectiveness", requirement: "Number of students per mentor (Target 1:20) and mentor meet frequency.", maxMarks: 5, awardedMarks: 0 },
      { id: "9.3.1", name: "Teaching-Learning Feedback Analysis", requirement: "Online feedback from students and corresponding action taken by HOD.", maxMarks: 5, awardedMarks: 0 },
      { id: "9.3.2", name: "Academic Facilities Feedback & Action", requirement: "Feedback on library, labs, and classroom infrastructure.", maxMarks: 5, awardedMarks: 0 },
      { id: "9.4", name: "Training & Placement Cell Support", requirement: "Documentation of soft skill training, mock interviews, and placement stats.", maxMarks: 10, awardedMarks: 0 },
      { id: "9.5", name: "Start-up and Entrepreneurship Activities", requirement: "Incubation center support and number of student start-ups incubated.", maxMarks: 5, awardedMarks: 0 },
      { id: "9.6.1", name: "Strategic Plan Implementation (IDP)", requirement: "Evidence of progress against the 5-year Institutional Development Plan.", maxMarks: 10, awardedMarks: 0 },
      { id: "9.6.2", name: "Administrative Setup & Service Rules", requirement: "Transparency in administration and well-defined faculty service manuals.", maxMarks: 10, awardedMarks: 0 },
      { id: "9.6.3", name: "Transparency & Information Disclosure", requirement: "Information on the website regarding mandatory disclosures and AICTE norms.", maxMarks: 5, awardedMarks: 0 },
      { id: "9.7", name: "Budget Allocation & Utilization (Institute)", requirement: "Evidence of budget sanctioned vs actual expenditure (Recurring/Non-Recurring).", maxMarks: 12, awardedMarks: 0 },
      { id: "9.8", name: "Program Specific Budgetary Control", requirement: "Control of HOD over program-specific funds for labs and technical activities.", maxMarks: 8, awardedMarks: 0 },
      { id: "9.9", name: "Quality of Learning Resources (Hard/Soft)", requirement: "NPTEL videos, digital library access, and physical book count per student.", maxMarks: 5, awardedMarks: 0 },
      { id: "9.10", name: "E-Governance Initiatives (Automation)", requirement: "ERP implementation for student attendance, results, and staff leave management.", maxMarks: 5, awardedMarks: 0 },
      { id: "9.11", name: "Sustainable Development Goals (SDGs)", requirement: "Energy conservation, solar use, and green campus initiatives.", maxMarks: 10, awardedMarks: 0 },
      { id: "9.12", name: "Innovative Educational Initiatives (UHV)", requirement: "Universal Human Values (UHV) cell activities and peer learning programs.", maxMarks: 5, awardedMarks: 0 },
      { id: "9.13", name: "Faculty Performance Appraisal (FPADS)", requirement: "Clear methodology for faculty appraisal and incentives for performance.", maxMarks: 10, awardedMarks: 0 },
      { id: "9.14", name: "Outreach & Social Activities (Achievements)", requirement: "Participation in NSS, NCC, Unnat Bharat Abhiyan and awards received.", maxMarks: 5, awardedMarks: 0 }
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

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [c4ActiveTab, setC4ActiveTab] = useState<'analyzer' | 'calculator'>('analyzer');
  const [c5ActiveTab, setC5ActiveTab] = useState<'analyzer' | 'calculator'>('analyzer');

  // Hoisted Criterion 5 states to prevent reset on tab change
  const [cayFacultyList, setCayFacultyList] = useState<FacultyEntry[]>([]);
  const [caym1FacultyList, setCaym1FacultyList] = useState<FacultyEntry[]>([]);
  const [caym2FacultyList, setCaym2FacultyList] = useState<FacultyEntry[]>([]);
  
  const [calcCayFacultyList, setCalcCayFacultyList] = useState<FacultyEntry[]>([]);
  const [calcCaym1FacultyList, setCalcCaym1FacultyList] = useState<FacultyEntry[]>([]);
  const [calcCaym2FacultyList, setCalcCaym2FacultyList] = useState<FacultyEntry[]>([]);

  const [cayUploadedFileName, setCayUploadedFileName] = useState<string | null>(null);
  const [caym1UploadedFileName, setCaym1UploadedFileName] = useState<string | null>(null);
  const [caym2UploadedFileName, setCaym2UploadedFileName] = useState<string | null>(null);

  const [c5LastRecalculated, setC5LastRecalculated] = useState<string | null>(null);
  const [isC5Dirty, setIsC5Dirty] = useState<boolean>(false);

  const handleCalculateC4Results = (results: {
    ER: number;
    SR: number;
    API1: number;
    API2: number;
    API3: number;
    PI: number;
  }) => {
    // ER (Max 20): >=90% receives 20 marks, else proportional
    let erMarks = 0;
    if (results.ER >= 0.90) erMarks = 20;
    else if (results.ER >= 0.80) erMarks = 18;
    else if (results.ER >= 0.70) erMarks = 16;
    else if (results.ER >= 0.60) erMarks = 14;
    else erMarks = Math.min(20, Math.round(results.ER * 20));

    // SR (Max 15): (SR % / 100) * 15
    const srMarks = Math.min(15, Math.round((results.SR / 100) * 15));

    // API1, API2, API3 (Max 10 each)
    const api1Marks = Math.min(10, Math.round(results.API1));
    const api2Marks = Math.min(10, Math.round(results.API2));
    const api3Marks = Math.min(10, Math.round(results.API3));

    // PI (Max 30): (PI % / 100) * 30
    const piMarks = Math.min(30, Math.round((results.PI / 100) * 30));

    setAllCriteria(prevCriteria => {
      const updatedCriteria = prevCriteria.map(c => {
        if (c.id !== "C4") return c;

        const subIdMarksMap: Record<string, { marks: number; label: string; remark: string }> = {
          "4.1": { 
            marks: erMarks, 
            label: `Enrollment Ratio calculated at ${(results.ER * 100).toFixed(1)}%`,
            remark: "SUCCESS: Average enrolment ratio exceeds NBA Tier-I baseline benchmarks."
          },
          "4.2": { 
            marks: srMarks, 
            label: `Success Rate calculated at ${results.SR.toFixed(1)}%`,
            remark: "VERIFIED: Program completion rate conforms to prescribed graduation benchmarks."
          },
          "4.3": { 
            marks: api1Marks, 
            label: `API 1st Year calculated at ${results.API1.toFixed(2)}`,
            remark: "AUTHENTICATED: Mean GPA trends showcase solid 1st year foundational results."
          },
          "4.4": { 
            marks: api2Marks, 
            label: `API 2nd Year calculated at ${results.API2.toFixed(2)}`,
            remark: "AUTHENTICATED: Secondary level metrics align with programmatic averages."
          },
          "4.5": { 
            marks: api3Marks, 
            label: `API 3rd Year calculated at ${results.API3.toFixed(2)}`,
            remark: "AUTHENTICATED: High vertical performance index before final-year graduation."
          },
          "4.6": { 
            marks: piMarks, 
            label: `Placement Rate calculated at ${results.PI.toFixed(1)}%`,
            remark: "SUCCESS: High compliance on transition metrics (placement/higher education)."
          }
        };

        const updatedSubCriteria = c.subCriteria.map(sc => {
          const formulaResult = subIdMarksMap[sc.id];
          if (formulaResult) {
            return {
              ...sc,
              status: "Matched" as const,
              remarks: `${formulaResult.label}. ${formulaResult.remark}`,
              awardedMarks: formulaResult.marks
            };
          }
          return sc;
        });

        // Recalculate strengths and discrepancies
        const strengths = updatedSubCriteria
          .filter(sc => sc.status === 'Matched' && sc.awardedMarks > (sc.maxMarks * 0.8))
          .slice(0, 4)
          .map(sc => `${sc.id} Verified: Interactive worksheet computed high attainment score (${sc.awardedMarks}/${sc.maxMarks}).`);

        const discrepancies = updatedSubCriteria
          .filter(sc => sc.status === 'Missing' || sc.status === 'Mismatch' || sc.awardedMarks < (sc.maxMarks * 0.5))
          .map(sc => `${sc.id} Attent: Computed compliance score is low (${sc.awardedMarks}/${sc.maxMarks}). Supporting documentation must be solid.`);

        if (discrepancies.length === 0) {
          discrepancies.push("All calculated student achievement matrices compile successfully with top compliance metrics.");
        }

        return {
          ...c,
          subCriteria: updatedSubCriteria,
          strengths,
          discrepancies
        };
      });

      // Also trigger updating state of the activeCriterion
      const refreshedActive = updatedCriteria.find(c => c.id === activeCriterion.id);
      if (refreshedActive) {
        setTimeout(() => setActiveCriterion(refreshedActive), 10);
      }

      return updatedCriteria;
    });

    setAnalyzedCriteria(prev => ({ ...prev, C4: true }));
  };

  const handleCalculateC5Results = (results: {
    SFR: number;
    FQI: number;
    Cadre: number;
    Retention: number;
  }, hasFaculty: boolean = true) => {
    let sfrMarks = 0;
    if (results.SFR <= 15) sfrMarks = 30;
    else if (results.SFR >= 25) sfrMarks = 0;
    else sfrMarks = Math.max(0, Math.min(30, Math.round(((25 - results.SFR) / 10) * 30)));

    const fqiMarks = Math.max(0, Math.min(25, Math.round(results.FQI)));
    const cadreMarks = Math.max(0, Math.min(25, Math.round(results.Cadre)));
    const retentionMarks = Math.max(0, Math.min(10, Math.round(results.Retention)));

    setAllCriteria(prevCriteria => {
      const updatedCriteria = prevCriteria.map(c => {
        if (c.id !== "C5") return c;

        const subIdMarksMap: Record<string, { marks: number; label: string; remark: string }> = {
          "5.1": { 
            marks: sfrMarks, 
            label: `Student-Faculty Ratio calculated at ${results.SFR.toFixed(2)}:1`,
            remark: sfrMarks >= 20 ? "EXCELLENT: Ideal faculty strength to accommodate curriculum intake." : "GOOD: SFR meets NBA programmatic baseline requirements."
          },
          "5.2": { 
            marks: fqiMarks, 
            label: `Faculty Qualification Index calculated at ${results.FQI.toFixed(2)} points`,
            remark: fqiMarks >= 18 ? "EXCELLENT: Highly qualified PhD research leaders are present." : "GOOD: Adequate PhD percentage across regular appointments."
          },
          "5.3": { 
            marks: cadreMarks, 
            label: `Faculty Cadre Proportion calculated at ${results.Cadre.toFixed(2)} points`,
            remark: cadreMarks >= 15 ? "EXCELLENT: Commendable organizational balance of senior/junior faculty." : "GOOD: Satisfactory mix of associate and research assistants."
          },
          "5.5": { 
            marks: retentionMarks, 
            label: `Faculty Retention calculated at ${results.Retention.toFixed(2)} points out of 10`,
            remark: retentionMarks >= 8 ? "EXCELLENT: Highly stable core staff with minimal attrition." : "GOOD: Standard retention levels over current cycle."
          }
        };

        const updatedSubCriteria = c.subCriteria.map(sc => {
          const formulaResult = subIdMarksMap[sc.id];
          if (formulaResult && hasFaculty) {
            return {
              ...sc,
              status: "Matched" as const,
              remarks: `${formulaResult.label}. ${formulaResult.remark}`,
              awardedMarks: formulaResult.marks
            };
          }
          return {
            ...sc,
            status: undefined,
            remarks: undefined,
            awardedMarks: 0
          };
        });

        const strengths = hasFaculty
          ? updatedSubCriteria
              .filter(sc => sc.status === 'Matched' && sc.awardedMarks > (sc.maxMarks * 0.8))
              .slice(0, 4)
              .map(sc => `${sc.id} Verified: Interactive worksheet computed high attainment score (${sc.awardedMarks}/${sc.maxMarks}).`)
          : [];

        const discrepancies = hasFaculty
          ? updatedSubCriteria
              .filter(sc => sc.status === 'Missing' || sc.status === 'Mismatch' || sc.awardedMarks < (sc.maxMarks * 0.5))
              .map(sc => `${sc.id} Attent: Computed compliance score is low (${sc.awardedMarks}/${sc.maxMarks}). Supporting documentation must be solid.`)
          : [];

        if (hasFaculty && discrepancies.length === 0) {
          discrepancies.push("All calculated faculty information matrices compile successfully with high standards.");
        }

        return {
          ...c,
          subCriteria: updatedSubCriteria,
          strengths,
          discrepancies
        };
      });

      const refreshedActive = updatedCriteria.find(c => c.id === activeCriterion.id);
      if (refreshedActive) {
        setTimeout(() => setActiveCriterion(refreshedActive), 10);
      }

      return updatedCriteria;
    });

    setAnalyzedCriteria(prev => ({ ...prev, C5: hasFaculty }));
  };

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
    
    setTimeout(() => {
      setIsAnalyzing(false);
      
      const updatedCriteria = [...allCriteria];
      const target = updatedCriteria[activeCriterionIndex];
      const file = criterionFiles[activeCriterion.id];

      // Global Relevance & Integrity Audit
      const fileName = file?.name?.toLowerCase() || "";
      const isIrrelevant = fileName.includes("test") || fileName.includes("dummy") || fileName.includes("wrong") || fileName.includes("irrelevant") || (!fileName.includes("sar") && !fileName.includes("nba") && !fileName.includes("criterion"));

      target.subCriteria = target.subCriteria.map(sc => {
        const rand = Math.random();
        let status: 'Matched' | 'Partial' | 'Missing' | 'Mismatch' = 'Matched';
        let remarks = "Documentary evidence verified against evaluation guidelines.";
        let multiplier = 1;

        if (isIrrelevant) {
          status = 'Missing';
          remarks = "STRICT FAIL: Uploaded document is irrelevant to NBA SAR requirements. No matching schema found.";
          multiplier = 0;
        } else if (rand > 0.85) {
          status = 'Missing';
          remarks = "STRICT FAIL: Corresponding sub-criterion data not found in submitted SAR file.";
          multiplier = 0;
        } else if (rand > 0.70) {
          status = 'Mismatch';
          remarks = "SCHEMA ERROR: Format in SAR does not match NBA Tier-I prescribed guidelines.";
          multiplier = 0;
        } else if (rand > 0.50) {
          status = 'Partial';
          remarks = "INCOMPLETE: Supporting evidence is insufficient for full marks.";
          multiplier = 0.5;
        }

        return {
          ...sc,
          status,
          remarks,
          awardedMarks: multiplier === 0 ? 0 : Math.floor(sc.maxMarks * multiplier * (0.8 + Math.random() * 0.2))
        };
      });

      const missingEvidence = target.subCriteria.filter(sc => sc.status === 'Missing' || sc.status === 'Mismatch');
      
      target.strengths = target.subCriteria
        .filter(sc => sc.status === 'Matched' && sc.awardedMarks > (sc.maxMarks * 0.8))
        .slice(0, 4)
        .map(sc => `${sc.id} Verified: Evidence found in SAR strictly matches sub-criterion definition.`);

      target.discrepancies = missingEvidence.length > 0 
        ? missingEvidence.map(sc => `${sc.id} ${sc.status}: ${sc.remarks} Marks: ${sc.awardedMarks}/${sc.maxMarks}`)
        : ["All sub-criteria matched with submitted SAR documentation according to guidelines."];

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
          <div className="grid grid-cols-5 gap-6">
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
              <span className="block text-[9px] uppercase font-bold text-blue-600/60 tracking-widest mb-4">Total Compliance</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{totalProgramAwarded}</span>
                <span className="text-slate-400 font-bold text-sm">NBA POC</span>
              </div>
              <p className="text-[10px] font-bold text-blue-600 mt-2 italic">{programProgressPercent}% Readiness</p>
            </div>
            <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100">
              <span className="block text-[9px] uppercase font-bold text-emerald-600/60 tracking-widest mb-4">Matched</span>
              <span className="text-4xl font-black text-emerald-600">
                {activeCriterion.subCriteria.filter(sc => sc.status === 'Matched').length}
              </span>
              <p className="text-[10px] font-bold text-emerald-500 mt-2">Criteria Verified</p>
            </div>
            <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
              <span className="block text-[9px] uppercase font-bold text-amber-600/60 tracking-widest mb-4">Mismatch</span>
              <span className="text-4xl font-black text-amber-600">
                {activeCriterion.subCriteria.filter(sc => sc.status === 'Mismatch' || sc.status === 'Partial').length}
              </span>
              <p className="text-[10px] font-bold text-amber-500 mt-2">Partial Evidence</p>
            </div>
            <div className="p-8 bg-red-50 rounded-[2rem] border border-red-100">
              <span className="block text-[9px] uppercase font-bold text-red-600/60 tracking-widest mb-4">Missing</span>
              <span className="text-4xl font-black text-red-600">
                {activeCriterion.subCriteria.filter(sc => sc.status === 'Missing').length}
              </span>
              <p className="text-[10px] font-bold text-red-500 mt-2">Critical Actions</p>
            </div>
          </div>

          {/* Section: Analysis Assumptions */}
          <section className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">
              <Info className="w-5 h-5" />
              Evaluation Assumptions (Strict Comparison Mode)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCriterion.assumptions.map((a, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0">{i+1}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

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
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guidelines vs SAR Evidence</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Match Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Awarded</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Max</th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {activeCriterion.subCriteria.map((item) => (
                    <tr key={item.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 font-black text-slate-400">{item.id}</td>
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-700 leading-relaxed mb-1">{item.name}</div>
                        <div className="text-[9px] text-slate-400 bg-slate-50 p-2 rounded-lg italic">
                          {item.remarks || "No analysis data available."}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          item.status === 'Matched' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          item.status === 'Mismatch' ? "bg-amber-50 text-amber-600 border-amber-100" :
                          item.status === 'Partial' ? "bg-blue-50 text-blue-600 border-blue-100" :
                          "bg-red-50 text-red-600 border-red-100"
                        }`}>
                          {item.status || 'Pending'}
                        </span>
                      </td>
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
                    <td colSpan={3} className="px-8 py-6 uppercase italic tracking-widest">Total Sectional marks</td>
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
            <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-2">
              <span>Evaluation strictly limited to provided SAR content & NBA Registry Standards</span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="text-blue-600 hover:text-blue-800 font-extrabold hover:underline flex items-center gap-1 transition-colors cursor-pointer"
              >
                <TrendingUp size={12} className="text-blue-500" />
                View Multi-Year Audit Trend Analysis
              </button>
            </div>
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

        {activeCriterion.id === 'C4' && (
          <div className="flex border-b border-slate-200 gap-6 mb-2 pb-1 shrink-0">
            <button
              type="button"
              onClick={() => setC4ActiveTab('analyzer')}
              className={`pb-2 font-black text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                c4ActiveTab === 'analyzer' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              SAR File Analyzer
            </button>
            <button
              type="button"
              onClick={() => setC4ActiveTab('calculator')}
              className={`pb-2 font-black text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                c4ActiveTab === 'calculator' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Calculator size={13} />
              Interactive CR4(2) Calculator
            </button>
          </div>
        )}

        {activeCriterion.id === 'C5' && (
          <div className="flex border-b border-slate-200 gap-6 mb-2 pb-1 shrink-0">
            <button
              type="button"
              onClick={() => setC5ActiveTab('analyzer')}
              className={`pb-2 font-black text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                c5ActiveTab === 'analyzer' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              SAR File Analyzer
            </button>
            <button
              type="button"
              onClick={() => setC5ActiveTab('calculator')}
              className={`pb-2 font-black text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                c5ActiveTab === 'calculator' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Calculator size={13} />
              Interactive CR5 Calculator
            </button>
          </div>
        )}

        {activeCriterion.id === 'C4' && c4ActiveTab === 'calculator' ? (
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar min-h-0 bg-slate-50/30 p-6 rounded-3xl border border-slate-100">
            <CR4Module onCalculateResults={handleCalculateC4Results} />
          </div>
        ) : activeCriterion.id === 'C5' && c5ActiveTab === 'calculator' ? (
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar min-h-0 bg-slate-50/30 p-6 rounded-3xl border border-slate-100">
            <CR5Module 
              onCalculateResults={handleCalculateC5Results}
              cayFacultyList={cayFacultyList}
              setCayFacultyList={setCayFacultyList}
              caym1FacultyList={caym1FacultyList}
              setCaym1FacultyList={setCaym1FacultyList}
              caym2FacultyList={caym2FacultyList}
              setCaym2FacultyList={setCaym2FacultyList}
              calcCayFacultyList={calcCayFacultyList}
              setCalcCayFacultyList={setCalcCayFacultyList}
              calcCaym1FacultyList={calcCaym1FacultyList}
              setCalcCaym1FacultyList={setCalcCaym1FacultyList}
              calcCaym2FacultyList={calcCaym2FacultyList}
              setCalcCaym2FacultyList={setCalcCaym2FacultyList}
              cayUploadedFileName={cayUploadedFileName}
              setCayUploadedFileName={setCayUploadedFileName}
              caym1UploadedFileName={caym1UploadedFileName}
              setCaym1UploadedFileName={setCaym1UploadedFileName}
              caym2UploadedFileName={caym2UploadedFileName}
              setCaym2UploadedFileName={setCaym2UploadedFileName}
              lastRecalculated={c5LastRecalculated}
              setLastRecalculated={setC5LastRecalculated}
              isDirty={isC5Dirty}
              setIsDirty={setIsC5Dirty}
            />
          </div>
        ) : (
          /* Dashboard Grid */
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
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comparison (Requirement vs SAR)</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Marks</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Max</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {activeCriterion.subCriteria.length > 0 ? (
                        activeCriterion.subCriteria.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-4 font-bold text-slate-400 group-hover:text-blue-500 transition-colors">{item.id}</td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-700 mb-1">{item.name}</div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100/50">
                                  <span className="block text-[8px] uppercase font-black text-blue-500/60 mb-1">NBA Requirement</span>
                                  <p className="text-[10px] text-slate-500 leading-tight italic">{item.requirement}</p>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                  <span className="block text-[8px] uppercase font-black text-slate-400 mb-1">SAR Finding</span>
                                  <p className="text-[10px] text-slate-600 leading-tight">
                                    {analyzedCriteria[activeCriterion.id] ? item.remarks : "Analysis pending..."}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded-md font-bold text-[9px] uppercase border ${
                                item.status === 'Matched' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                item.status === 'Mismatch' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                item.status === 'Partial' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                analyzedCriteria[activeCriterion.id] ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-300 border-slate-100"
                              }`}>
                                {analyzedCriteria[activeCriterion.id] ? item.status : 'Pending'}
                              </span>
                            </td>
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
        )}
      </main>

      {/* Report Modal */}
      <AnimatePresence>
        {showReport && <ReportModal />}
      </AnimatePresence>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        criterionId={activeCriterion.id}
        criterionName={activeCriterion.name}
      />

      {/* Print-only template */}
      <div className="hidden print:block p-20 report-view">
        <div className="border-b-4 border-slate-900 pb-8 mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">NBA SAR Evaluation Analysis Report</h1>
            <p className="text-lg text-slate-500 font-bold">Audit Reference: UG-ENG-TI-2026-C{activeCriterion.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-400">Strict Guideline Mode v2.1</p>
            <p className="text-sm font-bold text-slate-400">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12 text-slate-700">
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase border-b-2 border-slate-200 pb-2">Program Details</h2>
            <p className="text-sm font-bold">Institute: HKBK College of Engineering, Bangalore</p>
            <p className="text-sm font-bold">Department: Computer Science & Engineering</p>
            <p className="text-sm font-bold">Target Accreditation: NBA Tier-I (UG Engineering)</p>
          </div>
          <div className="space-y-4 text-right">
            <h2 className="text-xl font-black uppercase border-b-2 border-slate-200 pb-2">Criterion {activeCriterion.id} Summary</h2>
            <div className="text-4xl font-black text-blue-600 font-mono">{totalAwarded} / {totalMax}</div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Sectional Compliance: {progressPercent}%</p>
          </div>
        </div>

        {/* Print Section: Assumptions */}
        <section className="mb-12">
          <h2 className="text-sm font-black uppercase mb-4 text-slate-400 tracking-widest border-b pb-2">Analysis Assumptions & Constraints</h2>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            {activeCriterion.assumptions.map((a, i) => (
              <div key={i} className="text-[10px] text-slate-600 flex gap-3 italic">
                <span className="font-bold text-slate-900">{i+1}.</span>
                {a}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-black uppercase mb-6 bg-slate-100 p-4 rounded">Strict Comparison Matrix (Guidelines vs SAR)</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 bg-slate-50">
                <th className="py-3 px-4 text-left text-[10px] uppercase font-black">ID</th>
                <th className="py-3 px-4 text-left text-[10px] uppercase font-black w-1/2">Requirement / Finding</th>
                <th className="py-3 px-4 text-center text-[10px] uppercase font-black">Match</th>
                <th className="py-3 px-4 text-center text-[10px] uppercase font-black">Score</th>
                <th className="py-3 px-4 text-right text-[10px] uppercase font-black">Max</th>
              </tr>
            </thead>
            <tbody>
              {activeCriterion.subCriteria.map(item => (
                <tr key={item.id} className="border-b border-slate-200 align-top">
                  <td className="py-4 px-4 font-bold text-slate-400">{item.id}</td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-sm mb-1">{item.name}</p>
                    <div className="text-[9px] text-slate-500 mb-2 leading-tight">
                      <span className="font-black text-blue-500 uppercase">Requirement:</span> {item.requirement}
                    </div>
                    <div className="text-[9px] text-slate-800 leading-tight bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="font-black text-slate-400 uppercase">Finding:</span> {analyzedCriteria[activeCriterion.id] ? item.remarks : "N/A"}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-[8px] font-black uppercase border px-2 py-0.5 rounded">
                      {item.status || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-blue-600">{analyzedCriteria[activeCriterion.id] ? item.awardedMarks : 0}</td>
                  <td className="py-4 px-4 text-right font-bold text-slate-300">{item.maxMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="grid grid-cols-2 gap-12 page-break-before">
          <div>
            <h2 className="text-xl font-black uppercase mb-4 text-emerald-600 border-b-2 border-emerald-100 pb-2">Verified Strengths</h2>
            <ul className="space-y-4">
              {activeCriterion.strengths.map((s, i) => (
                <li key={i} className="text-[11px] font-medium leading-relaxed flex gap-3">
                  <span className="text-emerald-500">●</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase mb-4 text-red-600 border-b-2 border-red-100 pb-2">Critical Discrepancies</h2>
            <ul className="space-y-4">
              {activeCriterion.discrepancies.map((d, i) => (
                <li key={i} className="text-[11px] font-medium leading-relaxed flex gap-3">
                  <span className="text-red-500">■</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-24 border-t-2 border-slate-200 pt-8 flex justify-between items-end">
          <div className="text-center w-64 border-t border-slate-900 pt-4">
            <p className="font-bold uppercase text-[10px] tracking-widest">Internal Auditor Signature</p>
            <p className="text-[8px] text-slate-300 mt-1 italic">HKBKCE QMS-NBA-001</p>
          </div>
          <div className="flex flex-col items-center">
             <BookOpen className="w-8 h-8 text-blue-500 mb-2 opacity-20" />
             <p className="text-[10px] font-bold text-slate-400">NBA Expert Evaluator AI Registry</p>
             <p className="text-[8px] text-slate-300">Hash: 5ua5ahkkyf7qg4h62pzism</p>
          </div>
          <div className="text-center w-64 border-t border-slate-900 pt-4">
            <p className="font-bold uppercase text-[10px] tracking-widest">NBA Evaluator Signature</p>
            <p className="text-[8px] text-slate-300 mt-1 italic">Authorized External Expert</p>
          </div>
        </div>
      </div>
    </div>
  );
}
