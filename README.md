<h1>🥏 Minnesota Winter League</h1>

# Development 💻

To begin development on the App, open `./App/` in your IDE and run `npm run start` to begin local development.

To begin development on the Functions, open `./Functions/index.js` in your IDE and begin development. You will want to use `firebase emulators:start` to leverage Firebase Local Emulator Suite for debugging. It is suggested that you are developing with the most recent LTS version of Node (v18.x.x as of writing).

# Deploy App 📦
### Deploy App to Preview Channel
1. Create a Pull Request to merge a new feature branch into the Main branch.
2. Firebase Hosting GitHub Action will build and deploy the new changes to a Preview Channel on Firebase Hosting.
   
### Deploy App to Production
1. After testing the features at the Preview Channel URL, merge the Pull Request into the Main branch.
2. Firebase Hosting GitHub Action will build and deploy the new changes to the Live Channel on Firebase Hosting.

# Deploy Functions 📦
###  Deploy Functions to Production
1. Create a Pull Request to merge a new feature branch into the Main branch.
2. Merge the Pull Request into the Main branch.
3. Firebase Hosting GitHub Action will deploy the new changes to the production environment.
