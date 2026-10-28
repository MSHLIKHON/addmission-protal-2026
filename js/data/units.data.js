/**
 * units.data.js
 * Sub-unit admission test schedule & center details (DU, IBA, Medical, BUET, Agri, etc.).
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    const UNIT_CALENDAR_EVENTS = [
      { iso: "2026-12-04", short: "মেডিকেল ও ডেন্টাল*", time: "সকাল ১০:০০টা", centers: "১৭টি সরকারি মেডিকেল কলেজ কেন্দ্র", uniId: 9 },
      { iso: "2026-12-04", short: "ঢাবি (IBA)", time: "সকাল ১০:০০টা", centers: "ঢাকা বিশ্ববিদ্যালয় ক্যাম্পাস", uniId: 1 },
      { iso: "2026-12-05", short: "এভিয়েশন (AAUB)", time: "সকাল ১০:০০টা", centers: "বিএএফ শাহীন কলেজ ঢাকা ও লালমনিরহাট", uniId: 24 },
      { iso: "2026-12-12", short: "ঢাবি ক ইউনিট (DU-A)", time: "সকাল ১১:০০টা", centers: "৮টি বিভাগীয় শহর", uniId: 1 },
      { iso: "2026-12-17", short: "খুবি (KU-C & D)", time: "সকাল ১০:০০টা ও দুপুর ১:৩০টা", centers: "ঢাকা, খুলনা, রাজশাহী, চট্টগ্রাম", uniId: 6 },
      { iso: "2026-12-18", short: "খুবি (KU-A & B)", time: "সকাল ১০:০০টা ও দুপুর ২:৩০টা", centers: "ঢাকা, খুলনা, রাজশাহী, চট্টগ্রাম", uniId: 6 },
      { iso: "2026-12-18", short: "ঢাবি খ ইউনিট (DU-B)", time: "সকাল ১১:০০টা", centers: "৮টি বিভাগীয় শহর", uniId: 1 },
      { iso: "2026-12-19", short: "MIST (A & B ইউনিট)", time: "সকাল ১০:০০টা", centers: "মিরপুর সেনানিবাস, ঢাকা", uniId: 19 },
      { iso: "2026-12-21", short: "ঢাবি চারুকলা (DU-CHA)", time: "সকাল ১১:০০টা", centers: "ঢাকা বিশ্ববিদ্যালয়", uniId: 1 },
      { iso: "2026-12-25", short: "ঢাবি গ ইউনিট (DU-C)", time: "সকাল ১১:০০টা", centers: "৮টি বিভাগীয় শহর", uniId: 1 },
      { iso: "2026-12-26", short: "MIST (C ইউনিট)", time: "সকাল ১০:০০টা", centers: "মিরপুর সেনানিবাস, ঢাকা", uniId: 19 },
      { iso: "2026-12-29", short: "মেরিটাইম (BMU)", time: "সকাল ১০:০০টা", centers: "ঢাকা, চট্টগ্রাম, খুলনা, রংপুর", uniId: 23 },
      { iso: "2026-12-31", short: "জবি (JnU-A) ও BUP (FBS)", time: "সকাল ১০:০০টা", centers: "ঢাকা কেন্দ্র", uniId: 3 },
      { iso: "2027-01-02", short: "কৃষি গুচ্ছ ও BUP (FASS)", time: "সকাল ১১:০০টা", centers: "৯টি কৃষি বিশ্ববিদ্যালয় কেন্দ্র", uniId: 15 },
      { iso: "2027-01-08", short: "কুয়েট (KUET) ও রাবি (C)*", time: "সকাল ১০:০০টা", centers: "খুলনা ও ৭টি বিভাগীয় শহর", uniId: 13 },
      { iso: "2027-01-08", short: "BUP (FST & FSSS)", time: "সকাল ১০:০০টা", centers: "মিরপুর সেনানিবাস, ঢাকা", uniId: 21 },
      { iso: "2027-01-10", short: "জাবি (JU ভর্তি পরীক্ষা শুরু)", time: "সকাল ৯:০০টা - বিকাল ৫:০০টা (শিফটভিত্তিক)", centers: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয় ক্যাম্পাস (সাভার)", uniId: 2 },
      { iso: "2027-01-14", short: "রুয়েট (RUET)* ও জবি (B)", time: "সকাল ১০:০০টা", centers: "রাজশাহী ও ঢাকা", uniId: 12 },
      { iso: "2027-01-16", short: "বুয়েট (BUET) ও রাবি (A)*", time: "সকাল ১০:০০টা", centers: "বুয়েট ক্যাম্পাস, ঢাকা", uniId: 11 },
      { iso: "2027-01-21", short: "জাবি (JU ভর্তি পরীক্ষা শেষ)", time: "সকাল ৯:০০টা - বিকাল ৫:০০টা", centers: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয় ক্যাম্পাস (সাভার)", uniId: 2 },
      { iso: "2027-01-23", short: "চুয়েট (CUET)* ও জবি (D)", time: "সকাল ১০:০০টা", centers: "চট্টগ্রাম ও ঢাকা", uniId: 14 },
      { iso: "2027-01-24", short: "হাবিপ্রবি (HSTU)*", time: "সকাল ১০:০০টা", centers: "দিনাজপুর ক্যাম্পাস", uniId: 18 },
      { iso: "2027-01-26", short: "শাবিপ্রবি (SUST-A1)*", time: "সকাল ১০:০০টা", centers: "সিলেট ও বিভাগীয় কেন্দ্র", uniId: 17 },
      { iso: "2027-01-27", short: "শাবিপ্রবি (SUST-B)*", time: "সকাল ১০:০০টা", centers: "সিলেট ও বিভাগীয় কেন্দ্র", uniId: 17 },
      { iso: "2027-01-28", short: "বুটেক্স (BUTEX) ও চবি (C)*", time: "সকাল ১০:০০টা", centers: "ঢাকা ও চট্টগ্রাম", uniId: 8 },
      { iso: "2027-01-29", short: "চবি ক ইউনিট (CU-A)*", time: "সকাল ১১:০০টা", centers: "চট্টগ্রাম, ঢাকা ও রাজশাহী", uniId: 5 },
      { iso: "2027-02-04", short: "কুবি (CoU-A) ও চবি (B)*", time: "সকাল ১০:০০টা", centers: "কুমিল্লা ও চট্টগ্রাম", uniId: 7 },
      { iso: "2027-02-05", short: "কুবি (CoU-B) ও চবি (D)*", time: "সকাল ১০:০০টা", centers: "কুমিল্লা ও চট্টগ্রাম", uniId: 7 },
      { iso: "2027-03-18", short: "জিএসটি গুচ্ছ (B - মানবিক)", time: "দুপুর ১২:০০টা", centers: "২৪টি বিশ্ববিদ্যালয় কেন্দ্র", uniId: 16 },
      { iso: "2027-03-19", short: "জিএসটি গুচ্ছ (C - বাণিজ্য)", time: "দুপুর ১২:০০টা", centers: "২৪টি বিশ্ববিদ্যালয় কেন্দ্র", uniId: 16 },
      { iso: "2027-03-27", short: "জিএসটি গুচ্ছ (A - বিজ্ঞান)", time: "দুপুর ১২:০০টা", centers: "২৪টি বিশ্ববিদ্যালয় কেন্দ্র", uniId: 16 }
    ];


  app.UNIT_CALENDAR_EVENTS = window.UNIT_CALENDAR_EVENTS = UNIT_CALENDAR_EVENTS;
})(window);
