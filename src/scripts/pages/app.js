import routes from '../routes/routes.js';
import { getActiveRoute } from '../routes/url-parser.js';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      const isOpen = this.#navigationDrawer.classList.toggle('open');
      this.#drawerButton.setAttribute('aria-expanded', isOpen);
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.setAttribute('aria-expanded', 'false');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
          this.#drawerButton.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (!page) {
      console.warn(`Halaman untuk rute ${url} tidak ditemukan.`);

      this.#content.innerHTML = await routes['/'].render();
      await routes['/'].afterRender();
      return;
    }

    this.#content.innerHTML = await page.render();
    await page.afterRender();

    this.#content.focus();
  }
}

export default App;
