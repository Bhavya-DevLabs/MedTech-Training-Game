// Game page — three-column layout: question tiles | welcome/status | score panel
// Replaces the old journey.js level grid.

import { State } from '../core/state.js';
import { Progression } from '../core/progression.js';
import { QUESTIONS, getTotalQuestions, getMaxScore } from '../data/questions.js';
export const GamePage = {
  render() {

    const state = State.get();
    const game = state.game;
    const totalQuestions = getTotalQuestions();

    // Initialize game if needed
    if (game.questionStatus.length === 0) {
      State.initializeGame(totalQuestions);
    }

    // Build question tiles for left sidebar
    const questionTilesHTML = QUESTIONS.map((q, index) => {
      const status = game.questionStatus[index];
      const canAccess = Progression.canAccessQuestion(index, game);
      const isCurrent = game.currentQuestionIndex === index;

      let tileClass = 'question-tile';
      let statusIcon = '';

      if (!canAccess) {
        tileClass += ' locked';
        statusIcon = '<i class="fa-solid fa-lock"></i>';
      } else if (status && status.answered) {
        if (status.correct) {
          tileClass += ' answered-correct';
          statusIcon = '<i class="fa-solid fa-check"></i>';
        } else {
          tileClass += ' answered-incorrect';
          statusIcon = '<i class="fa-solid fa-xmark"></i>';
        }
      } else {
        tileClass += ' unanswered';
      }

      if (isCurrent) {
        tileClass += ' current';
      }

      const clickHandler = canAccess
        ? `onclick="window.location.hash='#/question?index=${index}'"`
        : '';

      return `
        <div class="${tileClass}" ${clickHandler} data-index="${index}">
          <div class="tile-number">${index + 1}</div>
          <div class="tile-topic">${q.topic}</div>
          <div class="tile-status">${statusIcon}</div>
        </div>
      `;
    }).join('');

    // Score panel
    const progress = Progression.getProgress(game, totalQuestions);
    const scorePanelHTML = `
      <div class="score-panel">
        <div class="score-header">
          <h3>Your Progress</h3>
        </div>

        <div class="score-stats">
          <div class="score-stat total">
            <div class="score-stat-value">${game.totalScore}</div>
            <div class="score-stat-label">Total Score</div>
          </div>

          <div class="score-stat correct">
            <div class="score-stat-value">${game.correctCount}</div>
            <div class="score-stat-label">Correct</div>
          </div>

          <div class="score-stat incorrect">
            <div class="score-stat-value">${game.incorrectCount}</div>
            <div class="score-stat-label">Incorrect</div>
          </div>

          <div class="score-stat completion">
            <div class="score-stat-value">${progress.percentage}%</div>
            <div class="score-stat-label">Complete</div>
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress.percentage}%"></div>
          </div>
          <div class="progress-text">${progress.answeredCount} of ${totalQuestions} answered</div>
        </div>
      </div>
    `;

    // Center welcome / status
    const isComplete = Progression.isGameComplete(game, totalQuestions);
    let centerContent = '';

    if (isComplete) {
      const accuracy = Math.round((game.correctCount / totalQuestions) * 100);
      centerContent = `
        <div class="game-complete">
          <div class="complete-icon"><i class="fa-solid fa-trophy"></i></div>
          <h2>Congratulations!</h2>
          <p>You've completed all ${totalQuestions} questions!</p>

          <div class="final-stats">
            <div class="final-stat">
              <div class="stat-big">${game.totalScore}</div>
              <div class="stat-label">Final Score</div>
            </div>
            <div class="final-stat">
              <div class="stat-big">${game.correctCount}</div>
              <div class="stat-label">Correct Answers</div>
            </div>
            <div class="final-stat">
              <div class="stat-big">${accuracy}%</div>
              <div class="stat-label">Accuracy</div>
            </div>
          </div>

          <div class="complete-actions">
            <button class="btn-secondary" onclick="window.location.hash='#/question?index=0'">
              <i class="fa-solid fa-rotate-left"></i> Review Answers
            </button>
            <button class="btn-primary" onclick="if(confirm('Start a new game? This will reset your progress.')) { localStorage.removeItem('jj_sales_game'); window.location.reload(); }">
              <i class="fa-solid fa-play"></i> Start New Game
            </button>
          </div>
        </div>
      `;
    } else {
      centerContent = `
        <div class="game-welcome">
          <div class="game-welcome-icon"><i class="fa-solid fa-graduation-cap"></i></div>
          <h2>Welcome to Dualto Training</h2>
          <p>Test your knowledge across ${totalQuestions} questions covering:</p>
          <ul class="topic-list">
            <li><i class="fa-solid fa-handshake"></i> Pre-Sales Process (9 questions)</li>
            <li><i class="fa-solid fa-desktop"></i> Polyphonic Preparation (4 questions)</li>
            <li><i class="fa-solid fa-truck"></i> Device Shipment (5 questions)</li>
            <li><i class="fa-solid fa-screwdriver-wrench"></i> Device Installation (4 questions)</li>
          </ul>
          <p><strong>Maximum Score: ${getMaxScore()} points</strong></p>
          ${progress.answeredCount > 0 ? `
            <button class="btn-primary" onclick="window.location.hash='#/question?index=${game.currentQuestionIndex}'">
              <i class="fa-solid fa-play"></i> Continue from Question ${game.currentQuestionIndex + 1}
            </button>
          ` : `
            <button class="btn-primary" onclick="window.location.hash='#/question?index=0'">
              <i class="fa-solid fa-play"></i> Start Quiz
            </button>
          `}
        </div>
      `;
    }

    // Three-column layout
    const content = document.getElementById('content');
    if (!content) return;

    content.innerHTML = `
      <div class="game-header-red">
        <div class="header-left">
          <h1 class="game-title-red" onclick="window.location.hash='#/game'">Dualto Training</h1>
        </div>
        <div class="header-right">
          <div class="team-badge-header">${state.user.team}</div>
          <div class="user-profile" onclick="document.getElementById('user-dropdown').classList.toggle('show')">
            <span class="user-icon"><i class="fa-solid fa-user-circle"></i></span>
            <span class="user-display-name">${state.user.name}</span>
            <span class="dropdown-arrow"><i class="fa-solid fa-chevron-down"></i></span>
            <div class="user-dropdown" id="user-dropdown">
              <div class="dropdown-item" onclick="event.stopPropagation(); if(confirm('Are you sure you want to sign out?')) { localStorage.removeItem('jj_sales_game'); window.location.hash='#/login'; window.location.reload(); }">
                <span class="dropdown-icon"><i class="fa-solid fa-right-from-bracket"></i></span>
                <span>Sign Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="game-layout">
        <aside class="question-sidebar">
          <h3 class="sidebar-title">Questions</h3>
          <div class="question-tiles">
            ${questionTilesHTML}
          </div>
        </aside>

        <main class="game-content">
          ${centerContent}
        </main>

        <aside class="score-sidebar">
          ${scorePanelHTML}
        </aside>
      </div>
    `;

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      const dropdown = document.getElementById('user-dropdown');
      const userProfile = document.querySelector('.user-profile');
      if (dropdown && userProfile && !userProfile.contains(event.target)) {
        dropdown.classList.remove('show');
      }
    });
  }
};
