/**
 * date.utils.js
 * Exam date status checks, days remaining countdown & dynamic exam clash detector.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function isExamAnnounced(u) {
      const t = (u.examDateText || "").trim();
      return Boolean(t !== "" && t !== "অপ্রকাশিত" && t !== "ফাঁকা");
    }

    function isDeadlineAnnounced(u) {
      const t = (u.deadlineText || "").trim();
      return Boolean(t !== "" && !t.includes("অপ্রকাশিত") && !t.includes("ফাঁকা"));
    }

    function hasSavedCredentials(u) {
      return Boolean((u.userId && u.userId.trim()) || (u.userPass && u.userPass.trim()) || (u.examRoll && u.examRoll.trim()));
    }

    function getReferenceToday() {
      const now = new Date();
      if (now.getFullYear() === 2026 || now.getFullYear() === 2027) {
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      }
      return new Date(2026, 9, 25);
    }

    function getDaysRemainingInfo(isoDate, examDateText) {
      if (!isExamAnnounced({ examDateText }) || !isoDate || isoDate === "9999-12-31") {
        return { text: t("তারিখ দেয়নি", "TBA"), badgeClass: "bg-slate-100 text-slate-500 border-slate-200", days: null };
      }
      const today = getReferenceToday();
      const parts = isoDate.split("-").map(Number);
      const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
      const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        return { text: t("পরীক্ষা সম্পন্ন", "Completed"), badgeClass: "bg-slate-200 text-slate-600 border-slate-300", days: diffDays };
      }
      if (diffDays === 0) {
        return { text: t("আজ পরীক্ষা!", "Exam Today!"), badgeClass: "bg-rose-100 text-rose-700 border-rose-200", days: 0 };
      }
      if (diffDays <= 45) {
        return { text: t(`${toBengaliNumber(diffDays)} দিন বাকি`, `${diffDays}d left`), badgeClass: "bg-amber-50 text-amber-800 border-amber-200", days: diffDays };
      }
      return { text: t(`${toBengaliNumber(diffDays)} দিন বাকি`, `${diffDays}d left`), badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", days: diffDays };
    }


    function computeDynamicClashes(onlyTargets) {
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

      Object.entries(byDate).forEach(([iso, list]) => {
        if (list.length > 1) {
          alerts.push({
            type: "same_day",
            badge: `একই দিনে পরীক্ষা (${isoToBanglaDateText(iso)})`,
            badgeClass: "bg-rose-100 text-rose-700 border-rose-300",
            cardClass: "border-rose-300 bg-white",
            title: list.map(x => x.name).join(" • "),
            desc: `${isoToBanglaDateText(iso)} তারিখে মোট ${toBengaliNumber(list.length)}টি প্রতিষ্ঠানের পরীক্ষা একই দিনে পড়েছে। কেন্দ্র ও অগ্রাধিকার আগেভাগেই নির্ধারণ করুন।`
          });
        }
      });

      const uniqueDates = Object.keys(byDate).sort();
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const d1 = uniqueDates[i];
        const d2 = uniqueDates[i + 1];
        const p1 = d1.split("-").map(Number);
        const p2 = d2.split("-").map(Number);
        const diff = Math.round((new Date(p2[0], p2[1] - 1, p2[2]) - new Date(p1[0], p1[1] - 1, p1[2])) / (1000 * 60 * 60 * 24));
        if (diff >= 1 && diff <= 2) {
          const names1 = byDate[d1].map(x => x.name).join(", ");
          const names2 = byDate[d2].map(x => x.name).join(", ");
          alerts.push({
            type: diff === 1 ? "back_to_back" : "tight_gap",
            badge: diff === 1 ? `টানা পরপর দিন (${isoToBanglaDateText(d1)} ও ${isoToBanglaDateText(d2)})` : `মাত্র ১ দিন বিরতি (${isoToBanglaDateText(d1)} → ${isoToBanglaDateText(d2)})`,
            badgeClass: diff === 1 ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-purple-100 text-purple-800 border-purple-200",
            cardClass: diff === 1 ? "border-amber-300 bg-white" : "border-purple-200 bg-white",
            title: `${names1} → ${names2}`,
            desc: `${isoToBanglaDateText(d1)} তারিখে (${names1}) এবং এর ঠিক ${toBengaliNumber(diff)} দিন পরেই ${isoToBanglaDateText(d2)} তারিখে (${names2}) ভর্তি পরীক্ষা। দূরপাল্লার যাতায়াতের ক্ষেত্রে আগে থেকেই টিকিট ও প্রস্তুতি রাখুন।`
          });
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
