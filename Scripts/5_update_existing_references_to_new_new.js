import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Players ///////////////////////////////

const playersQuerySnapshot = await firestore
  .collection("new")
  .doc("new")
  .collection("players")
  .get();

/////////////////////////////// Get Teams ///////////////////////////////

const teamsQuerySnapshot = await firestore
  .collection("new")
  .doc("new")
  .collection("teams")
  .get();

/////////////////////////////// Update ///////////////////////////////

playersQuerySnapshot.forEach(async (playerDoc) => {
  const seasons = playerDoc.data().seasons;

  const team = seasons[0].team
    ? teamsQuerySnapshot.docs.find((team) => team.id == seasons[0].team.id)
    : null;

  // console.log(
  //   team
  //     ? `${playerDoc.data().firstname} ${playerDoc.data().lastname} - ${
  //         team.data().name
  //       }`
  //     : `${playerDoc.data().firstname} ${
  //         playerDoc.data().lastname
  //       } - Team not found`
  // );

  seasons[0].team = team ? team.ref : team;

  await playerDoc.ref.update({
    seasons: seasons,
  });
});
