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
    { id: 6, cat: 'Casa nova', name: 'Liquidificador', desc: 'Sucos, vitaminas e receitas de família.', price: 220, icon: ICONS.liquidificador },
    { id: 7, cat: 'Lua de mel', name: 'Cota das passagens', desc: 'Uma ajudinha para levar os noivos até o destino.', price: 500, icon: ICONS.aviao },
    { id: 8, cat: 'Lua de mel', name: 'Jantar romântico', desc: 'Uma noite especial durante a lua de mel.', price: 250, icon: ICONS.jantar }
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
  burger.addEventListener('click', function () { setMenu(!navMobile.classList.contains('open')); });
  navMobile.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });

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
  $('pix-key').textContent = PIX_KEY;
  var filter = 'Todos';
  var filtersEl = $('filters'), grid = $('gift-grid');
  function renderFilters() {
    filtersEl.innerHTML = '';
    ['Todos', 'Casa nova', 'Lua de mel'].forEach(function (f) {
      var b = el('button', null, f); b.type = 'button';
      b.setAttribute('aria-pressed', f === filter ? 'true' : 'false');
      b.addEventListener('click', function () { filter = f; renderFilters(); renderGifts(); });
      filtersEl.appendChild(b);
    });
  }
  function renderGifts() {
    grid.innerHTML = '';
    GIFTS.filter(function (g) { return filter === 'Todos' || g.cat === filter; }).forEach(function (g) {
      var art = el('article', 'gift');
      var img = el('div', 'gift-img');
      img.appendChild(icon(g.icon, 64, '#A6864E', 1));
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
  renderFilters(); renderGifts();

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

  $('step-form').addEventListener('submit', function (e) {
    e.preventDefault();
    // TODO: salvar nome + mensagem + presente (banco de dados / e-mail).
    var code = pixCode(current.price);
    $('pix-code').value = code;
    $('qr-img').src = qrSrc(code);
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
