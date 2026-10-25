/**
 * guide.js
 * Admission preparation checklist, essential documents tracker & tips.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function renderGuideView() {
      const container = document.getElementById("prepChecklistContainer");
      const doneCount = state.checklist.filter(c => c.done).length;
      document.getElementById("checklistProgressBadge").textContent = `${toBengaliNumber(doneCount)}/${toBengaliNumber(state.checklist.length)} সম্পন্ন`;

      container.innerHTML = state.checklist.map(item => `
        <label class="flex items-start gap-3 p-3.5 rounded-xl border ${item.done ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200/80'} cursor-pointer hover:border-emerald-300 transition">
          <input
            type="checkbox"
            data-checklist-id="${item.id}"
            ${item.done ? 'checked' : ''}
            class="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-2"
          />
          <span class="text-xs sm:text-sm ${item.done ? 'line-through text-slate-400' : 'text-slate-800 font-semibold'}">
            ${escapeHtml(item.title)}
          </span>
        </label>
      `).join("");
    }




  app.renderGuideView = window.renderGuideView = renderGuideView;
})(window);
