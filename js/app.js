/**
 * app.js
 * Main application orchestrator, event delegation, navigation tabs & initialization lifecycle.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function applyLanguageUI() {
      const isEn = state.lang === "en";
      const btnBn = document.getElementById("btnLangBn");
      const btnEn = document.getElementById("btnLangEn");
      if (btnBn && btnEn) {
        btnBn.className = !isEn
          ? "px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-400 text-slate-950 transition"
          : "px-2.5 py-1 rounded-lg text-xs font-bold text-slate-200 hover:text-white transition";
        btnEn.className = isEn
          ? "px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-400 text-slate-950 transition"
          : "px-2.5 py-1 rounded-lg text-xs font-bold text-slate-200 hover:text-white transition";
      }

      const mapText = {
        lblAppTitle: t("বিশ্ববিদ্যালয় ভর্তি পোর্টাল ও ট্র্যাকার ২০২৬-২০২৭", "University Admission Portal & Tracker 2026–2027"),
        lblAppBadge: t("সরকারি + IUT + টপ ১০ প্রাইভেট", "Public + IUT + Top 10 Private"),
        lblAppSubtitle: t("সকল সরকারি ও শীর্ষ বেসরকারি বিশ্ববিদ্যালয়ের অফিশিয়াল ভর্তি লিংক, ক্যালেন্ডার, GPA যোগ্যতা, ক্ল্যাশ অ্যালার্ট ও আইডি/পাসওয়ার্ড ভল্ট", "Official links, visual exam calendar, GPA eligibility checker, clash detector & personal credential vault"),
        lblAutoSyncSaved: t("অটো-সেভ চালু", "Auto-Saved"),
        lblSmartParserBtn: t("স্মার্ট সার্কুলার পার্সার", "Smart Notice Parser"),
        lblAddUniBtn: t("নতুন তথ্য যোগ", "Add University"),
        lblExportCsvBtn: t("CSV ডাউনলোড", "Export CSV"),
        navTabDir: t("সকল বিশ্ববিদ্যালয়", "All Universities"),
        navTabTime: t("ক্যালেন্ডার ও ক্ল্যাশ অ্যালার্ট", "Calendar & Clashes"),
        navTabElig: t("GPA যোগ্যতা যাচাই", "GPA Eligibility"),
        navTabTargets: t("টার্গেট ও ফি ক্যালকুলেটর", "Targets & Fee Calc"),
        navTabCreds: t("আইডি ও পাসওয়ার্ড ভল্ট", "ID & Password Vault"),
        navTabGuide: t("ভর্তি প্রস্তুতি চেকলিস্ট", "Prep Checklist"),
        lblHeroCdBadge: t("পরবর্তী ভর্তি পরীক্ষা কাউন্টডাউন", "Next Admission Test Countdown"),
        lblCdDays: t("দিন", "Days"),
        lblCdHours: t("ঘণ্টা", "Hours"),
        lblCdMins: t("মিনিট", "Mins"),
        lblCdSecs: t("সেকেন্ড", "Secs"),
        lblHeroCalBtn: t("ভিজ্যুয়াল ক্যালেন্ডার", "Visual Calendar"),
        lblHeroGpaBtn: t("GPA যোগ্যতা যাচাই", "GPA Eligibility"),
        kpiTitleTotal: t("মোট বিশ্ববিদ্যালয়", "Total Universities"),
        kpiSubTotal: t("সরকারি ৪২ + প্রাইভেট ১০ →", "42 Public + 10 Private →"),
        kpiTitleAnnounced: t("পরীক্ষার তারিখ ঘোষিত", "Exam Date Announced"),
        kpiTitleDeadline: t("ফরম পূরণ তারিখ ঘোষিত", "Form Dates Announced"),
        kpiSubDeadline: t("আবেদনের সময়সীমা দেখুন →", "View Form Deadlines →"),
        kpiTitleApplied: t("আবেদন সম্পন্ন", "Applications Done"),
        kpiTitleTarget: t("টার্গেট ও সম্ভাব্য ফি", "Targets & Est. Fee"),
        kpiSubTarget: t("টার্গেট ও বাজেট দেখুন →", "Manage Targets & Budget →")
      };

      Object.entries(mapText).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      });

      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.placeholder = t(
          "বিশ্ববিদ্যালয়ের নাম দিয়ে খুঁজুন (যেমন: DU, ঢাকা, BUET, IUT, BRAC, NSU, AUST, মেডিকেল, কৃষি)...",
          "Search by university name or short code (e.g., DU, BUET, IUT, Medical, GST, BRAC, NSU)..."
        );
      }
    }

    function renderAll() {
      applyLanguageUI();
      updateKPIs();
      populateCountdownDropdown();
      tickHeroLiveCountdown();
      renderDirectory();
      renderVisualCalendarGrid();
      renderTimelineView();
      renderCredentialsView();
      renderTargetsView();
      renderGuideView();
      renderEligibilityView();
    }

    function switchMainTab(tabName) {
      state.activeMainTab = tabName;
      const views = {
        directory: document.getElementById("viewDirectory"),
        timeline: document.getElementById("viewTimeline"),
        credentials: document.getElementById("viewCredentials"),
        targets: document.getElementById("viewTargets"),
        guide: document.getElementById("viewGuide"),
        eligibility: document.getElementById("viewEligibility")
      };
      Object.entries(views).forEach(([k, el]) => {
        if (el) el.classList.toggle("hidden", k !== tabName);
      });

      document.querySelectorAll(".main-tab-btn").forEach(btn => {
        const isCurrent = btn.getAttribute("data-main-tab") === tabName;
        if (isCurrent) {
          btn.className = "main-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 bg-emerald-500 text-slate-950 shadow-sm";
        } else {
          btn.className = "main-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 text-slate-200 hover:bg-white/10";
        }
      });
    }


    function initAdmissionApp() {
      if (window.__admissionAppInitialized) return;
      window.__admissionAppInitialized = true;
      loadState();
      renderAll();

      window.addEventListener("storage", e => {
        if (e.key === STORAGE_KEY_UNIS_V2 || e.key === STORAGE_KEY_CHECKLIST) {
          loadState();
          renderAll();
        }
      });

      document.querySelectorAll(".main-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const tab = btn.getAttribute("data-main-tab");
          if (tab) switchMainTab(tab);
        });
      });

      document.querySelectorAll(".kpi-card").forEach(card => {
        card.addEventListener("click", () => {
          const kpi = card.getAttribute("data-quick-kpi");
          if (kpi === "target") {
            switchMainTab("targets");
            return;
          }
          switchMainTab("directory");
          state.statusFilter = kpi || "all";
          document.getElementById("statusFilterSelect").value = state.statusFilter;
          renderDirectory();
        });
      });

      const searchInput = document.getElementById("searchInput");
      searchInput.addEventListener("input", e => {
        state.searchQuery = e.target.value;
        renderDirectory();
      });

      document.getElementById("btnClearSearch").addEventListener("click", () => {
        state.searchQuery = "";
        searchInput.value = "";
        renderDirectory();
      });

      document.getElementById("statusFilterSelect").addEventListener("change", e => {
        state.statusFilter = e.target.value;
        renderDirectory();
      });

      document.getElementById("sortSelect").addEventListener("change", e => {
        state.sortBy = e.target.value;
        renderDirectory();
      });

      document.querySelectorAll(".cat-pill").forEach(btn => {
        btn.addEventListener("click", () => {
          state.categoryFilter = btn.getAttribute("data-category") || "all";
          document.querySelectorAll(".cat-pill").forEach(b => {
            const active = b.getAttribute("data-category") === state.categoryFilter;
            b.className = active
              ? "cat-pill px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition bg-emerald-600 text-white shadow-sm"
              : "cat-pill px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition bg-slate-100 text-slate-700 hover:bg-slate-200";
          });
          renderDirectory();
        });
      });

      function resetAllFilters() {
        state.searchQuery = "";
        state.categoryFilter = "all";
        state.statusFilter = "all";
        state.sortBy = "serial";
        searchInput.value = "";
        document.getElementById("statusFilterSelect").value = "all";
        document.getElementById("sortSelect").value = "serial";
        document.querySelectorAll(".cat-pill").forEach(b => {
          const active = b.getAttribute("data-category") === "all";
          b.className = active
            ? "cat-pill px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition bg-emerald-600 text-white shadow-sm"
            : "cat-pill px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition bg-slate-100 text-slate-700 hover:bg-slate-200";
        });
        renderDirectory();
      }

      document.getElementById("btnResetFilters").addEventListener("click", resetAllFilters);
      document.getElementById("btnEmptyReset").addEventListener("click", resetAllFilters);

      const btnCards = document.getElementById("btnViewCards");
      const btnTable = document.getElementById("btnViewTable");
      btnCards.addEventListener("click", () => {
        state.viewMode = "cards";
        btnCards.className = "px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-white text-emerald-700 shadow-sm transition";
        btnTable.className = "px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition";
        renderDirectory();
      });
      btnTable.addEventListener("click", () => {
        state.viewMode = "table";
        btnTable.className = "px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-white text-emerald-700 shadow-sm transition";
        btnCards.className = "px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition";
        renderDirectory();
      });

      const btnClashAll = document.getElementById("btnClashAll");
      const btnClashTargets = document.getElementById("btnClashTargets");
      btnClashAll.addEventListener("click", () => {
        state.clashScope = "all";
        btnClashAll.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-2xs transition";
        btnClashTargets.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-amber-900 border border-amber-300 hover:bg-amber-100 transition";
        renderTimelineView();
      });
      btnClashTargets.addEventListener("click", () => {
        state.clashScope = "targets";
        btnClashTargets.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-2xs transition";
        btnClashAll.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-amber-900 border border-amber-300 hover:bg-amber-100 transition";
        renderTimelineView();
      });

      document.getElementById("credFilterSelect").addEventListener("change", e => {
        state.credFilter = e.target.value;
        renderCredentialsView();
      });
      document.getElementById("credSearchInput").addEventListener("input", e => {
        state.credSearch = e.target.value;
        renderCredentialsView();
      });

      document.body.addEventListener("input", e => {
        const credInput = e.target.closest("[data-cred-field]");
        if (!credInput) return;
        const id = Number(credInput.getAttribute("data-id"));
        const field = credInput.getAttribute("data-cred-field");
        const uni = state.universities.find(u => u.id === id);
        if (uni && field) {
          uni[field] = credInput.value;
          saveUniversities();
          updateKPIs();
        }
      });

      document.getElementById("formIsoDate").addEventListener("change", e => {
        const iso = e.target.value;
        if (iso) {
          document.getElementById("formExamDate").value = isoToBanglaDateText(iso);
        }
      });

      document.body.addEventListener("click", e => {
        const actionBtn = e.target.closest("[data-action]");
        if (!actionBtn) return;
        const action = actionBtn.getAttribute("data-action");

        if (action === "copy-text") {
          const text = actionBtn.getAttribute("data-copy");
          if (text) copyTextSafe(text);
          return;
        }

        const id = Number(actionBtn.getAttribute("data-id"));
        const uni = state.universities.find(u => u.id === id);
        if (!uni) return;

        if (action === "toggle-target") {
          uni.target = !uni.target;
          saveUniversities();
          renderAll();
          showToast(uni.target ? `${uni.name} টার্গেট তালিকায় যুক্ত হয়েছে` : `${uni.name} টার্গেট তালিকা থেকে সরানো হয়েছে`);
        } else if (action === "cycle-status") {
          const order = ["pending", "in_progress", "applied"];
          const nextIdx = (order.indexOf(uni.status) + 1) % order.length;
          uni.status = order[nextIdx];
          saveUniversities();
          renderAll();
          showToast(`${uni.name}: ${(STATUS_META[uni.status] || STATUS_META.pending).label}`);
        } else if (action === "edit-uni") {
          openUniModal(uni.id);
        } else if (action === "open-circular") {
          e.preventDefault();
          openCircularModal(uni.id);
        } else if (action === "toggle-pass-vis") {
          state.revealedPasswords[uni.id] = !state.revealedPasswords[uni.id];
          renderCredentialsView();
        }
      });

      document.body.addEventListener("change", e => {
        const selectEl = e.target.closest("[data-action='select-unit-fee']");
        if (selectEl) {
          const id = Number(selectEl.getAttribute("data-id"));
          const uni = state.universities.find(u => u.id === id);
          if (uni) {
            uni.selectedFee = Number(selectEl.value);
            saveUniversities();
            renderAll();
            showToast(`${uni.name}-এর ফি আপডেট করা হয়েছে`);
          }
          return;
        }

        const checkEl = e.target.closest("[data-checklist-id]");
        if (checkEl) {
          const cid = checkEl.getAttribute("data-checklist-id");
          const item = state.checklist.find(c => c.id === cid);
          if (item) {
            item.done = checkEl.checked;
            saveChecklist();
            renderGuideView();
          }
        }
      });

      document.getElementById("btnSelectTopDated").addEventListener("click", () => {
        const popularIds = [1, 2, 3, 4, 5, 11, 12, 13, 14, 16, 17, 20];
        state.universities.forEach(u => {
          if (popularIds.includes(u.id)) u.target = true;
        });
        saveUniversities();
        renderAll();
        showToast("জনপ্রিয় বিশ্ববিদ্যালয়গুলো টার্গেট তালিকায় যুক্ত হয়েছে!");
      });

      document.getElementById("btnClearTargets").addEventListener("click", () => {
        openConfirmModal(
          "টার্গেট তালিকা খালি করুন",
          "আপনি কি নিশ্চিতভাবে আপনার টার্গেট তালিকা থেকে সব বিশ্ববিদ্যালয় মুছে ফেলতে চান?",
          () => {
            state.universities.forEach(u => { u.target = false; });
            saveUniversities();
            renderAll();
            showToast("টার্গেট তালিকা খালি করা হয়েছে");
          }
        );
      });

      document.getElementById("btnResetAllStorage").addEventListener("click", () => {
        openConfirmModal(
          "ডিফল্ট ডেটায় রিসেট করুন",
          "আপনার করা সব কাস্টম পরিবর্তন রিসেট হয়ে ডিফল্ট তথ্যে ফিরে যাবে। আপনি কি নিশ্চিত?",
          () => {
            try {
              localStorage.removeItem(STORAGE_KEY_UNIS_V2);
              localStorage.removeItem(STORAGE_KEY_UNIS_V1);
            } catch (e) {}
            state.universities = JSON.parse(JSON.stringify(INITIAL_UNIVERSITIES));
            state.checklist = JSON.parse(JSON.stringify(PREP_CHECKLIST_ITEMS));
            saveUniversities();
            saveChecklist();
            renderAll();
            showToast("ডিফল্ট ডেটায় রিসেট সম্পন্ন হয়েছে!");
          }
        );
      });

      document.getElementById("btnCloseCircModal").addEventListener("click", closeCircularModal);
      document.getElementById("btnCancelCircModal").addEventListener("click", closeCircularModal);
      document.getElementById("btnCopyCircUrl").addEventListener("click", () => {
        const val = document.getElementById("circModalUrlInput").value;
        if (val) copyTextSafe(val);
      });
      document.getElementById("btnCircModalEdit").addEventListener("click", () => {
        const id = activeCircUniId;
        closeCircularModal();
        if (id) openUniModal(id);
      });

      document.getElementById("btnAddUniModal").addEventListener("click", () => openUniModal(null));
      document.getElementById("btnCloseModal").addEventListener("click", closeUniModal);
      document.getElementById("btnCancelModal").addEventListener("click", closeUniModal);

      document.getElementById("uniForm").addEventListener("submit", e => {
        e.preventDefault();
        const rawId = document.getElementById("formUniId").value;
        const name = document.getElementById("formUniName").value.trim();
        if (!name) return;

        const category = document.getElementById("formCategory").value;
        const status = document.getElementById("formStatus").value;
        const pickedIso = document.getElementById("formIsoDate").value.trim();
        let examDateText = document.getElementById("formExamDate").value.trim();
        if (pickedIso && !examDateText) {
          examDateText = isoToBanglaDateText(pickedIso);
        }
        const resolvedIso = examDateText ? (pickedIso || parseBanglaDateToIso(examDateText, "9999-12-31")) : "9999-12-31";
        const resolvedMonthGroup = (!examDateText || resolvedIso === "9999-12-31") ? "unpublished" : resolvedIso.slice(0, 7);

        const deadlineText = document.getElementById("formDeadline").value.trim();
        const feeText = document.getElementById("formFeeText").value.trim() || "১০০০";
        const feeAmount = Number(document.getElementById("formFeeAmount").value) || 1000;
        const circularUrl = document.getElementById("formCircularUrl").value.trim() || "https://admission.eis.du.ac.bd";
        const userId = document.getElementById("formUserId").value.trim();
        const userPass = document.getElementById("formUserPass").value.trim();
        const examRoll = document.getElementById("formExamRoll").value.trim();
        const note = document.getElementById("formNote").value.trim();

        if (rawId) {
          const uni = state.universities.find(u => u.id === Number(rawId));
          if (uni) {
            uni.name = name;
            uni.category = category;
            uni.status = status;
            uni.examDateText = examDateText;
            uni.isoExamDate = resolvedIso;
            uni.examMonthGroup = resolvedMonthGroup;
            uni.deadlineText = deadlineText;
            uni.hasDeadline = isDeadlineAnnounced({ deadlineText });
            uni.feeText = feeText;
            uni.defaultFee = feeAmount;
            uni.selectedFee = feeAmount;
            uni.circularUrl = circularUrl;
            uni.userId = userId;
            uni.userPass = userPass;
            uni.examRoll = examRoll;
            uni.note = note;
            uni.customEdited = true;
            showToast(`${name}-এর তারিখ ও তথ্য অটো-সিঙ্ক সম্পন্ন হয়েছে!`);
          }
        } else {
          const newId = state.universities.reduce((max, u) => Math.max(max, u.id), 0) + 1;
          state.universities.push({
            id: newId,
            serialBn: toBengaliNumber(newId),
            name,
            keywords: name.toLowerCase(),
            category,
            examDateText,
            isoExamDate: resolvedIso,
            examMonthGroup: resolvedMonthGroup,
            deadlineText,
            hasDeadline: isDeadlineAnnounced({ deadlineText }),
            feeText,
            defaultFee: feeAmount,
            selectedFee: feeAmount,
            feeOptions: [{ label: `${feeText} - ৳ ${feeAmount}`, amount: feeAmount }],
            circularUrl,
            status,
            target: true,
            userId,
            userPass,
            examRoll,
            note,
            customEdited: true
          });
          showToast(`${name} তালিকায় যুক্ত ও অটো-সিঙ্ক করা হয়েছে!`);
        }

        saveUniversities();
        closeUniModal();
        renderAll();
      });

      document.getElementById("btnConfirmCancel").addEventListener("click", closeConfirmModal);
      document.getElementById("btnConfirmProceed").addEventListener("click", () => {
        if (typeof state.confirmCallback === "function") {
          state.confirmCallback();
        }
        closeConfirmModal();
      });

      document.getElementById("btnExportCsv").addEventListener("click", exportToCsv);

      // Language Toggle (BN / EN)
      document.getElementById("btnLangBn").addEventListener("click", () => {
        state.lang = "bn";
        safeSetStorage("bd_admission_lang", "bn");
        renderAll();
        showToast("ভাষা বাংলায় পরিবর্তন করা হয়েছে");
      });
      document.getElementById("btnLangEn").addEventListener("click", () => {
        state.lang = "en";
        safeSetStorage("bd_admission_lang", "en");
        renderAll();
        showToast("Switched language to English");
      });

      // Smart Circular Parser Modal Listeners
      const sampleNoticeText = "জাহাঙ্গীরনগর বিশ্ববিদ্যালয় (JU) ২০২৬-২০২৭ শিক্ষাবর্ষের ভর্তি পরীক্ষা আগামী ১০ জানুয়ারি থেকে ২১ জানুয়ারি ২০২৭ পর্যন্ত নিজস্ব ক্যাম্পাসে অনুষ্ঠিত হবে। আবেদন ফি ৮০০ টাকা। অনলাইনে ফরম পূরণ চলবে শীঘ্রই।";

      document.getElementById("btnSmartParserModal").addEventListener("click", () => {
        document.getElementById("smartParserModal").classList.remove("hidden");
      });
      document.getElementById("btnCloseSmartModal").addEventListener("click", () => {
        document.getElementById("smartParserModal").classList.add("hidden");
      });
      document.getElementById("btnCancelSmartModal").addEventListener("click", () => {
        document.getElementById("smartParserModal").classList.add("hidden");
      });
      document.getElementById("btnFillSampleModal").addEventListener("click", () => {
        document.getElementById("modalSmartPasteInput").value = sampleNoticeText;
      });
      document.getElementById("btnApplySmartModal").addEventListener("click", () => {
        const raw = document.getElementById("modalSmartPasteInput").value;
        const res = parseSmartCircularNotice(raw);
        const box = document.getElementById("modalParseResultBox");
        box.classList.remove("hidden");
        if (res.ok) {
          box.innerHTML = `<div class="font-bold text-emerald-800">✅ ${t('অটো-আপডেট সম্পন্ন:', 'Auto-Updated:')} ${escapeHtml(getUniDisplayName(res.uni))}</div>
            <div>${t('পরীক্ষার তারিখ:', 'Exam Date:')} <strong>${escapeHtml(res.examDate)}</strong> • ${t('আবেদনের সময়:', 'Deadline:')} <strong>${escapeHtml(res.deadline)}</strong> • ${t('ফি:', 'Fee:')} <strong>৳ ${escapeHtml(res.fee)}</strong></div>`;
          showToast(t(`${res.uni.name}-এর তথ্য স্মার্ট পার্সারের মাধ্যমে অটো-সিঙ্ক হয়েছে!`, `Updated ${getUniDisplayName(res.uni)} via Smart Parser!`));
        } else {
          box.innerHTML = `<div class="font-bold text-rose-700">⚠️ ${escapeHtml(res.message)}</div>`;
        }
      });

      // Live Countdown Interval (1 second)
      if (window.__heroCountdownInterval) clearInterval(window.__heroCountdownInterval);
      window.__heroCountdownInterval = setInterval(tickHeroLiveCountdown, 1000);

      const cdSelect = document.getElementById("countdownTargetSelect");
      if (cdSelect) {
        cdSelect.addEventListener("change", e => {
          state.countdownUniId = Number(e.target.value);
          tickHeroLiveCountdown();
        });
      }

      // Hero Quick Buttons
      document.getElementById("btnHeroViewCalendar").addEventListener("click", () => {
        switchMainTab("timeline");
      });
      document.getElementById("btnHeroCheckGpa").addEventListener("click", () => {
        switchMainTab("eligibility");
      });

      // Visual Calendar Month Switcher
      document.querySelectorAll(".cal-month-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          state.activeCalMonth = btn.getAttribute("data-cal-month") || "2026-12";
          document.querySelectorAll(".cal-month-btn").forEach(b => {
            const active = b.getAttribute("data-cal-month") === state.activeCalMonth;
            b.className = active
              ? "cal-month-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-2xs transition"
              : "cal-month-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition";
          });
          renderVisualCalendarGrid();
        });
      });

      // Eligibility Checker Inputs
      ["eligGroupSelect", "eligSscInput", "eligHscInput", "eligSecondTimeSelect"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener("input", renderEligibilityView);
          el.addEventListener("change", renderEligibilityView);
        }
      });

      // Initialize Live University Notice Ticker & Auto-Sync
      initLiveNotices();

      // Initialize Exclusive HSC 2026 Result Hub & Countdown
      if (typeof initHscResultHub === "function") {
        initHscResultHub();
      }
    }

    let currentNoticeIndex = 0;
    let noticeRotateTimer = null;

    function renderNoticeTicker() {
      const textEl = document.getElementById("liveNoticeTickerText");
      if (!textEl || !window.LIVE_NOTICES_FEED || window.LIVE_NOTICES_FEED.length === 0) return;
      textEl.style.opacity = "0";
      setTimeout(() => {
        textEl.textContent = window.LIVE_NOTICES_FEED[currentNoticeIndex];
        textEl.style.opacity = "1";
      }, 150);
    }

    function initLiveNotices() {
      renderNoticeTicker();

      const prevBtn = document.getElementById("btnPrevNotice");
      const nextBtn = document.getElementById("btnNextNotice");
      const syncBtn = document.getElementById("btnSyncNotices");
      const modalBtn = document.getElementById("btnAllNoticesModal");
      const closeModalBtn = document.getElementById("btnCloseNoticesModal");
      const closeModalBottomBtn = document.getElementById("btnCloseNoticesModalBottom");

      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          const feed = window.LIVE_NOTICES_FEED || [];
          if (feed.length === 0) return;
          currentNoticeIndex = (currentNoticeIndex - 1 + feed.length) % feed.length;
          renderNoticeTicker();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          const feed = window.LIVE_NOTICES_FEED || [];
          if (feed.length === 0) return;
          currentNoticeIndex = (currentNoticeIndex + 1) % feed.length;
          renderNoticeTicker();
        });
      }

      if (noticeRotateTimer) clearInterval(noticeRotateTimer);
      noticeRotateTimer = setInterval(() => {
        const feed = window.LIVE_NOTICES_FEED || [];
        if (feed.length === 0) return;
        currentNoticeIndex = (currentNoticeIndex + 1) % feed.length;
        renderNoticeTicker();
      }, 6000);

      if (syncBtn) {
        syncBtn.addEventListener("click", () => {
          syncOfficialNotices(true);
        });
      }

      if (modalBtn) {
        modalBtn.addEventListener("click", openAllNoticesModal);
      }
      if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeAllNoticesModal);
      }
      if (closeModalBottomBtn) {
        closeModalBottomBtn.addEventListener("click", closeAllNoticesModal);
      }
    }

    function openAllNoticesModal() {
      const modal = document.getElementById("allNoticesModal");
      const listEl = document.getElementById("allNoticesList");
      if (!modal || !listEl) return;

      const feed = window.LIVE_NOTICES_FEED || [];
      listEl.innerHTML = feed.map((notice) => {
        const isJU = notice.includes("জাহাঙ্গীরনগর");
        return `
          <div class="p-3.5 rounded-xl border ${isJU ? 'border-rose-300 bg-rose-50/70 ring-1 ring-rose-200' : 'border-slate-200 bg-slate-50'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div class="flex-1">
              ${isJU ? '<span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-rose-600 text-white mb-1 shadow-2xs">সর্বশেষ ব্রেকিং সার্কুলার</span>' : ''}
              <p class="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${escapeHtml(notice)}</p>
            </div>
            ${isJU ? `<button type="button" data-action="open-circular" data-id="2" class="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs">জাবির পূর্ণ বিবরণ ↗</button>` : ''}
          </div>
        `;
      }).join("");

      modal.classList.remove("hidden");
    }

    function closeAllNoticesModal() {
      const modal = document.getElementById("allNoticesModal");
      if (modal) modal.classList.add("hidden");
    }

    function syncOfficialNotices(showUserToast = false) {
      // 1. Ensure JU has the official announcement (10-21 January 2027)
      const ju = state.universities.find(u => u.id === 2);
      if (ju) {
        ju.examDateText = "১০ - ২১ জানুয়ারি ২০২৭ (নিজ ক্যাম্পাস)";
        ju.isoExamDate = "2027-01-10";
        ju.examMonthGroup = "2027-01";
        ju.deadlineText = "শীঘ্রই ঘোষণা (সম্ভাব্য নভেম্বর-ডিসেম্বর)";
        ju.hasDeadline = true;
        ju.feeText = "A, B, C, D- ৮০০, E- ৭০০, C1/IBA- ৬০০";
        ju.defaultFee = 800;
        ju.feeOptions = [
          { label: "A ইউনিট (বিজ্ঞান ও IIT) - ৳ ৮০০", amount: 800 },
          { label: "D ইউনিট (জীববিজ্ঞান অনুষদ) - ৳ ৮০০", amount: 800 },
          { label: "B ইউনিট (সমাজবিজ্ঞান ও আইন) - ৳ ৮০০", amount: 800 },
          { label: "C ইউনিট (কলা ও মানবিক) - ৳ ৮০০", amount: 800 },
          { label: "E ইউনিট (বিজনেস স্টাডিজ) - ৳ ৭০০", amount: 700 },
          { label: "IBA-JU - ৳ ৬০০", amount: 600 },
          { label: "C1 ইউনিট (নাট্যকলা ও চারুকলা) - ৳ ৬০০", amount: 600 },
          { label: "A + D উভয় ইউনিট - ৳ ১৬০০", amount: 1600 }
        ];
        ju.circularUrl = "https://juniv-admission.org";
      }

      saveUniversities();
      renderAll();
      renderNoticeTicker();

      if (showUserToast) {
        showToast("🔥 জাহাঙ্গীরনগর বিশ্ববিদ্যালয় (JU)-এর ১০-২১ জানুয়ারি ২০২৭ ভর্তি পরীক্ষার তারিখ সফলভাবে সিঙ্ক ও অটো-আপডেট হয়েছে!");
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAdmissionApp);
    } else {
      initAdmissionApp();
    }
  
  app.applyLanguageUI = window.applyLanguageUI = applyLanguageUI;
  app.renderAll = window.renderAll = renderAll;
  app.switchMainTab = window.switchMainTab = switchMainTab;
  app.initAdmissionApp = window.initAdmissionApp = initAdmissionApp;
  app.syncOfficialNotices = window.syncOfficialNotices = syncOfficialNotices;
  app.initLiveNotices = window.initLiveNotices = initLiveNotices;
})(window);
