/**
 * parser.js
 * Smart notice text analyzer with regex pattern recognition for dates, deadlines & application fees.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function parseSmartCircularNotice(rawText) {
      const text = (rawText || "").trim();
      if (!text) return { ok: false, message: "অনুগ্রহ করে সার্কুলার বা নোটিশের টেক্সট পেস্ট করুন।" };
      const lower = text.toLowerCase();

      let matchedUni = null;
      for (const u of state.universities) {
        const tokens = `${u.name} ${u.keywords || ""}`.toLowerCase().split(/[\s,()/|-]+/).filter(t => t.length >= 2);
        for (const tk of tokens) {
          if (tk.length >= 3 && lower.includes(tk)) {
            matchedUni = u;
            break;
          }
        }
        if (matchedUni) break;
      }

      if (!matchedUni) {
        return { ok: false, message: "টেক্সট থেকে নির্দিষ্ট কোনো বিশ্ববিদ্যালয়ের নাম শনাক্ত করা যায়নি। বিশ্ববিদ্যালয়ের নামসহ পেস্ট করুন।" };
      }

      const bnMonthsPattern = "(?:জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-zA-Z]*";
      const rangeRegex = new RegExp(`([০-৯0-9]{1,2}\s*${bnMonthsPattern}\s*(?:থেকে|-|হতে|to)\s*[০-৯0-9]{1,2}\s*${bnMonthsPattern})`, "i");
      const singleDateRegex = new RegExp(`([০-৯0-9]{1,2}\s*${bnMonthsPattern})`, "gi");

      const rangeMatch = text.match(rangeRegex);
      let detectedDeadline = rangeMatch ? rangeMatch[1].trim() : "";

      const allSingleDates = [];
      let m;
      while ((m = singleDateRegex.exec(text)) !== null) {
        allSingleDates.push(m[1].trim());
      }

      let detectedExamDate = "";
      for (const d of allSingleDates) {
        if (!detectedDeadline || !detectedDeadline.includes(d)) {
          detectedExamDate = d;
          break;
        }
      }
      if (!detectedExamDate && allSingleDates.length > 0 && !detectedDeadline) {
        detectedExamDate = allSingleDates[0];
      }

      const feeRegex = /(?:ফি|টাকা|৳|TK|BDT)\s*[:=-]?\s*([০-৯0-9]{3,4})|([০-৯0-9]{3,4})\s*(?:টাকা|৳)/i;
      const feeMatch = text.match(feeRegex);
      const detectedFee = feeMatch ? (feeMatch[1] || feeMatch[2]) : "";

      if (detectedExamDate) {
        matchedUni.examDateText = detectedExamDate;
        matchedUni.isoExamDate = parseBanglaDateToIso(detectedExamDate, matchedUni.isoExamDate);
        matchedUni.examMonthGroup = (!matchedUni.isoExamDate || matchedUni.isoExamDate === "9999-12-31") ? "unpublished" : matchedUni.isoExamDate.slice(0, 7);
      }
      if (detectedDeadline) {
        matchedUni.deadlineText = detectedDeadline;
        matchedUni.hasDeadline = true;
      }
      if (detectedFee) {
        matchedUni.feeText = toBengaliNumber(toEnglishDigits(detectedFee));
        const numFee = Number(toEnglishDigits(detectedFee));
        if (numFee >= 100) {
          matchedUni.defaultFee = numFee;
          matchedUni.selectedFee = numFee;
        }
      }
      matchedUni.customEdited = true;
      saveUniversities();
      renderAll();

      return {
        ok: true,
        uni: matchedUni,
        examDate: detectedExamDate || matchedUni.examDateText || "অপরিবর্তিত",
        deadline: detectedDeadline || matchedUni.deadlineText || "অপরিবর্তিত",
        fee: detectedFee ? toBengaliNumber(toEnglishDigits(detectedFee)) : matchedUni.feeText
      };
    }


  app.parseSmartCircularNotice = window.parseSmartCircularNotice = parseSmartCircularNotice;
})(window);
