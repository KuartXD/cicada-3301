
/* ==================================
   CICADA 3301
   RECRUITMENT SYSTEM
================================== */

(function () {

  "use strict";

  const STORAGE_KEY = "cicada3301_progress_v2";

  // ==================================
  // CHALLENGES
  // ==================================

  const puzzles = [

    {
      title: "The first observation.",
      text:
`Look beyond the sentence.
Observe what begins each line.
Only the first matters.
Keep what you find.`,

      answers: ["LOOK"]
    },

    {
      title: "The Caesar.",
      text:
`A message was intercepted.

WKH WUXWK LV KLGGHQ

The Roman emperor left a clue.
Shift the letters backwards.

What is the hidden word?`,

      answers: ["TRUTH"]
    },

    {
      title: "The pattern.",
      text:
`Numbers follow rules.

2 — 3 — 5 — 7 — 11 — ?

There is a pattern.
Find the next number.`,

      answers: ["13", "THIRTEEN"]
    },

    {
      title: "The reflection.",
      text:
`Sometimes the answer is
not where you expect it.

RORRIM

Read what you see
from the opposite direction.`,

      answers: ["MIRROR"]
    },

    {
      title: "The final question.",
      text:
`You have observed.
You have deciphered.
You have discovered the pattern.

One number has accompanied
this entire investigation.

What is it?`,

      answers: ["3301"]
    }

  ];

  // ==================================
  // ELEMENTS
  // ==================================

  const welcome = document.getElementById("welcome");
  const game = document.getElementById("game");
  const completed = document.getElementById("completed");

  const beginButton = document.getElementById("begin-button");

  const stage = document.getElementById("stage");
  const percentage = document.getElementById("percentage");
  const progressFill = document.getElementById("progress-fill");

  const questionTitle = document.getElementById("question-title");
  const questionText = document.getElementById("question-text");

  const form = document.getElementById("answer-form");
  const input = document.getElementById("answer");
  const feedback = document.getElementById("feedback");

  // ==================================
  // STATE
  // ==================================

  let currentStage = loadProgress();

  let started = false;

  // ==================================
  // STORAGE
  // ==================================

  function loadProgress() {

    try {

      const saved = Number(
        localStorage.getItem(STORAGE_KEY)
      );

      if (
        Number.isInteger(saved) &&
        saved >= 0 &&
        saved <= puzzles.length
      ) {
        return saved;
      }

    } catch (error) {

      console.warn("Storage unavailable.");

    }

    return 0;

  }

  function saveProgress() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        String(currentStage)
      );

    } catch (error) {

      console.warn("Could not save progress.");

    }

  }

  // ==================================
  // ANSWER NORMALIZATION
  // ==================================

  function normalize(value) {

    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .trim()
      .replace(/\s+/g, " ");

  }

  function validateAnswer(value, accepted) {

    const submitted = normalize(value);

    return accepted.some(answer =>
      normalize(answer) === submitted
    );

  }

  // ==================================
  // START
  // ==================================

  beginButton.addEventListener("click", function () {

    started = true;

    welcome.hidden = true;

    if (currentStage >= puzzles.length) {

      completed.hidden = false;

    } else {

      game.hidden = false;
      renderChallenge();

    }

  });

  // ==================================
  // RENDER CHALLENGE
  // ==================================

  function renderChallenge() {

    if (currentStage >= puzzles.length) {

      game.hidden = true;
      completed.hidden = false;

      return;

    }

    const puzzle = puzzles[currentStage];

    const total = puzzles.length;

    const progress = Math.round(
      (currentStage / total) * 100
    );

    stage.textContent =
      "CHALLENGE " +
      String(currentStage + 1).padStart(2, "0") +
      " / " +
      String(total).padStart(2, "0");

    percentage.textContent =
      progress + "% COMPLETE";

    progressFill.style.width =
      progress + "%";

    questionTitle.textContent = puzzle.title;

    questionText.textContent = puzzle.text;

    input.value = "";

    feedback.textContent = "";
    feedback.className = "";

    input.focus();

  }

  // ==================================
  // SUBMIT ANSWER
  // ==================================

  form.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!started || currentStage >= puzzles.length) {
      return;
    }

    const puzzle = puzzles[currentStage];

    const answer = input.value;

    if (!answer.trim()) {

      feedback.textContent =
        "PLEASE ENTER AN ANSWER.";

      return;

    }

    // INCORRECT

    if (!validateAnswer(answer, puzzle.answers)) {

      feedback.textContent =
        "INCORRECT. THINK AGAIN.";

      feedback.className = "";

      input.select();

      return;

    }

    // CORRECT

    const submitButton = form.querySelector("button");

    submitButton.disabled = true;

    feedback.textContent =
      "ACCESS GRANTED. NEXT CHALLENGE UNLOCKED.";

    feedback.className = "success";

    currentStage++;

    saveProgress();

    setTimeout(function () {

      submitButton.disabled = false;

      renderChallenge();

    }, 1200);

  });

})();
