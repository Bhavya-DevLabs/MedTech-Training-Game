export const Topbar = {
  update(breadcrumb, title) {
    const topbar = document.getElementById('topbar');
    if (topbar) {
      topbar.innerHTML = `
        <div class="topbar-content">
          <div class="breadcrumb">${breadcrumb}</div>
          <h1 class="page-title">${title}</h1>
        </div>
      `;
    }
  }
};
// Topbar component - breadcrumb + title
