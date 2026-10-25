/**
 * kpi.js
 * Dynamic metrics calculation and KPI summary cards update.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function updateKPIs() {
      const total = state.universities.length;
      const announced = state.universities.filter(u => isExamAnnounced(u)).length;
      const unpublished = total - announced;
      const deadlineKnown = state.universities.filter(u => isDeadlineAnnounced(u)).length;
      const applied = state.universities.filter(u => u.status === "applied").length;
      const pending = total - applied;
      const targets = state.universities.filter(u => u.target);
      const targetFee = targets.reduce((sum, u) => sum + Number(u.selectedFee ?? u.defaultFee ?? 0), 0);
      const credsSaved = state.universities.filter(u => hasSavedCredentials(u)).length;
      const clashes = computeDynamicClashes(false);

      document.getElementById("statTotalUni").textContent = toBengaliNumber(total);
      document.getElementById("navBadgeTotal").textContent = toBengaliNumber(total);
      document.getElementById("statDateAnnounced").textContent = toBengaliNumber(announced);
      document.getElementById("statDateUnpublished").textContent = `ফাঁকা / দেয়নি: ${toBengaliNumber(unpublished)}টি`;
      document.getElementById("statDeadlineKnown").textContent = toBengaliNumber(deadlineKnown);
      document.getElementById("statAppliedCount").textContent = toBengaliNumber(applied);
      document.getElementById("statPendingCount").textContent = `আবেদন বাকি: ${toBengaliNumber(pending)}টি`;
      document.getElementById("statTargetCount").textContent = `${toBengaliNumber(targets.length)}টি`;
      document.getElementById("statTargetFee").textContent = formatCurrencyBn(targetFee);
      document.getElementById("navBadgeTargets").textContent = toBengaliNumber(targets.length);
      document.getElementById("navBadgeCreds").textContent = toBengaliNumber(credsSaved);
      document.getElementById("navBadgeClashes").textContent = toBengaliNumber(clashes.length);

      const upcoming = state.universities
        .filter(u => isExamAnnounced(u) && u.isoExamDate && u.isoExamDate !== "9999-12-31")
        .map(u => ({ u, info: getDaysRemainingInfo(u.isoExamDate, u.examDateText) }))
        .filter(x => x.info.days !== null && x.info.days >= 0)
        .sort((a, b) => a.info.days - b.info.days);
      const bannerEl = document.getElementById("nextExamBannerText");
      if (bannerEl && upcoming.length > 0) {
        bannerEl.textContent = `পরবর্তী পরীক্ষা: ${upcoming[0].u.name} (${upcoming[0].u.examDateText} • ${upcoming[0].info.text})`;
      }

      const catCounts = {
        all: total,
        general: state.universities.filter(u => u.category === "general").length,
        engineering: state.universities.filter(u => u.category === "engineering").length,
        scitech: state.universities.filter(u => u.category === "scitech").length,
        medical: state.universities.filter(u => u.category === "medical").length,
        specialized: state.universities.filter(u => u.category === "specialized").length,
        private: state.universities.filter(u => u.category === "private").length
      };
      const catNames = {
        all: "সব বিভাগ",
        general: "সরকারি সাধারণ",
        engineering: "ইঞ্জিনিয়ারিং ও IUT",
        scitech: "বিজ্ঞান ও প্রযুক্তি",
        medical: "মেডিকেল ও হেলথ",
        specialized: "কৃষি ও বিশেষায়িত",
        private: "টপ ১০ প্রাইভেট"
      };
      document.querySelectorAll(".cat-pill").forEach(btn => {
        const cat = btn.getAttribute("data-category");
        if (cat && catNames[cat]) {
          btn.textContent = `${catNames[cat]} (${toBengaliNumber(catCounts[cat] || 0)})`;
        }
      });
    }


  app.updateKPIs = window.updateKPIs = updateKPIs;
})(window);
