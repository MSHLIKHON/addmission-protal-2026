/**
 * targets.js
 * Target universities manager and total application fee budget calculator.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function renderTargetsView() {
      const targets = state.universities.filter(u => u.target);
      const container = document.getElementById("targetListContainer");

      if (targets.length === 0) {
        container.innerHTML = `
          <div class="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p class="text-base font-bold text-slate-700">আপনার টার্গেট তালিকায় কোনো বিশ্ববিদ্যালয় নেই</p>
            <p class="text-xs text-slate-500 mt-1">ডানপাশের তালিকা থেকে অথবা "+ জনপ্রিয় ১০টি যোগ করুন" বাটনে ক্লিক করে আপনার পছন্দের বিশ্ববিদ্যালয় নির্বাচন করুন।</p>
          </div>
        `;
      } else {
        container.innerHTML = targets.map(u => {
          const activeFee = Number(u.selectedFee ?? u.defaultFee ?? 0);
          const options = Array.isArray(u.feeOptions) && u.feeOptions.length > 0
            ? u.feeOptions
            : [{ label: `${u.feeText} - ৳ ${activeFee}`, amount: activeFee }];

          return `
            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-bold text-sm sm:text-base text-slate-900">${escapeHtml(u.name)}</span>
                  <span class="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    পরীক্ষা: ${isExamAnnounced(u) ? escapeHtml(u.examDateText) : '—'}
                  </span>
                </div>
                <div class="text-xs text-slate-500">
                  ফরম পূরণের সময়সীমা: ${isDeadlineAnnounced(u) ? escapeHtml(u.deadlineText) : '—'}
                </div>
              </div>

              <div class="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <select
                  data-action="select-unit-fee"
                  data-id="${u.id}"
                  aria-label="ইউনিট ফি নির্বাচন"
                  class="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2"
                >
                  ${options.map(opt => `
                    <option value="${opt.amount}" ${Number(opt.amount) === activeFee ? 'selected' : ''}>
                      ${escapeHtml(opt.label)}
                    </option>
                  `).join("")}
                </select>

                <button
                  type="button"
                  data-action="open-marks"
                  data-id="${u.id}"
                  title="${(state && state.lang === 'en') ? 'View Mark Distribution' : 'নম্বর বণ্টন ও স্কোর দেখুন'}"
                  class="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition"
                >
                  📊 ${(state && state.lang === 'en') ? 'Marks' : 'নম্বর'}
                </button>

                <button
                  type="button"
                  data-action="cycle-status"
                  data-id="${u.id}"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold border ${(STATUS_META[u.status] || STATUS_META.pending).btnClass}"
                >
                  ${escapeHtml((STATUS_META[u.status] || STATUS_META.pending).label)}
                </button>

                <button
                  type="button"
                  data-action="toggle-target"
                  data-id="${u.id}"
                  title="টার্গেট থেকে বাদ দিন"
                  class="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200"
                >
                  <svg width="16" height="16" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          `;
        }).join("");
      }

      const totalFee = targets.reduce((acc, u) => acc + Number(u.selectedFee ?? u.defaultFee ?? 0), 0);
      const paidFee = targets
        .filter(u => u.status === "applied")
        .reduce((acc, u) => acc + Number(u.selectedFee ?? u.defaultFee ?? 0), 0);
      const remainingFee = Math.max(0, totalFee - paidFee);

      document.getElementById("calcTargetCountBadge").textContent = `${toBengaliNumber(targets.length)}টি বিশ্ববিদ্যালয়`;
      document.getElementById("calcTotalFeeDisplay").textContent = formatCurrencyBn(totalFee);
      document.getElementById("calcPaidFeeDisplay").textContent = formatCurrencyBn(paidFee);
      document.getElementById("calcRemainingFeeDisplay").textContent = formatCurrencyBn(remainingFee);

      const pillsEl = document.getElementById("quickTargetTogglePills");
      pillsEl.innerHTML = state.universities.map(u => `
        <button
          type="button"
          data-action="toggle-target"
          data-id="${u.id}"
          class="px-3 py-1 rounded-xl text-xs font-bold border transition ${
            u.target
              ? 'bg-amber-100 border-amber-400 text-amber-950'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }"
        >
          ${u.target ? '⭐ ' : '+ '}${escapeHtml(u.name)}
        </button>
      `).join("");
    }


  app.renderTargetsView = window.renderTargetsView = renderTargetsView;
})(window);
