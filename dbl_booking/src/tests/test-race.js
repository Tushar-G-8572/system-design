const SEAT_ID = "6a71b7b9e5ee7b5dda328cc1";
// Stage -1 where 20 user's fetching same seat and all users get 200 response means all users claimed that seat
// const URL = `http://localhost:3000/seats/${SEAT_ID}/book-naive`;

//  stage -2 uses mongoDB $set operator to set the status:"held" so only one user has the 200 status and other  has 409
// const URL = `http://localhost:3000/seats/${SEAT_ID}/book-atomic`;

// stage -3 uses redis for automic and store key:seatId and hold the key and allot that seat.
// const URL = `http://localhost:3000/seats/${SEAT_ID}/hold`;
// const URL = `http://localhost:3000/seats/${SEAT_ID}/confirm`;
// const URL = `http://localhost:3000/seats/${SEAT_ID}/cancel`;

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
   Array.from({ length: 20 }, (_, i) => attempt(`user-${i}`))
  );
  const successes = results.filter(r => r.status === 200);
  console.log(`${successes.length} requests succeeded (should be 1)`);
  console.table(results);
  }catch(err){
   console.log(err);
  }
}

run();