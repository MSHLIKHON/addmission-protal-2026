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

  function getHscTargetDate() {
    const raw = app.HSC_RESULT_TARGET_DATE || "2026-10-31T11:00:00+06:00";
    return new Date(raw);
  }

  function getHscReferenceTime() {
    // Hidden demo mode strictly behind ?demo=1 for testing
    try {
      if (typeof window !== "undefined" && window.location) {
        const params = new URLSearchParams(window.location.search);
        if (params.get("demo") === "1") {
          return new Date(getHscTargetDate().getTime() - (2 * 3600 * 1000 + 45 * 60 * 1000));
        }
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
    return new Date();
  }

  function isHscBannerDismissed() {
    try {
      const key = app.STORAGE_KEY_HSC_BANNER_DISMISSED || "bd_hsc_banner_dismissed_v1";
      return localStorage.getItem(key) === "true";
    } catch (e) {
      return false;
    }
  }

  function dismissHscBanner() {
    try {
      const key = app.STORAGE_KEY_HSC_BANNER_DISMISSED || "bd_hsc_banner_dismissed_v1";
      localStorage.setItem(key, "true");
    } catch (e) {
      // Ignore storage errors
    }
    const banner = document.getElementById("hscResultBanner");
    if (banner) {
      banner.classList.add("hidden");
    }
  }

  function tickHscLiveCountdown() {
    const banner = document.getElementById("hscResultBanner");
    if (!banner) return;

    if (isHscBannerDismissed()) {
      banner.classList.add("hidden");
      return;
    }

    const refNow = getHscReferenceTime();
    const target = getHscTargetDate();
    const diffMs = target - refNow;

    if (diffMs <= 0) {
      // Result time has passed: collapse into a slim, dismissible strip
      if (!banner.dataset.collapsed) {
        banner.dataset.collapsed = "true";
        banner.className = "relative overflow-hidden rounded-xl px-4 py-2.5 text-white shadow-sm border border-emerald-500/40 my-3";
        banner.style.background = "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)";
        const isEn = Boolean(app.state && app.state.lang === "en");
        banner.innerHTML = `
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-base sm:text-lg">🎉</span>
              <span class="text-xs sm:text-sm font-bold truncate">${isEn ? "HSC 2026 Results Published — View Result & Marksheet" : "ফলাফল প্রকাশিত — রেজাল্ট দেখুন"}</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button id="btnSlimOpenHscModal" type="button" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-xs">
                ${isEn ? "View Result ↗" : "রেজাল্ট দেখুন ↗"}
              </button>
              <button id="btnDismissHscBanner" type="button" aria-label="${isEn ? 'Dismiss banner' : 'ব্যানার বন্ধ করুন'}" class="text-slate-300 hover:text-white px-2 py-1 text-sm font-bold transition">
                ✕
              </button>
            </div>
          </div>
        `;
        document.getElementById("btnSlimOpenHscModal")?.addEventListener("click", () => openHscResultModal("servers"));
        document.getElementById("btnDismissHscBanner")?.addEventListener("click", dismissHscBanner);
      }
      return;
    }

    // Active countdown
    const dEl = document.getElementById("hscCdDays");
    const hEl = document.getElementById("hscCdHours");
    const mEl = document.getElementById("hscCdMins");
    const sEl = document.getElementById("hscCdSecs");
    if (!dEl || !hEl || !mEl || !sEl) return;

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
