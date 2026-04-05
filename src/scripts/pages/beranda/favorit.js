import idbHelper from '../../data/db.js';

export default class Favorit {
  async render() {
    return `
      <section class="favorit-container">
        <h2 tabindex="0" class="favorit-title"> Cerita Favorit </h2>
        
        <div id="cerita-favorit" class="cerita-grid">
          <p class="favorit-message-box favorit-message-text" style="padding: 10px;">
            Mengambil data dari memori perangkat...
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const containerFavorit = document.querySelector('#cerita-favorit');

    try {
      const savedStories = await idbHelper.getAllStories();

      if (!savedStories || savedStories.length === 0) {
        containerFavorit.innerHTML = `
          <div class="favorit-message-box">
            <h3 class="favorit-message-title">Belum ada cerita yang disimpan.</h3>
            <p class="favorit-message-text">Yuk, kembali ke Beranda dan simpan cerita menarik yang kamu temukan!</p>
            <a href="/#/" class="btn-mono-main btn-back-home">Ke Beranda</a>
          </div>
        `;
        return;
      }

      let semuaKartuHtml = '';

      savedStories.forEach((story) => {
        const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        let infoLokasiHtml = '';
        if (story.lat && story.lon) {
          const latPendek = parseFloat(story.lat).toFixed(3);
          const lonPendek = parseFloat(story.lon).toFixed(3);
          infoLokasiHtml = `<p class="cerita-date cerita-loc">📍 Lokasi: ${latPendek}, ${lonPendek}</p>`;
        } else {
          infoLokasiHtml = `<p class="cerita-date cerita-loc">📍 Lokasi: Tidak disematkan</p>`;
        }

        semuaKartuHtml += `
          <div class="cerita-card" id="card-saved-${story.id}" tabindex="0">
            <img src="${story.photoUrl}" alt="Gambar visual dari cerita yang dibagikan oleh ${story.name}" class="cerita-img">
            <div class="cerita-content">
              <p class="cerita-auth">👤 Diceritakan oleh: ${story.name}</p>
              <p class="cerita-date">📅 Pada tanggal: ${date}</p>
              ${infoLokasiHtml}
              <p class="cerita-desc"> ${story.description}</p>
              
              <button class="btn-save-story btn-saved" id="btn-hapus-${story.id}">
                💔 Hapus Cerita
              </button>
            </div>
          </div>
        `;
      });

      containerFavorit.innerHTML = semuaKartuHtml;

      savedStories.forEach((story) => {
        const btnHapus = document.querySelector(`#btn-hapus-${story.id}`);
        if (btnHapus) {
          btnHapus.addEventListener('click', async () => {
            await idbHelper.deleteStory(story.id);
            const cardElement = document.querySelector(`#card-saved-${story.id}`);
            if (cardElement) cardElement.remove();
            alert(`Cerita milik ${story.name} berhasil dihapus dari favorit!`);

            if (containerFavorit.children.length === 0) {
              containerFavorit.innerHTML =
                '<p class="favorit-message-box favorit-message-text">Belum ada cerita yang disimpan.</p>';
            }
          });
        }
      });
    } catch (error) {
      console.error('Error di halaman Favorit:', error);
      containerFavorit.innerHTML = `
        <div class="favorit-error-box">
          <h3>Aduh, ada yang error! 🐛</h3>
          <p>Pesan Error: <b>${error.message}</b></p>
          <p>Silakan cek tab Console (F12) untuk detailnya.</p>
        </div>
      `;
    }
  }
}
