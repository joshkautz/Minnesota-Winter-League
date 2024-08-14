import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Games ///////////////////////////////

const gamesQuerySnapshot = await firestore
  .collection("new")
  .doc("new")
  .collection("games")
  .get();

/////////////////////////////// Get Teams ///////////////////////////////

const teamsQuerySnapshot = await firestore
  .collection("new")
  .doc("new")
  .collection("teams")
  .get();

/////////////////////////////// Get Players ///////////////////////////////

const playersQuerySnapshot = await firestore
  .collection("new")
  .doc("new")
  .collection("players")
  .get();

/////////////////////////////// Get Seasons ///////////////////////////////

const seasonsQuerySnapshot = await firestore
  .collection("new")
  .doc("new")
  .collection("seasons")
  .get();

/////////////////////////////// Write Games ///////////////////////////////

gamesQuerySnapshot.docs.forEach(async (gameDoc) => {
  await firestore.collection("games").doc(gameDoc.id).set(gameDoc.data());
});

/////////////////////////////// Write Teams ///////////////////////////////

teamsQuerySnapshot.docs.forEach(async (teamDoc) => {
  await firestore.collection("teams").doc(teamDoc.id).set(teamDoc.data());
});

/////////////////////////////// Write Players ///////////////////////////////

playersQuerySnapshot.docs.forEach(async (playerDoc) => {
  await firestore.collection("players").doc(playerDoc.id).set(playerDoc.data());
});

/////////////////////////////// Write Seasons ///////////////////////////////

seasonsQuerySnapshot.docs.forEach(async (seasonDoc) => {
  await firestore.collection("seasons").doc(seasonDoc.id).set(seasonDoc.data());
});
