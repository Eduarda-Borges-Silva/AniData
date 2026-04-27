import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../widgets/anime_card.dart';

const _genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Thriller'];

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _controller = TextEditingController();
  List<Map<String, dynamic>> _results = [];
  bool _loading = false;
  bool _hasSearched = false;
  String? _selectedGenre;

  Future<void> _search() async {
    final term = _controller.text.trim();
    if (term.isEmpty && _selectedGenre == null) return;
    setState(() { _loading = true; _hasSearched = true; });
    try {
      final data = await searchAnime(term, genre: _selectedGenre);
      if (mounted) setState(() { _results = data; _loading = false; });
    } catch (e) {
      if (mounted) setState(() { _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Busca')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Buscar anime...',
                      hintStyle: const TextStyle(color: Color(0xFF888899)),
                      filled: true,
                      fillColor: const Color(0xFF1a1a22),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFF3a3a50)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFF3a3a50)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFFe63946)),
                      ),
                      prefixIcon: const Icon(Icons.search, color: Color(0xFF888899)),
                    ),
                    onSubmitted: (_) => _search(),
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  onPressed: _search,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFe63946),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  ),
                  child: const Text('Buscar'),
                ),
              ],
            ),
          ),
          SizedBox(
            height: 42,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                _GenreChip(
                  label: 'Todos',
                  selected: _selectedGenre == null,
                  onTap: () => setState(() => _selectedGenre = null),
                ),
                ..._genres.map((g) => _GenreChip(
                  label: g,
                  selected: _selectedGenre == g,
                  onTap: () => setState(() => _selectedGenre = _selectedGenre == g ? null : g),
                )),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator(color: Color(0xFFe63946)))
                : !_hasSearched
                    ? const Center(
                        child: Text(
                          'Digite algo para buscar',
                          style: TextStyle(color: Color(0xFF888899)),
                        ),
                      )
                    : _results.isEmpty
                        ? const Center(
                            child: Text(
                              'Nenhum resultado encontrado',
                              style: TextStyle(color: Color(0xFF888899)),
                            ),
                          )
                        : GridView.builder(
                            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 12,
                              mainAxisSpacing: 12,
                              childAspectRatio: 0.65,
                            ),
                            itemCount: _results.length,
                            itemBuilder: (ctx, i) => AnimeCard(anime: _results[i]),
                          ),
          ),
        ],
      ),
    );
  }
}

class _GenreChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;
  const _GenreChip({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFF2a1020) : const Color(0xFF1a1a22),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? const Color(0xFFe63946) : const Color(0xFF3a3a50),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? const Color(0xFFe63946) : const Color(0xFF888899),
            fontSize: 13,
            fontWeight: selected ? FontWeight.w700 : FontWeight.w400,
          ),
        ),
      ),
    );
  }
}
