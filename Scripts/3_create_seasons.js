import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Create Seasons ///////////////////////////////

const season = await firestore
  .collection("new")
  .doc("new")
  .collection("seasons")
  .doc("Vr0ZvjAeahGoVh5p6OTp")
  .get();

await firestore.collection("new").doc("new").collection("seasons").add({
  name: "2024 Fall",
  teams: [],
  dateStart: season.data().dateStart,
  dateEnd: season.data().dateEnd,
  registrationStart: season.data().registrationStart,
  registrationEnd: season.data().registrationEnd,
});
