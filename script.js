/* ===== Google Analytics Helper ===== */
function gaEvent(name, params) {
  if (typeof gtag === 'function') { gtag('event', name, params || {}); }
}

/* ===== Track all [data-ga] clicks ===== */
document.addEventListener('click', function (e) {
  var el = e.target.closest('[data-ga]');
  if (!el) return;
  var label = el.getAttribute('data-ga');
  gaEvent('cta_click', { cta_label: label, href: el.getAttribute('href') || '' });
});

/* ===== Mobile nav ===== */
function toggleMobileNav() {
  var nav = document.getElementById('mobileNav');
  if (!nav) return;
  nav.classList.toggle('open');
  var burger = document.getElementById('burger');
  if (burger) burger.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
}
function closeMobileNav() {
  var nav = document.getElementById('mobileNav');
  if (nav) nav.classList.remove('open');
  var burger = document.getElementById('burger');
  if (burger) burger.setAttribute('aria-expanded', 'false');
}

/* Close mobile nav when clicking outside */
document.addEventListener('click', function (e) {
  var nav = document.getElementById('mobileNav');
  var burger = document.getElementById('burger');
  if (nav && nav.classList.contains('open')) {
    if (!nav.contains(e.target) && !burger.contains(e.target)) { closeMobileNav(); }
  }
});

/* ===== Header scroll shadow ===== */
(function () {
  var header = document.getElementById('siteHeader');
  if (!header) return;
  function onScroll() {
    if (window.scrollY > 10) { header.classList.add('scrolled'); }
    else { header.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ===== Zone tab switching ===== */
function switchZone(zone) {
  /* Deactivate all tabs and panels */
  document.querySelectorAll('.zone-tab').forEach(function (t) {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.zone-panel').forEach(function (p) {
    p.classList.remove('active');
  });
  /* Activate selected */
  var tab = document.getElementById('tab-' + zone);
  var panel = document.getElementById('panel-' + zone);
  if (tab) { tab.classList.add('active'); tab.setAttribute('aria-selected', 'true'); }
  if (panel) { panel.classList.add('active'); }
  gaEvent('zone_view', { zone: zone });
}

/* ===== FAB (Floating Action Button) ===== */
function toggleFabMenu() {
  var menu = document.getElementById('fabMenu');
  var btn  = document.getElementById('fabBtn');
  var bd   = document.getElementById('fabBackdrop');
  if (!menu || !btn) return;
  var isOpen = menu.classList.contains('open');
  if (isOpen) {
    closeFabMenu();
  } else {
    menu.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    if (bd) bd.classList.add('open');
  }
}

function closeFabMenu() {
  var menu = document.getElementById('fabMenu');
  var btn  = document.getElementById('fabBtn');
  var bd   = document.getElementById('fabBackdrop');
  if (menu) { menu.classList.remove('open'); menu.setAttribute('aria-hidden', 'true'); }
  if (btn)  { btn.classList.remove('open');  btn.setAttribute('aria-expanded', 'false'); }
  if (bd)   { bd.classList.remove('open'); }
}

/* ===== Smooth scroll for anchor links ===== */
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href^="#"]');
  if (!a) return;
  var id = a.getAttribute('href').slice(1);
  if (!id) return;
  var target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  var header = document.getElementById('siteHeader');
  var offset = header ? header.offsetHeight : 64;
  var top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
  window.scrollTo({ top: top, behavior: 'smooth' });
});

/* ===== Keyboard navigation for zone tabs (arrow keys) ===== */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  var active = document.querySelector('.zone-tab[aria-selected="true"]');
  if (!active || document.activeElement !== active) return;
  var tabs = Array.from(document.querySelectorAll('.zone-tab'));
  var idx = tabs.indexOf(active);
  var next = e.key === 'ArrowRight' ? idx + 1 : idx - 1;
  if (next < 0 || next >= tabs.length) return;
  e.preventDefault();
  tabs[next].focus();
  tabs[next].click();
});

/* ===== Char counter for message textarea ===== */
function updateCharCount(el) {
  var counter = document.getElementById('charCount');
  if (counter) { counter.textContent = el.value.length; }
}

/* ===== Phone formatter for +998 ===== */
function formatPhoneInput(el) {
  var raw = el.value.replace(/\D/g, '');
  /* Ensure starts with 998 */
  if (raw.startsWith('998')) {
    raw = raw.slice(0, 12); /* 998 + 9 digits */
  } else if (raw.startsWith('0')) {
    raw = '998' + raw.slice(1);
    raw = raw.slice(0, 12);
  } else if (raw.length > 0) {
    raw = '998' + raw;
    raw = raw.slice(0, 12);
  }
  /* Format: +998 XX XXX XX XX */
  var formatted = '';
  if (raw.length > 0)  formatted = '+' + raw.slice(0, 3);
  if (raw.length > 3)  formatted += ' ' + raw.slice(3, 5);
  if (raw.length > 5)  formatted += ' ' + raw.slice(5, 8);
  if (raw.length > 8)  formatted += ' ' + raw.slice(8, 10);
  if (raw.length > 10) formatted += ' ' + raw.slice(10, 12);
  el.value = formatted;
}

/* ===== Google Sheets endpoint — вставьте URL вашего задеплоенного Apps Script ===== */
var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRMPPjXIzURK7h4IeW5OO2SbLLVlswgptA--vahZ_VhfwqASRZNxE34xgxRfF35hg7/exec';

/* ===== Form validation helpers ===== */
function showFieldError(field, msg) {
  var row = field.closest('.form-row');
  if (!row) return;
  var el = row.querySelector('.form-error-msg');
  if (!el) {
    el = document.createElement('span');
    el.className = 'form-error-msg';
    var anchor = field.type === 'checkbox' ? (field.closest('.consent-label') || field) : field;
    anchor.insertAdjacentElement('afterend', el);
  }
  el.textContent = msg;
  el.style.display = 'block';
}

function clearFieldError(field) {
  var row = field.closest('.form-row');
  if (!row) return;
  var el = row.querySelector('.form-error-msg');
  if (el) el.style.display = 'none';
}

/* Clear errors on user interaction */
(function () {
  var form = document.getElementById('callbackForm');
  if (!form) return;
  form.addEventListener('input', function (e) {
    if (e.target.hasAttribute('required')) {
      e.target.classList.remove('error');
      clearFieldError(e.target);
    }
  });
  form.addEventListener('change', function (e) {
    if (e.target.hasAttribute('required')) {
      e.target.classList.remove('error');
      clearFieldError(e.target);
      if (e.target.type === 'checkbox') {
        var lbl = e.target.closest('.form-row').querySelector('.consent-label');
        if (lbl) lbl.style.color = '';
      }
    }
  });
}());

/* ===== Feedback form submission ===== */
function submitFeedbackForm(e) {
  e.preventDefault();
  var form = e.target;

  /* Validation */
  var valid = true;
  form.querySelectorAll('[required]').forEach(function (field) {
    field.classList.remove('error');
    clearFieldError(field);
    if (field.type === 'checkbox') {
      var lbl = field.closest('.form-row').querySelector('.consent-label');
      if (!field.checked) {
        valid = false;
        if (lbl) lbl.style.color = 'var(--red)';
        showFieldError(field, 'Необходимо дать согласие на обработку данных');
      } else {
        if (lbl) lbl.style.color = '';
      }
    } else {
      if (!field.value.trim()) {
        valid = false;
        field.classList.add('error');
        showFieldError(field, 'Пожалуйста, заполните это поле');
      }
    }
  });
  if (!valid) {
    var first = form.querySelector('.error, [required]:not(:checked)');
    if (first) first.focus();
    return;
  }

  var btn = form.querySelector('[type="submit"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Отправляем...'; }

  /* Collect data — field names map to Apps Script data.* keys */
  var topicSelect = form.querySelector('#topic');
  var payload = {
    name:            form.querySelector('#fullname').value.trim(),
    mobilePhone:     form.querySelector('#phone').value.trim(),
    telegramContact: (form.querySelector('#telegram').value || '').trim(),
    school:          form.querySelector('#school').value.trim(),
    visitReason:     topicSelect ? topicSelect.options[topicSelect.selectedIndex].text : '',
    comment:         (form.querySelector('#message').value || '').trim()
  };

  /* no-cors required — Apps Script doesn't return CORS headers for doPost */
  fetch(GOOGLE_SCRIPT_URL, {
    method:  'POST',
    mode:    'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body:    JSON.stringify(payload)
  })
  .then(function () {
    showFormSuccess();
    gaEvent('form_submit_success', { form: 'feedback' });
  })
  .catch(function () {
    if (btn) { btn.disabled = false; btn.textContent = '📅 Заказать обратный звонок →'; }
    alert('Ошибка отправки. Пожалуйста, позвоните нам или напишите в Telegram.');
    gaEvent('form_submit_error', { form: 'feedback' });
  });
}

/* ===== Privacy modal ===== */
function openPrivacyModal() {
  var modal = document.getElementById('privacyModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePrivacyModal(e) {
  if (e && e.target !== e.currentTarget) return; /* click inside box — ignore */
  var modal = document.getElementById('privacyModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  var modal = document.getElementById('privacyModal');
  if (modal && modal.classList.contains('open')) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ===== Pre-fill form topic for callback CTA ===== */
function prefillCallbackForm() {
  var topic = document.getElementById('topic');
  if (topic) { topic.value = 'callback'; }
}

function showFormSuccess() {
  var content = document.getElementById('form-content');
  var success = document.getElementById('formSuccess');
  if (content) content.style.display = 'none';
  if (success) success.classList.add('show');
  gaEvent('form_success_shown');
}