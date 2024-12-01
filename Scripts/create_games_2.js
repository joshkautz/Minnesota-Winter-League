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

const DarkKnights = await firestore
  .collection("teams")
  .doc("KNdbONsXNayHPq6uHhWp")
  .get();
const MaustonMousers = await firestore
  .collection("teams")
  .doc("kocAbvNvtF4J4z5GOl93")
  .get();
const BirdtownBallers = await firestore
  .collection("teams")
  .doc("UaOUQ6B2uBB4E6K5IcGE")
  .get();
const NOPE = await firestore
  .collection("teams")
  .doc("UYtKXok2YrFCnOVaPsMD")
  .get();
const SleepyHeads = await firestore
  .collection("teams")
  .doc("ozExVClE1sf8BNwotdIZ")
  .get();
const ToucanTappers = await firestore
  .collection("teams")
  .doc("3hp5J5ZJ5NilcAI07y57")
  .get();
const NortheastNeutrons = await firestore
  .collection("teams")
  .doc("GrNZCbOFMZ8bxgc1iaIb")
  .get();
const Seacows = await firestore
  .collection("teams")
  .doc("Zl4NPP4kQ0GaZyiqUjbj")
  .get();
const KlaneIsland = await firestore
  .collection("teams")
  .doc("rpmhoe8o4VDqA1xwqoqK")
  .get();
const Lemonade = await firestore
  .collection("teams")
  .doc("CsfadYYv1J1KvSj4SYd0")
  .get();
const Nipull = await firestore
  .collection("teams")
  .doc("SlSQZZyeRXzYeScoBHM2")
  .get();
const Surly = await firestore
  .collection("teams")
  .doc("nUZOOC7j8TJGCEV6aQIf")
  .get();

/////////////////////////////// Create Games: Week 6, Round 1 ///////////////////////////////

await firestore
  .collection("games")
  .add({
    home: NortheastNeutrons.ref,
    away: SleepyHeads.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 18:00:00 CST"))),
    field: 1,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: MaustonMousers.ref,
    away: ToucanTappers.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 18:00:00 CST"))),
    field: 2,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: Surly.ref,
    away: Lemonade.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 18:00:00 CST"))),
    field: 3,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

/////////////////////////////// Create Games: Week 6, Round 2 ///////////////////////////////

await firestore
  .collection("games")
  .add({
    home: NortheastNeutrons.ref,
    away: Seacows.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 18:45:00 CST"))),
    field: 1,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: Nipull.ref,
    away: BirdtownBallers.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 18:45:00 CST"))),
    field: 2,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: NOPE.ref,
    away: ToucanTappers.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 18:45:00 CST"))),
    field: 3,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

/////////////////////////////// Create Games: Week 6, Round 3 ///////////////////////////////

await firestore
  .collection("games")
  .add({
    home: SleepyHeads.ref,
    away: Seacows.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 19:30:00 CST"))),
    field: 1,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: Nipull.ref,
    away: DarkKnights.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 19:30:00 CST"))),
    field: 2,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: KlaneIsland.ref,
    away: Surly.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 19:30:00 CST"))),
    field: 3,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

/////////////////////////////// Create Games: Week 6, Round 4 ///////////////////////////////

await firestore
  .collection("games")
  .add({
    home: MaustonMousers.ref,
    away: NOPE.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 20:15:00 CST"))),
    field: 1,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: BirdtownBallers.ref,
    away: DarkKnights.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 20:15:00 CST"))),
    field: 2,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });

await firestore
  .collection("games")
  .add({
    home: KlaneIsland.ref,
    away: Lemonade.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse("7 Dec 2024 20:15:00 CST"))),
    field: 3,
    season: SEASON.ref,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });
