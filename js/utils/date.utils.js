/**
 * date.utils.js
 * Exam date status checks, days remaining countdown & dynamic exam clash detector
 * with city travel-time warnings and smart suggestions.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  const UNI_CITY_MAP = {
    1: "ঢাকা", 2: "সাভার", 3: "ঢাকা", 4: "রাজশাহী", 5: "চট্টগ্রাম",
    6: "খুলনা", 7: "কুমিল্লা", 8: "ঢাকা", 9: "সারা দেশ", 10: "ঢাকা",
    11: "ঢাকা", 12: "রাজশাহী", 13: "খুলনা", 14: "চট্টগ্রাম", 15: "বিভিন্ন কেন্দ্র",
    16: "বিভিন্ন কেন্দ্র", 17: "সিলেট", 18: "দিনাজপুর", 19: "ঢাকা", 20: "গাজীপুর",
    21: "ঢাকা", 22: "ঢাকা", 23: "ঢাকা", 24: "লালমনিরহাট", 25: "বিভিন্ন কেন্দ্র",
    26: "বিভিন্ন কেন্দ্র", 27: "ঢাকা", 28: "সাভার", 29: "সারা দেশ", 30: "ময়মনসিংহ",
    31: "ঢাকা", 32: "গাজীপুর", 33: "পটুয়াখালী", 34: "কুষ্টিয়া", 35: "টাঙ্গাইল",
    36: "নোয়াখালী", 37: "যশোর", 38: "পাবনা", 39: "রংপুর", 40: "বরিশাল",
    41: "ময়মনসিংহ", 42: "গোপালগঞ্জ"
  };

  function getUniCity(uni) {
    if (!uni) return "বাংলাদেশ";
    return UNI_CITY_MAP[uni.id] || "বাংলাদেশ";
  }

  function isExamAnnounced(u) {
    if (!u.examDateText) return false;
    const txt = u.examDateText.trim();
    if (txt === "" || txt === "—" || txt === "-" || txt.includes("অপ্রকাশিত") || txt.includes("ফাঁকা")) return false;
    return true;
  }

  function isDeadlineAnnounced(u) {
    if (!u.deadlineText) return false;
    const txt = u.deadlineText.trim();
    if (txt === "" || txt === "—" || txt === "-" || txt.includes("অপ্রকাশিত") || txt.includes("ফাঁকা")) return false;
    return true;
  }

  function hasSavedCredentials(u) {
    return Boolean((u.userId && u.userId.trim() !== "") || (u.userPass && u.userPass.trim() !== "") || (u.examRoll && u.examRoll.trim() !== "") || (u.note && u.note.trim() !== ""));
  }

  function getReferenceToday() {
    return new Date();
  }

  function getDaysRemainingInfo(isoDateStr) {
    if (!isoDateStr || isoDateStr === "9999-12-31") {
      return { diffDays: null, label: "তারিখ অপ্রকাশিত", badgeClass: "bg-slate-100 text-slate-500 border-slate-200" };
    }
    const parts = isoDateStr.split("-").map(Number);
    const target = new Date(parts[0], parts[1] - 1, parts[2]);
    const ref = getReferenceToday();
    const today = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
    const diffMs = target - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { diffDays, label: "পরীক্ষা সম্পন্ন", badgeClass: "bg-slate-200 text-slate-600 border-slate-300" };
    }
    if (diffDays === 0) {
      return { diffDays, label: "🚨 আজই পরীক্ষা!", badgeClass: "bg-rose-600 text-white border-rose-600 animate-pulse font-bold" };
    }
    if (diffDays <= 7) {
      return { diffDays, label: `বাকি মাত্র ${toBengaliNumber(diffDays)} দিন`, badgeClass: "bg-rose-100 text-rose-700 border-rose-300 font-bold" };
    }
    if (diffDays <= 30) {
      return { diffDays, label: `বাকি ${toBengaliNumber(diffDays)} দিন`, badgeClass: "bg-amber-100 text-amber-800 border-amber-300 font-semibold" };
    }
    return { diffDays, label: `বাকি ${toBengaliNumber(diffDays)} দিন`, badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }

  function computeDynamicClashes(onlyTargets) {
    const isEn = Boolean(app.state && app.state.lang === "en");
    const dated = state.universities.filter(u => {
      if (onlyTargets && !u.target) return false;
      return isExamAnnounced(u) && u.isoExamDate && u.isoExamDate !== "9999-12-31";
    }).sort((a, b) => a.isoExamDate.localeCompare(b.isoExamDate));

    const alerts = [];
    const byDate = {};
    dated.forEach(u => {
      if (!byDate[u.isoExamDate]) byDate[u.isoExamDate] = [];
      byDate[u.isoExamDate].push(u);
    });

    // 1. Same-Day Clashes
    Object.entries(byDate).forEach(([iso, list]) => {
      if (list.length > 1) {
        const dateTxt = isoToBanglaDateText(iso);
        const uniNames = list.map(x => getUniDisplayName(x)).join(" • ");
        alerts.push({
          type: "same_day",
          badge: isEn ? `Same-Day Clash (${iso})` : `একই দিনে পরীক্ষা (${dateTxt})`,
          badgeClass: "bg-rose-100 text-rose-700 border-rose-300",
          cardClass: "border-rose-300 bg-white",
          title: uniNames,
          desc: isEn
            ? `Total of ${list.length} universities have scheduled exams on ${iso}. Prioritize your preferred center in advance.`
            : `${dateTxt} তারিখে মোট ${toBengaliNumber(list.length)}টি প্রতিষ্ঠানের পরীক্ষা একই দিনে পড়েছে। কেন্দ্র ও অগ্রাধিকার আগেভাগেই নির্ধারণ করুন।`,
          suggestion: isEn
            ? "Suggestion: Choose your primary university and request an alternate unit slot if offered."
            : "💡 পরামর্শ: আপনার প্রধান লক্ষ্য নির্ধারণ করুন এবং সময় সংঘাত থাকলে বিকল্প ইউনিট শিফট যাচাই করুন।"
        });
      }
    });

    // 2. Consecutive & Tight Gaps with City Travel Warning
    const uniqueDates = Object.keys(byDate).sort();
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const d1 = uniqueDates[i];
      const d2 = uniqueDates[i + 1];
      const p1 = d1.split("-").map(Number);
      const p2 = d2.split("-").map(Number);
      const diff = Math.round((new Date(p2[0], p2[1] - 1, p2[2]) - new Date(p1[0], p1[1] - 1, p1[2])) / (1000 * 60 * 60 * 24));

      if (diff >= 1 && diff <= 2) {
        const unis1 = byDate[d1];
        const unis2 = byDate[d2];
        const names1 = unis1.map(x => getUniDisplayName(x)).join(", ");
        const names2 = unis2.map(x => getUniDisplayName(x)).join(", ");
        const cities1 = Array.from(new Set(unis1.map(u => getUniCity(u))));
        const cities2 = Array.from(new Set(unis2.map(u => getUniCity(u))));

        const isDiffCity = cities1.some(c1 => cities2.some(c2 => c1 !== c2 && c1 !== "বিভিন্ন কেন্দ্র" && c2 !== "বিভিন্ন কেন্দ্র" && c1 !== "সারা দেশ" && c2 !== "সারা দেশ"));

        if (diff === 1 && isDiffCity) {
          // Travel Clash Alert
          alerts.push({
            type: "travel_clash",
            badge: isEn ? `Travel Clash Warning (Consecutive Days)` : `⚠️ ভ্রমণের সময় সংঘাত সতর্কতা (পরপর দিন)`,
            badgeClass: "bg-orange-100 text-orange-900 border-orange-300 font-bold",
            cardClass: "border-orange-300 bg-white",
            title: `${names1} (${cities1.join('/')}) ➔ ${names2} (${cities2.join('/')})`,
            desc: isEn
              ? `Back-to-back exams in different cities (${cities1.join('/')} and ${cities2.join('/')}). Travel time may exceed 6–8 hours.`
              : `টানা দুই দিনে দুই ভিন্ন শহরে (${cities1.join('/')} ও ${cities2.join('/')}) পরীক্ষা! শহর দুটির দূরত্ব বিবেচনায় যাতায়াতে ৬-১০ ঘণ্টা সময় লাগতে পারে।`,
            suggestion: isEn
              ? "Suggestion: Book express overnight transit well in advance or arrange local lodging."
              : `💡 পরামর্শ: আগের দিন সন্ধ্যার রাতের ট্রেন বা বাসের টিকিট অগ্রিম বুক করুন এবং ক্লান্তি এড়াতে প্রস্তুত থাকুন।`
          });
        } else {
          alerts.push({
            type: diff === 1 ? "back_to_back" : "tight_gap",
            badge: diff === 1
              ? (isEn ? `Consecutive Days (${d1} & ${d2})` : `টানা পরপর দিন (${isoToBanglaDateText(d1)} ও ${isoToBanglaDateText(d2)})`)
              : (isEn ? `1 Day Gap (${d1} → ${d2})` : `মাত্র ১ দিন বিরতি (${isoToBanglaDateText(d1)} → ${isoToBanglaDateText(d2)})`),
            badgeClass: diff === 1 ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-purple-100 text-purple-800 border-purple-200",
            cardClass: diff === 1 ? "border-amber-300 bg-white" : "border-purple-200 bg-white",
            title: `${names1} → ${names2}`,
            desc: isEn
              ? `Exams on ${d1} (${names1}) followed by ${d2} (${names2}) within ${diff} day(s).`
              : `${isoToBanglaDateText(d1)} তারিখে (${names1}) এবং ঠিক ${toBengaliNumber(diff)} দিন পরেই ${isoToBanglaDateText(d2)} তারিখে (${names2}) পরীক্ষা।`,
            suggestion: isEn
              ? "Suggestion: Ensure admit cards and prep kits are ready beforehand."
              : "💡 পরামর্শ: পরীক্ষার প্রবেশপত্র ও প্রয়োজনীয় স্টেশনারি আগেভাগেই গুছিয়ে রাখুন।"
          });
        }
      }
    }

    return alerts;
  }

  app.isExamAnnounced = window.isExamAnnounced = isExamAnnounced;
  app.isDeadlineAnnounced = window.isDeadlineAnnounced = isDeadlineAnnounced;
  app.hasSavedCredentials = window.hasSavedCredentials = hasSavedCredentials;
  app.getReferenceToday = window.getReferenceToday = getReferenceToday;
  app.getDaysRemainingInfo = window.getDaysRemainingInfo = getDaysRemainingInfo;
  app.computeDynamicClashes = window.computeDynamicClashes = computeDynamicClashes;
})(window);
