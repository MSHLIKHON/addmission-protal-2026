/**
 * universities.data.js
 * University data model constructor and default dataset of universities for 2026-2027.
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

    function U(id, serialBn, name, keywords, category, examDateText, isoExamDate, deadlineText, feeText, defaultFee, feeOptions, circularUrl) {
      const monthGroup = (!isoExamDate || isoExamDate === "9999-12-31") ? "unpublished" : isoExamDate.slice(0, 7);
      const hasDeadline = Boolean(deadlineText && deadlineText.trim() !== "" && !deadlineText.includes("অপ্রকাশিত") && !deadlineText.includes("ফাঁকা"));
      return {
        id, serialBn, name, keywords, category,
        examDateText: examDateText || "",
        isoExamDate: isoExamDate || "9999-12-31",
        examMonthGroup: monthGroup,
        deadlineText: deadlineText || "",
        hasDeadline,
        feeText: feeText || "১০০০",
        defaultFee: defaultFee || 1000,
        selectedFee: defaultFee || 1000,
        feeOptions: feeOptions || [{ label: `${feeText} - ৳ ${defaultFee}`, amount: defaultFee }],
        circularUrl,
        status: "pending",
        target: false,
        userId: "",
        userPass: "",
        examRoll: "",
        note: ""
      };
    }

    const INITIAL_UNIVERSITIES = [
      U(1, "১", "ঢাকা বিশ্ববিদ্যালয় (DU)", "du dhaka university ঢাবি ঢাকা বিশ্ববিদ্যালয় iba", "general", "৪ ডিসেম্বর (IBA), ১২ ডিসেম্বর (ক ইউনিট)", "2026-12-12", "১১ নভেম্বর - ২৫ নভেম্বর", "১০৫০", 1050, [{ label: "ক ইউনিট (বিজ্ঞান) - ৳ ১০৫০", amount: 1050 }, { label: "IBA ইউনিট - ৳ ১৫০০", amount: 1500 }, { label: "খ/গ ইউনিট - ৳ ১০৫০", amount: 1050 }], "https://admission.eis.du.ac.bd"),
      U(2, "২", "জাহাঙ্গীরনগর বিশ্ববিদ্যালয় (JU)", "ju jahangirnagar university জাবি জাহাঙ্গীরনগর", "general", "ফেব্রুয়ারি ২০২৭* (নোটিশ শীঘ্রই)", "9999-12-31", "", "A- ৮০০, D- ৮০০", 800, [{ label: "A ইউনিট - ৳ ৮০০", amount: 800 }, { label: "D ইউনিট - ৳ ৮০০", amount: 800 }, { label: "A + D উভয় ইউনিট - ৳ ১৬০০", amount: 1600 }], "https://juniv-admission.org"),
      U(3, "৩", "জগন্নাথ বিশ্ববিদ্যালয় (JnU)", "jnu jagannath university জবি জগন্নাথ", "general", "৩১ ডিসেম্বর (A), ৭-২২ জানুয়ারি (অন্যান্য)", "2026-12-31", "১৫ নভেম্বর - ১০ ডিসেম্বর", "১০১০", 1010, [{ label: "বিজ্ঞান ইউনিট (A) - ৳ ১০১০", amount: 1010 }], "https://admission.jnu.ac.bd"),
      U(4, "৪", "রাজশাহী বিশ্ববিদ্যালয় (RU)", "ru rajshahi university রাবি রাজশাহী", "general", "৭ জানুয়ারি (B)*, ৮ জানুয়ারি (C)*, ১৫ জানুয়ারি (A)*", "2027-01-08", "১২ নভেম্বর - ২৭ নভেম্বর", "১৩২০", 1320, [{ label: "C ইউনিট (বিজ্ঞান) - ৳ ১৩২০", amount: 1320 }], "https://admission.ru.ac.bd"),
      U(5, "৫", "চট্টগ্রাম বিশ্ববিদ্যালয় (CU)", "cu chittagong university চবি চট্টগ্রাম", "general", "২৮ জানু (C)*, ২৯ জানু (A)*, ২-৭ ফেব্রু (B/D)*", "2027-01-29", "১৫ নভেম্বর - ১০ ডিসেম্বর", "১০০০", 1000, [{ label: "A ইউনিট (বিজ্ঞান) - ৳ ১০০০", amount: 1000 }], "https://admission.cu.ac.bd"),
      U(6, "৬", "খুলনা বিশ্ববিদ্যালয় (KU)", "ku khulna university খুবি খুলনা", "general", "১৭ ডিসেম্বর (C, D), ১৮ ডিসেম্বর (A, B)", "2026-12-18", "১০ নভেম্বর - ৩০ নভেম্বর*", "১৩০০", 1300, [{ label: "A / B ইউনিট - ৳ ১৩০০", amount: 1300 }], "https://admission.ku.ac.bd"),
      U(7, "৭", "কুমিল্লা বিশ্ববিদ্যালয় (CoU)", "cou comilla university কুবি কুমিল্লা", "general", "৪ ফেব্রুয়ারি (A), ৫ ফেব্রুয়ারি (B), ৬ ফেব্রুয়ারি (C)", "2027-02-04", "১৫ নভেম্বর - ১০ ডিসেম্বর", "১০০০", 1000, [{ label: "A ইউনিট (বিজ্ঞান) - ৳ ১০০০", amount: 1000 }], "https://cou.ac.bd"),
      U(8, "৮", "বাংলাদেশ টেক্সটাইল বিশ্ববিদ্যালয় (BUTEX)", "butex textile বুটেক্স টেক্সটাইল", "engineering", "২৮-২৯ জানুয়ারি", "2027-01-28", "", "প্রাথমিক- ৩০০, চূড়ান্ত- ১২০০", 1500, [{ label: "প্রাথমিক + চূড়ান্ত (মোট) - ৳ ১৫০০", amount: 1500 }, { label: "শুধু চূড়ান্ত ফি - ৳ ১২০০", amount: 1200 }, { label: "শুধু প্রাথমিক ফি - ৳ ৩০০", amount: 300 }], "https://www.butex.edu.bd"),
      U(9, "৯", "মেডিকেল ও ডেন্টাল ( সরকারি MBBS / BDS )", "medical dental mbbs bds dgme মেডিকেল ডেন্টাল", "medical", "৪ ডিসেম্বর* (সকাল ১০টা)", "2026-12-04", "নভেম্বর ২০২৬*", "১০০০", 1000, [{ label: "এমবিবিএস / বিডিএস - ৳ ১০০০", amount: 1000 }], "https://dgme.teletalk.com.bd"),
      U(10, "১০", "আর্মড ফোর্সেস ও আর্মি মেডিকেল (AFMC & AMC)", "afmc amc armed forces medical আর্মড ফোর্সেস মেডিকেল", "medical", "ডিসেম্বর ২০২৬*", "9999-12-31", "", "১০০০", 1000, [{ label: "AFMC / AMC আবেদন ফি - ৳ ১০০০", amount: 1000 }], "http://afmc.teletalk.com.bd"),
      U(11, "১১", "বুয়েট (BUET)", "buet bangladesh university of engineering and technology বুয়েট", "engineering", "১৫-১৬ জানুয়ারি (সকাল ১০টা)", "2027-01-16", "নভেম্বর - ডিসেম্বর*", "ইঞ্জিনিয়ারিং- ১৩০০, আর্কিটেকচার- ১৫০০", 1300, [{ label: "ইঞ্জিনিয়ারিং ও URP (ক গ্রুপ) - ৳ ১৩০০", amount: 1300 }, { label: "ইঞ্জিনিয়ারিং + আর্কিটেকচার (খ গ্রুপ) - ৳ ১৫০০", amount: 1500 }], "http://ugadmission.buet.ac.bd"),
      U(12, "১২", "রুয়েট (RUET)", "ruet rajshahi engineering রুয়েট", "engineering", "১৩-১৪ জানুয়ারি* (সম্ভাব্য)", "2027-01-14", "", "ক- ১৩০০, খ- ১৫০০", 1300, [{ label: "ক গ্রুপ (ইঞ্জিনিয়ারিং) - ৳ ১৩০০", amount: 1300 }, { label: "খ গ্রুপ (ইঞ্জিনিয়ারিং + আর্কিটেকচার) - ৳ ১৫০০", amount: 1500 }], "https://admission.ruet.ac.bd"),
      U(13, "১৩", "কুয়েট (KUET)", "kuet khulna engineering কুয়েট", "engineering", "৭-৮ জানুয়ারি (সকাল ১০টা)", "2027-01-08", "", "ক- ১২০০, খ- ১২০০", 1200, [{ label: "ক গ্রুপ - ৳ ১২০০", amount: 1200 }, { label: "খ গ্রুপ - ৳ ১২০০", amount: 1200 }], "https://admission.kuet.ac.bd"),
      U(14, "১৪", "চুয়েট (CUET)", "cuet chittagong engineering চুয়েট", "engineering", "২২-২৩ জানুয়ারি* (সম্ভাব্য)", "2027-01-23", "", "ক- ১২০০, খ- ১৪০০", 1200, [{ label: "ক গ্রুপ (ইঞ্জিনিয়ারিং) - ৳ ১২০০", amount: 1200 }, { label: "খ গ্রুপ (ইঞ্জিনিয়ারিং + আর্কিটেকচার) - ৳ ১৪০০", amount: 1400 }], "https://admission.cuet.ac.bd"),
      U(15, "১৫", "কৃষি গুচ্ছ (৯টি সরকারি কৃষি বিশ্ববিদ্যালয়)", "agri gst agricultural cluster কৃষি গুচ্ছ", "specialized", "২ জানুয়ারি (সকাল ১১টা)", "2027-01-02", "", "১২০০", 1200, [{ label: "কৃষি গুচ্ছ আবেদন ফি - ৳ ১২০০", amount: 1200 }], "https://acas.edu.bd"),
      U(16, "১৬", "জিএসটি গুচ্ছ (GST — ২৪টি সাধারণ ও প্রযুক্তি বিশ্ববিদ্যালয়)", "gst cluster general science technology গুচ্ছ", "general", "১৮ মার্চ (B), ১৯ মার্চ (C), ২৬-২৭ মার্চ (A)", "2027-03-27", "", "১৫০০", 1500, [{ label: "A ইউনিট (বিজ্ঞান) - ৳ ১৫০০", amount: 1500 }], "https://gstadmission.ac.bd"),
      U(17, "১৭", "শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (SUST)", "sust shahjalal science technology শাবিপ্রবি সাস্ট", "scitech", "২৬ জানুয়ারি (A1)* ও ২৭ জানুয়ারি (B)*", "2027-01-26", "", "A- ১২৫০, ARC- ১৪০০", 1250, [{ label: "A ইউনিট (বিজ্ঞান) - ৳ ১২৫০", amount: 1250 }, { label: "A ইউনিট + আর্কিটেকচার (ARC) - ৳ ১৪০০", amount: 1400 }], "https://admission.sust.edu.bd"),
      U(18, "১৮", "হাজী মোহাম্মদ দানেশ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (HSTU)", "hstu hajee danesh হাবিপ্রবি হাজী দানেশ", "scitech", "২৩-২৮ জানুয়ারি*", "2027-01-24", "", "সাধারণ- ১০০০, আর্কিটেকচার- ১২০০", 1000, [{ label: "সাধারণ ইউনিট - ৳ ১০০০", amount: 1000 }, { label: "আর্কিটেকচার সহ - ৳ ১২০০", amount: 1200 }], "https://hstu.ac.bd/admission"),
      U(19, "১৯", "মিলিটারি ইনস্টিটিউট অব সায়েন্স অ্যান্ড টেকনোলজি (MIST)", "mist military institute এমআইএসটি", "engineering", "১৮-১৯ ডিসেম্বর (A, B) ও ২৫-২৬ ডিসেম্বর (C)", "2026-12-19", "", "A- ১২০০, B- ১৪০০", 1200, [{ label: "A ইউনিট (ইঞ্জিনিয়ারিং) - ৳ ১২০০", amount: 1200 }, { label: "A + B ইউনিট (আর্কিটেকচার সহ) - ৳ ১৪০০", amount: 1400 }], "https://admission.mist.ac.bd"),
      U(20, "২০", "ইসলামিক ইউনিভার্সিটি অব টেকনোলজি (IUT)", "iut islamic university of technology oic আইইউটি", "engineering", "", "9999-12-31", "", "প্রাথমিক- ৩০০, চূড়ান্ত- ১২০০", 1500, [{ label: "প্রাথমিক + চূড়ান্ত (মোট) - ৳ ১৫০০", amount: 1500 }, { label: "শুধু চূড়ান্ত ফি - ৳ ১২০০", amount: 1200 }, { label: "শুধু প্রাথমিক ফি - ৳ ৩০০", amount: 300 }], "https://admission.iutoic-dhaka.edu"),
      U(21, "২১", "বাংলাদেশ ইউনিভার্সিটি অব প্রফেশনালস (BUP)", "bup bangladesh university of professionals বিইউপি", "specialized", "৩১ ডিসে (FBS), ২ জানু (FASS), ৭-৯ জানু (FST/FSSS)", "2027-01-08", "", "১১০০", 1100, [{ label: "প্রতি ফ্যাকাল্টি (FST/FET/FMS) - ৳ ১১০০", amount: 1100 }], "https://admission.bup.edu.bd"),
      U(22, "২২", "ঢাকা সেন্ট্রাল ইউনিভার্সিটি (DCU / ৭ কলেজ)", "dhaka central university dcu ৭ কলেজ সাত কলেজ", "general", "", "9999-12-31", "", "৮০০", 800, [{ label: "বিজ্ঞান ইউনিট - ৳ ৮০০", amount: 800 }], "https://collegeadmission.eis.du.ac.bd"),
      U(23, "২৩", "বাংলাদেশ মেরিটাইম বিশ্ববিদ্যালয় (BMU / BSMRMU)", "maritime university bsmrmu bmu মেরিটাইম", "specialized", "২৯ ও ৩০ ডিসেম্বর", "2026-12-29", "", "৮০০", 800, [{ label: "প্রতি ফ্যাকাল্টি আবেদন ফি - ৳ ৮০০", amount: 800 }], "https://apply.bsmrmu.edu.bd"),
      U(24, "২৪", "অ্যাভিয়েশন অ্যান্ড অ্যারোস্পেস বিশ্ববিদ্যালয় (BAAU)", "aviation aerospace university baau এভিয়েশন aaub", "specialized", "৪-৫ ডিসেম্বর (সকাল ১০টা)", "2026-12-05", "", "১০০০", 1000, [{ label: "আবেদন ফি - ৳ ১০০০", amount: 1000 }], "https://baau.edu.bd"),
      U(25, "২৫", "সরকারি নার্সিং ও মিডওয়াইফারি (BNMC)", "nursing bsc diploma bnmc নার্সিং মিডওয়াইফারি", "medical", "", "9999-12-31", "", "বিএসসি- ৭০০, ডিপ্লোমা- ৫০০", 700, [{ label: "বিএসসি ইন নার্সিং - ৳ ৭০০", amount: 700 }, { label: "ডিপ্লোমা ইন নার্সিং - ৳ ৫০০", amount: 500 }], "http://bnmc.teletalk.com.bd"),
      U(26, "২৬", "টেক্সটাইল ইঞ্জিনিয়ারিং কলেজসমূহ (BUTEX অধিভুক্ত)", "butex affiliated textile engineering college dot", "engineering", "", "9999-12-31", "", "১০০০", 1000, [{ label: "আবেদন ফি - ৳ ১০০০", amount: 1000 }], "http://dot.teletalk.com.bd"),
      U(27, "২৭", "ঢাবি প্রযুক্তি ইউনিট (ইঞ্জিনিয়ারিং কলেজসমূহ)", "du technology unit ঢাবি প্রযুক্তি ইউনিট", "engineering", "", "9999-12-31", "", "৮৫০", 850, [{ label: "প্রযুক্তি ইউনিট ফি - ৳ ৮৫০", amount: 850 }], "https://collegeadmission.eis.du.ac.bd"),
      U(28, "২৮", "বাংলাদেশ হেলথ প্রফেশনস ইনস্টিটিউট (BHPI)", "bhpi crp health professions হেলথ প্রফেশনস", "medical", "", "9999-12-31", "", "১০১০", 1010, [{ label: "বিএসসি প্রোগ্রাম ফি - ৳ ১০১০", amount: 1010 }], "https://www.bhpi.edu.bd/bachelor-program/"),
      U(29, "২৯", "জাতীয় বিশ্ববিদ্যালয় (National University - NU)", "nu national university জাতীয় বিশ্ববিদ্যালয়", "general", "জানুয়ারি-ফেব্রুয়ারি ২০২৭*", "9999-12-31", "", "১০০০", 1000, [{ label: "ভর্তি আবেদন ফি - ৳ ১০০০", amount: 1000 }], "http://app1.nu.edu.bd"),
      U(30, "৩০", "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়, ময়মনসিংহ (BAU)", "bau bangladesh agricultural university বাকৃবি ময়মনসিংহ", "specialized", "২ জানুয়ারি (কৃষি গুচ্ছ)", "2027-01-02", "", "১২০০", 1200, [{ label: "কৃষি গুচ্ছ ফি - ৳ ১২০০", amount: 1200 }], "https://bau.edu.bd"),
      U(31, "৩১", "শেরেবাংলা কৃষি বিশ্ববিদ্যালয়, ঢাকা (SAU)", "sau sher-e-bangla agricultural শেকৃবি", "specialized", "২ জানুয়ারি (কৃষি গুচ্ছ)", "2027-01-02", "", "১২০০", 1200, [{ label: "কৃষি গুচ্ছ ফি - ৳ ১২০০", amount: 1200 }], "https://sau.edu.bd"),
      U(32, "৩২", "গাজীপুর কৃষি বিশ্ববিদ্যালয় (GAU / BSMRAU)", "gau bsmrau gazipur agricultural গাজীপুর কৃষি", "specialized", "২ জানুয়ারি (কৃষি গুচ্ছ)", "2027-01-02", "", "১২০০", 1200, [{ label: "কৃষি গুচ্ছ ফি - ৳ ১২০০", amount: 1200 }], "https://bsmrau.edu.bd"),
      U(33, "৩৩", "পটুয়াখালী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (PSTU)", "pstu patuakhali science technology পবিপ্রবি", "scitech", "২ জানুয়ারি (কৃষি গুচ্ছ/জিএসটি)", "2027-01-02", "", "১২০০", 1200, [{ label: "আবেদন ফি - ৳ ১২০০", amount: 1200 }], "https://pstu.ac.bd"),
      U(34, "৩৪", "ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া (IU)", "iu islamic university kushtia ইবি কুষ্টিয়া", "general", "২৭ মার্চ (জিএসটি গুচ্ছ)", "2027-03-27", "", "১৫০০", 1500, [{ label: "A ইউনিট / জিএসটি - ৳ ১৫০০", amount: 1500 }], "https://www.iu.ac.bd"),
      U(35, "৩৫", "মাওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)", "mbstu mawlana bhashani মাভাবিপ্রবি টাঙ্গাইল", "scitech", "২৭ মার্চ (জিএসটি গুচ্ছ)", "2027-03-27", "", "১৫০০", 1500, [{ label: "A ইউনিট / জিএসটি - ৳ ১৫০০", amount: 1500 }], "https://mbstu.ac.bd"),
      U(36, "৩৬", "নোয়াখালী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (NSTU)", "nstu noakhali science technology নোবিপ্রবি", "scitech", "২৭ মার্চ (জিএসটি গুচ্ছ)", "2027-03-27", "", "১৫০০", 1500, [{ label: "A ইউনিট / জিএসটি - ৳ ১৫০০", amount: 1500 }], "https://nstu.edu.bd"),
      U(37, "৩৭", "যশোর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (JUST)", "just jashore science technology যবিপ্রবি যশোর", "scitech", "২৭ মার্চ (জিএসটি গুচ্ছ)", "2027-03-27", "", "১৫০০", 1500, [{ label: "A ইউনিট / জিএসটি - ৳ ১৫০০", amount: 1500 }], "https://just.edu.bd"),
      U(38, "৩৮", "পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (PUST)", "pust pabna science technology পাবিপ্রবি পাবনা", "scitech", "২৭ মার্চ (জিএসটি গুচ্ছ)", "2027-03-27", "", "১৫০০", 1500, [{ label: "A ইউনিট / জিএসটি - ৳ ১৫০০", amount: 1500 }], "https://pust.ac.bd"),
      U(39, "৩৯", "বেগম রোকেয়া বিশ্ববিদ্যালয়, রংপুর (BRUR)", "brur begum rokeya রংপুর বেরোবি", "general", "২৭ মার্চ (জিএসটি গুচ্ছ)", "2027-03-27", "", "১৫০০", 1500, [{ label: "A ইউনিট / জিএসটি - ৳ ১৫০০", amount: 1500 }], "https://brur.ac.bd"),
      U(40, "৪০", "বরিশাল বিশ্ববিদ্যালয় (BU)", "bu university of barishal ববি বরিশাল", "general", "২৭ মার্চ (জিএসটি গুচ্ছ)", "2027-03-27", "", "১৫০০", 1500, [{ label: "A ইউনিট / জিএসটি - ৳ ১৫০০", amount: 1500 }], "https://barisaluniv.ac.bd"),
      U(41, "৪১", "জাতীয় কবি কাজী নজরুল ইসলাম বিশ্ববিদ্যালয় (JKKNIU)", "jkkniu nazrul university ত্রিশাল নজরুল", "general", "২৭ মার্চ (জিএসটি গুচ্ছ)", "2027-03-27", "", "১৫০০", 1500, [{ label: "A ইউনিট / জিএসটি - ৳ ১৫০০", amount: 1500 }], "https://jkkniu.edu.bd"),
      U(42, "৪২", "গোপালগঞ্জ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (BSMRSTU)", "bsmrstu gopalganj science technology গোপালগঞ্জ", "scitech", "২৭ মার্চ (জিএসটি গুচ্ছ)", "2027-03-27", "", "১৫০০", 1500, [{ label: "A ইউনিট / জিএসটি - ৳ ১৫০০", amount: 1500 }], "https://bsmrstu.edu.bd"),
      U(43, "৪৩", "ব্র্যাক ইউনিভার্সিটি (BRAC University)", "bracu brac university private ব্র্যাক প্রাইভেট", "private", "", "9999-12-31", "", "১৫০০", 1500, [{ label: "ভর্তি আবেদন ফি - ৳ ১৫০০", amount: 1500 }], "https://www.bracu.ac.bd/admissions"),
      U(44, "৪৪", "নর্থ সাউথ ইউনিভার্সিটি (North South University - NSU)", "nsu north south university private নর্থ সাউথ প্রাইভেট", "private", "", "9999-12-31", "", "১৫০০", 1500, [{ label: "ভর্তি আবেদন ফি - ৳ ১৫০০", amount: 1500 }], "http://admissions.northsouth.edu"),
      U(45, "৪৫", "আহ্ছানউল্লা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (AUST)", "aust ahsanullah science technology private আহছানউল্লা প্রাইভেট", "private", "", "9999-12-31", "", "১৫০০", 1500, [{ label: "ইঞ্জিনিয়ারিং / আর্কিটেকচার - ৳ ১৫০০", amount: 1500 }], "https://admission.aust.edu"),
      U(46, "৪৬", "ইস্ট ওয়েস্ট ইউনিভার্সিটি (East West University - EWU)", "ewu east west university private ইস্ট ওয়েস্ট প্রাইভেট", "private", "", "9999-12-31", "", "১২০০", 1200, [{ label: "ভর্তি আবেদন ফি - ৳ ১২০০", amount: 1200 }], "https://admissions.ewubd.edu"),
      U(47, "৪৭", "ইনডিপেনডেন্ট ইউনিভার্সিটি, বাংলাদেশ (IUB)", "iub independent university bangladesh private ইনডিপেনডেন্ট প্রাইভেট", "private", "", "9999-12-31", "", "১০০০", 1000, [{ label: "ভর্তি আবেদন ফি - ৳ ১০০০", amount: 1000 }], "http://www.iub.edu.bd/admissions"),
      U(48, "৪৮", "আমেরিকান ইন্টারন্যাশনাল ইউনিভার্সিটি-বাংলাদেশ (AIUB)", "aiub american international university private এআইইউবি প্রাইভেট", "private", "", "9999-12-31", "", "১৫০০", 1500, [{ label: "ভর্তি আবেদন ফি - ৳ ১৫০০", amount: 1500 }], "https://www.aiub.edu/admission"),
      U(49, "৪৯", "ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (UIU)", "uiu united international university private ইউআইইউ প্রাইভেট", "private", "", "9999-12-31", "", "১০০০", 1000, [{ label: "ভর্তি আবেদন ফি - ৳ ১০০০", amount: 1000 }], "https://www.uiu.ac.bd/admission/"),
      U(50, "৫০", "ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (DIU)", "diu daffodil international university private ড্যাফোডিল প্রাইভেট", "private", "", "9999-12-31", "", "১০০০", 1000, [{ label: "ভর্তি আবেদন ফি - ৳ ১০০০", amount: 1000 }], "https://admission.daffodilvarsity.edu.bd"),
      U(51, "৫১", "ইউনিভার্সিটি অব লিবারেল আর্টস বাংলাদেশ (ULAB)", "ulab liberal arts bangladesh private ইউল্যাব প্রাইভেট", "private", "", "9999-12-31", "", "১০০০", 1000, [{ label: "ভর্তি আবেদন ফি - ৳ ১০০০", amount: 1000 }], "https://ulab.edu.bd/admission"),
      U(52, "৫২", "ইউনিভার্সিটি অব এশিয়া প্যাসিফিক (UAP)", "uap university of asia pacific private এশিয়া প্যাসিফিক প্রাইভেট", "private", "", "9999-12-31", "", "১২০০", 1200, [{ label: "ভর্তি আবেদন ফি - ৳ ১২০০", amount: 1200 }], "https://www.uap-bd.edu/admission.php")
    ];

    // Detailed Sub-Unit Calendar Events (Synced with Chorcha & MNR Study Calendar)

  app.U = window.U = U;
  app.INITIAL_UNIVERSITIES = window.INITIAL_UNIVERSITIES = INITIAL_UNIVERSITIES;
})(window);
