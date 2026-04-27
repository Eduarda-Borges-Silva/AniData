import { useEffect, useState } from 'react';
import AnimeCard from '../components/AnimeCard.js';
import { fetchTrendingAnime } from '../services/api';
import styles from '../styles/CatalogPage.module.css';

function Trends() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTrendingAnime() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchTrendingAnime();

        if (isMounted) {
          setAnimeList(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Falha ao carregar tendências.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTrendingAnime();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.kicker}>Radar de crescimento</p>
        <h1 className={styles.title}>Os títulos com maior tração e engajamento no AniList agora.</h1>
        <p className={styles.description}>
          Esta visão destaca os animes que estão ganhando atenção rapidamente na plataforma.
        </p>
      </div>

      {loading && <p className={styles.feedback}>Carregando tendências...</p>}
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

export default Trends;