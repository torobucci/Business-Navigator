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
    apiKey: "AIzaSyCijTDaAG_AXjtuoI-uCmHu0NUrzGzDcNY",
    authDomain: "business-navigator-414915.firebaseapp.com",
    databaseURL: "https://business-navigator-414915-default-rtdb.firebaseio.com",
    projectId: "business-navigator-414915",
    storageBucket: "business-navigator-414915.appspot.com",
    messagingSenderId: "385170174146",
    appId: "1:385170174146:web:2dd90612265fa1518fcb5b",
    measurementId: "G-0BHE08LWKK",
    databaseURL: "https://business-navigator-414915-default-rtdb.firebaseio.com/",
  };

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
const database = getDatabase(app);
const auth = getAuth(app)

const storage = getStorage();


export { database, firebaseConfig, auth, storage}
