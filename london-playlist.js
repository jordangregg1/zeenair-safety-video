// ===== LONDON VIDEO LOOP — POOLS & CYCLE =====
// Each pool is a bag of interchangeable clips. On page load the player shuffles
// every pool once, then walks those frozen decks forever — so the whole session
// is pre-scheduled up front, and each pass through the cycle gets a different
// street clip and a different Big Ben clip without any per-transition randomness.
window.ZEENAIR_LONDON_POOLS = {
  streets: [
    "assets/london/streets/street-01.mp4",
    "assets/london/streets/street-02.mp4",
    "assets/london/streets/street-03.mp4",
    "assets/london/streets/street-04.mp4",
    "assets/london/streets/street-05.mp4",
    "assets/london/streets/street-06.mp4",
    "assets/london/streets/street-07.mp4",
    "assets/london/streets/street-08.mp4",
    "assets/london/streets/street-09.mp4",
    "assets/london/streets/street-10.mp4",
  ],
  bigben: [
    "assets/london/bigben/bigben-01.mp4",
    "assets/london/bigben/bigben-02.mp4",
    "assets/london/bigben/bigben-03.mp4",
    "assets/london/bigben/bigben-04.mp4",
    "assets/london/bigben/bigben-05.mp4",
    "assets/london/bigben/bigben-06.mp4",
    "assets/london/bigben/bigben-07.mp4",
    "assets/london/bigben/bigben-08.mp4",
    "assets/london/bigben/bigben-09.mp4",
  ],
  train: [
    "assets/london/train/underground-train.mp4",
  ],
};

// One pass of the loop. Every clip is already about the right length
// (streets & Big Ben ~2 min, train ~1 min), so the default is to play each
// one right through.
// pool: which bag to draw the next clip from
// maxSeconds: cut the clip short after this many seconds — 0 plays it in full
window.ZEENAIR_LONDON_CYCLE = [
  { pool: "streets", maxSeconds: 0 },
  { pool: "bigben",  maxSeconds: 0 },
  { pool: "train",   maxSeconds: 0 },
];
