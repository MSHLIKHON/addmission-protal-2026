/**
 * marks.js
 * Mark Distribution & Admission Score Calculator ("নম্বর বণ্টন ও স্কোর")
 *
 * Capabilities:
 * 1. Official Mark Distribution View (CSS stacked bars, section tables, merit formula)
 * 2. "আমার নম্বর" Interactive Live Score Planner with MCQ negative marking calculation
 * 3. Dynamic Merit Score Calculator integrating SSC & HSC GPA
 * 4. Weakness Detection & Target Score Suggester
 * 5. Unit Compare Tool (up to 3 units side-by-side)
 * 6. Mock-Test Historical Log with Pure SVG Trendline
 * 7. Mobile-First Sticky Summary Bar
 * 8. Full English & Bangla Localization Support
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  const MARKS_STORAGE_KEY = "bd_admission_marks_v1";

  // In-memory marks feature state
  let marksState = {
    selectedUniId: 1,
    selectedUnitKey: "du-a",
    compareUnits: ["du-a", "medical-mbbs", "buet-eng"],
    activeSubView: "planner", // "planner" | "compare" | "history"
    userScores: {}, // { [unitKey]: { [secKey]: { right: 0, wrong: 0, blank: 0, directScore: 0 } } }
    targetScores: {}, // { [unitKey]: 75 }
    mockHistory: {} // { [unitKey]: [ { date: "2026-10-31", score: 68.5, merit: 114.5, details: {} } ] }
  };

  function loadMarksState() {
    try {
      const raw = localStorage.getItem(MARKS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          marksState.userScores = parsed.userScores || {};
          marksState.targetScores = parsed.targetScores || {};
          marksState.mockHistory = parsed.mockHistory || {};
          if (parsed.selectedUniId) marksState.selectedUniId = parsed.selectedUniId;
          if (parsed.selectedUnitKey) marksState.selectedUnitKey = parsed.selectedUnitKey;
        }
      }
    } catch (e) {
      console.warn("Could not load marks state:", e);
    }
  }

  function saveMarksState() {
    try {
      localStorage.setItem(MARKS_STORAGE_KEY, JSON.stringify({
        selectedUniId: marksState.selectedUniId,
        selectedUnitKey: marksState.selectedUnitKey,
        userScores: marksState.userScores,
        targetScores: marksState.targetScores,
        mockHistory: marksState.mockHistory
      }));
    } catch (e) {
      console.warn("Could not save marks state:", e);
    }
  }

  function getActiveUnitData() {
    const list = app.getAllMarksData ? app.getAllMarksData() : [];
    let unit = list.find(u => u.unitKey === marksState.selectedUnitKey);
    if (!unit) {
      const uniUnits = app.getMarksDataForUni ? app.getMarksDataForUni(marksState.selectedUniId) : [];
      unit = uniUnits[0] || list[0];
      if (unit) marksState.selectedUnitKey = unit.unitKey;
    }
    return unit;
  }

  function getUserGpa() {
    if (typeof document === "undefined") return { ssc: 5.0, hsc: 5.0 };
    const ssc = parseFloat(document.getElementById("eligSscInput")?.value || "5.00") || 5.0;
    const hsc = parseFloat(document.getElementById("eligHscInput")?.value || "5.00") || 5.0;
    return { ssc, hsc };
  }

  function calculateUnitScores(unit) {
    if (!unit || !unit.sections || unit.sections.length === 0) {
      return { rawTotal: 0, penalty: 0, netScore: 0, percentage: 0, meritScore: 0, sectionScores: {}, weakestSec: null };
    }

    const unitKey = unit.unitKey;
    const scores = marksState.userScores[unitKey] || {};
    const negRate = typeof unit.negativeMarking === "number" ? unit.negativeMarking : 0;
    const gpa = getUserGpa();

    let rawTotal = 0;
    let penalty = 0;
    let netScore = 0;
    const sectionScores = {};
    let weakestSec = null;
    let lowestSecPct = 101;

    unit.sections.forEach(sec => {
      const entry = scores[sec.key] || { right: 0, wrong: 0, blank: 0, directScore: 0 };
      let secNet = 0;

      if (sec.mcqMarks > 0 && entry.right !== undefined) {
        const rightVal = Number(entry.right) || 0;
        const wrongVal = Number(entry.wrong) || 0;
        const rightMarks = rightVal * (sec.mcqMarks / (sec.questions || 1));
        const penaltyMarks = wrongVal * negRate;
        const writtenVal = Number(entry.directScore) || 0;
        secNet = Math.max(0, rightMarks - penaltyMarks + writtenVal);

        rawTotal += (rightMarks + writtenVal);
        penalty += penaltyMarks;
      } else {
        secNet = Math.max(0, Math.min(sec.marks, Number(entry.directScore) || 0));
        rawTotal += secNet;
      }

      sectionScores[sec.key] = secNet;
      const secPct = sec.marks > 0 ? (secNet / sec.marks) * 100 : 0;
      if (secPct < lowestSecPct && sec.marks > 0) {
        lowestSecPct = secPct;
        weakestSec = { key: sec.key, nameBn: sec.nameBn, nameEn: sec.nameEn, maxMarks: sec.marks, current: secNet, needed: Math.max(0, (sec.marks * 0.8) - secNet) };
      }
    });

    netScore = Math.max(0, rawTotal - penalty);
    const totalMax = unit.totalMarks || 100;
    const percentage = totalMax > 0 ? Math.min(100, (netScore / totalMax) * 100) : 0;

    // Merit score calculation using official unit formula
    let meritScore = netScore;
    if (unit.meritFormula) {
      const mf = unit.meritFormula;
      const sscScore = mf.sscWeight ? gpa.ssc * mf.sscWeight : 0;
      const hscScore = mf.hscWeight ? gpa.hsc * mf.hscWeight : 0;
      const testScale = mf.testWeight ? (netScore * mf.testWeight) : netScore;
      meritScore = sscScore + hscScore + testScale;
    }

    return {
      rawTotal,
      penalty,
      netScore,
      percentage,
      meritScore,
      sectionScores,
      weakestSec
    };
  }

  // Pure SVG Circular Progress Ring
  function renderSvgScoreRing(score, maxScore, percentage, isEn) {
    const size = 96;
    const stroke = 8;
    const radius = (size - stroke) / 2;
    const circum = 2 * Math.PI * radius;
    const offset = circum - (Math.min(100, Math.max(0, percentage)) / 100) * circum;
    const displayScore = isEn ? score.toFixed(1) : toBengaliNumber(score.toFixed(1));
    const displayPct = isEn ? `${Math.round(percentage)}%` : `${toBengaliNumber(Math.round(percentage))}%`;

    return `
      <div class="relative flex items-center justify-center w-24 h-24 shrink-0">
        <svg width="${size}" height="${size}" class="transform -rotate-90">
          <circle cx="${size/2}" cy="${size/2}" r="${radius}" stroke="#e2e8f0" stroke-width="${stroke}" fill="transparent" />
          <circle cx="${size/2}" cy="${size/2}" r="${radius}" stroke="#059669" stroke-width="${stroke}" stroke-dasharray="${circum}" stroke-dashoffset="${offset}" stroke-linecap="round" fill="transparent" class="transition-all duration-500 ease-out" />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span class="text-base sm:text-lg font-bold text-slate-900 leading-tight font-mono-num">${displayScore}</span>
          <span class="text-[10px] text-emerald-700 font-bold font-mono-num">${displayPct}</span>
        </div>
      </div>
    `;
  }

  // Pure SVG Trendline for Mock Exam History
  function renderSvgTrendline(history, isEn) {
    if (!history || history.length < 2) {
      return `
        <div class="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
          ${isEn ? 'At least 2 mock tests required to render progress trendline.' : 'উন্নতির গ্রাফ দেখতে কমপক্ষে ২টি মডেল টেস্ট স্কোর সংরক্ষণ করুন।'}
        </div>
      `;
    }

    const width = 340;
    const height = 110;
    const padding = 20;

    const scores = history.map(h => h.score);
    const min = Math.min(...scores, 0);
    const max = Math.max(...scores, 100);
    const range = (max - min) || 1;

    const points = history.map((h, i) => {
      const x = padding + (i / (history.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((h.score - min) / range) * (height - 2 * padding);
      return { x, y, score: h.score, date: h.date };
    });

    const d = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

    return `
      <div class="w-full overflow-x-auto">
        <svg viewBox="0 0 ${width} ${height}" class="w-full h-28 bg-slate-50/50 rounded-xl border border-slate-100">
          <defs>
            <linearGradient id="trendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <path d="${d} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z" fill="url(#trendGrad)" />
          <path d="${d}" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          ${points.map(p => `
            <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#ffffff" stroke="#059669" stroke-width="2" />
            <text x="${p.x}" y="${p.y - 7}" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle" font-family="monospace">
              ${isEn ? p.score.toFixed(1) : toBengaliNumber(p.score.toFixed(1))}
            </text>
          `).join('')}
        </svg>
      </div>
    `;
  }

  function renderMarksMainTab() {
    const container = document.getElementById("marksTabContent");
    if (!container) return;

    loadMarksState();
    const isEn = Boolean(app.state && app.state.lang === "en");
    const allUnis = (app.state && app.state.universities) ? app.state.universities : [];
    const unit = getActiveUnitData();
    const gpa = getUserGpa();
    const calc = calculateUnitScores(unit);

    // Collect available units for the selected university
    const uniUnits = app.getMarksDataForUni ? app.getMarksDataForUni(marksState.selectedUniId) : [];

    const isVerified = Boolean(unit.verifiedOn && unit.source);
    const badgeHtml = isVerified
      ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
           <span>✅</span><span>${isEn ? 'Verified Circular' : 'অফিসিয়াল সার্কুলার অনুযায়ী যাচাইকৃত'}</span>
         </span>`
      : `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
           <span>⚠️</span><span>${isEn ? 'Unverified / Awaiting Circular' : 'তথ্য যাচাই করুন / সার্কুলার অপ্রকাশিত'}</span>
         </span>`;

    container.innerHTML = `
      <div class="space-y-6">

        <!-- Top Header & Unit Selector Card -->
        <div class="p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">📊</span>
                <h2 class="text-base sm:text-lg font-bold text-slate-900">${isEn ? 'Mark Distribution & Score Planner' : 'নম্বর বণ্টন ও স্কোর ক্যালকুলেটর'}</h2>
                ${badgeHtml}
              </div>
              <p class="text-xs text-slate-500 mt-1">
                ${isEn
                  ? 'Plan your expected marks, simulate negative penalties, and compute official merit scores.'
                  : 'বিশ্ববিদ্যালয় ও ইউনিট বেছে নিয়ে পরীক্ষার নম্বর বণ্টন দেখুন এবং লাইভ মেধা স্কোর হিসাব করুন।'}
              </p>
            </div>

            <!-- Subview Switcher Buttons -->
            <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
              <button type="button" data-marks-subview="planner" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${marksState.activeSubView === 'planner' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}">
                ${isEn ? '📝 Score Planner' : '📝 আমার নম্বর'}
              </button>
              <button type="button" data-marks-subview="compare" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${marksState.activeSubView === 'compare' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}">
                ${isEn ? '⚖️ Compare Units' : '⚖️ ইউনিট তুলনা'}
              </button>
              <button type="button" data-marks-subview="history" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${marksState.activeSubView === 'history' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}">
                ${isEn ? '📈 Mock Log' : '📈 মডেল টেস্ট লগ'}
              </button>
            </div>
          </div>

          <!-- University & Unit Dropdowns -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">${isEn ? '1. Select University' : '১. বিশ্ববিদ্যালয় নির্বাচন করুন'}</label>
              <select id="marksUniSelect" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50">
                ${allUnis.map(u => `
                  <option value="${u.id}" ${u.id === Number(marksState.selectedUniId) ? 'selected' : ''}>
                    ${escapeHtml(getUniDisplayName(u))}
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">${isEn ? '2. Select Unit / Faculty' : '২. ইউনিট বা অনুষদ'}</label>
              <select id="marksUnitSelect" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50">
                ${uniUnits.map(un => `
                  <option value="${un.unitKey}" ${un.unitKey === marksState.selectedUnitKey ? 'selected' : ''}>
                    ${escapeHtml(isEn ? un.unitNameEn : un.unitName)}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span class="block text-[10px] text-slate-500 font-semibold">${isEn ? 'Total Exam Marks' : 'পরীক্ষার মোট নম্বর'}</span>
                <span class="text-sm font-bold text-emerald-950 font-mono-num">${unit.totalMarks ? (isEn ? unit.totalMarks : toBengaliNumber(unit.totalMarks)) : (isEn ? 'Unannounced' : 'অপ্রকাশিত')}</span>
              </div>
              <div class="text-right">
                <span class="block text-[10px] text-slate-500 font-semibold">${isEn ? 'Duration' : 'পরীক্ষার সময়'}</span>
                <span class="text-xs font-bold text-slate-800 font-mono-num">${unit.durationMin ? (isEn ? `${unit.durationMin} mins` : `${toBengaliNumber(unit.durationMin)} মিনিট`) : '—'}</span>
              </div>
            </div>

            <div class="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 flex items-center justify-between">
              <div>
                <span class="block text-[10px] text-slate-500 font-semibold">${isEn ? 'Negative Marking' : 'ভুল উত্তরের পেনাল্টি'}</span>
                <span class="text-xs font-bold text-amber-900 font-mono-num">
                  ${unit.negativeMarking !== null ? (isEn ? `-${unit.negativeMarking}` : `-${toBengaliNumber(unit.negativeMarking)} নম্বর`) : (isEn ? 'None / Unannounced' : 'নেই / অপ্রকাশিত')}
                </span>
              </div>
              <div class="text-right">
                <span class="block text-[10px] text-slate-500 font-semibold">${isEn ? 'Pass Mark' : 'পাস মার্ক'}</span>
                <span class="text-xs font-bold text-slate-800 font-mono-num">${unit.passMark ? (isEn ? unit.passMark : toBengaliNumber(unit.passMark)) : '—'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Conditional Subviews -->
        ${marksState.activeSubView === 'planner' ? renderPlannerSubView(unit, calc, gpa, isEn) : ''}
        ${marksState.activeSubView === 'compare' ? renderCompareSubView(isEn) : ''}
        ${marksState.activeSubView === 'history' ? renderHistorySubView(unit, calc, isEn) : ''}

        <!-- Sticky Mobile Summary Bar -->
        <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950 text-white px-4 py-2.5 shadow-2xl z-40 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-slate-400 block">${isEn ? 'Net Exam Score' : 'প্রাপ্ত নম্বর (পেনাল্টি বাদে)'}</span>
            <div class="flex items-center gap-1.5">
              <span class="text-base font-bold text-emerald-400 font-mono-num">${isEn ? calc.netScore.toFixed(1) : toBengaliNumber(calc.netScore.toFixed(1))}</span>
              <span class="text-xs text-slate-400">/ ${unit.totalMarks ? (isEn ? unit.totalMarks : toBengaliNumber(unit.totalMarks)) : 100}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 block">${isEn ? 'Total Merit Score' : 'মোট মেধা স্কোর (GPA সহ)'}</span>
            <span class="text-base font-bold text-amber-300 font-mono-num">${isEn ? calc.meritScore.toFixed(1) : toBengaliNumber(calc.meritScore.toFixed(1))}</span>
          </div>
          <button type="button" id="btnSaveMockSticky" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs">
            ${isEn ? 'Save' : 'সংরক্ষণ'}
          </button>
        </div>

      </div>
    `;

    attachMarksEventListeners(unit, calc);
  }

  function renderPlannerSubView(unit, calc, gpa, isEn) {
    const sections = unit.sections || [];
    const scores = marksState.userScores[unit.unitKey] || {};

    const targetVal = marksState.targetScores[unit.unitKey] || Math.round((unit.totalMarks || 100) * 0.75);

    // Stacked Horizontal Bar
    const barSegments = sections.map((s, idx) => {
      const colors = ['#059669', '#0284c7', '#d97706', '#9333ea', '#dc2626', '#475569'];
      const bg = colors[idx % colors.length];
      const pct = unit.totalMarks > 0 ? (s.marks / unit.totalMarks) * 100 : (100 / sections.length);
      return `
        <div style="width: ${pct}%; background-color: ${bg};" class="h-3.5 transition-all group relative" title="${s.nameBn}: ${s.marks}"></div>
      `;
    }).join('');

    return `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Left 2 Cols: Mark Distribution & Section Inputs -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Section Weight Horizontal Bar -->
          <div class="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800">${isEn ? 'Section Weight Breakdown' : 'বিষয়ভিত্তিক নম্বর বণ্টন গ্রাফ'}</span>
              <span class="text-slate-500 text-[11px] font-mono-num">${isEn ? `Total: ${unit.totalMarks || 100} marks` : `মোট: ${toBengaliNumber(unit.totalMarks || 100)} নম্বর`}</span>
            </div>
            <div class="w-full flex rounded-full overflow-hidden bg-slate-100 p-0.5 border border-slate-200">
              ${barSegments || '<div class="w-full h-3.5 bg-slate-200"></div>'}
            </div>
            <div class="flex flex-wrap gap-2 pt-1 text-[11px]">
              ${sections.map((s, idx) => {
                const colors = ['bg-emerald-600', 'bg-sky-600', 'bg-amber-600', 'bg-purple-600', 'bg-rose-600', 'bg-slate-600'];
                return `
                  <span class="inline-flex items-center gap-1 text-slate-600">
                    <span class="w-2 h-2 rounded-full ${colors[idx % colors.length]}"></span>
                    <span>${isEn ? s.nameEn : s.nameBn} (${isEn ? s.marks : toBengaliNumber(s.marks)})</span>
                  </span>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Section Interactive Input Table / Cards -->
          <div class="p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900">${isEn ? 'Section Score Inputs' : 'আপনার প্রত্যাশিত বা মডেল টেস্ট নম্বর'}</h3>
                <p class="text-xs text-slate-500">${isEn ? 'Enter correct and wrong answers for MCQs to calculate live negative deductions.' : 'সঠিক ও ভুল উত্তরের সংখ্যা লিখলে স্বয়ংক্রিয়ভাবে নেগেটিভ মার্কিং হিসাব হবে।'}</p>
              </div>
              <button type="button" id="btnResetCurrentMarks" class="text-xs font-bold text-rose-600 hover:underline">
                ${isEn ? 'Clear Inputs' : 'রিসেট'}
              </button>
            </div>

            ${sections.length === 0 ? `
              <div class="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl">
                ${isEn ? 'Official section breakdown for this unit is awaiting publication.' : 'এই ইউনিটের বিস্তারিত বিষয়ভিত্তিক সার্কুলার এখনো প্রকাশিত হয়নি।'}
              </div>
            ` : `
              <div class="space-y-3">
                ${sections.map(sec => {
                  const sData = scores[sec.key] || { right: 0, wrong: 0, blank: 0, directScore: 0 };
                  const isMcq = sec.mcqMarks > 0;
                  const secNet = calc.sectionScores[sec.key] || 0;

                  return `
                    <div class="p-3 sm:p-4 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition bg-slate-50/40 space-y-2.5">
                      <div class="flex items-start justify-between gap-2">
                        <div>
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="font-bold text-xs sm:text-sm text-slate-900">${isEn ? sec.nameEn : sec.nameBn}</span>
                            ${sec.isOptional ? `<span class="px-2 py-0.2 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">${isEn ? 'Optional' : 'ঐচ্ছিক'}</span>` : ''}
                          </div>
                          <span class="text-[11px] text-slate-500 font-mono-num">
                            ${isEn ? `Max: ${sec.marks} marks` : `পূর্ণমান: ${toBengaliNumber(sec.marks)}`} •
                            ${sec.questions ? (isEn ? `${sec.questions} questions` : `${toBengaliNumber(sec.questions)}টি প্রশ্ন`) : ''}
                            ${sec.writtenMarks ? (isEn ? ` (${sec.writtenMarks} written)` : ` (${toBengaliNumber(sec.writtenMarks)} লিখিত)`) : ''}
                          </span>
                        </div>
                        <div class="text-right">
                          <span class="text-xs font-bold text-emerald-800 font-mono-num">${isEn ? `Net: ${secNet.toFixed(1)}` : `প্রাপ্ত: ${toBengaliNumber(secNet.toFixed(1))}`}</span>
                        </div>
                      </div>

                      <!-- Stepper / Input row -->
                      ${isMcq ? `
                        <div class="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <label class="block text-[10px] font-bold text-emerald-700 mb-0.5">${isEn ? 'Right (MCQ)' : 'সঠিক'}</label>
                            <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                              <button type="button" data-stepper="right" data-sec="${sec.key}" data-delta="-1" class="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold">-</button>
                              <input type="number" min="0" max="${sec.questions || sec.marks}" data-sec-input="right" data-sec="${sec.key}" value="${sData.right || 0}" class="w-full text-center text-xs font-bold focus:outline-none py-1" />
                              <button type="button" data-stepper="right" data-sec="${sec.key}" data-delta="1" class="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold">+</button>
                            </div>
                          </div>
                          <div>
                            <label class="block text-[10px] font-bold text-rose-700 mb-0.5">${isEn ? 'Wrong (MCQ)' : 'ভুল উত্তর'}</label>
                            <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                              <button type="button" data-stepper="wrong" data-sec="${sec.key}" data-delta="-1" class="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold">-</button>
                              <input type="number" min="0" max="${sec.questions || sec.marks}" data-sec-input="wrong" data-sec="${sec.key}" value="${sData.wrong || 0}" class="w-full text-center text-xs font-bold focus:outline-none py-1" />
                              <button type="button" data-stepper="wrong" data-sec="${sec.key}" data-delta="1" class="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold">+</button>
                            </div>
                          </div>
                          <div>
                            <label class="block text-[10px] font-bold text-slate-700 mb-0.5">${sec.writtenMarks ? (isEn ? 'Written' : 'লিখিত নম্বর') : (isEn ? 'Blank' : 'উত্তরহীন')}</label>
                            ${sec.writtenMarks ? `
                              <input type="number" min="0" max="${sec.writtenMarks}" step="0.5" data-sec-input="directScore" data-sec="${sec.key}" value="${sData.directScore || 0}" placeholder="0" class="w-full text-center text-xs font-bold border border-slate-200 rounded-lg py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            ` : `
                              <input type="number" min="0" max="${sec.questions || sec.marks}" data-sec-input="blank" data-sec="${sec.key}" value="${sData.blank || 0}" class="w-full text-center text-xs font-semibold border border-slate-200 rounded-lg py-1 bg-slate-50 focus:outline-none" />
                            `}
                          </div>
                        </div>
                      ` : `
                        <div>
                          <label class="block text-[10px] font-bold text-slate-600 mb-0.5">${isEn ? `Written Score (Max: ${sec.marks})` : `লিখিত নম্বর (পূর্ণমান: ${toBengaliNumber(sec.marks)})`}</label>
                          <input type="number" min="0" max="${sec.marks}" step="0.5" data-sec-input="directScore" data-sec="${sec.key}" value="${sData.directScore || 0}" class="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                      `}
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

        </div>

        <!-- Right Col: Score Cards, Merit Breakdown, Target Suggester -->
        <div class="space-y-6">

          <!-- Live Scorecard Ring & Deductions -->
          <div class="p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">${isEn ? 'Scorecard Summary' : 'নম্বর সারাংশ'}</h3>
            <div class="flex items-center gap-4">
              ${renderSvgScoreRing(calc.netScore, unit.totalMarks || 100, calc.percentage, isEn)}
              <div class="space-y-1 text-xs">
                <div>
                  <span class="text-slate-500 text-[11px]">${isEn ? 'Raw Score:' : 'কাঁচা স্কোর:'}</span>
                  <span class="font-bold text-slate-800 font-mono-num ml-1">${isEn ? calc.rawTotal.toFixed(1) : toBengaliNumber(calc.rawTotal.toFixed(1))}</span>
                </div>
                <div>
                  <span class="text-slate-500 text-[11px]">${isEn ? 'Negative Penalty:' : 'কাটা নম্বর:'}</span>
                  <span class="font-bold text-rose-600 font-mono-num ml-1">-${isEn ? calc.penalty.toFixed(2) : toBengaliNumber(calc.penalty.toFixed(2))}</span>
                </div>
                <div class="pt-1 border-t border-slate-100">
                  <span class="text-slate-500 text-[11px]">${isEn ? 'Net Exam Mark:' : 'চূড়ান্ত টেস্ট স্কোর:'}</span>
                  <span class="font-bold text-emerald-800 font-mono-num ml-1">${isEn ? calc.netScore.toFixed(2) : toBengaliNumber(calc.netScore.toFixed(2))}</span>
                </div>
              </div>
            </div>

            <!-- Weak Section Alert -->
            ${calc.weakestSec ? `
              <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                <span class="text-base shrink-0">🎯</span>
                <div>
                  <span class="font-bold">${isEn ? 'Priority Section:' : 'অগ্রাধিকার সেকশন:'} </span>
                  <span>${isEn ? calc.weakestSec.nameEn : calc.weakestSec.nameBn}</span>
                  <p class="text-[11px] text-rose-700 mt-0.5">
                    ${isEn ? `Current: ${calc.weakestSec.current.toFixed(1)} / ${calc.weakestSec.maxMarks} (Needs +${calc.weakestSec.needed.toFixed(1)} for safe zone)` : `বর্তমান: ${toBengaliNumber(calc.weakestSec.current.toFixed(1))} / ${toBengaliNumber(calc.weakestSec.maxMarks)} (নিরাপদ জোনে যেতে আরও +${toBengaliNumber(calc.weakestSec.needed.toFixed(1))} নম্বর প্রয়োজন)`}
                  </p>
                </div>
              </div>
            ` : ''}

            <!-- Merit Score Breakdown Card -->
            <div class="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-xl border border-emerald-200/80 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-emerald-950">${isEn ? 'Official Merit Score' : 'চূড়ান্ত মেধা স্কোর (GPA সহ)'}</span>
                <span class="text-base font-bold text-emerald-800 font-mono-num">${isEn ? calc.meritScore.toFixed(2) : toBengaliNumber(calc.meritScore.toFixed(2))}</span>
              </div>
              <p class="text-[11px] text-emerald-900 leading-relaxed">
                ${isEn ? (unit.meritFormula?.descriptionEn || 'Based on admission test score') : (unit.meritFormula?.descriptionBn || 'ভর্তি পরীক্ষার স্কোরের ভিত্তিতে')}
              </p>
              <div class="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-emerald-200/50">
                <span>SSC GPA: <strong class="font-mono-num">${isEn ? gpa.ssc.toFixed(2) : toBengaliNumber(gpa.ssc.toFixed(2))}</strong></span>
                <span>HSC GPA: <strong class="font-mono-num">${isEn ? gpa.hsc.toFixed(2) : toBengaliNumber(gpa.hsc.toFixed(2))}</strong></span>
              </div>
            </div>

            <!-- Save Attempt to Mock History Button -->
            <button type="button" id="btnSaveMockAttempt" class="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition">
              ${isEn ? '💾 Save Attempt to Mock Log' : '💾 এই টেস্ট ফলাফল সংরক্ষণ করুন'}
            </button>
          </div>

          <!-- Target Score Suggester -->
          <div class="p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-slate-900">${isEn ? 'Target Score Suggester' : 'টার্গেট স্কোর ও পরামর্শ'}</h3>
              <span class="text-xs font-bold text-emerald-700 font-mono-num" id="lblTargetDisplay">${isEn ? targetVal : toBengaliNumber(targetVal)}</span>
            </div>
            <input
              type="range"
              id="rngTargetScore"
              min="30"
              max="${unit.totalMarks || 100}"
              value="${targetVal}"
              class="w-full accent-emerald-600 cursor-pointer"
            />
            <div class="space-y-1.5 pt-1 text-xs">
              <span class="text-[11px] text-slate-500 font-semibold block">${isEn ? 'Suggested section-by-section target:' : 'লক্ষ্য অর্জনে প্রতি সেকশনে দরকার:'}</span>
              ${sections.map(s => {
                const targetSec = unit.totalMarks > 0 ? Math.round((s.marks / unit.totalMarks) * targetVal) : Math.round(s.marks * 0.75);
                return `
                  <div class="flex items-center justify-between py-1 border-b border-slate-100 text-slate-700 text-[11px]">
                    <span>${isEn ? s.nameEn : s.nameBn} (${isEn ? s.marks : toBengaliNumber(s.marks)})</span>
                    <strong class="text-emerald-700 font-mono-num">${isEn ? targetSec : toBengaliNumber(targetSec)} ${isEn ? 'marks' : 'নম্বর'}</strong>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>

      </div>
    `;
  }

  function renderCompareSubView(isEn) {
    const allMarks = app.getAllMarksData ? app.getAllMarksData() : [];
    const selectedKeys = marksState.compareUnits.slice(0, 3);
    const compared = selectedKeys.map(k => allMarks.find(m => m.unitKey === k)).filter(Boolean);

    return `
      <div class="p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-bold text-slate-900">${isEn ? 'Compare Admission Test Patterns' : 'ভর্তি পরীক্ষার ইউনিট তুলনা (পাশাপাশি ৩টি)'}</h3>
            <p class="text-xs text-slate-500 mt-0.5">${isEn ? 'Compare mark weights, negative penalties, durations and merit formulas.' : 'নম্বর বণ্টন, নেগেটিভ মার্কিং ও মেধা স্কোরের তুলনামূলক চিত্র।'}</p>
          </div>
          <div class="flex items-center gap-2">
            <select id="selAddCompareUnit" class="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold">
              <option value="">${isEn ? '+ Add Unit to Compare' : '+ অন্য ইউনিট যোগ করুন'}</option>
              ${allMarks.map(m => `<option value="${m.unitKey}">${escapeHtml(isEn ? m.unitNameEn : m.unitName)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-${Math.max(1, compared.length)} gap-4">
          ${compared.map(u => `
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div class="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                <div>
                  <h4 class="font-bold text-sm text-slate-900">${escapeHtml(isEn ? u.unitNameEn : u.unitName)}</h4>
                  <a href="${escapeHtml(u.source || '#')}" target="_blank" rel="noopener noreferrer" class="text-[11px] text-blue-700 hover:underline">সার্কুলার ↗</a>
                </div>
                <button type="button" data-remove-compare="${u.unitKey}" class="text-slate-400 hover:text-rose-600 text-xs font-bold" title="${isEn ? 'Remove' : 'বাদ দিন'}">✕</button>
              </div>

              <div class="space-y-1.5 text-xs text-slate-700">
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span class="text-slate-500">${isEn ? 'Total Marks:' : 'মোট নম্বর:'}</span>
                  <strong class="font-mono-num">${u.totalMarks ? (isEn ? u.totalMarks : toBengaliNumber(u.totalMarks)) : '—'}</strong>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span class="text-slate-500">${isEn ? 'Duration:' : 'পরীক্ষার সময়:'}</span>
                  <strong class="font-mono-num">${u.durationMin ? (isEn ? `${u.durationMin}m` : `${toBengaliNumber(u.durationMin)} মি.`) : '—'}</strong>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span class="text-slate-500">${isEn ? 'Negative Penalty:' : 'ভুল উত্তরের পেনাল্টি:'}</span>
                  <strong class="font-mono-num text-amber-700">${u.negativeMarking !== null ? (isEn ? `-${u.negativeMarking}` : `-${toBengaliNumber(u.negativeMarking)}`) : '—'}</strong>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span class="text-slate-500">${isEn ? 'Pass Mark:' : 'পাস মার্ক:'}</span>
                  <strong class="font-mono-num">${u.passMark ? (isEn ? u.passMark : toBengaliNumber(u.passMark)) : '—'}</strong>
                </div>
              </div>

              <div class="pt-2">
                <span class="text-[11px] font-bold text-slate-800 block mb-1">${isEn ? 'Sections:' : 'বিষয়সমূহ:'}</span>
                <div class="flex flex-wrap gap-1">
                  ${(u.sections || []).map(s => `
                    <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-700 font-semibold font-mono-num">
                      ${isEn ? s.nameEn : s.nameBn}: ${isEn ? s.marks : toBengaliNumber(s.marks)}
                    </span>
                  `).join('')}
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200 text-[11px] text-emerald-900 bg-emerald-50/50 p-2 rounded-lg">
                <strong>${isEn ? 'Merit Formula:' : 'মেধা স্কোর:'}</strong>
                <p class="mt-0.5 leading-snug">${escapeHtml(isEn ? (u.meritFormula?.descriptionEn || 'Test score') : (u.meritFormula?.descriptionBn || 'ভর্তি পরীক্ষা'))}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderHistorySubView(unit, calc, isEn) {
    const list = marksState.mockHistory[unit.unitKey] || [];

    return `
      <div class="p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-bold text-slate-900">${isEn ? 'Mock Test Improvement Log' : 'মডেল টেস্ট অনুশীলনের ইতিহাস ও অগ্রগতি'}</h3>
            <p class="text-xs text-slate-500 mt-0.5">${escapeHtml(isEn ? unit.unitNameEn : unit.unitName)}</p>
          </div>
          ${list.length > 0 ? `
            <button type="button" id="btnClearMockHistory" class="text-xs font-bold text-rose-600 hover:underline">
              ${isEn ? 'Clear History' : 'ইতিহাস মুছুন'}
            </button>
          ` : ''}
        </div>

        <!-- Inline SVG Trendline -->
        ${renderSvgTrendline(list, isEn)}

        <!-- History Records Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th class="p-2.5 font-bold">${isEn ? '#' : 'ক্রম'}</th>
                <th class="p-2.5 font-bold">${isEn ? 'Date' : 'তারিখ'}</th>
                <th class="p-2.5 font-bold font-mono-num">${isEn ? 'Test Score' : 'টেস্ট নম্বর'}</th>
                <th class="p-2.5 font-bold font-mono-num">${isEn ? 'Merit Score' : 'মেধা স্কোর'}</th>
                <th class="p-2.5 font-bold">${isEn ? 'Section Breakdown' : 'বিষয়ভিত্তিক নম্বর'}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${list.length === 0 ? `
                <tr>
                  <td colspan="5" class="py-6 text-center text-slate-400">
                    ${isEn ? 'No mock attempts saved yet. Use the Score Planner to save your first attempt.' : 'এখনো কোনো মডেল টেস্ট সংরক্ষণ করা হয়নি। স্কোর প্ল্যানার থেকে আপনার প্রথম স্কোরটি সেভ করুন।'}
                  </td>
                </tr>
              ` : list.map((item, idx) => `
                <tr class="hover:bg-slate-50/70">
                  <td class="p-2.5 font-bold text-slate-500 font-mono-num">${isEn ? idx + 1 : toBengaliNumber(idx + 1)}</td>
                  <td class="p-2.5 text-slate-600">${item.date}</td>
                  <td class="p-2.5 font-bold text-emerald-700 font-mono-num">${isEn ? item.score.toFixed(1) : toBengaliNumber(item.score.toFixed(1))}</td>
                  <td class="p-2.5 font-bold text-slate-900 font-mono-num">${isEn ? item.merit.toFixed(1) : toBengaliNumber(item.merit.toFixed(1))}</td>
                  <td class="p-2.5 text-slate-500 text-[11px]">
                    ${Object.entries(item.sectionScores || {}).map(([k, v]) => `${k}: ${isEn ? Number(v).toFixed(1) : toBengaliNumber(Number(v).toFixed(1))}`).join(', ')}
                  </td>
                </tr>
              `).reverse().join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function attachMarksEventListeners(unit, calc) {
    const isEn = Boolean(app.state && app.state.lang === "en");

    // Subview buttons
    document.querySelectorAll("[data-marks-subview]").forEach(btn => {
      btn.addEventListener("click", () => {
        marksState.activeSubView = btn.getAttribute("data-marks-subview");
        renderMarksMainTab();
      });
    });

    // University change
    document.getElementById("marksUniSelect")?.addEventListener("change", e => {
      marksState.selectedUniId = Number(e.target.value);
      const uniUnits = app.getMarksDataForUni ? app.getMarksDataForUni(marksState.selectedUniId) : [];
      if (uniUnits.length > 0) {
        marksState.selectedUnitKey = uniUnits[0].unitKey;
      }
      saveMarksState();
      renderMarksMainTab();
    });

    // Unit change
    document.getElementById("marksUnitSelect")?.addEventListener("change", e => {
      marksState.selectedUnitKey = e.target.value;
      saveMarksState();
      renderMarksMainTab();
    });

    // Stepper buttons (+/-)
    document.querySelectorAll("[data-stepper]").forEach(btn => {
      btn.addEventListener("click", () => {
        const field = btn.getAttribute("data-stepper");
        const secKey = btn.getAttribute("data-sec");
        const delta = Number(btn.getAttribute("data-delta")) || 0;
        const input = document.querySelector(`input[data-sec-input="${field}"][data-sec="${secKey}"]`);
        if (input) {
          const cur = Number(input.value) || 0;
          const next = Math.max(0, cur + delta);
          input.value = next;
          updateSectionScoreMemory(unit.unitKey, secKey, field, next);
        }
      });
    });

    // Direct input fields
    document.querySelectorAll("[data-sec-input]").forEach(input => {
      input.addEventListener("input", () => {
        const field = input.getAttribute("data-sec-input");
        const secKey = input.getAttribute("data-sec");
        const val = Number(input.value) || 0;
        updateSectionScoreMemory(unit.unitKey, secKey, field, val);
      });
    });

    // Target Score slider
    document.getElementById("rngTargetScore")?.addEventListener("input", e => {
      const val = Number(e.target.value);
      marksState.targetScores[unit.unitKey] = val;
      const lbl = document.getElementById("lblTargetDisplay");
      if (lbl) lbl.textContent = isEn ? val : toBengaliNumber(val);
      saveMarksState();
    });

    // Save attempt button (both in desktop card & mobile sticky bar)
    const handleSaveAttempt = () => {
      const nowStr = new Date().toISOString().slice(0, 10);
      if (!marksState.mockHistory[unit.unitKey]) {
        marksState.mockHistory[unit.unitKey] = [];
      }
      marksState.mockHistory[unit.unitKey].push({
        date: nowStr,
        score: calc.netScore,
        merit: calc.meritScore,
        sectionScores: Object.assign({}, calc.sectionScores)
      });
      saveMarksState();
      showToast(isEn ? 'Mock test score saved successfully!' : '✅ মডেল টেস্টের স্কোর সফলভাবে সংরক্ষণ করা হয়েছে!');
      renderMarksMainTab();
    };

    document.getElementById("btnSaveMockAttempt")?.addEventListener("click", handleSaveAttempt);
    document.getElementById("btnSaveMockSticky")?.addEventListener("click", handleSaveAttempt);

    // Reset marks
    document.getElementById("btnResetCurrentMarks")?.addEventListener("click", () => {
      marksState.userScores[unit.unitKey] = {};
      saveMarksState();
      renderMarksMainTab();
      showToast(isEn ? 'Inputs cleared' : 'নম্বর ইনপুট মুছে ফেলা হয়েছে');
    });

    // Clear history
    document.getElementById("btnClearMockHistory")?.addEventListener("click", () => {
      marksState.mockHistory[unit.unitKey] = [];
      saveMarksState();
      renderMarksMainTab();
      showToast(isEn ? 'History cleared' : 'ইতিহাস মুছে ফেলা হয়েছে');
    });

    // Add to compare
    document.getElementById("selAddCompareUnit")?.addEventListener("change", e => {
      const key = e.target.value;
      if (key && !marksState.compareUnits.includes(key)) {
        marksState.compareUnits.push(key);
        if (marksState.compareUnits.length > 3) marksState.compareUnits.shift();
        saveMarksState();
        renderMarksMainTab();
      }
    });

    // Remove from compare
    document.querySelectorAll("[data-remove-compare]").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-remove-compare");
        marksState.compareUnits = marksState.compareUnits.filter(k => k !== key);
        saveMarksState();
        renderMarksMainTab();
      });
    });
  }

  function updateSectionScoreMemory(unitKey, secKey, field, val) {
    if (!marksState.userScores[unitKey]) {
      marksState.userScores[unitKey] = {};
    }
    if (!marksState.userScores[unitKey][secKey]) {
      marksState.userScores[unitKey][secKey] = { right: 0, wrong: 0, blank: 0, directScore: 0 };
    }
    marksState.userScores[unitKey][secKey][field] = val;
    saveMarksState();
    renderMarksMainTab();
  }

  // Quick navigation shortcut to open a specific university in marks tab
  function openMarksForUni(uniId, unitKey) {
    marksState.selectedUniId = Number(uniId);
    if (unitKey) {
      marksState.selectedUnitKey = unitKey;
    } else {
      const units = app.getMarksDataForUni ? app.getMarksDataForUni(uniId) : [];
      if (units.length > 0) marksState.selectedUnitKey = units[0].unitKey;
    }
    saveMarksState();
    if (typeof switchMainTab === "function") {
      switchMainTab("marks");
    }
    renderMarksMainTab();
  }

  app.marksState = marksState;
  app.renderMarksMainTab = window.renderMarksMainTab = renderMarksMainTab;
  app.openMarksForUni = window.openMarksForUni = openMarksForUni;
  app.calculateUnitScores = window.calculateUnitScores = calculateUnitScores;
})(window);
