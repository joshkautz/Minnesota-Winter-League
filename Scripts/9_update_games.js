import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Games ///////////////////////////////

const games = await firestore.collection("games").get();

/////////////////////////////// Get Season ///////////////////////////////

const season = firestore
  .collection("new")
  .doc("new")
  .collection("seasons")
  .doc("Vr0ZvjAeahGoVh5p6OTp");

/////////////////////////////// Write new games ///////////////////////////////

games.docs.forEach(async (gameDoc) => {
  await firestore
    .collection("new")
    .doc("new")
    .collection("games")
    .add({
      ...gameDoc.data(),
      season: season,
    });
});
