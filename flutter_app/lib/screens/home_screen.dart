import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/api_service.dart';
import '../widgets/anime_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Map<String, dynamic>> _animes = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await fetchPopularAnime();
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
        title: const Text('AniData', style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFFe63946))),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => Navigator.pushNamed(context, '/busca'),
          ),
          IconButton(
            icon: const Icon(Icons.favorite_border),
            onPressed: () => Navigator.pushNamed(context, '/favoritos'),
          ),
          if (user != null)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: GestureDetector(
                onTap: () => _showUserMenu(context, user),
                child: CircleAvatar(
                  radius: 16,
                  backgroundImage: user.photoURL != null ? NetworkImage(user.photoURL!) : null,
                  backgroundColor: const Color(0xFFe63946),
                  child: user.photoURL == null
                      ? Text(
                          user.displayName?.substring(0, 1) ?? 'U',
                          style: const TextStyle(color: Colors.white, fontSize: 14),
                        )
                      : null,
                ),
              ),
            )
          else
            TextButton(
              onPressed: () => Navigator.pushNamed(context, '/login'),
              child: const Text('Entrar', style: TextStyle(color: Color(0xFFe63946))),
            ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHero(),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: Row(children: [
              Container(width: 3, height: 20, color: const Color(0xFFe63946)),
              const SizedBox(width: 10),
              const Text('Em alta agora', style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w800,
              )),
            ]),
          ),
          Expanded(child: _buildGrid()),
        ],
      ),
    );
  }

  Widget _buildHero() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1a1a22),
        borderRadius: BorderRadius.circular(16),
        border: const Border(left: BorderSide(color: Color(0xFFe63946), width: 4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF2a1020),
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: const Color(0xFFe63946).withOpacity(0.3)),
            ),
            child: const Text(
              'Descubra seu próximo favorito',
              style: TextStyle(color: Color(0xFFe63946), fontSize: 11, fontWeight: FontWeight.w700),
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'O melhor do anime, curado e organizado para você.',
            style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 8),
          const Text(
            'Dados em tempo real via AniList',
            style: TextStyle(color: Color(0xFF888899), fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildGrid() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFFe63946)));
    }
    if (_error != null) {
      return Center(child: Text('Erro: $_error', style: const TextStyle(color: Color(0xFFe63946))));
    }
    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.65,
      ),
      itemCount: _animes.length,
      itemBuilder: (ctx, i) => AnimeCard(anime: _animes[i]),
    );
  }

  void _showUserMenu(BuildContext context, User user) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1a1a22),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircleAvatar(
              radius: 30,
              backgroundImage: user.photoURL != null ? NetworkImage(user.photoURL!) : null,
              backgroundColor: const Color(0xFFe63946),
            ),
            const SizedBox(height: 12),
            Text(
              user.displayName ?? 'Usuário',
              style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
            ),
            Text(
              user.email ?? '',
              style: const TextStyle(color: Color(0xFF888899), fontSize: 13),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () async {
                  await FirebaseAuth.instance.signOut();
                  if (ctx.mounted) Navigator.pop(ctx);
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFFe63946),
                  side: const BorderSide(color: Color(0xFFe63946)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Sair'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
