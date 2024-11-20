import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Create Seasons ///////////////////////////////

const payment = await firestore
  .collection("customers")
  .doc("qFwTXL0saYbWF6kQnctJ9zWJXEg1")
  .collection("payments")
  .doc("pi_3Q56wrHMbQIHBzSi1abE8V87")
  .get();

console.log(payment.data().status);
