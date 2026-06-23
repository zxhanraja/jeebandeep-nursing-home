/**
 * Clock Module — Periodically updates the live IST timezone clock display.
 */
function initLiveClock() {
  const timeEl = document.getElementById('live-ist-time');
  if (!timeEl) return;

  const updateClock = () => {
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      timeEl.textContent = `LIVE // ${timeString}`;
    } catch (e) {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      timeEl.textContent = `LIVE // ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}
