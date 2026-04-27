import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = carregando, null = não logado

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });
    return unsubscribe;
  }, []);

  async function loginWithGoogle() {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      throw new Error('Firebase não configurado. Preencha as variáveis VITE_FIREBASE_* para ativar o login.');
    }
    await signInWithPopup(auth, googleProvider);
  }

  async function logout() {
    if (!isFirebaseConfigured || !auth) return;
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
