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
