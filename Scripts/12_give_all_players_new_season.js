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

const seasonRef = firestore.collection("seasons").doc("PBE6nY7rpCxufItsC7l0");

playerQuerySnapshot.forEach(async (playerDoc) => {
  const seasons = playerDoc.data().seasons;
  seasons.push({
    captain: false,
    paid: false,
    season: seasonRef,
    signed: false,
    team: null,
  });

  await playerDoc.ref.update({
    seasons: seasons,
  });
});
