/**
 * credentials.js
 * Applicant credentials vault for User ID, Password, and Exam Roll tracking.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function renderCredentialsView() {
      const q = state.credSearch.trim().toLowerCase();
      const list = state.universities.filter(u => {
        if (state.credFilter === "saved" && !hasSavedCredentials(u)) return false;
        if (state.credFilter === "target" && !u.target) return false;
        if (state.credFilter === "applied" && u.status !== "applied") return false;
        if (q) {
          const hay = `${u.name} ${u.keywords || ""} ${u.userId || ""} ${u.examRoll || ""} ${u.note || ""}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });

      const grid = document.getElementById("credentialsVaultGrid");
      if (list.length === 0) {
        grid.innerHTML = `
          <div class="col-span-2 text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p class="text-base font-bold text-slate-700">কোনো বিশ্ববিদ্যালয়ের তথ্য পাওয়া যায়নি</p>
            <p class="text-xs text-slate-500 mt-1">ফিল্টার পরিবর্তন করে যেকোনো বিশ্ববিদ্যালয়ের ইউজার আইডি ও পাসওয়ার্ড সংরক্ষণ করুন।</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = list.map(u => {
        const showPass = Boolean(state.revealedPasswords[u.id]);
        const saved = hasSavedCredentials(u);
        return `
          <div class="p-4 rounded-2xl border ${saved ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/60'} space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="w-6 h-6 rounded-md bg-white text-slate-700 text-xs font-bold flex items-center justify-center border border-slate-200">${escapeHtml(u.serialBn || toBengaliNumber(u.id))}</span>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900">${escapeHtml(u.name)}</h3>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">পরীক্ষা: ${isExamAnnounced(u) ? escapeHtml(u.examDateText) : '—'} • ফরম: ${isDeadlineAnnounced(u) ? escapeHtml(u.deadlineText) : '—'}</p>
              </div>
              <a href="${escapeHtml(u.circularUrl)}" target="_blank" rel="noopener noreferrer" data-action="open-circular" data-id="${u.id}" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 shrink-0">
                ভর্তি সাইট ↗
              </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">User ID / আবেদন আইডি</label>
                <div class="flex items-center gap-1">
                  <input
                    type="text"
                    data-cred-field="userId"
                    data-id="${u.id}"
                    value="${escapeHtml(u.userId || '')}"
                    placeholder="ইউজার আইডি লিখুন"
                    class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                  ${u.userId ? `<button type="button" data-action="copy-text" data-copy="${escapeHtml(u.userId)}" title="কপি" class="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold">📋</button>` : ''}
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">Password / পিন</label>
                <div class="flex items-center gap-1">
                  <input
                    type="${showPass ? 'text' : 'password'}"
                    data-cred-field="userPass"
                    data-id="${u.id}"
                    value="${escapeHtml(u.userPass || '')}"
                    placeholder="পাসওয়ার্ড লিখুন"
                    class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                  <button type="button" data-action="toggle-pass-vis" data-id="${u.id}" title="দেখুন/লুকান" class="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold">${showPass ? '🙈' : '👁️'}</button>
                  ${u.userPass ? `<button type="button" data-action="copy-text" data-copy="${escapeHtml(u.userPass)}" title="কপি" class="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold">📋</button>` : ''}
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">ভর্তি রোল ও কেন্দ্র</label>
                <input
                  type="text"
                  data-cred-field="examRoll"
                  data-id="${u.id}"
                  value="${escapeHtml(u.examRoll || '')}"
                  placeholder="রোল ও কেন্দ্রের নাম"
                  class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                data-cred-field="note"
                data-id="${u.id}"
                value="${escapeHtml(u.note || '')}"
                placeholder="পেমেন্ট ট্রানজেকশন আইডি বা ব্যক্তিগত নোট লিখুন (স্বয়ংক্রিয়ভাবে সেভ হবে)..."
                class="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2"
              />
            </div>
          </div>
        `;
      }).join("");
    }


  app.renderCredentialsView = window.renderCredentialsView = renderCredentialsView;
})(window);
