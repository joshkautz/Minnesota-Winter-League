import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Players ///////////////////////////////

const playerQuerySnapshot = await firestore.collection("players").get();

// const season = await firestore
//   .collection("seasons")
//   .doc("PBE6nY7rpCxufItsC7l0")
//   .get();

/////////////////////////////// Update ///////////////////////////////
playerQuerySnapshot.docs.forEach(async (playerDoc) => {
  if (
    playerDoc
      .data()
      .seasons.find(
        (playerSeason) =>
          playerSeason.season.id === "PBE6nY7rpCxufItsC7l0" &&
          playerSeason.paid === true &&
          playerSeason.team === null,
      )
  ) {
    const team = playerDoc
      .data()
      .seasons.find(
        (playerSeason) => playerSeason.season.id === "PBE6nY7rpCxufItsC7l0",
      ).team;

    const paid = playerDoc
      .data()
      .seasons.find(
        (playerSeason) => playerSeason.season.id === "PBE6nY7rpCxufItsC7l0",
      ).paid;

    const signed = playerDoc
      .data()
      .seasons.find(
        (playerSeason) => playerSeason.season.id === "PBE6nY7rpCxufItsC7l0",
      ).signed;

    console.log(
      playerDoc.id,
      playerDoc.data().email,
      playerDoc.data().firstname,
      playerDoc.data().lastname,
      paid,
      signed,
      team ? team.id : "No Team",
    );
  }
});
