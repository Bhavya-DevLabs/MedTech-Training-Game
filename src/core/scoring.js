// Scoring engine — granular per-option scoring.
// +5 per correct option, -1 per incorrect option.

export const Scoring = {
  // Returns { correct: boolean, points: number, partial?: boolean }
  checkAnswer(question, userAnswer) {
    if (question.type === 'single-select') {
      const isCorrect = userAnswer === question.correctAnswers[0];
      return {
        correct: isCorrect,
        points: isCorrect ? 5 : -1
      };
    }

    if (question.type === 'multi-select') {
      const correctAnswers = [...question.correctAnswers].sort((a, b) => a - b);
      const userAnswers = Array.isArray(userAnswer) ? [...userAnswer].sort((a, b) => a - b) : [];

      let points = 0;
      let correctCount = 0;
      let incorrectCount = 0;

      userAnswers.forEach(answer => {
        if (correctAnswers.includes(answer)) {
          points += 5;
          correctCount++;
        } else {
          points -= 1;
          incorrectCount++;
        }
      });

      const allCorrect = correctAnswers.every(ans => userAnswers.includes(ans));
      const noIncorrect = incorrectCount === 0;
      const isFullyCorrect = allCorrect && noIncorrect;

      return {
        correct: isFullyCorrect,
        points: points,
        partial: correctCount > 0 && !isFullyCorrect
      };
    }

    if (question.type === 'drag-drop-blank' || question.type === 'drag-drop-blanks') {
      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      const correctAnswers = question.correctAnswers;

      let points = 0;
      let correctCount = 0;

      userAnswers.forEach((answer, index) => {
        if (answer === correctAnswers[index]) {
          points += 5;
          correctCount++;
        } else {
          points -= 1;
        }
      });

      const allCorrect = correctCount === correctAnswers.length;

      return {
        correct: allCorrect,
        points: points
      };
    }

    if (question.type === 'drag-drop-order') {
      const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctOrder);
      return {
        correct: isCorrect,
        points: isCorrect ? 5 : -1
      };
    }

    return { correct: false, points: 0 };
  },

  calculateMaxScore(questions) {
    return questions.reduce((total, question) => {
      if (question.type === 'multi-select') {
        return total + (question.correctAnswers.length * 5);
      } else if (question.type === 'drag-drop-blanks') {
        return total + (question.correctAnswers.length * 5);
      } else {
        return total + 5;
      }
    }, 0);
  }
};
