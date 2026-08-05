const SEAT_ID = "6a732ed2a01861c7b1a2f8f3";

// stage -4
const URL = `http://localhost:3000/api/booking/seat/${SEAT_ID}`;

async function attempt(userId) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return { userId, status: res.status };
}

async function run() {
 try{

  const results = await Promise.all(
   Array.from({ length: 15 }, (_, i) => attempt(`user-${i}`))
  );
  const successes = results.filter(r => r.status === 200);
  console.log(`${successes.length} requests succeeded (should be 1)`);
  console.table(results);
  }catch(err){
   console.log(err);
  }
}

run();