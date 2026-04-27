const FAVORITES_STORAGE_KEY = 'anidata:favorites';

function readFavoriteIds() {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed.filter((value) => Number.isInteger(value)) : [];
  } catch {
    return [];
  }
}

function writeFavoriteIds(ids) {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event('favorites-updated'));
}

export function getFavoriteAnimeIds() {
  return readFavoriteIds();
}

export function isFavoriteAnime(id) {
  return readFavoriteIds().includes(Number(id));
}

export function toggleFavoriteAnime(id) {
  const normalizedId = Number(id);
  const currentIds = readFavoriteIds();
  const nextIds = currentIds.includes(normalizedId)
    ? currentIds.filter((value) => value !== normalizedId)
    : [...currentIds, normalizedId];

  writeFavoriteIds(nextIds);
  return nextIds.includes(normalizedId);
}