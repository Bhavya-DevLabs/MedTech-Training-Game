// Multiple choice question game - extends GameBase
// Handles single-select (radio) and multi-select (checkbox) question types.
// Game logic only — no page navigation, no scoring rules.

import { GameBase } from './gameBase.js';

export class MCQGame extends GameBase {
  constructor() {
    super();
    this.config = null;
    this.callbacks = null;
    this.selectedAnswers = [];
    this.isSubmitted = false;
  }

  /**
   * @param {Object} config
   *   config.question   – full question object from questions.js
   *   config.status      – { answered, correct, userAnswer } from state
   * @param {Object} callbacks
   *   callbacks.onSubmit(userAnswer) – called when user submits
   */
  init(config, callbacks) {
    this.config = config;
    this.callbacks = callbacks;
    this.selectedAnswers = [];
    this.isSubmitted = config.status?.answered || false;
  }

  render(container) {
    if (!this.config || !container) return;

    const { question, status } = this.config;
    const isMulti = question.type === 'multi-select';
    const inputType = isMulti ? 'checkbox' : 'radio';

    const optionsHTML = question.options.map((option, index) => {
      let optionClass = 'option-item';
      if (this.isSubmitted) {
        const isCorrectOption = question.correctAnswers.includes(index);
        const wasSelected = isMulti
          ? (status.userAnswer && status.userAnswer.includes(index))
          : (status.userAnswer === index);

        if (isCorrectOption) optionClass += ' correct';
        else if (wasSelected) optionClass += ' incorrect';
        optionClass += ' disabled';
      }

      return `
        <div class="${optionClass}" data-index="${index}">
          <input type="${inputType}" name="mcq-answer" value="${index}"
            id="mcq-option-${index}" ${this.isSubmitted ? 'disabled' : ''}>
          <label for="mcq-option-${index}">${option}</label>
        </div>
      `;
    }).join('');

    const badgeLabel = isMulti ? 'Select All That Apply' : 'Single Select';
    const badgeIcon = isMulti ? 'fa-list-check' : 'fa-circle-dot';

    container.innerHTML = `
      <div class="question-card">
        <div class="question-type-badge">
          <i class="fa-solid ${badgeIcon}"></i> ${badgeLabel}
        </div>
        <h2 class="question-text">${question.question}</h2>
        <div class="options-list">${optionsHTML}</div>
        ${this.isSubmitted
          ? this.renderFeedback(status)
          : `<button class="btn-primary submit-btn" disabled>
               <i class="fa-solid fa-paper-plane"></i> Submit Answer
             </button>`
        }
      </div>
    `;

    if (!this.isSubmitted) {
      this.attachEvents(container, isMulti);
    }
  }

  destroy() {
    this.config = null;
    this.callbacks = null;
    this.selectedAnswers = [];
    this.isSubmitted = false;
  }

  // ── Private helpers ────────────────────────────────────────

  attachEvents(container, isMulti) {
    const submitBtn = container.querySelector('.submit-btn');
    if (!submitBtn) return;

    if (isMulti) {
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          submitBtn.disabled = container.querySelectorAll('input[type="checkbox"]:checked').length === 0;
        });
      });

      submitBtn.addEventListener('click', () => {
        const selected = Array.from(container.querySelectorAll('input[type="checkbox"]:checked'))
          .map(cb => parseInt(cb.value));
        this.callbacks?.onSubmit(selected);
      });
    } else {
      const radios = container.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => {
        radio.addEventListener('change', () => {
          submitBtn.disabled = false;
        });
      });

      submitBtn.addEventListener('click', () => {
        const selected = container.querySelector('input[type="radio"]:checked');
        if (selected) {
          this.callbacks?.onSubmit(parseInt(selected.value));
        }
      });
    }
  }

  renderFeedback(status) {
    const icon = status.correct ? 'fa-circle-check' : 'fa-circle-xmark';
    const cls = status.correct ? 'correct' : 'incorrect';
    const msg = status.correct
      ? 'Correct! Well done.'
      : 'Incorrect. Review and try to remember for next time.';

    return `
      <div class="answer-feedback ${cls}">
        <i class="fa-solid ${icon}"></i> ${msg}
      </div>
    `;
  }
}

// Self-register with game engine registry
MCQGame.TYPES = ['single-select', 'multi-select'];
