const navButton = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('#main-nav');
const services = document.querySelector('#services-menu');

function closeNav() {
  navButton?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
}
navButton?.addEventListener('click', () => {
  const open = navButton.getAttribute('aria-expanded') !== 'true';
  navButton.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (services?.open) { services.open = false; services.querySelector('summary').focus(); }
  else if (nav?.classList.contains('is-open')) { closeNav(); navButton.focus(); }
});
document.addEventListener('click', (event) => {
  if (services?.open && !services.contains(event.target)) services.open = false;
  if (nav?.classList.contains('is-open') && !event.target.closest('.site-header')) closeNav();
});
window.matchMedia('(min-width: 1000px)').addEventListener('change', closeNav);

const form = document.querySelector('#enquiry-form');
if (form) {
  const result = document.querySelector('#enquiry-ready');
  const selected = new URLSearchParams(window.location.search).get('service');
  if ([...form.elements.service.options].some(option => option.value === selected)) form.elements.service.value = selected;
  // Editing a prepared message requires preparing it again before sending.
  form.addEventListener('input', () => { result.hidden = true; });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name')).trim();
    const message = String(data.get('message')).trim();
    if (!name || !message) {
      const field = !name ? form.elements.name : form.elements.message;
      field.setCustomValidity('Please enter more than spaces.');
      field.reportValidity();
      field.addEventListener('input', () => field.setCustomValidity(''), { once: true });
      return;
    }
    const subject = 'EBS enquiry: ' + data.get('service');
    const body = `Hi EBS Resources,\n\nI’d like to enquire about ${data.get('service')}.\n\nName: ${name}\nCompany: ${String(data.get('company')).trim() || 'Not specified'}\nEmail: ${data.get('email')}\n\n${message}`;
    result.querySelector('[data-send-whatsapp]').href = 'https://wa.me/60109216457?text=' + encodeURIComponent(body);
    result.querySelector('[data-send-email]').href = 'mailto:afiqkhairuddin@ebsresources.my?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    result.hidden = false;
    result.focus();
    result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    // Preparing a message is not a delivered enquiry and sends no conversion event.
  });
}
