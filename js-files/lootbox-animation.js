// ---------- ASSETS & DATA ----------
const rewards = [
  { img: 'assets/lootbox_0_0.png', name: 'Bronze Cog',    rarity: 'common' },
  { img: 'assets/lootbox_1_0.png', name: 'Silver Gear',    rarity: 'common' },
  { img: 'assets/lootbox_2_0.png', name: 'Azure Crystal',  rarity: 'rare' },
  { img: 'assets/lootbox_3_0.png', name: 'Emerald Core',   rarity: 'rare' },
  { img: 'assets/lootbox_4_0.png', name: 'Amethyst Prism', rarity: 'epic' },
  { img: 'assets/lootbox_5_0.png', name: 'Ruby Matrix',    rarity: 'epic' },
  { img: 'assets/lootbox_6_0.png', name: 'Solar Relic',    rarity: 'legendary' },
  { img: 'assets/lootbox_7_0.png', name: 'Void Relic',     rarity: 'legendary' }
];

const tickAudio = new Audio('assets/tick.mp3');
const winAudio  = new Audio('assets/win.mp3');
tickAudio.volume = 0.1;
winAudio.volume  = 0.8;

// ---------- BUILD REWARD CARDS ----------
const track = document.getElementById('rewardsTrack');
rewards.forEach((r, i) => {
  const card = document.createElement('div');
  card.className = 'reward';
  card.dataset.index = i;
  card.innerHTML = `<img src="${r.img}" alt="${r.name}">`;
  track.appendChild(card);
});

const joinBtn       = document.getElementById('joinBtn');
const overlay       = document.getElementById('overlay');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalImg      = document.getElementById('modalImg');
const modalTitle    = document.getElementById('modalTitle');
const modalBadge    = document.getElementById('modalBadge');
const modalClose    = document.getElementById('modalClose');

modalClose.addEventListener('click', () => {
  modalBackdrop.classList.remove('show');
  modalBackdrop.setAttribute('aria-hidden', 'true');
});

joinBtn.addEventListener('click', () => {
  if (overlay.classList.contains('show')) return;

  const cards = [...document.querySelectorAll('.reward')];
  const targetIndex = Math.floor(Math.random() * cards.length);

  const totalCycles = 3;
  const baseDelay = 60;
  const slowdownSteps = Math.floor(cards.length * 1.5);
  const totalSteps = totalCycles * cards.length + slowdownSteps + targetIndex;

  let currentStep = 0;
  let currentDelay = baseDelay;

  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  joinBtn.disabled = true;

  // start ticking sound (clone for quick retrigger)
  tickAudio.cloneNode().play();

  const step = () => {
    cards.forEach(c => { c.classList.add('blur'); c.classList.remove('active'); });
    const idx = currentStep % cards.length;
    const currentCard = cards[idx];
    currentCard.classList.remove('blur');
    currentCard.classList.add('active');

    currentStep++;

    if (currentStep < totalSteps) {
      if (currentStep > totalSteps - slowdownSteps) currentDelay += 25;
      setTimeout(step, currentDelay);
    } else {
      finish(idx);
    }
  };

  const finish = (idx) => {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    joinBtn.disabled = false;

    winAudio.play();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#58a6ff', '#2ea043', '#f85149', '#e3b341']
    });

    showModal(idx);
  };

  step();
});

function showModal(idx) {
  const r = rewards[idx];
  modalImg.src = r.img;
  modalTitle.textContent = r.name;
  modalBadge.textContent = r.rarity.toUpperCase();
  modalBadge.className = `badge ${r.rarity}`;
  modalBackdrop.classList.add('show');
  modalBackdrop.setAttribute('aria-hidden', 'false');
}
