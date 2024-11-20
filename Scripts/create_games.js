import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const firebaseConfig = {
  storageBucket: "minnesota-winter-league.appspot.com",
};

initializeApp(firebaseConfig);

const firestore = getFirestore();

const SEASON = await firestore
  .collection("seasons")
  .doc("PBE6nY7rpCxufItsC7l0")
  .get();

/////////////////////////////// Get Teams ///////////////////////////////

const ONE_Snapshot = await firestore
  .collection("teams")
  .doc("KNdbONsXNayHPq6uHhWp")
  .get();
const TWO_Snapshot = await firestore
  .collection("teams")
  .doc("kocAbvNvtF4J4z5GOl93")
  .get();
const THREE_Snapshot = await firestore
  .collection("teams")
  .doc("UaOUQ6B2uBB4E6K5IcGE")
  .get();
const FOUR_Snapshot = await firestore
  .collection("teams")
  .doc("UYtKXok2YrFCnOVaPsMD")
  .get();
const FIVE_Snapshot = await firestore
  .collection("teams")
  .doc("ozExVClE1sf8BNwotdIZ")
  .get();
const SIX_Snapshot = await firestore
  .collection("teams")
  .doc("3hp5J5ZJ5NilcAI07y57")
  .get();
const SEVEN_Snapshot = await firestore
  .collection("teams")
  .doc("GrNZCbOFMZ8bxgc1iaIb")
  .get();
const EIGHT_Snapshot = await firestore
  .collection("teams")
  .doc("Zl4NPP4kQ0GaZyiqUjbj")
  .get();
const NINE_Snapshot = await firestore
  .collection("teams")
  .doc("rpmhoe8o4VDqA1xwqoqK")
  .get();
const TEN_Snapshot = await firestore
  .collection("teams")
  .doc("CsfadYYv1J1KvSj4SYd0")
  .get();
const ELEVEN_Snapshot = await firestore
  .collection("teams")
  .doc("SlSQZZyeRXzYeScoBHM2")
  .get();
const TWELVE_Snapshot = await firestore
  .collection("teams")
  .doc("nUZOOC7j8TJGCEV6aQIf")
  .get();

/////////////////////////////// Create Games: Week 3, Round 1 ///////////////////////////////

await firestore
  .collection("games")
  .add({
    home: ONE_Snapshot.ref,
    away: SIX_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 18:00:00 CST"))),
    field: 1,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: TWO_Snapshot.ref,
    away: THREE_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 18:00:00 CST"))),
    field: 2,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: FOUR_Snapshot.ref,
    away: FIVE_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 18:00:00 CST"))),
    field: 3,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

/////////////////////////////// Create Games: Week 3, Round 2 ///////////////////////////////

await firestore
  .collection("games")
  .add({
    home: SIX_Snapshot.ref,
    away: TWELVE_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 18:45:00 CST"))),
    field: 1,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: EIGHT_Snapshot.ref,
    away: NINE_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 18:45:00 CST"))),
    field: 2,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: TEN_Snapshot.ref,
    away: ELEVEN_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 18:45:00 CST"))),
    field: 3,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

/////////////////////////////// Create Games: Week 3, Round 3 ///////////////////////////////

await firestore
  .collection("games")
  .add({
    home: ONE_Snapshot.ref,
    away: SEVEN_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 19:30:00 CST"))),
    field: 1,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: THREE_Snapshot.ref,
    away: FIVE_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 19:30:00 CST"))),
    field: 2,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: TWO_Snapshot.ref,
    away: FOUR_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 19:30:00 CST"))),
    field: 3,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

/////////////////////////////// Create Games: Week 3, Round 4 ///////////////////////////////

await firestore
  .collection("games")
  .add({
    home: SEVEN_Snapshot.ref,
    away: TWELVE_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 20:15:00 CST"))),
    field: 1,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: NINE_Snapshot.ref,
    away: ELEVEN_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 20:15:00 CST"))),
    field: 2,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: EIGHT_Snapshot.ref,
    away: TEN_Snapshot.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 20:15:00 CST"))),
    field: 3,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });
