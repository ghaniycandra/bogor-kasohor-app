import '../styles/styles.css';
import App from './pages/app.js';
import idbHelper from './data/db.js';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.querySelector('#main-content');

  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      mainContent.scrollIntoView({ behavior: 'smooth' });
      mainContent.focus();
    });
  }

  const perbaruiNavbar = () => {
    const token = localStorage.getItem('userToken');
    const navLogin = document.getElementById('nav-login');
    const navDaftar = document.getElementById('nav-daftar');
    const navLogout = document.getElementById('nav-logout');
    const navTambah = document.getElementById('nav-tambah');

    if (token) {
      if (navLogin) navLogin.style.display = 'none';
      if (navDaftar) navDaftar.style.display = 'none';

      if (navLogout) navLogout.style.display = '';
      if (navTambah) navTambah.style.display = '';
    } else {
      if (navLogin) navLogin.style.display = '';
      if (navDaftar) navDaftar.style.display = '';

      if (navLogout) navLogout.style.display = 'none';
      if (navTambah) navTambah.style.display = 'none';
    }
  };

  const btnKeluarGlobal = document.getElementById('btn-keluar-global');
  if (btnKeluarGlobal) {
    btnKeluarGlobal.addEventListener('click', async () => {
      const konfirmasi = confirm('Apakah Anda yakin ingin keluar dari aplikasi?');
      if (konfirmasi) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');

        try {
          await idbHelper.clearAllStories();
        } catch (error) {
          console.error('Gagal mengosongkan IndexedDB:', error);
        }

        perbaruiNavbar();
        window.location.hash = '#/login';
        window.location.reload();
      }
    });
  }

  const renderDenganAnimasi = async () => {
    perbaruiNavbar();

    if (!document.startViewTransition) {
      await app.renderPage();
      window.scrollTo(0, 0);
    } else {
      document.startViewTransition(async () => {
        await app.renderPage();
        window.scrollTo(0, 0);
      });
    }
  };

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = import.meta.env.BASE_URL + 'sw.js';  
      navigator.serviceWorker.register(swUrl)
        .then((registration) => {
          console.log('Service Worker berhasil didaftarkan:', registration.scope);
        })
        .catch((error) => {
          console.error('Pendaftaran Service Worker gagal:', error);
        });
    });
  }

  await renderDenganAnimasi();

  window.addEventListener('hashchange', async () => {
    await renderDenganAnimasi();
  });
});
