/**
 * countdown.js
 * Live Hero Countdown banner timer (Days, Hours, Minutes, Seconds) for nearest exam.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function populateCountdownDropdown() {
      const sel = document.getElementById("countdownTargetSelect");
      if (!sel) return;
      const dated = state.universities
        .filter(u => isExamAnnounced(u) && u.isoExamDate && u.isoExamDate !== "9999-12-31")
        .sort((a, b) => a.isoExamDate.localeCompare(b.isoExamDate));
      if (dated.length === 0) return;
      if (!dated.some(u => u.id === Number(state.countdownUniId))) {
        state.countdownUniId = dated[0].id;
      }
      sel.innerHTML = dated.map(u => `<option value="${u.id}" class="text-slate-900" ${u.id === Number(state.countdownUniId) ? 'selected' : ''}>${escapeHtml(getUniDisplayName(u).split('(')[0].trim())} (${escapeHtml(u.examDateText.split(',')[0])})</option>`).join("");
    }

    function tickHeroLiveCountdown() {
      const uni = state.universities.find(u => u.id === Number(state.countdownUniId)) || state.universities[0];
      if (!uni) return;
      const nameEl = document.getElementById("heroNextExamName");
      const metaEl = document.getElementById("heroNextExamMeta");
      if (nameEl) nameEl.textContent = getUniDisplayName(uni);

      const unitMatch = UNIT_CALENDAR_EVENTS.find(e => e.uniId === uni.id);
      const timeStr = unitMatch ? unitMatch.time : "সকাল ১০:০০টা";
      const centerStr = unitMatch ? unitMatch.centers : "নির্ধারিত পরীক্ষা কেন্দ্র";
      if (metaEl) metaEl.textContent = `${translateDateText(uni.examDateText) || t('তারিখ শীঘ্রই', 'Date TBA')} • ${translateDateText(timeStr)} • ${t(centerStr, 'Designated Exam Centers')}`;

      const now = new Date();
      let refNow = now;
      if (now.getFullYear() < 2026 || now.getFullYear() > 2027) {
        refNow = new Date(2026, 9, 25, now.getHours(), now.getMinutes(), now.getSeconds());
      }

      const iso = (uni.isoExamDate && uni.isoExamDate !== "9999-12-31") ? uni.isoExamDate : "2026-12-04";
      const parts = iso.split("-").map(Number);
      const target = new Date(parts[0], parts[1] - 1, parts[2], 10, 0, 0);
      const diffMs = Math.max(0, target - refNow);

      const totalSecs = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      const dEl = document.getElementById("cdDays");
      const hEl = document.getElementById("cdHours");
      const mEl = document.getElementById("cdMins");
      const sEl = document.getElementById("cdSecs");
      if (dEl) dEl.textContent = toBengaliNumber(String(days).padStart(2, "0"));
      if (hEl) hEl.textContent = toBengaliNumber(String(hours).padStart(2, "0"));
      if (mEl) mEl.textContent = toBengaliNumber(String(mins).padStart(2, "0"));
      if (sEl) sEl.textContent = toBengaliNumber(String(secs).padStart(2, "0"));
    }


  app.populateCountdownDropdown = window.populateCountdownDropdown = populateCountdownDropdown;
  app.tickHeroLiveCountdown = window.tickHeroLiveCountdown = tickHeroLiveCountdown;
})(window);
