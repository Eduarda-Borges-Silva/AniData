import 'package:cloud_firestore/cloud_firestore.dart';

final _db = FirebaseFirestore.instance;

CollectionReference<Map<String, dynamic>> _favRef(String uid) =>
    _db.collection('users').doc(uid).collection('favorites');

Future<List<int>> getFavoriteIds(String uid) async {
  final snap = await _favRef(uid).get();
  return snap.docs.map((d) => d['animeId'] as int).toList();
}

Future<bool> isFavorite(String uid, int animeId) async {
  final doc = await _favRef(uid).doc(animeId.toString()).get();
  return doc.exists;
}

Future<void> addFavorite(String uid, int animeId) async {
  await _favRef(uid).doc(animeId.toString()).set({
    'animeId': animeId,
    'savedAt': DateTime.now().millisecondsSinceEpoch,
  });
}

Future<void> removeFavorite(String uid, int animeId) async {
  await _favRef(uid).doc(animeId.toString()).delete();
}

Future<void> toggleFavorite(String uid, int animeId) async {
  if (await isFavorite(uid, animeId)) {
    await removeFavorite(uid, animeId);
  } else {
    await addFavorite(uid, animeId);
  }
}
