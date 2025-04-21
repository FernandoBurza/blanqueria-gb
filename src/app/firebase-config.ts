import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';

// Obtén la configuración de Firebase desde environment.ts
const firebaseConfig = environment.firebaseConfig;

// Inicializa Firebase
export const firebaseApp = initializeApp(firebaseConfig);  // Esto inicializa Firebase