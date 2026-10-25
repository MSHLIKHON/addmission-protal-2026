/**
 * modal-manager.js
 * Modal controllers for university info edit, official circular preview & confirmation prompts.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function openCircularModal(uniId) {
      const uni = state.universities.find(u => u.id === Number(uniId));
      if (!uni) return;
      activeCircUniId = uni.id;
      const catMeta = CATEGORY_META[uni.category] || CATEGORY_META.general;
      const statusMeta = STATUS_META[uni.status] || STATUS_META.pending;
      const cd = getDaysRemainingInfo(uni.isoExamDate, uni.examDateText);
      const url = uni.circularUrl || "https://admission.eis.du.ac.bd";

      document.getElementById("circModalCategory").textContent = catMeta.label;
      document.getElementById("circModalTitle").textContent = `${uni.serialBn || toBengaliNumber(uni.id)}. ${uni.name}`;
      document.getElementById("circModalExamDate").textContent = isExamAnnounced(uni) ? uni.examDateText : "— (তারিখ দেয়নি)";
      document.getElementById("circModalCountdown").textContent = cd.text;
      document.getElementById("circModalDeadline").textContent = isDeadlineAnnounced(uni) ? uni.deadlineText : "— (ফাঁকা)";
      document.getElementById("circModalStatus").textContent = `অবস্থা: ${statusMeta.label}`;
      document.getElementById("circModalFeeDetails").textContent = `৳ ${uni.feeText}`;
      document.getElementById("circModalUrlInput").value = url;
      document.getElementById("circModalExternalLink").href = url;

      document.getElementById("circularModal").classList.remove("hidden");
    }

    function closeCircularModal() {
      document.getElementById("circularModal").classList.add("hidden");
      activeCircUniId = null;
    }

    function openUniModal(uniId) {
      const modal = document.getElementById("uniModal");
      const titleEl = document.getElementById("modalTitle");
      const uni = state.universities.find(u => u.id === Number(uniId));

      if (uni) {
        titleEl.textContent = `${uni.name} — তারিখ ও আইডি/পাসওয়ার্ড আপডেট`;
        document.getElementById("formUniId").value = String(uni.id);
        document.getElementById("formUniName").value = uni.name;
        document.getElementById("formCategory").value = uni.category || "general";
        document.getElementById("formStatus").value = uni.status || "pending";
        document.getElementById("formIsoDate").value = (uni.isoExamDate && uni.isoExamDate !== "9999-12-31") ? uni.isoExamDate : "";
        document.getElementById("formExamDate").value = isExamAnnounced(uni) ? uni.examDateText : "";
        document.getElementById("formDeadline").value = isDeadlineAnnounced(uni) ? uni.deadlineText : "";
        document.getElementById("formFeeText").value = uni.feeText || "";
        document.getElementById("formFeeAmount").value = String(uni.selectedFee ?? uni.defaultFee ?? 1000);
        document.getElementById("formCircularUrl").value = uni.circularUrl || "";
        document.getElementById("formUserId").value = uni.userId || "";
        document.getElementById("formUserPass").value = uni.userPass || "";
        document.getElementById("formExamRoll").value = uni.examRoll || "";
        document.getElementById("formNote").value = uni.note || "";
      } else {
        titleEl.textContent = "নতুন বিশ্ববিদ্যালয়ের তথ্য যোগ করুন";
        document.getElementById("formUniId").value = "";
        document.getElementById("formUniName").value = "";
        document.getElementById("formCategory").value = "general";
        document.getElementById("formStatus").value = "pending";
        document.getElementById("formIsoDate").value = "";
        document.getElementById("formExamDate").value = "";
        document.getElementById("formDeadline").value = "";
        document.getElementById("formFeeText").value = "১০০০";
        document.getElementById("formFeeAmount").value = "1000";
        document.getElementById("formCircularUrl").value = "https://";
        document.getElementById("formUserId").value = "";
        document.getElementById("formUserPass").value = "";
        document.getElementById("formExamRoll").value = "";
        document.getElementById("formNote").value = "";
      }

      modal.classList.remove("hidden");
    }

    function closeUniModal() {
      document.getElementById("uniModal").classList.add("hidden");
    }

    function openConfirmModal(title, message, onConfirm) {
      document.getElementById("confirmModalTitle").textContent = title;
      document.getElementById("confirmModalMessage").textContent = message;
      state.confirmCallback = onConfirm;
      document.getElementById("confirmModal").classList.remove("hidden");
    }

    function closeConfirmModal() {
      document.getElementById("confirmModal").classList.add("hidden");
      state.confirmCallback = null;
    }


  app.openCircularModal = window.openCircularModal = openCircularModal;
  app.closeCircularModal = window.closeCircularModal = closeCircularModal;
  app.openUniModal = window.openUniModal = openUniModal;
  app.closeUniModal = window.closeUniModal = closeUniModal;
  app.openConfirmModal = window.openConfirmModal = openConfirmModal;
  app.closeConfirmModal = window.closeConfirmModal = closeConfirmModal;
})(window);
