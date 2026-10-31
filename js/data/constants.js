/**
 * constants.js
 * Application constants, configuration, metadata & localization mappings.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  const UNI_NAMES_EN = {
    1: "University of Dhaka (DU)",
    2: "Jahangirnagar University (JU)",
    3: "Jagannath University (JnU)",
    4: "University of Rajshahi (RU)",
    5: "University of Chittagong (CU)",
    6: "Khulna University (KU)",
    7: "Comilla University (CoU)",
    8: "Bangladesh University of Textiles (BUTEX)",
    9: "Medical & Dental (Govt. MBBS / BDS)",
    10: "Armed Forces & Army Medical (AFMC & AMC)",
    11: "BUET (Engineering & Technology)",
    12: "RUET (Rajshahi Engineering)",
    13: "KUET (Khulna Engineering)",
    14: "CUET (Chittagong Engineering)",
    15: "Agricultural Cluster (9 Govt. Agri Universities)",
    16: "GST Cluster (24 General & Sci-Tech Universities)",
    17: "Shahjalal University of Science & Tech (SUST)",
    18: "Hajee Mohammad Danesh Sci & Tech (HSTU)",
    19: "Military Institute of Science & Tech (MIST)",
    20: "Islamic University of Technology (IUT)",
    21: "Bangladesh University of Professionals (BUP)",
    22: "Dhaka Central University (DCU / 7 Colleges)",
    23: "Bangladesh Maritime University (BMU)",
    24: "Aviation and Aerospace University (AAUB)",
    25: "Govt. Nursing & Midwifery (BNMC)",
    26: "Textile Engineering Colleges (BUTEX Affiliated)",
    27: "DU Technology Unit (Engineering Colleges)",
    28: "Bangladesh Health Professions Institute (BHPI)",
    29: "National University (NU)",
    30: "Bangladesh Agricultural University (BAU)",
    31: "Sher-e-Bangla Agricultural University (SAU)",
    32: "Gazipur Agricultural University (GAU)",
    33: "Patuakhali Science & Tech University (PSTU)",
    34: "Islamic University, Kushtia (IU)",
    35: "Mawlana Bhashani Science & Tech (MBSTU)",
    36: "Noakhali Science & Tech University (NSTU)",
    37: "Jashore University of Science & Tech (JUST)",
    38: "Pabna University of Science & Tech (PUST)",
    39: "Begum Rokeya University, Rangpur (BRUR)",
    40: "University of Barishal (BU)",
    41: "Jatiya Kabi Kazi Nazrul Islam University (JKKNIU)",
    42: "Gopalganj Science & Tech University (BSMRSTU)",
    43: "BRAC University (BRACU)",
    44: "North South University (NSU)",
    45: "Ahsanullah University of Science & Tech (AUST)",
    46: "East West University (EWU)",
    47: "Independent University, Bangladesh (IUB)",
    48: "American International University-Bangladesh (AIUB)",
    49: "United International University (UIU)",
    50: "Daffodil International University (DIU)",
    51: "University of Liberal Arts Bangladesh (ULAB)",
    52: "University of Asia Pacific (UAP)"
  };

  const CATEGORY_META = {
    general: { label: "সরকারি সাধারণ", badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    engineering: { label: "ইঞ্জিনিয়ারিং ও IUT", badgeClass: "bg-sky-50 text-sky-700 border-sky-200" },
    scitech: { label: "বিজ্ঞান ও প্রযুক্তি", badgeClass: "bg-teal-50 text-teal-700 border-teal-200" },
    medical: { label: "মেডিকেল ও হেলথ", badgeClass: "bg-rose-50 text-rose-700 border-rose-200" },
    specialized: { label: "কৃষি ও বিশেষায়িত", badgeClass: "bg-amber-50 text-amber-800 border-amber-200" },
    private: { label: "টপ ১০ প্রাইভেট", badgeClass: "bg-purple-50 text-purple-800 border-purple-200" }
  };

  const STATUS_META = {
    pending: { label: "আবেদন বাকি", btnClass: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200", dotClass: "bg-slate-400" },
    in_progress: { label: "প্রক্রিয়াধীন", btnClass: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100", dotClass: "bg-amber-500" },
    applied: { label: "আবেদন সম্পন্ন", btnClass: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100", dotClass: "bg-emerald-500" }
  };

  // Storage Keys
  const STORAGE_KEY_UNIS_V2 = "bd_admission_2026_unis_v2";
  const STORAGE_KEY_UNIS_V1 = "bd_admission_2026_unis_v1";
  const STORAGE_KEY_CHECKLIST = "bd_admission_2026_checklist_v1";
  const STORAGE_KEY_HSC_BANNER_DISMISSED = "bd_hsc_banner_dismissed_v1";
  const STORAGE_KEY_VAULT_CONFIG = "bd_admission_vault_config_v1";
  const STORAGE_KEY_VAULT_WARNED = "bd_admission_vault_warned_v1";
  const STORAGE_KEY_MARKS_V1 = "bd_admission_marks_v1";

  // Target HSC Result Date: 31 October 2026, 11:00 AM (BST, UTC+6)
  const HSC_RESULT_TARGET_DATE = "2026-10-31T11:00:00+06:00";

  const BN_MONTH_NAMES = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

  // Attach to AdmissionApp namespace and window
  app.UNI_NAMES_EN = window.UNI_NAMES_EN = UNI_NAMES_EN;
  app.CATEGORY_META = window.CATEGORY_META = CATEGORY_META;
  app.STATUS_META = window.STATUS_META = STATUS_META;
  app.BN_MONTH_NAMES = window.BN_MONTH_NAMES = BN_MONTH_NAMES;
  app.STORAGE_KEY_UNIS_V2 = window.STORAGE_KEY_UNIS_V2 = STORAGE_KEY_UNIS_V2;
  app.STORAGE_KEY_UNIS_V1 = window.STORAGE_KEY_UNIS_V1 = STORAGE_KEY_UNIS_V1;
  app.STORAGE_KEY_CHECKLIST = window.STORAGE_KEY_CHECKLIST = STORAGE_KEY_CHECKLIST;
  app.STORAGE_KEY_HSC_BANNER_DISMISSED = window.STORAGE_KEY_HSC_BANNER_DISMISSED = STORAGE_KEY_HSC_BANNER_DISMISSED;
  app.STORAGE_KEY_VAULT_CONFIG = window.STORAGE_KEY_VAULT_CONFIG = STORAGE_KEY_VAULT_CONFIG;
  app.STORAGE_KEY_VAULT_WARNED = window.STORAGE_KEY_VAULT_WARNED = STORAGE_KEY_VAULT_WARNED;
  app.STORAGE_KEY_MARKS_V1 = window.STORAGE_KEY_MARKS_V1 = STORAGE_KEY_MARKS_V1;
  app.HSC_RESULT_TARGET_DATE = window.HSC_RESULT_TARGET_DATE = HSC_RESULT_TARGET_DATE;
})(window);
