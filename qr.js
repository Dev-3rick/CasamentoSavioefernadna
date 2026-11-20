function qrMatrix(text) {
  var V = [null, [26, 10, [16]], [44, 16, [28]], [70, 26, [44]], [100, 18, [32, 32]], [134, 24, [43, 43]], [172, 16, [27, 27, 27, 27]], [196, 18, [31, 31, 31, 31]], [242, 22, [38, 38, 39, 39]], [292, 22, [36, 36, 36, 37, 37]], [346, 26, [43, 43, 43, 43, 44]]];
  var AL = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
  function gmul(x, y) { var z = 0; for (var i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 255; }
  function rsDiv(deg) { var r = []; for (var i = 0; i < deg; i++) r.push(0); r[deg - 1] = 1; var root = 1; for (var i = 0; i < deg; i++) { for (var j = 0; j < deg; j++) { r[j] = gmul(r[j], root); if (j + 1 < deg) r[j] ^= r[j + 1]; } root = gmul(root, 2); } return r; }
  function rsRem(data, div) { var r = div.map(function () { return 0; }); data.forEach(function (b) { var f = b ^ r.shift(); r.push(0); for (var i = 0; i < r.length; i++) r[i] ^= gmul(div[i], f); }); return r; }
  var bytes = []; for (var i = 0; i < text.length; i++) bytes.push(text.charCodeAt(i) & 255);
  var ver, cap;
  for (ver = 1; ver <= 10; ver++) { cap = V[ver][2].reduce(function (a, b) { return a + b; }, 0) * 8; if (4 + (ver < 10 ? 8 : 16) + bytes.length * 8 <= cap) break; }
  if (ver > 10) return null;
  var bits = [];
  function put(v, n) { for (var i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1); }
  put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(function (b) { put(b, 8); });
  put(0, Math.min(4, cap - bits.length)); while (bits.length % 8) bits.push(0);
  var data = [];
  for (var i = 0; i < bits.length; i += 8) { var v = 0; for (var j = 0; j < 8; j++) v = (v << 1) | bits[i + j]; data.push(v); }
  for (var pad = 0xEC; data.length < cap / 8; pad ^= 0xEC ^ 0x11) data.push(pad);
  var ecLen = V[ver][1], div = rsDiv(ecLen), blocks = [], eccs = [], k = 0, maxLen = 0;
  V[ver][2].forEach(function (len) { var d = data.slice(k, k + len); k += len; blocks.push(d); eccs.push(rsRem(d, div)); if (len > maxLen) maxLen = len; });
  var cw = [];
  for (var i = 0; i < maxLen; i++) blocks.forEach(function (b) { if (i < b.length) cw.push(b[i]); });
  for (var i = 0; i < ecLen; i++) eccs.forEach(function (e) { cw.push(e[i]); });
  var size = ver * 4 + 17, m = [], fn = [];
  for (var y = 0; y < size; y++) { m.push([]); fn.push([]); for (var x = 0; x < size; x++) { m[y].push(false); fn[y].push(false); } }
  function set(x, y, d) { m[y][x] = d; fn[y][x] = true; }
  function bit(x, i) { return ((x >>> i) & 1) !== 0; }
  for (var i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  [[3, 3], [size - 4, 3], [3, size - 4]].forEach(function (p) {
    for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) { var xx = p[0] + dx, yy = p[1] + dy; if (xx >= 0 && xx < size && yy >= 0 && yy < size) { var dist = Math.max(Math.abs(dx), Math.abs(dy)); set(xx, yy, dist !== 2 && dist !== 4); } }
  });
  var al = AL[ver], last = al.length - 1;
  for (var i = 0; i < al.length; i++) for (var j = 0; j < al.length; j++) {
    if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) continue;
    for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) set(al[i] + dx, al[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }
  function drawFormat(mask) {
    var d = (0 << 3) | mask, r = d;
    for (var i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    var b = ((d << 10) | r) ^ 0x5412;
    for (var i = 0; i <= 5; i++) set(8, i, bit(b, i));
    set(8, 7, bit(b, 6)); set(8, 8, bit(b, 7)); set(7, 8, bit(b, 8));
    for (var i = 9; i < 15; i++) set(14 - i, 8, bit(b, i));
    for (var i = 0; i < 8; i++) set(size - 1 - i, 8, bit(b, i));
    for (var i = 8; i < 15; i++) set(8, size - 15 + i, bit(b, i));
    set(8, size - 8, true);
  }
  drawFormat(0);
  if (ver >= 7) {
    var r = ver; for (var i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
    var vb = (ver << 12) | r;
    for (var i = 0; i < 18; i++) { var a = size - 11 + i % 3, c = Math.floor(i / 3), bb = bit(vb, i); set(a, c, bb); set(c, a, bb); }
  }
  var idx = 0;
  for (var right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (var vert = 0; vert < size; vert++) for (var j = 0; j < 2; j++) {
      var x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
      if (!fn[y][x] && idx < cw.length * 8) { m[y][x] = bit(cw[idx >>> 3], 7 - (idx & 7)); idx++; }
    }
  }
  for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) if (!fn[y][x] && (x + y) % 2 === 0) m[y][x] = !m[y][x];
  drawFormat(0);
  return m;
}
