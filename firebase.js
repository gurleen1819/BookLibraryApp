import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOomIl1PtZl5jSSUROLWkbOM5Jt_J9B1E",
  authDomain: "booklibraryapp-744bf.firebaseapp.com",
  projectId: "booklibraryapp-744bf",
  storageBucket: "booklibraryapp-744bf.firebasestorage.app",
  messagingSenderId: "333851728290",
  appId: "1:333851728290:web:67e50050933defdea5bafb",
  measurementId: "G-MXEK4JQ5SE"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
