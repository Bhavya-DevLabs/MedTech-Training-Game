// Central state management - Single Source of Truth
// Schema tracks 22-question linear flow. No levels.

const state = {
  user: {
    name: '',
    team: ''
  },
  game: {
    currentQuestionIndex: 0,
    questionStatus: [],   // [{answered, correct, userAnswer}, ...] — one per question
    correctCount: 0,
    incorrectCount: 0,
    totalScore: 0
  },
  currentPage: 'login'
};

const listeners = [];

function notify() {
  listeners.forEach(fn => fn(state));
}

export const State = {
  get() {
    return JSON.parse(JSON.stringify(state));   // Deep copy — safe for consumers
  },

  set(updates) {
    Object.assign(state, updates);
    notify();
  },

  subscribe(fn) {
    listeners.push(fn);
    return () => {
      const index = listeners.indexOf(fn);
      if (index > -1) listeners.splice(index, 1);
    };
  },

  // Build the questionStatus array for N questions
  initializeGame(totalQuestions) {
    state.game.questionStatus = Array.from({ length: totalQuestions }, () => ({
      answered: false,
      correct: false,
      userAnswer: null
    }));
    state.game.currentQuestionIndex = 0;
    state.game.correctCount = 0;
    state.game.incorrectCount = 0;
    state.game.totalScore = 0;
    notify();
  },

  // Record a player's answer for a single question
  answerQuestion(questionIndex, isCorrect, userAnswer, points) {
    const status = state.game.questionStatus[questionIndex];

    // Only count if not already answered (prevents double-scoring on revisit)
    if (!status.answered) {
      if (isCorrect) {
        state.game.correctCount++;
        state.game.totalScore += points;
      } else {
        state.game.incorrectCount++;
        state.game.totalScore += points;   // points is already negative for incorrect
      }
    }

    status.answered = true;
    status.correct = isCorrect;
    status.userAnswer = userAnswer;

    notify();
  },

  // Navigate to a specific question
  setCurrentQuestion(index) {
    state.game.currentQuestionIndex = index;
    notify();
  }
};
