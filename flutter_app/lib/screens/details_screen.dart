import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/favorites_service.dart';

class DetailsScreen extends StatefulWidget {
  final Map<String, dynamic> anime;
  const DetailsScreen({super.key, required this.anime});

  @override
  State<DetailsScreen> createState() => _DetailsScreenState();
}

class _DetailsScreenState extends State<DetailsScreen> {
  bool _isFavorite = false;
  bool _favLoading = true;

  @override
  void initState() {
    super.initState();
    _checkFavorite();
  }

  Future<void> _checkFavorite() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) { setState(() => _favLoading = false); return; }
    final result = await isFavorite(user.uid, widget.anime['id'] as int);
    if (mounted) setState(() { _isFavorite = result; _favLoading = false; });
  }

  Future<void> _toggleFavorite() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) { Navigator.pushNamed(context, '/login'); return; }
    await toggleFavorite(user.uid, widget.anime['id'] as int);
    setState(() => _isFavorite = !_isFavorite);
  }

  @override
  Widget build(BuildContext context) {
    final anime = widget.anime;
    final title = anime['title']['romaji'] ?? '';
    final cover = (anime['coverImage']['extraLarge'] ?? anime['coverImage']['large'] ?? '') as String;
    final score = anime['averageScore'] as int? ?? 0;
    final desc = (anime['description'] as String? ?? '').replaceAll(RegExp(r'<[^>]*>'), '');
    final genres = (anime['genres'] as List<dynamic>?)?.cast<String>() ?? [];
    final episodes = anime['episodes'];
    final status = anime['status'] as String? ?? '';
    final colorHex = anime['coverImage']['color'] as String?;
    final accentColor = colorHex != null
        ? Color(int.parse(colorHex.replaceFirst('#', 'FF'), radix: 16))
        : const Color(0xFFe63946);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  if (cover.isNotEmpty)
                    Image.network(cover, fit: BoxFit.cover)
                  else
                    Container(color: const Color(0xFF1a1a22)),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          const Color(0xFF0f0f12).withValues(alpha: 0.9),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              if (!_favLoading)
                IconButton(
                  icon: Icon(
                    _isFavorite ? Icons.favorite : Icons.favorite_border,
                    color: _isFavorite ? const Color(0xFFe63946) : Colors.white,
                  ),
                  onPressed: _toggleFavorite,
                  tooltip: _isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos',
                ),
            ],
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    if (score > 0) ...[
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: accentColor.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: accentColor.withValues(alpha: 0.4)),
                        ),
                        child: Text(
                          '★ $score',
                          style: TextStyle(
                            color: accentColor,
                            fontWeight: FontWeight.w800,
                            fontSize: 16,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                    ],
                    if (episodes != null) ...[
                      _Stat(label: 'Episódios', value: episodes.toString()),
                      const SizedBox(width: 12),
                    ],
                    _Stat(label: 'Status', value: _statusPt(status)),
                  ]),
                  const SizedBox(height: 20),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: genres
                        .map((g) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: const Color(0xFF1a1a22),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: const Color(0xFF3a3a50)),
                              ),
                              child: Text(
                                g,
                                style: const TextStyle(color: Color(0xFF888899), fontSize: 12),
                              ),
                            ))
                        .toList(),
                  ),
                  if (desc.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    const Text('Sinopse', style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    )),
                    const SizedBox(height: 8),
                    Text(desc, style: const TextStyle(
                      color: Color(0xFF888899),
                      fontSize: 14,
                      height: 1.6,
                    )),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _statusPt(String status) {
    switch (status) {
      case 'FINISHED': return 'Finalizado';
      case 'RELEASING': return 'Em exibição';
      case 'NOT_YET_RELEASED': return 'Em breve';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  }
}

class _Stat extends StatelessWidget {
  final String label;
  final String value;
  const _Stat({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFF888899), fontSize: 11)),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700)),
      ],
    );
  }
}
