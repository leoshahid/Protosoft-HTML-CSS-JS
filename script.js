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

  // Smooth scrolling for all navigation links
  const allNavLinks = document.querySelectorAll(
    ".nav a, .mobile-nav a, .footer-col a[href^='#'], .footer-columns a[href^='#']"
  );

  allNavLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Only process internal links (those starting with #)
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Special case for contact section to ensure it scrolls to the right place
          let offset = 80; // Default offset for most sections

          // Adjust offset based on section and screen size
          if (targetId === "contact") {
            // Smaller offset for contact section on mobile
            offset = window.innerWidth < 768 ? 20 : 50;
          } else if (targetId === "home") {
            offset = 0; // No offset needed for home section
          }

          // Calculate final scroll position
          const scrollPosition =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            offset;

          // Smooth scroll to the element
          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });

          // Update URL without page reload
          history.pushState(null, null, href);
        }
      }
    });
  });

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

      // Reset error states
      nameInput.parentElement.style.borderColor = "transparent";
      emailInput.parentElement.style.borderColor = "transparent";
      nameInput.parentElement.classList.remove("error");
      emailInput.parentElement.classList.remove("error");

      // Check if error message already exists and remove it
      const existingErrorMsg = emailInput.parentElement.nextElementSibling;
      if (
        existingErrorMsg &&
        existingErrorMsg.classList.contains("error-message")
      ) {
        existingErrorMsg.remove();
      }

      // Validation flags
      let hasError = false;

      // Simple validation for name
      if (name === "") {
        nameInput.parentElement.style.borderColor = "#e74c3c";
        nameInput.parentElement.classList.add("error");
        hasError = true;
      }

      // Validation for email
      if (email === "") {
        emailInput.parentElement.style.borderColor = "#e74c3c";
        emailInput.parentElement.classList.add("error");
        hasError = true;
      } else {
        // Email format validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          emailInput.parentElement.style.borderColor = "#e74c3c";
          emailInput.parentElement.classList.add("error");

          // Create and append error message
          const errorMsg = document.createElement("p");
          errorMsg.textContent = "Please enter a valid email address";
          errorMsg.classList.add("error-message");

          // Insert after the email input group
          emailInput.parentElement.insertAdjacentElement("afterend", errorMsg);

          hasError = true;
        }
      }

      if (hasError) {
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
        inputGroups.forEach((group) => {
          group.style.display = "flex";
          group.style.borderColor = "transparent"; // Reset any error borders
          group.classList.remove("error"); // Remove error class
        });

        // Remove any error messages
        const errorMessages = modalForm.querySelectorAll(".error-message");
        errorMessages.forEach((msg) => msg.remove());

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

        // Clear input fields
        const inputs = modalForm.querySelectorAll("input");
        inputs.forEach((input) => (input.value = ""));
      }
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove("show");
      document.body.style.overflow = ""; // Re-enable scrolling

      // Reset form validation states if form exists
      if (modalForm) {
        const inputGroups = modalForm.querySelectorAll(".modal-input-group");
        inputGroups.forEach((group) => {
          group.style.borderColor = "transparent";
          group.classList.remove("error");
        });

        // Remove any error messages
        const errorMessages = modalForm.querySelectorAll(".error-message");
        errorMessages.forEach((msg) => msg.remove());
      }
    }
  }

  // Close on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });
});
