import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAS1jfmJ9wIvwBhI1oDmjlhzO9-QM9pKo0",
  authDomain: "streamingcanalrural.firebaseapp.com",
  projectId: "streamingcanalrural",
  storageBucket: "streamingcanalrural.appspot.com",
  messagingSenderId: "472598772582",
  appId: "1:472598772582:web:7284fe2f44c9cb8b8166a7",
  measurementId: "G-7PPP3TQ55H"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

const storage = getStorage(firebaseApp);

export { auth, db, storage};