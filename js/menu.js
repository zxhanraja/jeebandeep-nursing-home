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
    item.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu when clicking outside of drawer content
  drawerOverlay.addEventListener('click', (e) => {
    if (e.target === drawerOverlay) {
      closeMenu();
    }
  });
}
