/**
 * countdown.js
 * Live Hero Countdown banner timer (Days, Hours, Minutes, Seconds) for nearest exam.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function getEventStartTime(timeText) {
      const normalized = String(timeText || "");
      const match = normalized.match(/(\d{1,2}|[০-৯]{1,2}):([০-৯\d]{2})/);
      if (!match) return { hour: 10, minute: 0 };
      const digits = value => Number(String(value).replace(/[০-৯]/g, digit => "০১২৩৪৫৬৭৮৯".indexOf(digit)));
      let hour = digits(match[1]);
      const minute = digits(match[2]);
      if (normalized.includes("দুপুর") && hour < 12) hour += 12;
      return { hour, minute };
    }

    function getCountdownEventKey(event, index) {
      return `${event.uniId}|${event.iso}|${index}`;
    }

    function getCountdownEvents() {
      return (window.UNIT_CALENDAR_EVENTS || [])
        .map((event, index) => ({ ...event, eventKey: getCountdownEventKey(event, index) }))
        .filter(event => /^\d{4}-\d{2}-\d{2}$/.test(event.iso))
        .sort((a, b) => a.iso.localeCompare(b.iso) || a.short.localeCompare(b.short));
    }

    function populateCountdownDropdown() {
      const sel = document.getElementById("countdownTargetSelect");
      if (!sel) return;
      const events = getCountdownEvents();
      if (events.length === 0) return;
      if (!events.some(event => event.eventKey === state.countdownEventKey)) {
        const legacyMatch = events.find(event => event.uniId === Number(state.countdownUniId));
        state.countdownEventKey = (legacyMatch || events[0]).eventKey;
      }
      sel.innerHTML = events.map(event => {
        const dateLabel = state.lang === "en" ? event.iso : toBengaliNumber(event.iso);
        return `<option value="${escapeHtml(event.eventKey)}" class="text-slate-900" ${event.eventKey === state.countdownEventKey ? 'selected' : ''}>${escapeHtml(event.short)} — ${escapeHtml(dateLabel)}</option>`;
      }).join("");
    }

    function tickHeroLiveCountdown() {
      const events = getCountdownEvents();
      const event = events.find(item => item.eventKey === state.countdownEventKey) || events[0];
      if (!event) return;
      const uni = state.universities.find(u => u.id === Number(event.uniId));
      const nameEl = document.getElementById("heroNextExamName");
      const metaEl = document.getElementById("heroNextExamMeta");
      if (nameEl) nameEl.textContent = event.short;

      const dateText = state.lang === "en" ? event.iso : toBengaliNumber(event.iso);
      if (metaEl) metaEl.textContent = `${dateText} • ${translateDateText(event.time)} • ${event.centers}`;

      const now = new Date();
      let refNow = now;
      if (now.getFullYear() < 2026 || now.getFullYear() > 2027) {
        refNow = new Date(2026, 9, 25, now.getHours(), now.getMinutes(), now.getSeconds());
      }

      const iso = event.iso;
      const parts = iso.split("-").map(Number);
      const start = getEventStartTime(event.time);
      const target = new Date(parts[0], parts[1] - 1, parts[2], start.hour, start.minute, 0);
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
