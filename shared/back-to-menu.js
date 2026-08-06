// Double-press Escape (within DOUBLE_TAP_MS) to return to the experiences menu.
(function () {
  const DOUBLE_TAP_MS = 500;
  let lastEscape = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const now = Date.now();
    if (now - lastEscape < DOUBLE_TAP_MS) {
      window.location.href = 'index.html';
    } else {
      lastEscape = now;
    }
  });
})();
