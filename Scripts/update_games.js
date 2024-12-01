import { TeamUpdateRequest } from "@dropbox/sign";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, Filter } from "firebase-admin/firestore";

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

const teams = {};
[
  DarkKnights,
  MaustonMousers,
  BirdtownBallers,
  NOPE,
  SleepyHeads,
  ToucanTappers,
  NortheastNeutrons,
  Seacows,
  KlaneIsland,
  Lemonade,
  Nipull,
  Surly,
].forEach((team) => {
  teams[team.id] = team.data();
});

/////////////////////////////// Update Games: Week 2, Round 1 ///////////////////////////////

await firestore
  .collection("games")
  .where("season", "==", SEASON.ref)
  .where("home", "==", MaustonMousers.ref)
  .where("away", "==", BirdtownBallers.ref)
  .where(
    "date",
    "==",
    Timestamp.fromDate(new Date(Date.parse("30 Nov 2024 18:00:00 CST"))),
  )
  .get()
  .then((querySnapshot) => {
    for (let index = 0; index < querySnapshot.size; index++) {
      if (index === 0) {
        querySnapshot.docs[index].ref
          .update({
            homeScore: 8,
            awayScore: 0,
          })
          .then(() => {
            console.log(
              "Document updated with ID: ",
              querySnapshot.docs[index].id,
            );
          });
      }
    }
  });
