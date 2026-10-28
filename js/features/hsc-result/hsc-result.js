/**
 * hsc-result.js
 * Exclusive HSC 2026 Result Live Countdown, Online Portals, Smart SMS Generator & Admission Bridge.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  // Board codes for Teletalk SMS
  const BOARD_CODES = [
    { code: "DHA", nameBn: "ঢাকা (Dhaka)", prefix: "HSC" },
    { code: "RAJ", nameBn: "রাজশাহী (Rajshahi)", prefix: "HSC" },
    { code: "COM", nameBn: "কুমিল্লা (Cumilla)", prefix: "HSC" },
    { code: "JES", nameBn: "যশোর (Jashore)", prefix: "HSC" },
    { code: "CHI", nameBn: "চট্টগ্রাম (Chattogram)", prefix: "HSC" },
    { code: "BAR", nameBn: "বরিশাল (Barishal)", prefix: "HSC" },
    { code: "SYL", nameBn: "সিলেট (Sylhet)", prefix: "HSC" },
    { code: "DIN", nameBn: "দিনাজপুর (Dinajpur)", prefix: "HSC" },
    { code: "MYM", nameBn: "ময়মনসিংহ (Mymensingh)", prefix: "HSC" },
    { code: "MAD", nameBn: "মাদ্রাসা (Madrasah / Alim)", prefix: "ALIM" },
    { code: "TEC", nameBn: "কারিগরি (Technical / BTEB)", prefix: "HSC" }
  ];

  // Target HSC Result Date: 31 October 2026, 11:00 AM
  const HSC_RESULT_TARGET = new Date(2026, 9, 31, 11, 0, 0);

  function getHscReferenceTime() {
    const now = new Date();
    if (now.getFullYear() === 2026) {
      return now;
    }
    // Fallback simulation reference for testing outside 2026
    return new Date(2026, 9, 28, 22, 40, 0);
  }

  function tickHscLiveCountdown() {
    const dEl = document.getElementById("hscCdDays");
    const hEl = document.getElementById("hscCdHours");
    const mEl = document.getElementById("hscCdMins");
    const sEl = document.getElementById("hscCdSecs");
    const statusEl = document.getElementById("hscCdStatusBadge");

    if (!dEl || !hEl || !mEl || !sEl) return;

    const refNow = getHscReferenceTime();
    const diffMs = HSC_RESULT_TARGET - refNow;

    if (diffMs <= 0) {
      dEl.textContent = "০০";
      hEl.textContent = "০০";
      mEl.textContent = "০০";
      sEl.textContent = "০০";
      if (statusEl) {
        statusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span><span>🎉 ফলাফল প্রকাশিত হয়েছে! এখনই দেখুন</span>`;
        statusEl.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 animate-pulse";
      }
      return;
    }

    const totalSecs = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    dEl.textContent = toBengaliNumber(String(days).padStart(2, "0"));
    hEl.textContent = toBengaliNumber(String(hours).padStart(2, "0"));
    mEl.textContent = toBengaliNumber(String(mins).padStart(2, "0"));
    sEl.textContent = toBengaliNumber(String(secs).padStart(2, "0"));
  }

  function updateSmartSmsPreview() {
    const boardSelect = document.getElementById("smsBoardSelect");
    const rollInput = document.getElementById("smsRollInput");
    const yearInput = document.getElementById("smsYearInput");
    const previewEl = document.getElementById("smsPreviewText");
    const directLink = document.getElementById("btnDirectSmsSend");

    if (!boardSelect || !rollInput || !previewEl) return;

    const selectedCode = boardSelect.value || "DHA";
    const boardObj = BOARD_CODES.find(b => b.code === selectedCode) || BOARD_CODES[0];
    const prefix = boardObj.prefix || "HSC";
    const roll = (rollInput.value || "123456").trim();
    const year = (yearInput ? yearInput.value : "2026").trim() || "2026";

    const formattedSms = `${prefix} ${selectedCode} ${roll} ${year}`;
    previewEl.textContent = formattedSms;

    if (directLink) {
      directLink.href = `sms:16222?body=${encodeURIComponent(formattedSms)}`;
    }
  }

  function openHscResultModal(defaultTab = "servers") {
    const modal = document.getElementById("hscResultModal");
    if (!modal) return;
    switchHscModalTab(defaultTab);
    updateSmartSmsPreview();
    modal.classList.remove("hidden");
  }

  function closeHscResultModal() {
    const modal = document.getElementById("hscResultModal");
    if (modal) modal.classList.add("hidden");
  }

  function switchHscModalTab(tabId) {
    const tabs = ["servers", "sms", "guide", "bridge"];
    tabs.forEach(t => {
      const pane = document.getElementById(`hscTabPane_${t}`);
      const btn = document.getElementById(`hscTabBtn_${t}`);
      if (pane) pane.classList.toggle("hidden", t !== tabId);
      if (btn) {
        if (t === tabId) {
          btn.className = "hsc-tab-btn px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 shadow-sm transition";
        } else {
          btn.className = "hsc-tab-btn px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition";
        }
      }
    });
  }

  function initHscResultHub() {
    // Live timer
    if (window.__hscResultCountdownInterval) clearInterval(window.__hscResultCountdownInterval);
    window.__hscResultCountdownInterval = setInterval(tickHscLiveCountdown, 1000);
    tickHscLiveCountdown();

    // Modal open buttons
    const btnOpen = document.getElementById("btnOpenHscResultModal");
    const btnSms = document.getElementById("btnHscQuickSms");
    const btnCheck = document.getElementById("btnHscQuickCheck");
    const btnBridge = document.getElementById("btnHscQuickBridge");

    if (btnOpen) btnOpen.addEventListener("click", () => openHscResultModal("servers"));
    if (btnSms) btnSms.addEventListener("click", () => openHscResultModal("sms"));
    if (btnCheck) btnCheck.addEventListener("click", () => openHscResultModal("servers"));
    if (btnBridge) btnBridge.addEventListener("click", () => openHscResultModal("bridge"));

    // Modal close buttons
    const btnClose = document.getElementById("btnCloseHscModal");
    const btnCloseBottom = document.getElementById("btnCloseHscModalBottom");
    if (btnClose) btnClose.addEventListener("click", closeHscResultModal);
    if (btnCloseBottom) btnCloseBottom.addEventListener("click", closeHscResultModal);

    // Modal Tab buttons
    ["servers", "sms", "guide", "bridge"].forEach(tabKey => {
      const btn = document.getElementById(`hscTabBtn_${tabKey}`);
      if (btn) {
        btn.addEventListener("click", () => switchHscModalTab(tabKey));
      }
    });

    // Populate SMS boards dropdown
    const boardSelect = document.getElementById("smsBoardSelect");
    if (boardSelect) {
      boardSelect.innerHTML = BOARD_CODES.map(b => `<option value="${b.code}">${b.nameBn}</option>`).join("");
      boardSelect.addEventListener("change", updateSmartSmsPreview);
    }

    const rollInput = document.getElementById("smsRollInput");
    if (rollInput) {
      rollInput.addEventListener("input", updateSmartSmsPreview);
    }

    // Copy SMS button
    const btnCopySms = document.getElementById("btnCopySmsFormat");
    if (btnCopySms) {
      btnCopySms.addEventListener("click", () => {
        const previewEl = document.getElementById("smsPreviewText");
        if (previewEl && navigator.clipboard) {
          navigator.clipboard.writeText(previewEl.textContent.trim()).then(() => {
            showToast("✅ এসএমএস ফরম্যাট ক্লিপবোর্ডে কপি হয়েছে! ১৬২২২ নম্বরে পাঠিয়ে দিন।");
          }).catch(() => {
            showToast("টেক্সট সিলেক্ট করে কপি করুন: " + previewEl.textContent);
          });
        }
      });
    }

    // Admission Bridge Submit
    const btnApplyBridge = document.getElementById("btnApplyBridgeGpa");
    if (btnApplyBridge) {
      btnApplyBridge.addEventListener("click", () => {
        const hscVal = document.getElementById("bridgeHscGpaInput")?.value;
        const sscVal = document.getElementById("bridgeSscGpaInput")?.value;
        const groupVal = document.getElementById("bridgeGroupSelect")?.value;

        if (hscVal && document.getElementById("eligHscInput")) {
          document.getElementById("eligHscInput").value = hscVal;
        }
        if (sscVal && document.getElementById("eligSscInput")) {
          document.getElementById("eligSscInput").value = sscVal;
        }
        if (groupVal && document.getElementById("eligGroupSelect")) {
          document.getElementById("eligGroupSelect").value = groupVal;
        }

        closeHscResultModal();
        if (typeof switchMainTab === "function") {
          switchMainTab("eligibility");
        }
        if (typeof renderEligibilityView === "function") {
          renderEligibilityView();
        }
        showToast("🎯 আপনার জিপিএ অনুযায়ী সকল বিশ্ববিদ্যালয়ের ভর্তি যোগ্যতা লোড হয়েছে!");
      });
    }
  }

  app.BOARD_CODES = window.BOARD_CODES = BOARD_CODES;
  app.tickHscLiveCountdown = window.tickHscLiveCountdown = tickHscLiveCountdown;
  app.openHscResultModal = window.openHscResultModal = openHscResultModal;
  app.closeHscResultModal = window.closeHscResultModal = closeHscResultModal;
  app.initHscResultHub = window.initHscResultHub = initHscResultHub;
})(window);
