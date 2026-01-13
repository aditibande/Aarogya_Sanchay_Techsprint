import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "phone-auth-659dc.firebaseapp.com",
  projectId: "phone-auth-659dc",
  storageBucket: "phone-auth-659dc.firebasestorage.app",
  messagingSenderId: "767622854009",
  appId: "1:767622854009:web:ad811bd5a428016077eba8",
  measurementId: "G-DKQS4NRT8D"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };