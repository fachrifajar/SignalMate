// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt2_nC3COS1Lglnp8WhkctJp8SUdHq3gY",
  authDomain: "signalmate-97ffc.firebaseapp.com",
  projectId: "signalmate-97ffc",
  storageBucket: "signalmate-97ffc.appspot.com",
  messagingSenderId: "204193941232",
  appId: "1:204193941232:web:517a96db20032e94296435",
  measurementId: "G-PB22PJC3B6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);