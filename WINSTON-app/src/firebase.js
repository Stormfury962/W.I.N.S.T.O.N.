// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_g7IoK2K7TfDrf4DcUvo_BVck9eEIuKs",
  authDomain: "winston-71bf1.firebaseapp.com",
  projectId: "winston-71bf1",
  storageBucket: "winston-71bf1.firebasestorage.app",
  messagingSenderId: "968750654234",
  appId: "1:968750654234:web:0c4535452391d5422c42a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 


//Detect auth state
onAuthStateChanged(auth, user => {
    if (user != null) {
        console.log('Logged In')
    } else{
        console.log('No User')
    }
});

