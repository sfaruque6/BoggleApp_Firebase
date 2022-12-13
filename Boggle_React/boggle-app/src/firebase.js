// Import the functions you need from the SDKs you need

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQMLcSr-GdmCIP6i0ooWdSC2UO_lOkTHw",
  authDomain: "boggleapp2.firebaseapp.com",
  projectId: "boggleapp2",
  storageBucket: "boggleapp2.appspot.com",
  messagingSenderId: "363263393472",
  appId: "1:363263393472:web:119fa49d381215db54f725"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default firebase;