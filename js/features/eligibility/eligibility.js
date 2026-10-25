/**
 * eligibility.js
 * SSC & HSC GPA eligibility calculator with group and second timer criteria.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function getEligibilityRequirements(u) {
      if (u.id === 11) return { minSsc: 4.0, minHsc: 5.0, minTotal: 9.0, secondTime: false, groups: ["science"], reqText: "SSC ৪.০০ + HSC ৫.০০ (মোট ৯.০০, শুধু ১ম বার বিজ্ঞান)" };
      if ([12, 13, 14].includes(u.id)) return { minSsc: 4.0, minHsc: 4.5, minTotal: 8.5, secondTime: false, groups: ["science"], reqText: "SSC ৪.০০ + HSC ৪.৫০ (বিজ্ঞান, ১ম বার)" };
      if ([8, 19, 20].includes(u.id)) return { minSsc: 4.0, minHsc: 4.5, minTotal: 8.5, secondTime: true, groups: ["science"], reqText: "SSC ৪.০০ + HSC ৪.৫০ (বিজ্ঞান)" };
      if ([9, 10].includes(u.id)) return { minSsc: 4.0, minHsc: 4.0, minTotal: 9.0, secondTime: true, groups: ["science"], reqText: "SSC + HSC মোট জিপিএ ৯.০০ (জীববিজ্ঞানসহ বিজ্ঞান, ২য় বার 허용)" };
      if ([15, 30, 31, 32, 33].includes(u.id)) return { minSsc: 4.0, minHsc: 4.0, minTotal: 8.5, secondTime: true, groups: ["science"], reqText: "SSC + HSC মোট ৮.৫০ (প্রতিটিতে ৪.০০, ২য় বার 허용)" };
      if (u.id === 1) return { minSsc: 3.5, minHsc: 3.5, minTotal: 8.0, secondTime: false, groups: ["science", "humanities", "business"], reqText: "বিজ্ঞান: মোট ৮.০০, মানবিক/বাণিজ্য: ৭.৫০ (শুধু ১ম বার)" };
      if (u.category === "private") return { minSsc: 2.5, minHsc: 2.5, minTotal: 6.0, secondTime: true, groups: ["science", "humanities", "business"], reqText: "ন্যূনতম SSC ২.৫০ + HSC ২.৫০ (মোট ৬.০০, সকল বিভাগ)" };
      return { minSsc: 3.5, minHsc: 3.5, minTotal: 7.5, secondTime: true, groups: ["science", "humanities", "business"], reqText: "ন্যূনতম মোট জিপিএ ৭.৫০ - ৮.০০ (২য় বার আবেদনের সুযোগ রয়েছে)" };
    }

    function renderEligibilityView() {
      const grid = document.getElementById("eligibilityResultGrid");
      if (!grid) return;
      const group = (document.getElementById("eligGroupSelect")?.value) || "science";
      const ssc = parseFloat(document.getElementById("eligSscInput")?.value || "5.00") || 0;
      const hsc = parseFloat(document.getElementById("eligHscInput")?.value || "5.00") || 0;
      const timer = (document.getElementById("eligSecondTimeSelect")?.value) || "first";
      const total = ssc + hsc;

      let eligibleCount = 0;
      const cards = state.universities.map(u => {
        const rule = getEligibilityRequirements(u);
        let adjTotal = rule.minTotal;
        if (group !== "science" && u.category === "general") adjTotal = Math.max(6.5, rule.minTotal - 0.5);

        const groupOk = rule.groups.includes(group);
        const gpaOk = ssc >= rule.minSsc && hsc >= rule.minHsc && total >= adjTotal;
        const timerOk = timer === "first" || rule.secondTime;
        const isEligible = groupOk && gpaOk && timerOk;
        if (isEligible) eligibleCount++;

        let reason = "আপনি আবেদনের জন্য সম্পূর্ণ যোগ্য!";
        if (!groupOk) reason = "শুধুমাত্র বিজ্ঞান বিভাগের শিক্ষার্থীদের জন্য";
        else if (!timerOk) reason = "এই বিশ্ববিদ্যালয়ে সেকেন্ড টাইম আবেদনের সুযোগ নেই";
        else if (!gpaOk) reason = `ন্যূনতম জিপিএ শর্ত পূরণ হয়নি (${rule.reqText})`;

        return `
          <div class="p-4 rounded-2xl border ${isEligible ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50 opacity-75'} flex flex-col justify-between gap-2.5">
            <div>
              <div class="flex items-center justify-between gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isEligible ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-700'}">
                  ${isEligible ? '✅ আবেদনযোগ্য' : '❌ অযোগ্য'}
                </span>
                <span class="text-xs font-bold text-slate-600">ফি: ৳ ${escapeHtml(u.feeText)}</span>
              </div>
              <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-2">${escapeHtml(u.name)}</h3>
              <p class="text-xs text-slate-600 mt-0.5">${escapeHtml(rule.reqText)}</p>
            </div>
            <div class="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span class="${isEligible ? 'text-emerald-800 font-semibold' : 'text-rose-700 font-medium'}">${escapeHtml(reason)}</span>
              <button type="button" data-action="toggle-target" data-id="${u.id}" class="px-2.5 py-1 rounded-lg font-bold border ${u.target ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-slate-200 text-slate-700'}">
                ${u.target ? '⭐ টার্গেটেড' : '+ টার্গেট'}
              </button>
            </div>
          </div>
        `;
      });

      const badge = document.getElementById("eligMatchCountBadge");
      if (badge) badge.textContent = `যোগ্য বিশ্ববিদ্যালয়: ${toBengaliNumber(eligibleCount)}টি / ${toBengaliNumber(state.universities.length)}টি`;
      grid.innerHTML = cards.join("");
    }


  app.getEligibilityRequirements = window.getEligibilityRequirements = getEligibilityRequirements;
  app.renderEligibilityView = window.renderEligibilityView = renderEligibilityView;
})(window);
