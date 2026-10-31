/**
 * backup.js
 * Comprehensive JSON backup & restore utility for all user data:
 * targets, application statuses, personal notes, credentials, prep checklist, and marks planner.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  function exportBackupJson() {
    const isEn = Boolean(app.state && app.state.lang === "en");
    const backupData = {
      app: "AdmissionPortal2026",
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      universities: app.state.universities || [],
      checklist: app.state.checklist || [],
      marks: app.marksState || {},
      lang: app.state.lang || "bn",
      vaultConfig: localStorage.getItem("bd_admission_vault_config_v1") || null
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admission_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(isEn ? "Backup JSON file downloaded successfully!" : "সম্পূর্ণ ব্যাকআপ ফাইল ডাউনলোড সম্পন্ন হয়েছে!");
  }

  function triggerImportJson() {
    const input = document.getElementById("fileInputRestoreJson");
    if (input) {
      input.value = "";
      input.click();
    }
  }

  function handleImportFile(file) {
    if (!file) return;
    const isEn = Boolean(app.state && app.state.lang === "en");

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed || (!parsed.universities && !parsed.app)) {
          throw new Error("Invalid backup JSON format");
        }

        // Confirmation modal before overwriting
        const confirmTitle = isEn ? "Confirm Restore" : "ব্যাকআপ রিস্টোর নিশ্চিতকরণ";
        const confirmMsg = isEn
          ? "Warning: Restoring this backup will replace your current targets, notes, and marks data. Do you want to proceed?"
          : "⚠️ সতর্কবার্তা: ব্যাকআপ রিস্টোর করলে বর্তমানের সকল সংরক্ষিত তথ্য প্রতিস্থাপিত হবে। আপনি কি চালিয়ে যেতে চান?";

        if (typeof openConfirmModal === "function") {
          openConfirmModal(confirmTitle, confirmMsg, () => {
            applyRestoredData(parsed);
          });
        } else if (window.confirm(confirmMsg)) {
          applyRestoredData(parsed);
        }
      } catch (err) {
        alert(isEn ? "Error reading backup file. Please ensure it is a valid JSON file." : "ব্যাকআপ ফাইলটি সঠিক নয়। অনুগ্রহ করে সঠিক JSON ফাইল নির্বাচন করুন।");
      }
    };
    reader.readAsText(file);
  }

  function applyRestoredData(data) {
    const isEn = Boolean(app.state && app.state.lang === "en");
    if (Array.isArray(data.universities)) {
      safeSetStorage(app.STORAGE_KEY_UNIS_V2 || "bd_admission_2026_unis_v2", data.universities);
    }
    if (Array.isArray(data.checklist)) {
      safeSetStorage(app.STORAGE_KEY_CHECKLIST || "bd_admission_2026_checklist_v1", data.checklist);
    }
    if (data.marks && typeof data.marks === "object") {
      safeSetStorage("bd_admission_marks_v1", data.marks);
    }
    if (data.vaultConfig) {
      localStorage.setItem("bd_admission_vault_config_v1", data.vaultConfig);
    }
    if (data.lang) {
      safeSetStorage("bd_admission_lang", data.lang);
      app.state.lang = data.lang;
    }

    if (typeof loadState === "function") loadState();
    if (typeof renderAll === "function") renderAll();
    showToast(isEn ? "All data restored successfully!" : "✅ ব্যাকআপ থেকে সকল তথ্য সফলভাবে রিস্টোর হয়েছে!");
  }

  app.exportBackupJson = window.exportBackupJson = exportBackupJson;
  app.triggerImportJson = window.triggerImportJson = triggerImportJson;
  app.handleImportFile = window.handleImportFile = handleImportFile;
})(window);
