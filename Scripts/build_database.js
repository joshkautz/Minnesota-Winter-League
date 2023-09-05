import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage, getDownloadURL } from "firebase-admin/storage";
import random_name from "node-random-name";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

const firebaseConfig = {
  storageBucket: "minnesota-winter-league.appspot.com",
};

initializeApp(firebaseConfig);

const firestore = getFirestore();
const storage = getStorage();
const bucket = storage.bucket();

/////////////////////////////// Create Players ///////////////////////////////

for (let players = 0; players < 500; players++) {
    const firstname = random_name({
        seed: process.hrtime().join("").toString(),
        first: true,
    });
    const lastname = random_name({
        seed: process.hrtime().join("").toString(),
        last: true,
    });

    await firestore.collection("players").add({
        captain: false,
        email: `${firstname.toLowerCase()}.${lastname.toLowerCase()}@mplsmallard.com`,
        firstname: firstname,
        lastname: lastname,
        registered: false,
        team: null,
    });

    await new Promise((r) => setTimeout(r, 500));
} 

/////////////////////////////// Create Teams ///////////////////////////////

const players = [];
const playersSnapshot = await firestore.collection("players").get();
playersSnapshot.forEach((doc) => {
    players.push(doc);
});

const claimedPlayers = [];
const claimedCaptains = [];

const getCaptain = () => {
    const captain = players[Math.floor(Math.random() * players.length)];
    if (claimedCaptains.includes(captain.id) || claimedPlayers.includes(captain.id))
        return getCaptain();
    claimedPlayers.push(captain.id);
    claimedCaptains.push(captain.id);
    return captain;
};
  
const getPlayer = () => {
    const player = players[Math.floor(Math.random() * players.length)];
    if (claimedCaptains.includes(player.id) || claimedPlayers.includes(player.id))
        return getPlayer();
    claimedPlayers.push(player.id);
    return player;
};
  
for (let teams = 1; teams <= 12; teams++) {
    const playerRefs = [];
    const captainRefs = [];

    // Select 1-3 random players to be captains of the team.
    for (
        let captains = 0;
        captains < Math.floor(Math.random() * 3) + 1;
        captains++
    ) {
        const captain = getCaptain();
        playerRefs.push(captain.ref);
        captainRefs.push(captain.ref);
    }
  
    // Select 10-15 random players to be players on the team.
    for (
        let players = 0;
        players < Math.floor(Math.random() * 6) + 10;
        players++
    ) {
        const player = getPlayer();
        playerRefs.push(player.ref);
    }
  
    await firestore.collection("teams").add({
        captains: captainRefs,
        roster: playerRefs,
        logo: (await getDownloadURL(bucket.file(`${teams}.svg`))).split("&")[0],
        name: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            separator: " ",
            style: "capital",
        }),
        registered: false,
    });
  
    await new Promise((r) => setTimeout(r, 500));
  }

/////////////////////////////// Update Players ///////////////////////////////

const teams = [];
const teamsSnapshot = await firestore.collection("teams").get();
teamsSnapshot.forEach((doc) => {
    teams.push(doc);
});

for (let i = 0; i < teams.length; i++) {
    // Update each player that is a captain to be a captain.
    for (let j = 0; j < teams[i].data().captains.length; j++) {
        await teams[i].data().captains[j].update({
            captain: true,
        });
  
        await new Promise((r) => setTimeout(r, 500));
    }
  
    // Update each player on the roster to have a team reference.
    for (let j = 0; j < teams[i].data().roster.length; j++) {
        await teams[i].data().roster[j].update({
            team: teams[i].ref,
        });
  
        await new Promise((r) => setTimeout(r, 500));
    }
}