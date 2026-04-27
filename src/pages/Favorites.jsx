import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard.js';
import { useAuth } from '../contexts/AuthContext';
import { fetchAnimeByIds } from '../services/api';
import { getFavoriteIds } from '../services/firebaseFavorites';
import styles from '../styles/CatalogPage.module.css';

function Favorites() {
  const { user } = useAuth();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let isMounted = true;

    async function loadFavorites() {
      try {
        setLoading(true);
        setError('');
        const ids = await getFavoriteIds(user.uid);

        if (ids.length === 0) {
          if (isMounted) setAnimeList([]);
          return;
        }

        const data = await fetchAnimeByIds(ids);
        if (isMounted) setAnimeList(data);
      } catch (requestError) {
        if (isMounted) setError(requestError.message || 'Falha ao carregar favoritos.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFavorites();

    window.addEventListener('favorites-updated', loadFavorites);
    return () => {
      isMounted = false;
      window.removeEventListener('favorites-updated', loadFavorites);
    };
  }, [user]);

  if (!user) {
    return (
      <section className={styles.page}>
        <div className={styles.hero}>
          <p className={styles.kicker}>Coleção pessoal</p>
          <h1 className={styles.title}>Entre para ver seus favoritos.</h1>
          <p className={styles.description}>
            Faça login com Google para salvar animes e acessá-los em qualquer dispositivo.
          </p>
          <Link to="/login" className={styles.primaryButton} style={{ display: 'inline-block', textAlign: 'center' }}>
            Fazer login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.kicker}>Coleção pessoal</p>
        <h1 className={styles.title}>Seus favoritos, sincronizados.</h1>
        <p className={styles.description}>
          Títulos salvos na sua conta — disponíveis em qualquer dispositivo.
        </p>
      </div>

      {loading && <p className={styles.feedback}>Carregando favoritos...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && animeList.length === 0 && (
        <p className={styles.feedback}>Você ainda não salvou nenhum anime nos favoritos.</p>
      )}

      {!loading && !error && animeList.length > 0 && (
        <div className={styles.grid}>
          {animeList.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;