// Sidebar component — minimal branding only.

export const Sidebar = {
  render() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="logo">Dualto Training</div>
      </div>
    `;
  }
};
