import 'package:flutter/material.dart';
import '../screens/details_screen.dart';

class AnimeCard extends StatelessWidget {
  final Map<String, dynamic> anime;
  const AnimeCard({super.key, required this.anime});

  @override
  Widget build(BuildContext context) {
    final title = anime['title']['romaji'] ?? '';
    final cover = anime['coverImage']['large'] ?? '';
    final animeId = anime['id'] as int?;
    final mirrorCover = animeId != null ? 'https://img.anili.st/media/$animeId' : '';
    final colorHex = anime['coverImage']['color'] as String?;
    final accentColor = colorHex != null
        ? Color(int.parse(colorHex.replaceFirst('#', 'FF'), radix: 16))
        : const Color(0xFFe63946);
    final score = anime['averageScore'] as int? ?? 0;
    final genres = (anime['genres'] as List<dynamic>?)?.take(2).join(' · ') ?? '';

    Color scoreColor;
    if (score >= 80) {
      scoreColor = const Color(0xFF22c55e);
    } else if (score >= 65) {
      scoreColor = const Color(0xFFf59e0b);
    } else {
      scoreColor = const Color(0xFFe63946);
    }

    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => DetailsScreen(anime: anime)),
      ),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF1a1a22),
          borderRadius: BorderRadius.circular(14),
          border: Border(left: BorderSide(color: accentColor, width: 3)),
        ),
        clipBehavior: Clip.hardEdge,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                fit: StackFit.expand,
                children: [
                  cover.isNotEmpty
                      ? Image.network(
                          cover,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) {
                            if (mirrorCover.isNotEmpty) {
                              return Image.network(
                                mirrorCover,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => _ImageFallback(accentColor: accentColor),
                              );
                            }
                            return _ImageFallback(accentColor: accentColor);
                          },
                        )
                      : Container(color: const Color(0xFF2a2a35)),
                  if (score > 0)
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0f0f12).withValues(alpha: 0.85),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          score.toString(),
                          style: TextStyle(
                            color: scoreColor,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (genres.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        genres,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Color(0xFF888899),
                          fontSize: 11,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ImageFallback extends StatelessWidget {
  final Color accentColor;
  const _ImageFallback({required this.accentColor});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF2a2a35),
      child: Center(
        child: Icon(
          Icons.broken_image_outlined,
          color: accentColor.withValues(alpha: 0.85),
          size: 30,
        ),
      ),
    );
  }
}
