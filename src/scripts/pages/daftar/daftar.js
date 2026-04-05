export default class Daftar {
  async render() {
    return `
      <section class="container content-section" style="max-width: 400px; margin: 0 auto; padding-top: 40px;">
        <h1 tabindex="0" class="page-title" style="text-align: center; margin-bottom: 20px;">Daftar Akun Baru</h1>
        
        <form id="form-register" class="form-container">
          <div style="margin-bottom: 15px;">
            <label for="name" class="form-label">Nama Lengkap:</label>
            <input type="text" id="name" required aria-required="true" placeholder="Masukkan nama Anda" class="form-control">
          </div>

          <div style="margin-bottom: 15px;">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="email" required aria-required="true" placeholder="contoh@email.com" class="form-control">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label for="password" class="form-label">Password (Minimal 8 karakter):</label>
            <input type="password" id="password" required aria-required="true" minlength="8" placeholder="Masukkan password Anda" class="form-control">
          </div>
          
          <button type="submit" id="btn-register" class="btn-mono-main" style="width: 100%; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
            Daftar Sekarang
          </button>
        </form>

        <p class="auth-footer-text">
          Sudah punya akun?<br>
          <a href="#/login" class="auth-link">Masuk di sini</a>
        </p>
      </section>
    `;
  }

  async afterRender() {
    const formRegister = document.querySelector('#form-register');
    const btnRegister = document.querySelector('#btn-register');

    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      btnRegister.textContent = 'Mendaftarkan...';
      btnRegister.disabled = true;

      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const responseJson = await response.json();

        if (!responseJson.error) {
          alert('Pendaftaran Berhasil! Silakan Login menggunakan akun yang baru dibuat.');

          window.location.hash = '#/login';
        } else {
          alert(`Gagal Mendaftar: ${responseJson.message}`);
          btnRegister.textContent = 'Daftar Sekarang';
          btnRegister.disabled = false;
        }
      } catch (error) {
        console.error('Error saat mendaftar:', error);
        alert('Terjadi kesalahan jaringan. Pastikan internet Anda stabil.');
        btnRegister.textContent = 'Daftar Sekarang';
        btnRegister.disabled = false;
      }
    });
  }
}
