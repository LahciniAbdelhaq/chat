 
import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyDjfJb_EgJaOa5Ur6_n76aXP3B1j7CByFE",
  authDomain: "my-chat-dfd16.firebaseapp.com",
  projectId: "my-chat-dfd16",
  storageBucket: "my-chat-dfd16.appspot.com",
  messagingSenderId: "965860676497",
  appId: "1:965860676497:web:cd15096df1d3ee2be3c030"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(); 