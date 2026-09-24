import React from "react";
import { ArabicResumeData, EnglishCVData, ArabicTemplateId, EnglishTemplateId } from "@/types/cv";
import { Mail, Phone, MapPin, Globe, Linkedin, Award, BookOpen, Briefcase, CheckCircle2 } from "lucide-react";

interface ArabicResumeViewProps {
  data: ArabicResumeData;
  templateId?: ArabicTemplateId;
}

interface EnglishCvViewProps {
  data: EnglishCVData;
  templateId?: EnglishTemplateId;
}

// -------------------------------------------------------------
// ARABIC TEMPLATE 1: رسمي سعودي تفصيلي (Saudi Formal)
// -------------------------------------------------------------
export function SaudiFormalTemplate({ data }: { data: ArabicResumeData }) {
  const p = data.personalInfo;
  return (
    <div dir="rtl" className="bg-white text-slate-900 p-8 sm:p-12 shadow-sm rounded-lg max-w-4xl mx-auto font-sans leading-relaxed selection:bg-amber-100 selection:text-slate-900 border border-slate-200 print:border-none print:shadow-none print:p-0">
      {/* Header */}
      <header className="border-b-2 border-emerald-900/80 pb-6 mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight mb-2">
          {p.name}
        </h1>
        <p className="text-lg font-bold text-amber-700 mb-4">{p.title}</p>
        
        {/* Contact Info */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-emerald-800" />
            <span dir="ltr">{p.email}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-800" />
            <span dir="ltr">{p.phone}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-800" />
            <span>{p.location}</span>
          </span>
          {p.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-emerald-800" />
              <span dir="ltr">{p.linkedin}</span>
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-base font-bold text-emerald-950 uppercase tracking-wide border-b border-emerald-100 pb-1 mb-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-800 inline-block"></span>
          النبذة المهنية والهدف الوظيفي
        </h2>
        <p className="text-sm text-slate-700 text-justify leading-relaxed">
          {p.summary}
        </p>
      </section>

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold text-emerald-950 uppercase tracking-wide border-b border-emerald-100 pb-1 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-800 inline-block"></span>
            الخبرات العملية وسجل الإنجازات
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="pb-3 border-b border-slate-100 last:border-none">
                <div className="flex flex-wrap items-baseline justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {exp.period}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 mb-2">{exp.company}</p>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
                  {exp.achievements.map((ach, achIdx) => (
                    <li key={achIdx} className="leading-relaxed">
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold text-emerald-950 uppercase tracking-wide border-b border-emerald-100 pb-1 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-800 inline-block"></span>
            المؤهلات الأكاديمية والتعليم
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="flex flex-wrap justify-between items-baseline text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                  <p className="text-slate-600 font-medium">{edu.institution}</p>
                  {edu.details && <p className="text-emerald-900 font-medium mt-0.5">{edu.details}</p>}
                </div>
                <span className="text-slate-500 font-semibold">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Grid */}
      <section className="mb-6">
        <h2 className="text-base font-bold text-emerald-950 uppercase tracking-wide border-b border-emerald-100 pb-1 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-800 inline-block"></span>
          المهارات والقدرات المهنية
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 mb-1.5 text-xs">المهارات التقنية والتخصصية:</h4>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.technical.map((sk, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded text-xs font-medium">
                  {sk}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1.5 text-xs">المهارات الشخصية والقيادية:</h4>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.soft.map((sk, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded text-xs font-medium">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-200 text-xs">
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h4 className="font-bold text-emerald-950 mb-2">الشهادات المهنية المعتمدة:</h4>
            <ul className="space-y-1 text-slate-700">
              {data.certifications.map((cert, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{cert.name} ({cert.issuer} - {cert.year})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.languages && data.languages.length > 0 && (
          <div>
            <h4 className="font-bold text-emerald-950 mb-2">اللغات:</h4>
            <div className="flex flex-wrap gap-2">
              {data.languages.map((l, idx) => (
                <span key={idx} className="text-slate-700">
                  <strong className="text-slate-900">{l.language}:</strong> {l.proficiency}
                  {idx < data.languages.length - 1 && " · "}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ARABIC TEMPLATE 2: عصري أنيق (Modern Arabic)
// -------------------------------------------------------------
export function ModernArabicTemplate({ data }: { data: ArabicResumeData }) {
  const p = data.personalInfo;
  return (
    <div dir="rtl" className="bg-white text-slate-900 p-8 sm:p-12 shadow-sm rounded-lg max-w-4xl mx-auto font-sans leading-relaxed selection:bg-blue-100 selection:text-slate-900 border border-slate-200 print:border-none print:shadow-none print:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{p.name}</h1>
          <p className="text-base font-semibold text-blue-700 mt-1">{p.title}</p>
        </div>
        <div className="text-xs text-slate-600 space-y-1 text-left sm:text-right" dir="ltr">
          <p>{p.email} · {p.phone}</p>
          <p>{p.location} {p.linkedin ? `· ${p.linkedin}` : ""}</p>
        </div>
      </div>

      <div className="mt-6 mb-6">
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify bg-slate-50 p-4 rounded-lg border-r-4 border-blue-600">
          {p.summary}
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">الخبرات والمسار المهني</h3>
          <div className="space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="relative pr-4 border-r-2 border-slate-200">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-sm font-bold text-slate-900">{exp.role} · <span className="font-medium text-slate-600">{exp.company}</span></h4>
                  <span className="text-xs text-slate-500 font-mono">{exp.period}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 mt-2">
                  {exp.achievements.map((ach, aIdx) => (
                    <li key={aIdx}>{ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">التعليم الأكاديمي</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {data.education.map((edu, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded">
                <p className="font-bold text-slate-900">{edu.degree}</p>
                <p className="text-slate-600">{edu.institution} · {edu.year}</p>
                {edu.details && <p className="text-blue-700 mt-1">{edu.details}</p>}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">المهارات الرئيسية</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {[...data.skills.technical, ...data.skills.soft].map((sk, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                {sk}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ARABIC TEMPLATE 3: ATS عربي مباشر (Minimal ATS)
// -------------------------------------------------------------
export function AtsArabicMinimal({ data }: { data: ArabicResumeData }) {
  const p = data.personalInfo;
  return (
    <div dir="rtl" className="bg-white text-black p-8 sm:p-12 shadow-sm rounded-lg max-w-4xl mx-auto font-sans leading-relaxed selection:bg-slate-200 selection:text-black border border-slate-200 print:border-none print:shadow-none print:p-0">
      <div className="text-center pb-4 mb-4 border-b border-black">
        <h1 className="text-2xl font-bold uppercase tracking-wide">{p.name}</h1>
        <p className="text-sm font-semibold mt-1">{p.title}</p>
        <p className="text-xs mt-1" dir="ltr">
          {p.email} | {p.phone} | {p.location} {p.linkedin ? `| ${p.linkedin}` : ""}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">النبذة المهنية</h2>
        <p className="text-xs leading-relaxed text-justify">{p.summary}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2">الخبرة المهنية</h2>
        {data.experience.map((exp, idx) => (
          <div key={idx} className="mb-3">
            <div className="flex justify-between text-xs font-bold">
              <span>{exp.role} - {exp.company}</span>
              <span>{exp.period}</span>
            </div>
            <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
              {exp.achievements.map((ach, aIdx) => (
                <li key={aIdx}>{ach}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">المؤهلات الأكاديمية</h2>
        {data.education.map((edu, idx) => (
          <div key={idx} className="flex justify-between text-xs mb-1">
            <span><strong>{edu.degree}</strong>, {edu.institution} {edu.details ? `(${edu.details})` : ""}</span>
            <span>{edu.year}</span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">المهارات والكلمات المفتاحية ATS</h2>
        <p className="text-xs leading-relaxed">
          <strong>المهارات التخصصية:</strong> {data.skills.technical.join(" · ")} <br />
          <strong>المهارات العامة:</strong> {data.skills.soft.join(" · ")} <br />
          <strong>الكلمات المفتاحية:</strong> {data.atsKeywords.join(", ")}
        </p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ENGLISH TEMPLATE 1: Modern Executive ATS CV
// -------------------------------------------------------------
export function ModernExecutiveTemplate({ data }: { data: EnglishCVData }) {
  const p = data.personalInfo;
  return (
    <div dir="ltr" className="bg-white text-slate-900 p-8 sm:p-12 shadow-sm rounded-lg max-w-4xl mx-auto font-sans leading-relaxed selection:bg-indigo-100 selection:text-slate-900 border border-slate-200 print:border-none print:shadow-none print:p-0">
      {/* Header */}
      <header className="border-b-2 border-indigo-900 pb-6 mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-950 tracking-tight mb-1">
          {p.name}
        </h1>
        <p className="text-base sm:text-lg font-bold text-indigo-700 tracking-wide mb-3">
          {p.targetRole}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-indigo-800" />
            {p.email}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-indigo-800" />
            {p.phone}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-800" />
            {p.location}
          </span>
          {p.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-indigo-800" />
              {p.linkedin}
            </span>
          )}
        </div>
      </header>

      {/* Executive Summary */}
      <section className="mb-6">
        <h2 className="text-xs font-bold text-indigo-950 uppercase tracking-widest border-b border-indigo-100 pb-1 mb-2">
          Executive Summary
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
          {p.executiveSummary}
        </p>
      </section>

      {/* Core Competencies & ATS Keywords */}
      <section className="mb-6">
        <h2 className="text-xs font-bold text-indigo-950 uppercase tracking-widest border-b border-indigo-100 pb-1 mb-2">
          Core Competencies & Keywords
        </h2>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {data.coreCompetencies.map((c, idx) => (
            <span key={idx} className="bg-indigo-50/80 text-indigo-900 border border-indigo-100 px-2.5 py-0.5 rounded font-medium">
              {c}
            </span>
          ))}
          {data.technicalSkills.map((t, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded font-medium">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Professional Experience */}
      <section className="mb-6">
        <h2 className="text-xs font-bold text-indigo-950 uppercase tracking-widest border-b border-indigo-100 pb-1 mb-3">
          Professional Experience
        </h2>
        <div className="space-y-4">
          {data.professionalExperience.map((exp, idx) => (
            <div key={idx} className="pb-3 border-b border-slate-100 last:border-none">
              <div className="flex flex-wrap justify-between items-baseline mb-0.5">
                <h3 className="text-sm font-bold text-slate-900">
                  {exp.position} <span className="font-semibold text-indigo-800">| {exp.company}</span>
                </h3>
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  {exp.duration}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 mt-2">
                {exp.bulletPoints.map((bp, bIdx) => (
                  <li key={bIdx} className="leading-relaxed">
                    {bp}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-xs font-bold text-indigo-950 uppercase tracking-widest border-b border-indigo-100 pb-1 mb-2.5">
          Education & Credentials
        </h2>
        <div className="space-y-2 text-xs">
          {data.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div>
                <p className="font-bold text-slate-900 text-sm">{edu.degree}</p>
                <p className="text-slate-600">{edu.institution}</p>
                {edu.honorsOrDetails && <p className="text-indigo-800 font-medium">{edu.honorsOrDetails}</p>}
              </div>
              <span className="text-slate-500 font-semibold">{edu.graduationYear}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Languages & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs text-slate-700">
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h4 className="font-bold text-indigo-950 mb-1">Certifications:</h4>
            <ul className="space-y-0.5">
              {data.certifications.map((c, idx) => (
                <li key={idx}>• {c.name} ({c.issuer}, {c.year})</li>
              ))}
            </ul>
          </div>
        )}
        {data.languages && data.languages.length > 0 && (
          <div>
            <h4 className="font-bold text-indigo-950 mb-1">Languages:</h4>
            <p>
              {data.languages.map((l, idx) => (
                <span key={idx}>
                  <strong>{l.language}:</strong> {l.proficiency}
                  {idx < data.languages.length - 1 ? " | " : ""}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ENGLISH TEMPLATE 2: Classic Corporate CV
// -------------------------------------------------------------
export function ClassicCorporateTemplate({ data }: { data: EnglishCVData }) {
  const p = data.personalInfo;
  return (
    <div dir="ltr" className="bg-white text-slate-900 p-8 sm:p-12 shadow-sm rounded-lg max-w-4xl mx-auto font-serif leading-relaxed selection:bg-slate-200 border border-slate-200 print:border-none print:shadow-none print:p-0">
      <header className="text-center pb-4 mb-4 border-b border-slate-400">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{p.name}</h1>
        <p className="text-sm font-semibold tracking-wider text-slate-700 uppercase mt-1">{p.targetRole}</p>
        <p className="text-xs text-slate-600 mt-2 font-sans">
          {p.email} • {p.phone} • {p.location} {p.linkedin ? `• ${p.linkedin}` : ""}
        </p>
      </header>

      <section className="mb-5 font-sans">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-0.5 mb-2 font-serif">
          Professional Profile
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed text-justify">{p.executiveSummary}</p>
      </section>

      <section className="mb-5 font-sans">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-0.5 mb-3 font-serif">
          Experience History
        </h2>
        <div className="space-y-3">
          {data.professionalExperience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                <span>{exp.position}, {exp.company}</span>
                <span className="font-normal font-mono text-slate-600">{exp.duration}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 mt-1">
                {exp.bulletPoints.map((bp, bIdx) => (
                  <li key={bIdx}>{bp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5 font-sans">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-0.5 mb-2 font-serif">
          Education
        </h2>
        {data.education.map((edu, idx) => (
          <div key={idx} className="flex justify-between items-baseline text-xs mb-1">
            <span><strong>{edu.degree}</strong> — {edu.institution}</span>
            <span className="font-mono text-slate-600">{edu.graduationYear}</span>
          </div>
        ))}
      </section>

      <section className="font-sans text-xs">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-0.5 mb-2 font-serif">
          Core Competencies
        </h2>
        <p className="text-slate-700">
          {[...data.coreCompetencies, ...data.technicalSkills].join(" • ")}
        </p>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// ENGLISH TEMPLATE 3: Minimal Single-Column ATS Standard
// -------------------------------------------------------------
export function MinimalAtsTemplate({ data }: { data: EnglishCVData }) {
  const p = data.personalInfo;
  return (
    <div dir="ltr" className="bg-white text-black p-8 sm:p-12 shadow-sm rounded-lg max-w-4xl mx-auto font-sans leading-relaxed selection:bg-slate-200 border border-slate-200 print:border-none print:shadow-none print:p-0">
      <div className="text-center pb-4 mb-4 border-b border-black">
        <h1 className="text-2xl font-bold uppercase tracking-wide">{p.name}</h1>
        <p className="text-sm font-semibold">{p.targetRole}</p>
        <p className="text-xs mt-1">
          {p.email} | {p.phone} | {p.location} {p.linkedin ? `| ${p.linkedin}` : ""}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">Executive Summary</h2>
        <p className="text-xs leading-relaxed text-justify">{p.executiveSummary}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-2">Work Experience</h2>
        {data.professionalExperience.map((exp, idx) => (
          <div key={idx} className="mb-3">
            <div className="flex justify-between text-xs font-bold">
              <span>{exp.position} — {exp.company}</span>
              <span>{exp.duration}</span>
            </div>
            <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
              {exp.bulletPoints.map((bp, bIdx) => (
                <li key={bIdx}>{bp}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">Education</h2>
        {data.education.map((edu, idx) => (
          <div key={idx} className="flex justify-between text-xs mb-1">
            <span><strong>{edu.degree}</strong>, {edu.institution}</span>
            <span>{edu.graduationYear}</span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">Skills & Keywords</h2>
        <p className="text-xs leading-relaxed">
          <strong>Key Competencies:</strong> {data.coreCompetencies.join(", ")} <br />
          <strong>Technical:</strong> {data.technicalSkills.join(", ")} <br />
          <strong>ATS Keywords:</strong> {data.atsKeywords.join(", ")}
        </p>
      </div>
    </div>
  );
}

// Master Renderers
export function ArabicResumeRenderer({ data, templateId = "saudi_formal" }: ArabicResumeViewProps) {
  if (templateId === "modern_arabic") return <ModernArabicTemplate data={data} />;
  if (templateId === "ats_arabic") return <AtsArabicMinimal data={data} />;
  return <SaudiFormalTemplate data={data} />;
}

export function EnglishCvRenderer({ data, templateId = "modern_executive" }: EnglishCvViewProps) {
  if (templateId === "classic_corporate") return <ClassicCorporateTemplate data={data} />;
  if (templateId === "ats_minimal") return <MinimalAtsTemplate data={data} />;
  return <ModernExecutiveTemplate data={data} />;
}
