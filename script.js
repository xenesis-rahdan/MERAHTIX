  // CHANGE TO SWITCH PAGES
  // Options: "open" / "soldout" / "comingsoon"
  const STATUS        = "comingsoon";
  const CATEGORY_NAME = "Presale";
  const TICKET_PRICE  = 25000;
  const MAX_QTY       = 1;

  document.getElementById('ticket-name').textContent  = CATEGORY_NAME;
  document.getElementById('ticket-price').textContent = 'Rp ' + TICKET_PRICE.toLocaleString('id-ID') + ' / tiket';

  // ── Apps Script URL ──
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxRe18WE5j9-yHxCEyWg4obC-MCI3oVk4-jZEq__EeqHdu4aYtx9japEHhAb-UWlu-qow/exec";

  // Pages start all hidden — fetch decides which one to show
  document.getElementById('page-form').style.display       = 'none';
  document.getElementById('page-soldout').style.display    = 'none';
  document.getElementById('page-comingsoon').style.display = 'none';

  // ── FETCH 1 ──
  fetch(APPS_SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      const remaining = data.remaining;

      if (STATUS === "soldout") {
        document.getElementById('page-soldout').style.display = 'block';
        return;
      }
      if (STATUS === "comingsoon") {
        document.getElementById('page-comingsoon').style.display = 'block';
        return;
      }
      if (remaining <= 0) {
        document.getElementById('page-soldout').style.display = 'block';
        return;
      }
      document.getElementById('page-form').style.display = 'block';
      const el = document.getElementById('ticket-remaining');
      if (remaining <= 5) {
        el.textContent = 'Tersisa ' + remaining + ' tiket!';
        el.className   = 'ticket-remaining low';
      } else if (remaining <= 10) {
        el.textContent = 'Tersisa ' + remaining + ' tiket';
        el.className   = 'ticket-remaining mid';
      } else {
        el.textContent = 'Tersisa ' + remaining + ' tiket';
        el.className   = 'ticket-remaining ok';
      }
    })
    .catch(() => {
      document.getElementById('page-form').style.display       = STATUS === "open"       ? 'block' : 'none';
      document.getElementById('page-soldout').style.display    = STATUS === "soldout"    ? 'block' : 'none';
      document.getElementById('page-comingsoon').style.display = STATUS === "comingsoon" ? 'block' : 'none';
    });

  // Format: "Month Day, Year HH:MM:SS"

 if (STATUS === "soldout") {
  var countDownDate = new Date("June 21, 2026 18:00:00").getTime();

  var countdownInterval = setInterval(function() {
    var now      = new Date().getTime();
    var distance = countDownDate - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown').innerHTML =
        '<p class="countdown-expired">Penjualan tiket telah dibuka! 🎭</p>';
      return;
    }

    var days    = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('sd-days').textContent    = String(days).padStart(2, '0');
    document.getElementById('sd-hours').textContent   = String(hours).padStart(2, '0');
    document.getElementById('sd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('sd-seconds').textContent = String(seconds).padStart(2, '0');
  }, 1000);
 }

 if (STATUS === "comingsoon") {
  var countDownDate = new Date("May 18, 2026 18:00:00").getTime();

  var countdownInterval = setInterval(function() {
    var now      = new Date().getTime();
    var distance = countDownDate - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown').innerHTML =
        '<p class="countdown-expired">Penjualan tiket telah dibuka! 🎭</p>';
      return;
    }

    var days    = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent    = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent   = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }, 1000);
 }

  // ── Ticket logic ──────────────────────────────────
  const prices = { ticket: TICKET_PRICE };
  const qty    = { ticket: 0 };

  function changeQty(type, delta) {
    qty[type] = Math.max(0, Math.min(MAX_QTY, qty[type] + delta));
    document.getElementById('qty-' + type).value = qty[type];
    updateSummary();
  }

  function updateSummary() {
    const fmt = n => 'Rp ' + n.toLocaleString('id-ID');
    document.getElementById('s-ticket').textContent  = qty.ticket;
    document.getElementById('sv-ticket').textContent = fmt(qty.ticket * prices.ticket);
    const total = qty.ticket * prices.ticket;
    document.getElementById('sv-total').textContent = fmt(total);
  }

  function handleFile(input) {
    const fn = document.getElementById('file-name');
    if (input.files.length > 0) {
      fn.textContent = '✓ ' + input.files[0].name;
      fn.style.display = 'block';
    }
  }

  const zone = document.getElementById('upload-zone');
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop',      e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const dt = e.dataTransfer;
    if (dt.files.length) {
      document.getElementById('payment-proof').files = dt.files;
      handleFile(document.getElementById('payment-proof'));
    }
  });

  function handleSubmit() {
    const name  = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const totalTickets = qty.ticket;
    const file  = document.getElementById('payment-proof').files[0];

    if (!name || !email || !phone) {
      alert('Mohon isi informasi pembeli.');
      return;
    }
    if (totalTickets === 0) {
      alert('Mohon pilih minimal 1 tiket untuk dibeli.');
      return;
    }
    if (!file) {
      alert('Mohon unggah bukti pembayaran.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {

      const base64 = reader.result.split(',')[1];

      const payload = {
        Nama:           name,
        Email:          email,
        Telepon:        phone,
        JumlahTiket:    totalTickets,
        TotalHarga:     "Rp " + (totalTickets * TICKET_PRICE).toLocaleString('id-ID'),
        BuktiBayarData: base64,
        BuktiBayarNama: file.name,
        BuktiBayarTipe: file.type
      };

      const btn = document.querySelector('.submit-btn');
      btn.innerHTML = '<span class="spinner"></span>Mengirim...';
      btn.disabled = true;

      // ── FETCH 2 ──────────────────
      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(json => {
        if (json.result === "success") {
          document.getElementById('form-content').style.display = 'none';
          document.getElementById('success-msg').style.display  = 'block';
          btn.disabled = false;
        } else {
          alert('Ada kesalahan: ' + (json.message || 'Mohon coba lagi.'));
          btn.innerHTML = 'Kirim →';
          btn.disabled = false;
        }
      })
      .catch(() => {
        alert('Tidak ada koneksi. Mohon coba lagi.');
        btn.innerHTML = 'Kirim →';
        btn.disabled = false;
      });
    };
  }
