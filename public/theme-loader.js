// Apply theme before Vue mounts to prevent flash of wrong theme
;(function () {
  var saved = localStorage.getItem('theme')
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark')
  }
})();

// Global loading bar logic
window._loaderCount = 0;
window.startLoader = function () {
  window._loaderCount++;
  const bar = document.getElementById('global-loader-bar');
  const overlay = document.getElementById('global-initial-overlay');
  if (bar) {
    bar.style.width = '30%';
    bar.style.opacity = '1';
    setTimeout(() => { if (bar.style.width === '30%') bar.style.width = '75%'; }, 300);
  }
};
window.stopLoader = function () {
  window._loaderCount = Math.max(0, window._loaderCount - 1);
  if (window._loaderCount > 0) return;

  const bar = document.getElementById('global-loader-bar');
  const overlay = document.getElementById('global-initial-overlay');
  if (bar) {
    bar.style.width = '100%';
    setTimeout(() => {
      bar.style.opacity = '0';
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 500);
      }
      setTimeout(() => { bar.style.width = '0%'; }, 300);
    }, 200);
  }
};
