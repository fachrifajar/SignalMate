// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   storageBucket: process.env.storageBucket,
//   messagingSenderId: process.env.messagingSenderId,
//   appId: process.env.appId,
//   measurementId: process.env.measurementId,
//   databaseURL: process.env.databaseURL,
// };
const firebaseConfig = {
  apiKey: "AIzaSyAt2_nC3COS1Lglnp8WhkctJp8SUdHq3gY",
  authDomain: "signalmate-97ffc.firebaseapp.com",
  databaseURL:
    "https://signalmate-97ffc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "signalmate-97ffc",
  storageBucket: "signalmate-97ffc.appspot.com",
  messagingSenderId: "204193941232",
  appId: "1:204193941232:web:517a96db20032e94296435",
  measurementId: "G-PB22PJC3B6",
  databaseURL:
    "https://signalmate-97ffc-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
