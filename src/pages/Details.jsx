import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import { fetchAnimeDetails } from '../services/api';
import styles from '../styles/Details.module.css';

function stripHtml(value) {
  return value ? value.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"') : 'Descrição indisponível.';
}

function DetailsSkeleton() {
  return (
    <div className={styles.skeletonPanel} aria-hidden="true">
      <div className={styles.skeletonCover} />
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonLineShort} />
        <div className={styles.skeletonLineTitle} />
        <div className={styles.skeletonLineBody} />
        <div className={styles.skeletonLineBody} />
        <div className={styles.skeletonStats}>
          <span className={styles.skeletonStat} />
          <span className={styles.skeletonStat} />
          <span className={styles.skeletonStat} />
        </div>
      </div>
    </div>
  );
}

function Details() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAnimeDetails() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchAnimeDetails(id);

        if (isMounted) {
          setAnime(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Falha ao carregar detalhes do anime.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAnimeDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const accentColor = anime?.coverImage?.color || 'var(--accent)';

  return (
    <section className={styles.page}>
      <Link to="/" className={styles.backLink}>
        Voltar para a Home
      </Link>

      {loading && <DetailsSkeleton />}
      {error && <p className={styles.error}>Error: {error}</p>}

      {!loading && !error && anime && (
        <article className={styles.panel} style={{ '--detail-accent': accentColor }}>
          <div className={styles.coverFrame}>
            <span className={styles.coverBadge}>Registro #{anime.id}</span>
            <img
              className={styles.cover}
              src={anime.coverImage.extraLarge || anime.coverImage.large}
              alt={`Capa de ${anime.title.romaji || anime.title.english || anime.title.native}`}
            />
          </div>

          <div className={styles.content}>
            <p className={styles.kicker}>Registro detalhado</p>
            <h1 className={styles.title}>
              {anime.title.romaji || anime.title.english || anime.title.native}
            </h1>

            <div className={styles.leadStats}>
              <div className={styles.scoreSpotlight}>
                <span className={styles.scoreLabel}>Score médio</span>
                <strong className={styles.scoreValue}>{anime.averageScore ?? 'N/A'}</strong>
              </div>
              <div className={styles.episodeSpotlight}>
                <span className={styles.scoreLabel}>Episódios</span>
                <strong className={styles.scoreValue}>{anime.episodes ?? 'N/A'}</strong>
              </div>
            </div>

            <div className={styles.favoriteRow}>
              <FavoriteButton animeId={anime.id} />
            </div>

            <div className={styles.genreList}>
              {anime.genres?.map((genre) => (
                <span key={genre} className={styles.genreChip}>
                  {genre}
                </span>
              ))}
            </div>

            <p className={styles.description}>{stripHtml(anime.description)}</p>

            <div className={styles.stats}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Pontuação média</span>
                <strong>{anime.averageScore ?? 'N/A'}</strong>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Episódios</span>
                <strong>{anime.episodes ?? 'N/A'}</strong>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Gêneros</span>
                <strong>{anime.genres?.length || 'N/A'} indexados</strong>
              </div>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}

export default Details;