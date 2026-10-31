/**
 * directory.js
 * Universities directory grid cards, table list, search and filtering views.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function getFilteredUniversities() {
      const q = state.searchQuery.trim().toLowerCase();
      let list = state.universities.filter(u => {
        if (q) {
          const haystack = `${u.name} ${u.keywords || ""} ${u.examDateText} ${u.deadlineText} ${u.feeText} ${u.userId || ""} ${u.examRoll || ""} ${u.note || ""}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        if (state.categoryFilter !== "all" && u.category !== state.categoryFilter) return false;
        if (state.statusFilter === "announced" && !isExamAnnounced(u)) return false;
        if (state.statusFilter === "unpublished" && isExamAnnounced(u)) return false;
        if (state.statusFilter === "deadline_known" && !isDeadlineAnnounced(u)) return false;
        if (state.statusFilter === "target" && !u.target) return false;
        if (state.statusFilter === "has_creds" && !hasSavedCredentials(u)) return false;
        if (state.statusFilter === "applied" && u.status !== "applied") return false;
        if (state.statusFilter === "in_progress" && u.status !== "in_progress") return false;
        if (state.statusFilter === "pending" && u.status !== "pending") return false;
        return true;
      });

      list.sort((a, b) => {
        if (state.sortBy === "exam_date") {
          const da = isExamAnnounced(a) ? (a.isoExamDate || "9999-12-31") : "9999-12-31";
          const db = isExamAnnounced(b) ? (b.isoExamDate || "9999-12-31") : "9999-12-31";
          if (da !== db) return da.localeCompare(db);
          return a.id - b.id;
        }
        if (state.sortBy === "fee_asc") {
          return (a.selectedFee || a.defaultFee || 0) - (b.selectedFee || b.defaultFee || 0);
        }
        if (state.sortBy === "fee_desc") {
          return (b.selectedFee || b.defaultFee || 0) - (a.selectedFee || a.defaultFee || 0);
        }
        return a.id - b.id;
      });

      return list;
    }


    function renderDirectory() {
      const filtered = getFilteredUniversities();
      const cardsEl = document.getElementById("cardsContainer");
      const tableContainer = document.getElementById("tableContainer");
      const tableBody = document.getElementById("tableBody");
      const emptyEl = document.getElementById("emptyState");
      const countLabel = document.getElementById("resultsCountLabel");
      const resetBtn = document.getElementById("btnResetFilters");

      const hasActiveFilters = state.searchQuery.trim() !== "" || state.categoryFilter !== "all" || state.statusFilter !== "all" || state.sortBy !== "serial";
      resetBtn.classList.toggle("hidden", !hasActiveFilters);
      document.getElementById("btnClearSearch").classList.toggle("hidden", state.searchQuery.trim() === "");

      countLabel.textContent = `মোট ${toBengaliNumber(filtered.length)}টি বিশ্ববিদ্যালয়ের তথ্য দেখানো হচ্ছে`;

      if (filtered.length === 0) {
        cardsEl.classList.add("hidden");
        tableContainer.classList.add("hidden");
        emptyEl.classList.remove("hidden");
        return;
      }

      emptyEl.classList.add("hidden");

      if (state.viewMode === "cards") {
        cardsEl.classList.remove("hidden");
        tableContainer.classList.add("hidden");
        cardsEl.innerHTML = filtered.map(u => renderUniversityCardHtml(u)).join("");
      } else {
        cardsEl.classList.add("hidden");
        tableContainer.classList.remove("hidden");
        tableBody.innerHTML = filtered.map(u => renderUniversityRowHtml(u)).join("");
      }
    }

    function getCategoryLabel(cat) {
      const bn = (CATEGORY_META[cat] || CATEGORY_META.general).label;
      const enMap = {
        general: "Public General",
        engineering: "Engineering & IUT",
        scitech: "Science & Tech",
        medical: "Medical & Health",
        specialized: "Agri & Specialized",
        private: "Top 10 Private"
      };
      return t(bn, enMap[cat] || "Public General");
    }

    function getStatusLabel(st) {
      const bn = (STATUS_META[st] || STATUS_META.pending).label;
      const enMap = {
        pending: "Not Applied",
        in_progress: "In Progress",
        applied: "Applied"
      };
      return t(bn, enMap[st] || "Not Applied");
    }

    function renderUniversityCardHtml(u) {
      const catMeta = CATEGORY_META[u.category] || CATEGORY_META.general;
      const statusMeta = STATUS_META[u.status] || STATUS_META.pending;
      const countdown = getDaysRemainingInfo(u.isoExamDate, u.examDateText);
      const isAnnounced = isExamAnnounced(u);
      const hasDeadline = isDeadlineAnnounced(u);
      const hasCreds = hasSavedCredentials(u);
      const dispName = getUniDisplayName(u);
      const dispSerial = state.lang === "en" ? String(u.id) : (u.serialBn || toBengaliNumber(u.id));
      const dispExam = isAnnounced ? translateDateText(u.examDateText) : t("— (ফাঁকা)", "— (TBA)");
      const dispDeadline = hasDeadline ? translateDateText(u.deadlineText) : t("— (ফাঁকা)", "— (TBA)");
      const dispFee = state.lang === "en" ? toEnglishDigits(u.feeText) : u.feeText;

      return `
        <article class="card-hover bg-white rounded-2xl border ${u.target ? 'border-amber-400 ring-1' : 'border-slate-200/90'} p-4 sm:p-5 flex flex-col justify-between gap-3.5 relative">
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center border border-slate-200">
                  ${escapeHtml(dispSerial)}
                </span>
                <span class="px-2.5 py-0.5 text-[11px] font-bold rounded-lg border ${catMeta.badgeClass}">
                  ${escapeHtml(getCategoryLabel(u.category))}
                </span>
                <span class="px-2.5 py-0.5 text-[11px] font-bold rounded-lg border ${countdown.badgeClass}">
                  ${escapeHtml(countdown.text)}
                </span>
              </div>

              <button
                type="button"
                data-action="toggle-target"
                data-id="${u.id}"
                title="${u.target ? t('টার্গেট তালিকা থেকে সরান', 'Remove from Target') : t('টার্গেট তালিকায় যোগ করুন', 'Add to Target')}"
                class="p-1.5 rounded-xl border transition ${u.target ? 'bg-amber-50 border-amber-300 text-amber-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500'}"
              >
                <svg width="18" height="18" class="w-4 h-4" fill="${u.target ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            </div>

            <h3 class="text-base font-bold text-slate-900 leading-snug">
              ${escapeHtml(dispName)}
            </h3>

            <div class="grid grid-cols-2 gap-2 pt-0.5">
              <div data-action="edit-uni" data-id="${u.id}" title="${t('ক্লিক করে পরীক্ষার তারিখ পরিবর্তন করুন', 'Click to edit exam date')}" class="cursor-pointer bg-slate-50/90 hover:bg-emerald-50/50 p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition">
                <div class="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>${t('পরীক্ষার তারিখ', 'Exam Date')}</span>
                  <span class="text-emerald-600">✏️</span>
                </div>
                <div class="text-xs sm:text-sm font-bold mt-0.5 ${isAnnounced ? 'text-emerald-800' : 'text-slate-400'}">
                  ${escapeHtml(dispExam)}
                </div>
              </div>
              <div data-action="edit-uni" data-id="${u.id}" title="${t('ক্লিক করে ফরম পূরণের তারিখ পরিবর্তন করুন', 'Click to edit application deadline')}" class="cursor-pointer bg-slate-50/90 hover:bg-blue-50/40 p-2.5 rounded-xl border border-slate-200/80 hover:border-blue-200 transition">
                <div class="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>${t('ফরম পূরণের সময়', 'Application Window')}</span>
                  <span class="text-blue-600">✏️</span>
                </div>
                <div class="text-xs sm:text-sm font-bold mt-0.5 ${hasDeadline ? 'text-blue-700' : 'text-slate-400'}">
                  ${escapeHtml(dispDeadline)}
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between bg-slate-50/60 px-3 py-2 rounded-xl border border-slate-200/70 text-xs">
              <span class="text-slate-600 font-semibold">${t('আবেদন ফি (৳):', 'Form Fee (BDT):')}</span>
              <span class="font-bold text-slate-900">৳ ${escapeHtml(dispFee)}</span>
            </div>

            ${hasCreds ? `
              <div class="bg-emerald-50/70 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-950 space-y-0.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-emerald-800">🔑 ${t('সেভ করা তথ্য:', 'Saved Vault:')}</span>
                  <button type="button" data-action="edit-uni" data-id="${u.id}" class="underline font-semibold text-emerald-700">${t('এডিট', 'Edit')}</button>
                </div>
                ${u.userId ? `<div><strong>User ID:</strong> <span class="select-all">${escapeHtml(u.userId)}</span></div>` : ''}
                ${u.userPass ? `<div><strong>Pass:</strong> <span class="select-all">${escapeHtml(u.userPass)}</span></div>` : ''}
                ${u.examRoll ? `<div><strong>${t('রোল/কেন্দ্র:', 'Roll/Center:')}</strong> ${escapeHtml(u.examRoll)}</div>` : ''}
              </div>
            ` : ''}

            ${u.note ? `
              <div class="bg-amber-50/70 border border-amber-200/80 rounded-xl px-3 py-1.5 text-xs text-amber-900 flex items-start gap-1.5">
                <span class="font-bold shrink-0">${t('নোট:', 'Note:')}</span>
                <span>${escapeHtml(u.note)}</span>
              </div>
            ` : ''}

            <!-- Data Freshness & Correction Trigger -->
            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span>${t('সর্বশেষ আপডেট:', 'Updated:')} <strong class="text-slate-700">${(u.eligibility && u.eligibility.verifiedOn) ? u.eligibility.verifiedOn : 'অক্টোবর ২০২৬'}</strong></span>
              <button type="button" data-action="edit-uni" data-id="${u.id}" class="text-emerald-700 hover:underline font-semibold">
                ${t('তথ্য ভুল? সংশোধন ✏️', 'Edit info ✏️')}
              </button>
            </div>
          </div>

          <div class="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              data-action="cycle-status"
              data-id="${u.id}"
              title="${t('ক্লিক করে আবেদনের অবস্থা পরিবর্তন করুন', 'Click to cycle application status')}"
              class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition ${statusMeta.btnClass}"
            >
              <span class="w-2 h-2 rounded-full ${statusMeta.dotClass}"></span>
              <span>${escapeHtml(getStatusLabel(u.status))}</span>
            </button>

            <div class="flex items-center gap-1.5">
              <button
                type="button"
                data-action="open-marks"
                data-id="${u.id}"
                title="${t('নম্বর বণ্টন ও স্কোর ক্যালকুলেটর', 'Mark Distribution & Score Calculator')}"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition"
              >
                <span>📊 ${t('নম্বর', 'Marks')}</span>
              </button>

              <button
                type="button"
                data-action="edit-uni"
                data-id="${u.id}"
                title="${t('তারিখ বা ইউজার আইডি/পাসওয়ার্ড সংরক্ষণ করুন', 'Edit dates or save User ID/Password')}"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold ${hasCreds ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'} transition"
              >
                <span>🔑 ${t('আইডি', 'ID')}</span>
              </button>

              <a
                href="${escapeHtml(u.circularUrl || '#')}"
                target="_blank"
                rel="noopener noreferrer"
                data-action="open-circular"
                data-id="${u.id}"
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs"
              >
                <span>${t('সার্কুলার', 'Portal')}</span>
                <svg width="13" height="13" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </article>
      `;
    }

    function renderUniversityRowHtml(u) {
      const catMeta = CATEGORY_META[u.category] || CATEGORY_META.general;
      const statusMeta = STATUS_META[u.status] || STATUS_META.pending;
      const isAnnounced = isExamAnnounced(u);
      const hasDeadline = isDeadlineAnnounced(u);
      const hasCreds = hasSavedCredentials(u);
      const dispName = getUniDisplayName(u);
      const dispSerial = state.lang === "en" ? String(u.id) : (u.serialBn || toBengaliNumber(u.id));
      const dispExam = isAnnounced ? translateDateText(u.examDateText) : "—";
      const dispDeadline = hasDeadline ? translateDateText(u.deadlineText) : "—";
      const dispFee = state.lang === "en" ? toEnglishDigits(u.feeText) : u.feeText;

      return `
        <tr class="hover:bg-slate-50/90 transition ${u.target ? 'bg-amber-50/30' : ''}">
          <td class="py-3 px-3 text-center font-bold text-slate-700 text-xs">${escapeHtml(dispSerial)}</td>
          <td class="py-3 px-3 text-center">
            <button
              type="button"
              data-action="toggle-target"
              data-id="${u.id}"
              class="p-1 rounded-md ${u.target ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'}"
              title="Target"
            >
              <svg width="18" height="18" class="w-4 h-4 mx-auto" fill="${u.target ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </td>
          <td class="py-3 px-4">
            <div class="font-bold text-slate-900">${escapeHtml(dispName)}</div>
            <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span class="text-[11px] px-2 py-0.2 rounded-md border font-semibold ${catMeta.badgeClass}">${escapeHtml(getCategoryLabel(u.category))}</span>
              ${hasCreds ? `<span class="text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-md font-bold">🔑 ${t('আইডি সেভড', 'ID Saved')}</span>` : ''}
              ${u.note ? `<span class="text-[11px] text-amber-800 bg-amber-100 px-2 py-0.2 rounded-md">${escapeHtml(u.note)}</span>` : ''}
            </div>
          </td>
          <td class="py-3 px-4 font-bold ${isAnnounced ? 'text-emerald-800' : 'text-slate-400'}">${escapeHtml(dispExam)}</td>
          <td class="py-3 px-4 font-semibold ${hasDeadline ? 'text-blue-700' : 'text-slate-400'}">${escapeHtml(dispDeadline)}</td>
          <td class="py-3 px-4 font-bold text-slate-800">৳ ${escapeHtml(dispFee)}</td>
          <td class="py-3 px-4">
            <button
              type="button"
              data-action="cycle-status"
              data-id="${u.id}"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${statusMeta.btnClass}"
            >
              <span class="w-2 h-2 rounded-full ${statusMeta.dotClass}"></span>
              <span>${escapeHtml(getStatusLabel(u.status))}</span>
            </button>
          </td>
          <td class="py-3 px-4 text-right whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5">
              <button
                type="button"
                data-action="edit-uni"
                data-id="${u.id}"
                class="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                🔑 ${t('এডিট', 'Edit')}
              </button>
              <a
                href="${escapeHtml(u.circularUrl || '#')}"
                target="_blank"
                rel="noopener noreferrer"
                data-action="open-circular"
                data-id="${u.id}"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              >
                <span>${t('সার্কুলার ↗', 'Portal ↗')}</span>
              </a>
            </div>
          </td>
        </tr>
      `;
    }


  app.getFilteredUniversities = window.getFilteredUniversities = getFilteredUniversities;
  app.renderDirectory = window.renderDirectory = renderDirectory;
  app.getCategoryLabel = window.getCategoryLabel = getCategoryLabel;
  app.getStatusLabel = window.getStatusLabel = getStatusLabel;
  app.renderUniversityCardHtml = window.renderUniversityCardHtml = renderUniversityCardHtml;
  app.renderUniversityRowHtml = window.renderUniversityRowHtml = renderUniversityRowHtml;
})(window);
