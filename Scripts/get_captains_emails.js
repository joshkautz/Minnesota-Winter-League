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
          playerSeason.captain === true &&
          playerSeason.team.id === "kocAbvNvtF4J4z5GOl93",
      )
  ) {
    console.log(
      playerDoc.data().email,
      playerDoc.data().firstname,
      playerDoc.data().lastname,
    );
  }
});
