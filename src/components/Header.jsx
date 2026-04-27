import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Header.module.css';

function Header({ theme, onToggleTheme }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  function toggleMenu() {
    setIsMenuOpen((current) => !current);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function getNavLinkClass(isActive) {
    return `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;
  }

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
          className={({ isActive }) => getNavLinkClass(isActive)}
          onClick={closeMenu}
        >
          Início
        </NavLink>
        <NavLink
          to="/busca"
          className={({ isActive }) => getNavLinkClass(isActive)}
          onClick={closeMenu}
        >
          Busca
        </NavLink>
        <NavLink
          to="/tendencias"
          className={({ isActive }) => getNavLinkClass(isActive)}
          onClick={closeMenu}
        >
          Tendências
        </NavLink>
        <NavLink
          to="/temporadas"
          className={({ isActive }) => getNavLinkClass(isActive)}
          onClick={closeMenu}
        >
          Temporadas
        </NavLink>
        <NavLink
          to="/favoritos"
          className={({ isActive }) => getNavLinkClass(isActive)}
          onClick={closeMenu}
        >
          Favoritos
        </NavLink>
        <NavLink
          to="/download"
          className={({ isActive }) => getNavLinkClass(isActive)}
          onClick={closeMenu}
        >
          Download
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

        <button
          type="button"
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Fechar menu de navegacao' : 'Abrir menu de navegacao'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
        >
          <span className={styles.menuIcon} aria-hidden="true">{isMenuOpen ? '✕' : '☰'}</span>
          <span>{isMenuOpen ? 'Fechar' : 'Menu'}</span>
        </button>
      </div>

      <nav
        id="primary-navigation"
        className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}
      >
        <NavLink to="/" className={({ isActive }) => getNavLinkClass(isActive)} onClick={closeMenu}>Início</NavLink>
        <NavLink to="/busca" className={({ isActive }) => getNavLinkClass(isActive)} onClick={closeMenu}>Busca</NavLink>
        <NavLink to="/tendencias" className={({ isActive }) => getNavLinkClass(isActive)} onClick={closeMenu}>Tendências</NavLink>
        <NavLink to="/temporadas" className={({ isActive }) => getNavLinkClass(isActive)} onClick={closeMenu}>Temporadas</NavLink>
        <NavLink to="/favoritos" className={({ isActive }) => getNavLinkClass(isActive)} onClick={closeMenu}>Favoritos</NavLink>
        <NavLink to="/download" className={({ isActive }) => getNavLinkClass(isActive)} onClick={closeMenu}>Download</NavLink>
      </nav>
    </header>
  );
}

export default Header;