import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { ClayBackground } from "@/components/ClayBackground";

export function TemplatesPage() {
  const templates = [
    {
      id: "saudi_formal",
      lang: "ar",
      title: "رسمي سعودي تفصيلي (Saudi Formal Executive)",
      category: "Arabic Resume",
      tagColor: "#E8C4C4",
      description: "صمم خصيصاً للشركات السعودية والخليجية الكبرى (أرامكو، STC، صندوق الاستثمارات العامة). يبرز النبذة التنفيذية بالتفصيل والمؤهلات الأكاديمية والشهادات المهنية المعتمدة.",
      highlights: ["ترويسة ملكية أنيقة باللون الرمادي الفاخر والوردي الهادئ", "صياغة إنجازات مرقمة بالأفعال القيادية", "تقسيم معتمد للشهادات والرخص المهنية"],
      bestFor: "المهندسون، المديرون التنفيذيون، ومحترفو إدارة المشاريع في الخليج",
    },
    {
      id: "modern_arabic",
      lang: "ar",
      title: "عصري أنيق (Modern Arabic Minimal)",
      category: "Arabic Resume",
      tagColor: "#B8D4D0",
      description: "تصميم حديث ذو خطوط نظيفة وهوامش متناسقة يمنح القارئ تجربة بصرية سلسة مع إبراز المهارات التقنية والتدرج الوظيفي.",
      highlights: ["شريط جانبي متوازن للمهارات واللغات", "خطوط عربية عصرية عالية الوضوح", "مظهر احترافي مبتكر"],
      bestFor: "المصممون، مطورو البرمجيات، ورواد الأعمال الجدد",
    },
    {
      id: "ats_arabic",
      lang: "ar",
      title: "ATS مباشر عالي التوافق (Arabic ATS Pure)",
      category: "Arabic Resume",
      tagColor: "#D6D2C8",
      description: "هيكل عمود واحد كلاسيكي يخلو من أي عناصر قد تعيق خوارزميات الفرز الآلي ATS، مع توزيع دقيق للكلمات المفتاحية المهنية.",
      highlights: ["توافق 100% مع أنظمة الفرز الإلكتروني", "نص متجهي قابل للتحديد والنسخ", "ترتيب هرمي قياسي"],
      bestFor: "التقديم المباشر عبر بوابات التوظيف الإلكترونية والشركات متعددة الجنسيات",
    },
    {
      id: "modern_executive",
      lang: "en",
      title: "Modern Executive ATS Standard",
      category: "English CV",
      tagColor: "#A8C5E0",
      description: "Single-column executive layout engineered to pass enterprise ATS parsers while commanding human recruiters' immediate attention.",
      highlights: ["XYZ Achievement Formula bullet points", "High keyword density matching job descriptions", "Clean typography with subtle neutral accents"],
      bestFor: "Senior Engineers, Solution Architects, Product Leaders",
    },
    {
      id: "classic_corporate",
      lang: "en",
      title: "Classic Corporate Standard",
      category: "English CV",
      tagColor: "#EDE7DE",
      description: "Timeless typographic hierarchy preferred by Fortune 500 financial institutions, consulting firms, and traditional corporations.",
      highlights: ["Standard section hierarchy", "Refined serif/sans typographic discipline", "Proven recruiter readability"],
      bestFor: "Finance, Management Consultants, Legal & Healthcare",
    },
    {
      id: "ats_minimal",
      lang: "en",
      title: "Minimal ATS 100% Parser Compliant",
      category: "English CV",
      tagColor: "#B8D4D0",
      description: "Pure machine-readable architecture with zero parsing obstructions. Guaranteed highest score across Workday, Taleo, Greenhouse, and Lever.",
      highlights: ["Zero table or column parsing hurdles", "Clear section headers matching ATS taxonomies", "Instant text extractability"],
      bestFor: "High-volume online enterprise job applications",
    },
  ];

  return (
    <div className="relative min-h-screen text-[#1A1A1A] py-12 px-4 sm:px-6 overflow-x-hidden bg-[#F9F5EF]">
      <ClayBackground />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE7DE] text-[#1A1A1A] text-xs font-bold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Curated Formats</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1A1A1A] mt-1 tracking-tight">
            Recruiter-Approved Templates
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-2">
            Every template is crafted to satisfy both human executive hiring managers and automated Applicant Tracking Systems (ATS).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl, idx) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <div className="clay-card p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[10px] font-bold px-3 py-1 rounded-full text-[#1A1A1A]"
                      style={{ backgroundColor: tpl.tagColor }}
                    >
                      {tpl.category}
                    </span>
                    <span className="text-xs font-mono text-[#6B6B6B] font-bold">Selectable Vector</span>
                  </div>

                  <h3 className="text-lg font-black text-[#1A1A1A] mb-2">{tpl.title}</h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4">{tpl.description}</p>

                  <div className="space-y-1.5 mb-4 text-xs text-[#6B6B6B]">
                    {tpl.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#1A1A1A] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EDE7DE]">
                  <p className="text-[11px] text-[#6B6B6B] mb-3">
                    <strong className="text-[#1A1A1A]">Best for:</strong> {tpl.bestFor}
                  </p>

                  <Link
                    href="/builder"
                    className="w-full py-2.5 px-4 rounded-2xl btn-clay-dark text-xs font-bold flex items-center justify-center gap-1.5 text-white shadow-xs block text-center cursor-pointer"
                  >
                    <span>Build with this template</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
