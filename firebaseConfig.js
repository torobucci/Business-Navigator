import {initializeApp} from 'firebase/app';
import {getDatabase} from "firebase/database";
import { getAuth } from 'firebase/auth';
import { getStorage} from "firebase/storage";


// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {

  apiKey: "AIzaSyCDWFnHOqMgUw01dTxDZJ346AVL3Mvq15U",

  authDomain: "business-navigator-306bf.firebaseapp.com",

  databaseURL: "https://business-navigator-306bf-default-rtdb.firebaseio.com",

  projectId: "business-navigator-306bf",

  storageBucket: "business-navigator-306bf.appspot.com",

  messagingSenderId: "986145763338",

  appId: "1:986145763338:web:84768d47e36c579580eff3"

};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
const database = getDatabase(app);
const auth = getAuth(app)

const storage = getStorage();


export { database, firebaseConfig, auth, storage}
