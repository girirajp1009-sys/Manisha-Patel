/**
 * Dr. Manisha Patel Clinic - Main JavaScript Logic
 * Advance Homeopathic Clinic | Multi-Page Architecture
 * Contact: +91 8619106758 | Debari, Udaipur
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
      const isOpen = navMenu.classList.contains('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // 2. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // 3. Set Minimum Date on Date Picker to Today
  const appointmentDate = document.getElementById('appointmentDate');
  if (appointmentDate) {
    const today = new Date().toISOString().split('T')[0];
    appointmentDate.setAttribute('min', today);
  }

  // 4. Appointment Form Handling
  const appointmentForm = document.getElementById('appointmentForm');
  const whatsappBookingBtn = document.getElementById('whatsappBookingBtn');
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalCloseSecondary = document.getElementById('modalCloseSecondary');
  const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');

  const patientName = document.getElementById('patientName');
  const patientPhone = document.getElementById('patientPhone');
  const patientEmail = document.getElementById('patientEmail');
  const treatmentType = document.getElementById('treatmentType');
  const preferredTime = document.getElementById('preferredTime');
  const patientNotes = document.getElementById('patientNotes');

  function buildWhatsAppMessage(token = '') {
    const name = patientName?.value.trim() || 'Patient';
    const phone = patientPhone?.value.trim() || 'Not provided';
    const treatment = treatmentType?.value || 'Consultation';
    const date = appointmentDate?.value || 'Next Available';
    const time = preferredTime?.value || 'Morning / Evening';
    const notes = patientNotes?.value.trim() || 'Consultation request';
    const tokenId = token || 'REQ-' + Math.floor(1000 + Math.random() * 9000);

    const message = 
      `*New Appointment Request - Dr. Manisha Patel Clinic*\n` +
      `───────────────────────\n` +
      `🔖 *Token:* #${tokenId}\n` +
      `👤 *Patient:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `🩺 *Concern:* ${treatment}\n` +
      `📅 *Date:* ${date}\n` +
      `⏰ *Slot:* ${time}\n` +
      `📝 *Notes:* ${notes}\n` +
      `───────────────────────\n` +
      `📍 *Advance Homeopathic Clinic:* Jain Diwaker Gali, Near Balaji Polytechnic, Debari, Udaipur`;

    return encodeURIComponent(message);
  }

  function validateForm() {
    if (!patientName.value.trim()) {
      alert('Please enter patient full name.');
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

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const randomToken = 'MP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      
      const modalToken = document.getElementById('modalToken');
      const modalPatientName = document.getElementById('modalPatientName');
      const modalPhone = document.getElementById('modalPhone');
      const modalTreatment = document.getElementById('modalTreatment');
      const modalDateTime = document.getElementById('modalDateTime');

      if (modalToken) modalToken.textContent = '#' + randomToken;
      if (modalPatientName) modalPatientName.textContent = patientName.value.trim();
      if (modalPhone) modalPhone.textContent = patientPhone.value.trim();
      if (modalTreatment) modalTreatment.textContent = treatmentType.options[treatmentType.selectedIndex].text;
      if (modalDateTime) modalDateTime.textContent = `${appointmentDate.value} (${preferredTime.value})`;

      const waUrl = `https://wa.me/918619106758?text=${buildWhatsAppMessage(randomToken)}`;
      if (modalWhatsAppBtn) {
        modalWhatsAppBtn.href = waUrl;
      }

      if (bookingModal) {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (whatsappBookingBtn) {
    whatsappBookingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!patientName.value.trim() || !patientPhone.value.trim()) {
        const proceed = confirm('Send appointment inquiry with entered details to Dr. Manisha Patel on WhatsApp (+91 8619106758)?');
        if (!proceed) {
          patientName.focus();
          return;
        }
      }
      const waUrl = `https://wa.me/918619106758?text=${buildWhatsAppMessage()}`;
      window.open(waUrl, '_blank');
    });
  }

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
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeModal();
    });
  }
});
