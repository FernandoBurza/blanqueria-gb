import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  // Importar Firestore
import { environment } from '../environments/environment';

// Inicializa la app de Firebase
export const firebaseApp = initializeApp(environment.firebaseConfig);

// Exporta el servicio de autenticación de Firebase (modular)
export const firebaseAuth = getAuth(firebaseApp);

// Inicializa y exporta Firestore
export const firebaseFirestore = getFirestore(firebaseApp);  // Inicializar Firestore
