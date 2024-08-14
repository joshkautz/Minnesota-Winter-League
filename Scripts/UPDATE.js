import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Games ///////////////////////////////

const gamesQuerySnapshot = await firestore.collection("games").get();

/////////////////////////////// Get Teams ///////////////////////////////

const teamsQuerySnapshot = await firestore.collection("teams").get();

/////////////////////////////// Get Players ///////////////////////////////

const playersQuerySnapshot = await firestore.collection("players").get();

/////////////////////////////// Get Seasons ///////////////////////////////

const seasonsQuerySnapshot = await firestore.collection("seasons").get();

/////////////////////////////// Update Games ///////////////////////////////

gamesQuerySnapshot.docs.forEach(async (gameDoc) => {
  await gameDoc.ref.update({
    away: firestore.collection("teams").doc(gameDoc.data().away.id),
    home: firestore.collection("teams").doc(gameDoc.data().home.id),
    season: firestore.collection("teams").doc(gameDoc.data().season.id),
  });
});

/////////////////////////////// Update Teams ///////////////////////////////

teamsQuerySnapshot.docs.forEach(async (teamDoc) => {
  const roster = teamDoc.data().roster.map((rosterElement) => {
    return {
      captain: rosterElement.captain,
      player: firestore.collection("players").doc(rosterElement.player.id),
    };
  });

  await teamDoc.ref.update({
    season: firestore.collection("seasons").doc(teamDoc.data().season.id),
    roster: roster,
  });
});

/////////////////////////////// Update Players ///////////////////////////////

playersQuerySnapshot.docs.forEach(async (playerDoc) => {
  await playerDoc.ref.update({
    seasons: [
      {
        captain: playerDoc.data().seasons[0].captain,
        paid: playerDoc.data().seasons[0].paid,
        season: firestore
          .collection("seasons")
          .doc(playerDoc.data().seasons[0].season.id),
        signed: playerDoc.data().seasons[0].signed,
        team: playerDoc.data().seasons[0].team
          ? firestore
              .collection("teams")
              .doc(playerDoc.data().seasons[0].team.id)
          : null,
      },
    ],
  });
});

/////////////////////////////// Update Seasons ///////////////////////////////

seasonsQuerySnapshot.docs.forEach(async (seasonDoc) => {
  await seasonDoc.ref.update({
    teams: seasonDoc
      .data()
      .teams.map((team) => firestore.collection("teams").doc(team.id)),
  });
});
