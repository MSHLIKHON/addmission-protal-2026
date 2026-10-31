/**
 * marks.data.js
 * Official admission test mark distributions, merit score formulas, section breakdowns,
 * and negative marking rules for Bangladeshi universities (2026-2027).
 *
 * Strict policy: Data is taken only from official university circulars.
 * Unconfirmed items are stored as null with unverified status.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  const ADMISSION_MARKS_DATA = [
    // 1. University of Dhaka (DU)
    {
      uniId: 1,
      unitKey: "du-a",
      unitName: "ঢাবি ক ইউনিট (বিজ্ঞান)",
      unitNameEn: "DU A Unit (Science)",
      totalMarks: 100,
      durationMin: 90,
      negativeMarking: 0.25,
      passMark: 40,
      hasWritten: true,
      hasMcq: true,
      sections: [
        { key: "physics", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", marks: 25, questions: 15, writtenMarks: 10, mcqMarks: 15, isOptional: false },
        { key: "chemistry", nameBn: "রসায়ন", nameEn: "Chemistry", marks: 25, questions: 15, writtenMarks: 10, mcqMarks: 15, isOptional: false },
        { key: "math", nameBn: "উচ্চতর গণিত", nameEn: "Higher Math", marks: 25, questions: 15, writtenMarks: 10, mcqMarks: 15, isOptional: true },
        { key: "biology", nameBn: "জীববিজ্ঞান", nameEn: "Biology", marks: 25, questions: 15, writtenMarks: 10, mcqMarks: 15, isOptional: true },
        { key: "bangla", nameBn: "বাংলা (বিকল্প)", nameEn: "Bangla (Alternative)", marks: 25, questions: 15, writtenMarks: 10, mcqMarks: 15, isOptional: true },
        { key: "english", nameBn: "ইংরেজি (বিকল্প)", nameEn: "English (Alternative)", marks: 25, questions: 15, writtenMarks: 10, mcqMarks: 15, isOptional: true }
      ],
      meritFormula: {
        sscWeight: 2,
        hscWeight: 2,
        sscMax: 10,
        hscMax: 10,
        testWeight: 1,
        testMax: 100,
        totalMerit: 120,
        descriptionBn: "SSC GPA × ২ + HSC GPA × ২ + ভর্তি পরীক্ষার ১০০ নম্বর = মোট ১২০ নম্বর",
        descriptionEn: "SSC GPA × 2 + HSC GPA × 2 + Test 100 marks = Total 120",
        notesBn: "৪টি বিষয়ে উত্তর দিতে হবে (আবশ্যিক পদার্থ ও রসায়ন; গণিত/জীববিজ্ঞান/বাংলা/ইংরেজি থেকে ২টি)। MCQ-তে ন্যূনতম ২৪ ও লিখিততে ন্যূনতম ১২ নম্বর বাধ্যতামূলক।"
      },
      source: "https://admission.eis.du.ac.bd",
      verifiedOn: "2026-10-25"
    },
    {
      uniId: 1,
      unitKey: "du-b",
      unitName: "ঢাবি খ ইউনিট (কলা, আইন ও সামাজিক বিজ্ঞান)",
      unitNameEn: "DU B Unit (Arts, Law & Social Sciences)",
      totalMarks: 100,
      durationMin: 90,
      negativeMarking: 0.25,
      passMark: 40,
      hasWritten: true,
      hasMcq: true,
      sections: [
        { key: "bangla", nameBn: "বাংলা / সাধারণ ভাষা", nameEn: "Bangla", marks: 35, questions: 20, writtenMarks: 20, mcqMarks: 15, isOptional: false },
        { key: "english", nameBn: "ইংরেজি", nameEn: "English", marks: 35, questions: 20, writtenMarks: 20, mcqMarks: 15, isOptional: false },
        { key: "gk", nameBn: "সাধারণ জ্ঞান", nameEn: "General Knowledge", marks: 30, questions: 20, writtenMarks: 0, mcqMarks: 30, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 2,
        hscWeight: 2,
        sscMax: 10,
        hscMax: 10,
        testWeight: 1,
        testMax: 100,
        totalMerit: 120,
        descriptionBn: "SSC GPA × ২ + HSC GPA × ২ + টেস্ট ১০০ = ১২০",
        descriptionEn: "SSC GPA × 2 + HSC GPA × 2 + Test 100 = 120",
        notesBn: "MCQ অংশ ৬০ নম্বর ও লিখিত অংশ ৪০ নম্বর। MCQ পাশ নম্বর ২৪।"
      },
      source: "https://admission.eis.du.ac.bd",
      verifiedOn: "2026-10-25"
    },
    {
      uniId: 1,
      unitKey: "du-c",
      unitName: "ঢাবি গ ইউনিট (ব্যবসায় শিক্ষা)",
      unitNameEn: "DU C Unit (Business Studies)",
      totalMarks: 100,
      durationMin: 90,
      negativeMarking: 0.25,
      passMark: 40,
      hasWritten: true,
      hasMcq: true,
      sections: [
        { key: "bangla", nameBn: "বাংলা", nameEn: "Bangla", marks: 20, questions: 12, writtenMarks: 8, mcqMarks: 12, isOptional: false },
        { key: "english", nameBn: "ইংরেজি", nameEn: "English", marks: 20, questions: 12, writtenMarks: 8, mcqMarks: 12, isOptional: false },
        { key: "accounting", nameBn: "হিসাববিজ্ঞান", nameEn: "Accounting", marks: 24, questions: 12, writtenMarks: 12, mcqMarks: 12, isOptional: false },
        { key: "management", nameBn: "ব্যবসায় নীতি ও প্রয়োগ", nameEn: "Business Org & Mgmt", marks: 24, questions: 12, writtenMarks: 12, mcqMarks: 12, isOptional: false },
        { key: "finance_marketing", nameBn: "মার্কেটিং / ফিন্যান্স", nameEn: "Marketing / Finance", marks: 12, questions: 12, writtenMarks: 0, mcqMarks: 12, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 2,
        hscWeight: 2,
        sscMax: 10,
        hscMax: 10,
        testWeight: 1,
        testMax: 100,
        totalMerit: 120,
        descriptionBn: "SSC GPA × ২ + HSC GPA × ২ + টেস্ট ১০০ = ১২০",
        descriptionEn: "SSC GPA × 2 + HSC GPA × 2 + Test 100 = 120",
        notesBn: "MCQ ৬০ নম্বর + লিখিত ৪০ নম্বর। ইংরেজিতে ন্যূনতম পাঁচ নম্বর বাধ্যতামূলক।"
      },
      source: "https://admission.eis.du.ac.bd",
      verifiedOn: "2026-10-25"
    },
    {
      uniId: 1,
      unitKey: "du-iba",
      unitName: "ঢাবি IBA BBA ইউনিট",
      unitNameEn: "DU IBA BBA Unit",
      totalMarks: 100,
      durationMin: 120,
      negativeMarking: 0.25,
      passMark: null,
      hasWritten: true,
      hasMcq: true,
      sections: [
        { key: "english", nameBn: "ইংরেজি ভাষা ও সাহিত্য", nameEn: "English Language", marks: 30, questions: 30, writtenMarks: 0, mcqMarks: 30, isOptional: false },
        { key: "math", nameBn: "বেসিক ম্যাথমেটিক্স", nameEn: "Mathematics", marks: 30, questions: 30, writtenMarks: 0, mcqMarks: 30, isOptional: false },
        { key: "analytical", nameBn: "অ্যানালিটিক্যাল অ্যাবিলিটি", nameEn: "Analytical Ability", marks: 15, questions: 15, writtenMarks: 0, mcqMarks: 15, isOptional: false },
        { key: "written", nameBn: "ইংরেজি লিখিত (রচনা ও বিশ্লেষণ)", nameEn: "English Written", marks: 25, questions: 2, writtenMarks: 25, mcqMarks: 0, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 0,
        hscWeight: 0,
        sscMax: 0,
        hscMax: 0,
        testWeight: 1,
        testMax: 100,
        totalMerit: 100,
        descriptionBn: "লিখিত ও মৌখিক পরীক্ষার ভিত্তিতে চূড়ান্ত মেধা তালিকা প্রস্তুত হয়",
        descriptionEn: "Final merit determined by written test & viva",
        notesBn: "প্রতিটি সেকশনে আলাদা ব্যক্তিগত কাটঅফ পাস মার্ক থাকে।"
      },
      source: "https://www.iba-du.edu",
      verifiedOn: "2026-10-25"
    },

    // 2. Medical & Dental (MBBS / BDS)
    {
      uniId: 9,
      unitKey: "medical-mbbs",
      unitName: "সরকারি মেডিকেল (MBBS / BDS)",
      unitNameEn: "Govt Medical (MBBS / BDS)",
      totalMarks: 100,
      durationMin: 60,
      negativeMarking: 0.25,
      passMark: 40,
      hasWritten: false,
      hasMcq: true,
      sections: [
        { key: "biology", nameBn: "জীববিজ্ঞান", nameEn: "Biology", marks: 30, questions: 30, writtenMarks: 0, mcqMarks: 30, isOptional: false },
        { key: "chemistry", nameBn: "রসায়ন", nameEn: "Chemistry", marks: 25, questions: 25, writtenMarks: 0, mcqMarks: 25, isOptional: false },
        { key: "physics", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", marks: 20, questions: 20, writtenMarks: 0, mcqMarks: 20, isOptional: false },
        { key: "english", nameBn: "ইংরেজি", nameEn: "English", marks: 15, questions: 15, writtenMarks: 0, mcqMarks: 15, isOptional: false },
        { key: "gk", nameBn: "সাধারণ জ্ঞান (বাংলাদেশ ও আন্তর্জাতিক)", nameEn: "General Knowledge", marks: 10, questions: 10, writtenMarks: 0, mcqMarks: 10, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 15,
        hscWeight: 25,
        sscMax: 75,
        hscMax: 125,
        testWeight: 1,
        testMax: 100,
        totalMerit: 300,
        descriptionBn: "SSC GPA × ১৫ (সর্বোচ্চ ৭৫) + HSC GPA × ২৫ (সর্বোচ্চ ১২৫) + টেস্ট ১০০ = মোট ৩০০ নম্বর",
        descriptionEn: "SSC GPA × 15 (max 75) + HSC GPA × 25 (max 125) + Test 100 = Total 300",
        notesBn: "২য় বার পরীক্ষার্থীদের মোট স্কোর থেকে ৫ নম্বর কাটা যাবে (পূর্বে কোথাও ভর্তি থাকলে ৭.৫ নম্বর)।"
      },
      source: "https://dgme.teletalk.com.bd",
      verifiedOn: "2026-10-25"
    },

    // 3. BUET
    {
      uniId: 11,
      unitKey: "buet-eng",
      unitName: "বুয়েট প্রকৌশল (ক গ্রুপ)",
      unitNameEn: "BUET Engineering (Group A)",
      totalMarks: 400,
      durationMin: 180,
      negativeMarking: 0,
      passMark: null,
      hasWritten: true,
      hasMcq: false,
      sections: [
        { key: "math", nameBn: "উচ্চতর গণিত", nameEn: "Higher Mathematics", marks: 140, questions: 14, writtenMarks: 140, mcqMarks: 0, isOptional: false },
        { key: "physics", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", marks: 130, questions: 13, writtenMarks: 130, mcqMarks: 0, isOptional: false },
        { key: "chemistry", nameBn: "রসায়ন", nameEn: "Chemistry", marks: 130, questions: 13, writtenMarks: 130, mcqMarks: 0, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 0,
        hscWeight: 0,
        sscMax: 0,
        hscMax: 0,
        testWeight: 1,
        testMax: 400,
        totalMerit: 400,
        descriptionBn: "চূড়ান্ত লিখিত পরীক্ষার ৪০০ নম্বরের উপর মেধা তালিকা",
        descriptionEn: "Final merit based purely on 400 written marks",
        notesBn: "প্রাক-নির্বাচনী ১০০ নম্বরের MCQ (নেগেটিভ ০.২৫) পার হয়ে শীর্ষ প্রার্থীদের লিখিত পরীক্ষায় ডাকা হয়।"
      },
      source: "http://ugadmission.buet.ac.bd",
      verifiedOn: "2026-10-25"
    },

    // 4. Agricultural Cluster (কৃষি গুচ্ছ - ৯ বিশ্ববিদ্যালয়)
    {
      uniId: 15,
      unitKey: "agri-cluster",
      unitName: "কৃষি গুচ্ছ (৯টি সরকারি কৃষি বিশ্ববিদ্যালয়)",
      unitNameEn: "Agricultural Cluster (9 Universities)",
      totalMarks: 100,
      durationMin: 60,
      negativeMarking: 0.25,
      passMark: 40,
      hasWritten: false,
      hasMcq: true,
      sections: [
        { key: "biology", nameBn: "জীববিজ্ঞান", nameEn: "Biology", marks: 30, questions: 30, writtenMarks: 0, mcqMarks: 30, isOptional: false },
        { key: "chemistry", nameBn: "রসায়ন", nameEn: "Chemistry", marks: 20, questions: 20, writtenMarks: 0, mcqMarks: 20, isOptional: false },
        { key: "physics", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", marks: 20, questions: 20, writtenMarks: 0, mcqMarks: 20, isOptional: false },
        { key: "math", nameBn: "উচ্চতর গণিত", nameEn: "Higher Math", marks: 20, questions: 20, writtenMarks: 0, mcqMarks: 20, isOptional: false },
        { key: "english", nameBn: "ইংরেজি", nameEn: "English", marks: 10, questions: 10, writtenMarks: 0, mcqMarks: 10, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 8,
        hscWeight: 12,
        sscMax: 40,
        hscMax: 60,
        testWeight: 1,
        testMax: 100,
        totalMerit: 200,
        descriptionBn: "SSC GPA (৪র্থ বিষয় বাদে) × ৮ + HSC GPA (৪র্থ বিষয় বাদে) × ১২ + টেস্ট ১০০ = মোট ২০০ নম্বর",
        descriptionEn: "SSC GPA × 8 + HSC GPA × 12 + Test 100 = Total 200 marks",
        notesBn: "১০০টি MCQ, ভুল উত্তরের জন্য ০.২৫ নম্বর কাটা যাবে।"
      },
      source: "https://acas.edu.bd",
      verifiedOn: "2026-10-25"
    },

    // 5. GST Cluster (২৪ সাধারণ ও বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়)
    {
      uniId: 16,
      unitKey: "gst-a",
      unitName: "জিএসটি গুচ্ছ ক ইউনিট (বিজ্ঞান)",
      unitNameEn: "GST Cluster A Unit (Science)",
      totalMarks: 100,
      durationMin: 60,
      negativeMarking: 0.25,
      passMark: 30,
      hasWritten: false,
      hasMcq: true,
      sections: [
        { key: "physics", nameBn: "পদার্থবিজ্ঞান (আবশ্যিক)", nameEn: "Physics (Compulsory)", marks: 25, questions: 25, writtenMarks: 0, mcqMarks: 25, isOptional: false },
        { key: "chemistry", nameBn: "রসায়ন (আবশ্যিক)", nameEn: "Chemistry (Compulsory)", marks: 25, questions: 25, writtenMarks: 0, mcqMarks: 25, isOptional: false },
        { key: "math", nameBn: "উচ্চতর গণিত", nameEn: "Higher Math", marks: 25, questions: 25, writtenMarks: 0, mcqMarks: 25, isOptional: true },
        { key: "biology", nameBn: "জীববিজ্ঞান", nameEn: "Biology", marks: 25, questions: 25, writtenMarks: 0, mcqMarks: 25, isOptional: true },
        { key: "bangla", nameBn: "বাংলা (ঐচ্ছিক বিষয়ের বিপরীতে)", nameEn: "Bangla", marks: 25, questions: 25, writtenMarks: 0, mcqMarks: 25, isOptional: true },
        { key: "english", nameBn: "ইংরেজি (ঐচ্ছিক বিষয়ের বিপরীতে)", nameEn: "English", marks: 25, questions: 25, writtenMarks: 0, mcqMarks: 25, isOptional: true }
      ],
      meritFormula: {
        sscWeight: 0,
        hscWeight: 0,
        sscMax: 0,
        hscMax: 0,
        testWeight: 1,
        testMax: 100,
        totalMerit: 100,
        descriptionBn: "ভর্তি পরীক্ষার ১০০ নম্বরের স্কোর (পরবর্তীতে বিশ্ববিদ্যালয়ভেদে জিপিএ যোগ হতে পারে)",
        descriptionEn: "Admission test 100 marks (individual universities may add GPA weight)",
        notesBn: "পদার্থ ও রসায়ন আবশ্যিক ৫০। বাকি ৫০ গণিত/জীববিজ্ঞান/বাংলা/ইংরেজি থেকে।"
      },
      source: "https://gstadmission.ac.bd",
      verifiedOn: "2026-10-25"
    },

    // 6. Jahangirnagar University (JU) - A Unit
    {
      uniId: 2,
      unitKey: "ju-a",
      unitName: "জাবি A ইউনিট (গাণিতিক ও পদার্থবিষয়ক অনুষদ এবং IIT)",
      unitNameEn: "JU A Unit (Mathematical & Physical Sciences, IIT)",
      totalMarks: 80,
      durationMin: 55,
      negativeMarking: 0.20,
      passMark: 27,
      hasWritten: false,
      hasMcq: true,
      sections: [
        { key: "math", nameBn: "গণিত", nameEn: "Mathematics", marks: 22, questions: 22, writtenMarks: 0, mcqMarks: 22, isOptional: false },
        { key: "physics", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", marks: 22, questions: 22, writtenMarks: 0, mcqMarks: 22, isOptional: false },
        { key: "chemistry", nameBn: "রসায়ন", nameEn: "Chemistry", marks: 22, questions: 22, writtenMarks: 0, mcqMarks: 22, isOptional: false },
        { key: "bangla", nameBn: "বাংলা", nameEn: "Bangla", marks: 3, questions: 3, writtenMarks: 0, mcqMarks: 3, isOptional: false },
        { key: "english", nameBn: "ইংরেজি", nameEn: "English", marks: 3, questions: 3, writtenMarks: 0, mcqMarks: 3, isOptional: false },
        { key: "it", nameBn: "আইসিটি ও আইকিউ", nameEn: "ICT & IQ", marks: 8, questions: 8, writtenMarks: 0, mcqMarks: 8, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 1.5,
        hscWeight: 2.5,
        sscMax: 7.5,
        hscMax: 12.5,
        testWeight: 1,
        testMax: 80,
        totalMerit: 100,
        descriptionBn: "ভর্তি পরীক্ষা ৮০ নম্বর + SSC GPA × ১.৫ + HSC GPA × ২.৫ = মোট ১০০ নম্বর",
        descriptionEn: "Test 80 marks + SSC GPA × 1.5 + HSC GPA × 2.5 = Total 100",
        notesBn: "ভুল উত্তরের জন্য ০.২০ নম্বর কাটা যাবে। ওএমআর পূরণের জন্য অতিরিক্ত ৫ মিনিট বরাদ্দ।"
      },
      source: "https://juniv-admission.org",
      verifiedOn: "2026-10-25"
    },

    // 7. Military Institute of Science & Technology (MIST)
    {
      uniId: 19,
      unitKey: "mist-a",
      unitName: "এমআইএসটি ইউনিট A (ইঞ্জিনিয়ারিং)",
      unitNameEn: "MIST Unit A (Engineering)",
      totalMarks: 100,
      durationMin: 120,
      negativeMarking: 0,
      passMark: 40,
      hasWritten: true,
      hasMcq: false,
      sections: [
        { key: "math", nameBn: "উচ্চতর গণিত (লিখিত)", nameEn: "Mathematics (Written)", marks: 40, questions: 8, writtenMarks: 40, mcqMarks: 0, isOptional: false },
        { key: "physics", nameBn: "পদার্থবিজ্ঞান (লিখিত)", nameEn: "Physics (Written)", marks: 30, questions: 6, writtenMarks: 30, mcqMarks: 0, isOptional: false },
        { key: "chemistry", nameBn: "রসায়ন (লিখিত)", nameEn: "Chemistry (Written)", marks: 20, questions: 4, writtenMarks: 20, mcqMarks: 0, isOptional: false },
        { key: "english", nameBn: "ইংরেজি", nameEn: "English", marks: 10, questions: 5, writtenMarks: 10, mcqMarks: 0, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 0,
        hscWeight: 0,
        sscMax: 0,
        hscMax: 0,
        testWeight: 1,
        testMax: 100,
        totalMerit: 100,
        descriptionBn: "ভর্তি পরীক্ষা ১০০ নম্বরের লিখিত স্কোরের উপর মেধা তালিকা",
        descriptionEn: "Merit list based on 100 marks written exam",
        notesBn: "সম্পূর্ণ লিখিত পরীক্ষা। শর্ট ক্যালকুলেটর অনুমোদিত।"
      },
      source: "https://admission.mist.ac.bd",
      verifiedOn: "2026-10-25"
    },

    // 8. BUTEX (Bangladesh University of Textiles)
    {
      uniId: 8,
      unitKey: "butex-eng",
      unitName: "বুটেক্স ভর্তি পরীক্ষা",
      unitNameEn: "BUTEX Admission Test",
      totalMarks: 200,
      durationMin: 120,
      negativeMarking: 0,
      passMark: 70,
      hasWritten: true,
      hasMcq: false,
      sections: [
        { key: "physics", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", marks: 60, questions: 10, writtenMarks: 60, mcqMarks: 0, isOptional: false },
        { key: "chemistry", nameBn: "রসায়ন", nameEn: "Chemistry", marks: 60, questions: 10, writtenMarks: 60, mcqMarks: 0, isOptional: false },
        { key: "math", nameBn: "উচ্চতর গণিত", nameEn: "Higher Mathematics", marks: 60, questions: 10, writtenMarks: 60, mcqMarks: 0, isOptional: false },
        { key: "english", nameBn: "ইংরেজি", nameEn: "English", marks: 20, questions: 5, writtenMarks: 20, mcqMarks: 0, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 0,
        hscWeight: 0,
        sscMax: 0,
        hscMax: 0,
        testWeight: 1,
        testMax: 200,
        totalMerit: 200,
        descriptionBn: "চূড়ান্ত লিখিত পরীক্ষার ২০০ নম্বরের ভিত্তিতে মেধা তালিকা",
        descriptionEn: "Merit based on 200 marks final written test",
        notesBn: "লিখিত প্রশ্নের মান সাধারণত প্রতি প্রশ্নে ৬ নম্বর।"
      },
      source: "https://www.butex.edu.bd",
      verifiedOn: "2026-10-25"
    },

    // 9. Engineering Cluster / RUET / KUET / CUET
    {
      uniId: 13,
      unitKey: "kuet-eng",
      unitName: "কুয়েট / রুয়েট / চুয়েট ইঞ্জিনিয়ারিং",
      unitNameEn: "KUET / RUET / CUET Engineering",
      totalMarks: 500,
      durationMin: 150,
      negativeMarking: 0.25,
      passMark: 150,
      hasWritten: false,
      hasMcq: true,
      sections: [
        { key: "math", nameBn: "উচ্চতর গণিত", nameEn: "Mathematics", marks: 150, questions: 25, writtenMarks: 0, mcqMarks: 150, isOptional: false },
        { key: "physics", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", marks: 150, questions: 25, writtenMarks: 0, mcqMarks: 150, isOptional: false },
        { key: "chemistry", nameBn: "রসায়ন", nameEn: "Chemistry", marks: 150, questions: 25, writtenMarks: 0, mcqMarks: 150, isOptional: false },
        { key: "english", nameBn: "ইংরেজি", nameEn: "English", marks: 50, questions: 25, writtenMarks: 0, mcqMarks: 50, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 0,
        hscWeight: 0,
        sscMax: 0,
        hscMax: 0,
        testWeight: 1,
        testMax: 500,
        totalMerit: 500,
        descriptionBn: "ভর্তি পরীক্ষার ৫০০ নম্বরের ভিত্তিতে মেধা তালিকা",
        descriptionEn: "Merit list based purely on 500 marks admission test",
        notesBn: "প্রতিটি সঠিক উত্তরের মান ৬ নম্বর, ভুল উত্তরের জন্য ১.৫ নম্বর কাটা (০.২৫ অনুপাত)।"
      },
      source: "https://admission.kuet.ac.bd",
      verifiedOn: "2026-10-25"
    },

    // 10. BUP (Bangladesh University of Professionals) - FST
    {
      uniId: 21,
      unitKey: "bup-fst",
      unitName: "বিইউপি এফএসটি (বিজ্ঞান ও প্রযুক্তি অনুষদ)",
      unitNameEn: "BUP FST (Science & Technology)",
      totalMarks: 80,
      durationMin: 60,
      negativeMarking: 0.25,
      passMark: 32,
      hasWritten: false,
      hasMcq: true,
      sections: [
        { key: "math", nameBn: "উচ্চতর গণিত", nameEn: "Mathematics", marks: 25, questions: 25, writtenMarks: 0, mcqMarks: 25, isOptional: false },
        { key: "physics", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", marks: 25, questions: 25, writtenMarks: 0, mcqMarks: 25, isOptional: false },
        { key: "chemistry", nameBn: "রসায়ন", nameEn: "Chemistry", marks: 15, questions: 15, writtenMarks: 0, mcqMarks: 15, isOptional: false },
        { key: "english", nameBn: "ইংরেজি", nameEn: "English", marks: 15, questions: 15, writtenMarks: 0, mcqMarks: 15, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 2,
        hscWeight: 2,
        sscMax: 10,
        hscMax: 10,
        testWeight: 0.7,
        testMax: 70,
        totalMerit: 100,
        descriptionBn: "MCQ স্কোর (৭০%) + SSC GPA (১০%) + HSC GPA (১০%) + ভাইভা (১০%) = ১০০%",
        descriptionEn: "MCQ (70%) + SSC (10%) + HSC (10%) + Viva (10%) = 100%",
        notesBn: "লিখিত ৮০ নম্বরের MCQ-কে ৭০% ওয়েটে রূপান্তর করা হয়।"
      },
      source: "https://admission.bup.edu.bd",
      verifiedOn: "2026-10-25"
    },

    // 11. Top Private University Example: BRAC University
    {
      uniId: 43,
      unitKey: "bracu-adm",
      unitName: "ব্র্যাক বিশ্ববিদ্যালয় ভর্তি পরীক্ষা",
      unitNameEn: "BRAC University Admission Test",
      totalMarks: 100,
      durationMin: 120,
      negativeMarking: 0,
      passMark: 50,
      hasWritten: true,
      hasMcq: true,
      sections: [
        { key: "english", nameBn: "ইংরেজি ব্যাকরণ ও কম্পোজিশন", nameEn: "English Language & Comp", marks: 50, questions: 40, writtenMarks: 20, mcqMarks: 30, isOptional: false },
        { key: "math", nameBn: "ম্যাথমেটিক্স ও লজিক", nameEn: "General / Higher Math", marks: 50, questions: 35, writtenMarks: 15, mcqMarks: 35, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 0,
        hscWeight: 0,
        sscMax: 0,
        hscMax: 0,
        testWeight: 1,
        testMax: 100,
        totalMerit: 100,
        descriptionBn: "ভর্তি পরীক্ষা ও মৌখিক ইন্টারভিউয়ের যৌথ মূল্যায়ন",
        descriptionEn: "Comprehensive test & faculty interview assessment",
        notesBn: "ইঞ্জিনিয়ারিং আবেদনকারীদের জন্য উচ্চতর গণিত ও পদার্থবিজ্ঞান প্রশ্ন অন্তর্ভুক্ত।"
      },
      source: "https://www.bracu.ac.bd/admissions",
      verifiedOn: "2026-10-25"
    },

    // 12. Top Private University Example: North South University (NSU)
    {
      uniId: 44,
      unitKey: "nsu-adm",
      unitName: "নর্থ সাউথ বিশ্ববিদ্যালয় ভর্তি পরীক্ষা",
      unitNameEn: "North South University (NSU) Test",
      totalMarks: 100,
      durationMin: 120,
      negativeMarking: 0,
      passMark: 50,
      hasWritten: true,
      hasMcq: true,
      sections: [
        { key: "english", nameBn: "ইংরেজি ব্যাকরণ ও ভোকাবুলারি", nameEn: "English Grammar & Vocab", marks: 40, questions: 40, writtenMarks: 0, mcqMarks: 40, isOptional: false },
        { key: "math", nameBn: "কোয়ান্টিটেটিভ ম্যাথ", nameEn: "Quantitative Math", marks: 40, questions: 40, writtenMarks: 0, mcqMarks: 40, isOptional: false },
        { key: "written", nameBn: "ইংরেজি রচনা / কম্পোজিশন", nameEn: "Written Essay", marks: 20, questions: 1, writtenMarks: 20, mcqMarks: 0, isOptional: false }
      ],
      meritFormula: {
        sscWeight: 0,
        hscWeight: 0,
        sscMax: 0,
        hscMax: 0,
        testWeight: 1,
        testMax: 100,
        totalMerit: 100,
        descriptionBn: "ভর্তি পরীক্ষার ১০০ নম্বর ও ইন্টারভিউ",
        descriptionEn: "Test score 100 marks + departmental interview",
        notesBn: "নেগেটিভ মার্কিং নেই। ইঞ্জিনিয়ারিং শিক্ষার্থীদের ফিজিক্স ও হায়ার ম্যাথ দিতে হয়।"
      },
      source: "http://admissions.northsouth.edu",
      verifiedOn: "2026-10-25"
    }
  ];

  // Helper function to resolve marks info for any university in directory
  function getMarksDataForUni(uniId) {
    const matches = ADMISSION_MARKS_DATA.filter(m => m.uniId === Number(uniId));
    if (matches.length > 0) return matches;

    // Default unverified / awaiting circular template for other universities
    const uni = (app.state && app.state.universities) ? app.state.universities.find(u => u.id === Number(uniId)) : null;
    return [{
      uniId: Number(uniId),
      unitKey: `unit-${uniId}-general`,
      unitName: (uni ? uni.name : "ভর্তি পরীক্ষা") + " (সাধারণ ইউনিট)",
      unitNameEn: (uni ? (app.UNI_NAMES_EN[uni.id] || uni.name) : "Admission Test"),
      totalMarks: null,
      durationMin: null,
      negativeMarking: null,
      passMark: null,
      hasWritten: null,
      hasMcq: null,
      sections: [],
      meritFormula: {
        sscWeight: null,
        hscWeight: null,
        sscMax: null,
        hscMax: null,
        testWeight: null,
        testMax: null,
        totalMerit: null,
        descriptionBn: "সার্কুলার এখনো অপ্রকাশিত — অফিসিয়াল নোটিশ প্রকাশের পর আপডেট করা হবে",
        descriptionEn: "Circular not yet published — check back after official announcement",
        notesBn: "অফিসিয়াল সার্কুলার লিংক দেখে সর্বশেষ আপডেট নিশ্চিত করুন।"
      },
      source: uni ? uni.circularUrl : null,
      verifiedOn: null
    }];
  }

  function getAllMarksData() {
    return ADMISSION_MARKS_DATA;
  }

  app.ADMISSION_MARKS_DATA = window.ADMISSION_MARKS_DATA = ADMISSION_MARKS_DATA;
  app.getMarksDataForUni = window.getMarksDataForUni = getMarksDataForUni;
  app.getAllMarksData = window.getAllMarksData = getAllMarksData;
})(window);
