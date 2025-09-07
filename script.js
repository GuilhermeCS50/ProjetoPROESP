// script to handle quiz button clicks and show alerts

const quizButtons = document.querySelectorAll(".quiz-button");

quizButtons.forEach(button => {
  button.addEventListener("click", () => {
    const message = button.getAttribute("data-message");
    alert(message);
  });
});

// script to toggle visibility of quiz content

const moreContent = document.getElementsByClassName("quiz hidden-content");
const toggleButton = document.getElementById("toggle-button");

let isContentVisible = false;

toggleButton.addEventListener("click", () => {
  isContentVisible = !isContentVisible;

  for (let i = 0; i < moreContent.length; i++) {
    moreContent[i].style.display = isContentVisible ? "flex" : "none";
  }

  toggleButton.textContent = isContentVisible ? "Mostrar Menos" : "Mostrar Mais";
});
