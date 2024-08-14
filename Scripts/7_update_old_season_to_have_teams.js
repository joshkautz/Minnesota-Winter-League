import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Season ///////////////////////////////

const season = await firestore
  .collection("new")
  .doc("new")
  .collection("seasons")
  .doc("Vr0ZvjAeahGoVh5p6OTp")
  .get();

/////////////////////////////// Get Teams ///////////////////////////////

const teamsQuerySnapshot = await firestore
  .collection("new")
  .doc("new")
  .collection("teams")
  .get();

/////////////////////////////// Update ///////////////////////////////

const teams = teamsQuerySnapshot.docs.map((teamDoc) => teamDoc.ref);

await season.ref.update({
  teams: teams,
});
