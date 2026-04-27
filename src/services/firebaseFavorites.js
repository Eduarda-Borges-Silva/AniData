import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

function favoritesRef(userId) {
  return collection(db, 'users', userId, 'favorites');
}

export async function getFavoriteIds(userId) {
  const snapshot = await getDocs(favoritesRef(userId));
  return snapshot.docs.map((d) => Number(d.id));
}

export async function isFavorite(userId, animeId) {
  const ref = doc(db, 'users', userId, 'favorites', String(animeId));
  const snap = await getDoc(ref);
  return snap.exists();
}

export async function addFavorite(userId, animeId) {
  const ref = doc(db, 'users', userId, 'favorites', String(animeId));
  await setDoc(ref, { animeId, savedAt: Date.now() });
}

export async function removeFavorite(userId, animeId) {
  const ref = doc(db, 'users', userId, 'favorites', String(animeId));
  await deleteDoc(ref);
}

export async function toggleFavorite(userId, animeId) {
  const fav = await isFavorite(userId, animeId);
  if (fav) {
    await removeFavorite(userId, animeId);
    return false;
  } else {
    await addFavorite(userId, animeId);
    return true;
  }
}
