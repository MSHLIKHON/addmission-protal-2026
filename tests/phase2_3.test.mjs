/**
 * phase2_3.test.mjs
 * Unit tests for Phase 2 (Marks distribution & score calculator) and Phase 3 (Backup, Clash, Calendar sync).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';

globalThis.window = globalThis;
if (!globalThis.crypto) {
  try {
    Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
  } catch (e) {}
}
globalThis.AdmissionApp = {};

describe('Phase 2: Marks Distribution & Score Calculator', async () => {
  await import('../js/data/constants.js');
  await import('../js/utils/bengali.utils.js');
  await import('../js/utils/date.utils.js');
  await import('../js/data/universities.data.js');
  await import('../js/data/marks.data.js');
  await import('../js/features/marks/marks.js');

  test('Official Marks Data Model is properly structured', () => {
    const allMarks = window.AdmissionApp.getAllMarksData();
    assert.ok(Array.isArray(allMarks));
    assert.ok(allMarks.length >= 10, 'Should contain at least 10 official units');

    // DU A Unit
    const duA = allMarks.find(m => m.unitKey === 'du-a');
    assert.ok(duA);
    assert.equal(duA.totalMarks, 100);
    assert.equal(duA.negativeMarking, 0.25);
    assert.equal(duA.passMark, 40);
    assert.ok(duA.sections.length >= 4);
    assert.equal(duA.meritFormula.totalMerit, 120);

    // Medical MBBS
    const med = allMarks.find(m => m.unitKey === 'medical-mbbs');
    assert.ok(med);
    assert.equal(med.totalMarks, 100);
    assert.equal(med.meritFormula.totalMerit, 300);

    // BUET
    const buet = allMarks.find(m => m.unitKey === 'buet-eng');
    assert.ok(buet);
    assert.equal(buet.totalMarks, 400);

    // Agri Cluster
    const agri = allMarks.find(m => m.unitKey === 'agri-cluster');
    assert.ok(agri);
    assert.equal(agri.totalMarks, 100);
  });

  test('Score Calculator handles MCQ correct, wrong, and negative marking accurately', () => {
    const allMarks = window.AdmissionApp.getAllMarksData();
    const duA = allMarks.find(m => m.unitKey === 'du-a');

    // Simulate user scores:
    // Physics: 12 right, 3 wrong (penalty: 3 * 0.25 = 0.75, net: 11.25)
    // Chemistry: 10 right, 2 wrong (penalty: 2 * 0.25 = 0.5, net: 9.5)
    window.AdmissionApp.marksState.userScores['du-a'] = {
      physics: { right: 12, wrong: 3, directScore: 0 },
      chemistry: { right: 10, wrong: 2, directScore: 0 }
    };

    const calc = window.AdmissionApp.calculateUnitScores(duA);
    assert.equal(calc.penalty, 1.25); // 0.75 + 0.50
    assert.ok(calc.netScore > 0);
    assert.ok(calc.meritScore >= calc.netScore);
  });
});

describe('Phase 3: Smarter Clash Detection with Travel-Time Warnings', async () => {
  test('Clash detector flags consecutive day exams in different cities as travel warning', () => {
    // Setup state with 2 universities in different cities on consecutive days
    window.state = {
      universities: [
        {
          id: 1, // Dhaka
          name: "ঢাকা বিশ্ববিদ্যালয় (DU)",
          target: true,
          examDateText: "১২ ডিসেম্বর ২০২৬",
          isoExamDate: "2026-12-12"
        },
        {
          id: 4, // Rajshahi
          name: "রাজশাহী বিশ্ববিদ্যালয় (RU)",
          target: true,
          examDateText: "১৩ ডিসেম্বর ২০২৬",
          isoExamDate: "2026-12-13"
        }
      ]
    };

    const clashes = window.AdmissionApp.computeDynamicClashes(true);
    assert.ok(clashes.length > 0);
    const travelClash = clashes.find(c => c.type === 'travel_clash');
    assert.ok(travelClash, 'Must detect travel clash for different cities on consecutive days');
    assert.ok(travelClash.suggestion, 'Must provide an actionable suggestion');
  });
});
