import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Players ///////////////////////////////

const playerQuerySnapshot = await firestore.collection("players").get();

/////////////////////////////// Copy each Player to the NEW collection ///////////////////////////////

playerQuerySnapshot.forEach(async (playerDoc) => {
  await firestore
    .collection("new")
    .doc("new")
    .collection("players")
    .doc(playerDoc.id)
    .set(playerDoc.data());
});
