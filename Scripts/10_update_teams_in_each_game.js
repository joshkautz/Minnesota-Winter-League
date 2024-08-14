import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Games ///////////////////////////////

const games = await firestore
  .collection("new")
  .doc("new")
  .collection("games")
  .get();

/////////////////////////////// Get Teams ///////////////////////////////

const season = await firestore
  .collection("new")
  .doc("new")
  .collection("teams")
  .get();

/////////////////////////////// Write new games ///////////////////////////////

games.docs.forEach(async (gameDoc) => {
  console.log({
    game: gameDoc.id,
    away: gameDoc.data().away.id,
    home: gameDoc.data().home.id,
  });

  await gameDoc.ref.update({
    away: firestore
      .collection("new")
      .doc("new")
      .collection("teams")
      .doc(gameDoc.data().away.id),
    home: firestore
      .collection("new")
      .doc("new")
      .collection("teams")
      .doc(gameDoc.data().home.id),
  });
});
