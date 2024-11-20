import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const firebaseConfig = {
  storageBucket: "minnesota-winter-league.appspot.com",
};

initializeApp(firebaseConfig);

const firestore = getFirestore();

const Teams = {
  One: "teams/OS4oMGXE3yAHkbGTKK5W",
  Two: "teams/b3BM1rI4q2JuzLyPHh2K",
  Three: "teams/DTzWGB7fMbUVcL3iHT08",
  Four: "teams/2I7YXDF7RAXs3MCvLM0h",
  Five: "teams/67XqRkRUwClXW8VMbuYQ",
  Six: "teams/JFIJXG08u9bMEDnzsgFr",
  Seven: "teams/ifnI8V4AXxq28B0nWjJc",
  Eight: "teams/nw1HrX3dXZMecbbTSGsR",
  Nine: "teams/cK26PQEyfvmmWpegVQzq",
  Ten: "teams/Gv5elo2IVFTc3Ldv9AkO",
  Eleven: "teams/AE9qWaJmhxI300Gbbuye",
  Twelve: "teams/hJnBb3ALKZILxo0RNfYY",
};

/////////////////////////////// Create Games ///////////////////////////////

let date = new Date(Date.parse("9 Dec 2023 18:05:00 CST"));

await firestore.collection("games").add({
  home: firestore.doc(Teams.One),
  away: firestore.doc(Teams.Eight),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "1",
});

await new Promise((r) => setTimeout(r, 250));

await firestore.collection("games").add({
  home: firestore.doc(Teams.Four),
  away: firestore.doc(Teams.Eleven),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "2",
});

await new Promise((r) => setTimeout(r, 250));

await firestore.collection("games").add({
  home: firestore.doc(Teams.Seven),
  away: firestore.doc(Teams.Ten),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "3",
});

await new Promise((r) => setTimeout(r, 250));

date = new Date(Date.parse("9 Dec 2023 18:50:00 CST"));

await firestore.collection("games").add({
  home: firestore.doc(Teams.One),
  away: firestore.doc(Teams.Nine),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "1",
});

await new Promise((r) => setTimeout(r, 250));

await firestore.collection("games").add({
  home: firestore.doc(Teams.Two),
  away: firestore.doc(Teams.Five),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "2",
});

await new Promise((r) => setTimeout(r, 250));

await firestore.collection("games").add({
  home: firestore.doc(Teams.Six),
  away: firestore.doc(Teams.Eleven),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "3",
});

await new Promise((r) => setTimeout(r, 250));

date = new Date(Date.parse("9 Dec 2023 19:35:00 CST"));

await firestore.collection("games").add({
  home: firestore.doc(Teams.Eight),
  away: firestore.doc(Teams.Nine),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "1",
});

await new Promise((r) => setTimeout(r, 250));

await firestore.collection("games").add({
  home: firestore.doc(Teams.Two),
  away: firestore.doc(Teams.Twelve),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "2",
});

await new Promise((r) => setTimeout(r, 250));

await firestore.collection("games").add({
  home: firestore.doc(Teams.Three),
  away: firestore.doc(Teams.Seven),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "3",
});

await new Promise((r) => setTimeout(r, 250));

date = new Date(Date.parse("9 Dec 2023 20:20:00 CST"));

await firestore.collection("games").add({
  home: firestore.doc(Teams.Four),
  away: firestore.doc(Teams.Six),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "1",
});

await new Promise((r) => setTimeout(r, 250));

await firestore.collection("games").add({
  home: firestore.doc(Teams.Five),
  away: firestore.doc(Teams.Twelve),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "2",
});

await new Promise((r) => setTimeout(r, 250));

await firestore.collection("games").add({
  home: firestore.doc(Teams.Three),
  away: firestore.doc(Teams.Ten),
  homeScore: null,
  awayScore: null,
  date: Timestamp.fromDate(date),
  field: "3",
});

await new Promise((r) => setTimeout(r, 250));
