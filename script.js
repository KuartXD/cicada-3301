
/* ==========================================
   CICADA 3301 — RECRUITMENT SYSTEM
   Group Mode | 5 Challenges
========================================== */

(function () {
  "use strict";

  // ========================================
  // CONFIGURATION
  // ========================================

  const STORAGE_KEY = "cicada3301_group_progress_v1";

  /*
    ENIGMAS PROVISÓRIOS.

    Substituiremos os textos e respostas
    quando desenvolvermos os enigmas reais.
  */

  const puzzles = [
    {
      title: "The beginning.",
      text: "Your first test awaits.\nObserve carefully.",
      answers: ["CHAVE"]
    },
    {
      title: "A hidden message.",
      text: "Every message has a meaning.\nFind the hidden word.",
      answers: ["LIVRO"]
    },
    {
      title: "The pattern.",
      text: "Patterns are never accidental.\nDiscover the answer.",
      answers: ["NUMERO", "NÚMERO"]
    },
    {
      title: "The connection.",
      text: "The previous answers may hold\nmore meaning than you think.",
      answers: ["CODIGO", "CÓDIGO"]
    },
    {
      title: "The final test.",
      text: "You have come this far.\nWhat is the final answer?",
      answers: ["VERDADE"]
    }
  ];

  // ========================================
  // ELEMENTS
  // ========================================

  const elements = {
    stage: document.getElementById("stage"),
    percentage: document.getElementById("percentage"),
    progress: document.getElementById("progress-fill"),

    title: document.getElementById("question-title"),
    question: document.getElementById("question-text"),

    form: document.getElementById("answer-form"),
    input: document.getElementById("answer"),
    feedback: document.getElementById("feedback"),

    game: document.getElementById("game"),
    completed: document.getElementById("completed")
  };

  // ========================================
  // PROGRESS
  // ========================================

  function loadProgress() {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY));

      if (
        Number.isInteger(saved) &&
        saved >= 0 &&
        saved <= puzzles.length
      ) {
        return saved;
      }
    } catch (error) {
      console.warn("Progress storage unavailable.");
    }

    return 0;
  }

  let currentStage = loadProgress();

  function saveProgress() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        String(currentStage)
      );
    } catch (error) {
      console.warn("Progress could not be saved.");
    }
  }

  // ========================================
  // ANSWER NORMALIZATION
  // ========================================

  function normalizeAnswer(value) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function checkAnswer(value, acceptedAnswers) {
    const submitted = normalizeAnswer(value);

    return acceptedAnswers.some(answer => {
      return normalizeAnswer(answer) === submitted;
    });
  }

  // ========================================
  // FEEDBACK
  // ========================================

  function showFeedback(message, type) {
    elements.feedback.textContent = message;
    elements.feedback.className = type || "";
  }

  // ========================================
  // DISPLAY CHALLENGE
  // ========================================

  function renderChallenge() {
    const total = puzzles.length;

    const percentage = Math.round(
      (currentStage / total) * 100
    );

    elements.percentage.textContent =
      percentage + "% COMPLETE";

    elements.progress.style.width =
      percentage + "%";

    // ALL CHALLENGES COMPLETED

    if (currentStage >= total) {
      elements.stage.textContent =
        "RECRUITMENT COMPLETE";

      elements.game.hidden = true;
      elements.completed.hidden = false;

      return;
    }

    // CURRENT CHALLENGE

    const puzzle = puzzles[currentStage];

    elements.stage.textContent =
      "CHALLENGE " +
      String(currentStage + 1).padStart(2, "0") +
      " / " +
      String(total).padStart(2, "0");

    elements.title.textContent = puzzle.title;
    elements.question.textContent = puzzle.text;

    elements.game.hidden = false;
    elements.completed.hidden = true;

    elements.input.value = "";

    showFeedback("", "");

    elements.input.focus();
  }

  // ========================================
  // ANSWER SUBMISSION
  // ========================================

  elements.form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (currentStage >= puzzles.length) {
      return;
    }

    const submittedAnswer = elements.input.value;

    if (!submittedAnswer.trim()) {
      showFeedback(
        "PLEASE ENTER AN ANSWER.",
        ""
      );

      return;
    }

    const currentPuzzle = puzzles[currentStage];

    // INCORRECT ANSWER

    if (!checkAnswer(
      submittedAnswer,
      currentPuzzle.answers
    )) {
      showFeedback(
        "INCORRECT. THINK AGAIN.",
        ""
      );

      elements.input.select();

      return;
    }

    // CORRECT ANSWER

    elements.form.querySelector("button").disabled = true;

    showFeedback(
      "ACCESS GRANTED. NEXT CHALLENGE UNLOCKED.",
      "success"
    );

    currentStage++;

    saveProgress();

    // LOAD NEXT CHALLENGE

    setTimeout(function () {
      elements.form.querySelector("button").disabled = false;

      renderChallenge();

    }, 1000);
  });

  // ========================================
  // INITIALIZATION
  // ========================================

  if (
    !elements.stage ||
    !elements.input ||
    !elements.form ||
    !elements.title
  ) {
    console.error(
      "CICADA SYSTEM ERROR: Required elements not found."
    );

    return;
  }

  renderChallenge();

})();
