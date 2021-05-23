import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDMzUEmW9yEntOvkKRKcJbK7NNrVit4-a4",
    authDomain: "whatsapp-clone-402ae.firebaseapp.com",
    projectId: "whatsapp-clone-402ae",
    storageBucket: "whatsapp-clone-402ae.appspot.com",
    messagingSenderId: "460186320448",
    appId: "1:460186320448:web:b450242a24e70a4708e9a5"
};

// Ensure we do not initialize app twice
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };