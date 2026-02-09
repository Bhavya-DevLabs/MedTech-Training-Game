// Modal system - reusable modal overlay for confirmations, results, etc.
// All modals render into a shared overlay container.

export const Modals = {
  overlayEl: null,

  /**
   * Show a modal with the given content.
   * @param {Object} options
   *   options.title     – modal header text
   *   options.body      – HTML string for the modal body
   *   options.actions   – array of { label, className, onClick }
   *   options.closable  – if true, clicking overlay or X closes the modal (default true)
   */
  show({ title = '', body = '', actions = [], closable = true } = {}) {
    this.hide(); // Remove any existing modal first

    const actionsHTML = actions.map((action, i) => `
      <button class="${action.className || 'btn-primary'}" data-action-index="${i}">
        ${action.label}
      </button>
    `).join('');

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2>${title}</h2>
          ${closable ? '<button class="btn-icon modal-close"><i class="fa-solid fa-xmark"></i></button>' : ''}
        </div>
        <div class="modal-body">${body}</div>
        ${actionsHTML ? `<div class="modal-actions">${actionsHTML}</div>` : ''}
      </div>
    `;

    document.body.appendChild(overlay);
    this.overlayEl = overlay;

    // Trigger CSS transition
    requestAnimationFrame(() => overlay.classList.add('visible'));

    // Attach events
    if (closable) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.hide();
      });

      const closeBtn = overlay.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hide());
      }
    }

    // Action buttons
    actions.forEach((action, i) => {
      const btn = overlay.querySelector(`[data-action-index="${i}"]`);
      if (btn && action.onClick) {
        btn.addEventListener('click', () => {
          action.onClick();
          if (action.autoClose !== false) this.hide();
        });
      }
    });
  },

  /**
   * Hide and remove the current modal.
   */
  hide() {
    if (this.overlayEl) {
      this.overlayEl.classList.remove('visible');
      // Wait for CSS transition before removing from DOM
      setTimeout(() => {
        if (this.overlayEl && this.overlayEl.parentNode) {
          this.overlayEl.parentNode.removeChild(this.overlayEl);
        }
        this.overlayEl = null;
      }, 200);
    }
  },

  /**
   * Shortcut: confirmation dialog.
   * @returns {Promise<boolean>}
   */
  confirm({ title = 'Confirm', message = 'Are you sure?', confirmLabel = 'Confirm', cancelLabel = 'Cancel' } = {}) {
    return new Promise((resolve) => {
      this.show({
        title,
        body: `<p>${message}</p>`,
        closable: true,
        actions: [
          {
            label: cancelLabel,
            className: 'btn-secondary',
            onClick: () => resolve(false)
          },
          {
            label: confirmLabel,
            className: 'btn-primary',
            onClick: () => resolve(true)
          }
        ]
      });
    });
  },

  /**
   * Shortcut: results summary modal.
   */
  showResults({ score, correct, incorrect, total, accuracy }) {
    this.show({
      title: 'Game Complete!',
      body: `
        <div style="text-align: center;">
          <div class="game-final-stats">
            <span class="final-score">Score: ${score}</span>
            <span class="final-correct">Correct: ${correct}</span>
            <span class="final-incorrect">Incorrect: ${incorrect}</span>
          </div>
          <p>You answered ${correct} of ${total} questions correctly (${accuracy}%).</p>
        </div>
      `,
      closable: true,
      actions: [
        {
          label: 'Review Answers',
          className: 'btn-secondary',
          onClick: () => { window.location.hash = '#/question?index=0'; }
        },
        {
          label: 'Back to Game Board',
          className: 'btn-primary',
          onClick: () => { window.location.hash = '#/game'; }
        }
      ]
    });
  }
};
