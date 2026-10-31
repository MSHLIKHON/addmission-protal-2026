/**
 * export.js
 * CSV export utility supporting UTF-8 BOM encoding for proper Bengali font rendering in Excel.
 * Passwords are excluded by default for security, with an opt-in checkbox.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  function exportToCsv(includePasswords = false) {
    const isEn = Boolean(app.state && app.state.lang === "en");
    const headers = isEn
      ? ["Serial", "University Name", "Exam Date", "Deadline", "Fee (BDT)", "Official Link", "Status", "Target", "User ID", "Password", "Exam Roll & Center", "Note"]
      : ["ক্রম", "বিশ্ববিদ্যালয়ের নাম", "পরীক্ষার তারিখ", "ফরম পূরণের সময়সীমা", "ফি (৳)", "অফিশিয়াল লিংক", "আবেদনের অবস্থা", "টার্গেট", "User ID", "Password", "রোল ও কেন্দ্র", "নোট"];

    const rows = state.universities.map(u => {
      const uniName = getUniDisplayName(u);
      const statusObj = STATUS_META[u.status] || STATUS_META.pending;
      const statusLabel = isEn ? u.status : statusObj.label;
      const targetLabel = isEn ? (u.target ? "Yes" : "No") : (u.target ? "হ্যাঁ" : "না");
      const passValue = includePasswords ? (u.userPass || "") : "";

      return [
        u.serialBn || u.id,
        uniName,
        isExamAnnounced(u) ? u.examDateText : "",
        isDeadlineAnnounced(u) ? u.deadlineText : "",
        u.feeText,
        u.circularUrl,
        statusLabel,
        targetLabel,
        u.userId || "",
        passValue,
        u.examRoll || "",
        u.note || ""
      ];
    });

    const csvContent = "\uFEFF" + [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admission_portal_2026_2027.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const toastMsg = isEn
      ? (includePasswords ? "CSV downloaded with passwords." : "CSV downloaded (passwords excluded for security).")
      : (includePasswords ? "পাসওয়ার্ডসহ CSV ফাইল ডাউনলোড শুরু হয়েছে!" : "নিরাপত্তার স্বার্থে পাসওয়ার্ড বাদ দিয়ে CSV ডাউনলোড শুরু হয়েছে!");
    showToast(toastMsg);
  }

  function openExportModal() {
    const modal = document.getElementById("exportModal");
    if (!modal) {
      // Fallback if modal not in DOM: export without passwords
      exportToCsv(false);
      return;
    }
    const chk = document.getElementById("chkIncludePasswords");
    if (chk) chk.checked = false;
    modal.classList.remove("hidden");
  }

  function closeExportModal() {
    const modal = document.getElementById("exportModal");
    if (modal) modal.classList.add("hidden");
  }

  app.exportToCsv = window.exportToCsv = exportToCsv;
  app.openExportModal = window.openExportModal = openExportModal;
  app.closeExportModal = window.closeExportModal = closeExportModal;
})(window);
