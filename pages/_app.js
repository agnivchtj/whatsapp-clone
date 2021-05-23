import { useEffect } from 'react';
import '../styles/globals.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase';
import { db, auth } from '../firebase';
import Login from '../components/Login';
import Loading from '../components/Loading';

const MyApp = ({ Component, pageProps }) => {
  const [user, loading] = useAuthState(auth);

  // User details are updated with every subsequent login
  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set({
        email: user.email, 
        lastActive: firebase.firestore.FieldValue.serverTimestamp(), 
        photoURL: user.photoURL
      }, { merge: true });

    }
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
