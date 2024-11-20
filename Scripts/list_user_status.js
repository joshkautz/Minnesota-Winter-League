import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

const payment = await firestore
  .collection("customers")
  .doc("qFwTXL0saYbWF6kQnctJ9zWJXEg1")
  .collection("payments")
  .doc("pi_3Q56wrHMbQIHBzSi1abE8V87")
  .get();

console.log(payment.data().status);

// Function to list all users and check their email verification status
try {
  const listUsersResult = await getAuth().listUsers();
  listUsersResult.users.forEach((userRecord) => {
    console.log(
      `User: ${userRecord.email}, Email Verified: ${userRecord.emailVerified}`,
    );
  });
} catch (error) {
  console.error("Error listing users:", error);
}
