import React, { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Sparkles,
  Download,
  Copy,
  Printer,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Lock,
  ArrowRight,
  Eye,
  Layout,
  RefreshCw,
  Zap,
  Globe2,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import {
  CVFormData,
  ApplicantCategory,
  CVLanguageMode,
  ArabicTemplateId,
  EnglishTemplateId,
  GenerateCvResponse,
  UserSubscriptionStatus,
} from "@/types/cv";
import { ArabicResumeRenderer, EnglishCvRenderer } from "@/components/CVTemplates";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { PDFPreview } from "@/components/PDFPreview";
import { generateResumePdfBlob } from "@/lib/pdfGenerator";
import { ClayBackground } from "@/components/ClayBackground";

interface BuilderPageProps {
  status: UserSubscriptionStatus | null;
  onRefreshStatus?: () => void;
}

export function BuilderPage({ status, onRefreshStatus }: BuilderPageProps) {
  // Subscription Modal Control
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  // Form State initialized with realistic default sample
  const [formData, setFormData] = useState<CVFormData>({
    cvType: "both",
    category: "professional",
    personalInfo: {
      fullName: "Ahmed Barashed",
      jobTitle: "Senior DevOps & Cloud Solutions Architect",
      email: "ahmed.barashed@example.com",
      phone: "+966 50 123 4567",
      city: "Riyadh, Saudi Arabia",
      nationality: "Saudi",
      linkedin: "linkedin.com/in/ahmed-barashed",
    },
    education: [
      {
        degree: "B.S. in Computer Science & Cloud Computing",
        institution: "King Fahd University of Petroleum and Minerals (KFUPM)",
        graduationYear: "2019",
        details: "Graduated with First Honors (GPA: 3.89/4.00) · Cloud Systems Excellence Award",
      },
    ],
    experience: [
      {
        jobTitle: "Senior Cloud Infrastructure Engineer",
        company: "Saudi Enterprise FinTech Solutions",
        duration: "2021 - Present",
        description:
          "Architected multi-region AWS and Azure hybrid clusters serving 1.5M+ active users. Reduced infrastructure cloud costs by 34% through Kubernetes automated autoscaling and Spot instances while maintaining 99.99% uptime.",
      },
      {
        jobTitle: "DevOps & Systems Administrator",
        company: "Digital Transformation Hub",
        duration: "2019 - 2021",
        description:
          "Implemented comprehensive CI/CD GitLab pipelines for 45+ microservices, cutting deployment cycles from 4 hours to 12 minutes. Configured Terraform IaC for zero-downtime database failovers.",
      },
    ],
    skills: [
      "AWS & Azure Architecture",
      "Kubernetes & Docker",
      "CI/CD Pipeline Automation",
      "Terraform & Ansible",
      "FinTech Security Compliance",
      "Incident Management & SRE",
      "Team Mentorship & Agile Leadership",
    ],
    advancedKeywords: ["High Availability", "Terraform IaC", "Cost Optimization", "FinTech SLA 99.99%"],
    specialInstructions: "Focus on quantified XYZ achievements, Saudi Vision 2030 digital alignment, and executive technical leadership.",
  });

  // Local helper states
  const [newSkill, setNewSkill] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  // Uploaded CV parser state
  const [isParsingFile, setIsParsingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GenerateCvResponse | null>(null);

  // Template switchers
  const [selectedArabicTemplate, setSelectedArabicTemplate] = useState<ArabicTemplateId>("saudi_formal");
  const [selectedEnglishTemplate, setSelectedEnglishTemplate] = useState<EnglishTemplateId>("modern_executive");
  const [activeOutputTab, setActiveOutputTab] = useState<"arabic" | "english">("arabic");

  // Output view mode: "pdf_preview" (vector PDF with react-pdf) vs "live_template" (HTML view)
  const [outputViewMode, setOutputViewMode] = useState<"pdf_preview" | "live_template">("pdf_preview");
  const [currentPdfBlob, setCurrentPdfBlob] = useState<Blob | null>(null);

  // Copied text notification
  const [copiedText, setCopiedText] = useState(false);

  // Container ref for direct web print
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  // Determine if user has already used their free generation and is NOT subscribed
  const isGreyLocked = Boolean(status?.free_used && !status?.subscription_active);

  // Re-generate client-side vector PDF blob whenever generated data or active template changes
  useEffect(() => {
    if (!generatedResult) return;

    let isCancelled = false;

    const buildPdfBlob = async () => {
      try {
        const blob = await generateResumePdfBlob({
          arabicData: generatedResult.aiResponse.arabicResume,
          englishData: generatedResult.aiResponse.englishCv,
          arabicTemplate: selectedArabicTemplate,
          englishTemplate: selectedEnglishTemplate,
          activeMode: activeOutputTab,
        });

        if (!isCancelled && blob) {
          setCurrentPdfBlob(blob);
        }
      } catch (err) {
        console.warn("[PDFGenerator] Vector PDF build fallback:", err);
      }
    };

    buildPdfBlob();

    return () => {
      isCancelled = true;
    };
  }, [generatedResult, selectedArabicTemplate, selectedEnglishTemplate, activeOutputTab]);

  // Skill Management
  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (formData.skills.includes(newSkill.trim())) return;
    setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove),
    }));
  };

  // Keyword Management
  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    if (formData.advancedKeywords.includes(newKeyword.trim())) return;
    setFormData(prev => ({
      ...prev,
      advancedKeywords: [...prev.advancedKeywords, newKeyword.trim()],
    }));
    setNewKeyword("");
  };

  const removeKeyword = (kwToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      advancedKeywords: prev.advancedKeywords.filter(k => k !== kwToRemove),
    }));
  };

  // Education Management
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", institution: "", graduationYear: "", details: "" },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    if (formData.education.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  // Experience Management
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { jobTitle: "", company: "", duration: "", description: "" },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    if (formData.experience.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  // Upload Old CV / Photo Parser Handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File exceeds 20MB limit. Please upload a smaller file.");
      return;
    }

    setIsParsingFile(true);
    toast.info(`Extracting career data from "${file.name}"...`);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const res = await fetch("/api/cv/parse-document", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to parse document");
      }

      if (data.parsedData) {
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            fullName: data.parsedData.fullName || prev.personalInfo.fullName,
            jobTitle: data.parsedData.jobTitle || prev.personalInfo.jobTitle,
            email: data.parsedData.email || prev.personalInfo.email,
            phone: data.parsedData.phone || prev.personalInfo.phone,
            city: data.parsedData.city || prev.personalInfo.city,
            nationality: prev.personalInfo.nationality,
            linkedin: prev.personalInfo.linkedin,
          },
          skills: data.parsedData.skills?.length ? data.parsedData.skills : prev.skills,
          experience: data.parsedData.experience?.length ? data.parsedData.experience : prev.experience,
          education: data.parsedData.education?.length ? data.parsedData.education : prev.education,
        }));
        toast.success("Document analyzed successfully! Form fields populated.");
      }
    } catch (err: any) {
      console.error("Document parse error:", err);
      toast.error(err.message || "Could not read file. You can still input manually.");
    } finally {
      setIsParsingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // AI Generation Trigger
  const handleGenerate = async () => {
    if (isGreyLocked) {
      toast.error("You've already consumed your free generation pass. Please unlock unlimited access.");
      setIsSubModalOpen(true);
      return;
    }

    if (!formData.personalInfo.fullName.trim()) {
      toast.error("Please enter your full name in Box 2.");
      return;
    }
    if (!formData.personalInfo.jobTitle.trim()) {
      toast.error("Please enter your target job title in Box 2.");
      return;
    }

    setIsGenerating(true);
    toast.info("10-Year Recruiter AI is crafting your documents...");

    try {
      const fingerprint = localStorage.getItem("worng_fingerprint_id") || "anonymous";
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-fingerprint": fingerprint,
        },
        body: JSON.stringify({
          formData,
          fingerprint,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "SUBSCRIPTION_REQUIRED" || res.status === 402) {
          toast.error("Free generation completed! Please unlock unlimited access for $2.67/mo.");
          setIsSubModalOpen(true);
          onRefreshStatus?.();
          return;
        }
        throw new Error(data.message || "Failed to generate CV");
      }

      setGeneratedResult(data);
      toast.success("Resume & CV created successfully!");
      onRefreshStatus?.();

      if (formData.cvType === "english") {
        setActiveOutputTab("english");
      } else {
        setActiveOutputTab("arabic");
      }

      // Smooth scroll to output box
      setTimeout(() => {
        const outputElem = document.getElementById("outputBox");
        if (outputElem) {
          outputElem.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } catch (err: any) {
      console.error("CV Generation error:", err);
      toast.error(err.message || "Something went wrong during generation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Vector PDF Trigger
  const handleDownloadPdf = async () => {
    if (!generatedResult) {
      toast.error("No generated resume available yet.");
      return;
    }

    toast.info("Compiling vector PDF for download...");

    try {
      let blob = currentPdfBlob;
      if (!blob) {
        blob = await generateResumePdfBlob({
          arabicData: generatedResult.aiResponse.arabicResume,
          englishData: generatedResult.aiResponse.englishCv,
          arabicTemplate: selectedArabicTemplate,
          englishTemplate: selectedEnglishTemplate,
          activeMode: activeOutputTab,
        });
      }

      if (!blob) {
        throw new Error("Unable to build PDF binary");
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.personalInfo.fullName.replace(/\s+/g, "_")}_${
        activeOutputTab === "arabic" ? "Arabic_Resume" : "English_CV"
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (err) {
      console.error("PDF download failed:", err);
      toast.error("Direct download failed. Try the Print button to Save as PDF.");
    }
  };

  // Direct Web Print Trigger
  const handlePrintPdf = () => {
    if (!generatedResult) {
      toast.error("No generated resume to print.");
      return;
    }
    toast.info("Opening print dialog...");
    window.print();
  };

  // Copy plain text formatted summary
  const handleCopyText = () => {
    if (!generatedResult) return;

    let textToCopy = "";
    if (activeOutputTab === "arabic" && generatedResult.aiResponse.arabicResume) {
      const ar = generatedResult.aiResponse.arabicResume;
      textToCopy = `${ar.personalInfo.name}\n${ar.personalInfo.title}\n${ar.personalInfo.location}\n${ar.personalInfo.email} | ${ar.personalInfo.phone}\n\n[الملخص التنفيذي]\n${ar.personalInfo.summary}\n\n[الخبرات المهنية]\n${(ar.experience || []).map(e => `${e.role} - ${e.company} (${e.period})\n${(e.achievements || []).map(a => `• ${a}`).join("\n")}`).join("\n\n")}`;
    } else if (generatedResult.aiResponse.englishCv) {
      const en = generatedResult.aiResponse.englishCv;
      textToCopy = `${en.personalInfo.name}\n${en.personalInfo.targetRole}\n${en.personalInfo.location}\n${en.personalInfo.email} | ${en.personalInfo.phone}\n\n[PROFESSIONAL SUMMARY]\n${en.personalInfo.executiveSummary}\n\n[WORK EXPERIENCE]\n${(en.professionalExperience || []).map(e => `${e.position} - ${e.company} (${e.duration})\n${(e.bulletPoints || []).map(b => `• ${b}`).join("\n")}`).join("\n\n")}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="relative min-h-screen text-[#1A1A1A] pb-24 overflow-x-hidden bg-[#F9F5EF]">
      {/* Background with 5 organic blobs and subtle grain */}
      <ClayBackground />

      {/* Print-specific style rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-document-container, #print-document-container * {
            visibility: visible;
          }
          #print-document-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 relative z-10">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE7DE] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EDE7DE] text-[#1A1A1A] shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span>10-Year Recruiter AI Engine</span>
              </span>
              {status?.subscription_active ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8C4C4]/50 text-[#1A1A1A] border border-[#E8C4C4] shadow-xs">
                  Unlimited Pass Active
                </span>
              ) : status?.free_used ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Free Used · Upgrade $2.67/mo
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#EDE7DE] text-[#6B6B6B]">
                  1 Free Generation Available
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1A1A1A] mt-2 tracking-tight">
              AI Resume & CV Workspace
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isGreyLocked && (
              <button
                type="button"
                onClick={() => setIsSubModalOpen(true)}
                className="px-4 py-2 rounded-2xl btn-clay-dark text-xs font-bold text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-white" />
                <span>Unlock Unlimited ($2.67)</span>
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Floating Workspace with Perspective */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start perspective-container">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Input Form Panel (Floating with Perspective) */}
          {/* ========================================================= */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 tilted-hero-card"
          >
            {/* BOX 1: Document Type & Applicant Category */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#C78997] uppercase tracking-wider">
                  Box 1: Type & Category
                </span>
              </div>

              <label className="block text-xs font-bold text-[#695B60] mb-2">
                Document Generation Scope (اختيار نوع السيرة الذاتية):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, cvType: "arabic" }))}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.cvType === "arabic"
                      ? "bg-white/80 border-[#C78997] shadow-[0_4px_20px_rgba(199,137,151,0.3)] text-[#2A2125]"
                      : "bg-white/35 border-white/60 text-[#695B60] hover:text-[#2A2125]"
                  }`}
                >
                  <p className="text-xs font-black">السيرة الذاتية (Arabic)</p>
                  <p className="text-[10px] text-[#695B60] mt-0.5">وثيقة رسمية مفصلة (الخليج)</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, cvType: "english" }))}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.cvType === "english"
                      ? "bg-white/80 border-[#C78997] shadow-[0_4px_20px_rgba(199,137,151,0.3)] text-[#2A2125]"
                      : "bg-white/35 border-white/60 text-[#695B60] hover:text-[#2A2125]"
                  }`}
                >
                  <p className="text-xs font-black">الـ CV (English CV)</p>
                  <p className="text-[10px] text-[#695B60] mt-0.5">وثيقة مختصرة بمعايير ATS</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, cvType: "both" }))}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.cvType === "both"
                      ? "bg-white/80 border-[#C78997] shadow-[0_4px_20px_rgba(199,137,151,0.3)] text-[#2A2125]"
                      : "bg-white/35 border-white/60 text-[#695B60] hover:text-[#2A2125]"
                  }`}
                >
                  <p className="text-xs font-black">كلاهما معاً (Both)</p>
                  <p className="text-[10px] text-[#C78997] font-bold mt-0.5">Dual-Engine Recomm.</p>
                </button>
              </div>

              {/* Applicant Category */}
              <label className="block text-xs font-bold text-[#695B60] mb-2">
                Applicant Level (فئة المتقدم):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "student", label: "طالب جامعي", sub: "جامعة / تدريب" },
                  { id: "fresh_grad", label: "خريج جديد", sub: "أقل من سنتين" },
                  { id: "professional", label: "محترف ومهني", sub: "2-7 سنوات" },
                  { id: "executive", label: "مدير تنفيذي", sub: "+8 سنوات" },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, category: cat.id as ApplicantCategory }))}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      formData.category === cat.id
                        ? "bg-[#C78997] text-white border-transparent shadow-[0_4px_15px_rgba(199,137,151,0.4)] font-black"
                        : "bg-white/40 border-white/60 text-[#695B60] hover:text-[#2A2125]"
                    }`}
                  >
                    <p className="text-xs">{cat.label}</p>
                    <p className="text-[9px] opacity-80">{cat.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* BOX 2: Personal Information (البيانات الشخصية) */}
            <div className="glass-card p-6">
              <span className="text-xs font-black text-[#C78997] uppercase tracking-wider block mb-3">
                Box 2: Personal Information (البيانات الشخصية)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#695B60] mb-1">
                    الاسم الكامل (Full Name) *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.fullName}
                    onChange={e =>
                      setFormData(p => ({
                        ...p,
                        personalInfo: { ...p.personalInfo, fullName: e.target.value },
                      }))
                    }
                    className="w-full input-sunset px-3 py-2 text-xs"
                    placeholder="Ahmed Barashed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#695B60] mb-1">
                    المسمى الوظيفي المستهدف (Target Job Title) *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.jobTitle}
                    onChange={e =>
                      setFormData(p => ({
                        ...p,
                        personalInfo: { ...p.personalInfo, jobTitle: e.target.value },
                      }))
                    }
                    className="w-full input-sunset px-3 py-2 text-xs"
                    placeholder="Senior Cloud Solutions Architect"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#695B60] mb-1">البريد الإلكتروني (Email)</label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={e =>
                      setFormData(p => ({
                        ...p,
                        personalInfo: { ...p.personalInfo, email: e.target.value },
                      }))
                    }
                    className="w-full input-sunset px-3 py-2 text-xs"
                    placeholder="ahmed.barashed@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#695B60] mb-1">رقم الهاتف (Phone Number)</label>
                  <input
                    type="text"
                    value={formData.personalInfo.phone}
                    onChange={e =>
                      setFormData(p => ({
                        ...p,
                        personalInfo: { ...p.personalInfo, phone: e.target.value },
                      }))
                    }
                    className="w-full input-sunset px-3 py-2 text-xs"
                    placeholder="+966 50 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#695B60] mb-1">المدينة والدولة (City & Country)</label>
                  <input
                    type="text"
                    value={formData.personalInfo.city}
                    onChange={e =>
                      setFormData(p => ({
                        ...p,
                        personalInfo: { ...p.personalInfo, city: e.target.value },
                      }))
                    }
                    className="w-full input-sunset px-3 py-2 text-xs"
                    placeholder="Riyadh, Saudi Arabia"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#695B60] mb-1">الجنسية (Nationality)</label>
                  <input
                    type="text"
                    value={formData.personalInfo.nationality || ""}
                    onChange={e =>
                      setFormData(p => ({
                        ...p,
                        personalInfo: { ...p.personalInfo, nationality: e.target.value },
                      }))
                    }
                    className="w-full input-sunset px-3 py-2 text-xs"
                    placeholder="Saudi"
                  />
                </div>
              </div>
            </div>

            {/* BOX 3: Upload Old Resume / Photo OCR (رفع سيرة سابقة أو صورة) */}
            <div className="glass-card p-6">
              <span className="text-xs font-black text-[#F5B297] uppercase tracking-wider block mb-2">
                Box 3: Upload Old Resume or Photo (رفع سيرة سابقة أو صورة)
              </span>
              <p className="text-xs text-[#695B60] mb-3">
                ارفع سيرتك السابقة (PDF أو صورة JPG/PNG) لملء الصناديق تلقائياً وإعادة صياغتها بأقوى عبارات التوظيف:
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                disabled={isParsingFile}
                onClick={() => fileInputRef.current?.click()}
                className="button-glow w-full py-5 px-4 rounded-2xl border border-dashed border-[#C78997] bg-white/40 hover:bg-white/60 flex flex-col items-center justify-center gap-2 text-xs text-[#695B60] hover:text-[#2A2125] transition-all"
              >
                {isParsingFile ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-[#C78997]" />
                    <span className="font-bold text-[#C78997]">جاري قراءة واستخراج البيانات بالذكاء الاصطناعي...</span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full glass-icon-circle bg-white/70 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-[#C78997]" />
                    </div>
                    <span className="font-bold text-[#2A2125]">اضغط هنا لاختيار ملف PDF أو صورة السيرة القديمة</span>
                    <span className="text-[10px] text-[#695B60]">يدعم ملفات PDF والصور حتى 20 ميجابايت</span>
                  </>
                )}
              </button>
            </div>

            {/* BOX 4: Work Experience (الخبرات المهنية) */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-black text-[#C78997] uppercase tracking-wider block">
                    Box 4: Work Experience (الخبرات المهنية)
                  </span>
                  <span className="text-[10px] text-[#695B60]">حتى لو فارغ للطالب أو الخريج الجديد</span>
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#C78997] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 bg-white/45 rounded-2xl border border-white/70 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2A2125]">Position #{idx + 1}</span>
                      {formData.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="text-[#695B60] hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.jobTitle}
                        onChange={e => updateExperience(idx, "jobTitle", e.target.value)}
                        className="input-sunset px-2.5 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={e => updateExperience(idx, "company", e.target.value)}
                        className="input-sunset px-2.5 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={exp.duration}
                        onChange={e => updateExperience(idx, "duration", e.target.value)}
                        className="input-sunset px-2.5 py-1.5 text-xs"
                      />
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Key achievements & metrics (e.g. Increased system performance by 30%, led team of 6 engineers)..."
                      value={exp.description}
                      onChange={e => updateExperience(idx, "description", e.target.value)}
                      className="w-full input-sunset px-2.5 py-1.5 resize-none text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BOX 5: Core Skills & Competencies (المهارات) */}
            <div className="glass-card p-6">
              <span className="text-xs font-black text-[#C78997] uppercase tracking-wider block mb-3">
                Box 5: Core Skills (المهارات)
              </span>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {formData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/70 border border-white text-xs font-bold text-[#2A2125] shadow-sm"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-[#695B60] hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Financial Modeling, Leadership, Python)..."
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="flex-1 input-sunset px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="button-glow px-4 py-2 btn-sunset-peach text-xs font-bold text-[#2A2125]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* BOX 6: Education (التعليم والمؤهلات) */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#C78997] uppercase tracking-wider block">
                  Box 6: Education (التعليم والمؤهلات)
                </span>
                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#C78997] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.education.map((edu, idx) => (
                  <div key={idx} className="p-4 bg-white/45 rounded-2xl border border-white/70 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2A2125]">Degree #{idx + 1}</span>
                      {formData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="text-[#695B60] hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Degree (e.g. B.S. in Computer Science)"
                        value={edu.degree}
                        onChange={e => updateEducation(idx, "degree", e.target.value)}
                        className="input-sunset px-2.5 py-1.5 text-xs sm:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Year (e.g. 2021)"
                        value={edu.graduationYear}
                        onChange={e => updateEducation(idx, "graduationYear", e.target.value)}
                        className="input-sunset px-2.5 py-1.5 text-xs"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Institution (e.g. King Saud University)"
                      value={edu.institution}
                      onChange={e => updateEducation(idx, "institution", e.target.value)}
                      className="w-full input-sunset px-2.5 py-1.5 text-xs"
                    />

                    <input
                      type="text"
                      placeholder="Details / Honors (e.g. First Class Honors, GPA 3.9/4.0)"
                      value={edu.details || ""}
                      onChange={e => updateEducation(idx, "details", e.target.value)}
                      className="w-full input-sunset px-2.5 py-1.5 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BOX 7: Advanced Details (Keywords & Special Instructions) */}
            <div className="glass-card p-6">
              <span className="text-xs font-black text-[#C78997] uppercase tracking-wider block mb-2">
                Box 7: Advanced Details (Keywords & Directives)
              </span>

              <label className="block text-[11px] font-bold text-[#695B60] mb-1">
                الكلمات المفتاحية المطلوبة في السيرة (ATS Keywords):
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.advancedKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/70 border border-white text-[#C78997] text-[11px] font-mono font-bold"
                  >
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyword(kw)}
                      className="text-[#695B60] hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. Cloud Security, ROI, Agile Sprint..."
                  value={newKeyword}
                  onChange={e => setNewKeyword(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                  className="flex-1 input-sunset px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="button-glow px-4 py-2 btn-sunset-peach text-xs font-bold text-[#2A2125]"
                >
                  Add
                </button>
              </div>

              <label className="block text-[11px] font-bold text-[#695B60] mb-1">
                تعليمات خاصة لـ 10-Year Recruiter AI (Special Instructions):
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Focus on leadership and team scaling; highlight Saudi Vision 2030 digital initiatives..."
                value={formData.specialInstructions || ""}
                onChange={e => setFormData(p => ({ ...p, specialInstructions: e.target.value }))}
                className="w-full input-sunset px-3 py-2 text-xs resize-none"
              />
            </div>

            {/* GENERATE ACTION BUTTON WITH GLOWING LIGHT */}
            <div className="pt-2">
              {isGreyLocked ? (
                <div className="space-y-2">
                  <button
                    id="generateBtn"
                    type="button"
                    disabled={true}
                    onClick={() => {
                      toast.error("You've used your free generation. Please unlock unlimited for $2.67/mo.");
                      setIsSubModalOpen(true);
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-stone-300 text-stone-600 cursor-not-allowed font-black text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>Free Generation Used — Subscription Required ($2.67/mo)</span>
                  </button>
                  <p className="text-[11px] text-center text-[#695B60]">
                    You have already used your 1 free generation. Unlock unlimited documents for $2.67/month.
                  </p>
                </div>
              ) : (
                <button
                  id="generateBtn"
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  className="button-glow w-full py-4 px-6 rounded-2xl btn-sunset-rose text-sm font-black flex items-center justify-center gap-2 group cursor-pointer shadow-[0_6px_25px_rgba(199,137,151,0.4)]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Synthesizing 10-Year Recruiter Resume...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-white" />
                      <span>
                        {status?.free_used
                          ? "اصنع الآن / Generate Now"
                          : "اصنع الآن / Generate Now (Free First Time)"}
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-white" />
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Output Preview Panel (Floating, Higher Z)   */}
          {/* ========================================================= */}
          <motion.div
            id="outputBox"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 space-y-4 relative z-20 tilted-preview-card"
          >
            <div className="glass-card p-6 flex flex-col min-h-[640px]">
              {generatedResult ? (
                <div className="flex flex-col flex-1 space-y-4">
                  {/* Header of Box 8 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#C78997] uppercase tracking-wider">
                          Box 8: Output Workspace
                        </span>
                        <span className="text-[10px] font-mono bg-white/70 text-[#C78997] border border-white px-2 py-0.5 rounded-full font-bold">
                          Vector PDF Ready
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-[#2A2125] mt-1">
                        Your AI-Generated CV & Resume
                      </h2>
                    </div>

                    {/* View Mode & Copy Buttons */}
                    <div className="flex items-center gap-2">
                      <div className="flex bg-white/60 p-1 rounded-2xl border border-white text-[11px] font-bold shadow-sm">
                        <button
                          type="button"
                          onClick={() => setOutputViewMode("pdf_preview")}
                          className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 ${
                            outputViewMode === "pdf_preview"
                              ? "bg-[#C78997] text-white shadow-sm"
                              : "text-[#695B60] hover:text-[#2A2125]"
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>PDF Viewer</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOutputViewMode("live_template")}
                          className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 ${
                            outputViewMode === "live_template"
                              ? "bg-[#C78997] text-white shadow-sm"
                              : "text-[#695B60] hover:text-[#2A2125]"
                          }`}
                        >
                          <Layout className="w-3 h-3" />
                          <span>Web Layout</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyText}
                        className="button-glow p-2 rounded-2xl btn-sunset-glass text-xs flex items-center shadow-sm"
                        title="Copy text summary"
                      >
                        {copiedText ? (
                          <Check className="w-3.5 h-3.5 text-[#C78997]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#2A2125]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sub-Tabs: Arabic vs English */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex bg-white/60 p-1 rounded-2xl border border-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => setActiveOutputTab("arabic")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                          activeOutputTab === "arabic"
                            ? "bg-[#C78997] text-white shadow-sm"
                            : "text-[#695B60] hover:text-[#2A2125]"
                        }`}
                      >
                        سيرة عربية PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveOutputTab("english")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                          activeOutputTab === "english"
                            ? "bg-[#C78997] text-white shadow-sm"
                            : "text-[#695B60] hover:text-[#2A2125]"
                        }`}
                      >
                        CV انجليزي PDF
                      </button>
                    </div>

                    {/* Template Selector */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#695B60] hidden sm:inline font-bold">Template:</span>
                      {activeOutputTab === "arabic" ? (
                        <select
                          value={selectedArabicTemplate}
                          onChange={e => setSelectedArabicTemplate(e.target.value as ArabicTemplateId)}
                          className="input-sunset px-2.5 py-1.5 text-xs text-[#2A2125]"
                        >
                          <option value="saudi_formal">1. رسمي سعودي (تفصيلي)</option>
                          <option value="modern_arabic">2. عصري</option>
                          <option value="ats_arabic">3. ATS عربي</option>
                        </select>
                      ) : (
                        <select
                          value={selectedEnglishTemplate}
                          onChange={e => setSelectedEnglishTemplate(e.target.value as EnglishTemplateId)}
                          className="input-sunset px-2.5 py-1.5 text-xs text-[#2A2125]"
                        >
                          <option value="modern_executive">1. Modern Executive</option>
                          <option value="classic_corporate">2. Classic Corporate</option>
                          <option value="ats_minimal">3. Minimal ATS</option>
                        </select>
                      )}
                    </div>
                  </div>

                  {/* ATS Scorecard Bar */}
                  <div className="p-3.5 rounded-2xl bg-white/50 border border-white/70 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C78997] animate-pulse" />
                      <span className="font-extrabold text-[#2A2125]">ATS Algorithm Match:</span>
                      <span className="font-mono font-black text-[#C78997] text-sm">
                        {activeOutputTab === "arabic"
                          ? `${generatedResult.aiResponse.arabicResume?.atsScore || 97}%`
                          : `${generatedResult.aiResponse.englishCv?.atsScore || 98}%`}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#695B60]">
                      <span className="font-bold">Keywords:</span>
                      {(activeOutputTab === "arabic"
                        ? generatedResult.aiResponse.arabicResume?.atsKeywords.slice(0, 3)
                        : generatedResult.aiResponse.englishCv?.atsKeywords.slice(0, 3)
                      )?.map((kw, i) => (
                        <span key={i} className="bg-white/80 border border-white px-2 py-0.5 rounded-lg text-[#2A2125] font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Document Rendering Frame */}
                  <div className="relative flex-1">
                    {outputViewMode === "pdf_preview" ? (
                      <PDFPreview
                        file={currentPdfBlob}
                        fileName={`${formData.personalInfo.fullName.replace(/\s+/g, "_")}_${
                          activeOutputTab === "arabic" ? "Arabic_Resume" : "English_CV"
                        }.pdf`}
                        title={
                          activeOutputTab === "arabic"
                            ? "السيرة الذاتية العربية الرسمية (تفصيلي)"
                            : "English ATS Professional CV"
                        }
                        subtitle={
                          activeOutputTab === "arabic"
                            ? "Saudi & Gulf Executive Standard · Selectable Vector PDF"
                            : "Global ATS Quantified XYZ Formula · Selectable Vector PDF"
                        }
                        onDownload={handleDownloadPdf}
                        onPrint={handlePrintPdf}
                      />
                    ) : (
                      <div
                        id="print-document-container"
                        ref={printAreaRef}
                        className="overflow-y-auto max-h-[800px] bg-white/60 rounded-3xl border border-white/80 p-4 sm:p-6 shadow-sm"
                      >
                        {activeOutputTab === "arabic" && generatedResult.aiResponse.arabicResume && (
                          <ArabicResumeRenderer
                            data={generatedResult.aiResponse.arabicResume}
                            templateId={selectedArabicTemplate}
                          />
                        )}
                        {activeOutputTab === "english" && generatedResult.aiResponse.englishCv && (
                          <EnglishCvRenderer
                            data={generatedResult.aiResponse.englishCv}
                            templateId={selectedEnglishTemplate}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Initial Empty Placeholder */
                <div className="flex flex-col items-center justify-center flex-1 min-h-[520px] text-center p-8 bg-white/35 rounded-3xl border border-white/60">
                  <div className="w-16 h-16 rounded-full glass-icon-circle bg-white/70 flex items-center justify-center text-[#C78997] mb-4 shadow-[0_4px_20px_rgba(245,178,151,0.4)]">
                    <FileText className="w-8 h-8 text-[#C78997]" />
                  </div>
                  <h3 className="text-lg font-black text-[#2A2125] mb-1.5">
                    Your AI-Generated CV & Resume
                  </h3>
                  <p className="text-xs text-[#695B60] max-w-sm mb-6 leading-relaxed">
                    صندوق الإخراج (Output Box) فارغ حالياً. املأ البيانات أو ارفع سيرتك السابقة، ثم اضغط على زر{" "}
                    <strong className="text-[#C78997]">اصنع الآن / Generate Now</strong> لمعاينة وتحميل ملف الـ PDF فوراً.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md text-left text-[11px] text-[#695B60]">
                    <div className="p-3.5 rounded-2xl bg-white/50 border border-white/80 flex items-start gap-2.5 shadow-sm">
                      <Sparkles className="w-4 h-4 text-[#C78997] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#2A2125] block">سيرة عربية رسمية</span>
                        <span>معايير التوظيف السعودية والخليجية</span>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/50 border border-white/80 flex items-start gap-2.5 shadow-sm">
                      <Zap className="w-4 h-4 text-[#F5B297] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#2A2125] block">English ATS CV</span>
                        <span>XYZ Formula & High Keyword Density</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subscription Modal (Payoneer + OKX TRC20) */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onSuccess={() => {
          setIsSubModalOpen(false);
          onRefreshStatus?.();
        }}
      />
    </div>
  );
}
