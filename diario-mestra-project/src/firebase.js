import { initializeApp }   from "firebase/app";
import { getAuth }         from "firebase/auth";
import { getFirestore }    from "firebase/firestore";
import { getStorage }      from "firebase/storage";
import { getDatabase }     from "firebase/database";

const firebaseConfig = {
  apiKey:            "AIzaSyDoiGpyo26lGOLoHNUypQoMMx4M1wzeUmE",
  authDomain:        "diariomestra.firebaseapp.com",
  projectId:         "diariomestra",
  storageBucket:     "diariomestra.appspot.com",
  messagingSenderId: "82975937066",
  appId:             "1:82975937066:web:f33626aafabb9cc21d6953"
};

const app       = initializeApp(firebaseConfig);
const auth      = getAuth(app);        // Firebase Auth
const db        = getFirestore(app);   // Cloud Firestore
const storage   = getStorage(app);     // Cloud Storage
const database  = getDatabase(app);    // Realtime Database

export { auth, db, storage, database };