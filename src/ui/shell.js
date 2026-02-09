// App shell renderer - Content area only.
// Shell renders ONCE. Only content area swaps on navigation.

export const Shell = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-shell">
        <div id="content" class="content"></div>
      </div>
    `;
  },

  updateContent(html) {
    const content = document.getElementById('content');
    if (content) content.innerHTML = html;
  }
};
