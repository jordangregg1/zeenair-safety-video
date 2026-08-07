// ===== ZEENAIR SHOW TIME =====
// Shared "wall clock" for every scene. Normally just the real clock, but the
// show operator can override it to a mock time from the terminal-board.html
// SHOW CONFIG panel (press "c" during the show) — e.g. to preview how the
// departures board looks later in the night without waiting for real time
// to catch up. The override is stored in localStorage so it's shared across
// the parent player and every scene iframe; scenes pick up live changes via
// the "storage" event (which fires in every browsing context except the one
// that made the change) and also read the current value on load.
(function (window) {
  const KEY = "zeenair_time_override_v1";
  let state = { mode: "live", offsetMs: 0 };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.mode === "live" || parsed.mode === "mock")) {
          state = parsed;
          return;
        }
      }
    } catch (e) { /* ignore corrupt storage, fall back to live */ }
    state = { mode: "live", offsetMs: 0 };
  }
  load();

  window.addEventListener("storage", (e) => {
    if (e.key === KEY) load();
  });

  window.ZeenairTime = {
    getNow() {
      return state.mode === "mock" ? new Date(Date.now() + (state.offsetMs || 0)) : new Date();
    },
    isMock() {
      return state.mode === "mock";
    },
  };
})(window);
