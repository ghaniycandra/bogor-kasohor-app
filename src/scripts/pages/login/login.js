export default class Login {
  async render() {
    return `
      <section class="container content-section" style="max-width: 400px; margin: 0 auto; padding-top: 40px;">
        <h1 tabindex="0" class="page-title" style="text-align: center; margin-bottom: 20px;">Masuk Aplikasi</h1>
        
        <form id="form-login" class="form-container">
          <div style="margin-bottom: 15px;">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="email" required aria-required="true" placeholder="contoh@email.com" class="form-control">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label for="password" class="form-label">Password:</label>
            <input type="password" id="password" required aria-required="true" placeholder="Masukkan password Anda" class="form-control">
          </div>
          
          <button type="submit" id="btn-login" class="btn-mono-main" style="width: 100%; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
            Login
          </button>
        </form>

        <p class="auth-footer-text">
          Belum punya akun?<br>
          <a href="#/daftar" class="auth-link">Daftar di sini</a>
        </p>
      </section>
    `;
  }

  async afterRender() {
    const formLogin = document.querySelector('#form-login');
    const btnLogin = document.querySelector('#btn-login');

    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      btnLogin.textContent = 'Memproses...';
      btnLogin.disabled = true;

      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const responseJson = await response.json();

        if (!responseJson.error) {
          localStorage.setItem('userToken', responseJson.loginResult.token);
          localStorage.setItem('userName', responseJson.loginResult.name);
          localStorage.setItem('userEmail', email);
          alert('Login Berhasil! Mengalihkan ke Beranda...');

          window.location.hash = '#/';
        } else {
          alert(`Gagal Login: ${responseJson.message}`);

          btnLogin.textContent = 'Login';
          btnLogin.disabled = false;
        }
      } catch (error) {
        console.error('Error saat login:', error);
        alert('Terjadi kesalahan jaringan. Pastikan internet Anda stabil.');

        btnLogin.textContent = 'Login';
        btnLogin.disabled = false;
      }
    });
  }
}
