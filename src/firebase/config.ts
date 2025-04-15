// src/firebase/config.ts

// WAŻNE: Nigdy nie umieszczaj prawdziwych kluczy API bezpośrednio w kodzie
// w publicznym repozytorium! Użyj zmiennych środowiskowych.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Opcjonalne
};

// Upewnij się, że masz odpowiednie zmienne w pliku .env.local
// np. NEXT_PUBLIC_FIREBASE_API_KEY=twoj_klucz_api
