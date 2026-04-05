import { StoryApi } from '../../data/api.js';
import idbHelper from '../../data/db.js';

class BerandaView {
  showStories(stories, map) {
    const containerCerita = document.querySelector('#kumpulan-cerita');
    let semuaKartuHtml = '';

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        const deskripsiPendek =
          story.description.length > 50
            ? story.description.substring(0, 50) + '...'
            : story.description;

        marker.bindPopup(`
          <div style="text-align: center;">
            <img src="${story.photoUrl}" alt="Foto lokasi cerita dari ${story.name}" style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
            <b style="font-size: 1.1em; display: block;">${story.name}</b>
            <p style="margin: 4px 0;">${deskripsiPendek}</p>
          </div>
        `);
      }

      const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const idLokasiKhusus = `teks-lokasi-${story.id}`;
      let infoLokasiHtml = '';

      if (story.lat && story.lon) {
        infoLokasiHtml = `<p id="${idLokasiKhusus}" class="cerita-date cerita-loc">📍 Melacak lokasi satelit...</p>`;
      } else {
        infoLokasiHtml = `<p class="cerita-date cerita-loc">📍 Lokasi: Tidak disematkan</p>`;
      }

      semuaKartuHtml += `
        <div class="cerita-card" tabindex="0">
          <img src="${story.photoUrl}" alt="Gambar visual dari cerita yang dibagikan oleh ${story.name}" class="cerita-img">
          <div class="cerita-content">
            <p class="cerita-auth">👤 Diceritakan oleh: ${story.name}</p>
            <p class="cerita-date">📅 Pada tanggal: ${date}</p>
            ${infoLokasiHtml}
            <p class="cerita-desc"> ${story.description}</p>
            <button class="btn-save-story" id="btn-save-${story.id}">
              ⏳ Memeriksa status...
            </button>
          </div>
        </div>
      `;
    });

    containerCerita.innerHTML = semuaKartuHtml;

    this.terjemahkanDanModifikasiData(stories);

    this.initSaveButtons(stories);
  }

  async terjemahkanDanModifikasiData(stories) {
    for (const story of stories) {
      if (story.lat && story.lon) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${story.lat}&lon=${story.lon}`
          );
          const data = await response.json();

          const namaTempat =
            data.address.city ||
            data.address.town ||
            data.address.county ||
            data.address.village ||
            'Lokasi tidak diketahui';

          story.placeName = namaTempat;

          const elemenTeks = document.getElementById(`teks-lokasi-${story.id}`);
          if (elemenTeks) {
            elemenTeks.innerHTML = `📍 Lokasi: ${namaTempat}`;
          }
        } catch (error) {
          story.placeName = 'Gagal melacak satelit';
          const elemenTeks = document.getElementById(`teks-lokasi-${story.id}`);
          if (elemenTeks) {
            elemenTeks.innerHTML = `📍 Lokasi: ${parseFloat(story.lat).toFixed(3)}, ${parseFloat(story.lon).toFixed(3)}`;
          }
        }
      } else {
        story.placeName = 'Tidak ada lokasi';
      }

      console.log(`Mengintip data ${story.name}:`, story);
    }
  }

  async initSaveButtons(stories) {
    for (const story of stories) {
      const btnSave = document.querySelector(`#btn-save-${story.id}`);
      if (!btnSave) continue;

      const isSaved = await idbHelper.getStory(story.id);

      if (isSaved) {
        btnSave.innerHTML = '💔 Hapus dari Tersimpan';
        btnSave.classList.add('btn-saved');
        btnSave.classList.remove('btn-unsaved');
      } else {
        btnSave.innerHTML = '❤️ Simpan Cerita';
        btnSave.classList.add('btn-unsaved');
        btnSave.classList.remove('btn-saved');
      }

      btnSave.addEventListener('click', async () => {
        const checkSaved = await idbHelper.getStory(story.id);

        if (checkSaved) {
          await idbHelper.deleteStory(story.id);
          btnSave.innerHTML = '❤️ Simpan Cerita';
          btnSave.classList.add('btn-unsaved');
          btnSave.classList.remove('btn-saved');
          alert(`Cerita milik ${story.name} dihapus dari akunmu!`);
        } else {
          await idbHelper.putStory(story);
          btnSave.innerHTML = '💔 Hapus Cerita';
          btnSave.classList.add('btn-saved');
          btnSave.classList.remove('btn-unsaved');
          alert(`Cerita milik ${story.name} berhasil disimpan!`);
        }
      });
    }
  }

  showError(message) {
    document.querySelector('#kumpulan-cerita').innerHTML =
      `<p style="color: red; text-align: center; grid-column: 1/-1;">${message}</p>`;
  }
}

class BerandaPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  async loadStories(token, map) {
    try {
      const responseJson = await this._model.getAllStories(token);

      if (!responseJson.error) {
        this._view.showStories(responseJson.listStory, map);
      } else {
        alert('Sesi Anda telah berakhir. Silakan login kembali.');
        localStorage.removeItem('userToken');
        window.location.hash = '#/login';
        window.location.reload();
      }
    } catch (error) {
      console.error('Gagal memuat data dari API:', error);
      this._view.showError('Gagal memuat data cerita. Pastikan internet Anda stabil.');
    }
  }
}

export default class Beranda {
  async render() {
    return `
      <section class="container beranda-container">
        <h1 tabindex="0" class="deskripsi-web">Bogor Kasohor adalah medium berbagi cerita yang kamu temukan di Bogor.</h1>

        <div class="beranda-layout">
          <div class="map-column">
            <div id="map"></div>
          </div>

          <div class="sidebar-kolom">
            
            <div class="widget-box">
              <h2 tabindex="0" class="widget-title">Profil Akun</h2>
              <div id="profil-container">
                <div id="avatar-huruf" class="avatar-circle">?</div>
                <b id="profil-nama" class="profil-nama">Memuat...</b>
                <p id="profil-email" class="profil-email">...</p>
                
                <button type="button" id="btn-notif" class="btn-mono-sub btn-sidebar btn-sidebar-solid">🔔 Mengambil Status...</button>
                
                <a id="link-favorit" href="#/favorit" class="btn-mono-sub btn-sidebar btn-sidebar-solid">
                  ❤️ Lihat Cerita Favorit
                </a>
                
                <button type="button" id="btn-logout" class="btn-mono-main btn-sidebar btn-sidebar-solid">Keluar (Logout)</button>
              </div>
            </div>

            <div class="widget-box grow">
              <h2 tabindex="0" class="widget-title">Kabar Bogor</h2>
              <div class="article-list">
                <div>
                  <b class="judul-artikel">Pesona Kebun Raya</b>
                  <p class="artikel-teks">Jelajahi paru-paru kota yang menyimpan ribuan spesies tanaman langka peninggalan sejarah.</p>
                  <a href="javascript:void(0)" onclick="alert('Fitur artikel sedang dalam pengembangan!')" class="link-baca">Baca selengkapnya...</a>
                </div>
                <div>
                  <b class="judul-artikel">Surga Kuliner Suryakencana</b>
                  <p class="artikel-teks">Cicipi jajanan legendaris dari soto kuning, lumpia basah, hingga asinan asli Bogor.</p>
                  <a href="javascript:void(0)" onclick="alert('Fitur artikel sedang dalam pengembangan!')" class="link-baca">Baca selengkapnya...</a>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <h2 tabindex="0" class="widget-title section-title">Cerita Terbaru Warga</h2>
        
        <div id="kumpulan-cerita" class="cerita-grid">
          <p class="loading-text">Memuat cerita dari server...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    try {
      const token = localStorage.getItem('userToken');

      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      });
      const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '© OpenTopoMap',
      });

      const map = L.map('map', {
        center: [-6.597463242797301, 106.7995607513227],
        zoom: 10,
        layers: [osmLayer],
      });

      L.control.layers({ 'Peta Standar': osmLayer, 'Peta Topografi': topoLayer }).addTo(map);

      let clickPopup = L.popup();
      map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        clickPopup
          .setLatLng(e.latlng)
          .setContent(
            `
            <div style="text-align: center; padding: 5px;">
              <b style="color: #2d3e50; font-size: 1.1em;">Lokasi Dipilih</b>
              <p style="margin: 8px 0; font-size: 0.9em; color: #666;">Punya cerita menarik di titik ini?</p>
              <button onclick="bawaKoordinatDanPindah(${lat}, ${lon})" style="background-color: #4a637d; color: white; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85em; width: 100%; font-weight: bold; transition: 0.3s;">Tambah Cerita di Sini</button>
            </div>
          `
          )
          .openOn(map);
      });

      window.bawaKoordinatDanPindah = (lat, lon) => {
        const cekToken = localStorage.getItem('userToken');
        if (!cekToken) {
          alert('Silakan login terlebih dahulu untuk menambah cerita!');
          window.location.hash = '#/login';
          return;
        }
        localStorage.setItem('tempLat', lat);
        localStorage.setItem('tempLon', lon);
        window.location.hash = `#/tambah`;
      };

      if (!token) {
        document.querySelector('#profil-nama').textContent = 'Pengguna Tamu';
        document.querySelector('#profil-email').textContent = 'Silakan login untuk melihat cerita.';
        document.querySelector('#avatar-huruf').textContent = '?';
        document.querySelector('#avatar-huruf').style.backgroundColor = '#ccc';
        document.querySelector('#btn-notif').style.display = 'none';
        document.querySelector('#link-favorit').style.display = 'none';
        document.querySelector('#kumpulan-cerita').innerHTML =
          '<p style="text-align: center; width: 100%; grid-column: 1 / -1; color: #ff4d4d; font-weight: bold;">Anda harus masuk untuk melihat cerita warga.</p>';

        const btnLogout = document.querySelector('#btn-logout');
        if (btnLogout) {
          btnLogout.textContent = 'Masuk (Login)';
          btnLogout.addEventListener('click', () => (window.location.hash = '#/login'));
        }

        L.marker([-6.597463, 106.79956])
          .addTo(map)
          .bindPopup(
            '<b>Peta masih kosong! 🗺️</b><br><a href="#/login">Masuk</a> sekarang untuk berbagi cerita.'
          )
          .openPopup();
        return;
      }

      const namaPengguna = localStorage.getItem('userName') || 'Pengguna Tanpa Nama';
      const emailPengguna = localStorage.getItem('userEmail') || 'Email tidak diketahui';

      document.querySelector('#profil-nama').textContent = namaPengguna;
      document.querySelector('#profil-email').textContent = emailPengguna;
      const avatarContainer = document.querySelector('#avatar-huruf');
      if (avatarContainer) avatarContainer.textContent = namaPengguna.charAt(0).toUpperCase();

      const btnLogout = document.querySelector('#btn-logout');
      if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
          if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');

            try {
              await idbHelper.clearAllStories();
            } catch (error) {
              console.error('Gagal mengosongkan IndexedDB:', error);
            }
            window.location.hash = '#/login';
            window.location.reload();
          }
        });
      }

      const view = new BerandaView();
      const presenter = new BerandaPresenter({ view: view, model: StoryApi });
      await presenter.loadStories(token, map);

      const initPushNotification = async () => {
        const btnNotif = document.querySelector('#btn-notif');
        if (!btnNotif) return;

        const urlBase64ToUint8Array = (base64String) => {
          const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
          const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
          const rawData = window.atob(base64);
          const outputArray = new Uint8Array(rawData.length);
          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
          }
          return outputArray;
        };

        try {
          if ('serviceWorker' in navigator && 'PushManager' in window) {
            const registration = await navigator.serviceWorker.getRegistration();

            if (!registration) {
              btnNotif.textContent = 'SW Belum Terdaftar';
              btnNotif.disabled = true;
              console.warn('Service Worker belum terdaftar. Cek file index.js dan Webpack-mu.');
              return;
            }

            let subscription = await registration.pushManager.getSubscription();
            btnNotif.textContent = subscription
              ? '🔕 Matikan Notifikasi'
              : '🔔 Aktifkan Notifikasi';

            btnNotif.addEventListener('click', async () => {
              btnNotif.disabled = true;

              const token = localStorage.getItem('userToken');

              try {
                if (subscription) {
                  await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                  });

                  await subscription.unsubscribe();
                  subscription = null;

                  btnNotif.textContent = '🔔 Aktifkan Notifikasi';
                  alert('Notifikasi berhasil dimatikan.');
                } else {
                  const vapidPublicKey =
                    'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
                  const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

                  subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedKey,
                  });

                  const subData = subscription.toJSON();
                  const paketAman = {
                    endpoint: subData.endpoint,
                    keys: {
                      p256dh: subData.keys.p256dh,
                      auth: subData.keys.auth,
                    },
                  };

                  const response = await fetch(
                    'https://story-api.dicoding.dev/v1/notifications/subscribe',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify(paketAman),
                    }
                  );

                  const responseJson = await response.json();

                  if (!response.ok) {
                    console.error('Pesan dari server:', responseJson);
                    throw new Error('Gagal dari server: ' + responseJson.message);
                  }

                  btnNotif.textContent = '🔕 Matikan Notifikasi';
                  alert('Notifikasi berhasil. Anda akan menerima notifikasi jika ada cerita baru.');
                }
              } catch (error) {
                console.error('Gagal mengatur notifikasi:', error);
                alert('Akses notifikasi ditolak atau terjadi kesalahan jaringan.');
              }
              btnNotif.disabled = false;
            });
          } else {
            btnNotif.textContent = 'Notifikasi Tidak Didukung';
            btnNotif.disabled = true;
          }
        } catch (error) {
          console.error('Error mengecek status notifikasi:', error);
          btnNotif.textContent = 'Gagal Memuat Status';
          btnNotif.disabled = true;
        }
      };

      initPushNotification();
    } catch (error) {
      console.error('Ada yang salah dengan map/render awal:', error);
    }
  }
}
