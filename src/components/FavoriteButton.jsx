import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isFavorite, toggleFavorite } from '../services/firebaseFavorites';
import styles from '../styles/FavoriteButton.module.css';

function FavoriteButton({ animeId, onChange, compact = false }) {
  const { user } = useAuth();
  const [fav, setFav] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!user) { setFav(false); return; }
    setErrorMessage('');
    isFavorite(user.uid, animeId)
      .then(setFav)
      .catch((error) => {
        setFav(false);
        setErrorMessage(error?.message || 'Nao foi possivel verificar favorito.');
      });
  }, [user, animeId]);

  async function handleToggle() {
    if (!user || busy) return;
    setBusy(true);
    try {
      setErrorMessage('');
      const next = await toggleFavorite(user.uid, animeId);
      setFav(next);
      onChange?.(next);
      window.dispatchEvent(new Event('favorites-updated'));
    } catch (error) {
      setErrorMessage(error?.message || 'Nao foi possivel atualizar favorito.');
    } finally {
      setBusy(false);
    }
  }

  if (!user) return null;

  return (
    <>
      <button
        type="button"
        className={`${styles.button} ${compact ? styles.compact : ''} ${fav ? styles.active : ''}`}
        onClick={handleToggle}
        disabled={busy}
        aria-pressed={fav}
        aria-label={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        title={errorMessage || (fav ? 'Remover dos favoritos' : 'Salvar nos favoritos')}
      >
        {compact ? (
          <span aria-hidden="true">{fav ? '♥' : '♡'}</span>
        ) : (
          fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'
        )}
      </button>
      {errorMessage && <span style={{ display: 'none' }} aria-live="polite">{errorMessage}</span>}
    </>
  );
}

export default FavoriteButton;