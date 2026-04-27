import { useEffect, useState } from 'react';
import AnimeCard from '../components/AnimeCard.js';
import { fetchSeasonAnime } from '../services/api';
import styles from '../styles/CatalogPage.module.css';

const seasonOptions = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month <= 1 || month === 11) return 'WINTER';
  if (month <= 4) return 'SPRING';
  if (month <= 7) return 'SUMMER';
  return 'FALL';
}

function Seasons() {
  const currentYear = new Date().getFullYear();
  const [season, setSeason] = useState(getCurrentSeason());
  const [seasonYear, setSeasonYear] = useState(currentYear);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSeasonAnime() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchSeasonAnime(season, Number(seasonYear));

        if (isMounted) {
          setAnimeList(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Falha ao carregar a temporada.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSeasonAnime();

    return () => {
      isMounted = false;
    };
  }, [season, seasonYear]);

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.kicker}>Leitura sazonal</p>
        <h1 className={styles.title}>Explore o catálogo por temporada e ano de lançamento.</h1>
        <p className={styles.description}>
          Altere a estação para navegar pelos animes mais populares de cada ciclo anual.
        </p>

        <div className={styles.filters}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Temporada</span>
            <select className={styles.select} value={season} onChange={(event) => setSeason(event.target.value)}>
              {seasonOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Ano</span>
            <input
              type="number"
              className={styles.input}
              value={seasonYear}
              onChange={(event) => setSeasonYear(event.target.value)}
              min="1980"
              max={currentYear + 1}
            />
          </label>
        </div>
      </div>

      {loading && <p className={styles.feedback}>Carregando temporada...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      {!loading && !error && (
        <div className={styles.grid}>
          {animeList.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Seasons;