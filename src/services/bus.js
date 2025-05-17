const fetch = require('node-fetch');
const { updateDocumentText } = require('services/firestore');

const activePolls = new Map();

async function busHandler(req, res) {
  const { stopId, lines, minutes } = req.body;

  if (!stopId || !Array.isArray(lines) || lines.length === 0 || !minutes) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const user = req.user?.email || 'unknown';
  const key = `${stopId}-${user}`;

  if (activePolls.has(key)) {
    clearInterval(activePolls.get(key).interval);
  }

  async function fetchAndUpdate() {
    try {
      const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals`);
      const data = await response.json();

      const relevant = data
        .filter(d => lines.includes(d.lineName))
        .sort((a, b) => a.timeToStation - b.timeToStation)
        .slice(0, 3);

      const message = relevant
        .map(bus => `${bus.lineName} ${Math.round(bus.timeToStation / 60)} mins`)
        .join(', ') || 'No buses due';

      await updateDocumentText(message, user);
      console.log(`[Bus] Updated with: ${message}`);
    } catch (err) {
      console.error('[Bus] Failed to fetch or update:', err);
    }
  }

  await fetchAndUpdate();

  const interval = setInterval(fetchAndUpdate, 60000);
  setTimeout(() => {
    clearInterval(interval);
    activePolls.delete(key);
  }, minutes * 60000);

  activePolls.set(key, { interval });

  res.json({ status: 'scheduled', stopId, lines, minutes });
}

module.exports = { busHandler };
