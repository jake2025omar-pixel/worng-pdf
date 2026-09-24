import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { UserSubscriptionStatus } from "@/types/cv";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
  Globe2,
  ChevronDown,
  Crown,
  Check,
  FileCheck,
  Layers,
  Award,
  Zap,
} from "lucide-react";
import { SubscriptionModal } from "@/components/SubscriptionModal";

interface LandingPageProps {
  status: UserSubscriptionStatus | null;
  onRefreshStatus?: () => void;
}

export function LandingPage({ status, onRefreshStatus }: LandingPageProps) {
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen text-[#1A1A1A] overflow-x-hidden bg-[#F9F5EF]">
      {/* ========================================================
          BACKGROUND BEHIND BOX - EXACTLY AS SPECIFIED IN BRIEF:
          - Page background #F9F5EF warm cream
          - 5 absolute positioned blobs behind the main white container with blur(40px)
          - Subtle grain texture
          ======================================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none bg-grain">
        {/* Blob 1: top-left 600x400px, #F5F0E8, border-radius 60% 40% 30% 70% / 60% 30% 70% 40% */}
        <div
          className="absolute -top-12 -left-16 w-[600px] h-[400px]"
          style={{
            backgroundColor: "#F5F0E8",
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            filter: "blur(40px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.02)",
          }}
        />

        {/* Blob 2: top-right 500x500px, #EDE7DE, border-radius 40% 60% 70% 30% */}
        <div
          className="absolute -top-10 -right-16 w-[500px] h-[500px]"
          style={{
            backgroundColor: "#EDE7DE",
            borderRadius: "40% 60% 70% 30% / 50% 50% 50% 50%",
            filter: "blur(40px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.02)",
          }}
        />

        {/* Blob 3: bottom-right 700x400px, #E8DCC8 peach soft at 60% opacity */}
        <div
          className="absolute top-[480px] -right-20 w-[700px] h-[400px]"
          style={{
            backgroundColor: "#E8DCC8",
            opacity: 0.6,
            borderRadius: "50% 50% 40% 60% / 40% 60% 50% 50%",
            filter: "blur(40px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.02)",
          }}
        />

        {/* Blob 4: bottom-left small 300x300px, #D6E8E5 mint at 40% opacity like in image */}
        <div
          className="absolute top-[520px] -left-12 w-[300px] h-[300px]"
          style={{
            backgroundColor: "#D6E8E5",
            opacity: 0.4,
            borderRadius: "55% 45% 40% 60% / 50% 60% 40% 50%",
            filter: "blur(40px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.02)",
          }}
        />

        {/* Blob 5: bottom-center 400x400px glass transparent blob like in image */}
        <div
          className="absolute top-[680px] left-1/2 -translate-x-1/2 w-[400px] h-[400px]"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.55)",
            backdropFilter: "blur(24px)",
            borderRadius: "60% 40% 50% 50% / 50% 50% 40% 60%",
            filter: "blur(40px)",
            boxShadow: "0 20px 60px rgba(255, 255, 255, 0.6)",
          }}
        />
      </div>

      {/* Main Section */}
      <section className="relative pt-8 sm:pt-12 pb-20 px-4 sm:px-6 z-10">
        <div className="max-w-6xl mx-auto">
          {/* ========================================================
              MAIN BOX (Exactly as specified in user brief):
              - White container #FFFFFF, border-radius 40px, centered max 900px, padding 24px
              - Box-shadow: 0 20px 60px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04)
              - Inside layout exactly like Product Design Slider-Block: 
                left large text, right 3 soft squircle pastel blocks, bottom rows
              ======================================================== */}
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="clay-main-box mx-auto w-full mb-16"
          >
            {/* Top Product Design Slider-Block Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Large Text (7 columns) */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full pt-1">
                <div>
                  {/* Subtle Clay Kicker Pill */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE7DE] text-[#1A1A1A] text-xs font-bold mb-4 shadow-sm">
                    <div className="w-4 h-4 rounded-full bg-[#FFFFFF] flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-[#1A1A1A]" />
                    </div>
                    <span>10-Year Recruitment Expert AI Engine</span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tight leading-[1.12] mb-4 text-balance">
                    Build Your Professional CV & Arabic Resume with AI in{" "}
                    <span className="underline decoration-[#E8C4C4] decoration-wavy decoration-2 underline-offset-4">
                      60 Seconds
                    </span>
                  </h1>

                  {/* Body Paragraph */}
                  <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed mb-6 font-medium">
                    ATS-Optimized, Recruiter-Approved, 10-Year Expert Level. We synthesize your career milestones into a formal detailed{" "}
                    <strong className="text-[#1A1A1A] font-bold">Arabic Resume</strong> for Saudi & Gulf markets and an executive{" "}
                    <strong className="text-[#1A1A1A] font-bold">English CV</strong> that passes automated applicant tracking filters.
                  </p>
                </div>

                {/* Action Buttons & Quick Assurance */}
                <div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-5">
                    <Link
                      href="/builder"
                      className="px-6 py-3.5 rounded-2xl btn-clay-dark text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-white cursor-pointer"
                    >
                      <span>Create My Free CV Now</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setIsSubModalOpen(true)}
                      className="px-5 py-3.5 rounded-2xl btn-clay-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-[#1A1A1A] cursor-pointer"
                    >
                      <Crown className="w-4 h-4 text-[#1A1A1A]" />
                      <span>Unlimited Pass ($2.67/mo)</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-[#6B6B6B] font-semibold flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A1A]" /> 1st Generation 100% Free
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A1A]" /> Zero Sign-In Required
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A1A]" /> Vector PDF Download & Print
                    </span>
                  </div>
                </div>
              </div>

              {/* Right 3 Soft Squircle Pastel Blocks (5 columns) */}
              {/* Inflated clay 3D squircle border-radius 36px with inner shadow */}
              <div className="lg:col-span-5 flex flex-col gap-3.5">
                {/* Block 1: Muted Rose #E8C4C4 */}
                <div className="p-4 sm:p-5 rounded-[36px] clay-squircle clay-squircle-rose">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]">
                      01 · Gulf Standard
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFFFFF]/80 text-[#1A1A1A] shadow-xs">
                      رسمي سعودي
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-[#1A1A1A] mb-1">
                    Arabic Executive Resume Engine
                  </h3>
                  <p className="text-[11px] text-[#1A1A1A]/85 leading-relaxed font-medium">
                    صياغة قيادية تفصيلية متوافقة مع متطلبات التوظيف ومعايير الفرز الآلي في السعودية والخليج العربي.
                  </p>
                </div>

                {/* Block 2: Muted Blue #A8C5E0 */}
                <div className="p-4 sm:p-5 rounded-[36px] clay-squircle clay-squircle-blue">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]">
                      02 · Global Standard
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFFFFF]/80 text-[#1A1A1A] shadow-xs">
                      ATS 98/100
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-[#1A1A1A] mb-1">
                    English ATS-Proof CV Engine
                  </h3>
                  <p className="text-[11px] text-[#1A1A1A]/85 leading-relaxed font-medium">
                    Google XYZ impact formula, Fortune 500 keyword density, single-column Workday & Taleo compliant.
                  </p>
                </div>

                {/* Block 3: Mint #B8D4D0 */}
                <div className="p-4 sm:p-5 rounded-[36px] clay-squircle clay-squircle-mint">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]">
                      03 · Instant Export
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFFFFF]/80 text-[#1A1A1A] shadow-xs">
                      PDF & Scanner
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-[#1A1A1A] mb-1">
                    Dual Vector Export & Old CV Parser
                  </h3>
                  <p className="text-[11px] text-[#1A1A1A]/85 leading-relaxed font-medium">
                    Selectable vector PDF export, one-click printer output, plus OCR re-structuring for existing CVs.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Rows (Inside Main Box): Slider / Metric Blocks */}
            <div className="border-t border-[#EDE7DE] pt-5 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-[24px] bg-[#F9F5EF] border border-[#EDE7DE] text-center">
                <p className="text-lg sm:text-xl font-black text-[#1A1A1A]">98%</p>
                <p className="text-[10px] font-semibold text-[#6B6B6B] mt-0.5">ATS Pass Rate</p>
              </div>

              <div className="p-3.5 rounded-[24px] bg-[#F9F5EF] border border-[#EDE7DE] text-center">
                <p className="text-lg sm:text-xl font-black text-[#1A1A1A]">60s</p>
                <p className="text-[10px] font-semibold text-[#6B6B6B] mt-0.5">Generation Speed</p>
              </div>

              <div className="p-3.5 rounded-[24px] bg-[#F9F5EF] border border-[#EDE7DE] text-center">
                <p className="text-lg sm:text-xl font-black text-[#1A1A1A]">6 Styles</p>
                <p className="text-[10px] font-semibold text-[#6B6B6B] mt-0.5">Executive Templates</p>
              </div>

              <div className="p-3.5 rounded-[24px] bg-[#F9F5EF] border border-[#EDE7DE] text-center">
                <p className="text-lg sm:text-xl font-black text-[#1A1A1A]">$2.67</p>
                <p className="text-[10px] font-semibold text-[#6B6B6B] mt-0.5">Yemen/Global Pass</p>
              </div>
            </div>
          </motion.div>

          {/* Dual Engine Live Demonstration Showcase (Clay Card) */}
          <div className="clay-card p-6 sm:p-10 mb-16 border border-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <div className="w-11 h-11 rounded-2xl clay-icon-circle bg-[#EDE7DE] flex items-center justify-center text-[#1A1A1A] mb-4">
                  <Globe2 className="w-5 h-5 text-[#1A1A1A]" />
                </div>
                <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                  Dual Cultural Output
                </span>
                <h2 className="text-2xl font-black text-[#1A1A1A]">
                  Simultaneous Arabic Resume + English ATS CV
                </h2>
                <p className="text-xs text-[#6B6B6B] mt-2.5 leading-relaxed">
                  Unlike conventional translators that produce literal, unidiomatic text, our engine creates two distinct documents tailored for their target markets:
                </p>

                <div className="mt-4 space-y-2.5">
                  <div className="p-3 rounded-2xl bg-[#F9F5EF] border border-[#EDE7DE]">
                    <p className="font-bold text-xs text-[#1A1A1A] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#1A1A1A]" /> Saudi & Gulf Formal Resume
                    </p>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5">
                      Rich executive narrative, verified certifications, STC & Aramco enterprise phrasing.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F9F5EF] border border-[#EDE7DE]">
                    <p className="font-bold text-xs text-[#1A1A1A] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#1A1A1A]" /> Global ATS-Compliant English CV
                    </p>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5">
                      Standard layout, XYZ action-verb formulas, 98% keyword density to pass Taleo & Workday.
                    </p>
                  </div>
                </div>

                <Link
                  href="/builder"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-2xl btn-clay-dark text-xs font-bold text-white cursor-pointer"
                >
                  <span>Launch Dual Builder</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>

              {/* Right Side: Dual Preview Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Arabic Card */}
                <div
                  dir="rtl"
                  className="p-5 rounded-[28px] bg-[#F9F5EF] border border-[#EDE7DE] shadow-sm text-right"
                >
                  <div className="border-b border-[#D6D2C8] pb-2 mb-2">
                    <p className="font-bold text-xs text-[#1A1A1A]">عبدالله بن محمد القحطاني</p>
                    <p className="text-[10px] text-[#6B6B6B] font-bold">مهندس نظم سحابية وحلول تقنية أول</p>
                  </div>
                  <p className="text-[10px] text-[#6B6B6B] leading-relaxed mb-3">
                    خبير تنفيذي معتمد قاد تحول البنى التحتية السحابية وخفض التكاليف التشغيلية بنسبة 35% مع الالتزام الصارم بضوابط الهيئة الوطنية للأمن السيبراني...
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-[#E8C4C4] text-[#1A1A1A] text-[9px] font-bold px-2 py-0.5 rounded-lg">
                      قيادة تقنية
                    </span>
                    <span className="bg-[#FFFFFF] text-[#6B6B6B] text-[9px] font-bold px-2 py-0.5 rounded-lg border border-[#EDE7DE]">
                      Cloud Architecture
                    </span>
                  </div>
                </div>

                {/* English Card */}
                <div
                  dir="ltr"
                  className="p-5 rounded-[28px] bg-[#F9F5EF] border border-[#EDE7DE] shadow-sm text-left"
                >
                  <div className="border-b border-[#D6D2C8] pb-2 mb-2">
                    <p className="font-bold text-xs text-[#1A1A1A]">Abdullah M. Al-Qahtani</p>
                    <p className="text-[10px] text-[#6B6B6B] font-bold">Lead Cloud Solutions Engineer</p>
                  </div>
                  <p className="text-[10px] text-[#6B6B6B] leading-relaxed mb-3">
                    Spearheaded multi-region cloud migration, reducing deployment downtime by 42% and safeguarding $1.2M in annual enterprise infrastructure spending...
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-[#A8C5E0] text-[#1A1A1A] text-[9px] font-bold px-2 py-0.5 rounded-lg">
                      98% ATS Score
                    </span>
                    <span className="bg-[#FFFFFF] text-[#6B6B6B] text-[9px] font-bold px-2 py-0.5 rounded-lg border border-[#EDE7DE]">
                      XYZ Formula
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Core Architecture Cards */}
          <div className="mb-16">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">
                Precision Intelligence
              </span>
              <h2 className="text-2xl font-black text-[#1A1A1A] mt-1">
                Engineered for High-Stakes Careers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Feature 1 */}
              <div className="clay-card p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl clay-icon-circle bg-[#E8C4C4] flex items-center justify-center text-[#1A1A1A] mb-4">
                    <Sparkles className="w-5 h-5 text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-base font-black text-[#1A1A1A]">10-Year Recruiter Brain</h3>
                  <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                    Trained on evaluation criteria from top Gulf sovereign funds and Fortune 500 firms. Eliminates passive phrases and injects quantified metrics.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#EDE7DE] flex items-center justify-between text-xs">
                  <span className="text-[#6B6B6B]">ATS Compliance:</span>
                  <span className="font-bold text-[#1A1A1A]">98 / 100</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="clay-card p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl clay-icon-circle bg-[#A8C5E0] flex items-center justify-center text-[#1A1A1A] mb-4">
                    <UploadCloud className="w-5 h-5 text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-base font-black text-[#1A1A1A]">Old CV Scanner (PDF & Photos)</h3>
                  <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                    Have an old resume? Drop your PDF or snapshot photo (JPG/PNG). The engine automatically extracts and enhances your career history.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#EDE7DE] flex items-center justify-between text-xs">
                  <span className="text-[#6B6B6B]">Formats:</span>
                  <span className="font-bold text-[#1A1A1A]">PDF, JPG, PNG (20MB)</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="clay-card p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl clay-icon-circle bg-[#B8D4D0] flex items-center justify-center text-[#1A1A1A] mb-4">
                    <ShieldCheck className="w-5 h-5 text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-base font-black text-[#1A1A1A]">Yemen & Global Friendly</h3>
                  <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                    Zero geoblocking. Pay directly via Payoneer checkout (card or bank transfer) or send $2.67 USDT via OKX TRC20 with automatic confirmation.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#EDE7DE] flex items-center justify-between text-xs">
                  <span className="text-[#6B6B6B]">Methods:</span>
                  <span className="font-bold text-[#1A1A1A]">Payoneer · OKX TRC20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple 3 Steps */}
          <div className="mb-16">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">
                Simple & Fast
              </span>
              <h2 className="text-2xl font-black text-[#1A1A1A] mt-1">How WORNG PDF Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  num: "01",
                  title: "Input or Drop Old File",
                  desc: "Fill in your job title and skills, or upload your existing PDF or photo for instant parsing.",
                  badgeBg: "#EDE7DE",
                },
                {
                  num: "02",
                  title: "10-Year AI Synthesis",
                  desc: "Our engine formulates both a formal Arabic Resume and an ATS-winning English CV in under 60 seconds.",
                  badgeBg: "#E8C4C4",
                },
                {
                  num: "03",
                  title: "Vector Download & Print",
                  desc: "Preview your documents in high-resolution, print directly, or export clean vector PDFs with selectable text.",
                  badgeBg: "#A8C5E0",
                },
              ].map((step, idx) => (
                <div key={idx} className="clay-card p-6">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-[#1A1A1A] mb-3 shadow-xs"
                    style={{ backgroundColor: step.badgeBg }}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-sm font-black text-[#1A1A1A] mb-1.5">{step.title}</h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mb-16">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">
                Transparent Pricing
              </span>
              <h2 className="text-2xl font-black text-[#1A1A1A] mt-1">First Time Free · $2.67 Unlimited</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Free Pass */}
              <div className="clay-card p-6 sm:p-8 flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EDE7DE] text-[#1A1A1A]">
                    Welcome Pass
                  </span>
                  <h3 className="text-xl font-black text-[#1A1A1A] mt-3">First Time Free</h3>
                  <p className="text-xs text-[#6B6B6B] mt-1">Try the full recruitment engine with zero commitment.</p>

                  <div className="my-5">
                    <span className="text-3xl font-black text-[#1A1A1A]">$0</span>
                    <span className="text-xs text-[#6B6B6B] ml-2">/ first generation</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#6B6B6B] font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                      <span>1 Complete Dual Generation (Arabic + English)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                      <span>Upload & Parse Old CV (PDF/Image)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                      <span>Selectable Vector PDF Export & Print</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/builder"
                  className="mt-6 w-full py-3.5 px-4 rounded-2xl btn-clay-white text-xs text-center font-bold block cursor-pointer"
                >
                  Start Free Generation
                </Link>
              </div>

              {/* Pro Unlimited */}
              <div className="clay-card p-6 sm:p-8 flex flex-col justify-between h-full border-2 border-[#1A1A1A]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8C4C4] text-[#1A1A1A]">
                      Pro Unlimited
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-white">
                      POPULAR
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#1A1A1A] mt-3">Monthly Unlimited Pass</h3>
                  <p className="text-xs text-[#6B6B6B] mt-1">For active job seekers, consultants, and recruiters.</p>

                  <div className="my-5">
                    <span className="text-3xl font-black text-[#1A1A1A]">$2.67</span>
                    <span className="text-xs text-[#6B6B6B] font-bold ml-2">/ month</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#1A1A1A] font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                      <span>Unlimited CV & Resume Generations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                      <span>All 6 Saudi Formal & Global ATS Templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                      <span>Advanced ATS Keyword Tailoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                      <span>Payoneer Direct + OKX USDT TRC20 Verification</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(true)}
                  className="mt-6 w-full py-3.5 px-4 rounded-2xl btn-clay-dark text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-white" />
                  <span>Subscribe Now ($2.67/mo)</span>
                </button>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-[#1A1A1A]">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  q: "Do I need to create an account or sign in with Google?",
                  a: "No! WORNG PDF requires zero account creation and no Google sign-in. We use a private browser fingerprint so you can create your free CV immediately without disclosing personal logins.",
                },
                {
                  q: "What makes the Arabic Resume different from the English CV?",
                  a: "The Arabic Resume follows Saudi and Gulf corporate norms—comprehensive, formal phrasing with detailed certifications and leadership verbs. The English CV adheres strictly to international ATS standards: single-column format, XYZ action-verb formulas, and high keyword density.",
                },
                {
                  q: "Can I upload my existing CV as a PDF or image?",
                  a: "Yes! Our parser accepts both PDF files and image snapshots (JPG/PNG) up to 20MB. The engine extracts your work milestones and upgrades your phrasing using 10-year recruiter intelligence.",
                },
                {
                  q: "How do payments work in Yemen and internationally?",
                  a: "We do not use Gumroad because it is restricted in Yemen. Instead, we provide direct Payoneer payment (debit/credit cards or transfer) and OKX USDT TRC20 crypto deposits with instant activation.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="clay-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#1A1A1A] hover:text-[#6B6B6B] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#6B6B6B] transition-transform ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 pt-0 text-xs text-[#6B6B6B] border-t border-[#EDE7DE] mt-1 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#EDE7DE] bg-[#FFFFFF]/60 text-xs text-[#6B6B6B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#1A1A1A]">WORNG PDF</span>
            <span>·</span>
            <span>Soft Minimal Claymorphism AI Architecture</span>
          </div>
          <p>© {new Date().getFullYear()} WORNG PDF. Professional ATS Engine. All rights reserved.</p>
        </div>
      </footer>

      {/* Subscription Modal */}
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
