let totalSeconds = 0;
let intervalId = null;
const PHRASE = 'estou ciente sobre o desbloqueio';

function setTime(h, m) {
  document.getElementById('inputHours').value = String(h).padStart(2, '0');
  document.getElementById('inputMinutes').value = String(m).padStart(2, '0');
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h + ':' + pad(m) + ':' + pad(sec);
}

function startBlock() {
  const h = parseInt(document.getElementById('inputHours').value) || 0;
  const m = parseInt(document.getElementById('inputMinutes').value) || 0;
  totalSeconds = h * 3600 + m * 60;

  if (totalSeconds <= 0) {
    const minutesInput = document.getElementById('inputMinutes');
    minutesInput.focus();
    minutesInput.style.borderColor = '#ef4444';
    setTimeout(() => {
      minutesInput.style.borderColor = '';
    }, 1000);
    return;
  }

  document.getElementById('timerDisplay').textContent = formatTime(totalSeconds);
  showScreen('lockScreen');
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    totalSeconds--;
    document.getElementById('timerDisplay').textContent = formatTime(totalSeconds);

    if (totalSeconds <= 0) {
      clearInterval(intervalId);
      resetHome();
    }
  }, 1000);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function openModal() {
  document.getElementById('phraseInput').value = '';
  document.getElementById('errorMsg').classList.remove('show');
  document.getElementById('phraseInput').classList.remove('error');
  document.getElementById('modalOverlay').classList.add('open');
  setTimeout(() => document.getElementById('phraseInput').focus(), 350);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function confirmUnlock() {
  const typed = document.getElementById('phraseInput').value.trim().toLowerCase();

  if (typed === PHRASE) {
    document.getElementById('modalOverlay').classList.remove('open');
    clearInterval(intervalId);
    resetHome();
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  } else {
    const input = document.getElementById('phraseInput');
    input.classList.remove('error');
    void input.offsetWidth;
    input.classList.add('error');
    document.getElementById('errorMsg').classList.add('show');
  }
}

function resetHome() {
  document.getElementById('inputHours').value = '00';
  document.getElementById('inputMinutes').value = '00';
  showScreen('homeScreen');
}

document.getElementById('phraseInput').addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    confirmUnlock();
  }
});

document.getElementById('inputHours').addEventListener('input', function () {
  const value = parseInt(this.value);

  if (Number.isNaN(value) || value < 0) {
    this.value = '00';
  }

  if (value > 23) {
    this.value = '23';
  }
});

document.getElementById('inputMinutes').addEventListener('input', function () {
  const value = parseInt(this.value);

  if (Number.isNaN(value) || value < 0) {
    this.value = '00';
  }

  if (value > 59) {
    this.value = '59';
  }
});