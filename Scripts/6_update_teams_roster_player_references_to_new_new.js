import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Teams ///////////////////////////////

const teamsQuerySnapshot = await firestore
  .collection("new")
  .doc("new")
  .collection("teams")
  .get();

/////////////////////////////// Update ///////////////////////////////

teamsQuerySnapshot.forEach(async (teamDoc) => {
  const roster = teamDoc.data().roster.map((rosterElement) => {
    return {
      captain: rosterElement.captain,
      player: firestore
        .collection("new")
        .doc("new")
        .collection("players")
        .doc(rosterElement.player.id),
    };
  });

  // roster.forEach(async (rosterElement) => {
  //   console.log(rosterElement.captain);
  //   console.log(rosterElement.player.path);
  //   console.log("");
  // });

  await teamDoc.ref.update({
    roster: roster,
  });
});
