/**
 * Swiss-style preloader: animates a progress bar from 0% to 100% with
 * a percentage counter, then fades out to reveal the page content.
 * 
 * CRITICAL: This runs as early as possible (before DOMContentLoaded if called inline,
 * or immediately on DOMContentLoaded). The preloader must cover everything with
 * a high z-index to avoid content bleed-through on mobile.
 */
function initPreloader() {
  const preloader = document.getElementById('swiss-preloader');
  const bar = document.getElementById('preloader-bar');
  const pct = document.getElementById('preloader-percentage');

  if (!preloader || !bar || !pct) return;

  // Skip preloader if already seen in this session
  if (sessionStorage.getItem('preloader-seen')) {
    preloader.style.display = 'none';
    document.body.style.overflow = '';
    if (preloader.parentNode) {
      preloader.parentNode.removeChild(preloader);
    }
    return;
  }

  // Ensure preloader is truly on top — force inline style to override any stacking context issues
  preloader.style.zIndex = '99999';
  preloader.style.position = 'fixed';
  preloader.style.inset = '0';
  preloader.style.isolation = 'isolate'; // Create own stacking context

  // Lock body scroll while loading
  document.body.style.overflow = 'hidden';

  const statusMessages = [
    'INITIALIZING SYSTEMS',
    'LOADING ASSETS',
    'PREPARING INTERFACE',
    'ALMOST READY'
  ];
  const statusEl = preloader.querySelector('.preloader-status');

  let progress = 0;
  const totalDuration = 1400; // ms for total animation
  const intervalMs = 16; // ~60fps
  const steps = totalDuration / intervalMs;
  const increment = 100 / steps;

  const timer = setInterval(() => {
    progress += increment + (Math.random() * 0.5);
    if (progress >= 100) progress = 100;

    const rounded = Math.floor(progress);
    // Use direct style instead of relying on CSS transition for the bar
    bar.style.width = progress + '%';
    pct.textContent = String(rounded).padStart(2, '0') + '%';

    // Update status message at milestones
    if (statusEl) {
      if (progress >= 75) statusEl.textContent = statusMessages[3];
      else if (progress >= 50) statusEl.textContent = statusMessages[2];
      else if (progress >= 25) statusEl.textContent = statusMessages[1];
    }

    if (progress >= 100) {
      clearInterval(timer);
      sessionStorage.setItem('preloader-seen', 'true');
      // Short pause at 100%, then fade out
      setTimeout(() => {
        preloader.classList.add('fade-out');
        // Restore scroll and remove preloader from DOM after fade
        setTimeout(() => {
          document.body.style.overflow = '';
          if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        }, 700);
      }, 250);
    }
  }, intervalMs);
}

// Export for module usage, also attach globally for non-module pages
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initPreloader };
}
