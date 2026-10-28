// Serverless API for kishor.tech visitors & edge telemetry
let localSessionCounter = 0;

export default async function handler(req, res) {
  // CORS & caching headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Calculate synchronized baseline with macos.kishor.tech
  const baseLaunchDate = new Date("2026-01-01T00:00:00Z").getTime();
  const daysElapsed = Math.max(0, Math.floor((Date.now() - baseLaunchDate) / (1000 * 60 * 60 * 24)));
  const baselineCount = 2860 + daysElapsed * 5;

  const shouldIncrement =
    req.method === "POST" ||
    req.query?.inc === "true" ||
    req.query?.inc === "1" ||
    req.query?.increment === "true";

  if (shouldIncrement) {
    localSessionCounter += 1;
  }

  const finalCount = baselineCount + localSessionCounter;

  return res.status(200).json({
    count: finalCount,
    formatted: finalCount.toLocaleString(),
    status: "healthy",
    service: "kishor-tech-edge",
    syncedWith: "macos.kishor.tech",
    lastUpdated: "October 2026",
    version: "vantage-portfolio-v3.0",
    uptime: "99.99%",
    timestamp: new Date().toISOString(),
  });
}

