/**
 * Homepage Slide Navigation Module
 * Handles horizontal slide scrolling navigation, smooth scrolling snapping,
 * and tracks layout scroll events to dynamically update active links.
 * Only runs on the homepage (index.html) which has .viewport-slides.
 */
function initNavigationScroll() {
  const container = document.querySelector('.viewport-slides');
  const navItems = document.querySelectorAll('.nav-item');
  const triggers = document.querySelectorAll('.nav-trigger');

  if (!container) return; // Skip if not on slides page

  // --- Fade overlay for clean instant transitions ---
  const overlay = document.createElement('div');
  overlay.id = 'slide-fade-overlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'background:var(--bg-color)',
    'z-index:9999', 'pointer-events:none',
    'opacity:0', 'transition:opacity 0.18s ease'
  ].join(';');
  document.body.appendChild(overlay);

  function fadeToSlide(index) {
    const isDesktop = window.innerWidth > 1024;
    overlay.style.opacity = '1';
    setTimeout(() => {
      if (isDesktop) {
        container.scrollTo({ left: index * window.innerWidth, behavior: 'instant' });
      } else {
        const slides = document.querySelectorAll('.board-slide');
        if (slides[index]) {
          const headerOffset = 80;
          const elementPosition = slides[index].getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'instant' });
        }
      }
      requestAnimationFrame(() => {
        overlay.style.opacity = '0';
      });
    }, 180);
  }

  // Track click scrolls on header links
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      if (href.startsWith('#') || href.includes('index.html#')) {
        e.preventDefault();
        const targetIndex = parseInt(item.getAttribute('data-target'), 10);
        if (!isNaN(targetIndex)) {
          fadeToSlide(targetIndex);
        }
      }
    });
  });

  // Track clicks on inline actions (Get Started, footer links, etc.)
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const href = trigger.getAttribute('href');
      if (href.startsWith('#') || href.includes('index.html#')) {
        e.preventDefault();
        const targetIndex = parseInt(trigger.getAttribute('data-target'), 10);
        if (!isNaN(targetIndex)) {
          fadeToSlide(targetIndex);
        }
      }
    });
  });

  // On page load: jump to correct slide if URL has a hash (e.g. index.html#board-facilities)
  const slideIds = ['board-intro', 'board-departments', 'board-facilities', 'board-contact'];
  const hash = window.location.hash.replace('#', '');
  const hashIndex = slideIds.indexOf(hash);
  if (hashIndex >= 0) {
    const isDesktop = window.innerWidth > 1024;
    if (hashIndex > 0) {
      if (isDesktop) {
        container.scrollLeft = hashIndex * window.innerWidth;
      } else {
        const slides = document.querySelectorAll('.board-slide');
        if (slides[hashIndex]) {
          const headerOffset = 80;
          const elementPosition = slides[hashIndex].getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'instant' });
        }
      }
    }
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('loading-hash');
    });
  }

  // Monitor scroll progress to synchronize nav active states
  let isScrolling;
  container.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      const isDesktop = window.innerWidth > 1024;
      if (!isDesktop) return;

      const scrollPos = container.scrollLeft;
      const slideWidth = window.innerWidth;
      const activeIndex = Math.round(scrollPos / slideWidth);

      navItems.forEach((link) => {
        const target = link.getAttribute('data-target');
        if (target !== null && parseInt(target, 10) === activeIndex) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }, 100);
  });
}

/**
 * Implements mouse-tracking overlay preview card on clinical department lists.
 * Desktop only feature.
 */
function initDepartmentHoverPreviews() {
  const isDesktop = window.innerWidth > 1024;
  if (!isDesktop) return;

  const rows = document.querySelectorAll('.dept-row');
  const previewBox = document.getElementById('hover-preview-container');
  const previewImg = document.getElementById('hover-preview-img');

  if (!previewBox || !previewImg) return;

  rows.forEach(row => {
    const imgUrl = row.getAttribute('data-preview');

    row.addEventListener('mouseenter', () => {
      if (!imgUrl) return;
      previewImg.src = imgUrl;
      previewBox.style.opacity = '1';
      previewBox.style.transform = 'scale(1)';
    });

    row.addEventListener('mousemove', (e) => {
      const offsetX = 25;
      const offsetY = 25;

      let targetX = e.clientX + offsetX;
      let targetY = e.clientY + offsetY;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const boxWidth = previewBox.offsetWidth;
      const boxHeight = previewBox.offsetHeight;

      if (targetX + boxWidth > windowWidth) targetX = e.clientX - boxWidth - offsetX;
      if (targetY + boxHeight > windowHeight) targetY = e.clientY - boxHeight - offsetY;

      previewBox.style.left = `${targetX}px`;
      previewBox.style.top = `${targetY}px`;
    });

    row.addEventListener('mouseleave', () => {
      previewBox.style.opacity = '0';
      previewBox.style.transform = 'scale(0.85)';
    });
  });
}
