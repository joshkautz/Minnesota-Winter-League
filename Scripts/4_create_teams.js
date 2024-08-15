import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Teams ///////////////////////////////

const teansQuerySnapshot = await firestore
  .collection("new")
  .doc("new")
  .collection("teams")
  .get();

/////////////////////////////// Get Season ///////////////////////////////

const season23Snapshot = await firestore
  .collection("new")
  .doc("new")
  .collection("seasons")
  .doc("Vr0ZvjAeahGoVh5p6OTp")
  .get();

/////////////////////////////// Update ///////////////////////////////

teansQuerySnapshot.forEach(async (teamDoc) => {
  console.log(`${teamDoc.data().name}`);
  /////////////////////////////// Get Players ///////////////////////////////

  const captainIds = teamDoc.data().captains.map((captain) => captain.id);

  const roster = teamDoc.data().roster.map((player) => {
    return {
      player: player,
      captain: captainIds.includes(player.id) ? true : false,
    };
  });

  await teamDoc.ref.update({
    captains: FieldValue.delete(),
    teamId: uuidv4(),
    placement: 1,
    season: season23Snapshot.ref,
    roster: roster,
  });
});
