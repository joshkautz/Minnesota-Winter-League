import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Players ///////////////////////////////

const playerQuerySnapshot = await firestore.collection("players").get();

/////////////////////////////// Update ///////////////////////////////

playerQuerySnapshot.forEach(async (playerDoc) => {
  const seasons = playerDoc.data().seasons;

  if (seasons[0].team === null) {
    seasons[0].paid = false;
    seasons[0].signed = false;
  }

  if (seasons[0].team !== null) {
    seasons[0].paid = true;
    seasons[0].signed = true;
  }

  await playerDoc.ref.update({
    seasons: seasons,
  });
});
