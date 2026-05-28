let totalSeconds = 0;
let intervalId = null;
const PHRASE = 'estou ciente sobre o desbloqueio';
let menuOpen = false;
const WEEKDAY_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const profileState = {
  name: 'Vinicius Lara',
  email: 'vinicius@example.com',
  password: '',
  photoUrl: '',
  initials: 'VC'
};

const friends = [
  { name: 'Matheus', recordSeconds: 11100 },
  { name: 'Davi', recordSeconds: 9300 },
  { name: 'Gabriel', recordSeconds: 14400 },
  { name: 'Vinicius', recordSeconds: 10200 }
];

let filteredFriends = [...friends];
const focusHistory = generateFocusHistory();

// ── PAINEL ESQUERDO ─────────────────────────────────────────────────────────

/**
 * Mapeia cada screenId (e estados especiais) para o slide correspondente
 * no painel esquerdo.
 */
const SLIDE_MAP = {
  homeScreen:    'slide-home',
  lockScreen:    'slide-lock',
  lockModal:     'slide-modal',      // modal de desbloqueio aberto
  amigosScreen:  'slide-amigos',
  friendModal:   'slide-friend-modal', // modal de adicionar amigo
  historicoScreen: 'slide-historico',
  sobreScreen:   'slide-sobre',
  perfilScreen:  'slide-perfil',
};

function showSlide(slideId) {
  const slides = document.querySelectorAll('.slide');
  slides.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(slideId);
  if (target) {
    target.classList.add('active');
    // Scroll suave pro topo do painel a cada mudança
    const panel = document.getElementById('leftPanel');
    if (panel) panel.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function syncSlide(screenId) {
  const slideId = SLIDE_MAP[screenId] || 'slide-home';
  showSlide(slideId);
}

// ── UTILITÁRIOS ──────────────────────────────────────────────────────────────

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

function formatRecordTime(seconds) {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return minutes + 'm';
  return hours + 'h ' + pad(minutes) + 'm';
}

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return rest + ' min';
  if (rest === 0) return hours + 'h';
  return hours + 'h ' + rest + 'min';
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFocusHistory() {
  const today = new Date();
  const history = [];
  for (let offset = 4; offset >= 0; offset--) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    history.push({
      label: WEEKDAY_SHORT[date.getDay()] + ' · ' + pad(date.getDate()) + '/' + pad(date.getMonth() + 1),
      minutes: randomInt(45, 260)
    });
  }
  return history;
}

// ── LÓGICA DE BLOQUEIO ───────────────────────────────────────────────────────

function startBlock() {
  const h = parseInt(document.getElementById('inputHours').value) || 0;
  const m = parseInt(document.getElementById('inputMinutes').value) || 0;
  totalSeconds = h * 3600 + m * 60;

  if (totalSeconds <= 0) {
    const minutesInput = document.getElementById('inputMinutes');
    minutesInput.focus();
    minutesInput.style.borderColor = '#ef4444';
    setTimeout(() => { minutesInput.style.borderColor = ''; }, 1000);
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

// ── NAVEGAÇÃO DE TELAS ───────────────────────────────────────────────────────

function showScreen(id) {
  closeMenu();
  closeFriendModal();
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // Sincroniza o painel esquerdo
  syncSlide(id);

  if (id === 'amigosScreen') renderFriends();
  if (id === 'historicoScreen') renderHistory();
  if (id === 'perfilScreen') renderProfileScreen();
}

// ── MENU ─────────────────────────────────────────────────────────────────────

function openMenu() {
  menuOpen = true;
  document.getElementById('menuOverlay').classList.add('open');
  document.querySelectorAll('[data-menu-toggle]').forEach(btn => btn.setAttribute('aria-expanded', 'true'));
  document.getElementById('menuOverlay').setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  menuOpen = false;
  document.getElementById('menuOverlay').classList.remove('open');
  document.querySelectorAll('[data-menu-toggle]').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  document.getElementById('menuOverlay').setAttribute('aria-hidden', 'true');
}

function toggleMenu() {
  if (menuOpen) { closeMenu(); return; }
  openMenu();
}

// ── AVATAR / PERFIL ──────────────────────────────────────────────────────────

function getInitials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

function syncAvatars() {
  document.querySelectorAll('.avatar').forEach(avatar => {
    avatar.textContent = profileState.initials;
    avatar.style.backgroundImage = profileState.photoUrl ? 'url("' + profileState.photoUrl + '")' : '';
    avatar.style.backgroundSize = profileState.photoUrl ? 'cover' : '';
    avatar.style.backgroundPosition = profileState.photoUrl ? 'center' : '';
    avatar.style.backgroundRepeat = profileState.photoUrl ? 'no-repeat' : '';
  });
}

function renderProfileScreen() {
  document.getElementById('profileNameInput').value = profileState.name;
  document.getElementById('profileEmailInput').value = profileState.email;
  document.getElementById('profilePasswordInput').value = profileState.password;
  const photoPreview = document.getElementById('profilePhotoPreview');
  photoPreview.textContent = profileState.initials;
  photoPreview.style.backgroundImage = profileState.photoUrl ? 'url("' + profileState.photoUrl + '")' : '';
  photoPreview.style.backgroundSize = profileState.photoUrl ? 'cover' : '';
  photoPreview.style.backgroundPosition = profileState.photoUrl ? 'center' : '';
  photoPreview.style.backgroundRepeat = profileState.photoUrl ? 'no-repeat' : '';
}

function openProfileScreen() {
  showScreen('perfilScreen');
}

function saveProfile() {
  profileState.name = document.getElementById('profileNameInput').value.trim() || profileState.name;
  profileState.email = document.getElementById('profileEmailInput').value.trim() || profileState.email;
  profileState.password = document.getElementById('profilePasswordInput').value;
  profileState.initials = getInitials(profileState.name) || 'VC';
  renderProfileScreen();
  syncAvatars();
  showToastMessage('Perfil atualizado.');
}

function handleProfilePhotoChange(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    profileState.photoUrl = String(reader.result || '');
    renderProfileScreen();
    syncAvatars();
  };
  reader.readAsDataURL(file);
}

// ── MODAL DE DESBLOQUEIO ─────────────────────────────────────────────────────

function openModal() {
  document.getElementById('phraseInput').value = '';
  document.getElementById('errorMsg').classList.remove('show');
  document.getElementById('phraseInput').classList.remove('error');
  document.getElementById('modalOverlay').classList.add('open');
  // Troca para o slide do modal de desbloqueio
  showSlide('slide-modal');
  setTimeout(() => document.getElementById('phraseInput').focus(), 350);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  // Volta para o slide da tela de lock
  showSlide('slide-lock');
}

function showToastMessage(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function confirmUnlock() {
  const typed = document.getElementById('phraseInput').value.trim().toLowerCase();
  if (typed === PHRASE) {
    document.getElementById('modalOverlay').classList.remove('open');
    clearInterval(intervalId);
    resetHome();
    showToastMessage('✓ Tela desbloqueada!');
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

// ── AMIGOS ───────────────────────────────────────────────────────────────────

function renderFriends() {
  const list = document.getElementById('friendsList');
  if (!list) return;
  if (filteredFriends.length === 0) {
    list.innerHTML = '<p class="friends-empty">Nenhum amigo encontrado.</p>';
    return;
  }
  list.innerHTML = filteredFriends.map(friend =>
    '<article class="friend-card">'
    + '<div class="friend-avatar">' + friend.name.slice(0, 1) + '</div>'
    + '<div class="friend-meta">'
    + '<p class="friend-name">' + friend.name + '</p>'
    + '<p class="friend-record">Recorde: ' + formatRecordTime(friend.recordSeconds) + '</p>'
    + '</div>'
    + '</article>'
  ).join('');
}

function filterFriendsByName() {
  const query = document.getElementById('friendSearch').value.trim().toLowerCase();
  filteredFriends = friends.filter(f => f.name.toLowerCase().includes(query));
  renderFriends();
}

function openFriendModal() {
  const overlay = document.getElementById('friendModalOverlay');
  const input = document.getElementById('friendCodeInput');
  input.value = '';
  input.classList.remove('error');
  document.getElementById('friendCodeError').classList.remove('show');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  // Troca para o slide do modal de amigo
  showSlide('slide-friend-modal');
  setTimeout(() => input.focus(), 150);
}

function closeFriendModal() {
  const overlay = document.getElementById('friendModalOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  // Volta para o slide de amigos se estivermos na tela de amigos
  const amigosActive = document.getElementById('amigosScreen').classList.contains('active');
  if (amigosActive) showSlide('slide-amigos');
}

function confirmAddFriend() {
  const input = document.getElementById('friendCodeInput');
  const error = document.getElementById('friendCodeError');
  const code = input.value.trim();
  if (!code) {
    error.classList.add('show');
    input.classList.add('error');
    return;
  }
  error.classList.remove('show');
  input.classList.remove('error');
  closeFriendModal();
  showToastMessage('Código de amigo enviado para validação.');
}

// ── HISTÓRICO ─────────────────────────────────────────────────────────────────

function renderHistory() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;
  const maxMinutes = Math.max(...focusHistory.map(d => d.minutes));
  historyList.innerHTML = focusHistory.map(day => {
    const width = Math.max(20, Math.round((day.minutes / maxMinutes) * 100));
    return '<article class="history-card">'
      + '<div class="history-line">'
      + '<p class="history-day">' + day.label + '</p>'
      + '<p class="history-time">' + formatMinutes(day.minutes) + '</p>'
      + '</div>'
      + '<div class="history-bar-track">'
      + '<div class="history-bar-fill" style="width:' + width + '%"></div>'
      + '</div>'
      + '</article>';
  }).join('');
}

// ── LISTENERS ─────────────────────────────────────────────────────────────────

document.getElementById('phraseInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') confirmUnlock();
});

document.querySelectorAll('[data-menu-toggle]').forEach(btn => {
  btn.addEventListener('click', toggleMenu);
});

document.querySelectorAll('[data-profile-toggle]').forEach(btn => {
  btn.addEventListener('click', openProfileScreen);
});

document.querySelectorAll('[data-back-home]').forEach(btn => {
  btn.addEventListener('click', () => showScreen('homeScreen'));
});

document.getElementById('menuOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeMenu();
});

document.querySelectorAll('[data-menu-item]').forEach(item => {
  item.addEventListener('click', () => {
    const target = item.getAttribute('data-menu-item');
    if (target === 'inicio')    { showScreen('homeScreen'); return; }
    if (target === 'amigos')    { showScreen('amigosScreen'); return; }
    if (target === 'historico') { showScreen('historicoScreen'); return; }
    if (target === 'sobre')     { showScreen('sobreScreen'); return; }
    closeMenu();
    showToastMessage('Seção disponível em breve.');
  });
});

document.getElementById('friendSearch').addEventListener('input', filterFriendsByName);
document.getElementById('addFriendButton').addEventListener('click', openFriendModal);
document.getElementById('cancelFriendModal').addEventListener('click', closeFriendModal);
document.getElementById('confirmFriendModal').addEventListener('click', confirmAddFriend);

document.getElementById('friendModalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeFriendModal();
});

document.getElementById('friendCodeInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') confirmAddFriend();
});

document.getElementById('changePhotoButton').addEventListener('click', () => {
  document.getElementById('profilePhotoInput').click();
});

document.getElementById('profilePhotoInput').addEventListener('change', handleProfilePhotoChange);
document.getElementById('saveProfileButton').addEventListener('click', saveProfile);

document.getElementById('inputHours').addEventListener('input', function () {
  const value = parseInt(this.value);
  if (Number.isNaN(value) || value < 0) this.value = '00';
  if (value > 23) this.value = '23';
});

document.getElementById('inputMinutes').addEventListener('input', function () {
  const value = parseInt(this.value);
  if (Number.isNaN(value) || value < 0) this.value = '00';
  if (value > 59) this.value = '59';
});

// ── INIT ──────────────────────────────────────────────────────────────────────

renderFriends();
renderHistory();
syncAvatars();
// Garante o slide inicial correto
syncSlide('homeScreen');
