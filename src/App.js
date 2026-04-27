import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import Details from './pages/Details';
import Download from './pages/Download';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import Seasons from './pages/Seasons';
import Trends from './pages/Trends';
import styles from './styles/App.module.css';

const THEME_STORAGE_KEY = 'anidata:theme';

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  return (
    <AuthProvider>
      <div className={styles.appShell}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/busca" element={<Search />} />
            <Route path="/tendencias" element={<Trends />} />
            <Route path="/temporadas" element={<Seasons />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/download" element={<Download />} />
            <Route path="/anime/:id" element={<Details />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;