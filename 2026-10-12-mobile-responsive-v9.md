# Mobile Responsive V9 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a recruiter-friendly mobile version of Edwar Nazzarian’s anime portfolio with readable text and reliable touch interactions.

**Architecture:** Keep the buildless HTML/CSS/JavaScript structure. Add semantic content to `index.html`, behavior to `script.js`, and one final cascade layer in `style.css` that deliberately overrides the older overlapping mobile rules.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Python `unittest` static regression tests.

**Spec:** `docs/superpowers/specs/mobile-responsive-v9.md`

## Global Constraints

- Preserve all current bilingual and anime interactions.
- Never use “Software Engineer” as Edwar’s public title; retain “Software Developer”.
- Support 360, 390, 430, 768, and 1024 px layouts without horizontal overflow.
- Maintain reduced-motion behavior and 44 px mobile touch targets.

## Review Focus

- Very narrow 360 px viewport: no clipped name, email, or navigation labels.
- Coarse-pointer mobile devices: no feature depends only on hover.
- Gojo effect active: About text remains readable.
- Long English copy: buttons and headings wrap without overflow.
- Mobile lightbox: image and close control remain usable within the viewport.

---

### Task 1: Responsive and contrast contract

**Files:**
- Create: `tests/test_mobile_experience.py`
- Modify: `style.css`

**Interfaces:**
- Produces: final mobile cascade under the marker `Mobile responsive v9` and shared contrast tokens.

- [ ] Write static tests for mobile breakpoints, 44 px targets, muted colors, coarse-pointer behavior, overflow protection, and reduced motion.
- [ ] Run the tests and confirm they fail because the v9 contract is absent.
- [ ] Add the final responsive cascade and contrast overrides.
- [ ] Run the complete test suite and confirm it passes.

### Task 2: Recruiter content and copy-email interaction

**Files:**
- Modify: `tests/test_mobile_experience.py`
- Modify: `index.html`
- Modify: `script.js`
- Modify: `style.css`

**Interfaces:**
- Consumes: Task 1 mobile cascade and contrast tokens.
- Produces: `.value-strip`, `.project-impact`, `#copyEmail`, and bilingual feedback text.

- [ ] Add failing tests for three value cards, both project impact blocks, the copy-email control, and bilingual copy feedback.
- [ ] Run the tests and confirm the expected failures.
- [ ] Implement the minimal semantic HTML, JavaScript behavior, and responsive styles.
- [ ] Run the complete test suite and confirm it passes.

### Task 3: Integration, accessibility, and packaging

**Files:**
- Modify: `tests/test_mobile_experience.py`
- Modify: `index.html`
- Modify: `style.css`

**Interfaces:**
- Consumes: Tasks 1–2 selectors and behavior.
- Produces: valid section structure, mobile lightbox constraints, touch activation, and final distributable archive.

- [ ] Add failing integration checks for balanced project markup, visible focus, mobile lightbox sizing, and touch aura support.
- [ ] Correct the markup and remaining integration details.
- [ ] Run all tests, validate HTML/CSS/JS statically, and perform browser QA when available.
- [ ] Package the verified project and update the persistent portfolio archive.

## Self-review

The three tasks cover every approved requirement. Task 1 owns layout and contrast, Task 2 owns the three additions, and Task 3 owns cross-cutting integration. The plan intentionally avoids framework or dependency changes.
