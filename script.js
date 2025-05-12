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
