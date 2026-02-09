// Linear question progression — no skipping, can revisit answered questions.

export const Progression = {
  canAccessQuestion(questionIndex, game) {
    // Can always access the first question
    if (questionIndex === 0) return true;

    // Can access if previous question has been answered
    const prevStatus = game.questionStatus[questionIndex - 1];
    return prevStatus && prevStatus.answered;
  },

  canReplayQuestion(questionIndex, game) {
    const status = game.questionStatus[questionIndex];
    return status && status.answered;
  },

  getNextQuestionIndex(currentIndex, totalQuestions) {
    if (currentIndex < totalQuestions - 1) {
      return currentIndex + 1;
    }
    return null;   // No more questions
  },

  isGameComplete(game, totalQuestions) {
    return game.questionStatus.length === totalQuestions &&
           game.questionStatus.every(s => s.answered);
  },

  getProgress(game, totalQuestions) {
    const answeredCount = game.questionStatus.filter(s => s.answered).length;
    return {
      answeredCount,
      totalCount: totalQuestions,
      percentage: Math.round((answeredCount / totalQuestions) * 100)
    };
  }
};
