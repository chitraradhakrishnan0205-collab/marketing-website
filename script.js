// FormSubmit.co — no signup required; first submission triggers a one-time
// confirmation email to the destination address that must be clicked to activate it.
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/chitraradhakrishnan0205@gmail.com';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth scroll for all internal anchor links (nav + hero CTAs + footer)
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    event.preventDefault();
    targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});

// Enquiry form handling
const form = document.getElementById('enquiry-form');
const statusEl = document.getElementById('form-status');
const submitBtn = form.querySelector('.form-submit');
const submitBtnDefaultText = submitBtn.textContent;

function setStatus(el, message, type) {
  el.textContent = message;
  el.classList.remove('success', 'error');
  if (type) el.classList.add(type);
}

function clearFieldError(field) {
  field.classList.remove('invalid');
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function validateForm() {
  const nameField = form.elements.name;
  const emailField = form.elements.email;
  const messageField = form.elements.message;

  [nameField, emailField, messageField].forEach(clearFieldError);

  const errors = [];

  if (!nameField.value.trim()) {
    nameField.classList.add('invalid');
    errors.push('Name is required.');
  }

  if (!emailField.value.trim()) {
    emailField.classList.add('invalid');
    errors.push('Email is required.');
  } else if (!EMAIL_REGEX.test(emailField.value.trim())) {
    emailField.classList.add('invalid');
    errors.push('Please enter a valid email address.');
  }

  if (!messageField.value.trim()) {
    messageField.classList.add('invalid');
    errors.push('Message is required.');
  }

  return errors;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const errors = validateForm();
  if (errors.length > 0) {
    setStatus(statusEl, errors[0], 'error');
    return;
  }

  const payload = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    company: form.elements.company.value.trim(),
    message: form.elements.message.value.trim(),
    _subject: 'New enquiry — Momentum contact form',
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  setStatus(statusEl, 'Sending your message…', null);

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus(statusEl, 'Thanks! Your message has been sent — we\'ll be in touch soon.', 'success');
      speak('Thank you for your submission. We will get back to you in 3 business days.');
      form.reset();
    } else {
      setStatus(statusEl, 'Something went wrong sending your message. Please try again.', 'error');
    }
  } catch (err) {
    setStatus(statusEl, 'Network error — please check your connection and try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtnDefaultText;
  }
});

// Lead magnet form handling — captures the email, notifies Momentum, and
// unlocks the playbook immediately so the visitor doesn't have to wait on email.
const leadForm = document.getElementById('lead-magnet-form');

if (leadForm) {
  const leadStatusEl = document.getElementById('lead-form-status');
  const leadSubmitBtn = leadForm.querySelector('button[type="submit"]');
  const leadSubmitDefaultText = leadSubmitBtn.textContent;
  const leadEmailField = leadForm.elements.email;

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    leadEmailField.classList.remove('invalid');
    const email = leadEmailField.value.trim();

    if (!email || !EMAIL_REGEX.test(email)) {
      leadEmailField.classList.add('invalid');
      setStatus(leadStatusEl, 'Please enter a valid email address.', 'error');
      return;
    }

    leadSubmitBtn.disabled = true;
    leadSubmitBtn.textContent = 'Unlocking…';
    setStatus(leadStatusEl, 'One moment…', null);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          _subject: 'New Growth Audit Playbook request',
        }),
      });

      if (response.ok) {
        leadStatusEl.innerHTML = 'You\'re in — <a href="playbook.html" target="_blank" rel="noopener">open the Growth Audit Playbook</a>.';
        leadStatusEl.classList.remove('error');
        leadStatusEl.classList.add('success');
        leadForm.reset();
      } else {
        setStatus(leadStatusEl, 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      setStatus(leadStatusEl, 'Network error — please check your connection and try again.', 'error');
    } finally {
      leadSubmitBtn.disabled = false;
      leadSubmitBtn.textContent = leadSubmitDefaultText;
    }
  });
}

// Scoreboard stat counters — animate up when scrolled into view
const statNumbers = document.querySelectorAll('.stat-number');

function renderStatValue(el, value) {
  const decimals = Number(el.dataset.decimals || 0);
  const suffix = el.dataset.suffix || '';
  el.textContent = `${value.toFixed(decimals)}${suffix}`;
}

function animateStat(el) {
  const target = Number(el.dataset.countTo);

  if (prefersReducedMotion) {
    renderStatValue(el, target);
    return;
  }

  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    renderStatValue(el, target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

if (statNumbers.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statNumbers.forEach((el) => observer.observe(el));
}

// WhatsApp floating widget — toggles the suggested-queries panel
const whatsappFab = document.getElementById('whatsapp-fab');
const whatsappPanel = document.getElementById('whatsapp-panel');
const whatsappClose = document.getElementById('whatsapp-panel-close');

if (whatsappFab && whatsappPanel) {
  function openWhatsappPanel() {
    whatsappPanel.hidden = false;
    whatsappFab.setAttribute('aria-expanded', 'true');
  }

  function closeWhatsappPanel() {
    whatsappPanel.hidden = true;
    whatsappFab.setAttribute('aria-expanded', 'false');
  }

  whatsappFab.addEventListener('click', () => {
    if (whatsappPanel.hidden) {
      openWhatsappPanel();
    } else {
      closeWhatsappPanel();
    }
  });

  whatsappClose.addEventListener('click', closeWhatsappPanel);

  document.addEventListener('click', (event) => {
    if (whatsappPanel.hidden) return;
    if (whatsappPanel.contains(event.target) || whatsappFab.contains(event.target)) return;
    closeWhatsappPanel();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !whatsappPanel.hidden) {
      closeWhatsappPanel();
      whatsappFab.focus();
    }
  });
}
