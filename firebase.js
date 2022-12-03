import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCl1BRqEhNXaJggG6O2bbhiwWfMawNnDvI",
  authDomain: "computernetwork-9dfeb.firebaseapp.com",
  projectId: "computernetwork-9dfeb",
  storageBucket: "computernetwork-9dfeb.appspot.com",
  messagingSenderId: "734668976914",
  appId: "1:734668976914:web:e9118f695e0452129fb9cb"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

