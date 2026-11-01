/* Motor de misiones exprés · UPSRJ · Designed and built by Chipo
   Pinta una misión a partir de su archivo mision.json.
   Tipos de paso: respuesta, caso, ficha, ia, entrega. */
(function () {
  'use strict';
  var API = (window.MISIONES_CONFIG && window.MISIONES_CONFIG.API_URL) || '';
  var app = document.getElementById('app');
  var M = null, KEY = '', data = {};


  // ---------- textos de la interfaz (es / en) ----------
  var TXT = {
    es: { sendFirst: 'Antes de enviar, escribe tu nombre y elige tu grupo en la parte de arriba de la página.', test: 'Modo de prueba: esta página todavía no está conectada a la hoja del docente, así que no se envió nada.',
      sending: 'Enviando…', sent: '✓ Enviado el {d} · Si corriges algo, puedes volver a enviarlo: cuenta el último envío.', fail: 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo; lo que escribiste sigue guardado en este navegador.',
      copied: '¡Copiado!', send: 'Enviar', open: 'Abre {p}, pega todo en un chat nuevo y envíalo.', copyStep: 'Pulsa <b>Copiar instrucciones y ficha</b>.',
      answer: 'Responde una ronda a la vez. Al terminar, copia el enlace de la conversación (Compartir → Copiar enlace) para tu entrega.',
      copyBtn: 'Copiar instrucciones y ficha', openBtn: 'Abrir {p} ↗', noCopy: 'Si tu navegador no deja copiar, abre «Ver el texto» y cópialo a mano. Puedes usar una cuenta gratuita de {p}.',
      seeText: 'Ver el texto que vas a pegar', sendFinal: 'Enviar mi entrega', copyFicha: 'Copiar mi ficha', finalNote: 'La entrega incluye tu ficha completa y lo que escribas aquí. Si la envías dos veces, el docente toma la última.',
      missing: 'Te falta completar: ', cont: 'Continuar', pause: 'Pausar', start: 'Iniciar', reset: 'Reiniciar', timeUp: '¡Tiempo!', timerHint: 'Tiempo sugerido para este paso.',
      simple: 'Español simplificado', bv: 'Baja visión: letra grande y alto contraste', all: '← Todas las misiones', fmt: 'Misión exprés',
      who: '¿Quién eres?', whoHint: 'Se usa solo para que el docente reciba tus envíos. Se guarda en este navegador.', name: 'Nombre completo', id: 'Matrícula', group: 'Grupo', choose: 'Elige…',
      listen: '🔊 Escuchar', stop: '⏹ Detener', noVoice: 'Sin voz en este navegador', listenAria: 'Escuchar este paso en voz alta', saved: 'Guardado en este navegador.',
      caseText: 'El caso por escrito', noVideo: 'Tu navegador no reproduce video. Lee el caso abajo.', docs: 'Para documentarte', gate: 'Completa tu ficha del paso anterior para habilitar este paso.',
      loadFail: '<h1>No se pudo cargar la misión</h1><p>Recarga la página. Si el problema sigue, avisa a tu docente.</p>', voice: 'es-MX', locale: 'es-MX', q: ['«', '»'] },
    en: { sendFirst: 'Before sending, write your name and choose your group at the top of the page.', test: 'Test mode: this page is not connected to your tutor’s sheet yet, so nothing was sent.',
      sending: 'Sending…', sent: '✓ Sent on {d} · If you correct something, you can send it again: the last one counts.', fail: 'It could not be sent. Check your connection and try again; your work is still saved in this browser.',
      copied: 'Copied!', send: 'Send', open: 'Open {p}, paste everything into a new chat and send it.', copyStep: 'Press <b>Copy instructions and card</b>.',
      answer: 'Answer one round at a time. When you finish, copy the link to the conversation (Share → Copy link) for your final delivery.',
      copyBtn: 'Copy instructions and card', openBtn: 'Open {p} ↗', noCopy: 'If your browser does not let you copy, open “See the text” and copy it by hand. A free {p} account is enough.',
      seeText: 'See the text you will paste', sendFinal: 'Send my final delivery', copyFicha: 'Copy my card', finalNote: 'Your delivery includes your whole decision card and what you write here. If you send it twice, your tutor takes the last one.',
      missing: 'You still need to complete: ', cont: 'Continue', pause: 'Pause', start: 'Start', reset: 'Reset', timeUp: 'Time!', timerHint: 'Suggested time for this step.',
      simple: 'Simple English', bv: 'Low vision: large text and high contrast', all: '← All missions', fmt: 'Express mission',
      who: 'Who are you?', whoHint: 'Only used so that your tutor receives what you send. It is saved in this browser.', name: 'Full name', id: 'Student ID', group: 'Group', choose: 'Choose…',
      listen: '🔊 Listen', stop: '⏹ Stop', noVoice: 'No voice in this browser', listenAria: 'Listen to this step', saved: 'Saved in this browser.',
      caseText: 'The case in writing', noVideo: 'Your browser cannot play video. Read the case below.', docs: 'Before you decide', gate: 'Complete your card in the previous step to unlock this step.',
      loadFail: '<h1>The mission could not load</h1><p>Reload the page. If it still fails, tell your tutor.</p>', voice: 'en-US', locale: 'en-US', q: ['“', '”'] }
  };
  function T(k, vars) { var t = (TXT[(M && M.idioma) || 'es'] || TXT.es)[k]; if (vars) Object.keys(vars).forEach(function (v) { t = t.replace('{' + v + '}', vars[v]); }); return t; }

  // ---------- utilidades ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function h(tag, attrs, html) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] != null) el.setAttribute(k, attrs[k]); });
    if (html != null) el.innerHTML = html;
    return el;
  }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return v === undefined ? null : false; } }
  function both(full, simple) {
    if (!simple) return full || '';
    return '<div class="full-only">' + (full || '') + '</div><div class="simple-only">' + simple + '</div>';
  }
  function fill(tpl, d) {
    return tpl.replace(/\{(\w+)\}/g, function (_, k) {
      if (k === 'reparto') return repartoTexto(d);
      var v = d[k]; return (v == null || v === '') ? '—' : v;
    });
  }
  function repartoTexto(d) {
    var r = findReparto(); if (!r) return '—';
    var tot = 0;
    var lines = r.filas.map(function (f) { var n = Number(d[f.k] || 0); tot += n; return '  · ' + f.label + ': ' + n.toLocaleString('es-MX'); });
    lines.push('  Total: ' + tot.toLocaleString('es-MX') + ' de ' + r.meta.toLocaleString('es-MX'));
    return '\n' + lines.join('\n');
  }
  function findReparto() {
    var found = null;
    M.pasos.forEach(function (p) { (p.campos || []).forEach(function (c) { if (c.tipo === 'reparto') found = c; }); });
    return found;
  }
  function fichaTexto() { return (M.ficha || []).map(function (l) { return fill(l, data); }).join('\n'); }

  // ---------- campos ----------
  function campo(c) {
    var w = h('div');
    if (c.tipo === 'columnas') {
      var g = h('div', { 'class': 'cols' });
      c.campos.forEach(function (cc) { g.appendChild(campo(cc)); });
      w.appendChild(g); return w;
    }
    var id = 'f-' + c.k;
    var label = '<label class="q" for="' + id + '">' + c.label + (c.hint ? '<span class="hint">' + c.hint + '</span>' : '') + '</label>';
    if (c.tipo === 'radio') {
      w.innerHTML = '<label class="q">' + c.label + (c.hint ? '<span class="hint">' + c.hint + '</span>' : '') + '</label>';
      var rg = h('div', { 'class': 'radios', role: 'radiogroup', 'aria-label': c.label.replace(/<[^>]+>/g, '') });
      c.opciones.forEach(function (o) {
        var val = typeof o === 'string' ? o : o.valor, txt = typeof o === 'string' ? o : o.texto;
        rg.appendChild(h('label', null, '<input type="radio" name="' + c.k + '" value="' + esc(val) + '" data-k="' + c.k + '">' + txt));
      });
      w.appendChild(rg); return w;
    }
    if (c.tipo === 'select') {
      w.innerHTML = label + '<select id="' + id + '" data-k="' + c.k + '"><option value="">' + T('choose') + '</option>' +
        c.opciones.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>';
      return w;
    }
    if (c.tipo === 'reparto') {
      var rows = c.filas.map(function (f) {
        return '<tr><td><label for="f-' + f.k + '">' + f.label + '</label>' + (f.nota ? '<span class="hint">' + f.nota + '</span>' : '') + '</td>' +
          '<td class="num"><input type="number" min="0" step="100" inputmode="numeric" id="f-' + f.k + '" data-k="' + f.k + '"></td></tr>';
      }).join('');
      w.innerHTML = '<label class="q">' + c.label + (c.hint ? '<span class="hint">' + c.hint + '</span>' : '') + '</label>' +
        '<div class="tablewrap"><table class="reparto"><tr><th>Grupo</th><th class="num">Dosis</th></tr>' + rows + '</table></div>' +
        '<p class="total" id="tot-' + c.k + '" aria-live="polite"></p>';
      return w;
    }
    if (c.tipo === 'textarea') { w.innerHTML = label + '<textarea id="' + id + '" data-k="' + c.k + '"></textarea>'; return w; }
    w.innerHTML = label + '<input type="text" id="' + id + '" data-k="' + c.k + '"' + (c.placeholder ? ' placeholder="' + esc(c.placeholder) + '"' : '') + '>';
    return w;
  }

  // ---------- envío ----------
  function who() { return { nombre: (data._nombre || '').trim(), matricula: (data._matricula || '').trim(), grupo: data._grupo || '' }; }
  function send(tipo, payload, statusEl, btn) {
    var w = who();
    if (!w.nombre || !w.grupo) {
      statusEl.className = 'status err';
      statusEl.textContent = T('sendFirst');
      document.getElementById('who').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    var body = { mision: M.id, titulo: M.titulo, tipo: tipo, nombre: w.nombre, matricula: w.matricula, grupo: w.grupo, datos: payload, enviado: new Date().toISOString() };
    if (!API) {
      statusEl.className = 'status err';
      statusEl.textContent = T('test');
      return;
    }
    btn.disabled = true; statusEl.className = 'status'; statusEl.textContent = T('sending');
    fetch(API, { method: 'POST', body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.ok) throw new Error(j.error || 'error');
        statusEl.className = 'status ok';
        statusEl.textContent = T('sent', { d: new Date().toLocaleString(T('locale')) });
        data['_enviado_' + tipo] = new Date().toISOString(); store(KEY, data);
      })
      .catch(function () {
        statusEl.className = 'status err';
        statusEl.textContent = T('fail');
      })
      .then(function () { btn.disabled = false; });
  }
  function collect(keys) { var o = {}; keys.forEach(function (k) { o[k] = data[k] || ''; }); return o; }
  function keysOf(campos) {
    var ks = [];
    (campos || []).forEach(function (c) {
      if (c.tipo === 'columnas') ks = ks.concat(keysOf(c.campos));
      else if (c.tipo === 'reparto') c.filas.forEach(function (f) { ks.push(f.k); });
      else ks.push(c.k);
    });
    return ks;
  }
  function allFichaKeys() { var ks = []; M.pasos.forEach(function (p) { if (p.tipo === 'ficha') ks = ks.concat(keysOf(p.campos)); }); return ks; }

  // ---------- copiar ----------
  function copyText(text, btn) {
    var label = btn.textContent;
    var done = function () { btn.textContent = T('copied'); setTimeout(function () { btn.textContent = label; }, 2200); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
    else { fallback(text); done(); }
  }
  function fallback(text) {
    var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta);
  }

  // ---------- pasos ----------
  var refreshers = [];
  function paso(p, i) {
    var n = i + 1;
    var s = h('section', { 'class': 'step', id: 'paso' + n });
    s.appendChild(h('div', { 'class': 'stephead' },
      '<span class="stepnum">' + n + '</span><h2>' + p.titulo + '</h2>' + (p.tiempo ? '<span class="time">' + p.tiempo + '</span>' : '') +
      '<button class="listen" type="button" aria-label="' + T('listenAria') + '">' + T('listen') + '</button>'));
    if (p.intro || p.introSimple) s.appendChild(h('div', null, both(p.intro ? '<p>' + p.intro + '</p>' : '', p.introSimple ? '<p>' + p.introSimple + '</p>' : '')));

    if (p.tipo === 'respuesta') {
      if (p.consigna) s.appendChild(h('div', { 'class': 'prompt' }, both(p.consigna, p.consignaSimple)));
      if (p.instruccion) s.appendChild(h('p', null, p.instruccion));
      (p.campos || []).forEach(function (c) { s.appendChild(campo(c)); });
      var r1 = h('div', { 'class': 'row' }); var b1 = h('button', { 'class': 'btn teal', type: 'button' }, p.boton || T('send'));
      var st1 = h('p', { 'class': 'status', 'aria-live': 'polite' }); r1.appendChild(b1); s.appendChild(r1); s.appendChild(st1);
      b1.addEventListener('click', function () { send(p.envio || ('paso' + n), collect(keysOf(p.campos)), st1, b1); });
    }

    if (p.tipo === 'caso') {
      if (p.video) s.appendChild(h('div', { 'class': 'video' }, '<video controls playsinline preload="metadata"' + (p.video.poster ? ' poster="' + p.video.poster + '"' : '') +
        '><source src="' + p.video.src + '" type="video/mp4">' + T('noVideo') + '</video>'));
      var casoHtml = (p.caso || []).map(function (x) { return '<p>' + x + '</p>'; }).join('');
      var casoS = p.casoSimple ? p.casoSimple.map(function (x) { return '<p>' + x + '</p>'; }).join('') : '';
      if (p.video) s.appendChild(h('details', { open: '' }, '<summary>' + T('caseText') + '</summary>' + both(casoHtml, casoS)));
      else s.appendChild(h('div', null, both(casoHtml, casoS)));
      if (p.tabla) s.appendChild(h('div', { 'class': 'tablewrap' }, p.tabla));
      if (p.nota) s.appendChild(h('p', { 'class': 'fict' }, p.nota));
      if (p.opciones) s.appendChild(h('div', { 'class': 'opts' }, p.opciones.map(function (o) { return '<div class="opt"><span class="L">' + o[0] + '</span>' + o[1] + '</div>'; }).join('')));
    }

    if (p.tipo === 'ficha') {
      if (p.minutos) {
        var t = h('div', { 'class': 'timer', role: 'group', 'aria-label': 'Temporizador' },
          '<span class="clock">' + p.minutos + ':00</span><button class="btn" type="button">' + T('start') + '</button><button class="btn alt" type="button">' + T('reset') + '</button><span class="hint">' + T('timerHint') + '</span>');
        s.appendChild(t); timer(t, p.minutos);
      }
      if (p.recursos) {
        s.appendChild(h('h3', null, p.recursosTitulo || T('docs')));
        s.appendChild(h('div', { 'class': 'res' }, p.recursos.map(function (r) { return '<div><b>' + r.titulo + '</b>' + r.html + '</div>'; }).join('')));
      }
      if (p.fichaTitulo) s.appendChild(h('h3', null, p.fichaTitulo));
      if (p.fichaIntro) s.appendChild(h('p', { 'class': 'hint' }, p.fichaIntro));
      (p.campos || []).forEach(function (c) { s.appendChild(campo(c)); });
      s.appendChild(h('p', { 'class': 'fict saved', 'aria-live': 'polite' }));
    }

    if (p.tipo === 'ia') {
      if (p.voces) s.appendChild(h('div', { 'class': 'voices' }, p.voces.map(function (v) { return '<div><b>' + v.nombre + '</b>' + v.texto + '</div>'; }).join('')));
      if (p.aviso) s.appendChild(h('p', null, p.aviso));
      var gate = h('div', { 'class': 'gate' }, p.gateTexto || T('gate'));
      s.appendChild(gate);
      var plat = p.plataforma || { nombre: 'ChatGPT', url: 'https://chatgpt.com/' };
      s.appendChild(h('ol', { style: 'margin:12px 0 0 22px' }, (p.pasosLista || [
        T('copyStep'),
        T('open', { p: plat.nombre }),
        T('answer')
      ]).map(function (x) { return '<li>' + x + '</li>'; }).join('')));
      var row = h('div', { 'class': 'row' });
      var cb = h('button', { 'class': 'btn teal', type: 'button', disabled: '' }, T('copyBtn'));
      var ob = h('a', { 'class': 'btn alt', href: plat.url, target: '_blank', rel: 'noopener', 'aria-disabled': 'true' }, T('openBtn', { p: plat.nombre }));
      row.appendChild(cb); row.appendChild(ob); s.appendChild(row);
      s.appendChild(h('p', { 'class': 'fict' }, T('noCopy', { p: plat.nombre })));
      var det = h('details', null, '<summary>' + T('seeText') + '</summary>'); var out = h('pre', { 'class': 'out' }); det.appendChild(out); s.appendChild(det);
      cb.addEventListener('click', function () { copyText(out.textContent, cb); });
      refreshers.push(function () {
        out.textContent = p.prompt.join('\n') + '\n\n' + fichaTexto();
        var ok = (p.requeridos || []).every(function (k) { return data[k] && String(data[k]).trim(); });
        cb.disabled = !ok; gate.style.display = ok ? 'none' : 'block'; ob.setAttribute('aria-disabled', ok ? 'false' : 'true');
      });
    }

    if (p.tipo === 'entrega') {
      (p.campos || []).forEach(function (c) { s.appendChild(campo(c)); });
      var r2 = h('div', { 'class': 'row' });
      var b2 = h('button', { 'class': 'btn teal', type: 'button' }, p.boton || T('sendFinal'));
      var cpy = h('button', { 'class': 'btn alt', type: 'button' }, T('copyFicha'));
      r2.appendChild(b2); r2.appendChild(cpy); s.appendChild(r2);
      var st2 = h('p', { 'class': 'status', 'aria-live': 'polite' }); s.appendChild(st2);
      s.appendChild(h('p', { 'class': 'fict' }, T('finalNote')));
      cpy.addEventListener('click', function () { copyText(fichaTexto(), cpy); });
      b2.addEventListener('click', function () {
        var faltan = (p.requeridos || []).filter(function (k) { return !(data[k] && String(data[k]).trim()); });
        if (faltan.length) { st2.className = 'status err'; st2.textContent = T('missing') + faltan.map(labelOf).join(', ') + '.'; return; }
        var payload = collect(allFichaKeys().concat(keysOf(p.campos)));
        payload.ficha_completa = fichaTexto();
        send('entrega', payload, st2, b2);
      });
      if (p.rubrica) {
        var rb = p.rubrica;
        s.appendChild(h('details', null, '<summary>' + rb.titulo + '</summary><div class="tablewrap"><table><tr>' +
          rb.encabezados.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr>' +
          rb.filas.map(function (f) { return '<tr>' + f.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') +
          '</table></div>' + (rb.nota ? '<p class="fict">' + rb.nota + '</p>' : '')));
      }
    }

    // voz alta
    var lb = s.querySelector('.listen');
    lb.addEventListener('click', function () {
      if (!('speechSynthesis' in window)) { lb.textContent = T('noVoice'); return; }
      if (speechSynthesis.speaking) { speechSynthesis.cancel(); lb.textContent = T('listen'); return; }
      var clone = s.cloneNode(true);
      clone.querySelectorAll('button,input,textarea,select,pre,video,' + (document.body.classList.contains('simple') ? '.full-only' : '.simple-only')).forEach(function (e) { e.remove(); });
      var u = new SpeechSynthesisUtterance(clone.innerText.replace(/\s+/g, ' ').trim());
      u.lang = T('voice'); u.rate = 0.95; u.onend = function () { lb.textContent = T('listen'); };
      speechSynthesis.speak(u); lb.textContent = T('stop');
    });
    return s;
  }
  function labelOf(k) {
    var lab = k;
    M.pasos.forEach(function (p) { (p.campos || []).forEach(function walk(c) { if (c.tipo === 'columnas') c.campos.forEach(walk); else if (c.k === k) lab = c.label.replace(/<[^>]+>/g, ''); }); });
    return T('q')[0] + lab + T('q')[1];
  }
  function timer(el, min) {
    var total = min * 60, left = total, iv = null, clock = el.querySelector('.clock'), bs = el.querySelectorAll('button');
    function show() { var m = Math.floor(left / 60), s = left % 60; clock.textContent = m + ':' + (s < 10 ? '0' : '') + s; }
    bs[0].addEventListener('click', function () {
      if (iv) { clearInterval(iv); iv = null; bs[0].textContent = T('cont'); return; }
      bs[0].textContent = T('pause');
      iv = setInterval(function () { if (left > 0) { left--; show(); } if (left === 0) { clearInterval(iv); iv = null; bs[0].textContent = T('start'); clock.textContent = T('timeUp'); } }, 1000);
    });
    bs[1].addEventListener('click', function () { clearInterval(iv); iv = null; left = total; bs[0].textContent = T('start'); show(); });
  }

  // ---------- página ----------
  function render() {
    document.documentElement.lang = M.idioma || 'es';
    document.title = M.titulo + (M.programa ? ' · ' + M.programa : '');
    var a11y = store('misiones-a11y') || {};
    if (a11y.bv) document.body.classList.add('bv');
    if (a11y.simple) document.body.classList.add('simple');

    var top = h('div', { 'class': 'wrap' });
    var hd = h('header', { 'class': 'top' });
    hd.innerHTML =
      '<div class="a11y" role="group" aria-label="Opciones de accesibilidad">' +
      '<button type="button" data-a="simple" aria-pressed="' + !!a11y.simple + '">' + T('simple') + '</button>' +
      '<button type="button" data-a="bv" aria-pressed="' + !!a11y.bv + '">' + T('bv') + '</button>' +
      '<a href="../" style="align-self:center;font-weight:700">' + T('all') + '</a></div>' +
      '<div class="logos"><img src="../assets/logo_upsrj.png" alt="Universidad Politécnica de Santa Rosa Jáuregui"><img src="../assets/logo_iehl.png" alt="IEHL · Integral Education for Higher Learning"></div>' +
      '<div class="eyebrow">' + [M.asignatura, M.programa, M.formato || T('fmt')].filter(Boolean).join(' · ') + '</div>' +
      '<h1>' + M.titulo + '</h1>' +
      '<div class="lead">' + both(M.lead, M.leadSimple) + '</div>' +
      (M.regla ? '<div class="rule"><span aria-hidden="true">✋</span><div><b>' + M.regla.titulo + '</b>' + both(M.regla.texto, M.regla.textoSimple) + '</div></div>' : '') +
      (M.ficticio ? '<p class="fict">' + M.ficticio + '</p>' : '');
    top.appendChild(hd);

    var whoBox = h('div', { 'class': 'who', id: 'who' });
    whoBox.innerHTML = '<h2>' + T('who') + '</h2><p class="hint">' + T('whoHint') + '</p>' +
      '<div class="cols"><div><label class="q" for="f-_nombre">' + T('name') + '</label><input type="text" id="f-_nombre" data-k="_nombre" autocomplete="name"></div>' +
      '<div><label class="q" for="f-_matricula">' + T('id') + '</label><input type="text" id="f-_matricula" data-k="_matricula" inputmode="numeric"></div>' +
      '<div><label class="q" for="f-_grupo">' + T('group') + '</label><select id="f-_grupo" data-k="_grupo"><option value="">' + T('choose') + '</option>' +
      (M.grupos || []).map(function (g) { return '<option>' + esc(g) + '</option>'; }).join('') + '</select></div></div>';
    top.appendChild(whoBox);
    app.innerHTML = ''; app.appendChild(top);

    var nav = h('nav', { 'class': 'steps', 'aria-label': 'Pasos' });
    nav.innerHTML = '<div class="wrap"><ol>' + M.pasos.map(function (p, i) { return '<li><a href="#paso' + (i + 1) + '"><span class="n">' + (i + 1) + '</span>' + (p.nav || p.titulo) + '</a></li>'; }).join('') + '</ol></div>';
    app.appendChild(nav);

    var main = h('main', { 'class': 'wrap' });
    M.pasos.forEach(function (p, i) { main.appendChild(paso(p, i)); });
    app.appendChild(main);

    var ft = h('footer', { 'class': 'wrap' });
    ft.innerHTML = '<div class="foot"><div class="logos"><img src="../assets/logo_upsrj.png" alt="Universidad Politécnica de Santa Rosa Jáuregui"><img src="../assets/logo_iehl.png" alt="IEHL · Integral Education for Higher Learning"></div>' +
      '<img class="firma" src="../assets/firma_designed_by_chipo.png" alt="Designed and built by Chipo"></div>' +
      '<p>Lic. Cristóbal Guerrero Hernández · ' + (M.asignatura || '') + ' · Universidad Politécnica de Santa Rosa Jáuregui · 2026</p>';
    app.appendChild(ft);

    // accesibilidad
    hd.querySelectorAll('.a11y button').forEach(function (b) {
      b.addEventListener('click', function () {
        var a = b.dataset.a, on = !document.body.classList.contains(a);
        document.body.classList.toggle(a, on); b.setAttribute('aria-pressed', on);
        var st = store('misiones-a11y') || {}; st[a] = on; store('misiones-a11y', st);
      });
    });

    // campos: cargar, guardar
    var fields = Array.prototype.slice.call(document.querySelectorAll('[data-k]'));
    fields.forEach(function (el) {
      var k = el.dataset.k;
      if (el.type === 'radio') el.checked = data[k] === el.value; else if (data[k] != null) el.value = data[k];
      el.addEventListener('input', save); el.addEventListener('change', save);
    });
    function save() {
      fields.forEach(function (el) { var k = el.dataset.k; if (el.type === 'radio') { if (el.checked) data[k] = el.value; } else data[k] = el.value; });
      var ok = store(KEY, data);
      document.querySelectorAll('.saved').forEach(function (e) { e.textContent = ok ? T('saved') : ''; });
      refresh();
    }
    function refresh() {
      refreshers.forEach(function (f) { f(); });
      var r = findReparto();
      if (r) {
        var tot = r.filas.reduce(function (a, f) { return a + Number(data[f.k] || 0); }, 0);
        var el = document.getElementById('tot-' + r.k);
        if (el) { el.textContent = 'Total repartido: ' + tot.toLocaleString('es-MX') + ' de ' + r.meta.toLocaleString('es-MX') + (tot === r.meta ? ' ✓' : tot > r.meta ? ' · te pasaste' : ' · faltan ' + (r.meta - tot).toLocaleString('es-MX')); el.className = 'total ' + (tot === r.meta ? 'ok' : tot > r.meta ? 'err' : ''); }
        data[r.k] = tot === r.meta ? 'ok' : '';
      }
    }
    refresh();

    // resaltar paso visible
    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var idx = links.findIndex(function (a) { return a.getAttribute('href') === '#' + e.target.id; });
          links.forEach(function (a, i) { a.classList.toggle('on', i === idx); a.classList.toggle('done', i < idx); });
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      main.querySelectorAll('section.step').forEach(function (s) { io.observe(s); });
    }
  }

  fetch('mision.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) { M = j; KEY = 'mision-' + M.id; data = store(KEY) || {}; render(); })
    .catch(function () { app.innerHTML = '<div class="wrap" style="padding:40px 16px">' + T('loadFail') + '</div>'; });
})();
