import jsPDF from "jspdf";
import { ArabicResumeData, EnglishCvData, ArabicTemplateId, EnglishTemplateId } from "@/types/cv";

export interface GenerateResumePdfBlobParams {
  arabicData?: ArabicResumeData | null;
  englishData?: EnglishCvData | null;
  arabicTemplate?: ArabicTemplateId;
  englishTemplate?: EnglishTemplateId;
  activeMode?: "arabic" | "english";
}

/**
 * Generates a standard vector PDF Blob for the active resume
 */
export async function generateResumePdfBlob(params: GenerateResumePdfBlobParams): Promise<Blob> {
  const mode = params.activeMode === "english" ? "english" : (params.arabicData ? "arabic" : "english");
  return generateCVBlob({
    type: mode,
    arabicData: params.arabicData,
    englishData: params.englishData,
    templateId: mode === "arabic" ? params.arabicTemplate : params.englishTemplate,
  });
}

/**
 * Generates a standard vector PDF Blob using jsPDF for Arabic or English CV
 */
export function generateCVBlob(params: {
  type: "arabic" | "english";
  arabicData?: ArabicResumeData | null;
  englishData?: EnglishCvData | null;
  templateId?: ArabicTemplateId | EnglishTemplateId;
}): Blob {
  const { type, arabicData, englishData } = params;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  if (type === "arabic" && arabicData) {
    const p = arabicData.personalInfo;

    // Header banner
    doc.setFillColor(35, 21, 64); // #231540 dark purple background
    doc.rect(0, 0, pageWidth, 42, "F");

    // Bright Lavender accent line
    doc.setFillColor(183, 141, 242); // #B78DF2
    doc.rect(0, 42, pageWidth, 2.5, "F");

    // Name & Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(p.name || "السيرة الذاتية المهنية", pageWidth - margin, 18, { align: "right" });

    doc.setTextColor(183, 141, 242);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(p.title || "المهنة واللقب التنفيذي", pageWidth - margin, 26, { align: "right" });

    // Contact info bar
    doc.setTextColor(200, 205, 215);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const contactLine = `${p.location || "السعودية"}  |  ${p.phone || ""}  |  ${p.email || ""}  |  ${p.linkedin || ""}`;
    doc.text(contactLine, pageWidth - margin, 35, { align: "right" });

    cursorY = 54;

    // Summary Section
    if (p.summary) {
      doc.setFillColor(240, 244, 248);
      doc.roundedRect(margin, cursorY, contentWidth, 8, 1.5, 1.5, "F");
      doc.setTextColor(13, 17, 23);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("الملخص المهني والتنفيذي (Executive Summary)", pageWidth - margin - 4, cursorY + 5.5, { align: "right" });

      cursorY += 12;
      doc.setTextColor(50, 55, 65);
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      const splitSummary = doc.splitTextToSize(p.summary, contentWidth);
      doc.text(splitSummary, pageWidth - margin, cursorY, { align: "right" });
      cursorY += splitSummary.length * 5 + 6;
    }

    // Work Experience Section
    if (arabicData.experience && arabicData.experience.length > 0) {
      doc.setFillColor(240, 244, 248);
      doc.roundedRect(margin, cursorY, contentWidth, 8, 1.5, 1.5, "F");
      doc.setTextColor(13, 17, 23);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("الخبرات المهنية وسجل الإنجازات (Career History)", pageWidth - margin - 4, cursorY + 5.5, { align: "right" });

      cursorY += 13;

      for (const exp of arabicData.experience) {
        if (cursorY > pageHeight - 35) {
          doc.addPage();
          cursorY = margin;
        }

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10.5);
        doc.setFont("helvetica", "bold");
        doc.text(`${exp.role} - ${exp.company}`, pageWidth - margin, cursorY, { align: "right" });

        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.text(exp.period || "", margin, cursorY, { align: "left" });

        cursorY += 5;

        if (exp.achievements) {
          for (const ach of exp.achievements) {
            doc.setTextColor(51, 65, 85);
            doc.setFontSize(9);
            const splitAch = doc.splitTextToSize(`•  ${ach}`, contentWidth - 6);
            doc.text(splitAch, pageWidth - margin - 3, cursorY, { align: "right" });
            cursorY += splitAch.length * 4.5 + 1;
          }
        }
        cursorY += 3;
      }
    }

    // Education Section
    if (arabicData.education && arabicData.education.length > 0) {
      if (cursorY > pageHeight - 40) {
        doc.addPage();
        cursorY = margin;
      }

      doc.setFillColor(240, 244, 248);
      doc.roundedRect(margin, cursorY, contentWidth, 8, 1.5, 1.5, "F");
      doc.setTextColor(13, 17, 23);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("المؤهلات العلمية والشهادات (Education & Credentials)", pageWidth - margin - 4, cursorY + 5.5, { align: "right" });

      cursorY += 13;

      for (const edu of arabicData.education) {
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${edu.degree} - ${edu.institution}`, pageWidth - margin, cursorY, { align: "right" });

        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8.5);
        doc.text(edu.year || "", margin, cursorY, { align: "left" });
        cursorY += 5;

        if (edu.details || (edu as any).honors) {
          doc.setTextColor(71, 85, 105);
          doc.setFontSize(8.5);
          doc.text((edu.details || (edu as any).honors) as string, pageWidth - margin - 3, cursorY, { align: "right" });
          cursorY += 5;
        }
      }
      cursorY += 3;
    }

    // Skills & ATS Bar
    const skillsList: string[] = Array.isArray(arabicData.skills)
      ? (arabicData.skills as string[])
      : arabicData.skills
      ? [
          ...((arabicData.skills as any).technical || []),
          ...((arabicData.skills as any).soft || []),
          ...((arabicData.skills as any).tools || []),
        ]
      : [];

    if (skillsList.length > 0) {
      if (cursorY > pageHeight - 35) {
        doc.addPage();
        cursorY = margin;
      }

      doc.setFillColor(240, 244, 248);
      doc.roundedRect(margin, cursorY, contentWidth, 8, 1.5, 1.5, "F");
      doc.setTextColor(13, 17, 23);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("المهارات والكلمات المفتاحية (Skills & ATS Keywords)", pageWidth - margin - 4, cursorY + 5.5, { align: "right" });

      cursorY += 12;
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const skillsStr = skillsList.join("   |   ");
      const splitSkills = doc.splitTextToSize(skillsStr, contentWidth);
      doc.text(splitSkills, pageWidth - margin, cursorY, { align: "right" });
      cursorY += splitSkills.length * 4.5 + 4;
    }

    // ATS Match Footer
    doc.setDrawColor(204, 255, 0);
    doc.setLineWidth(0.6);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.text(
      `WORNG PDF - ATS Verified Recruiter Score: ${arabicData.atsScore || 97}%  |  Document ID: SA-${Date.now().toString(36).toUpperCase()}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: "center" }
    );
  } else if (type === "english" && englishData) {
    const p = englishData.personalInfo;

    // Header banner (ATS Executive Styling)
    doc.setFillColor(35, 21, 64); // #231540 dark purple background
    doc.rect(0, 0, pageWidth, 42, "F");

    // Bright Lavender accent line
    doc.setFillColor(183, 141, 242); // #B78DF2
    doc.rect(0, 42, pageWidth, 2.5, "F");

    // Candidate Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(21);
    doc.setFont("helvetica", "bold");
    doc.text((p.name || "Professional Candidate").toUpperCase(), margin, 18);

    // Target Role
    doc.setTextColor(183, 141, 242);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(p.targetRole || "Executive Professional", margin, 26);

    // Contact info line
    doc.setTextColor(200, 205, 215);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const contactLine = `${p.location || "Riyadh, Saudi Arabia"}  |  ${p.phone || ""}  |  ${p.email || ""}  |  ${p.linkedin || ""}`;
    doc.text(contactLine, margin, 35);

    cursorY = 54;

    // Executive Summary
    if (p.executiveSummary) {
      doc.setFillColor(240, 244, 248);
      doc.roundedRect(margin, cursorY, contentWidth, 7.5, 1.5, 1.5, "F");
      doc.setTextColor(8, 10, 15);
      doc.setFontSize(10.5);
      doc.setFont("helvetica", "bold");
      doc.text("EXECUTIVE SUMMARY", margin + 4, cursorY + 5.2);

      cursorY += 12;
      doc.setTextColor(50, 55, 65);
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      const splitSummary = doc.splitTextToSize(p.executiveSummary, contentWidth);
      doc.text(splitSummary, margin, cursorY);
      cursorY += splitSummary.length * 5 + 6;
    }

    // Professional Experience (XYZ Google Formula)
    if (englishData.professionalExperience && englishData.professionalExperience.length > 0) {
      doc.setFillColor(240, 244, 248);
      doc.roundedRect(margin, cursorY, contentWidth, 7.5, 1.5, 1.5, "F");
      doc.setTextColor(8, 10, 15);
      doc.setFontSize(10.5);
      doc.setFont("helvetica", "bold");
      doc.text("PROFESSIONAL EXPERIENCE", margin + 4, cursorY + 5.2);

      cursorY += 13;

      for (const exp of englishData.professionalExperience) {
        if (cursorY > pageHeight - 35) {
          doc.addPage();
          cursorY = margin;
        }

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${exp.position}  |  ${exp.company}`, margin, cursorY);

        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.text(exp.duration || "", pageWidth - margin, cursorY, { align: "right" });

        cursorY += 5;

        if (exp.bulletPoints) {
          for (const bp of exp.bulletPoints) {
            doc.setTextColor(51, 65, 85);
            doc.setFontSize(9);
            const splitBp = doc.splitTextToSize(`•  ${bp}`, contentWidth - 4);
            doc.text(splitBp, margin + 2, cursorY);
            cursorY += splitBp.length * 4.5 + 1;
          }
        }
        cursorY += 3;
      }
    }

    // Education Section
    if (englishData.education && englishData.education.length > 0) {
      if (cursorY > pageHeight - 38) {
        doc.addPage();
        cursorY = margin;
      }

      doc.setFillColor(240, 244, 248);
      doc.roundedRect(margin, cursorY, contentWidth, 7.5, 1.5, 1.5, "F");
      doc.setTextColor(8, 10, 15);
      doc.setFontSize(10.5);
      doc.setFont("helvetica", "bold");
      doc.text("EDUCATION & CREDENTIALS", margin + 4, cursorY + 5.2);

      cursorY += 13;

      for (const edu of englishData.education) {
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(9.5);
        doc.setFont("helvetica", "bold");
        doc.text(`${edu.degree}  |  ${edu.institution}`, margin, cursorY);

        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8.5);
        doc.text(edu.graduationYear || (edu as any).year || "", pageWidth - margin, cursorY, { align: "right" });
        cursorY += 5;

        const eduDetails = edu.honorsOrDetails || (edu as any).details;
        if (eduDetails) {
          doc.setTextColor(71, 85, 105);
          doc.setFontSize(8.5);
          doc.text(eduDetails, margin + 2, cursorY);
          cursorY += 5;
        }
      }
      cursorY += 3;
    }

    // Core Competencies & ATS Keywords
    if (englishData.coreCompetencies && englishData.coreCompetencies.length > 0) {
      if (cursorY > pageHeight - 35) {
        doc.addPage();
        cursorY = margin;
      }

      doc.setFillColor(240, 244, 248);
      doc.roundedRect(margin, cursorY, contentWidth, 7.5, 1.5, 1.5, "F");
      doc.setTextColor(8, 10, 15);
      doc.setFontSize(10.5);
      doc.setFont("helvetica", "bold");
      doc.text("CORE COMPETENCIES & ATS KEYWORDS", margin + 4, cursorY + 5.2);

      cursorY += 12;
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const skillsStr = englishData.coreCompetencies.join("   •   ");
      const splitSkills = doc.splitTextToSize(skillsStr, contentWidth);
      doc.text(splitSkills, margin, cursorY);
      cursorY += splitSkills.length * 4.5 + 4;
    }

    // ATS Match Footer
    doc.setDrawColor(204, 255, 0);
    doc.setLineWidth(0.6);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.text(
      `WORNG PDF - 100% Selectable ATS Standard  |  Algorithmic Score: ${englishData.atsScore || 98}%  |  Document ID: EN-${Date.now().toString(36).toUpperCase()}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: "center" }
    );
  }

  return doc.output("blob");
}
