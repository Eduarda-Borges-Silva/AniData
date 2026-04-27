import { Link } from 'react-router-dom';
import styles from '../styles/Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.brandCol}>
        <p className={styles.brand}>AniData</p>
        <p className={styles.text}>Catálogo acadêmico em React com rotas dinâmicas e consumo da API GraphQL do AniList.</p>
        <p className={styles.copy}>© {new Date().getFullYear()} Projeto acadêmico</p>
      </div>

      <nav className={styles.navCol} aria-label="Rodapé">
        <p className={styles.colLabel}>Navegação</p>
        <Link to="/" className={styles.navItem}>Início</Link>
        <Link to="/busca" className={styles.navItem}>Busca</Link>
        <Link to="/tendencias" className={styles.navItem}>Tendências</Link>
        <Link to="/temporadas" className={styles.navItem}>Temporadas</Link>
        <Link to="/favoritos" className={styles.navItem}>Favoritos</Link>
      </nav>

      <div className={styles.metaBlock}>
        <p className={styles.colLabel}>Fonte de dados</p>
        <a href="https://docs.anilist.co/" target="_blank" rel="noreferrer" className={styles.link}>
          AniList GraphQL API
        </a>
        <p className={styles.metaNote}>Free · Open · Realtime</p>
      </div>
    </footer>
  );
}

export default Footer;