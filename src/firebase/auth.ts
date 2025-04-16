import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  
  RecaptchaVerifier,
  Auth,
} from 'firebase/auth';


import { firebaseConfig } from './config';

const isBrowser = typeof window !== 'undefined';

let app;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

if (isBrowser) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

export const signUp = async (email: string, password: string) => {
  if (!isBrowser) {
    throw new Error(
      'Auth operations are only supported in browser environment'
    );
  }
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email: string, password: string) => {
  if (!isBrowser) {
    throw new Error(
      'Auth operations are only supported in browser environment'
    );
  }
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  if (!isBrowser) {
    throw new Error(
      'Auth operations are only supported in browser environment'
    );
  }
  return signInWithPopup(auth, googleProvider);
};

export const setupRecaptcha = (containerOrId: string | HTMLElement) => {
  if (!isBrowser) {
    throw new Error(
      'Auth operations are only supported in browser environment'
    );
  }
  return new RecaptchaVerifier(auth, containerOrId, {
    size: 'invisible',
    callback: () => {},
  });
};



export const logOut = async () => {
  if (!isBrowser) {
    throw new Error(
      'Auth operations are only supported in browser environment'
    );
  }

  document.cookie =
    'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
  return signOut(auth);
};

export const getCurrentUser = () => {
  if (!isBrowser) {
    return null;
  }
  return auth.currentUser;
};

export { auth, onAuthStateChanged };
