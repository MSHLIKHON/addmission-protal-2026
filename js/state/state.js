/**
 * state.js
 * Central reactive application state management & LocalStorage persistence.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  let state = {
    universities: [],
    checklist: [],
    lang: safeGetStorage("bd_admission_lang") || "bn",
    activeMainTab: "directory",
    viewMode: "cards",
    searchQuery: "",
    categoryFilter: "all",
    statusFilter: "all",
    sortBy: "serial",
    clashScope: "all",
    credFilter: "all",
    credSearch: "",
    activeCalMonth: "2026-12",
    countdownUniId: 9,
    revealedPasswords: {},
    confirmCallback: null
  };

  function loadState() {
    const baseList = JSON.parse(JSON.stringify(INITIAL_UNIVERSITIES));
    const savedV2 = safeGetStorage(STORAGE_KEY_UNIS_V2);
    const savedV1 = safeGetStorage(STORAGE_KEY_UNIS_V1);
    const savedSource = Array.isArray(savedV2) && savedV2.length > 0 ? savedV2 : (Array.isArray(savedV1) ? savedV1 : []);

    if (savedSource.length > 0) {
      const byId = {};
      savedSource.forEach(item => { byId[item.id] = item; });
      baseList.forEach(u => {
        const prev = byId[u.id];
        if (prev) {
          u.status = prev.status || u.status;
          u.target = Boolean(prev.target);
          u.selectedFee = prev.selectedFee ?? u.defaultFee;
          u.userId = prev.userId || "";
          u.userPass = prev.userPass || "";
          u.examRoll = prev.examRoll || "";
          u.note = prev.note || "";
          if (prev.eligibility) {
            u.eligibility = prev.eligibility;
          }
          if (prev.customEdited && prev.isoExamDate && prev.isoExamDate !== "9999-12-31") {
            u.examDateText = prev.examDateText;
            u.isoExamDate = prev.isoExamDate;
            u.examMonthGroup = prev.examMonthGroup || "unpublished";
            u.deadlineText = prev.deadlineText;
            u.hasDeadline = isDeadlineAnnounced(prev);
            u.feeText = prev.feeText || u.feeText;
            u.defaultFee = prev.defaultFee || u.defaultFee;
            u.circularUrl = prev.circularUrl || u.circularUrl;
            u.customEdited = true;
          }
        }
      });

      // Backward compatible custom universities: check isCustom flag or legacy id > 52
      savedSource.filter(item => Boolean(item.isCustom) || item.id > 52).forEach(customUni => {
        customUni.isCustom = true;
        if (!customUni.eligibility) {
          customUni.eligibility = {
            minSsc: 2.5, minHsc: 2.5, minTotal: 6.0, secondTimer: true,
            groups: ["science", "humanities", "business"],
            notes: "অফিসিয়াল সার্কুলার দেখুন",
            source: customUni.circularUrl || null,
            verifiedOn: null
          };
        }
        baseList.push(customUni);
      });
    }

    state.universities = baseList;

    const savedChecklist = safeGetStorage(STORAGE_KEY_CHECKLIST);
    if (Array.isArray(savedChecklist) && savedChecklist.length > 0) {
      state.checklist = savedChecklist;
    } else {
      state.checklist = JSON.parse(JSON.stringify(PREP_CHECKLIST_ITEMS));
    }
  }

  function saveUniversities() {
    const vc = app.VaultCrypto;
    let listToSave = state.universities;
    if (vc && vc.isVaultConfigured() && vc.getActivePassphrase()) {
      listToSave = state.universities.map(u => {
        if (u.userPass && !u.userPass.startsWith(vc.PREFIX_ENC)) {
          const clone = Object.assign({}, u);
          clone.userPass = u.__encPass || u.userPass;
          return clone;
        }
        return u;
      });
    }

    safeSetStorage(STORAGE_KEY_UNIS_V2, listToSave);
    const badge = document.getElementById("autoSyncBadge");
    if (badge) {
      badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-300"></span><span>অটো-সিঙ্ক সম্পন্ন ✓</span>`;
    }
  }

  function saveChecklist() {
    safeSetStorage(STORAGE_KEY_CHECKLIST, state.checklist);
  }

  app.state = window.state = state;
  app.loadState = window.loadState = loadState;
  app.saveUniversities = window.saveUniversities = saveUniversities;
  app.saveChecklist = window.saveChecklist = saveChecklist;
})(window);
