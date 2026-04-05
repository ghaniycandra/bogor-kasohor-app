var V=a=>{throw TypeError(a)};var O=(a,e,t)=>e.has(a)||V("Cannot "+t);var h=(a,e,t)=>(O(a,e,"read from private field"),t?t.call(a):e.get(a)),A=(a,e,t)=>e.has(a)?V("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(a):e.set(a,t),q=(a,e,t,o)=>(O(a,e,"write to private field"),o?o.call(a,t):e.set(a,t),t),_=(a,e,t)=>(O(a,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();class oe{static async getAllStories(e){return await(await fetch("https://story-api.dicoding.dev/v1/stories?location=1",{method:"GET",headers:{Authorization:`Bearer ${e}`}})).json()}}const K=(a,e)=>e.some(t=>a instanceof t);let J,Z;function re(){return J||(J=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ie(){return Z||(Z=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const z=new WeakMap,N=new WeakMap,$=new WeakMap;function se(a){const e=new Promise((t,o)=>{const n=()=>{a.removeEventListener("success",r),a.removeEventListener("error",i)},r=()=>{t(P(a.result)),n()},i=()=>{o(a.error),n()};a.addEventListener("success",r),a.addEventListener("error",i)});return $.set(e,a),e}function le(a){if(z.has(a))return;const e=new Promise((t,o)=>{const n=()=>{a.removeEventListener("complete",r),a.removeEventListener("error",i),a.removeEventListener("abort",i)},r=()=>{t(),n()},i=()=>{o(a.error||new DOMException("AbortError","AbortError")),n()};a.addEventListener("complete",r),a.addEventListener("error",i),a.addEventListener("abort",i)});z.set(a,e)}let R={get(a,e,t){if(a instanceof IDBTransaction){if(e==="done")return z.get(a);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return P(a[e])},set(a,e,t){return a[e]=t,!0},has(a,e){return a instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in a}};function ee(a){R=a(R)}function ce(a){return ie().includes(a)?function(...e){return a.apply(G(this),e),P(this.request)}:function(...e){return P(a.apply(G(this),e))}}function de(a){return typeof a=="function"?ce(a):(a instanceof IDBTransaction&&le(a),K(a,re())?new Proxy(a,R):a)}function P(a){if(a instanceof IDBRequest)return se(a);if(N.has(a))return N.get(a);const e=de(a);return e!==a&&(N.set(a,e),$.set(e,a)),e}const G=a=>$.get(a);function ue(a,e,{blocked:t,upgrade:o,blocking:n,terminated:r}={}){const i=indexedDB.open(a,e),l=P(i);return o&&i.addEventListener("upgradeneeded",s=>{o(P(i.result),s.oldVersion,s.newVersion,P(i.transaction),s)}),t&&i.addEventListener("blocked",s=>t(s.oldVersion,s.newVersion,s)),l.then(s=>{r&&s.addEventListener("close",()=>r()),n&&s.addEventListener("versionchange",u=>n(u.oldVersion,u.newVersion,u))}).catch(()=>{}),l}const me=["get","getKey","getAll","getAllKeys","count"],pe=["put","add","delete","clear"],H=new Map;function Y(a,e){if(!(a instanceof IDBDatabase&&!(e in a)&&typeof e=="string"))return;if(H.get(e))return H.get(e);const t=e.replace(/FromIndex$/,""),o=e!==t,n=pe.includes(t);if(!(t in(o?IDBIndex:IDBObjectStore).prototype)||!(n||me.includes(t)))return;const r=async function(i,...l){const s=this.transaction(i,n?"readwrite":"readonly");let u=s.store;return o&&(u=u.index(l.shift())),(await Promise.all([u[t](...l),n&&s.done]))[0]};return H.set(e,r),r}ee(a=>({...a,get:(e,t,o)=>Y(e,t)||a.get(e,t,o),has:(e,t)=>!!Y(e,t)||a.has(e,t)}));const ge=["continue","continuePrimaryKey","advance"],Q={},U=new WeakMap,te=new WeakMap,fe={get(a,e){if(!ge.includes(e))return a[e];let t=Q[e];return t||(t=Q[e]=function(...o){U.set(this,te.get(this)[e](...o))}),t}};async function*be(...a){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...a)),!e)return;e=e;const t=new Proxy(e,fe);for(te.set(t,e),$.set(t,G(e));e;)yield t,e=await(U.get(t)||e.continue()),U.delete(t)}function X(a,e){return e===Symbol.asyncIterator&&K(a,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&K(a,[IDBIndex,IDBObjectStore])}ee(a=>({...a,get(e,t,o){return X(e,t)?be:a.get(e,t,o)},has(e,t){return X(e,t)||a.has(e,t)}}));const he="bogor-kasohor-db",ye=1,E="saved_stories",M=ue(he,ye,{upgrade(a){a.objectStoreNames.contains(E)||a.createObjectStore(E,{keyPath:"id"})}}),C={async putStory(a){if(a.hasOwnProperty("id"))return(await M).put(E,a)},async getAllStories(){return(await M).getAll(E)},async getStory(a){if(a)return(await M).get(E,a)},async deleteStory(a){return(await M).delete(E,a)},async clearAllStories(){return(await M).clear(E)}};class ke{showStories(e,t){const o=document.querySelector("#kumpulan-cerita");let n="";e.forEach(r=>{if(r.lat&&r.lon){const u=L.marker([r.lat,r.lon]).addTo(t),b=r.description.length>50?r.description.substring(0,50)+"...":r.description;u.bindPopup(`
          <div style="text-align: center;">
            <img src="${r.photoUrl}" alt="Foto lokasi cerita dari ${r.name}" style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
            <b style="font-size: 1.1em; display: block;">${r.name}</b>
            <p style="margin: 4px 0;">${b}</p>
          </div>
        `)}const i=new Date(r.createdAt).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}),l=`teks-lokasi-${r.id}`;let s="";r.lat&&r.lon?s=`<p id="${l}" class="cerita-date cerita-loc">📍 Melacak lokasi satelit...</p>`:s='<p class="cerita-date cerita-loc">📍 Lokasi: Tidak disematkan</p>',n+=`
        <div class="cerita-card" tabindex="0">
          <img src="${r.photoUrl}" alt="Gambar visual dari cerita yang dibagikan oleh ${r.name}" class="cerita-img">
          <div class="cerita-content">
            <p class="cerita-auth">👤 Diceritakan oleh: ${r.name}</p>
            <p class="cerita-date">📅 Pada tanggal: ${i}</p>
            ${s}
            <p class="cerita-desc"> ${r.description}</p>
            <button class="btn-save-story" id="btn-save-${r.id}">
              ⏳ Memeriksa status...
            </button>
          </div>
        </div>
      `}),o.innerHTML=n,this.terjemahkanDanModifikasiData(e),this.initSaveButtons(e)}async terjemahkanDanModifikasiData(e){for(const t of e){if(t.lat&&t.lon)try{const n=await(await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${t.lat}&lon=${t.lon}`)).json(),r=n.address.city||n.address.town||n.address.county||n.address.village||"Lokasi tidak diketahui";t.placeName=r;const i=document.getElementById(`teks-lokasi-${t.id}`);i&&(i.innerHTML=`📍 Lokasi: ${r}`)}catch{t.placeName="Gagal melacak satelit";const n=document.getElementById(`teks-lokasi-${t.id}`);n&&(n.innerHTML=`📍 Lokasi: ${parseFloat(t.lat).toFixed(3)}, ${parseFloat(t.lon).toFixed(3)}`)}else t.placeName="Tidak ada lokasi";console.log(`Mengintip data ${t.name}:`,t)}}async initSaveButtons(e){for(const t of e){const o=document.querySelector(`#btn-save-${t.id}`);if(!o)continue;await C.getStory(t.id)?(o.innerHTML="💔 Hapus dari Tersimpan",o.classList.add("btn-saved"),o.classList.remove("btn-unsaved")):(o.innerHTML="❤️ Simpan Cerita",o.classList.add("btn-unsaved"),o.classList.remove("btn-saved")),o.addEventListener("click",async()=>{await C.getStory(t.id)?(await C.deleteStory(t.id),o.innerHTML="❤️ Simpan Cerita",o.classList.add("btn-unsaved"),o.classList.remove("btn-saved"),alert(`Cerita milik ${t.name} dihapus dari akunmu!`)):(await C.putStory(t),o.innerHTML="💔 Hapus Cerita",o.classList.add("btn-saved"),o.classList.remove("btn-unsaved"),alert(`Cerita milik ${t.name} berhasil disimpan!`))})}}showError(e){document.querySelector("#kumpulan-cerita").innerHTML=`<p style="color: red; text-align: center; grid-column: 1/-1;">${e}</p>`}}class ve{constructor({view:e,model:t}){this._view=e,this._model=t}async loadStories(e,t){try{const o=await this._model.getAllStories(e);o.error?(alert("Sesi Anda telah berakhir. Silakan login kembali."),localStorage.removeItem("userToken"),window.location.hash="#/login",window.location.reload()):this._view.showStories(o.listStory,t)}catch(o){console.error("Gagal memuat data dari API:",o),this._view.showError("Gagal memuat data cerita. Pastikan internet Anda stabil.")}}}class we{async render(){return`
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
    `}async afterRender(){try{const e=localStorage.getItem("userToken"),t=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}),o=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{maxZoom:17,attribution:"© OpenTopoMap"}),n=L.map("map",{center:[-6.597463242797301,106.7995607513227],zoom:10,layers:[t]});L.control.layers({"Peta Standar":t,"Peta Topografi":o}).addTo(n);let r=L.popup();if(n.on("click",c=>{const k=c.latlng.lat,y=c.latlng.lng;r.setLatLng(c.latlng).setContent(`
            <div style="text-align: center; padding: 5px;">
              <b style="color: #2d3e50; font-size: 1.1em;">Lokasi Dipilih</b>
              <p style="margin: 8px 0; font-size: 0.9em; color: #666;">Punya cerita menarik di titik ini?</p>
              <button onclick="bawaKoordinatDanPindah(${k}, ${y})" style="background-color: #4a637d; color: white; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85em; width: 100%; font-weight: bold; transition: 0.3s;">Tambah Cerita di Sini</button>
            </div>
          `).openOn(n)}),window.bawaKoordinatDanPindah=(c,k)=>{if(!localStorage.getItem("userToken")){alert("Silakan login terlebih dahulu untuk menambah cerita!"),window.location.hash="#/login";return}localStorage.setItem("tempLat",c),localStorage.setItem("tempLon",k),window.location.hash="#/tambah"},!e){document.querySelector("#profil-nama").textContent="Pengguna Tamu",document.querySelector("#profil-email").textContent="Silakan login untuk melihat cerita.",document.querySelector("#avatar-huruf").textContent="?",document.querySelector("#avatar-huruf").style.backgroundColor="#ccc",document.querySelector("#btn-notif").style.display="none",document.querySelector("#link-favorit").style.display="none",document.querySelector("#kumpulan-cerita").innerHTML='<p style="text-align: center; width: 100%; grid-column: 1 / -1; color: #ff4d4d; font-weight: bold;">Anda harus masuk untuk melihat cerita warga.</p>';const c=document.querySelector("#btn-logout");c&&(c.textContent="Masuk (Login)",c.addEventListener("click",()=>window.location.hash="#/login")),L.marker([-6.597463,106.79956]).addTo(n).bindPopup('<b>Peta masih kosong! 🗺️</b><br><a href="#/login">Masuk</a> sekarang untuk berbagi cerita.').openPopup();return}const i=localStorage.getItem("userName")||"Pengguna Tanpa Nama",l=localStorage.getItem("userEmail")||"Email tidak diketahui";document.querySelector("#profil-nama").textContent=i,document.querySelector("#profil-email").textContent=l;const s=document.querySelector("#avatar-huruf");s&&(s.textContent=i.charAt(0).toUpperCase());const u=document.querySelector("#btn-logout");u&&u.addEventListener("click",async()=>{if(confirm("Apakah Anda yakin ingin keluar?")){localStorage.removeItem("userToken"),localStorage.removeItem("userName"),localStorage.removeItem("userEmail");try{await C.clearAllStories()}catch(c){console.error("Gagal mengosongkan IndexedDB:",c)}window.location.hash="#/login",window.location.reload()}});const b=new ke;await new ve({view:b,model:oe}).loadStories(e,n),(async()=>{const c=document.querySelector("#btn-notif");if(!c)return;const k=y=>{const f="=".repeat((4-y.length%4)%4),d=(y+f).replace(/-/g,"+").replace(/_/g,"/"),p=window.atob(d),m=new Uint8Array(p.length);for(let g=0;g<p.length;++g)m[g]=p.charCodeAt(g);return m};try{if("serviceWorker"in navigator&&"PushManager"in window){const y=await navigator.serviceWorker.getRegistration();if(!y){c.textContent="SW Belum Terdaftar",c.disabled=!0,console.warn("Service Worker belum terdaftar. Cek file index.js dan Webpack-mu.");return}let f=await y.pushManager.getSubscription();c.textContent=f?"🔕 Matikan Notifikasi":"🔔 Aktifkan Notifikasi",c.addEventListener("click",async()=>{c.disabled=!0;const d=localStorage.getItem("userToken");try{if(f)await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({endpoint:f.endpoint})}),await f.unsubscribe(),f=null,c.textContent="🔔 Aktifkan Notifikasi",alert("Notifikasi berhasil dimatikan.");else{const m=k("BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk");f=await y.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:m});const g=f.toJSON(),D={endpoint:g.endpoint,keys:{p256dh:g.keys.p256dh,auth:g.keys.auth}},B=await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify(D)}),T=await B.json();if(!B.ok)throw console.error("Pesan dari server:",T),new Error("Gagal dari server: "+T.message);c.textContent="🔕 Matikan Notifikasi",alert("Notifikasi berhasil. Anda akan menerima notifikasi jika ada cerita baru.")}}catch(p){console.error("Gagal mengatur notifikasi:",p),alert("Akses notifikasi ditolak atau terjadi kesalahan jaringan.")}c.disabled=!1})}else c.textContent="Notifikasi Tidak Didukung",c.disabled=!0}catch(y){console.error("Error mengecek status notifikasi:",y),c.textContent="Gagal Memuat Status",c.disabled=!0}})()}catch(e){console.error("Ada yang salah dengan map/render awal:",e)}}}class xe{async render(){return`
      <section class="favorit-container">
        <h2 tabindex="0" class="favorit-title"> Cerita Favorit </h2>
        
        <div id="cerita-favorit" class="cerita-grid">
          <p class="favorit-message-box favorit-message-text" style="padding: 10px;">
            Mengambil data dari memori perangkat...
          </p>
        </div>
      </section>
    `}async afterRender(){const e=document.querySelector("#cerita-favorit");try{const t=await C.getAllStories();if(!t||t.length===0){e.innerHTML=`
          <div class="favorit-message-box">
            <h3 class="favorit-message-title">Belum ada cerita yang disimpan.</h3>
            <p class="favorit-message-text">Yuk, kembali ke Beranda dan simpan cerita menarik yang kamu temukan!</p>
            <a href="/#/" class="btn-mono-main btn-back-home">Ke Beranda</a>
          </div>
        `;return}let o="";t.forEach(n=>{const r=new Date(n.createdAt).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"});let i="";if(n.lat&&n.lon){const l=parseFloat(n.lat).toFixed(3),s=parseFloat(n.lon).toFixed(3);i=`<p class="cerita-date cerita-loc">📍 Lokasi: ${l}, ${s}</p>`}else i='<p class="cerita-date cerita-loc">📍 Lokasi: Tidak disematkan</p>';o+=`
          <div class="cerita-card" id="card-saved-${n.id}" tabindex="0">
            <img src="${n.photoUrl}" alt="Gambar visual dari cerita yang dibagikan oleh ${n.name}" class="cerita-img">
            <div class="cerita-content">
              <p class="cerita-auth">👤 Diceritakan oleh: ${n.name}</p>
              <p class="cerita-date">📅 Pada tanggal: ${r}</p>
              ${i}
              <p class="cerita-desc"> ${n.description}</p>
              
              <button class="btn-save-story btn-saved" id="btn-hapus-${n.id}">
                💔 Hapus Cerita
              </button>
            </div>
          </div>
        `}),e.innerHTML=o,t.forEach(n=>{const r=document.querySelector(`#btn-hapus-${n.id}`);r&&r.addEventListener("click",async()=>{await C.deleteStory(n.id);const i=document.querySelector(`#card-saved-${n.id}`);i&&i.remove(),alert(`Cerita milik ${n.name} berhasil dihapus dari favorit!`),e.children.length===0&&(e.innerHTML='<p class="favorit-message-box favorit-message-text">Belum ada cerita yang disimpan.</p>')})})}catch(t){console.error("Error di halaman Favorit:",t),e.innerHTML=`
        <div class="favorit-error-box">
          <h3>Aduh, ada yang error! 🐛</h3>
          <p>Pesan Error: <b>${t.message}</b></p>
          <p>Silakan cek tab Console (F12) untuk detailnya.</p>
        </div>
      `}}}class Se{async render(){return`
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
    `}async afterRender(){if(!localStorage.getItem("userToken")){alert("Halaman ini khusus member! Silakan masuk (Login) terlebih dahulu."),window.location.hash="#/login";return}const t=document.querySelector("#kamera-preview"),o=document.querySelector("#kamera-canvas"),n=o.getContext("2d");let r;try{r=await navigator.mediaDevices.getUserMedia({video:!0}),t.srcObject=r}catch(d){console.error("Kamera tidak dapat diakses:",d)}const i=()=>{r&&r.getTracks().forEach(d=>d.stop()),window.removeEventListener("hashchange",i)};window.addEventListener("hashchange",i),document.querySelector("#btn-jepret").addEventListener("click",()=>{o.width=t.videoWidth||640,o.height=t.videoHeight||480,n.drawImage(t,0,0,o.width,o.height),t.style.display="none",o.style.display="block",r&&r.getTracks().forEach(d=>d.stop())}),document.querySelector("#input-foto").addEventListener("change",d=>{const p=d.target.files[0];if(p){const m=new Image;m.onload=()=>{o.width=m.width,o.height=m.height,n.drawImage(m,0,0),t.style.display="none",o.style.display="block",r&&r.getTracks().forEach(g=>g.stop())},m.src=URL.createObjectURL(p)}});const s=document.querySelector("#lat"),u=document.querySelector("#lon"),b=document.querySelector("#btn-lokasi"),v=L.map("map-input").setView([-6.597463,106.79956],10);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(v),setTimeout(()=>{v.invalidateSize()},200);let S;const c=localStorage.getItem("tempLat"),k=localStorage.getItem("tempLon");c&&k&&(s.value=c,u.value=k,v.setView([c,k],16),S=L.marker([c,k]).addTo(v),localStorage.removeItem("tempLat"),localStorage.removeItem("tempLon")),v.on("click",d=>{const p=d.latlng.lat,m=d.latlng.lng;s.value=p,u.value=m,S?S.setLatLng(d.latlng):S=L.marker(d.latlng).addTo(v)}),b.addEventListener("click",()=>{if(!navigator.geolocation){alert("Browser Anda tidak mendukung fitur GPS.");return}const d=b.textContent;b.textContent="Mencari lokasi...",navigator.geolocation.getCurrentPosition(p=>{const m=p.coords.latitude,g=p.coords.longitude;s.value=m,u.value=g,b.textContent=d,v.flyTo([m,g],16),S?S.setLatLng([m,g]):S=L.marker([m,g]).addTo(v)},p=>{console.error("Gagal mendapat lokasi:",p),alert("Gagal mengambil lokasi. Pastikan izin lokasi browser diberikan."),b.textContent=d},{enableHighAccuracy:!0,timeout:5e3,maximumAge:0})});const y=document.querySelector("#form-tambah"),f=document.querySelector("#btn-submit");y.addEventListener("submit",async d=>{d.preventDefault();const p=document.querySelector("#deskripsi").value,m=document.querySelector("#lat").value,g=document.querySelector("#lon").value;if(o.style.display==="none"||!o.width){alert("Silakan ambil foto atau unggah dari galeri terlebih dahulu!");return}if(!m||!g){alert('Mohon isi titik koordinat dengan mengeklik peta atau gunakan tombol "Dapatkan Lokasi"!');return}f.textContent="Mengunggah...",f.disabled=!0;try{const D=localStorage.getItem("userToken"),B=await new Promise(ne=>o.toBlob(ne,"image/jpeg")),T=new FormData;T.append("description",p),T.append("photo",B,"foto.jpg"),T.append("lat",m),T.append("lon",g);const W=await(await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${D}`},body:T})).json();W.error?(alert(`Gagal mengunggah: ${W.message}`),f.textContent="Unggah Cerita",f.disabled=!1):(alert("Hore! Cerita berhasil diunggah!"),window.location.hash="#/")}catch(D){console.error("Error saat upload:",D),alert("Terjadi kesalahan jaringan saat mengunggah."),f.textContent="Unggah Cerita",f.disabled=!1}})}}class Le{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#form-login"),t=document.querySelector("#btn-login");e.addEventListener("submit",async o=>{o.preventDefault();const n=document.querySelector("#email").value,r=document.querySelector("#password").value;t.textContent="Memproses...",t.disabled=!0;try{const l=await(await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:r})})).json();l.error?(alert(`Gagal Login: ${l.message}`),t.textContent="Login",t.disabled=!1):(localStorage.setItem("userToken",l.loginResult.token),localStorage.setItem("userName",l.loginResult.name),localStorage.setItem("userEmail",n),alert("Login Berhasil! Mengalihkan ke Beranda..."),window.location.hash="#/")}catch(i){console.error("Error saat login:",i),alert("Terjadi kesalahan jaringan. Pastikan internet Anda stabil."),t.textContent="Login",t.disabled=!1}})}}class Te{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#form-register"),t=document.querySelector("#btn-register");e.addEventListener("submit",async o=>{o.preventDefault();const n=document.querySelector("#name").value,r=document.querySelector("#email").value,i=document.querySelector("#password").value;t.textContent="Mendaftarkan...",t.disabled=!0;try{const s=await(await fetch("https://story-api.dicoding.dev/v1/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,email:r,password:i})})).json();s.error?(alert(`Gagal Mendaftar: ${s.message}`),t.textContent="Daftar Sekarang",t.disabled=!1):(alert("Pendaftaran Berhasil! Silakan Login menggunakan akun yang baru dibuat."),window.location.hash="#/login")}catch(l){console.error("Error saat mendaftar:",l),alert("Terjadi kesalahan jaringan. Pastikan internet Anda stabil."),t.textContent="Daftar Sekarang",t.disabled=!1}})}}const F={"/":new we,"/favorit":new xe,"/tambah":new Se,"/login":new Le,"/daftar":new Te};function Ce(a){const e=a.split("/");return{resource:e[1]||null,id:e[2]||null}}function Ee(a){let e="";return a.resource&&(e=e.concat(`/${a.resource}`)),a.id&&(e=e.concat("/:id")),e||"/"}function Ie(){return location.hash.replace("#","")||"/"}function Pe(){const a=Ie(),e=Ce(a);return Ee(e)}var I,w,x,j,ae;class De{constructor({navigationDrawer:e,drawerButton:t,content:o}){A(this,j);A(this,I,null);A(this,w,null);A(this,x,null);q(this,I,o),q(this,w,t),q(this,x,e),_(this,j,ae).call(this)}async renderPage(){const e=Pe(),t=F[e];if(!t){console.warn(`Halaman untuk rute ${e} tidak ditemukan.`),h(this,I).innerHTML=await F["/"].render(),await F["/"].afterRender();return}h(this,I).innerHTML=await t.render(),await t.afterRender(),h(this,I).focus()}}I=new WeakMap,w=new WeakMap,x=new WeakMap,j=new WeakSet,ae=function(){h(this,w).addEventListener("click",()=>{const e=h(this,x).classList.toggle("open");h(this,w).setAttribute("aria-expanded",e)}),document.body.addEventListener("click",e=>{!h(this,x).contains(e.target)&&!h(this,w).contains(e.target)&&(h(this,x).classList.remove("open"),h(this,w).setAttribute("aria-expanded","false")),h(this,x).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&(h(this,x).classList.remove("open"),h(this,w).setAttribute("aria-expanded","false"))})})};document.addEventListener("DOMContentLoaded",async()=>{const a=new De({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")}),e=document.querySelector(".skip-link"),t=document.querySelector("#main-content");e&&t&&e.addEventListener("click",i=>{i.preventDefault(),t.scrollIntoView({behavior:"smooth"}),t.focus()});const o=()=>{const i=localStorage.getItem("userToken"),l=document.getElementById("nav-login"),s=document.getElementById("nav-daftar"),u=document.getElementById("nav-logout"),b=document.getElementById("nav-tambah");i?(l&&(l.style.display="none"),s&&(s.style.display="none"),u&&(u.style.display=""),b&&(b.style.display="")):(l&&(l.style.display=""),s&&(s.style.display=""),u&&(u.style.display="none"),b&&(b.style.display="none"))},n=document.getElementById("btn-keluar-global");n&&n.addEventListener("click",async()=>{if(confirm("Apakah Anda yakin ingin keluar dari aplikasi?")){localStorage.removeItem("userToken"),localStorage.removeItem("userName"),localStorage.removeItem("userEmail");try{await C.clearAllStories()}catch(l){console.error("Gagal mengosongkan IndexedDB:",l)}o(),window.location.hash="#/login",window.location.reload()}});const r=async()=>{o(),document.startViewTransition?document.startViewTransition(async()=>{await a.renderPage(),window.scrollTo(0,0)}):(await a.renderPage(),window.scrollTo(0,0))};"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/bogor-kasohor-app/sw.js").then(l=>{console.log("Service Worker berhasil didaftarkan:",l.scope)}).catch(l=>{console.error("Pendaftaran Service Worker gagal:",l)})}),await r(),window.addEventListener("hashchange",async()=>{await r()})});
