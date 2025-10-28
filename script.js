/*
  WebDev Quest — Interactivity & Gamification
  - Live preview rendering in sandboxed iframes (HTML-only and HTML+CSS modes)
  - Challenge checking (HTML text, element existence, CSS property values, pseudo-class rule matching)
  - Progress tracking with localStorage (percent complete + badges)
  - Visual success animation and gentle hints
  - Light/Dark mode toggle (persisted)
  - Mobile menu toggle with ARIA updates
*/

// ---------- Utilities ----------

// Storage keys for progress
const STORAGE_KEYS = {
  progress: 'wdq_progress', // { lessonsCompleted: {lessonId: boolean}, badges: {badgeId: boolean} }
  theme: 'wdq_theme' // "light" | "dark"
};

// Get or init progress state
function getProgress() {
  const raw = localStorage.getItem(STORAGE_KEYS.progress);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  const initial = { lessonsCompleted: {}, badges: {} };
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(initial));
  return initial;
}
function setProgress(updater) {
  const current = getProgress();
  const next = typeof updater === 'function' ? updater(current) : updater;
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(next));
  return next;
}

// Update overall progress UI
function updateProgressUI() {
  const state = getProgress();
  const lessonIds = Array.from(document.querySelectorAll('.lesson-card')).map(el => el.getAttribute('data-lesson-id'));
  const completedCount = lessonIds.filter(id => state.lessonsCompleted[id]).length;
  const total = lessonIds.length;
  const percent = total ? Math.round((completedCount / total) * 100) : 0;

  const bar = document.querySelector('.progress-fill');
  const label = document.querySelector('.progress-percent');
  const barWrap = document.querySelector('.progress-bar');
  if (bar) bar.style.width = `${percent}%`;
  if (label) label.textContent = `${percent}%`;
  if (barWrap) barWrap.setAttribute('aria-valuenow', String(percent));
}

// Unlock a badge and reflect UI
function unlockBadge(badgeId) {
  setProgress(state => {
    state.badges[badgeId] = true;
    return state;
  });
  const card = document.querySelector(`.badge-card[data-badge="${badgeId}"]`);
  if (card) {
    card.classList.add('unlocked');
    const status = card.querySelector('.badge-status');
    if (status) status.textContent = 'Unlocked';
  }
}

// ---------- Theme (Light/Dark) ----------

function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  const toggle = document.getElementById('mode-toggle');
  const icon = toggle?.querySelector('.mode-icon');
  const text = toggle?.querySelector('.mode-text');
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '🌞';
  if (text) text.textContent = theme === 'dark' ? 'Dark' : 'Light';
  toggle?.setAttribute('aria-pressed', String(theme === 'dark'));
}

function initTheme() {
  const stored = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  applyTheme(stored);
  const toggle = document.getElementById('mode-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEYS.theme, next);
      applyTheme(next);
    });
  }
}

// ---------- Mobile menu ----------

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
    const icon = menuToggle.querySelector('.menu-icon');
    if (icon) {
      icon.style.transform = expanded ? 'none' : 'rotate(90deg)';
      setTimeout(() => (icon.style.transform = 'none'), 220);
    }
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    });
  });
}

// ---------- Live preview ----------

function renderToFrame(frame, html, css = '') {
  if (!frame) return;
  const doc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          html, body {
            margin: 0; padding: 16px;
            font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
            color: #0b1221; background: #f8fafc;
          }
          button { font: inherit; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
  const iframeDoc = frame.contentDocument || frame.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(doc);
  iframeDoc.close();
}

// ---------- Challenges (checking) ----------

function checkChallenge({ frame, type, selector, expected, contains, cssProp, currentHTML, currentCSS }) {
  const doc = frame.contentDocument || frame.contentWindow.document;
  let result = false;
  let message = '';

  try {
    switch (type) {
      case 'text': {
        const el = doc.querySelector(selector);
        result = el && el.textContent.trim() === expected;
        message = result ? 'Nice! Your heading matches.' : 'Hint: Replace the heading text with the required phrase.';
        break;
      }
      case 'exists': {
        const els = Array.from(doc.querySelectorAll(selector));
        result = els.some(el => el.textContent.includes(contains));
        message = result ? 'Great! The new item is present.' : 'Hint: Add a list item containing the requested text.';
        break;
      }
      case 'css': {
        if (selector.includes(':hover')) {
          // For pseudo-class checks, inspect CSS text (computed styles don’t reflect hover state)
          const normalized = (str) => str.replace(/\s+/g, '').toLowerCase();
          result = normalized(currentCSS).includes(normalized(`${selector}{${cssProp}:${expected}`));
          message = result ? 'Smooth! Your hover transform matches.' : 'Hint: Update the hover rule to include the required property/value.';
        } else {
          const el = doc.querySelector(selector);
          if (el) {
            const val = doc.defaultView.getComputedStyle(el).getPropertyValue(cssProp).trim();
            result = val.toLowerCase() === expected.toLowerCase();
          }
          message = result ? 'Perfect! CSS property set correctly.' : 'Hint: Adjust the property to the expected value.';
        }
        break;
      }
      default:
        message = 'No exercise type configured.';
    }
  } catch {
    result = false;
    message = 'Check your code structure and try again.';
  }

  return { result, message };
}

// Visual success animation
function playSuccessAnimation(container) {
  const check = container.querySelector('.success-check');
  if (!check) return;
  check.classList.remove('active');
  // Force reflow to restart animation
  void check.offsetWidth;
  check.classList.add('active');
}

// Mark lesson complete and unlock badge
function completeLesson(lessonId) {
  setProgress(state => {
    state.lessonsCompleted[lessonId] = true;
    return state;
  });
  updateProgressUI();

  // Badge mapping per lesson
  const badgeMap = {
    'html-basics': 'html-init',
    'html-lists': 'list-master',
    'css-typography': 'style-spark',
    'css-hover': 'motion-mage'
  };
  const badgeId = badgeMap[lessonId];
  if (badgeId) unlockBadge(badgeId);
}

// Initialize editors, run/reset/check wiring
function setupEditors() {
  const editorGroups = document.querySelectorAll('[data-editor]');
  editorGroups.forEach(group => {
    const frame = group.parentElement.querySelector('.live-frame');
    const mode = group.getAttribute('data-mode') || 'html'; // 'html' or 'htmlcss'
    const lessonCard = group.closest('.lesson-card');
    const lessonId = lessonCard?.getAttribute('data-lesson-id');

    // Identify textareas
    const htmlArea = mode === 'htmlcss'
      ? group.querySelector('textarea[id$="html"]') || group.querySelector('textarea')
      : group.querySelector('textarea');
    const cssArea = mode === 'htmlcss' ? group.querySelector('textarea[id$="css"]') : null;

    // Save initial content for reset
    const initialHTML = htmlArea ? htmlArea.value : '';
    const initialCSS = cssArea ? cssArea.value : '';

    // Initial render
    if (frame) {
      if (mode === 'htmlcss') renderToFrame(frame, initialHTML, initialCSS);
      else renderToFrame(frame, initialHTML);
    }

    // Run
    const runBtn = group.querySelector('[data-run]');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const html = htmlArea?.value || '';
        const css = cssArea?.value || '';
        renderToFrame(frame, html, css);
      });
    }

    // Reset
    const resetBtn = group.querySelector('[data-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (htmlArea) htmlArea.value = initialHTML;
        if (cssArea) cssArea.value = initialCSS;
        if (frame) {
          if (mode === 'htmlcss') renderToFrame(frame, initialHTML, initialCSS);
          else renderToFrame(frame, initialHTML);
        }
        const feedback = group.querySelector('.exercise-feedback');
        if (feedback) feedback.textContent = '';
      });
    }

    // Instant preview on input (debounced)
    let debounceTimer = null;
    const triggerInstantPreview = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const html = htmlArea?.value || '';
        const css = cssArea?.value || '';
        renderToFrame(frame, html, css);
      }, 250);
    };
    htmlArea?.addEventListener('input', triggerInstantPreview);
    cssArea?.addEventListener('input', triggerInstantPreview);

    // Check challenge
    const checkBtn = group.querySelector('[data-check]');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        const feedback = group.querySelector('.exercise-feedback');
        const type = checkBtn.getAttribute('data-check-type');
        const selector = checkBtn.getAttribute('data-check-selector');
        const expected = checkBtn.getAttribute('data-expected');
        const contains = checkBtn.getAttribute('data-contains');
        const cssProp = checkBtn.getAttribute('data-css-prop');

        const currentHTML = htmlArea?.value || '';
        const currentCSS = cssArea?.value || '';
        renderToFrame(frame, currentHTML, currentCSS);

        const { result, message } = checkChallenge({
          frame, type, selector, expected, contains, cssProp,
          currentHTML, currentCSS
        });

        if (feedback) {
          feedback.textContent = message;
          feedback.style.color = result ? 'var(--success)' : 'var(--error)';
        }

        if (result) {
          playSuccessAnimation(group);
          if (lessonId) completeLesson(lessonId);
        }
      });
    }
  });
}

// Restore badges UI from localStorage
function restoreBadgesUI() {
  const state = getProgress();
  Object.entries(state.badges || {}).forEach(([badgeId, unlocked]) => {
    if (!unlocked) return;
    const card = document.querySelector(`.badge-card[data-badge="${badgeId}"]`);
    if (card) {
      card.classList.add('unlocked');
      const status = card.querySelector('.badge-status');
      if (status) status.textContent = 'Unlocked';
    }
  });
}

// ---------- Initialization ----------

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initTheme();
  initMobileMenu();
  setupEditors();
  updateProgressUI();
  restoreBadgesUI();
});
