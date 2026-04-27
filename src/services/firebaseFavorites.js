import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

function normalizeFavoritesError(error) {
  if (error && typeof error === 'object' && error.code === 'permission-denied') {
    return new Error('Sem permissao no Firestore. Verifique as regras de seguranca do projeto Firebase.');
  }
  return error;
}

function favoritesRef(userId) {
  if (!db) {
    throw new Error('Firestore não está disponível.');
  }
  return collection(db, 'users', userId, 'favorites');
}

export async function getFavoriteIds(userId) {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const snapshot = await getDocs(favoritesRef(userId));
    return snapshot.docs.map((d) => Number(d.id));
  } catch (error) {
    throw normalizeFavoritesError(error);
  }
}

export async function isFavorite(userId, animeId) {
  if (!isFirebaseConfigured || !db) return false;
  try {
    const ref = doc(db, 'users', userId, 'favorites', String(animeId));
    const snap = await getDoc(ref);
    return snap.exists();
  } catch (error) {
    throw normalizeFavoritesError(error);
  }
}

export async function addFavorite(userId, animeId) {
  if (!isFirebaseConfigured || !db) return;
  try {
    const ref = doc(db, 'users', userId, 'favorites', String(animeId));
    await setDoc(ref, { animeId, savedAt: Date.now() });
  } catch (error) {
    throw normalizeFavoritesError(error);
  }
}

export async function removeFavorite(userId, animeId) {
  if (!isFirebaseConfigured || !db) return;
  try {
    const ref = doc(db, 'users', userId, 'favorites', String(animeId));
    await deleteDoc(ref);
  } catch (error) {
    throw normalizeFavoritesError(error);
  }
}

export async function toggleFavorite(userId, animeId) {
  if (!isFirebaseConfigured || !db) return false;
  const fav = await isFavorite(userId, animeId);
  if (fav) {
    await removeFavorite(userId, animeId);
    return false;
  } else {
    await addFavorite(userId, animeId);
    return true;
  }
}
