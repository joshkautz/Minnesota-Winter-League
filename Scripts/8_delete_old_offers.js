import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

initializeApp({
  credential: applicationDefault(),
  projectId: "minnesota-winter-league",
});

const firestore = getFirestore();

/////////////////////////////// Get Offers ///////////////////////////////

const offers = await firestore.collection("offers").get();

/////////////////////////////// Update ///////////////////////////////

offers.docs.forEach(async (offerDoc) => {
  await offerDoc.ref.delete();
});
