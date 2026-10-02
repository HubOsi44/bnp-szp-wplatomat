(function(){
  const state = { amount:null, customAmount:null, method:null, emailValid:false, consent:false };

  const amountGrid = document.getElementById('amountGrid');
  const amountBtns = Array.from(amountGrid.querySelectorAll('.amount-btn'));
  const customWrap = document.getElementById('customAmountWrap');
  const customInput = document.getElementById('customAmountInput');

  const payGrid = document.getElementById('payGrid');
  const payBtns = Array.from(payGrid.querySelectorAll('.pay-btn'));

  const emailInput = document.getElementById('emailInput');
  const emailWrap = document.getElementById('emailWrap');
  const consentBox = document.getElementById('consent1');
  const cta = document.getElementById('ctaBtn');

  function selectAmount(btn){
    amountBtns.forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-checked','false');});
    btn.classList.add('selected');
    btn.setAttribute('aria-checked','true');
    const val = btn.dataset.amount;
    if(val === 'other'){
      customWrap.classList.add('show');
      customInput.focus();
      state.amount = customInput.value ? Number(customInput.value) : null;
    } else {
      customWrap.classList.remove('show');
      state.amount = Number(val);
    }
    amountGrid.classList.remove('field-error');
    amountErrorMsg.classList.remove('show');
    updateCta();
  }

  amountBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>selectAmount(btn));
    btn.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); selectAmount(btn); }
    });
  });

  customInput.addEventListener('input', ()=>{
    state.amount = customInput.value ? Number(customInput.value) : null;
    amountGrid.classList.remove('field-error');
    amountErrorMsg.classList.remove('show');
    updateCta();
  });

  function selectMethod(btn){
    payBtns.forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-checked','false');});
    btn.classList.add('selected');
    btn.setAttribute('aria-checked','true');
    state.method = btn.dataset.method;
    payGrid.classList.remove('field-error');
    payErrorMsg.classList.remove('show');
    updateCta();
  }
  payBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>selectMethod(btn));
    btn.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); selectMethod(btn); }
    });
  });

  function validateEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  emailInput.addEventListener('input', ()=>{
    const v = emailInput.value.trim();
    if(v.length === 0){
      emailInput.classList.remove('valid','invalid');
      emailWrap.classList.remove('show-error');
      state.emailValid = false;
    } else if(validateEmail(v)){
      emailInput.classList.add('valid');
      emailInput.classList.remove('invalid');
      emailWrap.classList.remove('show-error');
      state.emailValid = true;
    } else {
      emailInput.classList.remove('valid');
      state.emailValid = false;
    }
    updateCta();
  });
  emailInput.addEventListener('blur', ()=>{
    const v = emailInput.value.trim();
    if(v.length > 0 && !validateEmail(v)){
      emailInput.classList.add('invalid');
      emailWrap.classList.add('show-error');
    }
  });

  consentBox.addEventListener('change', ()=>{
    state.consent = consentBox.checked;
    consentBlock.classList.remove('field-error');
    consentErrorMsg.classList.remove('show');
    updateCta();
  });

  const ddCollapsed = document.getElementById('ddCollapsed');
  const ddExpanded = document.getElementById('ddExpanded');
  document.getElementById('ddExpandBtn').addEventListener('click', ()=>{
    ddCollapsed.hidden = true;
    ddExpanded.hidden = false;
  });
  document.getElementById('ddCollapseBtn').addEventListener('click', ()=>{
    ddExpanded.hidden = true;
    ddCollapsed.hidden = false;
  });

  function updateCta(){
    // CTA stays visually active at all times; validation happens on submit.
  }

  const amountErrorMsg = document.getElementById('amountErrorMsg');
  const payErrorMsg = document.getElementById('payErrorMsg');
  const consentErrorMsg = document.getElementById('consentErrorMsg');
  const consentBlock = document.querySelector('.consent');

  document.getElementById('paymentForm').addEventListener('submit', function(e){
    e.preventDefault();

    const amountOk = state.amount && state.amount > 0;
    const methodOk = !!state.method;
    const emailVal = emailInput.value.trim();
    const emailOk = validateEmail(emailVal);
    const consentOk = consentBox.checked;

    amountGrid.classList.toggle('field-error', !amountOk);
    amountErrorMsg.classList.toggle('show', !amountOk);

    payGrid.classList.toggle('field-error', !methodOk);
    payErrorMsg.classList.toggle('show', !methodOk);

    if(!emailOk){
      emailInput.classList.add('invalid');
      emailWrap.classList.add('show-error');
    } else {
      emailInput.classList.remove('invalid');
      emailWrap.classList.remove('show-error');
    }

    consentBlock.classList.toggle('field-error', !consentOk);
    consentErrorMsg.classList.toggle('show', !consentOk);

    const firstError = !amountOk ? amountGrid
      : !methodOk ? payGrid
      : !emailOk ? emailWrap
      : !consentOk ? consentBlock
      : null;

    if(firstError){
      firstError.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }

    cta.classList.add('loading');
    setTimeout(()=>{
      cta.classList.remove('loading');
      cta.classList.add('success');
    }, 1100);
  });
})();
