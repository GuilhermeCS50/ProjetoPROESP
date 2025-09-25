// script to handle quiz button clicks and show alerts

const answerButtons = document.querySelectorAll(".answer-button");

answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const message = button.getAttribute("data-message");
    alert(message);
  });
});

// script to toggle visibility of quiz content

const toggleButtons = document.querySelectorAll(".toggle-button");

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const quizSection = button.closest("section");
    const moreContent = quizSection.querySelectorAll(".question.hidden-content");

    let isContentVisible = button.getAttribute("data-visible") === "true";

    isContentVisible = !isContentVisible;

    moreContent.forEach((item) => {
      item.style.display = isContentVisible ? "flex" : "none";
    });

    button.textContent = isContentVisible ? "Mostrar Menos" : "Mostrar Mais";
    button.setAttribute("data-visible", isContentVisible);
  });
});

// =======================
// botão de troca de tema
// =======================
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️ Ativar modo claro";
  } else {
    themeToggle.textContent = "🌙 Ativar modo escuro";
  }
});
