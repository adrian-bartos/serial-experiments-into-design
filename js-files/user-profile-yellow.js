const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");

function onKeydown(e) {
  if (e.key === "Escape") closeModal();
}

function openModal() {
  modal.classList.remove("hidden");
  backdrop.classList.remove("hidden");
  document.body.classList.add("modal-open");
  document.addEventListener("keydown", onKeydown);

  // Focus inside the dialog
  (closeBtn || modal).focus?.();

  // --- NEW: staggered pop-in for thumbnails ---
  const thumbs = modal.querySelectorAll(".fav-thumb");
  thumbs.forEach((el, i) => {
    el.classList.remove("animate-in"); // reset if re-opened
    // force reflow so the animation can replay
    void el.offsetWidth;
    el.style.animationDelay = `${120 + i * 80}ms`;
    el.classList.add("animate-in");
  });
}

function closeModal() {
  modal.classList.add("hidden");
  backdrop.classList.add("hidden");
  document.body.classList.remove("modal-open");
  document.removeEventListener("keydown", onKeydown);
}

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);