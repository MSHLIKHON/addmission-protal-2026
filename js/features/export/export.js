/**
 * export.js
 * CSV export utility supporting UTF-8 BOM encoding for proper Bengali font rendering in Excel.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function exportToCsv() {
      const headers = ["ক্রম", "বিশ্ববিদ্যালয়ের নাম", "পরীক্ষার তারিখ", "ফরম পূরণের সময়সীমা", "ফি (৳)", "অফিশিয়াল লিংক", "আবেদনের অবস্থা", "টার্গেট", "User ID", "Password", "রোল ও কেন্দ্র", "নোট"];
      const rows = state.universities.map(u => [
        u.serialBn || u.id,
        u.name,
        isExamAnnounced(u) ? u.examDateText : "",
        isDeadlineAnnounced(u) ? u.deadlineText : "",
        u.feeText,
        u.circularUrl,
        (STATUS_META[u.status] || STATUS_META.pending).label,
        u.target ? "হ্যাঁ" : "না",
        u.userId || "",
        u.userPass || "",
        u.examRoll || "",
        u.note || ""
      ]);
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
      showToast("CSV ফাইল ডাউনলোড শুরু হয়েছে!");
    }


  app.exportToCsv = window.exportToCsv = exportToCsv;
})(window);
