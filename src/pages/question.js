// Question page — displays a single question inside the persistent 3-column layout.
// Left: question tiles, Center: question card, Right: score panel.
// Includes fixed progress bar and real drag-and-drop for blank/order questions.

import { State } from '../core/state.js';
import { Progression } from '../core/progression.js';
import { Scoring } from '../core/scoring.js';
import { QUESTIONS, getQuestion, getTotalQuestions } from '../data/questions.js';

export const QuestionPage = {
  currentQuestion: null,
  questionIndex: null,
  userAnswer: null,

  render() {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    this.questionIndex = parseInt(params.get('index')) || 0;

    const state = State.get();
    const game = state.game;
    const totalQuestions = getTotalQuestions();

    if (game.questionStatus.length === 0) {
      State.initializeGame(totalQuestions);
    }

    if (!Progression.canAccessQuestion(this.questionIndex, game)) {
      window.location.hash = '#/game';
      return;
    }

    this.currentQuestion = getQuestion(this.questionIndex);
    if (!this.currentQuestion) {
      window.location.hash = '#/game';
      return;
    }

    State.setCurrentQuestion(this.questionIndex);
    this.renderQuestion();
  },

  renderQuestion() {
    const state = State.get();
    const game = state.game;
    const status = game.questionStatus[this.questionIndex];
    const isAnswered = status && status.answered;
    const totalQuestions = getTotalQuestions();

    let questionHTML = '';

    switch (this.currentQuestion.type) {
      case 'single-select':
        questionHTML = this.renderSingleSelect(isAnswered, status);
        break;
      case 'multi-select':
        questionHTML = this.renderMultiSelect(isAnswered, status);
        break;
      case 'drag-drop-blank':
      case 'drag-drop-blanks':
        questionHTML = this.renderDragDropBlanks(isAnswered, status);
        break;
      case 'drag-drop-order':
        questionHTML = this.renderDragDropOrder(isAnswered, status);
        break;
    }

    // ── Build question tiles for left sidebar ──────────────
    const questionTilesHTML = QUESTIONS.map((q, index) => {
      const qStatus = game.questionStatus[index];
      const canAccess = Progression.canAccessQuestion(index, game);
      const isCurrent = index === this.questionIndex;

      let tileClass = 'question-tile';
      let statusIcon = '';

      if (!canAccess) {
        tileClass += ' locked';
        statusIcon = '<i class="fa-solid fa-lock"></i>';
      } else if (qStatus && qStatus.answered) {
        if (qStatus.correct) {
          tileClass += ' answered-correct';
          statusIcon = '<i class="fa-solid fa-check"></i>';
        } else {
          tileClass += ' answered-incorrect';
          statusIcon = '<i class="fa-solid fa-xmark"></i>';
        }
      } else {
        tileClass += ' unanswered';
      }

      if (isCurrent) tileClass += ' current';

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

    // ── Build score panel for right sidebar ────────────────
    const progress = Progression.getProgress(game, totalQuestions);
    const scorePanelHTML = `
      <div class="score-panel">
        <div class="score-header"><h3>Your Progress</h3></div>
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

    // ── Render full layout with progress bar ──────────────
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

      <div class="question-progress-fixed">
        <div class="progress-track">
          <div class="progress-line" style="width: ${((this.questionIndex + 1) / getTotalQuestions()) * 100}%"></div>
        </div>
        <div class="progress-label-top">Question ${this.questionIndex + 1} of ${getTotalQuestions()}</div>
      </div>

      <div class="game-layout">
        <aside class="question-sidebar">
          <h3 class="sidebar-title">Questions</h3>
          <div class="question-tiles">
            ${questionTilesHTML}
          </div>
        </aside>

        <main class="game-content">
          <div class="question-container">
            <div class="question-header-badge">
              <span class="question-number">Question ${this.questionIndex + 1}</span>
              <span class="question-divider">&bull;</span>
              <span class="question-topic">${this.currentQuestion.topic}</span>
            </div>
            ${questionHTML}
          </div>
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

    if (!isAnswered) {
      this.attachEvents();
    }
  },

  // ── Single-select (radio buttons) ──────────────────────────

  renderSingleSelect(isAnswered, status) {
    if (isAnswered) {
      return `
        <div class="question-card">
          <div class="question-type-badge">
            <i class="fa-solid fa-circle-dot"></i> Single Select
          </div>
          <h2 class="question-text">${this.currentQuestion.question}</h2>
          <div class="options-list">
            ${this.currentQuestion.options.map((option, index) => {
              const isCorrect = this.currentQuestion.correctAnswers.includes(index);
              const isUserAnswer = status.userAnswer === index;

              let itemClass = 'option-item disabled';
              let indicator = '';

              if (isCorrect) {
                itemClass += ' correct';
                indicator = '<span class="answer-indicator correct-indicator">\u2713</span>';
              }

              if (isUserAnswer && !isCorrect) {
                itemClass += ' incorrect';
                indicator = '<span class="answer-indicator incorrect-indicator">\u2717</span>';
              }

              return `
                <div class="${itemClass}">
                  <input type="radio" disabled ${isUserAnswer ? 'checked' : ''}>
                  <label>${option}</label>
                  ${indicator}
                </div>
              `;
            }).join('')}
          </div>
          <div class="answer-feedback ${status.correct ? 'correct' : 'incorrect'}">
            <i class="fa-solid ${status.correct ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
            ${status.correct ? 'Correct! Well done.' : 'Incorrect. Review and try to remember for next time.'}
          </div>
          ${this.renderNavigationButtons()}
        </div>
      `;
    }

    return `
      <div class="question-card">
        <div class="question-type-badge">
          <i class="fa-solid fa-circle-dot"></i> Single Select
        </div>
        <h2 class="question-text">${this.currentQuestion.question}</h2>
        <div class="options-list">
          ${this.currentQuestion.options.map((option, index) => {
            return `
              <div class="option-item" data-index="${index}">
                <input type="radio" name="answer" value="${index}"
                  id="option${index}">
                <label for="option${index}">${option}</label>
              </div>
            `;
          }).join('')}
        </div>
        ${this.renderFooter(false, status)}
      </div>
    `;
  },

  // ── Multi-select (checkboxes) ──────────────────────────────

  renderMultiSelect(isAnswered, status) {
    if (isAnswered) {
      const userAnswers = Array.isArray(status.userAnswer) ? status.userAnswer : [];

      return `
        <div class="question-card">
          <div class="question-type-badge">
            <i class="fa-solid fa-list-check"></i> Select All That Apply
          </div>
          <h2 class="question-text">${this.currentQuestion.question}</h2>
          <p class="question-hint">Select all that apply</p>
          <div class="options-list">
            ${this.currentQuestion.options.map((option, index) => {
              const isCorrect = this.currentQuestion.correctAnswers.includes(index);
              const isUserAnswer = userAnswers.includes(index);

              let itemClass = 'option-item disabled';
              let indicator = '';

              // Determine which single indicator to show
              if (isUserAnswer && isCorrect) {
                // User selected it AND it's correct - show green check
                itemClass += ' correct';
                indicator = '<span class="answer-indicator correct-indicator">\u2713</span>';
              } else if (isUserAnswer && !isCorrect) {
                // User selected it but it's WRONG - show red X
                itemClass += ' incorrect';
                indicator = '<span class="answer-indicator incorrect-indicator">\u2717</span>';
              } else if (!isUserAnswer && isCorrect) {
                // User MISSED this correct answer - show gray circle
                itemClass += ' correct';
                indicator = '<span class="answer-indicator missed-indicator">\u25CB Missed</span>';
              }
              // If not selected and not correct, show nothing

              return `
                <div class="${itemClass}">
                  <input type="checkbox" disabled ${isUserAnswer ? 'checked' : ''}>
                  <label>${option}</label>
                  ${indicator}
                </div>
              `;
            }).join('')}
          </div>
          <div class="answer-feedback ${status.correct ? 'correct' : 'incorrect'}">
            <div style="font-size: var(--font-size-2xl); margin-bottom: var(--spacing-sm);">
              ${status.correct ? '\uD83C\uDF89' : '\uD83D\uDCCB'}
            </div>
            ${status.correct ? '\u2713 Perfect! All correct answers selected.' : '\u2717 Not quite right - Review the options above'}
          </div>
          ${this.renderNavigationButtons()}
        </div>
      `;
    }

    return `
      <div class="question-card">
        <div class="question-type-badge">
          <i class="fa-solid fa-list-check"></i> Select All That Apply
        </div>
        <h2 class="question-text">${this.currentQuestion.question}</h2>
        <div class="options-list">
          ${this.currentQuestion.options.map((option, index) => {
            return `
              <div class="option-item checkbox" data-index="${index}">
                <input type="checkbox" name="answer" value="${index}"
                  id="option${index}">
                <label for="option${index}">${option}</label>
              </div>
            `;
          }).join('')}
        </div>
        ${this.renderFooter(false, status)}
      </div>
    `;
  },

  // ── Fill-in-the-blank(s) (drag-and-drop) ──────────────────

  renderDragDropBlanks(isAnswered, status) {
    console.log('[DragDrop] renderDragDropBlanks called', {
      id: this.currentQuestion.id,
      type: this.currentQuestion.type,
      isAnswered,
      correctAnswers: this.currentQuestion.correctAnswers,
      options: this.currentQuestion.options
    });

    const blanksCount = this.currentQuestion.correctAnswers.length;

    // ANSWERED STATE
    if (isAnswered) {
      const correctAnswers = this.currentQuestion.correctAnswers;
      const userAnswers = Array.isArray(status.userAnswer) ? status.userAnswer : [status.userAnswer];

      let questionWithFilledBlanks = this.currentQuestion.question;

      for (let i = 0; i < blanksCount; i++) {
        const userAnswer = this.currentQuestion.options[userAnswers[i]];
        const isCorrect = userAnswers[i] === correctAnswers[i];

        const blankHTML = `<span class="filled-blank ${isCorrect ? 'correct-blank' : 'incorrect-blank'}">${userAnswer} <span class="${isCorrect ? 'blank-check' : 'blank-cross'}">${isCorrect ? '\u2713' : '\u2717'}</span></span>`;

        questionWithFilledBlanks = questionWithFilledBlanks.replace('________', blankHTML);
      }

      return `
        <div class="question-card">
          <div class="question-type-badge">
            <i class="fa-solid fa-fill-drip"></i> Fill in the Blank${blanksCount === 1 ? '' : 's'}
          </div>
          <div class="question-text">${questionWithFilledBlanks}</div>

          <div class="answer-feedback ${status.correct ? 'correct' : 'incorrect'}">
            <i class="fa-solid ${status.correct ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
            ${status.correct ? 'All Correct!' : 'Some answers were incorrect'}
          </div>

          ${!status.correct ? `
            <div class="correct-answers-list">
              <strong>Correct answers:</strong>
              <ul>
                ${correctAnswers.map((correctIndex, blankNum) => {
                  const isUserCorrect = userAnswers[blankNum] === correctIndex;
                  return `
                    <li class="${isUserCorrect ? 'answer-correct' : 'answer-wrong'}">
                      Blank ${blankNum + 1}: ${this.currentQuestion.options[correctIndex]}
                      ${isUserCorrect ? '\u2713' : `\u2717 (You selected: ${this.currentQuestion.options[userAnswers[blankNum]]})`}
                    </li>
                  `;
                }).join('')}
              </ul>
            </div>
          ` : ''}

          ${this.renderNavigationButtons()}
        </div>
      `;
    }

    // NOT ANSWERED - Show drag-drop interface
    let questionWithBlanks = this.currentQuestion.question;
    for (let i = 0; i < blanksCount; i++) {
      questionWithBlanks = questionWithBlanks.replace('________',
        `<span class="drop-zone" data-blank="${i}" id="drop-zone-${i}">[Drop here]</span>`
      );
    }

    console.log('[DragDrop] Question with drop zones:', questionWithBlanks);

    return `
      <div class="question-card" id="drag-drop-card">
        <div class="question-type-badge">
          <i class="fa-solid fa-fill-drip"></i> Fill in the Blank${blanksCount === 1 ? '' : 's'}
        </div>
        <div class="question-text">${questionWithBlanks}</div>
        <p class="question-hint">
          <strong>Instructions:</strong> Drag an option from below and drop it into the blank space above.
        </p>

        <div class="drag-container" id="drag-container">
          ${this.currentQuestion.options.map((option, index) => `
            <div class="draggable" data-index="${index}" id="draggable-${index}">${option}</div>
          `).join('')}
        </div>

        <button class="btn-primary submit-btn" id="submit-drag-drop" disabled>
          <i class="fa-solid fa-paper-plane"></i> Submit Answer
        </button>
      </div>
    `;
  },

  // ── Drag-drop order (drag to reorder) ──────────────────────

  renderDragDropOrder(isAnswered, status) {
    if (isAnswered) {
      const userOrder = status.userAnswer;
      const correctOrder = this.currentQuestion.correctOrder;

      return `
        <div class="question-card drag-drop-question">
          <div class="question-type-badge">
            <i class="fa-solid fa-arrow-down-1-9"></i> Arrange in Order
          </div>
          <h2 class="question-text">${this.currentQuestion.question}</h2>

          <div class="order-comparison">
            <div class="order-column">
              <h3>Your Answer:</h3>
              <ol class="answer-order-list ${status.correct ? 'correct-order' : 'incorrect-order'}">
                ${userOrder.map(index => `
                  <li>${this.currentQuestion.options[index]}</li>
                `).join('')}
              </ol>
            </div>

            ${!status.correct ? `
              <div class="order-column">
                <h3>Correct Order:</h3>
                <ol class="answer-order-list correct-order">
                  ${correctOrder.map(index => `
                    <li>${this.currentQuestion.options[index]}</li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}
          </div>

          <div class="answer-feedback ${status.correct ? 'correct' : 'incorrect'}">
            ${status.correct ? '\u2713 Perfect! Correct sequence.' : '\u2717 Incorrect order - See the correct sequence above'}
          </div>
          ${this.renderNavigationButtons()}
        </div>
      `;
    }

    return `
      <div class="question-card drag-drop-question">
        <div class="question-type-badge">
          <i class="fa-solid fa-arrow-down-1-9"></i> Arrange in Order
        </div>
        <h2 class="question-text">${this.currentQuestion.question}</h2>
        <p class="question-hint">Drag the items to arrange them in the correct order</p>
        <div class="order-list" id="order-list">
          ${this.currentQuestion.options.map((option, index) => `
            <div class="order-item draggable-order" data-index="${index}" draggable="true">
              <span class="order-number">${index + 1}</span>
              <span class="order-text">${option}</span>
              <span class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></span>
            </div>
          `).join('')}
        </div>
        <button class="btn-primary submit-btn">
          <i class="fa-solid fa-paper-plane"></i> Submit Order
        </button>
      </div>
    `;
  },

  // ── Shared footer (submit btn or feedback + nav) ───────────

  renderFooter(isAnswered, status) {
    if (!isAnswered) {
      return `<button class="btn-primary submit-btn" disabled>
        <i class="fa-solid fa-paper-plane"></i> Submit Answer
      </button>`;
    }

    return `
      <div class="answer-feedback ${status.correct ? 'correct' : 'incorrect'}">
        <i class="fa-solid ${status.correct ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
        ${status.correct ? 'Correct! Well done.' : 'Incorrect. Review and try to remember for next time.'}
      </div>
      ${this.renderNavigationButtons()}
    `;
  },

  renderNavigationButtons() {
    const totalQuestions = getTotalQuestions();
    const nextIndex = Progression.getNextQuestionIndex(this.questionIndex, totalQuestions);

    return `
      <div class="question-nav">
        ${nextIndex !== null ? `
          <button class="btn-primary" onclick="window.location.hash='#/question?index=${nextIndex}'">
            Next Question <i class="fa-solid fa-arrow-right"></i>
          </button>
        ` : `
          <button class="btn-primary" onclick="window.location.hash='#/game'">
            <i class="fa-solid fa-flag-checkered"></i> View Results
          </button>
        `}
      </div>
    `;
  },

  // ── Event handlers ─────────────────────────────────────────

  attachEvents() {
    console.log('[Events] attachEvents called, type:', this.currentQuestion.type, 'id:', this.currentQuestion.id);

    const submitBtn = document.querySelector('.submit-btn');
    console.log('[Events] Submit button found:', !!submitBtn);

    if (!submitBtn) return;

    switch (this.currentQuestion.type) {
      case 'single-select':
        console.log('[Events] -> attachSingleSelectEvents');
        this.attachSingleSelectEvents(submitBtn);
        break;
      case 'multi-select':
        console.log('[Events] -> attachMultiSelectEvents');
        this.attachMultiSelectEvents(submitBtn);
        break;
      case 'drag-drop-blank':
      case 'drag-drop-blanks':
        console.log('[Events] -> initializeDragDrop');
        this.initializeDragDrop(submitBtn);
        break;
      case 'drag-drop-order':
        console.log('[Events] -> initializeOrderDrag');
        this.initializeOrderDrag(submitBtn);
        break;
      default:
        console.error('[Events] Unknown question type:', this.currentQuestion.type);
    }
  },

  attachSingleSelectEvents(submitBtn) {
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => { submitBtn.disabled = false; });
    });
    submitBtn.addEventListener('click', () => {
      const selected = document.querySelector('input[type="radio"]:checked');
      if (selected) this.submitAnswer(parseInt(selected.value));
    });
  },

  attachMultiSelectEvents(submitBtn) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        submitBtn.disabled = document.querySelectorAll('input[type="checkbox"]:checked').length === 0;
      });
    });
    submitBtn.addEventListener('click', () => {
      const selected = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => parseInt(cb.value));
      this.submitAnswer(selected);
    });
  },

  // ── Drag-and-drop for fill-in-the-blank(s) ──────────────────

  initializeDragDrop(submitBtn) {
    console.log('[DragDrop] initializeDragDrop called');

    const blanksCount = this.currentQuestion.correctAnswers.length;
    const userAnswers = new Array(blanksCount).fill(null);
    const self = this;

    if (typeof interact === 'undefined') {
      console.error('[DragDrop] CRITICAL: interact.js is NOT loaded!');
      return;
    }

    setTimeout(() => {
      const draggables = document.querySelectorAll('.draggable');
      const dropZones = document.querySelectorAll('.drop-zone');

      console.log('[DragDrop] DOM:', { draggables: draggables.length, dropZones: dropZones.length });

      if (draggables.length === 0 || dropZones.length === 0) {
        console.error('[DragDrop] Missing DOM elements!');
        return;
      }

      // MAKE ITEMS DRAGGABLE with snap-back
      interact('.draggable').draggable({
        inertia: false,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: '#drag-drop-card',
            endOnly: true
          })
        ],
        autoScroll: true,
        listeners: {
          start(event) {
            console.log('[DragDrop] Drag started:', event.target.textContent.trim());
            event.target.classList.add('is-dragging');
          },
          move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          },
          end(event) {
            const target = event.target;
            target.classList.remove('is-dragging');

            // If not dropped on a valid zone, snap back
            if (!target.classList.contains('was-dropped')) {
              console.log('[DragDrop] Snap back:', target.textContent.trim());
              target.style.transform = '';
              target.setAttribute('data-x', 0);
              target.setAttribute('data-y', 0);
            }
            target.classList.remove('was-dropped');
          }
        }
      });

      // MAKE DROP ZONES
      interact('.drop-zone').dropzone({
        accept: '.draggable',
        overlap: 0.25,
        ondragenter(event) {
          event.target.classList.add('drop-active');
        },
        ondragleave(event) {
          event.target.classList.remove('drop-active');
        },
        ondrop(event) {
          const draggedElement = event.relatedTarget;
          const dropZone = event.target;
          const optionIndex = parseInt(draggedElement.getAttribute('data-index'));
          const blankIndex = parseInt(dropZone.getAttribute('data-blank'));

          console.log('[DragDrop] DROP!', { blank: blankIndex, option: optionIndex, text: draggedElement.textContent.trim() });

          // Mark as successfully dropped (prevents snap-back in end handler)
          draggedElement.classList.add('was-dropped');

          // If blank already filled, return old draggable
          if (userAnswers[blankIndex] !== null) {
            const oldDrag = document.getElementById(`draggable-${userAnswers[blankIndex]}`);
            if (oldDrag) {
              oldDrag.style.display = '';
              oldDrag.style.transform = '';
              oldDrag.setAttribute('data-x', 0);
              oldDrag.setAttribute('data-y', 0);
            }
          }

          // Fill drop zone
          dropZone.textContent = draggedElement.textContent.trim();
          dropZone.classList.add('filled');
          dropZone.classList.remove('drop-active');

          // Store answer
          userAnswers[blankIndex] = optionIndex;

          // Hide dragged item
          draggedElement.style.display = 'none';
          draggedElement.style.transform = '';
          draggedElement.setAttribute('data-x', 0);
          draggedElement.setAttribute('data-y', 0);

          // Enable submit if all filled
          const allFilled = userAnswers.every(a => a !== null);
          submitBtn.disabled = !allFilled;
          console.log('[DragDrop] Answers:', [...userAnswers], 'All filled:', allFilled);
        }
      });

      // Click filled zone to clear it
      document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('click', () => {
          const blankIndex = parseInt(zone.getAttribute('data-blank'));
          if (userAnswers[blankIndex] !== null) {
            console.log('[DragDrop] Clearing blank', blankIndex);
            const oldDrag = document.getElementById(`draggable-${userAnswers[blankIndex]}`);
            if (oldDrag) {
              oldDrag.style.display = '';
              oldDrag.style.transform = '';
              oldDrag.setAttribute('data-x', 0);
              oldDrag.setAttribute('data-y', 0);
            }
            userAnswers[blankIndex] = null;
            zone.textContent = '[Drop here]';
            zone.classList.remove('filled');
            submitBtn.disabled = true;
          }
        });
      });

      console.log('[DragDrop] Initialization complete!');
    }, 200);

    submitBtn.onclick = () => {
      console.log('[DragDrop] Submit clicked, answers:', [...userAnswers]);
      self.submitAnswer(userAnswers);
    };
  },

  // ── Drag-and-drop for ordering ─────────────────────────────

  initializeOrderDrag(submitBtn) {
    const orderList = document.getElementById('order-list');
    if (!orderList) return;
    const self = this;

    let draggedItem = null;

    orderList.addEventListener('dragstart', (e) => {
      draggedItem = e.target.closest('.draggable-order');
      if (draggedItem) {
        draggedItem.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    orderList.addEventListener('dragend', () => {
      if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
        // Re-number
        orderList.querySelectorAll('.draggable-order').forEach((item, i) => {
          item.querySelector('.order-number').textContent = i + 1;
        });
      }
    });

    orderList.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const afterElement = this.getDragAfterElement(orderList, e.clientY);
      if (draggedItem) {
        if (afterElement) {
          orderList.insertBefore(draggedItem, afterElement);
        } else {
          orderList.appendChild(draggedItem);
        }
      }
    });

    submitBtn.addEventListener('click', () => {
      const items = orderList.querySelectorAll('.draggable-order');
      const order = Array.from(items).map(item => parseInt(item.dataset.index));
      self.submitAnswer(order);
    });
  },

  getDragAfterElement(container, y) {
    const items = [...container.querySelectorAll('.draggable-order:not(.dragging)')];
    return items.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  },

  submitAnswer(userAnswer) {
    const result = Scoring.checkAnswer(this.currentQuestion, userAnswer);
    State.answerQuestion(this.questionIndex, result.correct, userAnswer, result.points);
    this.renderQuestion();
  }
};
