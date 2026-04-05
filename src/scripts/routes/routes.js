import Beranda from '../pages/beranda/beranda.js';
import Favorit from '../pages/beranda/favorit.js';
import TambahCerita from '../pages/tambah-cerita/tambah-cerita.js';
import Login from '../pages/login/login.js';
import Daftar from '../pages/daftar/daftar.js';

const routes = {
  '/': new Beranda(),
  '/favorit': new Favorit(),
  '/tambah': new TambahCerita(),
  '/login': new Login(),
  '/daftar': new Daftar(),
};

export default routes;
