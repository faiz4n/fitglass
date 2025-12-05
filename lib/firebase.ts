import { initializeApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC_Js_ml1vTzbdhcEuB4VYZwPlPE1gGdWI",
  authDomain: "fitglass-faizan.firebaseapp.com",
  projectId: "fitglass-faizan",
  storageBucket: "fitglass-faizan.firebasestorage.app",
  messagingSenderId: "1062590182708",
  appId: "1:1062590182708:web:16a9058355821ac029a161",
  measurementId: "G-CBYRD66C64",
}

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
