import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Header.module.css';

function Header({ theme, onToggleTheme }) {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.brandWrap}>
        <Link to="/" className={styles.brandMark} aria-label="Ir para a página inicial do AniData">
          AD
        </Link>
        <div className={styles.brandText}>
          <span className={styles.badge}>Anime Intelligence Node</span>
          <Link to="/" className={styles.brandLink}>
            AniData
          </Link>
        </div>
      </div>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
        >
          Início
        </NavLink>
        <NavLink
          to="/busca"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
        >
          Busca
        </NavLink>
        <NavLink
          to="/tendencias"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
        >
          Tendências
        </NavLink>
        <NavLink
          to="/temporadas"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
        >
          Temporadas
        </NavLink>
        <NavLink
          to="/favoritos"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
        >
          Favoritos
        </NavLink>
      </nav>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={onToggleTheme}
          aria-label={`Ativar ${theme === 'light' ? 'tema escuro' : 'tema claro'}`}
        >
          <span className={styles.themeIcon} aria-hidden="true">{theme === 'light' ? '☀' : '◑'}</span>
          <span className={styles.themeToggleValue}>{theme === 'light' ? 'Light' : 'Dark'}</span>
        </button>

        {user ? (
          <div className={styles.userArea}>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Avatar'}
                className={styles.avatar}
                referrerPolicy="no-referrer"
              />
            )}
            <button type="button" className={styles.logoutButton} onClick={logout}>
              Sair
            </button>
          </div>
        ) : (
          <Link to="/login" className={styles.loginButton}>
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;