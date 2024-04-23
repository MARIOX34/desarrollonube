import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB116YhHv2bZNFklREWQp3bGkHIcGv4rfk",
  authDomain: "apiweb19.firebaseapp.com",
  projectId: "apiweb19",
  storageBucket: "apiweb19.appspot.com",
  messagingSenderId: "806299186428",
  appId: "1:806299186428:web:3b6b9b6098234af8885379",
  measurementId: "G-3QLESPWPDV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const signInPopup = (provider) => signInWithPopup(auth, provider);

export const sendEmailToResetPassword = (email) => sendPasswordResetEmail(auth, email)
export const sendEmail = (user) => sendEmailVerification(user);
export const logOut = async () => signOut(auth);

export const signinEmailPassword = async (email, password) => signInWithEmailAndPassword(auth, email, password);


export const createUserEmailPassword = async (email, password) => createUserWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = async (email, password) => createUserWithEmailAndPassword(auth, email, password);

export const loginWithFacebook = async (email, password) =>createUserWithEmailAndPassword(auth, email, password);

export const onAuthChanged = (user) => onAuthStateChanged(auth, user);

export const deleteCurrentUser = async () => auth.currentUser.delete();
