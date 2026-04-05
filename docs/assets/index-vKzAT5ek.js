var V=a=>{throw TypeError(a)};var N=(a,e,t)=>e.has(a)||V("Cannot "+t);var h=(a,e,t)=>(N(a,e,"read from private field"),t?t.call(a):e.get(a)),P=(a,e,t)=>e.has(a)?V("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(a):e.set(a,t),q=(a,e,t,n)=>(N(a,e,"write to private field"),n?n.call(a,t):e.set(a,t),t),_=(a,e,t)=>(N(a,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();class oe{static async getAllStories(e){return await(await fetch("https://story-api.dicoding.dev/v1/stories?location=1",{method:"GET",headers:{Authorization:`Bearer ${e}`}})).json()}}const K=(a,e)=>e.some(t=>a instanceof t);let J,Z;function re(){return J||(J=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ie(){return Z||(Z=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const z=new WeakMap,O=new WeakMap,$=new WeakMap;function se(a){const e=new Promise((t,n)=>{const r=()=>{a.removeEventListener("success",o),a.removeEventListener("error",s)},o=()=>{t(D(a.result)),r()},s=()=>{n(a.error),r()};a.addEventListener("success",o),a.addEventListener("error",s)});return $.set(e,a),e}function le(a){if(z.has(a))return;const e=new Promise((t,n)=>{const r=()=>{a.removeEventListener("complete",o),a.removeEventListener("error",s),a.removeEventListener("abort",s)},o=()=>{t(),r()},s=()=>{n(a.error||new DOMException("AbortError","AbortError")),r()};a.addEventListener("complete",o),a.addEventListener("error",s),a.addEventListener("abort",s)});z.set(a,e)}let G={get(a,e,t){if(a instanceof IDBTransaction){if(e==="done")return z.get(a);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return D(a[e])},set(a,e,t){return a[e]=t,!0},has(a,e){return a instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in a}};function ee(a){G=a(G)}function ce(a){return ie().includes(a)?function(...e){return a.apply(R(this),e),D(this.request)}:function(...e){return D(a.apply(R(this),e))}}function de(a){return typeof a=="function"?ce(a):(a instanceof IDBTransaction&&le(a),K(a,re())?new Proxy(a,G):a)}function D(a){if(a instanceof IDBRequest)return se(a);if(O.has(a))return O.get(a);const e=de(a);return e!==a&&(O.set(a,e),$.set(e,a)),e}const R=a=>$.get(a);function ue(a,e,{blocked:t,upgrade:n,blocking:r,terminated:o}={}){const s=indexedDB.open(a,e),c=D(s);return n&&s.addEventListener("upgradeneeded",i=>{n(D(s.result),i.oldVersion,i.newVersion,D(s.transaction),i)}),t&&s.addEventListener("blocked",i=>t(i.oldVersion,i.newVersion,i)),c.then(i=>{o&&i.addEventListener("close",()=>o()),r&&i.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),c}const me=["get","getKey","getAll","getAllKeys","count"],pe=["put","add","delete","clear"],H=new Map;function Y(a,e){if(!(a instanceof IDBDatabase&&!(e in a)&&typeof e=="string"))return;if(H.get(e))return H.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,r=pe.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(r||me.includes(t)))return;const o=async function(s,...c){const i=this.transaction(s,r?"readwrite":"readonly");let d=i.store;return n&&(d=d.index(c.shift())),(await Promise.all([d[t](...c),r&&i.done]))[0]};return H.set(e,o),o}ee(a=>({...a,get:(e,t,n)=>Y(e,t)||a.get(e,t,n),has:(e,t)=>!!Y(e,t)||a.has(e,t)}));const ge=["continue","continuePrimaryKey","advance"],Q={},U=new WeakMap,te=new WeakMap,fe={get(a,e){if(!ge.includes(e))return a[e];let t=Q[e];return t||(t=Q[e]=function(...n){U.set(this,te.get(this)[e](...n))}),t}};async function*be(...a){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...a)),!e)return;e=e;const t=new Proxy(e,fe);for(te.set(t,e),$.set(t,R(e));e;)yield t,e=await(U.get(t)||e.continue()),U.delete(t)}function X(a,e){return e===Symbol.asyncIterator&&K(a,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&K(a,[IDBIndex,IDBObjectStore])}ee(a=>({...a,get(e,t,n){return X(e,t)?be:a.get(e,t,n)},has(e,t){return X(e,t)||a.has(e,t)}}));const he="bogor-kasohor-db",ye=1,E="saved_stories",M=ue(he,ye,{upgrade(a){a.objectStoreNames.contains(E)||a.createObjectStore(E,{keyPath:"id"})}}),C={async putStory(a){if(a.hasOwnProperty("id"))return(await M).put(E,a)},async getAllStories(){return(await M).getAll(E)},async getStory(a){if(a)return(await M).get(E,a)},async deleteStory(a){return(await M).delete(E,a)},async clearAllStories(){return(await M).clear(E)}};class ke{showStories(e,t){const n=document.querySelector("#kumpulan-cerita");let r="";e.forEach(o=>{if(o.lat&&o.lon){const d=L.marker([o.lat,o.lon]).addTo(t),m=o.description.length>50?o.description.substring(0,50)+"...":o.description;d.bindPopup(`
          <div style="text-align: center;">
            <img src="${o.photoUrl}" alt="Foto lokasi cerita dari ${o.name}" style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
            <b style="font-size: 1.1em; display: block;">${o.name}</b>
            <p style="margin: 4px 0;">${m}</p>
          </div>
        `)}const s=new Date(o.createdAt).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}),c=`teks-lokasi-${o.id}`;let i="";o.lat&&o.lon?i=`<p id="${c}" class="cerita-date cerita-loc">📍 Melacak lokasi satelit...</p>`:i='<p class="cerita-date cerita-loc">📍 Lokasi: Tidak disematkan</p>',r+=`
        <div class="cerita-card" tabindex="0">
          <img src="${o.photoUrl}" alt="Gambar visual dari cerita yang dibagikan oleh ${o.name}" class="cerita-img">
          <div class="cerita-content">
            <p class="cerita-auth">👤 Diceritakan oleh: ${o.name}</p>
            <p class="cerita-date">📅 Pada tanggal: ${s}</p>
            ${i}
            <p class="cerita-desc"> ${o.description}</p>
            <button class="btn-save-story" id="btn-save-${o.id}">
              ⏳ Memeriksa status...
            </button>
          </div>
        </div>
      `}),n.innerHTML=r,this.terjemahkanDanModifikasiData(e),this.initSaveButtons(e)}async terjemahkanDanModifikasiData(e){for(const t of e){if(t.lat&&t.lon)try{const r=await(await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${t.lat}&lon=${t.lon}`)).json(),o=r.address.city||r.address.town||r.address.county||r.address.village||"Lokasi tidak diketahui";t.placeName=o;const s=document.getElementById(`teks-lokasi-${t.id}`);s&&(s.innerHTML=`📍 Lokasi: ${o}`)}catch{t.placeName="Gagal melacak satelit";const r=document.getElementById(`teks-lokasi-${t.id}`);r&&(r.innerHTML=`📍 Lokasi: ${parseFloat(t.lat).toFixed(3)}, ${parseFloat(t.lon).toFixed(3)}`)}else t.placeName="Tidak ada lokasi";console.log(`Mengintip data ${t.name}:`,t)}}async initSaveButtons(e){for(const t of e){const n=document.querySelector(`#btn-save-${t.id}`);if(!n)continue;await C.getStory(t.id)?(n.innerHTML="💔 Hapus dari Tersimpan",n.classList.add("btn-saved"),n.classList.remove("btn-unsaved")):(n.innerHTML="❤️ Simpan Cerita",n.classList.add("btn-unsaved"),n.classList.remove("btn-saved")),n.addEventListener("click",async()=>{await C.getStory(t.id)?(await C.deleteStory(t.id),n.innerHTML="❤️ Simpan Cerita",n.classList.add("btn-unsaved"),n.classList.remove("btn-saved"),alert(`Cerita milik ${t.name} dihapus dari akunmu!`)):(await C.putStory(t),n.innerHTML="💔 Hapus Cerita",n.classList.add("btn-saved"),n.classList.remove("btn-unsaved"),alert(`Cerita milik ${t.name} berhasil disimpan!`))})}}showError(e){document.querySelector("#kumpulan-cerita").innerHTML=`<p style="color: red; text-align: center; grid-column: 1/-1;">${e}</p>`}}class ve{constructor({view:e,model:t}){this._view=e,this._model=t}async loadStories(e,t){try{const n=await this._model.getAllStories(e);n.error?(alert("Sesi Anda telah berakhir. Silakan login kembali."),localStorage.removeItem("userToken"),window.location.hash="#/login",window.location.reload()):this._view.showStories(n.listStory,t)}catch(n){console.error("Gagal memuat data dari API:",n),this._view.showError("Gagal memuat data cerita. Pastikan internet Anda stabil.")}}}class we{async render(){return`
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
    `}async afterRender(){try{const e=localStorage.getItem("userToken"),t=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}),n=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{maxZoom:17,attribution:"© OpenTopoMap"}),r=L.map("map",{center:[-6.597463242797301,106.7995607513227],zoom:10,layers:[t]});L.control.layers({"Peta Standar":t,"Peta Topografi":n}).addTo(r);let o=L.popup();if(r.on("click",l=>{const w=l.latlng.lat,k=l.latlng.lng;o.setLatLng(l.latlng).setContent(`
            <div style="text-align: center; padding: 5px;">
              <b style="color: #2d3e50; font-size: 1.1em;">Lokasi Dipilih</b>
              <p style="margin: 8px 0; font-size: 0.9em; color: #666;">Punya cerita menarik di titik ini?</p>
              <button onclick="bawaKoordinatDanPindah(${w}, ${k})" style="background-color: #4a637d; color: white; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85em; width: 100%; font-weight: bold; transition: 0.3s;">Tambah Cerita di Sini</button>
            </div>
          `).openOn(r)}),window.bawaKoordinatDanPindah=(l,w)=>{if(!localStorage.getItem("userToken")){alert("Silakan login terlebih dahulu untuk menambah cerita!"),window.location.hash="#/login";return}localStorage.setItem("tempLat",l),localStorage.setItem("tempLon",w),window.location.hash="#/tambah"},!e){document.querySelector("#profil-nama").textContent="Pengguna Tamu",document.querySelector("#profil-email").textContent="Silakan login untuk melihat cerita.",document.querySelector("#avatar-huruf").textContent="?",document.querySelector("#avatar-huruf").style.backgroundColor="#ccc",document.querySelector("#btn-notif").style.display="none",document.querySelector("#link-favorit").style.display="none",document.querySelector("#kumpulan-cerita").innerHTML='<p style="text-align: center; width: 100%; grid-column: 1 / -1; color: #ff4d4d; font-weight: bold;">Anda harus masuk untuk melihat cerita warga.</p>';const l=document.querySelector("#btn-logout");l&&(l.textContent="Masuk (Login)",l.addEventListener("click",()=>window.location.hash="#/login")),L.marker([-6.597463,106.79956]).addTo(r).bindPopup('<b>Peta masih kosong! 🗺️</b><br><a href="#/login">Masuk</a> sekarang untuk berbagi cerita.').openPopup();return}const s=localStorage.getItem("userName")||"Pengguna Tanpa Nama",c=localStorage.getItem("userEmail")||"Email tidak diketahui";document.querySelector("#profil-nama").textContent=s,document.querySelector("#profil-email").textContent=c;const i=document.querySelector("#avatar-huruf");i&&(i.textContent=s.charAt(0).toUpperCase());const d=document.querySelector("#btn-logout");d&&d.addEventListener("click",async()=>{if(confirm("Apakah Anda yakin ingin keluar?")){localStorage.removeItem("userToken"),localStorage.removeItem("userName"),localStorage.removeItem("userEmail");try{await C.clearAllStories()}catch(l){console.error("Gagal mengosongkan IndexedDB:",l)}window.location.hash="#/login",window.location.reload()}});const m=new ke;await new ve({view:m,model:oe}).loadStories(e,r),(async()=>{const l=document.querySelector("#btn-notif");if(!l)return;const w=k=>{const b="=".repeat((4-k.length%4)%4),u=(k+b).replace(/-/g,"+").replace(/_/g,"/"),g=window.atob(u),p=new Uint8Array(g.length);for(let f=0;f<g.length;++f)p[f]=g.charCodeAt(f);return p};try{if("serviceWorker"in navigator&&"PushManager"in window){const k=await navigator.serviceWorker.getRegistration();if(!k){l.textContent="SW Belum Terdaftar",l.disabled=!0,console.warn("Service Worker belum terdaftar. Cek file index.js dan Webpack-mu.");return}let b=await k.pushManager.getSubscription();l.textContent=b?"🔕 Matikan Notifikasi":"🔔 Aktifkan Notifikasi",l.addEventListener("click",async()=>{l.disabled=!0;const u=localStorage.getItem("userToken");try{if(b)await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`},body:JSON.stringify({endpoint:b.endpoint})}),await b.unsubscribe(),b=null,l.textContent="🔔 Aktifkan Notifikasi",alert("Notifikasi berhasil dimatikan.");else{const p=w("BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk");b=await k.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:p});const f=b.toJSON(),A={endpoint:f.endpoint,keys:{p256dh:f.keys.p256dh,auth:f.keys.auth}},B=await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`},body:JSON.stringify(A)}),T=await B.json();if(!B.ok)throw console.error("Pesan dari server:",T),new Error("Gagal dari server: "+T.message);l.textContent="🔕 Matikan Notifikasi",alert("Notifikasi berhasil. Anda akan menerima notifikasi jika ada cerita baru.")}}catch(g){console.error("Gagal mengatur notifikasi:",g),alert("Akses notifikasi ditolak atau terjadi kesalahan jaringan.")}l.disabled=!1})}else l.textContent="Notifikasi Tidak Didukung",l.disabled=!0}catch(k){console.error("Error mengecek status notifikasi:",k),l.textContent="Gagal Memuat Status",l.disabled=!0}})()}catch(e){console.error("Ada yang salah dengan map/render awal:",e)}}}class xe{async render(){return`
      <section class="favorit-container">
        <h2 tabindex="0" class="favorit-title"> Cerita Favorit </h2>
        
        <div id="cerita-favorit" class="cerita-grid">
          <p class="favorit-message-box favorit-message-text" style="padding: 10px;">
            Mengambil data dari memori perangkat...
          </p>
        </div>
      </section>
    `}async afterRender(){var t,n,r,o;const e=document.querySelector("#cerita-favorit");try{const s=await C.getAllStories();if(!s||s.length===0){e.innerHTML=`
          <div class="favorit-message-box">
            <h3 class="favorit-message-title">Belum ada cerita yang disimpan.</h3>
            <p class="favorit-message-text">Yuk, kembali ke Beranda dan simpan cerita menarik yang kamu temukan!</p>
            <a href="#/" class="btn-mono-main btn-back-home">Ke Beranda</a>
          </div>
        `;return}let c="";for(const i of s){const d=new Date(i.createdAt).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"});let m="";if(i.lat&&i.lon){let v=i.placeName||`${parseFloat(i.lat).toFixed(3)}, ${parseFloat(i.lon).toFixed(3)}`;if(!i.placeName)try{const y=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${i.lat}&lon=${i.lon}`);if(y.ok){const l=await y.json();v=((t=l.address)==null?void 0:t.city)||((n=l.address)==null?void 0:n.town)||((r=l.address)==null?void 0:r.county)||((o=l.address)==null?void 0:o.village)||"Lokasi tidak diketahui"}}catch(y){console.warn("Gagal mengonversi lokasi:",y)}m=`<p class="cerita-date cerita-loc">📍 Lokasi: ${v}</p>`}else m='<p class="cerita-date cerita-loc">📍 Lokasi: Tidak disematkan</p>';c+=`
          <div class="cerita-card" id="card-saved-${i.id}" tabindex="0">
            <img src="${i.photoUrl}" alt="Gambar visual dari cerita yang dibagikan oleh ${i.name}" class="cerita-img">
            <div class="cerita-content">
              <p class="cerita-auth">👤 Diceritakan oleh: ${i.name}</p>
              <p class="cerita-date">📅 Pada tanggal: ${d}</p>
              ${m}
              <p class="cerita-desc"> ${i.description}</p>
              
              <button class="btn-save-story btn-saved" id="btn-hapus-${i.id}">
                💔 Hapus Cerita
              </button>
            </div>
          </div>
        `}e.innerHTML=c,s.forEach(i=>{const d=document.querySelector(`#btn-hapus-${i.id}`);d&&d.addEventListener("click",async()=>{await C.deleteStory(i.id);const m=document.querySelector(`#card-saved-${i.id}`);m&&m.remove(),alert(`Cerita milik ${i.name} berhasil dihapus dari favorit!`),e.children.length===0&&(e.innerHTML='<p class="favorit-message-box favorit-message-text">Belum ada cerita yang disimpan.</p>')})})}catch(s){console.error("Error di halaman Favorit:",s),e.innerHTML=`
        <div class="favorit-error-box">
          <h3>Aduh, ada yang error! 🐛</h3>
          <p>Pesan Error: <b>${s.message}</b></p>
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
    `}async afterRender(){if(!localStorage.getItem("userToken")){alert("Halaman ini khusus member! Silakan masuk (Login) terlebih dahulu."),window.location.hash="#/login";return}const t=document.querySelector("#kamera-preview"),n=document.querySelector("#kamera-canvas"),r=n.getContext("2d");let o;try{o=await navigator.mediaDevices.getUserMedia({video:!0}),t.srcObject=o}catch(u){console.error("Kamera tidak dapat diakses:",u)}const s=()=>{o&&o.getTracks().forEach(u=>u.stop()),window.removeEventListener("hashchange",s)};window.addEventListener("hashchange",s),document.querySelector("#btn-jepret").addEventListener("click",()=>{n.width=t.videoWidth||640,n.height=t.videoHeight||480,r.drawImage(t,0,0,n.width,n.height),t.style.display="none",n.style.display="block",o&&o.getTracks().forEach(u=>u.stop())}),document.querySelector("#input-foto").addEventListener("change",u=>{const g=u.target.files[0];if(g){const p=new Image;p.onload=()=>{n.width=p.width,n.height=p.height,r.drawImage(p,0,0),t.style.display="none",n.style.display="block",o&&o.getTracks().forEach(f=>f.stop())},p.src=URL.createObjectURL(g)}});const i=document.querySelector("#lat"),d=document.querySelector("#lon"),m=document.querySelector("#btn-lokasi"),v=L.map("map-input").setView([-6.597463,106.79956],10);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(v),setTimeout(()=>{v.invalidateSize()},200);let y;const l=localStorage.getItem("tempLat"),w=localStorage.getItem("tempLon");l&&w&&(i.value=l,d.value=w,v.setView([l,w],16),y=L.marker([l,w]).addTo(v),localStorage.removeItem("tempLat"),localStorage.removeItem("tempLon")),v.on("click",u=>{const g=u.latlng.lat,p=u.latlng.lng;i.value=g,d.value=p,y?y.setLatLng(u.latlng):y=L.marker(u.latlng).addTo(v)}),m.addEventListener("click",()=>{if(!navigator.geolocation){alert("Browser Anda tidak mendukung fitur GPS.");return}const u=m.textContent;m.textContent="Mencari lokasi...",navigator.geolocation.getCurrentPosition(g=>{const p=g.coords.latitude,f=g.coords.longitude;i.value=p,d.value=f,m.textContent=u,v.flyTo([p,f],16),y?y.setLatLng([p,f]):y=L.marker([p,f]).addTo(v)},g=>{console.error("Gagal mendapat lokasi:",g),alert("Gagal mengambil lokasi. Pastikan izin lokasi browser diberikan."),m.textContent=u},{enableHighAccuracy:!0,timeout:5e3,maximumAge:0})});const k=document.querySelector("#form-tambah"),b=document.querySelector("#btn-submit");k.addEventListener("submit",async u=>{u.preventDefault();const g=document.querySelector("#deskripsi").value,p=document.querySelector("#lat").value,f=document.querySelector("#lon").value;if(n.style.display==="none"||!n.width){alert("Silakan ambil foto atau unggah dari galeri terlebih dahulu!");return}if(!p||!f){alert('Mohon isi titik koordinat dengan mengeklik peta atau gunakan tombol "Dapatkan Lokasi"!');return}b.textContent="Mengunggah...",b.disabled=!0;try{const A=localStorage.getItem("userToken"),B=await new Promise(ne=>n.toBlob(ne,"image/jpeg")),T=new FormData;T.append("description",g),T.append("photo",B,"foto.jpg"),T.append("lat",p),T.append("lon",f);const W=await(await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${A}`},body:T})).json();W.error?(alert(`Gagal mengunggah: ${W.message}`),b.textContent="Unggah Cerita",b.disabled=!1):(alert("Hore! Cerita berhasil diunggah!"),window.location.hash="#/")}catch(A){console.error("Error saat upload:",A),alert("Terjadi kesalahan jaringan saat mengunggah."),b.textContent="Unggah Cerita",b.disabled=!1}})}}class Le{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#form-login"),t=document.querySelector("#btn-login");e.addEventListener("submit",async n=>{n.preventDefault();const r=document.querySelector("#email").value,o=document.querySelector("#password").value;t.textContent="Memproses...",t.disabled=!0;try{const c=await(await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r,password:o})})).json();c.error?(alert(`Gagal Login: ${c.message}`),t.textContent="Login",t.disabled=!1):(localStorage.setItem("userToken",c.loginResult.token),localStorage.setItem("userName",c.loginResult.name),localStorage.setItem("userEmail",r),alert("Login Berhasil! Mengalihkan ke Beranda..."),window.location.hash="#/")}catch(s){console.error("Error saat login:",s),alert("Terjadi kesalahan jaringan. Pastikan internet Anda stabil."),t.textContent="Login",t.disabled=!1}})}}class Te{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#form-register"),t=document.querySelector("#btn-register");e.addEventListener("submit",async n=>{n.preventDefault();const r=document.querySelector("#name").value,o=document.querySelector("#email").value,s=document.querySelector("#password").value;t.textContent="Mendaftarkan...",t.disabled=!0;try{const i=await(await fetch("https://story-api.dicoding.dev/v1/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:r,email:o,password:s})})).json();i.error?(alert(`Gagal Mendaftar: ${i.message}`),t.textContent="Daftar Sekarang",t.disabled=!1):(alert("Pendaftaran Berhasil! Silakan Login menggunakan akun yang baru dibuat."),window.location.hash="#/login")}catch(c){console.error("Error saat mendaftar:",c),alert("Terjadi kesalahan jaringan. Pastikan internet Anda stabil."),t.textContent="Daftar Sekarang",t.disabled=!1}})}}const F={"/":new we,"/favorit":new xe,"/tambah":new Se,"/login":new Le,"/daftar":new Te};function Ce(a){const e=a.split("/");return{resource:e[1]||null,id:e[2]||null}}function Ee(a){let e="";return a.resource&&(e=e.concat(`/${a.resource}`)),a.id&&(e=e.concat("/:id")),e||"/"}function Ie(){return location.hash.replace("#","")||"/"}function De(){const a=Ie(),e=Ce(a);return Ee(e)}var I,x,S,j,ae;class Ae{constructor({navigationDrawer:e,drawerButton:t,content:n}){P(this,j);P(this,I,null);P(this,x,null);P(this,S,null);q(this,I,n),q(this,x,t),q(this,S,e),_(this,j,ae).call(this)}async renderPage(){const e=De(),t=F[e];if(!t){console.warn(`Halaman untuk rute ${e} tidak ditemukan.`),h(this,I).innerHTML=await F["/"].render(),await F["/"].afterRender();return}h(this,I).innerHTML=await t.render(),await t.afterRender(),h(this,I).focus()}}I=new WeakMap,x=new WeakMap,S=new WeakMap,j=new WeakSet,ae=function(){h(this,x).addEventListener("click",()=>{const e=h(this,S).classList.toggle("open");h(this,x).setAttribute("aria-expanded",e)}),document.body.addEventListener("click",e=>{!h(this,S).contains(e.target)&&!h(this,x).contains(e.target)&&(h(this,S).classList.remove("open"),h(this,x).setAttribute("aria-expanded","false")),h(this,S).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&(h(this,S).classList.remove("open"),h(this,x).setAttribute("aria-expanded","false"))})})};document.addEventListener("DOMContentLoaded",async()=>{const a=new Ae({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")}),e=document.querySelector(".skip-link"),t=document.querySelector("#main-content");e&&t&&e.addEventListener("click",s=>{s.preventDefault(),t.scrollIntoView({behavior:"smooth"}),t.focus()});const n=()=>{const s=localStorage.getItem("userToken"),c=document.getElementById("nav-login"),i=document.getElementById("nav-daftar"),d=document.getElementById("nav-logout"),m=document.getElementById("nav-tambah");s?(c&&(c.style.display="none"),i&&(i.style.display="none"),d&&(d.style.display=""),m&&(m.style.display="")):(c&&(c.style.display=""),i&&(i.style.display=""),d&&(d.style.display="none"),m&&(m.style.display="none"))},r=document.getElementById("btn-keluar-global");r&&r.addEventListener("click",async()=>{if(confirm("Apakah Anda yakin ingin keluar dari aplikasi?")){localStorage.removeItem("userToken"),localStorage.removeItem("userName"),localStorage.removeItem("userEmail");try{await C.clearAllStories()}catch(c){console.error("Gagal mengosongkan IndexedDB:",c)}n(),window.location.hash="#/login",window.location.reload()}});const o=async()=>{n(),document.startViewTransition?document.startViewTransition(async()=>{await a.renderPage(),window.scrollTo(0,0)}):(await a.renderPage(),window.scrollTo(0,0))};"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/bogor-kasohor-app/sw.js").then(c=>{console.log("Service Worker berhasil didaftarkan:",c.scope)}).catch(c=>{console.error("Pendaftaran Service Worker gagal:",c)})}),await o(),window.addEventListener("hashchange",async()=>{await o()})});
