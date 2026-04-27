import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isFavorite, toggleFavorite } from '../services/firebaseFavorites';
import styles from '../styles/FavoriteButton.module.css';

function FavoriteButton({ animeId, onChange, compact = false }) {
  const { user } = useAuth();
  const [fav, setFav] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) { setFav(false); return; }
    isFavorite(user.uid, animeId).then(setFav);
  }, [user, animeId]);

  async function handleToggle() {
    if (!user || busy) return;
    setBusy(true);
    try {
      const next = await toggleFavorite(user.uid, animeId);
      setFav(next);
      onChange?.(next);
      window.dispatchEvent(new Event('favorites-updated'));
    } finally {
      setBusy(false);
    }
  }

  if (!user) return null;

  return (
    <button
      type="button"
      className={`${styles.button} ${compact ? styles.compact : ''} ${fav ? styles.active : ''}`}
      onClick={handleToggle}
      disabled={busy}
      aria-pressed={fav}
      aria-label={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      title={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
    >
      {compact ? (
        <span aria-hidden="true">{fav ? '♥' : '♡'}</span>
      ) : (
        fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'
      )}
    </button>
  );
}

export default FavoriteButton;