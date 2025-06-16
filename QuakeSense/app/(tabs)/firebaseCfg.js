// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNyZ45RV3A78eipPMNsy4oWK56Q3UuUSU",
  authDomain: "earthquake-detector-cloud.firebaseapp.com",
  databaseURL: "https://earthquake-detector-cloud-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "earthquake-detector-cloud",
  storageBucket: "earthquake-detector-cloud.firebasestorage.app",
  messagingSenderId: "802260198020",
  appId: "1:802260198020:web:9e1e89a3c6120ccd5018d1",
  measurementId: "G-78G0MT9G5J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { db };