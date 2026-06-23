/**
 * Mobile Menu Drawer Module
 * Handles hamburger button toggle, drawer slide-in/out,
 * and body scroll lock while menu is open.
 */
function initMobileMenuDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawerOverlay = document.getElementById('mobile-drawer-overlay');
  const drawerItems = document.querySelectorAll('.drawer-item');

  if (!menuBtn || !drawerOverlay) return;

  const toggleMenu = () => {
    menuBtn.classList.toggle('active');
    drawerOverlay.classList.toggle('active');
    document.body.classList.toggle('drawer-open');
  };

  const closeMenu = () => {
    menuBtn.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.classList.remove('drawer-open');
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close drawer when clicking a link item
  drawerItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');

      const container = document.querySelector('.viewport-slides');
      if (container && (href.startsWith('#') || href.includes('index.html#'))) {
        e.preventDefault();
        const hash = href.includes('#') ? href.split('#')[1] : '';
        const targetBoard = document.getElementById(hash);
        if (targetBoard) {
          // Instant-close drawer without transition to avoid lag
          drawerOverlay.classList.add('instant-close');
          closeMenu();
          requestAnimationFrame(() => {
            drawerOverlay.classList.remove('instant-close');
          });

          const slides = Array.from(document.querySelectorAll('.board-slide'));
          const targetIndex = slides.indexOf(targetBoard);
          if (targetIndex !== -1) {
            const isDesktop = window.innerWidth > 1024;
            if (isDesktop) {
              container.scrollTo({
                left: targetIndex * window.innerWidth,
                behavior: 'smooth'
              });
            } else {
              const headerOffset = 80;
              const elementPosition = targetBoard.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
          }
        }
      } else {
        closeMenu();
      }
    });
  });

  // Close menu when clicking outside of drawer content
  drawerOverlay.addEventListener('click', (e) => {
    if (e.target === drawerOverlay) {
      closeMenu();
    }
  });
}
