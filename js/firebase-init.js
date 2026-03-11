import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCVZjFSvGMZ5v5ao7f6orIHDFPmweaaWVw",
  authDomain: "community-care-4be6a.firebaseapp.com",
  projectId: "community-care-4be6a",
  storageBucket: "community-care-4be6a.firebasestorage.app",
  messagingSenderId: "908684288564",
  appId: "1:908684288564:web:91e7a4021c8472741a2061",
  measurementId: "G-LNPK94FCGL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
