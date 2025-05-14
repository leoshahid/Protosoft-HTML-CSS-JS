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
  const closeMenu = document.getElementById("closeMenu");

  if (hamburger && mobileMenu && closeMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.add("show");
    });

    closeMenu.addEventListener("click", () => {
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

  // Form submission async function
  async function submitData({ name, email }) {
    try {
      // Get IP, timeZone and userAgent
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipResponse.json();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const userAgent = navigator.userAgent;

      const response = await fetch("https://prostosoft.co/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          ip,
          timezone,
          userAgent,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Submission failed");
      }

      console.log("✅ Submitted:", result);
      return result;
    } catch (error) {
      console.error("❌ Submit error:", error);
      throw error;
    }
  }

  // Modal functionality
  const modal = document.getElementById("contactModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalForm = document.querySelector(".modal-form");
  const modalSuccessMessage = document.querySelector(".modal-success-message");
  const modalSubmitBtn = document.querySelector(".modal-submit-btn");

  // Get all buttons that should open the modal
  const modalTriggerBtns = document.querySelectorAll(
    ".btn-gradient, .footer-btn .btn-gradient, .btn-cta"
  );

  // Add click event to all modal trigger buttons
  modalTriggerBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openModal();
    });
  });

  // Close modal when clicking the close button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  // Close modal when clicking outside the modal content
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Handle form submission
  if (modalForm && modalSuccessMessage && modalSubmitBtn) {
    modalSubmitBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      // Get form inputs
      const nameInput = modalForm.querySelector('input[type="text"]');
      const emailInput = modalForm.querySelector('input[type="email"]');
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      // Simple validation
      if (name === "" || email === "") {
        // Show error or handle invalid input
        if (name === "") {
          nameInput.parentElement.style.borderColor = "#e74c3c";
        } else {
          nameInput.parentElement.style.borderColor = "transparent";
        }

        if (email === "") {
          emailInput.parentElement.style.borderColor = "#e74c3c";
        } else {
          emailInput.parentElement.style.borderColor = "transparent";
        }

        return;
      }

      // Show loading state
      modalSubmitBtn.disabled = true;
      modalSubmitBtn.textContent = "Submitting...";

      try {
        // Submit the data
        await submitData({ name, email });

        // If successful, show success message
        nameInput.parentElement.style.display = "none";
        emailInput.parentElement.style.display = "none";
        modalSubmitBtn.style.display = "none";

        // Hide the note text as well
        const modalNote = modalForm.querySelector(".modal-note");
        if (modalNote) {
          modalNote.style.display = "none";
        }

        modalSuccessMessage.classList.add("show");

        // Reset form
        setTimeout(() => {
          nameInput.value = "";
          emailInput.value = "";
          nameInput.parentElement.style.borderColor = "transparent";
          emailInput.parentElement.style.borderColor = "transparent";
          modalSubmitBtn.disabled = false;
          // Restore button HTML with arrow
          modalSubmitBtn.innerHTML =
            'Let\'s Talk <span class="modal-btn-arrow">→</span>';
        }, 300);
      } catch (error) {
        // Handle submission error
        console.error("Form submission failed:", error);

        // Reset button state
        modalSubmitBtn.disabled = false;
        // Restore button HTML with arrow
        modalSubmitBtn.innerHTML =
          'Let\'s Talk <span class="modal-btn-arrow">→</span>';

        // Show error message (optional)
        alert("Something went wrong. Please try again later.");
      }
    });
  }

  // Modal helper functions
  function openModal() {
    if (modal) {
      modal.classList.add("show");
      document.body.style.overflow = "hidden"; // Prevent scrolling

      // Reset form state if it was previously submitted
      if (modalForm && modalSuccessMessage) {
        const inputGroups = modalForm.querySelectorAll(".modal-input-group");
        inputGroups.forEach((group) => (group.style.display = "flex"));
        modalSubmitBtn.style.display = "flex";
        modalSubmitBtn.disabled = false;
        // Restore button HTML with arrow
        modalSubmitBtn.innerHTML =
          'Let\'s Talk <span class="modal-btn-arrow">→</span>';

        // Show the note text again
        const modalNote = modalForm.querySelector(".modal-note");
        if (modalNote) {
          modalNote.style.display = "block";
        }

        modalSuccessMessage.classList.remove("show");
      }
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove("show");
      document.body.style.overflow = ""; // Re-enable scrolling
    }
  }

  // Close on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });
});
