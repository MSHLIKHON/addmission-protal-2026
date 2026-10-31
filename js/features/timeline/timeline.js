/**
 * timeline.js
 * Application deadlines timeline, dynamic exam date clash list & chronological view.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function renderTimelineView() {
      const clashes = computeDynamicClashes(state.clashScope === "targets");
      const clashGrid = document.getElementById("dynamicClashGrid");
      if (clashes.length === 0) {
        clashGrid.innerHTML = `
          <div class="col-span-2 lg:col-span-3 bg-white/90 rounded-xl p-5 text-center border border-amber-200">
            <p class="text-sm font-bold text-emerald-800">✅ কোনো পরীক্ষার তারিখে ক্ল্যাশ পাওয়া যায়নি!</p>
            <p class="text-xs text-slate-600 mt-1">আপনার নির্বাচিত তালিকায় একই দিনে বা পরপর দিনে কোনো পরীক্ষা নেই।</p>
          </div>
        `;
      } else {
        clashGrid.innerHTML = clashes.map(c => `
          <div class="rounded-xl p-4 border ${c.cardClass} shadow-2xs flex flex-col justify-between gap-2">
            <div>
              <span class="inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-md border ${c.badgeClass}">${escapeHtml(c.badge)}</span>
              <h3 class="text-sm font-bold text-slate-900 mt-2">${escapeHtml(c.title)}</h3>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">${escapeHtml(c.desc)}</p>
              ${c.suggestion ? `<div class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium mt-2">${escapeHtml(c.suggestion)}</div>` : ''}
            </div>
          </div>
        `).join("");
      }

      const deadlineUnis = state.universities.filter(u => isDeadlineAnnounced(u));
      document.getElementById("deadlineSectionTitle").textContent = `ফরম পূরণের সময়সূচি (ঘোষিত ${toBengaliNumber(deadlineUnis.length)}টি বিশ্ববিদ্যালয়)`;
      const appGrid = document.getElementById("applicationTimelineGrid");
      appGrid.innerHTML = deadlineUnis.map(u => {
        const statusMeta = STATUS_META[u.status] || STATUS_META.pending;
        return `
          <div class="p-4 rounded-xl border border-blue-200/80 bg-blue-50/40 flex flex-col justify-between gap-2.5">
            <div>
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md">${escapeHtml(u.deadlineText)}</span>
                <span class="text-xs font-bold text-slate-700">ফি: ৳ ${escapeHtml(u.feeText)}</span>
              </div>
              <h3 class="text-base font-bold text-slate-900 mt-2">${escapeHtml(u.name)}</h3>
              <p class="text-xs text-slate-600 mt-0.5">পরীক্ষার তারিখ: <strong class="text-emerald-800">${isExamAnnounced(u) ? escapeHtml(u.examDateText) : '— (ফাঁকা)'}</strong></p>
            </div>
            <div class="flex items-center justify-between pt-2.5 border-t border-blue-100">
              <button type="button" data-action="cycle-status" data-id="${u.id}" class="px-2.5 py-1 rounded-lg text-xs font-bold border ${statusMeta.btnClass}">
                ${escapeHtml(statusMeta.label)}
              </button>
              <div class="flex items-center gap-2">
                <button type="button" data-action="edit-uni" data-id="${u.id}" class="text-xs font-bold text-slate-600 hover:underline">✏️ তারিখ পরিবর্তন</button>
                <a href="${escapeHtml(u.circularUrl)}" target="_blank" rel="noopener noreferrer" data-action="open-circular" data-id="${u.id}" class="text-xs font-bold text-blue-700 hover:underline">সার্কুলার ↗</a>
              </div>
            </div>
          </div>
        `;
      }).join("");

      const monthGroups = [
        { key: "2026-12", title: "ডিসেম্বর ২০২৬-এর ভর্তি পরীক্ষা" },
        { key: "2027-01", title: "জানুয়ারি ২০২৭-এর ভর্তি পরীক্ষা (সবচেয়ে ব্যস্ত মাস)" },
        { key: "2027-02", title: "ফেব্রুয়ারি ২০২৭-এর ভর্তি পরীক্ষা" },
        { key: "2027-03", title: "মার্চ ২০২৭ ও পরবর্তী ভর্তি পরীক্ষা" },
        { key: "unpublished", title: "পরীক্ষার তারিখ এখনও দেয়নি / ফাঁকা রাখা হয়েছে" }
      ];

      const monthlyContainer = document.getElementById("monthlyExamTimeline");
      monthlyContainer.innerHTML = monthGroups.map(group => {
        const items = state.universities
          .filter(u => {
            if (!isExamAnnounced(u) || !u.isoExamDate || u.isoExamDate === "9999-12-31") {
              return group.key === "unpublished";
            }
            const m = u.isoExamDate.slice(0, 7);
            if (group.key === "2027-03") {
              return m >= "2027-03";
            }
            return m === group.key;
          })
          .sort((a, b) => (a.isoExamDate || "9999").localeCompare(b.isoExamDate || "9999"));

        return `
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div class="bg-slate-100/80 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <h3 class="text-sm sm:text-base font-bold text-slate-900">${escapeHtml(group.title)}</h3>
              <span class="px-3 py-0.5 text-xs font-bold rounded-full bg-white text-slate-800 border border-slate-200">
                ${toBengaliNumber(items.length)}টি বিশ্ববিদ্যালয়
              </span>
            </div>
            <div class="divide-y divide-slate-100">
              ${items.map(u => {
                const cd = getDaysRemainingInfo(u.isoExamDate, u.examDateText);
                const announced = isExamAnnounced(u);
                return `
                  <div class="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50 transition">
                    <div class="flex items-start sm:items-center gap-3">
                      <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                        ${escapeHtml(u.serialBn || toBengaliNumber(u.id))}
                      </span>
                      <div>
                        <div class="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2 flex-wrap">
                          <span>${escapeHtml(u.name)}</span>
                          ${u.target ? '<span class="text-xs px-2 py-0.2 bg-amber-100 text-amber-800 rounded-md font-bold">⭐ টার্গেট</span>' : ''}
                        </div>
                        <div class="text-xs text-slate-500 mt-0.5">
                          আবেদন ফি: ৳ ${escapeHtml(u.feeText)} • ফরম পূরণ: ${isDeadlineAnnounced(u) ? escapeHtml(u.deadlineText) : '— (ফাঁকা)'}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 self-end sm:self-center">
                      <button type="button" data-action="edit-uni" data-id="${u.id}" class="px-3 py-1 rounded-xl text-xs font-bold ${announced ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}">
                        ${announced ? escapeHtml(u.examDateText) : '+ তারিখ যোগ করুন'} ✏️
                      </button>
                      <span class="px-2.5 py-1 rounded-xl text-xs font-bold border ${cd.badgeClass}">
                        ${escapeHtml(cd.text)}
                      </span>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }).join("");
    }


  app.renderTimelineView = window.renderTimelineView = renderTimelineView;
})(window);
