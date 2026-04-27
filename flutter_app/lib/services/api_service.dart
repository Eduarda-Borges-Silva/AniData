import 'dart:convert';
import 'package:http/http.dart' as http;

const String _apiUrl = 'https://graphql.anilist.co';

Future<List<Map<String, dynamic>>> fetchPopularAnime({int page = 1}) async {
  const query = r'''
    query ($page: Int) {
      Page(page: $page, perPage: 18) {
        media(sort: POPULARITY_DESC, type: ANIME, status_not: NOT_YET_RELEASED) {
          id title { romaji english } coverImage { large color }
          averageScore popularity genres episodes status
          description(asHtml: false)
        }
      }
    }
  ''';
  return _request(query, {'page': page});
}

Future<List<Map<String, dynamic>>> searchAnime(String term, {String? genre, String? format}) async {
  const query = r'''
    query ($search: String, $genre: String, $format: MediaFormat) {
      Page(page: 1, perPage: 18) {
        media(search: $search, type: ANIME, genre: $genre, format: $format) {
          id title { romaji english } coverImage { large color }
          averageScore popularity genres episodes status
          description(asHtml: false)
        }
      }
    }
  ''';
  final vars = <String, dynamic>{'search': term};
  if (genre != null) vars['genre'] = genre;
  if (format != null) vars['format'] = format;
  return _request(query, vars);
}

Future<Map<String, dynamic>?> fetchAnimeById(int id) async {
  const query = r'''
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id title { romaji english native } coverImage { extraLarge color }
        bannerImage averageScore popularity genres episodes status
        description(asHtml: false) startDate { year month day }
        studios(isMain: true) { nodes { name } }
        characters(sort: ROLE, perPage: 6) {
          nodes { name { full } image { medium } }
        }
      }
    }
  ''';
  final list = await _request(query, {'id': id}, field: 'Media', isSingle: true);
  return list.isNotEmpty ? list.first : null;
}

Future<List<Map<String, dynamic>>> fetchAnimeByIds(List<int> ids) async {
  final futures = ids.map(fetchAnimeById);
  final results = await Future.wait(futures);
  return results.whereType<Map<String, dynamic>>().toList();
}

Future<List<Map<String, dynamic>>> _request(
  String query,
  Map<String, dynamic> variables, {
  String field = 'Page',
  bool isSingle = false,
}) async {
  final response = await http.post(
    Uri.parse(_apiUrl),
    headers: {'Content-Type': 'application/json'},
    body: json.encode({'query': query, 'variables': variables}),
  );
  if (response.statusCode != 200) throw Exception('Falha na API AniList');
  final data = json.decode(response.body) as Map<String, dynamic>;
  if (isSingle) {
    final media = data['data'][field] as Map<String, dynamic>?;
    return media != null ? [media] : [];
  }
  final media = data['data'][field]['media'] as List<dynamic>;
  return media.cast<Map<String, dynamic>>();
}
