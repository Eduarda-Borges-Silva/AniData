import { useState } from 'react';
import AnimeCard from '../components/AnimeCard.js';
import { searchAnime } from '../services/api';
import styles from '../styles/CatalogPage.module.css';
import searchStyles from '../styles/Search.module.css';

const GENRE_CHIPS = ['Ação', 'Romance', 'Comédia', 'Fantasia', 'Terror', 'Mistério', 'Esportes', 'Sci-Fi', 'Drama', 'Slice of Life'];

const SORT_OPTIONS = [
  { label: 'Popularidade', value: 'POPULARITY_DESC' },
  { label: 'Melhor nota', value: 'SCORE_DESC' },
  { label: 'Em alta', value: 'TRENDING_DESC' },
];

const FORMAT_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Série (TV)', value: 'TV' },
  { label: 'Filme', value: 'MOVIE' },
  { label: 'OVA', value: 'OVA' },
  { label: 'ONA', value: 'ONA' },
];

function Search() {
  const [term, setTerm] = useState('');
  const [activeGenres, setActiveGenres] = useState([]);
  const [sort, setSort] = useState('POPULARITY_DESC');
  const [format, setFormat] = useState('');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  function toggleGenre(genre) {
    setActiveGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!term.trim() && activeGenres.length === 0) {
      setError('Digite um título ou selecione ao menos um gênero.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await searchAnime(term.trim() || undefined, {
        genres: activeGenres.length > 0 ? activeGenres : undefined,
        format: format || undefined,
        sort: [sort],
      });
      setResults(data.media);
      setTotal(data.total);
      setHasSearched(true);
    } catch (requestError) {
      setError(requestError.message || 'Falha ao buscar animes.');
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setTerm('');
    setActiveGenres([]);
    setSort('POPULARITY_DESC');
    setFormat('');
    setResults([]);
    setTotal(0);
    setHasSearched(false);
    setError('');
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.kicker}>Encontre seu próximo anime</p>
        <h1 className={styles.title}>Busque por título, gênero ou formato.</h1>
        <p className={styles.description}>
          Combine filtros para refinar os resultados e descobrir títulos que combinam com seu gosto.
        </p>

        <form className={searchStyles.searchForm} onSubmit={handleSubmit}>
          <div className={searchStyles.inputRow}>
            <input
              type="text"
              className={styles.input}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Ex.: Fullmetal Alchemist, Attack on Titan..."
            />
            <button type="submit" className={styles.primaryButton} disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
            {hasSearched && (
              <button type="button" className={searchStyles.clearButton} onClick={handleClear}>
                Limpar
              </button>
            )}
          </div>

          <div className={searchStyles.genreChips}>
            {GENRE_CHIPS.map((genre) => (
              <button
                key={genre}
                type="button"
                className={`${searchStyles.chip} ${activeGenres.includes(genre) ? searchStyles.chipActive : ''}`}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className={searchStyles.filterRow}>
            <label className={searchStyles.filterField}>
              <span className={searchStyles.filterLabel}>Ordenar por</span>
              <div className={searchStyles.selectWrap}>
                <select className={searchStyles.select} value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <span className={searchStyles.selectArrow} aria-hidden="true">▾</span>
              </div>
            </label>

            <label className={searchStyles.filterField}>
              <span className={searchStyles.filterLabel}>Formato</span>
              <div className={searchStyles.selectWrap}>
                <select className={searchStyles.select} value={format} onChange={(e) => setFormat(e.target.value)}>
                  {FORMAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <span className={searchStyles.selectArrow} aria-hidden="true">▾</span>
              </div>
            </label>
          </div>
        </form>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {!loading && hasSearched && (
        <div className={searchStyles.resultsHeader}>
          <p className={searchStyles.resultCount}>
            {results.length === 0
              ? 'Nenhum resultado encontrado'
              : `${results.length} resultado${results.length !== 1 ? 's' : ''}${total > results.length ? ` de ${total}` : ''}`}
          </p>
          {activeGenres.length > 0 && (
            <div className={searchStyles.activeFilters}>
              {activeGenres.map((g) => (
                <span key={g} className={searchStyles.activeFilterTag}>
                  {g}
                  <button type="button" onClick={() => toggleGenre(g)} aria-label={`Remover filtro ${g}`}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {loading && <p className={styles.feedback}>Buscando animes...</p>}

      {!loading && results.length > 0 && (
        <div className={styles.grid}>
          {results.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Search;
