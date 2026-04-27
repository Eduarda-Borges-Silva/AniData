import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/api_service.dart';
import '../services/favorites_service.dart';
import '../widgets/anime_card.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  List<Map<String, dynamic>> _animes = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) { setState(() => _loading = false); return; }
    try {
      final ids = await getFavoriteIds(user.uid);
      if (ids.isEmpty) {
        setState(() { _animes = []; _loading = false; });
        return;
      }
      final data = await fetchAnimeByIds(ids);
      if (mounted) setState(() { _animes = data; _loading = false; });
    } catch (e) {
      if (mounted) setState(() { _error = e.toString(); _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Favoritos'),
        actions: [
          if (user != null)
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: () {
                setState(() => _loading = true);
                _load();
              },
            ),
        ],
      ),
      body: user == null
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.favorite_border, size: 64, color: Color(0xFF3a3a50)),
                    const SizedBox(height: 16),
                    const Text(
                      'Seus favoritos, sincronizados.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Entre na sua conta para acessar seus favoritos em qualquer dispositivo.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Color(0xFF888899), fontSize: 14),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () => Navigator.pushNamed(context, '/login'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFe63946),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Entrar com Google'),
                    ),
                  ],
                ),
              ),
            )
          : _loading
              ? const Center(child: CircularProgressIndicator(color: Color(0xFFe63946)))
              : _error != null
                  ? Center(
                      child: Text(
                        'Erro: $_error',
                        style: const TextStyle(color: Color(0xFFe63946)),
                      ),
                    )
                  : _animes.isEmpty
                      ? const Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.favorite_border, size: 64, color: Color(0xFF3a3a50)),
                              SizedBox(height: 12),
                              Text(
                                'Nenhum favorito ainda',
                                style: TextStyle(color: Color(0xFF888899), fontSize: 16),
                              ),
                            ],
                          ),
                        )
                      : GridView.builder(
                          padding: const EdgeInsets.all(16),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                            childAspectRatio: 0.65,
                          ),
                          itemCount: _animes.length,
                          itemBuilder: (ctx, i) => AnimeCard(anime: _animes[i]),
                        ),
    );
  }
}
