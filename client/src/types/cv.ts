export type CVType = "arabic" | "english" | "both";
export type ApplicantCategory = "student" | "fresh_grad" | "professional" | "academic" | "creative";

export type ArabicTemplateId = "saudi_formal" | "modern_arabic" | "ats_arabic";
export type EnglishTemplateId = "modern_executive" | "classic_corporate" | "ats_minimal";

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  city: string;
  country?: string;
  nationality?: string;
  linkedin?: string;
  githubOrPortfolio?: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  graduationYear: string;
  details?: string;
}

export interface ExperienceEntry {
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
}

export interface CVBuilderFormData {
  cvType: CVType;
  category: ApplicantCategory;
  personalInfo: PersonalInfo;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
  advancedKeywords: string[];
  specialInstructions: string;
  uploadedFileName?: string;
  uploadedFileText?: string;
}

export interface ArabicResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    summary: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    details?: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    achievements: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  atsKeywords: string[];
  atsScore: number;
  atsAnalysis: string;
}

export interface EnglishCVData {
  personalInfo: {
    name: string;
    targetRole: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    githubOrPortfolio?: string;
    executiveSummary: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    graduationYear: string;
    honorsOrDetails?: string;
  }>;
  professionalExperience: Array<{
    position: string;
    company: string;
    duration: string;
    bulletPoints: string[];
  }>;
  coreCompetencies: string[];
  technicalSkills: string[];
  softSkills: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  atsKeywords: string[];
  atsScore: number;
  atsOptimizationHighlights: string[];
  actionVerbsUsed: string[];
}

export interface CVGenerationResult {
  id: string;
  userId: string;
  wasFree: boolean;
  cvType: CVType;
  category: ApplicantCategory;
  targetJobTitle: string;
  templateArabic: ArabicTemplateId;
  templateEnglish: EnglishTemplateId;
  inputData: CVBuilderFormData;
  uploadedFileText?: string;
  uploadedFileName?: string;
  aiResponse: {
    arabicResume?: ArabicResumeData;
    englishCv?: EnglishCVData;
    generatedAt: string;
    modelUsed: string;
  };
  createdAt: string;
}

export interface UserSubscriptionStatus {
  fingerprint_id?: string;
  free_used: boolean;
  subscription_active: boolean;
  end_date: string | null;
  provider: string | null;
}

// Backward compatibility type aliases
export type CVFormData = CVBuilderFormData;
export type CVLanguageMode = CVType;
export type EnglishCvData = EnglishCVData;
export type GenerateCvResponse = CVGenerationResult;
