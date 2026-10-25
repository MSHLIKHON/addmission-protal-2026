/**
 * checklist.data.js
 * Standard preparation checklist items for admission examinees.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    const PREP_CHECKLIST_ITEMS = [
      { id: "c1", title: "সদ্য তোলা পাসপোর্ট সাইজের রঙিন ছবি (স্ক্যান কপি: 300×300 px ও 120×150 px)", done: false },
      { id: "c2", title: "নিজের স্বাক্ষরের স্ক্যান কপি (300×80 px, সাদা কাগজে কালো কালিতে)", done: false },
      { id: "c3", title: "SSC ও HSC পরীক্ষার রোল নম্বর, রেজিস্ট্রেশন নম্বর ও ট্রান্সক্রিপ্ট/মার্কশিট", done: false },
      { id: "c4", title: "টেলিটক (Teletalk) প্রিপেইড সিম (অনেক সরকারি বিশ্ববিদ্যালয়ে SMS ও ফি প্রদানের জন্য আবশ্যক)", done: false },
      { id: "c5", title: "বিকাশ / নগদ / রকেট অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স (অনলাইন আবেদন ফি পরিশোধের জন্য)", done: false },
      { id: "c6", title: "সচল মোবাইল নম্বর ও ইমেইল অ্যাড্রেস (যেখানে সব OTP ও পাসওয়ার্ড আসবে)", done: false },
      { id: "c7", title: "পিতা-মাতার জাতীয় পরিচয়পত্র (NID) নম্বর এবং স্থায়ী ও বর্তমান ঠিকানার পোস্ট কোড", done: false },
      { id: "c8", title: "প্রতিটি বিশ্ববিদ্যালয়ের ইউজার আইডি ও পাসওয়ার্ড এই ওয়েবসাইটের 'আইডি ও পাসওয়ার্ড ভল্ট'-এ সংরক্ষণ", done: false }
    ];


  app.PREP_CHECKLIST_ITEMS = window.PREP_CHECKLIST_ITEMS = PREP_CHECKLIST_ITEMS;
})(window);
