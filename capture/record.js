// Records the Zeenair Flight 60 player (../terminal-board.html) to an MP4 loop.
// Usage: npm run record  [-- --duration=300]   (duration in seconds, default 300 = 5 min)
//
// Uses the full "puppeteer" package (bundles a Chromium build for whatever
// OS this runs on) rather than puppeteer-core + @sparticuz/chromium, since
// @sparticuz/chromium ships a Linux-only binary meant for serverless/Lambda
// sandboxes. If you're running this from a constrained Linux CI/sandbox
// where puppeteer's Chromium download is blocked, swap in puppeteer-core +
// @sparticuz/chromium instead (that's the combo validated in that context).

const path = require("path");
const puppeteer = require("puppeteer");
const ffmpegPath = require("ffmpeg-static");
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

const durationArg = process.argv.find(a => a.startsWith("--duration="));
const DURATION_SEC = durationArg ? Number(durationArg.split("=")[1]) : 300; // ~5 min loop
const PLAYER_URL = `file://${path.join(__dirname, "..", "terminal-board.html")}`;
const OUTPUT_PATH = path.join(__dirname, "zeenair-flight60-loop.mp4");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();
  await page.goto(PLAYER_URL, { waitUntil: "load" });

  const recorder = new PuppeteerScreenRecorder(page, {
    fps: 30,
    ffmpeg_Path: ffmpegPath,
    videoFrame: { width: 1920, height: 1080 },
    aspectRatio: "16:9",
  });

  console.log(`Recording ${DURATION_SEC}s to ${OUTPUT_PATH} ...`);
  await recorder.start(OUTPUT_PATH);
  await new Promise(resolve => setTimeout(resolve, DURATION_SEC * 1000));
  await recorder.stop();
  await browser.close();
  console.log("Done.");
})();
