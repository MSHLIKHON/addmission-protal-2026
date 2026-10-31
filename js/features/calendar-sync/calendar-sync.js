/**
 * calendar-sync.js
 * RFC 5545 iCalendar (.ics) export and browser notification reminders
 * for targeted university admission exams and application deadlines.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  function formatIcsDate(isoDateStr) {
    if (!isoDateStr || isoDateStr === "9999-12-31") return null;
    const clean = isoDateStr.replace(/-/g, "");
    return `${clean}T040000Z`; // Default 10:00 AM BST (UTC+6) -> 04:00 UTC
  }

  function exportTargetedIcs() {
    const isEn = Boolean(app.state && app.state.lang === "en");
    const targets = (app.state.universities || []).filter(u => u.target);

    if (targets.length === 0) {
      showToast(isEn ? "No universities targeted yet. Select targets to export." : "কোনো বিশ্ববিদ্যালয় টার্গেট করা নেই। আগে টার্গেট নির্বাচন করুন।");
      return;
    }

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AdmissionPortalBD//AdmissionTracker2026//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:BD Admission Exam Calendar 2026-2027",
      "X-WR-TIMEZONE:Asia/Dhaka"
    ];

    targets.forEach(u => {
      const uniName = getUniDisplayName(u);

      // 1. Admission Test Event
      if (u.isoExamDate && u.isoExamDate !== "9999-12-31") {
        const dt = formatIcsDate(u.isoExamDate);
        if (dt) {
          lines.push("BEGIN:VEVENT");
          lines.push(`UID:exam-${u.id}-2026@admissiontracker.bd`);
          lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`);
          lines.push(`DTSTART:${dt}`);
          lines.push(`DTEND:${dt}`);
          lines.push(`SUMMARY:ভর্তি পরীক্ষা: ${uniName}`);
          lines.push(`DESCRIPTION:তারিখ: ${u.examDateText}. আবেদন ফি: ৳ ${u.feeText}. সার্কুলার: ${u.circularUrl}`);
          lines.push(`LOCATION:বাংলাদেশ`);
          lines.push("STATUS:CONFIRMED");
          lines.push("BEGIN:VALARM");
          lines.push("TRIGGER:-P3D"); // 3 days before
          lines.push("ACTION:DISPLAY");
          lines.push(`DESCRIPTION:৩ দিন বাকি: ${uniName} ভর্তি পরীক্ষা!`);
          lines.push("END:VALARM");
          lines.push("BEGIN:VALARM");
          lines.push("TRIGGER:-P1D"); // 1 day before
          lines.push("ACTION:DISPLAY");
          lines.push(`DESCRIPTION:আগামীকাল: ${uniName} ভর্তি পরীক্ষা!`);
          lines.push("END:VALARM");
          lines.push("END:VEVENT");
        }
      }
    });

    lines.push("END:VCALENDAR");

    const icsContent = lines.join("\r\n");
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admission_exams_2026.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(isEn ? "iCalendar (.ics) downloaded! Import to Google Calendar or Apple Calendar." : "📅 ক্যালেন্ডার (.ics) ফাইল ডাউনলোড সম্পন্ন! গুগল ক্যালেন্ডার বা ফোনে ইম্পোর্ট করুন।");
  }

  async function requestNotificationPermission() {
    const isEn = Boolean(app.state && app.state.lang === "en");
    if (!("Notification" in window)) {
      showToast(isEn ? "Browser notifications are not supported on this device." : "এই ব্রাউজারে নোটিফিকেশন সুবিধা সমর্থিত নয়।");
      return;
    }

    if (Notification.permission === "granted") {
      showToast(isEn ? "Notifications are already enabled." : "নোটিফিকেশন অনুমতি ইতিমধ্যে চালু আছে।");
      return;
    }

    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      new Notification(isEn ? "Admission Tracker 2026" : "এডমিশন ট্র্যাকার ২০২৬", {
        body: isEn ? "Exam reminders enabled! We will notify you before deadlines." : "পরীক্ষা ও ডেডলাইন রিমাইন্ডার সফলভাবে সক্রিয় হয়েছে!",
        icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎓</text></svg>"
      });
      showToast(isEn ? "Notifications enabled!" : "🔔 নোটিফিকেশন সক্রিয় করা হয়েছে!");
    }
  }

  app.exportTargetedIcs = window.exportTargetedIcs = exportTargetedIcs;
  app.requestNotificationPermission = window.requestNotificationPermission = requestNotificationPermission;
})(window);
