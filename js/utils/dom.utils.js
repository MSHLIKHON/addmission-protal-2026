/**
 * dom.utils.js
 * DOM notifications (Toast), HTML sanitization, clipboard utilities & LocalStorage wrappers.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function safeGetStorage(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    function safeSetStorage(key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {}
    }


    function showToast(message) {
      const container = document.getElementById("toastContainer");
      if (!container) return;
      const toast = document.createElement("div");
      toast.className = "pointer-events-auto bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 transition opacity-0 translate-y-2";
      toast.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><span>${escapeHtml(message)}</span>`;
      container.appendChild(toast);
      requestAnimationFrame(() => {
        toast.classList.remove("opacity-0", "translate-y-2");
      });
      setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-2");
        setTimeout(() => toast.remove(), 250);
      }, 2700);
    }

    function escapeHtml(str) {
      return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }


    function copyTextSafe(text) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          showToast("কপি করা হয়েছে!");
        }).catch(() => fallbackCopyText(text));
      } else {
        fallbackCopyText(text);
      }
    }

    function fallbackCopyText(text) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        showToast("কপি করা হয়েছে!");
      } catch (e) {
        showToast("বক্স থেকে কপি করে নিন।");
      }
      document.body.removeChild(ta);
    }

    let activeCircUniId = null;


  app.safeGetStorage = window.safeGetStorage = safeGetStorage;
  app.safeSetStorage = window.safeSetStorage = safeSetStorage;
  app.showToast = window.showToast = showToast;
  app.escapeHtml = window.escapeHtml = escapeHtml;
  app.copyTextSafe = window.copyTextSafe = copyTextSafe;
  app.fallbackCopyText = window.fallbackCopyText = fallbackCopyText;
})(window);
