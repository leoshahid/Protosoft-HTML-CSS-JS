function openModal() {
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("nextScreen").classList.add("hidden");
}

function nextScreen() {
  document.getElementById("nextScreen").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu functionality
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("closeMenu");

  if (hamburger && mobileMenu && closeBtn) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.add("show");
    });

    closeBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("show");
    });

    // Close mobile menu when clicking a navigation link
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("show");
      });
    });
  }
});
