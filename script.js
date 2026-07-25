// Replace with your actual Formspree form ID: https://formspree.io/forms
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

// Smooth scroll for all internal anchor links (nav + hero CTA)
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    event.preventDefault();
    targetEl.scrollIntoView({ behavior: 'smooth' });
  });
});

// Enquiry form handling
const form = document.getElementById('enquiry-form');
const statusEl = document.getElementById('form-status');
const submitBtn = form.querySelector('.form-submit');
const submitBtnDefaultText = submitBtn.textContent;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.classList.remove('success', 'error');
  if (type) statusEl.classList.add(type);
}

function clearFieldError(field) {
  field.classList.remove('invalid');
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
    setStatus(errors[0], 'error');
    return;
  }

  const payload = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    company: form.elements.company.value.trim(),
    message: form.elements.message.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  setStatus('Sending your message…', null);

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus('Thanks! Your message has been sent — we\'ll be in touch soon.', 'success');
      form.reset();
    } else {
      setStatus('Something went wrong sending your message. Please try again.', 'error');
    }
  } catch (err) {
    setStatus('Network error — please check your connection and try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtnDefaultText;
  }
});
