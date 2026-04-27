const ANILIST_API_URL = 'https://graphql.anilist.co';

const mediaCardFields = `
  id
  averageScore
  genres
  popularity
  title {
    romaji
    english
    native
  }
  coverImage {
    large
    color
  }
`;

export const popularAnimeQuery = `
  query PopularAnime {
    Page(page: 1, perPage: 10) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        ${mediaCardFields}
      }
    }
  }
`;

export const trendingAnimeQuery = `
  query TrendingAnime {
    Page(page: 1, perPage: 10) {
      media(type: ANIME, sort: TRENDING_DESC) {
        ${mediaCardFields}
      }
    }
  }
`;

export const searchAnimeQuery = `
  query SearchAnime($search: String, $genres: [String], $format: MediaFormat, $sort: [MediaSort]) {
    Page(page: 1, perPage: 18) {
      pageInfo {
        total
      }
      media(type: ANIME, search: $search, genre_in: $genres, format: $format, sort: $sort) {
        ${mediaCardFields}
      }
    }
  }
`;

export const seasonAnimeQuery = `
  query SeasonAnime($season: MediaSeason, $seasonYear: Int) {
    Page(page: 1, perPage: 12) {
      media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC) {
        ${mediaCardFields}
      }
    }
  }
`;

export const animeByIdsQuery = `
  query AnimeByIds($ids: [Int]) {
    Page(page: 1, perPage: 20) {
      media(type: ANIME, id_in: $ids, sort: POPULARITY_DESC) {
        ${mediaCardFields}
      }
    }
  }
`;

export const animeDetailsQuery = `
  query AnimeDetails($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      description(asHtml: false)
      genres
      averageScore
      episodes
      coverImage {
        large
        extraLarge
        color
      }
    }
  }
`;

export async function fetchGraphQL(query, variables = {}) {
  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors) {
    const firstError = payload.errors?.[0]?.message;
    throw new Error(firstError || 'Erro ao consultar a API do AniList.');
  }

  return payload.data;
}

export async function fetchPopularAnime() {
  const data = await fetchGraphQL(popularAnimeQuery);
  return data.Page.media;
}

export async function fetchTrendingAnime() {
  const data = await fetchGraphQL(trendingAnimeQuery);
  return data.Page.media;
}

export async function searchAnime(search, { genres, format, sort } = {}) {
  const variables = {
    sort: sort || ['POPULARITY_DESC'],
  };
  if (search) variables.search = search;
  if (genres && genres.length > 0) variables.genres = genres;
  if (format) variables.format = format;
  const data = await fetchGraphQL(searchAnimeQuery, variables);
  return { media: data.Page.media, total: data.Page.pageInfo.total };
}

export async function fetchSeasonAnime(season, seasonYear) {
  const data = await fetchGraphQL(seasonAnimeQuery, { season, seasonYear });
  return data.Page.media;
}

export async function fetchAnimeByIds(ids) {
  const data = await fetchGraphQL(animeByIdsQuery, { ids: ids.map((id) => Number(id)) });
  return data.Page.media;
}

export async function fetchAnimeDetails(id) {
  const data = await fetchGraphQL(animeDetailsQuery, { id: Number(id) });
  return data.Media;
}