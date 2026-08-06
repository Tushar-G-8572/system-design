const SEAT_ID = "6a74310d0a585b95e8e664bc";

// stage -4
const URL = `http://localhost:3000/api/booking/seat/${SEAT_ID}`;


async function attempt(userId) {
  const res = await fetch(URL, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ userId }) });
  return { userId, ...(await res.json()) };
}

async function run() {
  const queued = await Promise.all(Array.from({ length: 15 }, (_, i) => attempt(`user-${i}`)));
  await new Promise(r => setTimeout(r, 2000)); // let the worker drain

  const results = await Promise.all(queued.map(async q => {
    const r = await fetch(`http://localhost:3000/api/booking/status/${q.requestId}`);
    return { ...q, ...(await r.json()) };
  }));

  console.log(`${results.filter(r => r.status === 'confirmed').length} confirmed (should be 1)`);
  console.table(results);
}

run();