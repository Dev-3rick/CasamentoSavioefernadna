(function () {
  'use strict';

  // ---------- Configuração do Pix ----------
  var PIX_KEY = '0cdd563b-2edd-451b-8478-d2ee94b38b1f';
  var PIX_NAME = 'FERNANDA E SAVIO'; // até 25 caracteres, sem acento
  var PIX_CITY = 'BARAO DE COCAIS';  // até 15 caracteres, sem acento

  // ---------- Dados ----------
  var ICONS = {
    geladeira: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM6 9h12M9 4.5v2.5M9 11.5v3.5',
    cama: 'M3 19V7M3 14h18v5M21 14v-1a3 3 0 0 0-3-3h-6v4M6 12a1.6 1.6 0 1 0 0-.01',
    panelas: 'M4 11h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM2 11h2M20 11h2M9 8c0-1 1-1.5 1-3M14 8c0-1 1-1.5 1-3',
    cafe: 'M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2.5M12 3.5v2.5',
    toalhas: 'M6 3h12v14H6zM6 7h12M8 17v4M16 17v4M8 21h8',
    liquidificador: 'M8 3h8l-1 11H9zM7 14h10v6H7zM10 3V1.5h4V3M11 17h2',
    aviao: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
    jantar: 'M8 3h4l-.5 5a1.5 1.5 0 0 1-3 0zM10 9.5V20M7.5 20h5M14 3h4l-.5 5a1.5 1.5 0 0 1-3 0zM16 9.5V20M13.5 20h5'
  };
  var GIFTS = [
    { id: 1, cat: 'Casa nova', name: 'Geladeira', desc: 'Para a cozinha da casa nova começar bem abastecida.', price: 3200, icon: ICONS.geladeira },
    { id: 2, cat: 'Casa nova', name: 'Jogo de cama casal', desc: 'Lençóis macios para as primeiras noites no lar.', price: 350, icon: ICONS.cama },
    { id: 3, cat: 'Casa nova', name: 'Jogo de panelas', desc: 'Para os jantares a dois (e os almoços de domingo).', price: 600, icon: ICONS.panelas },
    { id: 4, cat: 'Casa nova', name: 'Cafeteira', desc: 'O café da manhã de recém-casados agradece.', price: 280, icon: ICONS.cafe },
    { id: 5, cat: 'Casa nova', name: 'Jogo de toalhas', desc: 'Enxoval de banho completo para a casa nova.', price: 180, icon: ICONS.toalhas },
    { id: 6, cat: 'Casa nova', name: 'Liquidificador', desc: 'Sucos, vitaminas e receitas de família.', price: 220, icon: ICONS.liquidificador }
  ];
  function ig(name, handle) { return { name: name, handle: '@' + handle, url: 'https://www.instagram.com/' + handle + '/' }; }
  var INDICACOES = [
    { title: 'Maquiagem', cities: [
      { name: 'Barão de Cocais', people: [ig('Lygia', 'lygiaguimaraes'), ig('Alexia', 'alexiar_makeup'), ig('Tais', 'taismoraes_makeup')] },
      { name: 'Santa Bárbara', people: [ig('Iane', 'ianeg_makeup'), ig('Franciele', 'franci_caroline'), ig('Espaço GP', 'espaco_gp_')] }
    ] },
    { title: 'Cabelo & penteado', cities: [
      { name: 'Barão de Cocais', people: [ig('Renata', 'renatafernandes.penteados'), ig('Daniela', 'daniela_gandrapenteados'), ig('Luciana', 'penteadoslucianaleite')] },
      { name: 'Santa Bárbara', people: [ig('Iane', 'ianeg_makeup'), ig('Espaço GP', 'espaco_gp_')] }
    ] }
  ];
  var TARGET = new Date('2027-08-21T09:30:00-03:00').getTime();

  // ---------- Utilidades ----------
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function brl(v) { return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function icon(d, size, stroke, width) {
    var s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('width', size); s.setAttribute('height', size); s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('fill', 'none'); s.setAttribute('stroke', stroke); s.setAttribute('stroke-width', width);
    s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(SVGNS, 'path'); p.setAttribute('d', d); s.appendChild(p);
    return s;
  }

  // ---------- Pix (BR Code estático, padrão Banco Central) ----------
  function emv(id, v) { return id + (v.length < 10 ? '0' : '') + v.length + v; }
  function crc16(s) {
    var c = 0xFFFF;
    for (var i = 0; i < s.length; i++) {
      c ^= s.charCodeAt(i) << 8;
      for (var j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
    }
    var h = c.toString(16).toUpperCase();
    while (h.length < 4) h = '0' + h;
    return h;
  }
  function pixCode(amount) {
    var p = emv('00', '01') + emv('26', emv('00', 'br.gov.bcb.pix') + emv('01', PIX_KEY)) + emv('52', '0000') + emv('53', '986') +
      emv('54', amount.toFixed(2)) + emv('58', 'BR') + emv('59', PIX_NAME) + emv('60', PIX_CITY) + emv('62', emv('05', '***')) + '6304';
    return p + crc16(p);
  }
  function qrSrc(text) {
    var m = qrMatrix(text);
    if (!m) return '';
    var n = m.length, d = '';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (m[r][c]) d += 'M' + (c + 4) + ' ' + (r + 4) + 'h1v1h-1z';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (n + 8) + ' ' + (n + 8) + '" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#2E2820"/></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // ---------- Menu mobile ----------
  var burger = $('burger'), navMobile = $('nav-mobile');
  function setMenu(open) {
    navMobile.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    $('burger-icon').setAttribute('d', open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16');
  }
  burger.addEventListener('click', function () { setMenu(!navMobile.classList.contains('open')); updateHeader(); });
  navMobile.addEventListener('click', function (e) { if (e.target.tagName === 'A') { setMenu(false); updateHeader(); } });

  // Cápsula de vidro: transparente sobre a foto, clara depois que rola
  var header = $('site-header');
  function updateHeader() {
    var solid = window.scrollY > 60 || navMobile.classList.contains('open');
    header.classList.toggle('solid', solid);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ---------- Faixa (letreiro) ----------
  var MARQUEE = ['Fernanda & Sávio', '21 de agosto de 2027', 'Santuário de São João Batista · 9h30', 'Recepção no Rancho Coyote', 'Barão de Cocais', 'Traje esporte fino', 'Confirme sua presença'];
  var track = $('marquee-track');
  [0, 1].forEach(function (copy) {
    MARQUEE.forEach(function (t) {
      var s = el('span', null, t); if (copy) s.setAttribute('aria-hidden', 'true');
      var i = el('i'); i.setAttribute('aria-hidden', 'true');
      track.appendChild(s); track.appendChild(i);
    });
  });

  // ---------- Hospedagem + mapa ----------
  var IGREJA = { name: 'Santuário de São João Batista', lat: -19.9454687, lng: -43.487551, pid: 'ChIJEYKZ59k3pAARlE9CPQ885sg' };
  var FESTA = { name: 'Rancho Coyote', lat: -19.9131134, lng: -43.4552026, pid: 'ChIJwZF2e5pJpAARABYKZubaoVM' };
  var HOTEIS = [
    { name: 'Impar Suítes', phone: '(31) 3860-2300', city: 'Barão de Cocais', addr: 'Av. Hortelina de Lima e Souza, 302 — Cidade Nova', lat: -19.9384517, lng: -43.472908, pid: 'ChIJicb_Ns9JpAARu4HScyOV2Qk' },
    { name: 'Estância Peti Pousada', phone: '(31) 99589-2425', city: 'Barão de Cocais', addr: 'Zona rural de Barão de Cocais', lat: -19.9071691, lng: -43.4401477, pid: 'ChIJ8azDU9FLpAARZxpwjm9-7tI' },
    { name: 'Hotel Real', phone: '(31) 3837-1726', city: 'Barão de Cocais', addr: 'R. Conceição Caldeira, 11 — Progresso', lat: -19.9353654, lng: -43.4763662, pid: 'ChIJu-sZdC1IpAARfYbHGQx-YlA' },
    { name: 'Hotel Senhor do Barão', phone: '(31) 3837-1345', city: 'Barão de Cocais', addr: 'R. Dr. Antônio Soeiro, 13 — Vila Regina', lat: -19.9402411, lng: -43.478769, pid: 'ChIJMSE30CxIpAARD4XgDbirTvw' },
    { name: 'Pousada & Restaurante Vila Cocais', phone: '(31) 99867-1919', city: 'Cocais · Barão de Cocais', addr: 'R. Aristides Augusto da Fonseca, 270 — Cocais', lat: -19.8632235, lng: -43.4544435, pid: 'ChIJ-20YgN5KpAARSxdacSiRggk' }
  ];
  function telUrl(p) { return 'tel:+55' + p.replace(/\D/g, ''); }
  function km(a, b) {
    var R = 6371, toR = Math.PI / 180, dLat = (b.lat - a.lat) * toR, dLng = (b.lng - a.lng) * toR;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }
  function fmtKm(v) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' km'; }
  function placeUrl(p) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.name + ' ' + (p.city || 'Barão de Cocais')) + '&query_place_id=' + p.pid; }
  function routeUrl(from, to) { return 'https://www.google.com/maps/dir/?api=1&origin=' + from.lat + ',' + from.lng + '&destination=' + encodeURIComponent(to.name) + '&destination_place_id=' + to.pid; }
  HOTEIS.forEach(function (h, i) { h.n = i + 1; h.dIgreja = km(h, IGREJA); h.dFesta = km(h, FESTA); });

  var stayFilter = 'Todas', activeHotel = null, map = null, hotelMarkers = {};
  function renderStayFilter() {
    var f = $('stay-filter'); f.innerHTML = '';
    ['Todas', 'Barão de Cocais', 'Cocais', 'Santa Bárbara'].forEach(function (c) {
      var b = el('button', null, c); b.type = 'button';
      b.setAttribute('aria-pressed', c === stayFilter ? 'true' : 'false');
      b.addEventListener('click', function () { stayFilter = c; renderStayFilter(); renderStayList(); fitMap(); });
      f.appendChild(b);
    });
  }
  function visibleHotels() { return HOTEIS.filter(function (h) { return stayFilter === 'Todas' || h.city === stayFilter; }); }
  function renderStayList() {
    var list = $('stay-list'); list.innerHTML = '';
    visibleHotels().forEach(function (h) {
      var card = el('div', 'hotel' + (activeHotel === h.n ? ' active' : ''));
      card.setAttribute('role', 'button'); card.tabIndex = 0;
      card.setAttribute('aria-label', h.name + ', ' + h.city + '. Mostrar no mapa');
      card.appendChild(el('span', 'hotel-num', String(h.n)));
      var t = el('span', 'hotel-txt');
      t.appendChild(el('span', 'hotel-city', h.city));
      t.appendChild(el('span', 'hotel-name', h.name));
      t.appendChild(el('span', 'hotel-dist', fmtKm(h.dIgreja) + ' da igreja · ' + fmtKm(h.dFesta) + ' da festa'));
      var links = el('span', 'hotel-links');
      var a1 = el('a', null, 'Ver local'); a1.href = placeUrl(h); a1.target = '_blank'; a1.rel = 'noopener';
      var a2 = el('a', null, 'Rota até a festa'); a2.href = routeUrl(h, FESTA); a2.target = '_blank'; a2.rel = 'noopener';
      var a3 = el('a', 'tel', 'Ligar ' + h.phone); a3.href = telUrl(h.phone);
      [a1, a2, a3].forEach(function (a) { a.addEventListener('click', function (e) { e.stopPropagation(); }); links.appendChild(a); });
      t.appendChild(links);
      card.appendChild(t);
      function pick() { focusHotel(h); }
      card.addEventListener('click', pick);
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      list.appendChild(card);
    });
  }
  function focusHotel(h) {
    activeHotel = h.n; renderStayList();
    Object.keys(hotelMarkers).forEach(function (k) {
      var m = hotelMarkers[k]; var elx = m.getElement && m.getElement();
      if (elx) elx.querySelector('.pin').classList.toggle('active', Number(k) === h.n);
    });
    if (map) { map.flyTo([h.lat, h.lng], 15, { duration: .8 }); hotelMarkers[h.n].openPopup(); }
  }
  function fitMap() {
    if (!map) return;
    var pts = [[IGREJA.lat, IGREJA.lng], [FESTA.lat, FESTA.lng]].concat(visibleHotels().map(function (h) { return [h.lat, h.lng]; }));
    map.fitBounds(pts, { padding: [40, 40], maxZoom: 14 });
  }
  function pinIcon(cls, label, size) {
    return L.divIcon({ className: '', html: '<div class="pin ' + cls + '">' + label + '</div>', iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2] });
  }
  function initMap() {
    if (typeof L === 'undefined') { $('map-fallback').textContent = 'Não foi possível carregar o mapa. Use os links “Ver local” e “Rota”.'; return; }
    $('map-fallback').hidden = true;
    map = L.map('mapa', { scrollWheelZoom: false, zoomControl: true, attributionControl: false });
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Base &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap'
    }).addTo(map);
    L.marker([-19.9468, -43.4795], { interactive: false, keyboard: false, icon: L.divIcon({ className: '', html: '<div class="map-city">Barão de Cocais</div>', iconSize: [160, 20], iconAnchor: [80, -14] }) }).addTo(map);
    var church = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M10 4h4M5 21V11l7-5 7 5v10M3 21h18"/></svg>';
    var glass = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h4l-.5 5a1.5 1.5 0 0 1-3 0zM10 9.5V20M7.5 20h5M14 3h4l-.5 5a1.5 1.5 0 0 1-3 0zM16 9.5V20M13.5 20h5"/></svg>';
    L.marker([IGREJA.lat, IGREJA.lng], { icon: pinIcon('pin-church', church, 24), zIndexOffset: 1000, title: 'Igreja' }).addTo(map)
      .bindPopup('<strong>' + IGREJA.name + '</strong><br>Cerimônia · 9h30<br><a href="' + placeUrl(IGREJA) + '" target="_blank" rel="noopener">Ver no Google Maps</a>');
    L.marker([FESTA.lat, FESTA.lng], { icon: pinIcon('pin-party', glass, 24), zIndexOffset: 1000, title: 'Festa' }).addTo(map)
      .bindPopup('<strong>' + FESTA.name + '</strong><br>Recepção<br><a href="' + placeUrl(FESTA) + '" target="_blank" rel="noopener">Ver no Google Maps</a>');
    HOTEIS.forEach(function (h) {
      var m = L.marker([h.lat, h.lng], { icon: pinIcon('pin-hotel', String(h.n), 20), title: h.name }).addTo(map);
      m.bindPopup('<strong>' + h.name + '</strong><br>' + h.city + '<br>' + fmtKm(h.dIgreja) + ' da igreja · ' + fmtKm(h.dFesta) + ' da festa<br><a href="' + routeUrl(h, FESTA) + '" target="_blank" rel="noopener">Rota até a festa</a><br><a href="' + telUrl(h.phone) + '">Ligar ' + h.phone + '</a>');
      m.on('click', function () { activeHotel = h.n; renderStayList(); });
      hotelMarkers[h.n] = m;
    });
    fitMap();
  }
  renderStayList();
  if (document.readyState === 'complete') initMap(); else window.addEventListener('load', initMap);

  // ---------- Contagem regressiva ----------
  function tick() {
    var diff = Math.max(0, TARGET - Date.now());
    $('cd-d').textContent = String(Math.floor(diff / 86400000));
    $('cd-h').textContent = pad(Math.floor(diff / 3600000) % 24);
    $('cd-m').textContent = pad(Math.floor(diff / 60000) % 60);
    $('cd-s').textContent = pad(Math.floor(diff / 1000) % 60);
  }
  tick(); setInterval(tick, 1000);

  // ---------- Indicações ----------
  var IG_ICON = 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM17.5 6.5h.01';
  var indGrid = $('ind-grid');
  INDICACOES.forEach(function (cat) {
    var card = el('div', 'ind-card');
    card.appendChild(el('h3', null, cat.title));
    cat.cities.forEach(function (city) {
      var box = el('div', 'ind-city');
      box.appendChild(el('p', 'eyebrow', city.name));
      city.people.forEach(function (p) {
        var a = el('a', 'ig-row'); a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
        a.setAttribute('aria-label', p.name + ' (' + p.handle + ') no Instagram');
        var ic = el('span', 'ig-ic'); ic.appendChild(icon(IG_ICON, 18, 'currentColor', 1.4)); a.appendChild(ic);
        var t = el('span', 'ig-txt'); t.appendChild(el('span', 'ig-name', p.name)); t.appendChild(el('span', 'ig-handle', p.handle)); a.appendChild(t);
        a.appendChild(el('span', 'ig-go', 'Ver perfil'));
        box.appendChild(a);
      });
      card.appendChild(box);
    });
    indGrid.appendChild(card);
  });

  // ---------- Confirmação de presença ----------
  // TODO: enviar para um banco de dados / e-mail. Hoje só mostra a confirmação na tela.
  $('rsvp-form').addEventListener('submit', function (e) {
    e.preventDefault();
    $('rsvp-form').hidden = true; $('rsvp-done').hidden = false;
  });
  $('rsvp-reset').addEventListener('click', function () {
    $('rsvp-form').reset(); $('rsvp-form').hidden = false; $('rsvp-done').hidden = true;
  });

  // ---------- Lista de presentes ----------
  var grid = $('gift-grid');
  function renderGifts() {
    grid.innerHTML = '';
    GIFTS.forEach(function (g) {
      var art = el('article', 'gift');
      var img = el('div', 'gift-img');
      img.appendChild(icon(g.icon, 64, '#9A7352', 1));
      img.appendChild(el('span', 'gift-cat', g.cat));
      art.appendChild(img);
      var body = el('div', 'gift-body');
      body.appendChild(el('h3', null, g.name));
      body.appendChild(el('p', 'd', g.desc));
      body.appendChild(el('p', 'p', brl(g.price)));
      var btn = el('button', 'btn-gold', 'Presentear'); btn.type = 'button';
      btn.addEventListener('click', function () { openGift(g); });
      body.appendChild(btn);
      art.appendChild(body);
      grid.appendChild(art);
    });
  }
  renderGifts();
  var LUA = { id: 99, cat: 'Lua de mel', name: 'Lua de mel', desc: 'Contribuição livre para a viagem dos noivos.', price: 200, icon: ICONS.aviao };
  $('lua-btn').addEventListener('click', function () { openGift(LUA); });

  // ---------- Checkout ----------
  var modal = $('modal'), current = null, lastFocus = null;
  function showStep(step) {
    $('step-form').hidden = step !== 'form';
    $('step-pix').hidden = step !== 'pix';
    $('step-done').hidden = step !== 'done';
    $('step-label').textContent = { form: 'Finalizar presente', pix: 'Pagamento via Pix', done: 'Presente enviado' }[step];
  }
  function openGift(g) {
    current = g; lastFocus = document.activeElement;
    $('sel-icon').setAttribute('d', g.icon);
    $('sel-name').textContent = g.name;
    $('sel-price').textContent = brl(g.price);
    $('sel-total').textContent = brl(g.price);
    $('step-form').reset();
    $('copy-btn').textContent = 'Copiar';
    showStep('form');
    modal.hidden = false; document.body.style.overflow = 'hidden';
    setTimeout(function () { $('gift-nome').focus(); }, 30);
  }
  function closeModal() {
    modal.hidden = true; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $('modal-close').addEventListener('click', closeModal);
  $('back-list').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  function parseAmt(s) { var v = parseFloat(String(s).replace(/\s/g, '').replace(/\./g, function (m, i, str) { return str.indexOf(',') >= 0 ? '' : m; }).replace(',', '.')); return isNaN(v) ? 0 : Math.round(v * 100) / 100; }
  function updatePix() {
    var amt = parseAmt($('pix-valor').value), ok = amt > 0 && amt < 1000000;
    $('sel-price').textContent = ok ? brl(amt) : 'Valor livre';
    $('copy-btn').textContent = 'Copiar';
    if (ok) {
      var code = pixCode(amt);
      $('pix-code').value = code;
      $('qr-img').src = qrSrc(code); $('qr-img').hidden = false; $('qr-msg').hidden = true;
    } else {
      $('pix-code').value = ''; $('qr-img').hidden = true; $('qr-msg').hidden = false;
    }
  }
  $('pix-valor').addEventListener('input', updatePix);
  $('step-form').addEventListener('submit', function (e) {
    e.preventDefault();
    // TODO: salvar nome + mensagem + presente (banco de dados / e-mail).
    $('pix-valor').value = String(current.price);
    $('amt-hint').textContent = current.id === 99 ? 'Valor sugerido — você pode colocar quanto quiser.' : 'Valor do presente: ' + brl(current.price) + ' — você pode ajustar, se preferir.';
    updatePix();
    showStep('pix');
  });
  $('copy-btn').addEventListener('click', function () {
    var code = $('pix-code').value, btn = this;
    function ok() { btn.textContent = 'Copiado'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(ok, function () { $('pix-code').select(); document.execCommand('copy'); ok(); });
    } else { $('pix-code').select(); document.execCommand('copy'); ok(); }
  });
  $('pix-done').addEventListener('click', function () { showStep('done'); });
})();
