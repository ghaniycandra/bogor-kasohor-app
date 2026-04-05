export default class TambahCerita {
  async render() {
    return `
      <section class="container" style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 tabindex="0" class="page-title" style="text-align: center; margin-bottom: 30px;">Tambah Cerita Bogor-mu</h1>
        
        <form id="form-tambah" style="padding: 10px 0;">
          
         <div style="display: flex; flex-direction: column; margin-bottom: 25px;">
            <label for="deskripsi" class="form-label" style="font-size: 1.1em; margin-bottom: 10px; color: #2d3e50; font-weight: bold; cursor: pointer;">Ceritakan Ceritamu</label>
            <textarea id="deskripsi" rows="4" required placeholder="Ceritakan pengalaman serumu di sini..." class="form-control" style="resize: vertical;"></textarea>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 tabindex="0" style="font-size: 1.1em; margin-bottom: 12px; color: #2d3e50;">Foto Lokasimu</h2>
            
            <div class="camera-wrapper" style="display: flex; justify-content: center; align-items: center; background: #1a1a1a; border-radius: 8px; overflow: hidden; margin-bottom: 15px; min-height: 250px; width: 100%;">
              <video id="kamera-preview" autoplay playsinline style="width: 100%; max-width: 100%; object-fit: cover;"></video>
              <canvas id="kamera-canvas" style="display: none; width: 100%; max-width: 100%; object-fit: cover;"></canvas>
            </div>

            <div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap;">
              <button type="button" id="btn-jepret" class="btn-mono-sub" style="padding: 10px 18px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Ambil Foto</button>
              <span class="divider-text">atau</span>
              
              <input type="file" id="input-foto" accept="image/*" style="display: none;">
              <label for="input-foto" tabindex="0" class="btn-mono-sub" style="padding: 10px 18px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; display: inline-block;">Unggah Galeri</label>
            </div>
          </div>

          <hr style="border: 0; border-top: 1px solid #ddd; margin: 25px 0;">

          <div style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
              <h2 tabindex="0" style="font-size: 1.1em; margin: 0; color: #2d3e50;">Lokasi Ceritamu</h2>
              <button type="button" id="btn-lokasi" class="btn-mono-sub" style="padding: 8px 15px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9em;">Dapatkan Lokasi</button>
            </div>

            <div id="map-input" style="height: 250px; width: 100%; border-radius: 8px; border: 1px solid #ccc; margin-bottom: 15px; z-index: 1;"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="display: flex; flex-direction: column;">
                <label for="lat" class="form-label">Latitude:</label>
                <input type="number" id="lat" step="any" placeholder="Contoh: -6.59..." class="form-control" required readonly style="background-color: #f4f4f4;">
              </div>
              <div style="display: flex; flex-direction: column;">
                <label for="lon" class="form-label">Longitude:</label>
                <input type="number" id="lon" step="any" placeholder="Contoh: 106.79..." class="form-control" required readonly style="background-color: #f4f4f4;">
              </div>
            </div>
            <p style="font-size: 0.85em; color: #666; margin-top: 8px;">*Klik pada peta untuk memilih lokasi secara manual, atau gunakan tombol Dapatkan Lokasi.</p>
          </div>

          <button type="submit" id="btn-submit" class="btn-mono-main" style="width: 100%; padding: 15px; border: none; border-radius: 8px; font-size: 1.1em; font-weight: bold; cursor: pointer; margin-top: 10px;">Unggah Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert('Halaman ini khusus member! Silakan masuk (Login) terlebih dahulu.');
      window.location.hash = '#/login';
      return;
    }

    const video = document.querySelector('#kamera-preview');
    const canvas = document.querySelector('#kamera-canvas');
    const ctx = canvas.getContext('2d');
    let stream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (err) {
      console.error('Kamera tidak dapat diakses:', err);
    }

    const matikanKamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      window.removeEventListener('hashchange', matikanKamera);
    };
    window.addEventListener('hashchange', matikanKamera);

    document.querySelector('#btn-jepret').addEventListener('click', () => {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      video.style.display = 'none';
      canvas.style.display = 'block';
      if (stream) stream.getTracks().forEach((track) => track.stop());
    });

    const inputFoto = document.querySelector('#input-foto');
    inputFoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          video.style.display = 'none';
          canvas.style.display = 'block';
          if (stream) stream.getTracks().forEach((track) => track.stop());
        };
        img.src = URL.createObjectURL(file);
      }
    });

    const inputLat = document.querySelector('#lat');
    const inputLon = document.querySelector('#lon');
    const btnLokasi = document.querySelector('#btn-lokasi');

    const mapInput = L.map('map-input').setView([-6.597463, 106.79956], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(mapInput);

    setTimeout(() => {
      mapInput.invalidateSize();
    }, 200);

    let inputMarker;
    const tempLat = localStorage.getItem('tempLat');
    const tempLon = localStorage.getItem('tempLon');

    if (tempLat && tempLon) {
      inputLat.value = tempLat;
      inputLon.value = tempLon;

      mapInput.setView([tempLat, tempLon], 16);
      inputMarker = L.marker([tempLat, tempLon]).addTo(mapInput);

      localStorage.removeItem('tempLat');
      localStorage.removeItem('tempLon');
    }

    mapInput.on('click', (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      inputLat.value = lat;
      inputLon.value = lon;

      if (inputMarker) {
        inputMarker.setLatLng(e.latlng);
      } else {
        inputMarker = L.marker(e.latlng).addTo(mapInput);
      }
    });

    btnLokasi.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Browser Anda tidak mendukung fitur GPS.');
        return;
      }

      const originalText = btnLokasi.textContent;
      btnLokasi.textContent = 'Mencari lokasi...';

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          inputLat.value = lat;
          inputLon.value = lon;
          btnLokasi.textContent = originalText;

          mapInput.flyTo([lat, lon], 16);
          if (inputMarker) {
            inputMarker.setLatLng([lat, lon]);
          } else {
            inputMarker = L.marker([lat, lon]).addTo(mapInput);
          }
        },
        (err) => {
          console.error('Gagal mendapat lokasi:', err);
          alert('Gagal mengambil lokasi. Pastikan izin lokasi browser diberikan.');
          btnLokasi.textContent = originalText;
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });

    const form = document.querySelector('#form-tambah');
    const btnSubmit = document.querySelector('#btn-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const deskripsi = document.querySelector('#deskripsi').value;
      const lat = document.querySelector('#lat').value;
      const lon = document.querySelector('#lon').value;

      if (canvas.style.display === 'none' || !canvas.width) {
        alert('Silakan ambil foto atau unggah dari galeri terlebih dahulu!');
        return;
      }

      if (!lat || !lon) {
        alert(
          'Mohon isi titik koordinat dengan mengeklik peta atau gunakan tombol "Dapatkan Lokasi"!'
        );
        return;
      }

      btnSubmit.textContent = 'Mengunggah...';
      btnSubmit.disabled = true;

      try {
        const token = localStorage.getItem('userToken');

        const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));

        const formData = new FormData();
        formData.append('description', deskripsi);
        formData.append('photo', imageBlob, 'foto.jpg');
        formData.append('lat', lat);
        formData.append('lon', lon);

        const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const responseJson = await response.json();

        if (!responseJson.error) {
          alert('Hore! Cerita berhasil diunggah!');
          window.location.hash = '#/';
        } else {
          alert(`Gagal mengunggah: ${responseJson.message}`);
          btnSubmit.textContent = 'Unggah Cerita';
          btnSubmit.disabled = false;
        }
      } catch (error) {
        console.error('Error saat upload:', error);
        alert('Terjadi kesalahan jaringan saat mengunggah.');
        btnSubmit.textContent = 'Unggah Cerita';
        btnSubmit.disabled = false;
      }
    });
  }
}
