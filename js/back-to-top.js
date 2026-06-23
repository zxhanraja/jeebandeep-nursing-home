/**
 * Back-to-Top Button Module
 * Shows a scroll-to-top arrow button after user scrolls past 300px.
 * Works on both vertical scroll (mobile/subpages) and horizontal
 * scroll (desktop homepage slider).
 */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const THRESHOLD = 300;

  const updateVisibility = () => {
    const verticalScroll = window.scrollY || document.documentElement.scrollTop;
    const container = document.querySelector('.viewport-slides');
    const horizontalScroll = container ? container.scrollLeft : 0;

    const shouldShow = verticalScroll > THRESHOLD || horizontalScroll > THRESHOLD;
    if (shouldShow) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  };

  // Listen on window scroll (subpages / mobile)
  window.addEventListener('scroll', updateVisibility, { passive: true });

  // Also listen on the horizontal slider container (desktop homepage)
  const slidesContainer = document.querySelector('.viewport-slides');
  if (slidesContainer) {
    slidesContainer.addEventListener('scroll', updateVisibility, { passive: true });
  }

  // Click: scroll back to top
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (slidesContainer) {
      slidesContainer.scrollTo({ left: 0, behavior: 'smooth' });
    }
  });
}
