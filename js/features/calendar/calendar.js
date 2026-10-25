/**
 * calendar.js
 * Interactive monthly visual calendar view displaying all university and sub-unit exam dates.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function renderVisualCalendarGrid() {
      const grid = document.getElementById("visualCalendarGrid");
      if (!grid) return;

      const [yr, mo] = (state.activeCalMonth || "2026-12").split("-").map(Number);
      const firstDayWeek = new Date(yr, mo - 1, 1).getDay(); // 0 = Sun ... 6 = Sat
      const daysInMonth = new Date(yr, mo, 0).getDate();

      // Gather events for this month from both UNIT_CALENDAR_EVENTS and custom-edited universities
      const eventsByDay = {};
      UNIT_CALENDAR_EVENTS.forEach(ev => {
        if (ev.iso.startsWith(state.activeCalMonth)) {
          const dayNum = Number(ev.iso.slice(8, 10));
          if (!eventsByDay[dayNum]) eventsByDay[dayNum] = [];
          eventsByDay[dayNum].push(ev);
        }
      });

      state.universities.forEach(u => {
        if (u.isoExamDate && u.isoExamDate.startsWith(state.activeCalMonth)) {
          const dayNum = Number(u.isoExamDate.slice(8, 10));
          if (!eventsByDay[dayNum]) eventsByDay[dayNum] = [];
          const alreadyListed = eventsByDay[dayNum].some(x => x.uniId === u.id);
          if (!alreadyListed) {
            eventsByDay[dayNum].push({
              iso: u.isoExamDate,
              short: u.name.split("(")[0].trim(),
              time: "সকাল ১০:০০টা",
              centers: "নির্ধারিত কেন্দ্র",
              uniId: u.id
            });
          }
        }
      });

      let cellsHtml = "";
      for (let i = 0; i < firstDayWeek; i++) {
        cellsHtml += `<div class="min-h-[74px] rounded-xl bg-slate-50/50 border border-slate-100 p-1.5"></div>`;
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dayEvents = eventsByDay[d] || [];
        const hasClash = dayEvents.length > 1;
        const hasEvent = dayEvents.length > 0;
        const cellBg = hasClash
          ? "bg-rose-50/80 border-rose-300"
          : (hasEvent ? "bg-emerald-50/70 border-emerald-300" : "bg-white border-slate-200/80");

        cellsHtml += `
          <div class="min-h-[74px] rounded-xl border ${cellBg} p-1.5 flex flex-col justify-between transition hover:shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold ${hasEvent ? 'text-slate-900' : 'text-slate-400'}">${toBengaliNumber(d)}</span>
              ${hasClash ? `<span class="text-[11px] px-1 rounded bg-rose-600 text-white font-bold">ক্ল্যাশ!</span>` : ''}
            </div>
            <div class="space-y-1 mt-1">
              ${dayEvents.map(ev => `
                <button
                  type="button"
                  data-action="open-circular"
                  data-id="${ev.uniId}"
                  title="${escapeHtml(ev.short)} • ${escapeHtml(ev.time)} • ${escapeHtml(ev.centers)}"
                  class="w-full text-left px-1.5 py-0.5 rounded text-[11px] font-bold truncate block ${hasClash ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-600 text-white'}"
                >
                  ${escapeHtml(ev.short)}
                </button>
              `).join("")}
            </div>
          </div>
        `;
      }

      grid.innerHTML = cellsHtml;
    }


  app.renderVisualCalendarGrid = window.renderVisualCalendarGrid = renderVisualCalendarGrid;
})(window);
