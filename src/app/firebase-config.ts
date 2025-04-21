// src/app/firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment';

// Obtén la configuración de Firebase desde environment.ts
const firebaseConfig = environment.firebaseConfig;

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth y Firestore
export const auth = getAuth(app);
export const firestore = getFirestore(app);
