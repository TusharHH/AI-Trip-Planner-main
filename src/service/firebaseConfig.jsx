// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB0sf8j8iuG-ZfF4cTnBZejN9a9ZYTRYc",
  authDomain: "earnest-dogfish-451717-i2.firebaseapp.com",
  projectId: "earnest-dogfish-451717-i2",
  storageBucket: "earnest-dogfish-451717-i2.firebasestorage.app",
  messagingSenderId: "866538912181",
  appId: "1:866538912181:web:f265d3467206ad57ab41fc"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);