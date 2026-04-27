import styles from '../styles/Download.module.css';

const APK_URL = 'https://github.com/Eduarda-Borges-Silva/AniData/releases/latest';
const WEB_URL = 'https://anidata-web.netlify.app';
const REPO_URL = 'https://github.com/Eduarda-Borges-Silva/AniData';

function Download() {
  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>App Mobile</p>
        <h1 className={styles.title}>Baixe o AniData no seu celular.</h1>
        <p className={styles.description}>
          Faça o download da versão Android em APK e acompanhe seus animes favoritos com login e sincronização via Firebase.
        </p>

        <div className={styles.actions}>
          <a href={APK_URL} target="_blank" rel="noreferrer" className={styles.primaryButton}>
            Baixar APK
          </a>
          <a href={WEB_URL} target="_blank" rel="noreferrer" className={styles.secondaryButton}>
            Abrir versão web
          </a>
        </div>
      </header>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Como instalar no Android</h2>
          <ol className={styles.steps}>
            <li>Toque em Baixar APK para abrir os releases no GitHub.</li>
            <li>Baixe o arquivo mais recente do AniData.</li>
            <li>Ative Instalar apps desconhecidos quando o Android solicitar.</li>
            <li>Abra o arquivo APK e conclua a instalação.</li>
          </ol>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Informacoes importantes</h2>
          <ul className={styles.notes}>
            <li>Versao atualizada em cada novo release no GitHub.</li>
            <li>Login com Google para sincronizar favoritos.</li>
            <li>Fonte de dados em tempo real via AniList API.</li>
          </ul>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className={styles.repoLink}>
            Ver codigo fonte no GitHub
          </a>
        </article>
      </div>
    </section>
  );
}

export default Download;
