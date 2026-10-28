/**
 * parser.js
 * Smart notice text analyzer with regex pattern recognition for dates, deadlines & application fees.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  function normalizeBn(s) {
    return (s || '').normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, '');
  }

  const BN_MONTHS = 'জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর|Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?';

  const UNI_ALIASES = [
    { id: 2, keys: ['জাহাঙ্গীরনগর', 'জাবি', 'জাবির', 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', 'jahangirnagar', 'ju'] },
    { id: 1, keys: ['ঢাকা বিশ্ববিদ্যালয়', 'ঢাবি', 'ঢাবির', 'iba-du', 'du', 'dhaka university'] },
    { id: 11, keys: ['বুয়েট', 'বুয়েট', 'বুয়েটের', 'বুয়েটের', 'buet', 'বাংলাদেশ প্রকৌশল'] },
    { id: 9, keys: ['মেডিকেল', 'ডেন্টাল', 'এমবিবিএস', 'বিডিএস', 'mbbs', 'bds', 'dgme'] },
    { id: 13, keys: ['কুয়েট', 'কুয়েট', 'কুয়েটের', 'kuet', 'খুলনা প্রকৌশল'] },
    { id: 12, keys: ['রুয়েট', 'রুয়েট', 'রুয়েটের', 'ruet', 'রাজশাহী প্রকৌশল'] },
    { id: 14, keys: ['চুয়েট', 'চুয়েট', 'চুয়েটের', 'cuet', 'চট্টগ্রাম প্রকৌশল'] },
    { id: 4, keys: ['রাজশাহী বিশ্ববিদ্যালয়', 'রাবি', 'রাবির', 'rajshahi university', 'ru'] },
    { id: 5, keys: ['চট্টগ্রাম বিশ্ববিদ্যালয়', 'চবি', 'চবির', 'chittagong university', 'cu'] },
    { id: 3, keys: ['জগন্নাথ বিশ্ববিদ্যালয়', 'জবি', 'জবির', 'jnu', 'jagannath'] },
    { id: 6, keys: ['খুলনা বিশ্ববিদ্যালয়', 'খুবি', 'খুবির', 'ku', 'khulna university'] },
    { id: 7, keys: ['কুমিল্লা বিশ্ববিদ্যালয়', 'কুবি', 'কুবির', 'cou', 'comilla university'] },
    { id: 8, keys: ['বুটেক্স', 'টেক্সটাইল বিশ্ববিদ্যালয়', 'butex'] },
    { id: 15, keys: ['কৃষি গুচ্ছ', 'agri gst', 'কৃষি বিশ্ববিদ্যালয়', 'কৃষি গুচ্ছভুক্ত'] },
    { id: 16, keys: ['জিএসটি গুচ্ছ', 'gst cluster', 'জিএসটি', 'gst', 'সাধারণ, বিজ্ঞান ও প্রযুক্তি'] },
    { id: 17, keys: ['শাবিপ্রবি', 'সাস্ট', 'সাস্টের', 'sust', 'শাহজালাল বিজ্ঞান'] },
    { id: 18, keys: ['হাবিপ্রবি', 'hstu', 'হাজী দানেশ', 'হাজী মোহাম্মদ দানেশ'] },
    { id: 19, keys: ['এমআইএসটি', 'mist', 'মিলিটারি ইনস্টিটিউট'] },
    { id: 20, keys: ['আইইউটি', 'iut', 'ইসলামিক ইউনিভার্সিটি'] },
    { id: 21, keys: ['বিইউপি', 'bup', 'বাংলাদেশ ইউনিভার্সিটি অব প্রফেশনালস'] },
    { id: 22, keys: ['বিকেএসপি', 'bspasu'] },
    { id: 23, keys: ['মেরিটাইম', 'বঙ্গবন্ধু মেরিটাইম', 'bsmrmu', 'bmu'] },
    { id: 24, keys: ['এভিয়েশন', 'বাউয়েট', 'aaub', 'baau'] }
  ];

  function parseSmartCircularNotice(rawText) {
    const text = normalizeBn(rawText || '').trim();
    if (!text) {
      return { ok: false, message: 'অনুগ্রহ করে সার্কুলার বা নোটিশের টেক্সট পেস্ট করুন।' };
    }

    const norm = text.toLowerCase();
    const universitiesList = (window.state && window.state.universities) ? window.state.universities : (app.INITIAL_UNIVERSITIES || []);

    // 1. Precise University Detection
    let matchedUni = null;
    let bestScore = 0;

    for (const alias of UNI_ALIASES) {
      let score = 0;
      for (const rawK of alias.keys) {
        const k = normalizeBn(rawK).toLowerCase();
        if (/^[a-z0-9]{2,4}$/.test(k)) {
          const reg = new RegExp('(?:^|[^a-zA-Z0-9])' + k + '(?:[^a-zA-Z0-9]|$)', 'i');
          if (reg.test(norm)) score += 130;
        } else {
          if (norm.includes(k)) {
            score += (k.length >= 6 ? 160 : 90);
          }
        }
      }
      if (score > bestScore) {
        bestScore = score;
        matchedUni = universitiesList.find(u => u.id === alias.id);
      }
    }

    // Fallback if no alias matched
    if (!matchedUni) {
      const STOP = new Set(['বিশ্ববিদ্যালয়', 'university', 'সরকারি', 'বাংলাদেশ', 'bangladesh', 'ভর্তি', 'পরীক্ষা', 'স্নাতক', 'শিক্ষাবর্ষ']);
      for (const u of universitiesList) {
        const tokens = normalizeBn(u.name + ' ' + (u.keywords || '')).toLowerCase().split(/[\s,()/|-]+/).filter(t => t.length >= 3 && !STOP.has(t));
        for (const tk of tokens) {
          if (norm.includes(tk)) {
            matchedUni = u;
            break;
          }
        }
        if (matchedUni) break;
      }
    }

    if (!matchedUni) {
      return { ok: false, message: 'টেক্সট থেকে নির্দিষ্ট কোনো বিশ্ববিদ্যালয়ের নাম শনাক্ত করা যায়নি। অনুগ্রহ করে বিশ্ববিদ্যালয়ের নামসহ নোটিশ পেস্ট করুন।' };
    }

    // 2. Intelligent Context-Aware Date Detection
    const rangeRegex = new RegExp('([০-৯0-9]{1,2}(?:\\s*(?:' + BN_MONTHS + '))?\\s*(?:থেকে|হতে|to|–|-)\\s*[০-৯0-9]{1,2}\\s*(?:' + BN_MONTHS + ')(?:\\s*[০-৯0-9]{4})?)', 'gi');
    const startEndRegex = new RegExp('(?:শুরু|হতে|থেকে)\\s*[:=-]?\\s*([০-৯0-9]{1,2}\\s*(?:' + BN_MONTHS + ')(?:\\s*[০-৯0-9]{4})?).*?(?:শেষ|পর্যন্ত)\\s*[:=-]?\\s*([০-৯0-9]{1,2}\\s*(?:' + BN_MONTHS + ')(?:\\s*[০-৯0-9]{4})?)', 'i');
    const singleDateRegex = new RegExp('([০-৯0-9]{1,2}\\s*(?:' + BN_MONTHS + ')(?:\\s*[০-৯0-9]{4})?)', 'gi');

    const EXAM_WORDS = ['পরীক্ষা', 'অনুষ্ঠিত', 'টেস্ট', 'লিখিত', 'এমসিকিউ', 'test', 'exam', 'admission'];
    const APPLY_WORDS = ['আবেদন', 'ফরম', 'দরখাস্ত', 'রেজিস্ট্রেশন', 'শুরু', 'শেষ', 'সময়সীমা', 'সময়সীমা', 'চলবে', 'জমা', 'apply', 'deadline', 'registration'];

    function evaluateIntent(dateStr, matchIndex) {
      const preText = text.slice(Math.max(0, matchIndex - 35), matchIndex);
      const postText = text.slice(matchIndex + dateStr.length, Math.min(text.length, matchIndex + dateStr.length + 25));

      let examScore = 0;
      let applyScore = 0;

      for (const w of EXAM_WORDS) {
        if (preText.includes(w)) examScore += 25;
        if (postText.includes(w)) examScore += 12;
      }
      for (const w of APPLY_WORDS) {
        if (preText.includes(w)) applyScore += 25;
        if (postText.includes(w)) applyScore += 12;
      }

      if (examScore > applyScore) return 'exam';
      if (applyScore > examScore) return 'apply';
      return 'neutral';
    }

    let detectedExamDate = '';
    let detectedDeadline = '';

    // Check explicit start-end pattern for application/deadline
    const seMatch = text.match(startEndRegex);
    if (seMatch) {
      detectedDeadline = `${seMatch[1].trim()} - ${seMatch[2].trim()}`;
    }

    // Check Range dates
    let match;
    while ((match = rangeRegex.exec(text)) !== null) {
      const rStr = match[1].trim();
      const intent = evaluateIntent(rStr, match.index);
      if (intent === 'exam') {
        if (!detectedExamDate) detectedExamDate = rStr;
      } else if (intent === 'apply') {
        if (!detectedDeadline) detectedDeadline = rStr;
      } else {
        if (!detectedExamDate) detectedExamDate = rStr;
        else if (!detectedDeadline) detectedDeadline = rStr;
      }
    }

    // Check Single dates
    while ((match = singleDateRegex.exec(text)) !== null) {
      const sStr = match[1].trim();
      if ((detectedExamDate && detectedExamDate.includes(sStr)) || (detectedDeadline && detectedDeadline.includes(sStr))) {
        continue;
      }
      const intent = evaluateIntent(sStr, match.index);
      if (intent === 'exam') {
        if (!detectedExamDate) detectedExamDate = sStr;
      } else if (intent === 'apply') {
        if (!detectedDeadline) detectedDeadline = sStr;
      } else {
        if (!detectedExamDate) detectedExamDate = sStr;
        else if (!detectedDeadline) detectedDeadline = sStr;
      }
    }

    // 3. Application Fee Detection
    const feeRegex = /(?:ফি|টাকা|৳|TK|BDT)\s*[:=-]?\s*([০-৯0-9]{3,4})|([০-৯0-9]{3,4})\s*(?:টাকা|৳)/i;
    const feeMatch = text.match(feeRegex);
    const detectedFee = feeMatch ? (feeMatch[1] || feeMatch[2]) : '';

    // 4. Update the matched university in active state
    if (detectedExamDate) {
      matchedUni.examDateText = detectedExamDate;
      if (typeof parseBanglaDateToIso === 'function') {
        matchedUni.isoExamDate = parseBanglaDateToIso(detectedExamDate, matchedUni.isoExamDate);
        matchedUni.examMonthGroup = (!matchedUni.isoExamDate || matchedUni.isoExamDate === '9999-12-31') ? 'unpublished' : matchedUni.isoExamDate.slice(0, 7);
      }
    }
    if (detectedDeadline) {
      matchedUni.deadlineText = detectedDeadline;
      matchedUni.hasDeadline = true;
    }
    if (detectedFee) {
      const feeBn = typeof toBengaliNumber === 'function' ? toBengaliNumber(toEnglishDigits(detectedFee)) : detectedFee;
      matchedUni.feeText = feeBn;
      const numFee = typeof toEnglishDigits === 'function' ? Number(toEnglishDigits(detectedFee)) : Number(detectedFee);
      if (numFee >= 100) {
        matchedUni.defaultFee = numFee;
        matchedUni.selectedFee = numFee;
      }
    }
    matchedUni.customEdited = true;

    if (typeof saveUniversities === 'function') saveUniversities();
    if (typeof renderAll === 'function') renderAll();

    return {
      ok: true,
      uni: matchedUni,
      examDate: detectedExamDate || matchedUni.examDateText || 'অপরিবর্তিত',
      deadline: detectedDeadline || matchedUni.deadlineText || 'অপরিবর্তিত',
      fee: detectedFee ? (typeof toBengaliNumber === 'function' ? toBengaliNumber(toEnglishDigits(detectedFee)) : detectedFee) : matchedUni.feeText
    };
  }

  app.parseSmartCircularNotice = window.parseSmartCircularNotice = parseSmartCircularNotice;
})(window);
