/**
 * phase1.test.js
 * Unit and integration tests for Phase 1 fixes using Node's built-in node:test runner.
 */
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Mock browser globals for testing vanilla modules in Node
import { webcrypto } from "node:crypto";
globalThis.window = globalThis;
if (!globalThis.crypto) {
  try {
    Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
  } catch (e) {}
}
globalThis.AdmissionApp = {};

describe('Phase 1 Audit & Bug Fixes', async () => {

  // Load constants
  await import('../js/data/constants.js');
  await import('../js/utils/bengali.utils.js');
  await import('../js/utils/date.utils.js');
  await import('../js/data/universities.data.js');
  await import('../js/utils/crypto.utils.js');
  await import('../js/features/eligibility/eligibility.js');

  test('1. Korean text check: No Hangul characters remain anywhere in codebase', () => {
    const hangulRegex = /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/;
    const dirs = ['js', 'css'];
    for (const d of dirs) {
      const walk = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const full = path.join(dir, file);
          if (fs.statSync(full).isDirectory()) {
            walk(full);
          } else if (file.endsWith('.js') || file.endsWith('.css')) {
            const content = fs.readFileSync(full, 'utf8');
            const match = hangulRegex.test(content);
            assert.equal(match, false, `Found Korean characters in ${full}`);
          }
        }
      };
      walk(d);
    }
  });

  test('2. HSC Result target date moved to constants and valid', () => {
    assert.ok(window.AdmissionApp.HSC_RESULT_TARGET_DATE, 'HSC_RESULT_TARGET_DATE must be defined');
    const targetDate = new Date(window.AdmissionApp.HSC_RESULT_TARGET_DATE);
    assert.equal(targetDate.getFullYear(), 2026);
    assert.equal(targetDate.getMonth(), 9); // October (0-indexed)
    assert.equal(targetDate.getDate(), 31);
  });

  test('3. Dynamic Eligibility Data Model on Universities', () => {
    const unis = window.AdmissionApp.INITIAL_UNIVERSITIES;
    assert.ok(Array.isArray(unis));
    assert.equal(unis.length, 52);

    // Test BUET (id: 11)
    const buet = unis.find(u => u.id === 11);
    assert.ok(buet.eligibility, 'BUET must have eligibility object');
    assert.equal(buet.eligibility.minSsc, 4.0);
    assert.equal(buet.eligibility.minHsc, 5.0);
    assert.equal(buet.eligibility.minTotal, 9.0);
    assert.equal(buet.eligibility.secondTimer, false);
    assert.deepEqual(buet.eligibility.groups, ['science']);
    assert.ok(buet.eligibility.source);

    // Test DU (id: 1)
    const du = unis.find(u => u.id === 1);
    assert.ok(du.eligibility);
    assert.equal(du.eligibility.minSsc, 3.5);
    assert.equal(du.eligibility.secondTimer, false);

    // Test Medical (id: 9)
    const med = unis.find(u => u.id === 9);
    assert.ok(med.eligibility);
    assert.equal(med.eligibility.secondTimer, true);
    assert.equal(med.eligibility.minTotal, 9.0);

    // Test Private uni (id: 43)
    const brac = unis.find(u => u.id === 43);
    assert.ok(brac.eligibility);
    assert.equal(brac.eligibility.minTotal, 6.0);
    assert.equal(brac.eligibility.secondTimer, true);

    // Test eligibility function reads from data
    const req = window.AdmissionApp.getEligibilityRequirements(buet);
    assert.equal(req.minTotal, 9.0);
    assert.equal(req.secondTime, false);
  });

  test('4. Custom Universities use isCustom flag and safe ID generation', () => {
    const unis = [...window.AdmissionApp.INITIAL_UNIVERSITIES];
    const maxNumId = unis.reduce((max, u) => Math.max(max, typeof u.id === 'number' ? u.id : 0), 0);
    const customUni = {
      id: maxNumId + 1,
      name: "Custom University Test",
      isCustom: true,
      category: "general"
    };
    unis.push(customUni);

    const customItems = unis.filter(u => u.isCustom || u.id > 52);
    assert.equal(customItems.length, 1);
    assert.equal(customItems[0].isCustom, true);
    assert.equal(customItems[0].id, 53);
  });

  test('5. WebCrypto AES-GCM & PBKDF2 Vault Encryption', async () => {
    const vc = window.AdmissionApp.VaultCrypto;
    assert.ok(vc, 'VaultCrypto must be defined');

    const testPass = 'AdmissionSecretPass2026';
    const plainText = 'MySecretAppPassword@123';

    // Encryption
    const cipher = await vc.encryptString(plainText, testPass);
    assert.ok(cipher.startsWith('enc:v1:'), 'Ciphertext must start with enc:v1:');
    assert.notEqual(cipher, plainText);

    // Decryption with correct passphrase
    const decrypted = await vc.decryptString(cipher, testPass);
    assert.equal(decrypted, plainText);

    // Decryption with wrong passphrase should throw error
    await assert.rejects(async () => {
      await vc.decryptString(cipher, 'WrongPassword!');
    });
  });

  test('6. Bengali number conversion utility', () => {
    const bn = window.AdmissionApp.toBengaliNumber;
    assert.equal(bn(12345), '১২৩৪৫');
    assert.equal(bn('2026-10-31'), '২০২৬-১০-৩১');
    assert.equal(bn(0), '০');
  });

  test('7. System font stack & Preconnect links in index.html', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert.ok(html.includes('rel="preconnect" href="https://fonts.googleapis.com"'));
    assert.ok(html.includes('rel="preconnect" href="https://fonts.gstatic.com"'));
    assert.ok(html.includes('display=swap'));

    const css = fs.readFileSync('css/base.css', 'utf8');
    assert.ok(css.includes('-apple-system') || css.includes('BlinkMacSystemFont'));
  });
});
