/**
 * Dr. Manisha Patel Clinic - Main JavaScript Logic
 * Specialist in Hair & Skin Treatments | BHMS (Drt)
 * Contact: +91 8619106758 | Debari, Udaipur
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
      const isOpen = navMenu.classList.contains('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // 2. Set Minimum Date on Date Picker to Today
  const appointmentDate = document.getElementById('appointmentDate');
  if (appointmentDate) {
    const today = new Date().toISOString().split('T')[0];
    appointmentDate.setAttribute('min', today);
  }

  // 3. Appointment Form Handling
  const appointmentForm = document.getElementById('appointmentForm');
  const whatsappBookingBtn = document.getElementById('whatsappBookingBtn');
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalCloseSecondary = document.getElementById('modalCloseSecondary');
  const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');

  // Form Fields
  const patientName = document.getElementById('patientName');
  const patientPhone = document.getElementById('patientPhone');
  const patientEmail = document.getElementById('patientEmail');
  const treatmentType = document.getElementById('treatmentType');
  const preferredTime = document.getElementById('preferredTime');
  const patientNotes = document.getElementById('patientNotes');

  // Helper: Format WhatsApp Message
  function buildWhatsAppMessage(token = '') {
    const name = patientName?.value.trim() || 'Patient';
    const phone = patientPhone?.value.trim() || 'Not provided';
    const treatment = treatmentType?.value || 'Consultation';
    const date = appointmentDate?.value || 'Next Available';
    const time = preferredTime?.value || 'Morning / Evening';
    const notes = patientNotes?.value.trim() || 'Consultation regarding hair / skin';
    const tokenId = token || 'NEW-REQ-' + Math.floor(1000 + Math.random() * 9000);

    const message = 
      `*New Appointment Request - Dr. Manisha Patel Clinic*\n` +
      `───────────────────────\n` +
      `🔖 *Booking Token:* #${tokenId}\n` +
      `👤 *Patient Name:* ${name}\n` +
      `📞 *Phone Number:* ${phone}\n` +
      `🩺 *Consultation For:* ${treatment}\n` +
      `📅 *Preferred Date:* ${date}\n` +
      `⏰ *Preferred Time:* ${time}\n` +
      `📝 *Symptoms / Concern:* ${notes}\n` +
      `───────────────────────\n` +
      `📍 *Clinic Address:* Jain Diwaker Gali, near Balaji Polytechnic College, Debari, Udaipur, Rajasthan`;

    return encodeURIComponent(message);
  }

  // Helper: Validate Form
  function validateForm() {
    if (!patientName.value.trim()) {
      alert('Please enter the patient full name.');
      patientName.focus();
      return false;
    }
    const phoneVal = patientPhone.value.trim().replace(/\D/g, '');
    if (!phoneVal || phoneVal.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      patientPhone.focus();
      return false;
    }
    if (!appointmentDate.value) {
      alert('Please select your preferred appointment date.');
      appointmentDate.focus();
      return false;
    }
    return true;
  }

  // Handle Standard Form Submit
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const randomToken = 'MP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      
      // Update Modal Elements
      document.getElementById('modalToken').textContent = '#' + randomToken;
      document.getElementById('modalPatientName').textContent = patientName.value.trim();
      document.getElementById('modalPhone').textContent = patientPhone.value.trim();
      document.getElementById('modalTreatment').textContent = treatmentType.options[treatmentType.selectedIndex].text;
      document.getElementById('modalDateTime').textContent = `${appointmentDate.value} (${preferredTime.value})`;

      // Prepare WhatsApp button link inside modal
      const waUrl = `https://wa.me/918619106758?text=${buildWhatsAppMessage(randomToken)}`;
      if (modalWhatsAppBtn) {
        modalWhatsAppBtn.href = waUrl;
      }

      // Open Modal
      if (bookingModal) {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Store in localStorage for reference
      try {
        const appointmentData = {
          token: randomToken,
          name: patientName.value.trim(),
          phone: patientPhone.value.trim(),
          service: treatmentType.value,
          date: appointmentDate.value,
          time: preferredTime.value,
          created: new Date().toISOString()
        };
        localStorage.setItem('lastClinicAppointment', JSON.stringify(appointmentData));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
    });
  }

  // Handle Direct WhatsApp Booking Button
  if (whatsappBookingBtn) {
    whatsappBookingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!patientName.value.trim() || !patientPhone.value.trim()) {
        const proceed = confirm('Would you like to send quick appointment request with current details to WhatsApp (+91 8619106758)?');
        if (!proceed) {
          patientName.focus();
          return;
        }
      }
      const waUrl = `https://wa.me/918619106758?text=${buildWhatsAppMessage()}`;
      window.open(waUrl, '_blank');
    });
  }

  // Close Modal Functionality
  function closeModal() {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
      if (appointmentForm) {
        appointmentForm.reset();
      }
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalCloseSecondary) modalCloseSecondary.addEventListener('click', closeModal);

  // Close modal when clicking outside card
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

  // Quick Anchor Scroll highlight
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        activeLink?.classList.add('active');
      } else {
        activeLink?.classList.remove('active');
      }
    });
  });
});
