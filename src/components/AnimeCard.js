import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import styles from '../styles/AnimeCard.module.css';

function formatPopularity(n) {
  if (!n) return null;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M listas`;
  if (n >= 1000) return `${Math.round(n / 1000)}K listas`;
  return `${n} listas`;
}

function scoreClass(score) {
  if (!score) return '';
  if (score >= 80) return styles.scoreHigh;
  if (score >= 65) return styles.scoreMid;
  return styles.scoreLow;
}

function AnimeCard({ anime }) {
  const title = anime.title.romaji || anime.title.english || anime.title.native;
  const subtitle =
    anime.title.english &&
    anime.title.english.toLowerCase() !== title.toLowerCase()
      ? anime.title.english
      : null;
  const genres = anime.genres?.slice(0, 3) || [];
  const accentColor = anime.coverImage?.color || 'var(--accent)';
  const pop = formatPopularity(anime.popularity);

  return (
    <article className={styles.card} style={{ '--card-accent': accentColor }}>
      <div className={styles.mediaWrap}>
        <img className={styles.cover} src={anime.coverImage.large} alt={`Capa de ${title}`} />
        <div className={styles.coverGradient} aria-hidden="true" />
        {anime.averageScore && (
          <span className={`${styles.scoreOverlay} ${scoreClass(anime.averageScore)}`}>
            ★ {anime.averageScore}
          </span>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        <div className={styles.genreList}>
          {genres.map((genre) => (
            <span key={genre} className={styles.genreChip}>
              {genre}
            </span>
          ))}
        </div>

        <div className={styles.cardFooter}>
          {pop && <span className={styles.popularity}>{pop}</span>}
          <div className={styles.actions}>
            <FavoriteButton animeId={anime.id} compact />
            <Link to={`/anime/${anime.id}`} className={styles.link}>
              Ver detalhes →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default AnimeCard;
