// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2lo0Yg48VPtDQO5vPI6b27BkDN2bOy8E",
  authDomain: "gamecollection-2f0a0.firebaseapp.com",
  projectId: "gamecollection-2f0a0",
  storageBucket: "gamecollection-2f0a0.appspot.com",
  messagingSenderId: "505885853131",
  appId: "1:505885853131:web:4ac1a5a9edefc92ad3e24e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);