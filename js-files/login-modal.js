const form = document.getElementById('loginForm');
const emailEl = form.email;
const passwordEl = form.password;
const toggleBtn = document.getElementById('togglePassword');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const strengthBar = document.getElementById('strengthBar');
const liveRegion = document.getElementById('liveRegion');
const rememberMe = document.getElementById('rememberMe');
const main = document.querySelector('main');

// --- Email persistence ---
const savedEmail = localStorage.getItem('savedEmail');
if (savedEmail) {
  emailEl.value = savedEmail;
  emailEl.dispatchEvent(new Event('input', { bubbles: true }));
  rememberMe.checked = true;
}

const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const validatePassword = v => v.length >= 6;

function updateStrength(v) {
  const len = v.length;
  let pct = 0; let color = 'var(--error)';
  if (len >= 6) { pct = 33; color = '#f59e0b'; }
  if (len >= 10 && /[A-Z]/.test(v) && /\d/.test(v)) { pct = 66; color = '#10b981'; }
  if (len >= 14 && /[^A-Za-z0-9]/.test(v)) { pct = 100; color = 'var(--accent)'; }
  strengthBar.style.width = pct + '%';
  strengthBar.style.background = color;
}

function updateValidity() {
  const emailOk = validateEmail(emailEl.value);
  const passOk = validatePassword(passwordEl.value);
  emailEl.setAttribute('aria-invalid', !emailOk);
  passwordEl.setAttribute('aria-invalid', !passOk);
  document.getElementById('emailError').style.display = emailOk ? 'none' : 'block';
  document.getElementById('passwordError').style.display = passOk ? 'none' : 'block';
  submitBtn.disabled = !(emailOk && passOk);
}

emailEl.addEventListener('input', updateValidity);
passwordEl.addEventListener('input', e => { updateValidity(); updateStrength(e.target.value); });

toggleBtn.addEventListener('click', () => {
  const isPwd = passwordEl.type === 'password';
  passwordEl.type = isPwd ? 'text' : 'password';
  toggleBtn.setAttribute('aria-pressed', isPwd);
  toggleBtn.textContent = isPwd ? '🙈' : '👁️';
});

function setLoading(state) {
  if (state) {
    submitBtn.classList.add('loading');
    submitBtn.insertAdjacentHTML('afterbegin', '<span class="spinner" aria-hidden="true"></span>');
    const labelSpan = submitBtn.querySelector('span:nth-child(2)');
    if (labelSpan) labelSpan.textContent = 'Logging in…';
  } else {
    submitBtn.classList.remove('loading');
    const sp = submitBtn.querySelector('.spinner');
    if (sp) sp.remove();
    const labelSpan = submitBtn.querySelector('span');
    if (labelSpan) labelSpan.textContent = 'Log in';
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  updateValidity();
  if (submitBtn.disabled) {
    const firstInvalid = emailEl.matches('[aria-invalid="true"]') ? emailEl : passwordEl;
    firstInvalid.parentElement.classList.add('shake');
    setTimeout(() => firstInvalid.parentElement.classList.remove('shake'), 500);
    firstInvalid.focus();
    liveRegion.textContent = 'Please correct highlighted fields.';
    return;
  }

  setLoading(true);

  // fake async
  setTimeout(() => {
    setLoading(false);
    successModal.showModal();
    main.inert = true;
    closeModalBtn.focus();
    liveRegion.textContent = 'Login successful';
    if (rememberMe.checked) {
      localStorage.setItem('savedEmail', emailEl.value);
    } else {
      localStorage.removeItem('savedEmail');
    }
    form.reset();
    updateStrength('');
    submitBtn.disabled = true;
  }, 1200);
});

// Modal controls
function closeModal() {
  successModal.close();
  main.inert = false;
  submitBtn.focus();
}
closeModalBtn.addEventListener('click', closeModal);
successModal.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Global Esc to hide revealed password
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && passwordEl.type === 'text') toggleBtn.click();
});

// Social buttons (demo only)
document.getElementById('googleBtn').addEventListener('click', () => alert('Google sign‑in coming soon!'));
document.getElementById('githubBtn').addEventListener('click', () => alert('GitHub sign‑in coming soon!'));
