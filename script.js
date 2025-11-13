// SCRIPT PARA LIDAR COM OS BOTÕES DO QUIZ E EXIBIR ALERTAS

const answerButtons = document.querySelectorAll(".answer-button");

// Percorre cada botão de resposta encontrado
answerButtons.forEach((button) => {
  // Adiciona um evento de clique a cada botão
  button.addEventListener("click", () => {
    // Obtém a mensagem armazenada no atributo data-message do botão
    const message = button.getAttribute("data-message");

    // Exibe a mensagem correspondente em uma janela de alerta
    alert(message);
  });
});

// SCRIPT PARA MOSTRAR OU ESCONDER O CONTEÚDO DO QUIZ
const toggleButtons = document.querySelectorAll(".toggle-button");

// Para cada botão, adiciona um evento que controla a visibilidade do conteúdo
toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Localiza a seção mais próxima que contém o botão
    const quizSection = button.closest("section");

    // Dentro da seção, encontra todos os elementos com a classe "hidden-content"
    const moreContent = quizSection.querySelectorAll(".question.hidden-content");

    // Verifica se o conteúdo está visível, com base no atributo personalizado
    let isContentVisible = button.getAttribute("data-visible") === "true";

    // Inverte o estado de visibilidade (mostra se estava oculto, e vice-versa)
    isContentVisible = !isContentVisible;

    // Ajusta a exibição dos elementos de acordo com o estado atual
    moreContent.forEach((item) => {
      item.style.display = isContentVisible ? "flex" : "none";
    });

    // Atualiza o texto do botão para indicar a nova ação disponível
    button.textContent = isContentVisible ? "Mostrar Menos" : "Mostrar Mais";

    // Atualiza o atributo data-visible para refletir o novo estado
    button.setAttribute("data-visible", isContentVisible);
  });
});

// SCRIPT PARA ATIVAR E GERENCIAR O MODO ESCURO (DARK MODE)

document.addEventListener("DOMContentLoaded", () => {
  // Obtém o botão responsável pela troca de tema
  const themeToggle = document.getElementById("theme-toggle");

  // Caso o botão não exista, o script termina aqui
  if (!themeToggle) return;

  // Função que aplica o tema selecionado (claro ou escuro)
  const applyTheme = (theme) => {
    if (theme === "dark") {
      // Adiciona a classe "dark-mode" ao corpo da página
      document.body.classList.add("dark-mode");

      // Troca o ícone para o símbolo de sol (modo escuro ativo)
      themeToggle.textContent = "☀️";
    } else {
      // Remove o modo escuro e volta ao tema claro
      document.body.classList.remove("dark-mode");

      // Troca o ícone para a lua (modo claro ativo)
      themeToggle.textContent = "🌙";
    }
  };

  // Carrega o tema salvo no armazenamento local ou usa a preferência do sistema
  const saved = localStorage.getItem("theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  // Aplica o tema escolhido
  applyTheme(saved);

  // Adiciona o evento de clique que alterna o modo escuro/claro
  themeToggle.addEventListener("click", () => {
    // Alterna a classe "dark-mode" e verifica o estado atual
    const isDark = document.body.classList.toggle("dark-mode");

    // Armazena o tema selecionado no localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Atualiza o ícone conforme o modo atual
    themeToggle.textContent = isDark ? "☀️" : "🌙 ";
  });
});

// SCRIPT ALTERNATIVO PARA O BOTÃO DE MODO ESCURO (OUTRO ELEMENTO)
const toggleButton = document.getElementById("darkModeToggle");

if (toggleButton) {
  // Alterna a classe "dark-mode" ao clicar no botão
  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Armazena o estado do modo escuro no localStorage
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  });

  // Se o modo escuro estiver ativo no armazenamento local, aplica-o ao carregar
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
}

// SCRIPT PARA LEITURA DE TEXTO EM VOZ ALTA (TEXT-TO-SPEECH)
let utterance;
let sentences = [];
let currentIndex = 0;

// Botões de controle da leitura
const speakButton = document.getElementById("speak-page");
const stopButton = document.getElementById("stop-speak");
const pauseButton = document.getElementById("pause-speak");
const resumeButton = document.getElementById("resume-speak");
const nextButton = document.getElementById("next-speak");
const prevButton = document.getElementById("prev-speak");

// Função que atualiza a lista de frases com base no texto da página
function updateSentences() {
  sentences = document.body.innerText.split(/(?<=[.!?])\s+/);
}

// Atualiza a lista de frases quando o conteúdo do quiz é expandido ou recolhido
document.querySelectorAll(".toggle-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Aguarda um pequeno intervalo para que o conteúdo mude antes de atualizar
    setTimeout(updateSentences, 300);
  });
});

// Função que faz o navegador "falar" uma frase específica
function speakSentence(index) {
  // Verifica se o índice é válido
  if (index < 0 || index >= sentences.length) return;

  // Atualiza o índice atual
  currentIndex = index;

  // Interrompe qualquer fala em andamento
  if (utterance) speechSynthesis.cancel();

  // Cria uma nova instância de fala para a frase atual
  utterance = new SpeechSynthesisUtterance(sentences[currentIndex]);
  utterance.lang = "pt-BR";

  // Quando a fala termina, avança automaticamente para a próxima frase
  utterance.onend = () => {
    if (currentIndex < sentences.length - 1) {
      currentIndex++;
      speakSentence(currentIndex);
    }
  };

  // Inicia a leitura em voz alta
  speechSynthesis.speak(utterance);
}

// Evento para iniciar a leitura da página completa
if (speakButton) {
  speakButton.addEventListener("click", () => {
    sentences = document.body.innerText.split(/(?<=[.!?])\s+/);
    currentIndex = 0;
    speakSentence(currentIndex);
  });
}

// Evento para parar imediatamente a leitura
if (stopButton) {
  stopButton.addEventListener("click", () => speechSynthesis.cancel());
}

// Controla a pausa e retomada da fala
let pausedIndex = null;

// Evento que pausa a leitura no ponto atual
pauseButton.addEventListener("click", () => {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    pausedIndex = currentIndex;
    speechSynthesis.pause();
  }
});

// Evento que retoma a leitura de onde parou
resumeButton.addEventListener("click", () => {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
  } else if (pausedIndex !== null) {
    // Caso a fala tenha sido cancelada, reinicia a partir da posição anterior
    speakSentence(pausedIndex);
    pausedIndex = null;
  }
});

// Avança manualmente para a próxima frase
if (nextButton) {
  nextButton.addEventListener("click", () => {
    if (currentIndex < sentences.length - 1) {
      currentIndex++;
      speechSynthesis.cancel();

      // Aguarda um pequeno tempo antes de continuar a leitura
      setTimeout(() => speakSentence(currentIndex), 100);
    }
  });
}

// Retorna à frase anterior
if (prevButton) {
  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      speechSynthesis.cancel();
      setTimeout(() => speakSentence(currentIndex), 100);
    }
  });
}

// SCRIPT PARA AJUSTAR O TAMANHO DA FONTE NA PÁGINA

document.addEventListener("DOMContentLoaded", () => {
  // Define o elemento raiz (html) como base para alteração do tamanho de fonte
  const root = document.documentElement;

  // Captura os botões de aumentar, diminuir e resetar fonte
  const btnPlus = document.getElementById("increase-font");
  const btnMinus = document.getElementById("decrease-font");
  const btnReset = document.getElementById("reset-font");

  // Define valores padrão e limites
  const DEFAULT_REM = 1.05;
  const STEP = 0.1;
  const MIN = 0.9;
  const MAX = 2.0;

  // Verifica se há um tamanho de fonte salvo anteriormente
  const saved = localStorage.getItem("fontSizeRem");

  if (saved) {
    // Aplica o tamanho salvo
    root.style.setProperty("--font-size", `${saved}rem`);
  } else {
    // Caso o usuário acesse uma página diretamente, garante que exista o valor inicial
    if (!getComputedStyle(root).getPropertyValue("--font-size").trim()) {
      root.style.setProperty("--font-size", `${DEFAULT_REM}rem`);
    }
  }

  // Função auxiliar para obter o valor atual da fonte.
  const getCurrentRem = () => {
    const raw = getComputedStyle(root).getPropertyValue("--font-size").trim();
    return parseFloat(raw || DEFAULT_REM);
  };

  // Função que aplica o novo valor da fonte, respeitando os limites.
  const applyRem = (rem) => {
    const clamped = Math.max(MIN, Math.min(rem, MAX));
    root.style.setProperty("--font-size", `${clamped}rem`);
    localStorage.setItem("fontSizeRem", String(clamped));
  };

  // Evento de clique para aumentar a fonte.
  if (btnPlus) {
    btnPlus.addEventListener("click", () => {
      const next = getCurrentRem() + STEP;
      applyRem(Number(next.toFixed(2)));
    });
  }

  // Evento de clique para diminuir a fonte.
  if (btnMinus) {
    btnMinus.addEventListener("click", () => {
      const next = getCurrentRem() - STEP;
      applyRem(Number(next.toFixed(2)));
    });
  }

  // Evento de clique para restaurar o tamanho padrão.
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      applyRem(DEFAULT_REM);
    });
  }
});
