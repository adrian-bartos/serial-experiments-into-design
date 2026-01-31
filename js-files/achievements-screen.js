// Achievements Screen Interactivity

document.addEventListener('DOMContentLoaded', () => {
  // Achievement data for tooltips
  const achievementData = [
    { name: 'First Harvest', desc: 'Complete your first game', unlocked: true },
    { name: 'Rising Star', desc: 'Win 10 games', unlocked: true },
    { name: 'Golden Fields', desc: 'Reach Gold rank', unlocked: true },
    { name: 'Dedicated Farmer', desc: 'Play for 50 hours', unlocked: true },
    { name: 'Victory Streak', desc: 'Win 5 games in a row', unlocked: true },
    { name: 'Community Hero', desc: 'Help 10 players', unlocked: true },
    { name: 'Master Grower', desc: 'Reach level 15', unlocked: true },
    { name: 'Legend', desc: 'Unlock all achievements', unlocked: false }
  ];

  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'achievement-tooltip';
  tooltip.innerHTML = '<strong></strong><p></p>';
  document.body.appendChild(tooltip);

  // Add tooltip styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .achievement-tooltip {
      position: fixed;
      background: rgba(26, 15, 45, 0.95);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(74, 222, 128, 0.3);
      border-radius: 8px;
      padding: 10px 14px;
      pointer-events: none;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      z-index: 1000;
      max-width: 200px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
    .achievement-tooltip.show {
      opacity: 1;
      transform: translateY(0);
    }
    .achievement-tooltip strong {
      color: #4ADE80;
      font-size: 14px;
      display: block;
      margin-bottom: 4px;
    }
    .achievement-tooltip p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 12px;
      margin: 0;
    }
    .achievement-tooltip.locked strong {
      color: #9ca3af;
    }

    .achievements img {
      position: relative;
    }
    .achievements img.clicked {
      animation: achievement-click 0.4s ease;
    }
    @keyframes achievement-click {
      0% { transform: scale(1); }
      25% { transform: scale(0.9) rotate(-5deg); }
      50% { transform: scale(1.15) rotate(3deg); }
      75% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .fill {
      animation: fill-bar 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
    }
    @keyframes fill-bar {
      from { width: 0%; }
      to { width: 70%; }
    }

    .stats div {
      animation: stat-fade-in 0.5s ease both;
    }
    .stats div:nth-child(1) { animation-delay: 0.1s; }
    .stats div:nth-child(2) { animation-delay: 0.2s; }
    .stats div:nth-child(3) { animation-delay: 0.3s; }
    .stats div:nth-child(4) { animation-delay: 0.4s; }
    @keyframes stat-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .cta-button {
      position: relative;
      overflow: hidden;
    }
    .cta-button::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    .cta-button:hover::after {
      transform: translateX(100%);
    }

    .profile-card {
      animation: card-entrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    @keyframes card-entrance {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .achievements img.animate {
      animation: achievement-pop 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    @keyframes achievement-pop {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // Achievement hover and click handlers
  const achievements = document.querySelectorAll('.achievements img');
  achievements.forEach((img, index) => {
    const data = achievementData[index] || { name: 'Achievement', desc: 'Unknown', unlocked: true };

    // Hover - show tooltip
    img.addEventListener('mouseenter', (e) => {
      tooltip.querySelector('strong').textContent = data.name;
      tooltip.querySelector('p').textContent = data.unlocked ? data.desc : '🔒 Locked';
      tooltip.classList.toggle('locked', !data.unlocked);
      tooltip.classList.add('show');
    });

    img.addEventListener('mousemove', (e) => {
      const x = e.clientX + 15;
      const y = e.clientY + 15;
      tooltip.style.left = `${Math.min(x, window.innerWidth - 220)}px`;
      tooltip.style.top = `${Math.min(y, window.innerHeight - 80)}px`;
    });

    img.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });

    // Click effect
    img.addEventListener('click', () => {
      img.classList.remove('clicked');
      void img.offsetWidth; // Force reflow
      img.classList.add('clicked');
    });

    // Make keyboard accessible
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', data.name);

    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        img.click();
      }
    });
  });

  // CTA button click feedback
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      ctaButton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        ctaButton.style.transform = '';
      }, 150);
    });
  }

  // Animate stats numbers on scroll into view
  const animateValue = (element, start, end, duration) => {
    const range = end - start;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const current = Math.floor(start + range * easeProgress);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = end;
      }
    };

    requestAnimationFrame(update);
  };

  // Number animation for stats (optional - runs on load)
  setTimeout(() => {
    const statValues = [
      { selector: '.stats div:nth-child(1)', value: 85 },
      { selector: '.stats div:nth-child(2)', value: 128 },
    ];
    // Stats text content is complex, so we skip number animation
  }, 500);
});
