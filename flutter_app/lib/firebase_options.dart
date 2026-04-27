import 'package:firebase_core/firebase_core.dart';

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform => web;

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'COLE_AQUI',
    authDomain: 'COLE_AQUI',
    projectId: 'COLE_AQUI',
    storageBucket: 'COLE_AQUI',
    messagingSenderId: 'COLE_AQUI',
    appId: 'COLE_AQUI',
  );
}
