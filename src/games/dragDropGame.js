// Drag and drop game - extends GameBase
// Handles: drag-drop-blank, drag-drop-blanks, drag-drop-order
// Uses select-based fallback UI; true drag-and-drop can be layered later.

import { GameBase } from './gameBase.js';

export class DragDropGame extends GameBase {
  constructor() {
    super();
    this.config = null;
    this.callbacks = null;
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
    this.isSubmitted = config.status?.answered || false;
  }

  render(container) {
    if (!this.config || !container) return;

    const { question } = this.config;

    switch (question.type) {
      case 'drag-drop-blank':
      case 'drag-drop-blanks':
        this.renderBlanks(container);
        break;
      case 'drag-drop-order':
        this.renderOrder(container);
        break;
    }
  }

  destroy() {
    this.config = null;
    this.callbacks = null;
    this.isSubmitted = false;
  }

  // ── Fill-in-the-blank(s) ─────────────────────────────────

  renderBlanks(container) {
    const { question, status } = this.config;
    const blankCount = question.correctAnswers.length;
    const isSingle = blankCount === 1;

    const blanksHTML = Array.from({ length: blankCount }, (_, i) => {
      const savedAnswer = this.isSubmitted && status.userAnswer != null
        ? (Array.isArray(status.userAnswer) ? status.userAnswer[i] : status.userAnswer)
        : '';

      return `
        <div class="blank-group">
          <label class="blank-label">Blank ${blankCount > 1 ? i + 1 : ''}:</label>
          <select class="blank-select" data-blank="${i}" ${this.isSubmitted ? 'disabled' : ''}>
            <option value="">-- Select --</option>
            ${question.options.map((opt, oi) => `
              <option value="${oi}" ${String(savedAnswer) === String(oi) ? 'selected' : ''}>
                ${opt}
              </option>
            `).join('')}
          </select>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="question-card">
        <div class="question-type-badge">
          <i class="fa-solid fa-fill-drip"></i> Fill in the Blank${isSingle ? '' : 's'}
        </div>
        <h2 class="question-text">${question.question}</h2>
        <div class="blank-selects">${blanksHTML}</div>
        ${this.isSubmitted
          ? this.renderFeedback(status)
          : `<button class="btn-primary submit-btn" disabled>
               <i class="fa-solid fa-paper-plane"></i> Submit Answer
             </button>`
        }
      </div>
    `;

    if (!this.isSubmitted) {
      this.attachBlankEvents(container);
    }
  }

  attachBlankEvents(container) {
    const submitBtn = container.querySelector('.submit-btn');
    const selects = container.querySelectorAll('.blank-select');
    if (!submitBtn) return;

    const checkAllFilled = () => {
      submitBtn.disabled = !Array.from(selects).every(s => s.value !== '');
    };

    selects.forEach(sel => sel.addEventListener('change', checkAllFilled));

    submitBtn.addEventListener('click', () => {
      const values = Array.from(selects).map(s => parseInt(s.value));
      this.callbacks?.onSubmit(values.length === 1 ? values : values);
    });
  }

  // ── Ordering ─────────────────────────────────────────────

  renderOrder(container) {
    const { question, status } = this.config;

    const itemsHTML = question.options.map((option, index) => `
      <div class="order-item" data-index="${index}" draggable="${!this.isSubmitted}">
        <span class="order-number">${index + 1}</span>
        <span class="order-text">${option}</span>
        ${!this.isSubmitted ? '<span class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></span>' : ''}
      </div>
    `).join('');

    container.innerHTML = `
      <div class="question-card">
        <div class="question-type-badge">
          <i class="fa-solid fa-arrow-down-1-9"></i> Arrange in Order
        </div>
        <h2 class="question-text">${question.question}</h2>
        <div class="order-list" id="order-list">${itemsHTML}</div>
        ${this.isSubmitted
          ? this.renderFeedback(status)
          : `<button class="btn-primary submit-btn">
               <i class="fa-solid fa-check"></i> Submit Order
             </button>`
        }
      </div>
    `;

    if (!this.isSubmitted) {
      this.attachOrderEvents(container);
    }
  }

  attachOrderEvents(container) {
    const submitBtn = container.querySelector('.submit-btn');
    const orderList = container.querySelector('#order-list');
    if (!submitBtn || !orderList) return;

    // Drag-and-drop reordering
    let draggedItem = null;

    orderList.addEventListener('dragstart', (e) => {
      draggedItem = e.target.closest('.order-item');
      if (draggedItem) {
        draggedItem.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    orderList.addEventListener('dragend', (e) => {
      if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
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

    // Re-number after each drop
    orderList.addEventListener('drop', () => {
      const items = orderList.querySelectorAll('.order-item');
      items.forEach((item, i) => {
        item.querySelector('.order-number').textContent = i + 1;
      });
    });

    // Submit
    submitBtn.addEventListener('click', () => {
      const items = orderList.querySelectorAll('.order-item');
      const order = Array.from(items).map(item => parseInt(item.dataset.index));
      this.callbacks?.onSubmit(order);
    });
  }

  getDragAfterElement(container, y) {
    const items = [...container.querySelectorAll('.order-item:not(.dragging)')];

    return items.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // ── Shared feedback ──────────────────────────────────────

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
DragDropGame.TYPES = ['drag-drop-blank', 'drag-drop-blanks', 'drag-drop-order'];
