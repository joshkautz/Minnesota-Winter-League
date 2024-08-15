import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Players ///////////////////////////////

const playerQuerySnapshot = await firestore
  .collection("new")
  .doc("new")
  .collection("players")
  .get();

const season = await firestore
  .collection("new")
  .doc("new")
  .collection("seasons")
  .doc("Vr0ZvjAeahGoVh5p6OTp")
  .get();

/////////////////////////////// Update ///////////////////////////////

playerQuerySnapshot.forEach(async (playerDoc) => {
  const captain = playerDoc.data().seasons[0].captain;
  const team = playerDoc.data().seasons[0].team;
  const paid = playerDoc.data().seasons[0].paid;
  const signed = playerDoc.data().seasons[0].signed;
  await playerDoc.ref.update({
    seasons: [
      {
        season: season.ref,
        team: team,
        paid: paid,
        signed: signed,
        captain: captain,
      },
    ],
  });
});
