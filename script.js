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
// botão de troca de tema (robusto, com localStorage)
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return; // se não existir, sai silenciosamente

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.textContent = "☀️";
    } else {
      document.body.classList.remove("dark-mode");
      themeToggle.textContent = "🌙";
    }
  };

  // pega tema salvo ou usa preferência do sistema como fallback
  const saved = localStorage.getItem("theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(saved);

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙 ";
  });
});

const toggleButton = document.getElementById("darkModeToggle");

if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  });

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
}

// =======================
// Leitor de tela básico com controles
// =======================
let utterance;
let sentences = [];
let currentIndex = 0;

const speakButton = document.getElementById("speak-page");
const stopButton = document.getElementById("stop-speak");
const pauseButton = document.getElementById("pause-speak");
const resumeButton = document.getElementById("resume-speak");
const nextButton = document.getElementById("next-speak");
const prevButton = document.getElementById("prev-speak");

// Atualizar frases sempre que houver mudança na página
function updateSentences() {
  sentences = document.body.innerText.split(/(?<=[.!?])\s+/);
}

// Atualiza ao clicar em "Mostrar mais"
document.querySelectorAll(".toggle-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    setTimeout(updateSentences, 300); // espera abrir o conteúdo
  });
});

function speakSentence(index) {
  if (index < 0 || index >= sentences.length) return;
  currentIndex = index;
  if (utterance) speechSynthesis.cancel();

  utterance = new SpeechSynthesisUtterance(sentences[currentIndex]);
  utterance.lang = "pt-BR";

  utterance.onend = () => {
    if (currentIndex < sentences.length - 1) {
      currentIndex++;
      speakSentence(currentIndex);
    }
  };

  speechSynthesis.speak(utterance);
}

if (speakButton) {
  speakButton.addEventListener("click", () => {
    sentences = document.body.innerText.split(/(?<=[.!?])\s+/);
    currentIndex = 0;
    speakSentence(currentIndex);
  });
}

if (stopButton) {
  stopButton.addEventListener("click", () => speechSynthesis.cancel());
}

let pausedIndex = null;

pauseButton.addEventListener("click", () => {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    pausedIndex = currentIndex;
    speechSynthesis.pause();
  }
});

resumeButton.addEventListener("click", () => {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
  } else if (pausedIndex !== null) {
    speakSentence(pausedIndex); // reinicia dali
    pausedIndex = null;
  }
});


if (nextButton) {
  nextButton.addEventListener("click", () => {
    if (currentIndex < sentences.length - 1) {
      currentIndex++;
      speechSynthesis.cancel();
      setTimeout(() => speakSentence(currentIndex), 100);
    }
  });
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      speechSynthesis.cancel();
      setTimeout(() => speakSentence(currentIndex), 100);
    }
  });
}

// === Botão de acessibilidade aumentar texto ===
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const btnPlus = document.getElementById("font-plus");
  const btnMinus = document.getElementById("font-minus");
  const btnReset = document.getElementById("font-reset");

  const DEFAULT_REM = 1.05;
  const STEP = 0.1;
  const MIN = 0.8;
  const MAX = 2.2;

  const saved = localStorage.getItem("fontSizeRem");
  if (saved) {
    root.style.setProperty("--font-size", `${saved}rem`);
  } else {
    // garante que a var exista para quem abre direto uma página interna
    if (!getComputedStyle(root).getPropertyValue("--font-size").trim()) {
      root.style.setProperty("--font-size", `${DEFAULT_REM}rem`);
    }
  }

  const getCurrentRem = () => {
    const raw = getComputedStyle(root).getPropertyValue("--font-size").trim();
    return parseFloat(raw || DEFAULT_REM);
  };

  const applyRem = (rem) => {
    const clamped = Math.max(MIN, Math.min(rem, MAX));
    root.style.setProperty("--font-size", `${clamped}rem`);
    localStorage.setItem("fontSizeRem", String(clamped));
  };

  if (btnPlus) {
    btnPlus.addEventListener("click", () => {
      const next = getCurrentRem() + STEP;
      applyRem(Number(next.toFixed(2)));
    });
  }

  if (btnMinus) {
    btnMinus.addEventListener("click", () => {
      const next = getCurrentRem() - STEP;
      applyRem(Number(next.toFixed(2)));
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      applyRem(DEFAULT_REM);
    });
  }
});
