/**
 * Jeebandeep Nursing Home - Premium Minimalist Interaction System
 * Handles:
 *  1. Live IST Clock
 *  2. Slide Scroll Controller & Navigation Highlights (Homepage)
 *  3. Desktop Mouse-Tracking Department Hover Previews (Homepage)
 *  4. Appointment Portal Ticket Synchronization, pre-fill routing, and confirmation popup (Appointment page)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize live Indian Standard Time clock
  initLiveClock();

  // 2. Setup scroll interactions and navigation highlighting (if on homepage)
  initNavigationScroll();

  // 3. Setup department list cursor hover previews (if on homepage)
  initDepartmentHoverPreviews();

  // 4. Setup appointment booking validation and ticket synchronization (if on appointment page)
  initAppointmentBooking();

  // 5. Setup mobile hamburger menu drawer toggle
  initMobileMenuDrawer();

  // 6. Run Swiss-style preloader animation on every page load
  initPreloader();

  // 7. Setup scroll-to-top button visibility and click behavior
  initBackToTop();
});

/**
 * Periodically updates the live status block with current IST timezone clock format
 */
function initLiveClock() {
  const timeEl = document.getElementById('live-ist-time');
  if (!timeEl) return;

  const updateClock = () => {
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      timeEl.textContent = `LIVE // ${timeString}`;
    } catch (e) {
      // Fallback
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      timeEl.textContent = `LIVE // ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Handles horizontal slide scrolling navigation, smooth scrolling snapping,
 * and tracks layout scroll events to dynamically update active links.
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
    // Fade out
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
      // Fade back in
      requestAnimationFrame(() => {
        overlay.style.opacity = '0';
      });
    }, 180);
  }

  // Track click scrolls on header links
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Only handle if targeting slides on the same page
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
        // Set scroll position synchronously before paint to avoid visual flash
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
    // Remove loading override to fade slide in smoothly
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

      // Highlight active tab matching data-target slide
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
 * Implements mouse-tracking overlay preview card on clinical department lists
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

      if (targetX + boxWidth > windowWidth) {
        targetX = e.clientX - boxWidth - offsetX;
      }
      if (targetY + boxHeight > windowHeight) {
        targetY = e.clientY - boxHeight - offsetY;
      }

      previewBox.style.left = `${targetX}px`;
      previewBox.style.top = `${targetY}px`;
    });

    row.addEventListener('mouseleave', () => {
      previewBox.style.opacity = '0';
      previewBox.style.transform = 'scale(0.85)';
    });
  });
}

/**
 * Connects booking form fields to the dynamic ticket preview panel,
 * handles booking form submission, generates confirmation reference IDs,
 * and sets up popup modals. Also handles doctor pre-selection routing.
 */
function initAppointmentBooking() {
  const form = document.getElementById('appointment-booking-form');
  if (!form) return; // Skip if not on appointment page

  const nameInput = document.getElementById('patient-name');
  const phoneInput = document.getElementById('patient-phone');
  const deptSelect = document.getElementById('select-department');
  const doctorSelect = document.getElementById('select-doctor');
  const dateInput = document.getElementById('booking-date');
  const timeSelect = document.getElementById('booking-time');

  // Preview ticket elements
  const ticketPatient = document.getElementById('ticket-patient-val');
  const ticketPhone = document.getElementById('ticket-phone-val');
  const ticketDept = document.getElementById('ticket-dept-val');
  const ticketDr = document.getElementById('ticket-dr-val');
  const ticketDateTime = document.getElementById('ticket-datetime-val');

  // Modal elements
  const modalOverlay = document.getElementById('success-modal-overlay');
  const resToken = document.getElementById('res-token');
  const resPatient = document.getElementById('res-patient');
  const resDoctor = document.getElementById('res-doctor');
  const resSchedule = document.getElementById('res-schedule');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  // Synchronize input inputs to ticket preview panels
  nameInput.addEventListener('input', () => {
    ticketPatient.textContent = nameInput.value.trim() || '--';
  });

  phoneInput.addEventListener('input', () => {
    ticketPhone.textContent = phoneInput.value.trim() || '--';
  });

  deptSelect.addEventListener('change', () => {
    ticketDept.textContent = deptSelect.options[deptSelect.selectedIndex].text;
  });

  doctorSelect.addEventListener('change', () => {
    const docName = doctorSelect.value;
    ticketDr.textContent = docName;

    // Automatically align department based on doctor selection
    if (docName.includes('Chatterjee')) {
      deptSelect.value = 'Cardiology';
    } else if (docName.includes('Mukhopadhyay')) {
      deptSelect.value = 'Pediatrics';
    } else if (docName.includes('Sen')) {
      deptSelect.value = 'Surgery';
    }
    // Update department preview text
    ticketDept.textContent = deptSelect.options[deptSelect.selectedIndex].text;
  });

  // Automatically align doctor's department if specialty changed
  deptSelect.addEventListener('change', () => {
    const dept = deptSelect.value;
    if (dept === 'Cardiology') {
      doctorSelect.value = 'Dr. S. Chatterjee';
    } else if (dept === 'Pediatrics') {
      doctorSelect.value = 'Dr. A. Mukhopadhyay';
    } else if (dept === 'Surgery') {
      doctorSelect.value = 'Dr. R. Sen';
    }
    ticketDr.textContent = doctorSelect.value || '--';
  });

  const updateDateTimePreview = () => {
    const rawDate = dateInput.value;
    const timeVal = timeSelect.value;
    if (rawDate && timeVal) {
      // Format date beautifully
      const dateObj = new Date(rawDate);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      ticketDateTime.textContent = `${formattedDate} // ${timeVal.split('(')[0].trim()}`;
    } else if (rawDate) {
      ticketDateTime.textContent = rawDate;
    } else if (timeVal) {
      ticketDateTime.textContent = timeVal.split('(')[0].trim();
    } else {
      ticketDateTime.textContent = '--';
    }
  };

  dateInput.addEventListener('input', updateDateTimePreview);
  timeSelect.addEventListener('change', updateDateTimePreview);

  // Parse query string for doctor pre-selection routing
  const urlParams = new URLSearchParams(window.location.search);
  const docParam = urlParams.get('doctor');
  if (docParam) {
    // Search dropdown for matched doctor option
    for (let i = 0; i < doctorSelect.options.length; i++) {
      if (doctorSelect.options[i].value.includes(docParam) || docParam.includes(doctorSelect.options[i].value)) {
        doctorSelect.selectedIndex = i;
        // Trigger synthetic change event to update previews
        doctorSelect.dispatchEvent(new Event('change'));
        break;
      }
    }
  }

  // Handle form submission booking registration
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Generate unique confirmation reference token
    const randomHex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
    const token = `JNH-2026-${randomHex}`;

    // 2. Populate confirmation receipt slip modal fields
    resToken.textContent = token;
    resPatient.textContent = nameInput.value.trim();
    resDoctor.textContent = doctorSelect.value;
    
    const dateObj = new Date(dateInput.value);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    resSchedule.textContent = `${formattedDate} @ ${timeSelect.value}`;

    // 3. Show overlay modal
    modalOverlay.classList.add('active');
  });

  // Modal close action
  const resetFormAndPreviews = () => {
    modalOverlay.classList.remove('active');
    form.reset();
    
    // Clear ticket previews
    ticketPatient.textContent = '--';
    ticketPhone.textContent = '--';
    ticketDept.textContent = '--';
    ticketDr.textContent = '--';
    ticketDateTime.textContent = '--';
  };

  closeModalBtn.addEventListener('click', resetFormAndPreviews);
  modalConfirmBtn.addEventListener('click', resetFormAndPreviews);
}

/**
 * Setup mobile menu drawer events, slide routing and scroll toggles
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
          // Disable drawer close transition for instant menu hide to avoid lag while scrolling
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
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
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

/**
 * Swiss-style preloader: animates a progress bar from 0% to 100% with
 * a percentage counter, then fades out to reveal the page content.
 */
function initPreloader() {
  const preloader = document.getElementById('swiss-preloader');
  const bar = document.getElementById('preloader-bar');
  const pct = document.getElementById('preloader-percentage');

  if (!preloader || !bar || !pct) return;

  // Prevent body scroll while preloader is showing
  document.body.style.overflow = 'hidden';

  const statusMessages = [
    'INITIALIZING SYSTEMS',
    'LOADING ASSETS',
    'PREPARING INTERFACE',
    'ALMOST READY'
  ];
  const statusEl = preloader.querySelector('.preloader-status');

  let progress = 0;
  const totalDuration = 1600; // ms for total animation
  const intervalMs = 20;
  const steps = totalDuration / intervalMs;
  const increment = 100 / steps;

  const timer = setInterval(() => {
    progress += increment + (Math.random() * 0.8);
    if (progress >= 100) progress = 100;

    const rounded = Math.floor(progress);
    bar.style.width = `${progress}%`;
    pct.textContent = String(rounded).padStart(2, '0') + '%';

    // Update status message at milestones
    if (statusEl) {
      if (progress >= 75) statusEl.textContent = statusMessages[3];
      else if (progress >= 50) statusEl.textContent = statusMessages[2];
      else if (progress >= 25) statusEl.textContent = statusMessages[1];
    }

    if (progress >= 100) {
      clearInterval(timer);
      // Short pause at 100%, then fade out
      setTimeout(() => {
        preloader.classList.add('fade-out');
        // Restore scroll and remove preloader from DOM after fade
        setTimeout(() => {
          document.body.style.overflow = '';
          preloader.remove();
        }, 650);
      }, 200);
    }
  }, intervalMs);
}

/**
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
    // Vertical scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Also snap the horizontal slider back to first slide
    if (slidesContainer) {
      slidesContainer.scrollTo({ left: 0, behavior: 'smooth' });
    }
  });
}
