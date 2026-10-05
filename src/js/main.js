const state = { amount: null, method: null };

const form = document.getElementById('paymentForm');

const amountGrid = document.getElementById('amountGrid');
const amountBtns = Array.from(amountGrid.querySelectorAll('.amount-btn'));
const amountErrorMsg = document.getElementById('amountErrorMsg');
const customWrap = document.getElementById('customAmountWrap');
const customInput = document.getElementById('customAmountInput');

const payGrid = document.getElementById('payGrid');
const payBtns = Array.from(payGrid.querySelectorAll('.pay-btn'));
const payErrorMsg = document.getElementById('payErrorMsg');

const emailInput = document.getElementById('emailInput');
const emailWrap = document.getElementById('emailWrap');

const consentBlock = document.querySelector('.consent');
const consentBox = document.getElementById('consent1');
const consentErrorMsg = document.getElementById('consentErrorMsg');

const cta = document.getElementById('ctaBtn');

const ddCollapsed = document.getElementById('ddCollapsed');
const ddExpanded = document.getElementById('ddExpanded');

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Kafelki z role="radio": zaznaczenie klikiem oraz Enter/Spacją
function bindRadioGroup(btns, onSelect) {
  btns.forEach((btn) => {
    btn.addEventListener('click', () => onSelect(btn));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(btn);
      }
    });
  });
}

function markSelected(btns, selected) {
  btns.forEach((b) => {
    b.classList.remove('selected');
    b.setAttribute('aria-checked', 'false');
  });
  selected.classList.add('selected');
  selected.setAttribute('aria-checked', 'true');
}

function clearAmountError() {
  amountGrid.classList.remove('field-error');
  amountErrorMsg.classList.remove('show');
}

bindRadioGroup(amountBtns, (btn) => {
  markSelected(amountBtns, btn);
  const val = btn.dataset.amount;
  if (val === 'other') {
    customWrap.classList.add('show');
    customInput.focus();
    state.amount = customInput.value ? Number(customInput.value) : null;
  } else {
    customWrap.classList.remove('show');
    state.amount = Number(val);
  }
  clearAmountError();
});

customInput.addEventListener('input', () => {
  state.amount = customInput.value ? Number(customInput.value) : null;
  clearAmountError();
});

bindRadioGroup(payBtns, (btn) => {
  markSelected(payBtns, btn);
  state.method = btn.dataset.method;
  payGrid.classList.remove('field-error');
  payErrorMsg.classList.remove('show');
});

emailInput.addEventListener('input', () => {
  const v = emailInput.value.trim();
  if (v.length === 0) {
    emailInput.classList.remove('valid', 'invalid');
    emailWrap.classList.remove('show-error');
  } else if (validateEmail(v)) {
    emailInput.classList.add('valid');
    emailInput.classList.remove('invalid');
    emailWrap.classList.remove('show-error');
  } else {
    emailInput.classList.remove('valid');
  }
});

emailInput.addEventListener('blur', () => {
  const v = emailInput.value.trim();
  if (v.length > 0 && !validateEmail(v)) {
    emailInput.classList.add('invalid');
    emailWrap.classList.add('show-error');
  }
});

consentBox.addEventListener('change', () => {
  consentBlock.classList.remove('field-error');
  consentErrorMsg.classList.remove('show');
});

document.getElementById('ddExpandBtn').addEventListener('click', () => {
  ddCollapsed.hidden = true;
  ddExpanded.hidden = false;
});
document.getElementById('ddCollapseBtn').addEventListener('click', () => {
  ddExpanded.hidden = true;
  ddCollapsed.hidden = false;
});

// Przycisk jest zawsze aktywny — walidacja całego formularza dopiero przy wysyłce.
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const amountOk = state.amount && state.amount > 0;
  const methodOk = !!state.method;
  const emailOk = validateEmail(emailInput.value.trim());
  const consentOk = consentBox.checked;

  amountGrid.classList.toggle('field-error', !amountOk);
  amountErrorMsg.classList.toggle('show', !amountOk);

  payGrid.classList.toggle('field-error', !methodOk);
  payErrorMsg.classList.toggle('show', !methodOk);

  emailInput.classList.toggle('invalid', !emailOk);
  emailWrap.classList.toggle('show-error', !emailOk);

  consentBlock.classList.toggle('field-error', !consentOk);
  consentErrorMsg.classList.toggle('show', !consentOk);

  const firstError = !amountOk ? amountGrid
    : !methodOk ? payGrid
    : !emailOk ? emailWrap
    : !consentOk ? consentBlock
    : null;

  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // TODO: podpiąć prawdziwą płatność (Axepta / BLIK) — na razie tylko symulacja.
  cta.classList.add('loading');
  setTimeout(() => {
    cta.classList.remove('loading');
    cta.classList.add('success');
  }, 1100);
});
