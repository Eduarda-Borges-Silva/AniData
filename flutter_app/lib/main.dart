import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/search_screen.dart';
import 'screens/details_screen.dart';
import 'screens/favorites_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const AniDataApp());
}

class AniDataApp extends StatelessWidget {
  const AniDataApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AniData',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0f0f12),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFe63946),
          secondary: Color(0xFFe63946),
          surface: Color(0xFF1a1a22),
        ),
        fontFamily: 'sans-serif',
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF14141a),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        cardTheme: const CardThemeData(
          color: Color(0xFF1a1a22),
          elevation: 0,
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (ctx) => const HomeScreen(),
        '/login': (ctx) => const LoginScreen(),
        '/busca': (ctx) => const SearchScreen(),
        '/favoritos': (ctx) => const FavoritesScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/anime') {
          final anime = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (ctx) => DetailsScreen(anime: anime),
          );
        }
        return null;
      },
    );
  }
}
