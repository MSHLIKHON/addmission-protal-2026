/**
 * credentials.js
 * Applicant credentials vault for User ID, Password, and Exam Roll tracking.
 * Includes optional WebCrypto AES-GCM + PBKDF2 passphrase encryption at rest,
 * and clear one-time security disclosures.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  function renderVaultSecurityHeader() {
    const isEn = Boolean(app.state && app.state.lang === "en");
    const vc = app.VaultCrypto;
    if (!vc) return "";

    const isConfigured = vc.isVaultConfigured();
    const isUnlocked = vc.isVaultUnlocked();
    const hasWarned = vc.hasSeenVaultWarning();

    let bannerHtml = "";

    // 1. One-time unencrypted warning if not configured and not dismissed
    if (!isConfigured && !hasWarned) {
      bannerHtml += `
        <div id="vaultWarningBanner" class="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start justify-between gap-3 text-xs text-amber-900 shadow-2xs">
          <div class="flex items-start gap-2">
            <span class="text-base shrink-0">⚠️</span>
            <div>
              <p class="font-bold">${isEn ? "Security Notice:" : "নিরাপত্তা সতর্কতা:"}</p>
              <p class="mt-0.5">${isEn ? "Passwords are saved only on this device, unencrypted." : "পাসওয়ার্ড শুধু এই ডিভাইসে সংরক্ষিত, এনক্রিপ্টেড নয়।"}</p>
              <p class="text-[11px] text-amber-700 mt-1">${isEn ? "You can enable optional AES-256 passphrase encryption anytime using the button below." : "আপনি চাইলে নিচের বাটনে ক্লিক করে ঐচ্ছিক AES-256 পাসফ্রেজ এনক্রিপশন সক্রিয় করতে পারেন।"}</p>
            </div>
          </div>
          <button type="button" id="btnDismissVaultWarn" class="text-amber-800 hover:text-amber-950 font-bold px-2 py-1 rounded-lg hover:bg-amber-100 text-sm leading-none shrink-0" title="${isEn ? 'Dismiss' : 'বন্ধ করুন'}">
            ✕
          </button>
        </div>
      `;
    }

    // 2. Vault status & action card
    if (!isConfigured) {
      bannerHtml += `
        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold shrink-0">🔑</span>
            <div>
              <p class="font-bold text-slate-900">${isEn ? "Optional Vault Passphrase Encryption" : "ঐচ্ছিক ভল্ট পাসফ্রেজ এনক্রিপশন (WebCrypto AES-256)"}</p>
              <p class="text-slate-500 text-[11px]">${isEn ? "Encrypt your saved passwords at rest with your own master passphrase." : "আপনার পাসওয়ার্ডগুলো ব্রাউজারে এনক্রিপ্টেড রাখতে একটি নিজস্ব পাসফ্রেজ সেট করুন।"}</p>
            </div>
          </div>
          <button type="button" id="btnSetupVaultPass" class="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 transition">
            ${isEn ? "🔐 Set Vault Passphrase" : "🔐 পাসফ্রেজ সেট করুন"}
          </button>
        </div>
      `;
    } else if (!isUnlocked) {
      bannerHtml += `
        <div class="p-4 bg-amber-500/10 border border-amber-300 rounded-2xl space-y-3">
          <div class="flex items-center gap-2 text-amber-900">
            <span class="text-lg">🔒</span>
            <div>
              <p class="text-xs sm:text-sm font-bold">${isEn ? "Credentials Vault is Locked" : "ভল্ট লক করা আছে (AES-256 এনক্রিপ্টেড)"}</p>
              <p class="text-[11px] text-amber-800">${isEn ? "Enter your master passphrase to decrypt and view saved passwords." : "সংরক্ষিত পাসওয়ার্ড দেখতে ও সম্পাদনা করতে ভল্ট পাসফ্রেজ লিখুন।"}</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="password"
              id="txtVaultUnlockPass"
              placeholder="${isEn ? 'Enter vault passphrase...' : 'ভল্ট পাসফ্রেজ লিখুন...'}"
              class="flex-1 px-3 py-2 rounded-xl border border-amber-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
            <button type="button" id="btnUnlockVault" class="px-4 py-2 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs transition">
              ${isEn ? "Unlock Vault" : "ভল্ট আনলক করুন"}
            </button>
          </div>
          <p id="vaultUnlockError" class="text-xs text-rose-600 font-bold hidden"></p>
        </div>
      `;
    } else {
      bannerHtml += `
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">🔓</span>
            <div>
              <span class="font-bold text-emerald-950">${isEn ? "Vault Unlocked (AES-256 Encrypted)" : "ভল্ট আনলকড (AES-256 সুরক্ষিত)"}</span>
              <span class="text-[11px] text-emerald-700 block sm:inline sm:ml-1">${isEn ? "Passwords are encrypted at rest." : "— পাসওয়ার্ড সুরক্ষিতভাবে এনক্রিপ্টেড থাকে।"}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button type="button" id="btnLockVaultNow" class="px-3 py-1.5 rounded-xl font-bold text-xs bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition">
              ${isEn ? "Lock Vault" : "ভল্ট লক করুন"}
            </button>
            <button type="button" id="btnResetVaultPass" class="px-3 py-1.5 rounded-xl font-bold text-xs text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition">
              ${isEn ? "Remove Passphrase" : "পাসফ্রেজ মুছুন"}
            </button>
          </div>
        </div>
      `;
    }

    return bannerHtml;
  }

  function renderCredentialsView() {
    const isEn = Boolean(app.state && app.state.lang === "en");
    const vc = app.VaultCrypto;
    const isLocked = Boolean(vc && vc.isVaultConfigured() && !vc.isVaultUnlocked());

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
    if (!grid) return;

    const securityHeader = renderVaultSecurityHeader();

    let listHtml = "";
    if (list.length === 0) {
      listHtml = `
        <div class="col-span-1 md:col-span-2 text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <p class="text-base font-bold text-slate-700">${isEn ? "No university credentials found" : "কোনো বিশ্ববিদ্যালয়ের তথ্য পাওয়া যায়নি"}</p>
          <p class="text-xs text-slate-500 mt-1">${isEn ? "Change filter to search or save User ID and Password." : "ফিল্টার পরিবর্তন করে যেকোনো বিশ্ববিদ্যালয়ের ইউজার আইডি ও পাসওয়ার্ড সংরক্ষণ করুন।"}</p>
        </div>
      `;
    } else {
      listHtml = list.map(u => {
        const showPass = Boolean(state.revealedPasswords[u.id]);
        const saved = hasSavedCredentials(u);
        const uniName = getUniDisplayName(u);

        let passDisplayValue = u.userPass || "";
        if (isLocked && passDisplayValue) {
          passDisplayValue = "••••••••";
        }

        return `
          <div class="p-4 rounded-2xl border ${saved ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/60'} space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="w-6 h-6 rounded-md bg-white text-slate-700 text-xs font-bold flex items-center justify-center border border-slate-200">${escapeHtml(u.serialBn || toBengaliNumber(u.id))}</span>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900">${escapeHtml(uniName)}</h3>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">${isEn ? 'Exam:' : 'পরীক্ষা:'} ${isExamAnnounced(u) ? escapeHtml(u.examDateText) : '—'} • ${isEn ? 'Deadline:' : 'ফরম:'} ${isDeadlineAnnounced(u) ? escapeHtml(u.deadlineText) : '—'}</p>
              </div>
              <a href="${escapeHtml(u.circularUrl)}" target="_blank" rel="noopener noreferrer" data-action="open-circular" data-id="${u.id}" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 shrink-0">
                ${isEn ? 'Portal ↗' : 'ভর্তি সাইট ↗'}
              </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">${isEn ? 'User ID / App ID' : 'User ID / আবেদন আইডি'}</label>
                <div class="flex items-center gap-1">
                  <input
                    type="text"
                    data-cred-field="userId"
                    data-id="${u.id}"
                    value="${escapeHtml(u.userId || '')}"
                    placeholder="${isEn ? 'Enter User ID' : 'ইউজার আইডি লিখুন'}"
                    class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                  ${u.userId ? `<button type="button" data-action="copy-text" data-copy="${escapeHtml(u.userId)}" title="${isEn ? 'Copy' : 'কপি'}" class="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold">📋</button>` : ''}
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">${isEn ? 'Password / PIN' : 'Password / পিন'}</label>
                <div class="flex items-center gap-1">
                  <input
                    type="${(showPass && !isLocked) ? 'text' : 'password'}"
                    data-cred-field="userPass"
                    data-id="${u.id}"
                    ${isLocked ? 'readonly' : ''}
                    value="${escapeHtml(passDisplayValue)}"
                    placeholder="${isLocked ? (isEn ? 'Locked' : 'লক করা') : (isEn ? 'Enter Password' : 'পাসওয়ার্ড লিখুন')}"
                    class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 ${isLocked ? 'bg-slate-100 cursor-not-allowed' : ''}"
                  />
                  ${!isLocked ? `<button type="button" data-action="toggle-pass-vis" data-id="${u.id}" title="${isEn ? 'Show/Hide' : 'দেখুন/লুকান'}" class="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold">${showPass ? '🙈' : '👁️'}</button>` : ''}
                  ${(!isLocked && u.userPass) ? `<button type="button" data-action="copy-text" data-copy="${escapeHtml(u.userPass)}" title="${isEn ? 'Copy' : 'কপি'}" class="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold">📋</button>` : ''}
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">${isEn ? 'Exam Roll & Center' : 'ভর্তি রোল ও কেন্দ্র'}</label>
                <input
                  type="text"
                  data-cred-field="examRoll"
                  data-id="${u.id}"
                  value="${escapeHtml(u.examRoll || '')}"
                  placeholder="${isEn ? 'Roll & Center' : 'রোল ও কেন্দ্রের নাম'}"
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
                placeholder="${isEn ? 'Payment Transaction ID or personal notes (auto-saved)...' : 'পেমেন্ট ট্রানজেকশন আইডি বা ব্যক্তিগত নোট লিখুন (স্বয়ংক্রিয়ভাবে সেভ হবে)...'}"
                class="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2"
              />
            </div>
          </div>
        `;
      }).join("");
    }

    grid.innerHTML = `
      <div class="col-span-1 md:col-span-2 space-y-3 mb-2">
        ${securityHeader}
      </div>
      ${listHtml}
    `;

    // Attach event listeners for security header actions
    document.getElementById("btnDismissVaultWarn")?.addEventListener("click", () => {
      if (app.VaultCrypto) app.VaultCrypto.markVaultWarningSeen();
      renderCredentialsView();
    });

    document.getElementById("btnSetupVaultPass")?.addEventListener("click", () => {
      openVaultPassModal("setup");
    });

    document.getElementById("btnUnlockVault")?.addEventListener("click", async () => {
      const input = document.getElementById("txtVaultUnlockPass");
      const errEl = document.getElementById("vaultUnlockError");
      const pass = input ? input.value : "";
      if (!pass) return;

      const ok = await app.VaultCrypto.unlockVault(pass);
      if (ok) {
        // Decrypt in-memory passwords
        await decryptAllMemoryPasswords(pass);
        showToast(isEn ? "Vault unlocked successfully!" : "ভল্ট সফলভাবে আনলক করা হয়েছে!");
        renderCredentialsView();
      } else {
        if (errEl) {
          errEl.textContent = isEn ? "Incorrect passphrase. Please try again." : "ভুল পাসফ্রেজ! আবার চেষ্টা করুন।";
          errEl.classList.remove("hidden");
        }
      }
    });

    document.getElementById("btnLockVaultNow")?.addEventListener("click", () => {
      app.VaultCrypto.lockVault();
      loadState(); // Reload to revert in-memory decrypted passwords
      showToast(isEn ? "Vault locked." : "ভল্ট লক করা হয়েছে।");
      renderCredentialsView();
    });

    document.getElementById("btnResetVaultPass")?.addEventListener("click", () => {
      openVaultPassModal("remove");
    });
  }

  async function decryptAllMemoryPasswords(passphrase) {
    if (!app.VaultCrypto) return;
    for (const u of state.universities) {
      if (u.userPass && u.userPass.startsWith(app.VaultCrypto.PREFIX_ENC)) {
        try {
          u.userPass = await app.VaultCrypto.decryptString(u.userPass, passphrase);
        } catch (e) {
          // ignore individual decryption errors
        }
      }
    }
  }

  function openVaultPassModal(mode = "setup") {
    const modal = document.getElementById("vaultPassModal");
    if (!modal) return;
    const isEn = Boolean(app.state && app.state.lang === "en");
    const titleEl = document.getElementById("vaultModalTitle");
    const descEl = document.getElementById("vaultModalDesc");
    const inputContainer = document.getElementById("vaultPassInputContainer");
    const confirmBtn = document.getElementById("btnConfirmVaultPass");

    modal.dataset.mode = mode;

    if (mode === "setup") {
      if (titleEl) titleEl.textContent = isEn ? "Set Vault Passphrase" : "ভল্ট পাসফ্রেজ সেট করুন";
      if (descEl) descEl.textContent = isEn
        ? "Enter a master passphrase (min 4 characters). Your passwords will be encrypted with WebCrypto AES-256 before saving to local storage."
        : "একটি মাস্টার পাসফ্রেজ (ন্যূনতম ৪ অক্ষর) লিখুন। আপনার পাসওয়ার্ডগুলো WebCrypto AES-256 দিয়ে এনক্রিপ্ট হয়ে ব্রাউজারে সংরক্ষিত থাকবে।";
      if (inputContainer) inputContainer.classList.remove("hidden");
      if (confirmBtn) confirmBtn.textContent = isEn ? "Save & Encrypt" : "সংরক্ষণ ও এনক্রিপ্ট করুন";
    } else {
      if (titleEl) titleEl.textContent = isEn ? "Remove Vault Passphrase" : "ভল্ট পাসফ্রেজ মুছুন";
      if (descEl) descEl.textContent = isEn
        ? "Are you sure you want to remove the master passphrase? Future passwords will be stored on this device without encryption."
        : "আপনি কি নিশ্চিতভাবে ভল্ট পাসফ্রেজ মুছে ফেলতে চান? এরপর থেকে পাসওয়ার্ড আন-এনক্রিপ্টেড অবস্থায় সংরক্ষিত থাকবে।";
      if (inputContainer) inputContainer.classList.add("hidden");
      if (confirmBtn) confirmBtn.textContent = isEn ? "Confirm Remove" : "হ্যাঁ, মুছে ফেলুন";
    }

    modal.classList.remove("hidden");
  }

  function closeVaultPassModal() {
    const modal = document.getElementById("vaultPassModal");
    if (modal) modal.classList.add("hidden");
  }

  app.renderCredentialsView = window.renderCredentialsView = renderCredentialsView;
  app.openVaultPassModal = window.openVaultPassModal = openVaultPassModal;
  app.closeVaultPassModal = window.closeVaultPassModal = closeVaultPassModal;
})(window);
