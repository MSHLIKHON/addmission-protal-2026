/**
 * bengali.utils.js
 * Bengali digit conversion, Bangla date formatting, currency & localization helpers.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function toBengaliNumber(num) {
      if (state && state.lang === "en") return String(num);
      const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
      return String(num).replace(/\d/g, d => bnDigits[Number(d)]);
    }

    function t(bnText, enText) {
      return (state && state.lang === "en") ? enText : bnText;
    }

    function getUniDisplayName(u) {
      if (state && state.lang === "en" && UNI_NAMES_EN[u.id] && !u.customEdited) {
        return UNI_NAMES_EN[u.id];
      }
      return u.name;
    }

    function translateDateText(str) {
      if (!str) return "";
      if (!state || state.lang !== "en") return str;
      const map = {
        "জানুয়ারি": "Jan", "জানু": "Jan",
        "ফেব্রুয়ারি": "Feb", "ফেব্রু": "Feb",
        "মার্চ": "Mar", "এপ্রিল": "Apr", "মে": "May", "জুন": "Jun",
        "জুলাই": "Jul", "আগস্ট": "Aug", "সেপ্টেম্বর": "Sep", "অক্টোবর": "Oct",
        "নভেম্বর": "Nov", "নভে": "Nov",
        "ডিসেম্বর": "Dec", "ডিসে": "Dec",
        "সকাল": "Morning", "দুপুর": "Noon", "টা": ":00",
        "ক ইউনিট": "Unit A", "খ ইউনিট": "Unit B", "গ ইউনিট": "Unit C",
        "সম্ভাব্য": "Tentative", "কৃষি গুচ্ছ": "Agri Cluster", "জিএসটি গুচ্ছ": "GST Cluster",
        "নোটিশ শীঘ্রই": "Notice Soon", "অন্যান্য": "Others", "থেকে": "to"
      };
      let out = toEnglishDigits(str);
      Object.entries(map).forEach(([k, v]) => {
        out = out.split(k).join(v);
      });
      return out;
    }

    function toEnglishDigits(str) {
      const bnDigits = "০১২৩৪৫৬৭৮৯";
      return String(str || "").replace(/[০-৯]/g, d => String(bnDigits.indexOf(d)));
    }

    function formatCurrencyBn(num) {
      const formatted = Number(num || 0).toLocaleString("en-IN");
      return "৳ " + toBengaliNumber(formatted);
    }

    const BN_MONTH_NAMES = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

    function isoToBanglaDateText(iso) {
      if (!iso || iso === "9999-12-31" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
      const parts = iso.split("-").map(Number);
      const dayBn = toBengaliNumber(parts[2]);
      const monthName = BN_MONTH_NAMES[parts[1] - 1] || "";
      return `${dayBn} ${monthName}`;
    }

    function parseBanglaDateToIso(text, currentIso) {
      const clean = (text || "").trim();
      if (!clean || clean === "অপ্রকাশিত" || clean === "ফাঁকা") return "9999-12-31";
      const eng = toEnglishDigits(clean);
      if (/^\d{4}-\d{2}-\d{2}$/.test(eng)) return eng;

      const monthMap = [
        { keys: ["জানু", "jan"], m: 1, y: 2027 },
        { keys: ["ফেব্রু", "feb"], m: 2, y: 2027 },
        { keys: ["মার্চ", "mar"], m: 3, y: 2027 },
        { keys: ["এপ্রিল", "apr"], m: 4, y: 2027 },
        { keys: ["মে", "may"], m: 5, y: 2027 },
        { keys: ["জুন", "jun"], m: 6, y: 2027 },
        { keys: ["জুলাই", "jul"], m: 7, y: 2027 },
        { keys: ["আগস্ট", "aug"], m: 8, y: 2027 },
        { keys: ["সেপ্টে", "sep"], m: 9, y: 2026 },
        { keys: ["অক্টো", "oct"], m: 10, y: 2026 },
        { keys: ["নভে", "nov"], m: 11, y: 2026 },
        { keys: ["ডিসে", "dec"], m: 12, y: 2026 }
      ];
      const lower = eng.toLowerCase();
      for (const item of monthMap) {
        if (item.keys.some(k => lower.includes(k))) {
          const dayMatch = eng.match(/\b(\d{1,2})\b/);
          if (dayMatch) {
            const d = String(Math.min(31, Math.max(1, Number(dayMatch[1])))).padStart(2, "0");
            const m = String(item.m).padStart(2, "0");
            return `${item.y}-${m}-${d}`;
          }
        }
      }
      return currentIso && currentIso !== "9999-12-31" ? currentIso : "9999-12-31";
    }


  app.toBengaliNumber = window.toBengaliNumber = toBengaliNumber;
  app.t = window.t = t;
  app.getUniDisplayName = window.getUniDisplayName = getUniDisplayName;
  app.translateDateText = window.translateDateText = translateDateText;
  app.toEnglishDigits = window.toEnglishDigits = toEnglishDigits;
  app.formatCurrencyBn = window.formatCurrencyBn = formatCurrencyBn;
  app.isoToBanglaDateText = window.isoToBanglaDateText = isoToBanglaDateText;
  app.parseBanglaDateToIso = window.parseBanglaDateToIso = parseBanglaDateToIso;
})(window);
