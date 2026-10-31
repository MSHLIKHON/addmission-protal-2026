# Changelog (এডমিশন পোর্টাল ও ট্র্যাকার ২০২৬-২০২৭)

All notable changes to this project are documented in this file.

## [Phase 1] - 2026-10-31

### Fixed
- **Korean Glyphs Cleared**: Removed stray Korean Hangul characters (`허용`) from `js/features/eligibility/eligibility.js` lines 13–14, replacing them with proper Bangla terminology (`সুযোগ রয়েছে` / `আছে`). Verified whole codebase contains zero foreign East Asian characters.
- **HSC Result Banner Dynamic Lifecycle**:
  - Moved target result date (`2026-10-31T11:00:00+06:00`) to `constants.js` (`HSC_RESULT_TARGET_DATE`).
  - Replaced arbitrary non-2026 simulation with real local time checking, restricting simulation strictly behind `?demo=1`.
  - Once result time passes, the tall hero banner automatically collapses into a slim, dismissible notification strip (`ফলাফল প্রকাশিত — রেজাল্ট দেখুন` / `Results Published — View Result`).
  - Dismissal is remembered in `localStorage` under `bd_hsc_banner_dismissed_v1`.
- **Dynamic Eligibility Rules**:
  - Eliminated hardcoded numeric IDs (`[12, 13, 14]`, `[8, 19, 20]`, etc.) in `eligibility.js`.
  - Added structured `eligibility` object `{ minSsc, minHsc, minTotal, groups, secondTimer, notes, source, verifiedOn }` to all university data models in `universities.data.js`.
  - Added visible disclaimer: `"এটি আনুমানিক — অফিসিয়াল সার্কুলার দেখে নিশ্চিত হোন"` / `"This is an estimate — verify with the official circular."`
- **Safe Custom Universities**:
  - Replaced legacy `id > 52` filtering in `state.js` with an explicit `isCustom: true` flag and safe max ID resolution (`maxNumericId + 1`) while maintaining backwards compatibility for existing saves.
- **Vault Passphrase & Storage Transparency**:
  - Added client-side WebCrypto encryption (`js/utils/crypto.utils.js`) using PBKDF2 (SHA-256, 100,000 iterations) + AES-GCM (256-bit).
  - Unencrypted passwords now trigger a clear one-time warning: `"পাসওয়ার্ড শুধু এই ডিভাইসে সংরক্ষিত, এনক্রিপ্টেড নয়।"`.
  - CSV export now excludes passwords by default with a modal opt-in checkbox (`chkIncludePasswords`).
  - Updated `README.md` to provide honest disclosures about local browser storage.
- **Font Network Resilience**:
  - Added Google Fonts `preconnect` and `dns-prefetch` links to `index.html`.
  - Ensured `font-display: swap` and comprehensive native system font fallback stack (`-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans Bengali, sans-serif`) in `css/base.css`.
- **Automated Testing**:
  - Added unit test suite `tests/phase1.test.mjs` using Node.js built-in `node:test` covering all audit bug fixes.

---

## [Phase 2] - 2026-10-31

### Added
- **New Main Tab: "নম্বর বণ্টন ও স্কোর" (Mark Distribution & Score Calculator)**:
  - **Data Model (`js/data/marks.data.js`)**: Structured official admission test mark distribution rules, durations, negative penalties, pass marks, and merit formulas for DU, BUET, Medical, Agri Cluster, GST Cluster, JU, MIST, BUTEX, CKET Engineering, BUP, BRAC, NSU, etc.
  - **Verification Badging**: Verified circular data features `✅ অফিসিয়াল সার্কুলার অনুযায়ী যাচাইকৃত` badge with official link & date; unverified or pending circulars show `⚠️ তথ্য যাচাই করুন / সার্কুলার অপ্রকাশিত`.
  - **"আমার নম্বর" Score Planner (`js/features/marks/marks.js`)**: Interactive section-by-section score inputs with mobile stepper controls (+/-) and automatic MCQ negative marking deduction.
  - **Pure CSS/SVG Visualizations**:
    - Horizontal stacked bar showing section mark weight distributions.
    - Pure SVG dynamic circular progress ring showing net score and percentage.
    - Pure SVG progress trendline for mock exam history.
  - **Live Merit Score Calculator**: Combines admission exam marks with the user's SSC and HSC GPA using official weighted formulas.
  - **Priority Section Detection**: Highlights the user's weakest section needing additional marks for safe admission.
  - **Target Score Suggester**: Interactive slider suggesting proportional target scores per section.
  - **Unit Comparison Subview**: Side-by-side comparison of up to 3 units across marks, duration, penalty, and merit rules.
  - **Mock Exam Historical Log**: Save multiple mock test attempts per unit with date, net score, and merit score.
  - **Mobile Sticky Summary Bar**: Persistent bottom bar displaying live net score, penalty, and merit score on mobile devices.
  - **Navigation Shortcuts**: Added quick `"📊 নম্বর বণ্টন"` shortcut buttons to Directory cards, Circular modal, and Targets tab.
  - **Storage Persistence**: Versioned storage key (`bd_admission_marks_v1`) preserving planner inputs, targets, and logs.

---

## [Phase 3] - 2026-10-31

### Added
- **Full Backup & Restore (`js/features/backup/backup.js`)**:
  - Single-click JSON export of all targets, statuses, credentials, notes, checklist, and marks planner data.
  - Safe import utility with confirmation modal protection against accidental data overwrite.
- **Calendar Sync (`js/features/calendar-sync/calendar-sync.js`)**:
  - RFC 5545 `.ics` iCalendar export for all targeted exam dates with 3-day and 1-day reminder alarms for Google Calendar and Apple Calendar.
  - Optional native browser notifications.
- **Smarter Clash Detection**:
  - Enhanced `computeDynamicClashes` in `js/utils/date.utils.js` with Bangladesh university district/city mapping.
  - Detects consecutive exams in different cities (e.g., Dhaka followed by Rajshahi/Chittagong next day) with explicit travel-time warnings and actionable travel tips.
- **Data Freshness Indicators**:
  - University cards now display `"সর্বশেষ আপডেট: <date>"` and a `"তথ্য ভুল? সংশোধন ✏️"` quick-edit button.
  - Visible data version in application footer (`v2026.2.1`).
- **Progressive Web App (PWA)**:
  - Added `manifest.webmanifest` and cache-first service worker `sw.js` for offline loading.
- **Dark Mode Support**:
  - Added design tokens and CSS variables in `css/base.css` with dark mode support respecting `prefers-color-scheme` and manual toggle button (☀️ / 🌙).
- **Code Quality**:
  - Added `.eslintrc.json`, `.prettierrc`, and `npm run lint` script.
  - Added automated test suite `tests/phase2_3.test.mjs` verifying marks data, calculations, and clash detection.

---

## [Phase 4] - 2026-10-31

### Added
- **Consolidated "আজকের সারসংক্ষেপ" Hero**:
  - Collapsible top summary hero so mobile users can reach the university directory without excessive scrolling.
- **Mobile Bottom Navigation Bar**:
  - Bottom navigation bar on screens `< 768px` with quick icons (Directory, Calendar, Targets, Marks, and More).
  - Secondary header actions grouped into an ergonomic "⋯ আরও" bottom sheet menu.
- **Onboarding Guide & Journey Tracker**:
  - Friendly 3-step first-visit welcome card (`আপনার GPA দিন ➔ টার্গেট বেছে নিন ➔ ডেডলাইন ট্র্যাক করুন`).
  - Journey progress tracker displaying completed steps.
- **Quick Directory Filter Chips**:
  - Quick filter buttons for `সকল`, `বিজ্ঞান`, `মানবিক`, `ব্যবসায়`, `⏳ শেষ সময় ≤ ৭ দিন`, and `🟢 আবেদন খোলা`.
- **Print-Friendly Styles**:
  - Dedicated `@media print` stylesheet for clean, ink-friendly printing of checklists and target sheets.
- **Accessibility & Touch Optimizations**:
  - Ensured minimum tap target size of 40–44px, line-height 1.6 for Bengali typography, visible focus outlines, and keyboard navigation.
