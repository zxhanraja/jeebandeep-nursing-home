/**
 * Jeebandeep Nursing Home — Main Application Entry Point
 *
 * This file bootstraps all page-specific and shared modules.
 * Each module is self-contained and only activates when its
 * required DOM elements are present on the page.
 *
 * Module breakdown:
 *   js/preloader.js   — Swiss preloader animation (all pages)
 *   js/clock.js       — Live IST clock (all pages)
 *   js/menu.js        — Mobile hamburger drawer (all pages)
 *   js/back-to-top.js — Back-to-top button (all pages)
 *   js/home.js        — Homepage slide nav + dept hover previews
 *   js/appointment.js — Appointment form + ticket + modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── Shared modules (run on every page) ─────────────────────────────────────
  initPreloader();       // Swiss-style loading animation
  initLiveClock();       // IST clock in header
  initMobileMenuDrawer();// Hamburger drawer toggle
  initBackToTop();       // Scroll-to-top button

  // ── Homepage-only modules ─────────────────────────────────────
  initDepartmentHoverPreviews();// Floating image on department hover (desktop)

  // ── Appointment page module ─────────────────────────────────────
  initAppointmentBooking();     // Booking form + ticket sync + modal
});

/* ═══════════════════════════════════════════════════════════════════════════
   PRELOADER — js/preloader.js
   ═══════════════════════════════════════════════════════════════════════════ */
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

  // Force preloader on top of everything, including elements with transform stacking contexts
  preloader.style.zIndex = '999999';
  preloader.style.position = 'fixed';
  preloader.style.inset = '0';

  // Lock scroll during loading
  document.body.style.overflow = 'hidden';

  const statusMessages = [
    'INITIALIZING SYSTEMS',
    'LOADING ASSETS',
    'PREPARING INTERFACE',
    'ALMOST READY'
  ];
  const statusEl = preloader.querySelector('.preloader-status');

  let progress = 0;
  const totalDuration = 1400;
  const intervalMs = 16;
  const steps = totalDuration / intervalMs;
  const increment = 100 / steps;

  const timer = setInterval(() => {
    progress += increment + (Math.random() * 0.5);
    if (progress >= 100) progress = 100;

    const rounded = Math.floor(progress);
    bar.style.width = progress + '%';
    pct.textContent = String(rounded).padStart(2, '0') + '%';

    if (statusEl) {
      if (progress >= 75) statusEl.textContent = statusMessages[3];
      else if (progress >= 50) statusEl.textContent = statusMessages[2];
      else if (progress >= 25) statusEl.textContent = statusMessages[1];
    }

    if (progress >= 100) {
      clearInterval(timer);
      sessionStorage.setItem('preloader-seen', 'true');
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          document.body.style.overflow = '';
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 700);
      }, 250);
    }
  }, intervalMs);
}

/* ═══════════════════════════════════════════════════════════════════════════
   CLOCK — js/clock.js
   ═══════════════════════════════════════════════════════════════════════════ */
function initLiveClock() {
  const timeEl = document.getElementById('live-ist-time');
  if (!timeEl) return;

  const updateClock = () => {
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
      timeEl.textContent = `LIVE // ${timeString}`;
    } catch (e) {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      timeEl.textContent = `LIVE // ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOMEPAGE SLIDE NAVIGATION (legacy — no longer used)
   ═══════════════════════════════════════════════════════════════════════════ */
function initNavigationScroll() {
  // Horizontal slide navigation removed — now a multi-page site
  return;
}

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
      const offsetX = 25, offsetY = 25;
      let targetX = e.clientX + offsetX;
      let targetY = e.clientY + offsetY;
      const boxWidth = previewBox.offsetWidth;
      const boxHeight = previewBox.offsetHeight;
      if (targetX + boxWidth > window.innerWidth) targetX = e.clientX - boxWidth - offsetX;
      if (targetY + boxHeight > window.innerHeight) targetY = e.clientY - boxHeight - offsetY;
      previewBox.style.left = `${targetX}px`;
      previewBox.style.top = `${targetY}px`;
    });

    row.addEventListener('mouseleave', () => {
      previewBox.style.opacity = '0';
      previewBox.style.transform = 'scale(0.85)';
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   APPOINTMENT BOOKING — js/appointment.js
   ═══════════════════════════════════════════════════════════════════════════ */
function initAppointmentBooking() {
  const form = document.getElementById('appointment-booking-form');
  if (!form) return;

  const nameInput    = document.getElementById('patient-name');
  const phoneInput   = document.getElementById('patient-phone');
  const deptSelect   = document.getElementById('select-department');
  const doctorSelect = document.getElementById('select-doctor');
  const dateInput    = document.getElementById('booking-date');
  const timeSelect   = document.getElementById('booking-time');

  const ticketPatient  = document.getElementById('ticket-patient-val');
  const ticketPhone    = document.getElementById('ticket-phone-val');
  const ticketDept     = document.getElementById('ticket-dept-val');
  const ticketDr       = document.getElementById('ticket-dr-val');
  const ticketDateTime = document.getElementById('ticket-datetime-val');

  const modalOverlay  = document.getElementById('success-modal-overlay');
  const resToken      = document.getElementById('res-token');
  const resPatient    = document.getElementById('res-patient');
  const resDoctor     = document.getElementById('res-doctor');
  const resSchedule   = document.getElementById('res-schedule');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');

  if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

  if (nameInput) nameInput.addEventListener('input', () => {
    if (ticketPatient) ticketPatient.textContent = nameInput.value.trim() || '--';
  });
  if (phoneInput) phoneInput.addEventListener('input', () => {
    if (ticketPhone) ticketPhone.textContent = phoneInput.value.trim() || '--';
  });
  if (deptSelect) deptSelect.addEventListener('change', () => {
    if (ticketDept) ticketDept.textContent = deptSelect.options[deptSelect.selectedIndex].text;
  });

  if (doctorSelect) doctorSelect.addEventListener('change', () => {
    const docName = doctorSelect.value;
    if (ticketDr) ticketDr.textContent = docName;
    if (deptSelect) {
      if (docName.includes('Chatterjee')) deptSelect.value = 'Cardiology';
      else if (docName.includes('Mukhopadhyay')) deptSelect.value = 'Pediatrics';
      else if (docName.includes('Sen')) deptSelect.value = 'Surgery';
      if (ticketDept) ticketDept.textContent = deptSelect.options[deptSelect.selectedIndex].text;
    }
  });

  if (deptSelect) deptSelect.addEventListener('change', () => {
    const dept = deptSelect.value;
    if (doctorSelect) {
      if (dept === 'Cardiology') doctorSelect.value = 'Dr. S. Chatterjee';
      else if (dept === 'Pediatrics') doctorSelect.value = 'Dr. A. Mukhopadhyay';
      else if (dept === 'Surgery') doctorSelect.value = 'Dr. R. Sen';
      if (ticketDr) ticketDr.textContent = doctorSelect.value || '--';
    }
  });

  const updateDateTimePreview = () => {
    const rawDate = dateInput ? dateInput.value : '';
    const timeVal = timeSelect ? timeSelect.value : '';
    if (!ticketDateTime) return;
    if (rawDate && timeVal) {
      const dateObj = new Date(rawDate);
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      ticketDateTime.textContent = `${formattedDate} // ${timeVal.split('(')[0].trim()}`;
    } else if (rawDate) {
      ticketDateTime.textContent = rawDate;
    } else if (timeVal) {
      ticketDateTime.textContent = timeVal.split('(')[0].trim();
    } else {
      ticketDateTime.textContent = '--';
    }
  };

  if (dateInput) dateInput.addEventListener('input', updateDateTimePreview);
  if (timeSelect) timeSelect.addEventListener('change', updateDateTimePreview);

  const urlParams = new URLSearchParams(window.location.search);
  const docParam = urlParams.get('doctor');
  if (docParam && doctorSelect) {
    for (let i = 0; i < doctorSelect.options.length; i++) {
      if (doctorSelect.options[i].value.includes(docParam) || docParam.includes(doctorSelect.options[i].value)) {
        doctorSelect.selectedIndex = i;
        doctorSelect.dispatchEvent(new Event('change'));
        break;
      }
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const randomHex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
    const token = `JNH-2026-${randomHex}`;
    if (resToken) resToken.textContent = token;
    if (resPatient && nameInput) resPatient.textContent = nameInput.value.trim();
    if (resDoctor && doctorSelect) resDoctor.textContent = doctorSelect.value;
    if (dateInput && timeSelect && resSchedule) {
      const dateObj = new Date(dateInput.value);
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      resSchedule.textContent = `${formattedDate} @ ${timeSelect.value}`;
    }
    if (modalOverlay) modalOverlay.classList.add('active');
  });

  const resetFormAndPreviews = () => {
    if (modalOverlay) modalOverlay.classList.remove('active');
    form.reset();
    if (ticketPatient) ticketPatient.textContent = '--';
    if (ticketPhone) ticketPhone.textContent = '--';
    if (ticketDept) ticketDept.textContent = '--';
    if (ticketDr) ticketDr.textContent = '--';
    if (ticketDateTime) ticketDateTime.textContent = '--';
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', resetFormAndPreviews);
  if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', resetFormAndPreviews);
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE MENU DRAWER — js/menu.js
   ═══════════════════════════════════════════════════════════════════════════ */
function initMobileMenuDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawerOverlay = document.getElementById('mobile-drawer-overlay');

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

  // Close drawer when clicking outside
  drawerOverlay.addEventListener('click', (e) => {
    if (e.target === drawerOverlay) closeMenu();
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   BACK TO TOP — js/back-to-top.js
   ═══════════════════════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const THRESHOLD = 300;

  const updateVisibility = () => {
    const verticalScroll = window.scrollY || document.documentElement.scrollTop;
    btn.classList.toggle('active', verticalScroll > THRESHOLD);
  };

  window.addEventListener('scroll', updateVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
