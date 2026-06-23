/**
 * Appointment Booking Module
 * Connects booking form fields to the dynamic ticket preview panel,
 * handles booking form submission, generates confirmation reference IDs,
 * and sets up popup modals. Also handles doctor pre-selection routing.
 * Only runs on appointment.html.
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
  if (dateInput) dateInput.setAttribute('min', today);

  // Synchronize inputs to ticket preview
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

    // Auto-align department based on doctor selection
    if (deptSelect) {
      if (docName.includes('Chatterjee')) {
        deptSelect.value = 'Cardiology';
      } else if (docName.includes('Mukhopadhyay')) {
        deptSelect.value = 'Pediatrics';
      } else if (docName.includes('Sen')) {
        deptSelect.value = 'Surgery';
      }
      if (ticketDept) ticketDept.textContent = deptSelect.options[deptSelect.selectedIndex].text;
    }
  });

  // Auto-align doctor when department changes
  if (deptSelect) deptSelect.addEventListener('change', () => {
    const dept = deptSelect.value;
    if (doctorSelect) {
      if (dept === 'Cardiology') {
        doctorSelect.value = 'Dr. S. Chatterjee';
      } else if (dept === 'Pediatrics') {
        doctorSelect.value = 'Dr. A. Mukhopadhyay';
      } else if (dept === 'Surgery') {
        doctorSelect.value = 'Dr. R. Sen';
      }
      if (ticketDr) ticketDr.textContent = doctorSelect.value || '--';
    }
  });

  const updateDateTimePreview = () => {
    const rawDate = dateInput ? dateInput.value : '';
    const timeVal = timeSelect ? timeSelect.value : '';
    if (!ticketDateTime) return;
    if (rawDate && timeVal) {
      const dateObj = new Date(rawDate);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
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

  if (dateInput) dateInput.addEventListener('input', updateDateTimePreview);
  if (timeSelect) timeSelect.addEventListener('change', updateDateTimePreview);

  // Parse query string for doctor pre-selection routing
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

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const randomHex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
    const token = `JNH-2026-${randomHex}`;

    if (resToken) resToken.textContent = token;
    if (resPatient && nameInput) resPatient.textContent = nameInput.value.trim();
    if (resDoctor && doctorSelect) resDoctor.textContent = doctorSelect.value;

    if (dateInput && timeSelect && resSchedule) {
      const dateObj = new Date(dateInput.value);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
      resSchedule.textContent = `${formattedDate} @ ${timeSelect.value}`;
    }

    if (modalOverlay) modalOverlay.classList.add('active');
  });

  // Modal close action
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
