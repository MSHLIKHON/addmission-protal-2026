/**
 * eligibility.js
 * SSC & HSC GPA eligibility calculator with group and second timer criteria.
 * Dynamic rule evaluation reading directly from university eligibility data.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  function getEligibilityRequirements(u) {
    if (u && u.eligibility) {
      const e = u.eligibility;
      const isSecondTime = (typeof e.secondTimer !== "undefined") ? Boolean(e.secondTimer) : ((typeof e.secondTime !== "undefined") ? Boolean(e.secondTime) : true);
      return {
        minSsc: typeof e.minSsc === "number" ? e.minSsc : 3.5,
        minHsc: typeof e.minHsc === "number" ? e.minHsc : 3.5,
        minTotal: typeof e.minTotal === "number" ? e.minTotal : 7.5,
        secondTime: isSecondTime,
        secondTimer: isSecondTime,
        groups: Array.isArray(e.groups) ? e.groups : ["science", "humanities", "business"],
        reqText: e.notes || (app.state && app.state.lang === "en" ? `Min GPA: ${(e.minTotal || 7.5).toFixed(2)}` : `ন্যূনতম মোট জিপিএ ${toBengaliNumber(e.minTotal || 7.5)}`),
        notes: e.notes || "",
        source: e.source || u.circularUrl || null,
        verifiedOn: e.verifiedOn || null
      };
    }

    // Default fallback if eligibility object is not yet defined
    return {
      minSsc: 3.5,
      minHsc: 3.5,
      minTotal: 7.5,
      secondTime: true,
      secondTimer: true,
      groups: ["science", "humanities", "business"],
      reqText: app.state && app.state.lang === "en" ? "Check official circular" : "অফিসিয়াল সার্কুলার দেখে নিশ্চিত হোন",
      notes: "",
      source: u ? u.circularUrl : null,
      verifiedOn: null
    };
  }

  function renderEligibilityView() {
    const grid = document.getElementById("eligibilityResultGrid");
    if (!grid) return;
    const isEn = Boolean(app.state && app.state.lang === "en");
    const group = (document.getElementById("eligGroupSelect")?.value) || "science";
    const ssc = parseFloat(document.getElementById("eligSscInput")?.value || "5.00") || 0;
    const hsc = parseFloat(document.getElementById("eligHscInput")?.value || "5.00") || 0;
    const timer = (document.getElementById("eligSecondTimeSelect")?.value) || "first";
    const total = ssc + hsc;

    let eligibleCount = 0;
    const cards = state.universities.map(u => {
      const rule = getEligibilityRequirements(u);
      let adjTotal = rule.minTotal;
      if (group !== "science" && u.category === "general") {
        adjTotal = Math.max(6.5, rule.minTotal - 0.5);
      }

      const groupOk = rule.groups.includes(group);
      const gpaOk = ssc >= rule.minSsc && hsc >= rule.minHsc && total >= adjTotal;
      const timerOk = timer === "first" || rule.secondTime;
      const isEligible = groupOk && gpaOk && timerOk;
      if (isEligible) eligibleCount++;

      let reason = isEn ? "Fully eligible to apply!" : "আপনি আবেদনের জন্য সম্পূর্ণ যোগ্য!";
      if (!groupOk) {
        reason = isEn ? "Only for Science group applicants" : "শুধুমাত্র বিজ্ঞান বিভাগের শিক্ষার্থীদের জন্য";
      } else if (!timerOk) {
        reason = isEn ? "Second-timer applicants are not eligible" : "এই বিশ্ববিদ্যালয়ে সেকেন্ড টাইম আবেদনের সুযোগ নেই";
      } else if (!gpaOk) {
        reason = isEn
          ? `Minimum GPA requirement not met (${rule.reqText})`
          : `ন্যূনতম জিপিএ শর্ত পূরণ হয়নি (${rule.reqText})`;
      }

      const eligibleBadge = isEligible
        ? (isEn ? "Eligible" : "✅ আবেদনযোগ্য")
        : (isEn ? "Ineligible" : "❌ অযোগ্য");

      const feeLabel = isEn
        ? `Fee: ৳ ${escapeHtml(u.feeText)}`
        : `ফি: ৳ ${escapeHtml(u.feeText)}`;

      const targetBtnText = u.target
        ? (isEn ? "⭐ Targeted" : "⭐ টার্গেটেড")
        : (isEn ? "+ Target" : "+ টার্গেট");

      const uniName = getUniDisplayName(u);

      return `
        <div class="p-4 rounded-2xl border ${isEligible ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50 opacity-75'} flex flex-col justify-between gap-2.5">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isEligible ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-700'}">
                ${eligibleBadge}
              </span>
              <span class="text-xs font-bold text-slate-600">${feeLabel}</span>
            </div>
            <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-2">${escapeHtml(uniName)}</h3>
            <p class="text-xs text-slate-600 mt-0.5">${escapeHtml(rule.reqText)}</p>
          </div>
          <div class="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <span class="${isEligible ? 'text-emerald-800 font-semibold' : 'text-rose-700 font-medium'}">${escapeHtml(reason)}</span>
            <button type="button" data-action="toggle-target" data-id="${u.id}" class="px-2.5 py-1 rounded-lg font-bold border ${u.target ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-slate-200 text-slate-700'}">
              ${targetBtnText}
            </button>
          </div>
        </div>
      `;
    });

    const badge = document.getElementById("eligMatchCountBadge");
    if (badge) {
      badge.textContent = isEn
        ? `Eligible: ${eligibleCount} / ${state.universities.length}`
        : `যোগ্য বিশ্ববিদ্যালয়: ${toBengaliNumber(eligibleCount)}টি / ${toBengaliNumber(state.universities.length)}টি`;
    }

    // Insert visible disclaimer banner right above grid if container exists
    const disclaimerHtml = `
      <div class="col-span-1 md:col-span-2 lg:col-span-3 mb-1 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-center gap-2">
        <span class="text-sm">⚠️</span>
        <div>
          <span class="font-bold">${isEn ? "Notice: " : "সতর্কতা: "}</span>
          <span>${isEn ? "This is an estimate — verify with the official circular before applying." : "এটি আনুমানিক — অফিসিয়াল সার্কুলার দেখে নিশ্চিত হোন।"}</span>
        </div>
      </div>
    `;

    grid.innerHTML = disclaimerHtml + cards.join("");
  }

  app.getEligibilityRequirements = window.getEligibilityRequirements = getEligibilityRequirements;
  app.renderEligibilityView = window.renderEligibilityView = renderEligibilityView;
})(window);
