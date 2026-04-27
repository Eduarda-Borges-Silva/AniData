import { useEffect, useState } from 'react';
import AnimeCard from '../components/AnimeCard.js';
import { fetchPopularAnime } from '../services/api';
import styles from '../styles/Home.module.css';

function HomeSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={styles.skeletonCard} aria-hidden="true">
          <div className={styles.skeletonCover} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonLineShort} />
            <div className={styles.skeletonLineLarge} />
            <div className={styles.skeletonChips}>
              <span className={styles.skeletonChip} />
              <span className={styles.skeletonChip} />
            </div>
            <div className={styles.skeletonFooter}>
              <div className={styles.skeletonLineMedium} />
              <div className={styles.skeletonButton} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dashboardMetrics = [
    { label: 'Animes catalogados', value: '12.480' },
    { label: 'Gêneros disponíveis', value: '148' },
    { label: 'Avaliações registradas', value: '4.2M' },
    { label: 'Atualizado via API', value: 'Agora' },
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadPopularAnime() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchPopularAnime();

        if (isMounted) {
          setAnimeList(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Falha ao carregar animes populares.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPopularAnime();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>Descubra seu próximo favorito</p>
          <h1 className={styles.title}>O melhor do anime, curado e organizado para você.</h1>
          <p className={styles.description}>
            Explore títulos populares, tendências da temporada e monte sua lista pessoal de favoritos — tudo em um só lugar.
          </p>

          <div className={styles.heroActions}>
            <a href="#catalogo" className={styles.primaryAction}>
              Ver os mais populares
            </a>
            <span className={styles.secondaryNote}>Dados em tempo real via AniList</span>
          </div>
        </div>

        <aside className={styles.metricsPanel}>
          <div className={styles.metricsHeader}>
            <span className={styles.metricsLabel}>Em destaque hoje</span>
            <span className={styles.metricsStatus}>Ao vivo</span>
          </div>

          <div className={styles.metricsGrid}>
            {dashboardMetrics.map((metric) => (
              <div key={metric.label} className={styles.metricCard}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className={styles.sectionHeader} id="catalogo">
        <div>
          <p className={styles.sectionKicker}>Em alta agora</p>
          <h2 className={styles.sectionTitle}>Os 10 mais populares</h2>
        </div>
        <p className={styles.sectionText}>Score, gêneros e acesso rápido para cada título. Clique em qualquer card para ver mais detalhes.</p>
      </div>

      {loading && <HomeSkeleton />}
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

export default Home;