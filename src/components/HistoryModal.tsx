/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, BarChart3, Info, Globe, Award, Zap, CheckSquare, BookOpen, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  criterionId: string;
  criterionName: string;
}

const renderMetricIcon = (type: string) => {
  switch (type) {
    case 'trend': return <TrendingUp size={16} className="text-[#2563eb]" />;
    case 'bar': return <BarChart3 size={16} className="text-[#10b981]" />;
    case 'award': return <Award size={16} className="text-[#f59e0b]" />;
    case 'globe': return <Globe size={16} className="text-[#6366f1]" />;
    case 'zap': return <Zap size={16} className="text-[#eab308]" />;
    case 'book': return <BookOpen size={16} className="text-[#06b6d4]" />;
    case 'file': return <FileText size={16} className="text-[#ec4899]" />;
    case 'check': return <CheckSquare size={16} className="text-[#14b8a6]" />;
    default: return <Info size={16} className="text-[#64748b]" />;
  }
};

const CRITERION_TRENDS: Record<string, {
  title: string;
  subtitle: string;
  metrics: {
    title: string;
    value: string;
    subtitle: string;
    icon: string;
  }[];
  chart1: {
    title: string;
    keys: { dataKey: string; name: string; stroke: string }[];
  };
  chart2: {
    title: string;
    keys: { dataKey: string; name: string; stroke: string; fill?: string; fillOpacity?: number; stackId?: string }[];
  };
  data: any[];
  insight: string;
}> = {
  C1: {
    title: "Curriculum Alignment Trends",
    subtitle: "BOARD OF STUDIES PARTICIPATION & NEP INTEGRATION OVER 6 YEARS",
    metrics: [
      { title: "BoS Industry Alignment", value: "94.0%", subtitle: "Targeted Syllabus Refresh", icon: "trend" },
      { title: "NEP-2020 Integration", value: "98.0%", subtitle: "Fully Mapped Gaps", icon: "check" },
      { title: "CO-PO Consistency Ratio", value: "2.85/3", subtitle: "Strong Level Correlation", icon: "award" }
    ],
    chart1: {
      title: "CO-PO Gap Closure & External Alignment Trend",
      keys: [
        { dataKey: "bosAlign", name: "BoS Industry Alignment (%)", stroke: "#2563eb" },
        { dataKey: "coPoGap", name: "CO-PO Alignment Gap Resolved (%)", stroke: "#10b981" }
      ]
    },
    chart2: {
      title: "Curriculum Modernization Rate",
      keys: [
        { dataKey: "nepComp", name: "NEP-2020 Compliance (%)", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.1 },
        { dataKey: "modernRatio", name: "Modern Syllabus Coverage (%)", stroke: "#ec4899", fill: "#ec4899", fillOpacity: 0.05 }
      ]
    },
    data: [
      { year: "20-21", bosAlign: 65, coPoGap: 40, nepComp: 30, modernRatio: 50 },
      { year: "21-22", bosAlign: 70, coPoGap: 55, nepComp: 45, modernRatio: 60 },
      { year: "22-23", bosAlign: 78, coPoGap: 72, nepComp: 60, modernRatio: 72 },
      { year: "23-24", bosAlign: 82, coPoGap: 80, nepComp: 78, modernRatio: 80 },
      { year: "24-25", bosAlign: 89, coPoGap: 92, nepComp: 90, modernRatio: 88 },
      { year: "25-26", bosAlign: 94, coPoGap: 98, nepComp: 98, modernRatio: 95 }
    ],
    insight: "The 6-year trajectory demonstrates a structured approach to syllabus modernization. Enhanced industry and stakeholder participation in Board of Studies (BoS) has produced near-perfect mapping to NEP-2020 credit transfer standards."
  },
  C2: {
    title: "Pedagogy and Experiential Trajectory",
    subtitle: "SELF-LEARNING PATHS & CAPSTONE QUALITY OVER 6 YEARS",
    metrics: [
      { title: "Active Industry MoUs", value: "12 MoUs", subtitle: "Industrial Internships", icon: "trend" },
      { title: "NPTEL Student Certifications", value: "148 Certs", subtitle: "SWAYAM Progression", icon: "zap" },
      { title: "SDG Capstone Alignment", value: "68.0%", subtitle: "Sustainability Projects", icon: "globe" }
    ],
    chart1: {
      title: "Self-Learning Certifications & MoUs Trend",
      keys: [
        { dataKey: "mousCount", name: "Active Industry MoUs", stroke: "#2563eb" },
        { dataKey: "certsNormalized", name: "SWAYAM Certs Index (x10)", stroke: "#10b981" }
      ]
    },
    chart2: {
      title: "Experiential-Learning SDG Capstone Ratio",
      keys: [
        { dataKey: "sdgRatio", name: "SDG-Focused Capstones (%)", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.1 },
        { dataKey: "indSponsor", name: "Industry Sponsored Projects (%)", stroke: "#ec4899", fill: "#ec4899", fillOpacity: 0.05 }
      ]
    },
    data: [
      { year: "20-21", mousCount: 2, certsNormalized: 24, sdgRatio: 15, indSponsor: 10 },
      { year: "21-22", mousCount: 4, certsNormalized: 48, sdgRatio: 25, indSponsor: 18 },
      { year: "22-23", mousCount: 6, certsNormalized: 72, sdgRatio: 40, indSponsor: 25 },
      { year: "23-24", mousCount: 8, certsNormalized: 112, sdgRatio: 52, indSponsor: 38 },
      { year: "24-25", mousCount: 10, certsNormalized: 135, sdgRatio: 60, indSponsor: 45 },
      { year: "25-26", mousCount: 12, certsNormalized: 148, sdgRatio: 68, indSponsor: 55 }
    ],
    insight: "Experiential learning shows outstanding metric expansion. Integrating Sustainable Development Goal (SDG) references across final-year project teams has generated deeper social relevance and led to 12 fully active corporate MoUs."
  },
  C3: {
    title: "Assessment and Cognitive Progression",
    subtitle: "BLOOM'S TAXONOMY RATIO & DIRECT ATTAINMENT COMPLIANCE",
    metrics: [
      { title: "Direct CO Attainment", value: "2.65/3", subtitle: "Standardized Calculation", icon: "trend" },
      { title: "Cognitive HOTS %", value: "68.0%", subtitle: "Bloom's Higher Order", icon: "award" },
      { title: "Continuous Evaluation", value: "99.5%", subtitle: "Total Rubric Consistency", icon: "check" }
    ],
    chart1: {
      title: "CO-PO Attainment Index vs HOTS Questions",
      keys: [
        { dataKey: "attainmentScore", name: "CO Attainment Level (%)", stroke: "#2563eb" },
        { dataKey: "bloomsPercent", name: "HOTS Questions in Exams (%)", stroke: "#10b981" }
      ]
    },
    chart2: {
      title: "Assessment Rubric Consistency Scale",
      keys: [
        { dataKey: "rubricConsistency", name: "Rubric Compliance (%)", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.1 }
      ]
    },
    data: [
      { year: "20-21", attainmentScore: 54, bloomsPercent: 30, rubricConsistency: 65 },
      { year: "21-22", attainmentScore: 60, bloomsPercent: 38, rubricConsistency: 72 },
      { year: "22-23", attainmentScore: 66, bloomsPercent: 45, rubricConsistency: 80 },
      { year: "23-24", attainmentScore: 72, bloomsPercent: 52, rubricConsistency: 90 },
      { year: "24-25", attainmentScore: 76, bloomsPercent: 61, rubricConsistency: 96 },
      { year: "25-26", attainmentScore: 79.5, bloomsPercent: 68, rubricConsistency: 99.5 }
    ],
    insight: "The systemic alignment of continuous internal evaluation (CIE) ensures prompt identification of curricular gaps. Introducing detailed lab evaluation rubrics has minimized grading discrepancies."
  },
  C4: {
    title: "Student Graduation and Transitions",
    subtitle: "SUCCESS RATE, API INDEX & MARKET ENTRANCE TRENDS",
    metrics: [
      { title: "Success Rate (Stipulated)", value: "84.8%", subtitle: "Clear Graduation Mode", icon: "trend" },
      { title: "Enrolment Optimization", value: "94.2%", subtitle: "Intake Fulfillment Rate", icon: "globe" },
      { title: "Transition Rate (Placements/HE)", value: "82.5%", subtitle: "Quality Market Capture", icon: "award" }
    ],
    chart1: {
      title: "Graduation Clear Rate & Transition Rate Trend",
      keys: [
        { dataKey: "gradRate", name: "Stipulated Graduation Rate (%)", stroke: "#2563eb" },
        { dataKey: "placementRatio", name: "Placement & Higher Studies (%)", stroke: "#10b981" }
      ]
    },
    chart2: {
      title: "Enrolment Intake & Foundational Average GPA",
      keys: [
        { dataKey: "enrolmentRatio", name: "Enrolment Ratio (%)", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.1 },
        { dataKey: "gpaNormalized", name: "Average 1st Yr GPA (x10)", stroke: "#ec4899", fill: "#ec4899", fillOpacity: 0.05 }
      ]
    },
    data: [
      { year: "20-21", gradRate: 68.2, placementRatio: 60.5, enrolmentRatio: 82.5, gpaNormalized: 71 },
      { year: "21-22", gradRate: 72.1, placementRatio: 65.2, enrolmentRatio: 85.0, gpaNormalized: 73 },
      { year: "22-23", gradRate: 75.4, placementRatio: 70.8, enrolmentRatio: 88.4, gpaNormalized: 75 },
      { year: "23-24", gradRate: 78.9, placementRatio: 74.5, enrolmentRatio: 90.1, gpaNormalized: 77 },
      { year: "24-25", gradRate: 81.5, placementRatio: 79.2, enrolmentRatio: 92.4, gpaNormalized: 82 },
      { year: "25-26", gradRate: 84.8, placementRatio: 82.5, enrolmentRatio: 94.2, gpaNormalized: 85 }
    ],
    insight: "The combination of student career coaching and modern lab setups drove academic GPA averages higher, converting directly into robust corporate recruiting and top-tier university transitions."
  },
  C5: {
    title: "Faculty Qualifications and Retention",
    subtitle: "DOCTORAL STRENGTH, FQI & RETENTION PERSPECTIVE",
    metrics: [
      { title: "FQI Momentum Growth", value: "+37.1%", subtitle: "Ph.D Proportion Surge", icon: "trend" },
      { title: "Core Staff Stability", value: "9.60/10", subtitle: "Minimal Academic Attrition", icon: "bar" },
      { title: "Doctoral Leaders", value: "10 PhDs", subtitle: "Research Leadership Unit", icon: "award" }
    ],
    chart1: {
      title: "Faculty Qualification Index & Staff Retention Trend",
      keys: [
        { dataKey: "fqi", name: "FQI Index Score", stroke: "#2563eb" },
        { dataKey: "fr", name: "Retention Status Points", stroke: "#10b981" }
      ]
    },
    chart2: {
      title: "Academic Staff Qualification Distribution",
      keys: [
        { dataKey: "phd", name: "Ph.D. Faculty Count", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.1, stackId: "1" },
        { dataKey: "masters", name: "Masters Faculty Count", stroke: "#cbd5e1", fill: "#cbd5e1", fillOpacity: 0.5, stackId: "1" }
      ]
    },
    data: [
      { year: "20-21", fqi: 6.20, fr: 7.50, phd: 4, masters: 10 },
      { year: "21-22", fqi: 6.50, fr: 7.80, phd: 5, masters: 12 },
      { year: "22-23", fqi: 6.90, fr: 8.20, phd: 6, masters: 13 },
      { year: "23-24", fqi: 7.40, fr: 8.50, phd: 7, masters: 15 },
      { year: "24-25", fqi: 8.00, fr: 9.00, phd: 9, masters: 18 },
      { year: "25-26", fqi: 8.50, fr: 9.60, phd: 10, masters: 20 }
    ],
    insight: "Proactive upskilling and Ph.D promotions have secured a high Faculty Qualification Index (FQI). Institutional talent preservation policies are proven by a consistent and near-perfect Faculty Retention score."
  },
  C6: {
    title: "Faculty Scholarly Contributions",
    subtitle: "SPONSORED RESEARCH, INDEXED PAPERS & PATENTS OVER 6 YEARS",
    metrics: [
      { title: "Scopus/WoS Publications", value: "32 Papers", subtitle: "High Index Citations", icon: "trend" },
      { title: "Sponsored Capital Grants", value: "INR 48.0L", subtitle: "External Funding Pool", icon: "zap" },
      { title: "Intellectual Property Units", value: "16 IP/Pat.", subtitle: "Utility Patents Mapped", icon: "award" }
    ],
    chart1: {
      title: "Scopus Publications vs Patents Growth",
      keys: [
        { dataKey: "scopusCount", name: "Indexed Publications", stroke: "#2563eb" },
        { dataKey: "patentsCount", name: "IP/Patents Published", stroke: "#10b981" }
      ]
    },
    chart2: {
      title: "Sponsored Research & Organized FDP Cycles",
      keys: [
        { dataKey: "fundingLakhs", name: "Granted Funding (Lakhs)", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.1 },
        { dataKey: "fdpNormalized", name: "Organized Skill FDPs (x2)", stroke: "#ec4899", fill: "#ec4899", fillOpacity: 0.05 }
      ]
    },
    data: [
      { year: "20-21", scopusCount: 8, patentsCount: 2, fundingLakhs: 5.5, fdpNormalized: 24 },
      { year: "21-22", scopusCount: 12, patentsCount: 4, fundingLakhs: 12.0, fdpNormalized: 32 },
      { year: "22-23", scopusCount: 15, patentsCount: 6, fundingLakhs: 18.5, fdpNormalized: 40 },
      { year: "23-24", scopusCount: 22, patentsCount: 10, fundingLakhs: 28.0, fdpNormalized: 52 },
      { year: "24-25", scopusCount: 28, patentsCount: 12, fundingLakhs: 38.4, fdpNormalized: 68 },
      { year: "25-26", scopusCount: 32, patentsCount: 16, fundingLakhs: 48.0, fdpNormalized: 80 }
    ],
    insight: "The introduction of structural seed-fund incentives has generated a vibrant departmental research climate, translating directly into high-value externally-sponsored grants and commercial patent filings."
  },
  C7: {
    title: "Capital Modernization & Safety Scale",
    subtitle: "COMPUTING CENTER UPGRADES & PREVENTIVE MAINTENANCE RATES",
    metrics: [
      { title: "Research Labs & CoEs", value: "4 Centers", subtitle: "Domain Competency Centers", icon: "trend" },
      { title: "Technical Domain Staff", value: "9 Experts", subtitle: "Fully Certified Helpers", icon: "check" },
      { title: "Maintenance Adherence", value: "99.2%", subtitle: "Total Equipment Upkeep", icon: "zap" }
    ],
    chart1: {
      title: "Preventive Upkeep & Lab Safety Index",
      keys: [
        { dataKey: "maintenanceRatio", name: "Maintenance Fulfillment (%)", stroke: "#2563eb" },
        { dataKey: "safetyCompliance", name: "Safety Audits Met (%)", stroke: "#10b981" }
      ]
    },
    chart2: {
      title: "Specialized Laboratory Capacity Growth",
      keys: [
        { dataKey: "coeCapacity", name: "CoE Workspace Level (%)", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.1 }
      ]
    },
    data: [
      { year: "20-21", maintenanceRatio: 80, safetyCompliance: 72, coeCapacity: 20 },
      { year: "21-22", maintenanceRatio: 84, safetyCompliance: 75, coeCapacity: 20 },
      { year: "22-23", maintenanceRatio: 88, safetyCompliance: 82, coeCapacity: 40 },
      { year: "23-24", maintenanceRatio: 92, safetyCompliance: 89, coeCapacity: 60 },
      { year: "24-25", maintenanceRatio: 96, safetyCompliance: 94, coeCapacity: 80 },
      { year: "25-26", maintenanceRatio: 99.2, safetyCompliance: 98, coeCapacity: 80 }
    ],
    insight: "Strategic capital allocations modernized experimental learning spaces. Systematic safety checks and professional server-room earthing protocols maintain a highly professional lab ambiance."
  },
  C8: {
    title: "Continuous Programmatic Improvements",
    subtitle: "AUDIT CLOSURE METRIQUES & HISTORIC API RESULTS",
    metrics: [
      { title: "Audits Closed (External)", value: "100%", subtitle: "Gaps Fully Addressed", icon: "trend" },
      { title: "Action Taken Response (ATR)", value: "2.85/3.0", subtitle: "High Closure Pace", icon: "check" },
      { title: "Avg Learning Gain Index", value: "+24.2%", subtitle: "Overall Score Upward", icon: "award" }
    ],
    chart1: {
      title: "Audit Gaps Identified vs Gaps Resolved",
      keys: [
        { dataKey: "remediationsMet", name: "Resolutions Completed (%)", stroke: "#2563eb" },
        { dataKey: "externalObservationCount", name: "Closed External Gaps (%)", stroke: "#10b981" }
      ]
    },
    chart2: {
      title: "Institutional API Attainment Index",
      keys: [
        { dataKey: "programApiLevel", name: "Grand KPI Performance (%)", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.1 }
      ]
    },
    data: [
      { year: "20-21", remediationsMet: 70, externalObservationCount: 65, programApiLevel: 68 },
      { year: "21-22", remediationsMet: 75, externalObservationCount: 72, programApiLevel: 72 },
      { year: "22-23", remediationsMet: 82, externalObservationCount: 80, programApiLevel: 78 },
      { year: "23-24", remediationsMet: 90, externalObservationCount: 88, programApiLevel: 83 },
      { year: "24-25", remediationsMet: 96, externalObservationCount: 94, programApiLevel: 88 },
      { year: "25-26", remediationsMet: 100, externalObservationCount: 98, programApiLevel: 94 }
    ],
    insight: "Departmental quality circles continuously assess outcome values. Active implementation of Action Taken Reports (ATRs) has established a robust mechanism for steady improvements."
  },
  C9: {
    title: "Governance and Mentoring Trajectory",
    subtitle: "E-GOVERNANCE ERP INTEGRATION & STUDENT COUNSELING RATIO",
    metrics: [
      { title: "Mentor-to-Student Ratio", value: "1:18", subtitle: "Highly Personal Guidance", icon: "trend" },
      { title: "E-Governance Adoption", value: "96.0%", subtitle: "Integrated ERP Portal", icon: "zap" },
      { title: "Budgetary Utilization", value: "98.4%", subtitle: "Aligned Disbursements", icon: "check" }
    ],
    chart1: {
      title: "Mentorship Ratio Optimization & Satisfaction",
      keys: [
        { dataKey: "ratioEfficiency", name: "Mentorship Ratio Coverage (%)", stroke: "#2563eb" },
        { dataKey: "studentSatisfaction", name: "Help Desk Satisfaction (%)", stroke: "#10b981" }
      ]
    },
    chart2: {
      title: "Administrative ERP Digitalization Scope",
      keys: [
        { dataKey: "erpModernization", name: "ERP Systems Covered (%)", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.1 },
        { dataKey: "capitalDisbursement", name: "Department funds Used (%)", stroke: "#ec4899", fill: "#ec4899", fillOpacity: 0.05 }
      ]
    },
    data: [
      { year: "20-21", ratioEfficiency: 60, studentSatisfaction: 68, erpModernization: 40, capitalDisbursement: 85 },
      { year: "21-22", ratioEfficiency: 68, studentSatisfaction: 72, erpModernization: 55, capitalDisbursement: 88 },
      { year: "22-23", ratioEfficiency: 75, studentSatisfaction: 79, erpModernization: 70, capitalDisbursement: 92 },
      { year: "23-24", ratioEfficiency: 84, studentSatisfaction: 85, erpModernization: 82, capitalDisbursement: 94 },
      { year: "24-25", ratioEfficiency: 92, studentSatisfaction: 90, erpModernization: 90, capitalDisbursement: 96 },
      { year: "25-26", ratioEfficiency: 98, studentSatisfaction: 95, erpModernization: 96, capitalDisbursement: 98.4 }
    ],
    insight: "The dynamic E-governance ERP system streamlines workflows from grades monitoring to attendance auditing. Structured, small tutoring groups ensure outstanding pastoral care."
  }
};

const DEFAULT_TREND = {
  title: "General Trend Analysis",
  subtitle: "DEVELOPMENT BENCHMARKS OVER 6 YEARS",
  metrics: [
    { title: "Overall KPI Progress", value: "92.4%", subtitle: "Compliance Growth", icon: "trend" },
    { title: "Standard Operations", value: "Verified", subtitle: "Continuous Assessment", icon: "check" },
    { title: "Evaluation Standard", value: "Tier-I Accredited", subtitle: "National Benchmarks Met", icon: "award" }
  ],
  chart1: {
    title: "Incremental Quality Trajectory",
    keys: [
      { dataKey: "kpi", name: "KPI Compliance Ratio (%)", stroke: "#2563eb" }
    ]
  },
  chart2: {
    title: "Overall Operational Growth Rate",
    keys: [
      { dataKey: "growth", name: "Attainment Rate (%)", stroke: "#10b981", fill: "#10b981", fillOpacity: 0.1 }
    ]
  },
  data: [
    { year: "20-21", kpi: 60, growth: 55 },
    { year: "21-22", kpi: 68, growth: 62 },
    { year: "22-23", kpi: 74, growth: 70 },
    { year: "23-24", kpi: 80, growth: 78 },
    { year: "24-25", kpi: 87, growth: 85 },
    { year: "25-26", kpi: 92.4, growth: 90 }
  ],
  insight: "The multi-year trajectory has maintained stable milestones compliant with Tier-I academic targets. Institutional preservation policies ensure continuous optimization and development of programmatic outcomes."
};

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, criterionId, criterionName }) => {
  const activeTrend = useMemo(() => {
    return CRITERION_TRENDS[criterionId] || DEFAULT_TREND;
  }, [criterionId]);

  if (!isOpen) return null;

  const chartData = activeTrend.data;
  const currentYearData = chartData[chartData.length - 1];
  const baselineYearData = chartData[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4 md:p-8"
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
                    <h2 className="text-lg font-bold text-[#0f172a] uppercase tracking-tight">
                      Criterion {criterionId} Trend Analysis
                    </h2>
                    <p className="text-xs text-[#64748b] font-medium tracking-wide font-mono">
                      6-YEAR HISTORICAL AUDIT PERSPECTIVE • {criterionName.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-[#64748b] cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                
                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {activeTrend.metrics.map((metric, i) => (
                    <div key={i} className="p-5 border border-[#e2e8f0] rounded-xl bg-[#f8fafc] flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-3">
                        {renderMetricIcon(metric.icon)}
                        <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest">
                          {metric.title}
                        </span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#0f172a]">
                          {metric.value}
                        </div>
                        <p className="text-[11px] text-[#64748b] mt-1 italic">
                          {metric.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Chart 1 */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-[#0f172a] uppercase tracking-widest border-l-4 border-[#2563eb] pl-3">
                      {activeTrend.chart1.title}
                    </h3>
                    <div className="h-[300px] w-full border border-[#e2e8f0] rounded-xl p-4 bg-white">
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
                          {activeTrend.chart1.keys.map((key, index) => (
                            <Line 
                              key={key.dataKey}
                              type="monotone" 
                              dataKey={key.dataKey} 
                              name={key.name} 
                              stroke={key.stroke} 
                              strokeWidth={3} 
                              dot={{ r: 4, fill: key.stroke, strokeWidth: 2 }} 
                              activeDot={{ r: 6 }} 
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2 */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-[#0f172a] uppercase tracking-widest border-l-4 border-[#10b981] pl-3">
                      {activeTrend.chart2.title}
                    </h3>
                    <div className="h-[300px] w-full border border-[#e2e8f0] rounded-xl p-4 bg-white">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="year" fontSize={11} fontWeight={600} stroke="#64748b" axisLine={false} tickLine={false} />
                          <YAxis fontSize={11} fontWeight={600} stroke="#64748b" axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold' }} />
                          {activeTrend.chart2.keys.map((key) => (
                            <Area 
                              key={key.dataKey}
                              type="monotone" 
                              dataKey={key.dataKey} 
                              name={key.name} 
                              stroke={key.stroke} 
                              fill={key.fill || key.stroke} 
                              fillOpacity={key.fillOpacity ?? 0.1}
                              stackId={key.stackId}
                            />
                          ))}
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
                      {activeTrend.insight}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-4 bg-[#fafafa] border-t border-[#e2e8f0] flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-[#0f172a] text-white text-[11px] font-bold uppercase tracking-widest rounded transition-colors hover:bg-slate-800 cursor-pointer"
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
