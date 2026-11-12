/**
 * MISIONES EXPRÉS · Centro de mando docente
 * UPSRJ · Designed and built by Chipo · Lic. Cristóbal Guerrero Hernández
 *
 * Segundo archivo del mismo proyecto de Apps Script «Misiones exprés» (junto a Code.gs).
 * Atiende la página privada mando/ del sitio: Proyectos, Dictámenes y Ritual.
 *
 * Seguridad: la aplicación web acepta peticiones de cualquiera (la necesitan los alumnos),
 * así que toda acción del centro de mando exige la CLAVE que genera instalarMando().
 * Sin la clave, la página no muestra ni un dato. Los datos viven en la hoja
 * «Centro de mando docente» de esta cuenta; el repositorio público no guarda ninguno.
 *
 * INSTALACIÓN: ver «Centro de mando» en el README del repositorio.
 */

var MANDO = {
  PROYECTOS: ['ID', 'Proyecto', 'Ámbito', 'Estado', 'Siguiente acción', 'Fecha', 'Enlace', 'Notas', 'Actualizado'],
  DICTAMENES: ['ID', 'Recibido', 'Misión', 'Asignatura', 'Grupo', 'Equipo o alumno', 'Matrícula', 'Actividad', 'Envío',
    'Calificación propuesta', 'Comentarios propuestos', 'Calificación final', 'Comentarios finales',
    'Estado', 'Revisado', 'Enlace a la entrega'],
  CALIFICACIONES: ['Misión', 'Asignatura', 'Grupo', 'Equipo o alumno', 'Matrícula', 'Actividad', 'Calificación',
    'Comentarios de mejora', 'Aprobado', 'ID dictamen'],
  RITUAL: ['Fecha', 'Tipo', 'Prioridad 1', 'Prioridad 2', 'Prioridad 3', 'Qué cerré', 'Qué me atascó', 'Qué aprendí']
};
var MANDO_HOJAS = { PROYECTOS: 'Proyectos', DICTAMENES: 'Dictámenes', CALIFICACIONES: 'Calificaciones', RITUAL: 'Ritual' };
var MANDO_ESTADOS = ['Por definir', 'Idea', 'En construcción', 'En uso', 'Pausado', 'Cerrado'];

/** Inventario inicial (11 nov 2026). El estado se define en la semana 1 del piloto. */
var MANDO_INICIALES = [
  ['Ruta de misiones P1', 'Actividades y aplicaciones de aula'],
  ['Study Sprint', 'Actividades y aplicaciones de aula'],
  ['Misión Campus', 'Actividades y aplicaciones de aula'],
  ['Sustainability Mission', 'Actividades y aplicaciones de aula'],
  ['Fábrica de misiones', 'Actividades y aplicaciones de aula'],
  ['Agente de revisión de trabajos', 'Actividades y aplicaciones de aula'],
  ['Depósito de fauna periurbana', 'Actividades y aplicaciones de aula'],
  ['Agente de fricción (COEPES)', 'Innovación y formación de docentes'],
  ['Curso LSM', 'Innovación y formación de docentes'],
  ['Curso Gauss Jordan', 'Innovación y formación de docentes'],
  ['Talleres con Andrea y Ximena', 'Innovación y formación de docentes'],
  ['Observatorio T-Rex', 'Innovación y formación de docentes'],
  ['Skill de pensamiento crítico', 'Innovación y formación de docentes'],
  ['Café Filosófico', 'Gestión y vinculación'],
  ['Debate contra la UTEQ', 'Gestión y vinculación'],
  ['Marca personal', 'Gestión y vinculación'],
  ['Centro de mando docente', 'Gestión y vinculación']
];

/* ───────────── Instalación ───────────── */

/** Ejecútala una vez desde el editor. Crea la hoja, el buzón, la clave y la importación horaria. */
function instalarMando() {
  var props = PropertiesService.getScriptProperties();
  var ss;
  if (props.getProperty('MANDO_SHEET_ID')) {
    ss = SpreadsheetApp.openById(props.getProperty('MANDO_SHEET_ID'));
  } else {
    ss = SpreadsheetApp.create('Centro de mando docente');
    props.setProperty('MANDO_SHEET_ID', ss.getId());
  }
  Object.keys(MANDO_HOJAS).forEach(function (k) {
    var nombre = MANDO_HOJAS[k], cols = MANDO[k];
    var sh = ss.getSheetByName(nombre) || ss.insertSheet(nombre);
    if (sh.getLastRow() === 0) {
      sh.appendRow(cols);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, cols.length).setFontWeight('bold').setBackground('#21857E').setFontColor('#FFFFFF');
    }
  });
  var vacia = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (vacia && vacia.getLastRow() === 0) ss.deleteSheet(vacia);

  var p = ss.getSheetByName(MANDO_HOJAS.PROYECTOS);
  if (p.getLastRow() === 1) {
    var ahora = new Date();
    var filas = MANDO_INICIALES.map(function (x) { return [mId_('P'), x[0], x[1], 'Por definir', '', '', '', '', ahora]; });
    p.getRange(2, 1, filas.length, filas[0].length).setValues(filas);
  }

  var buzon = mBuzon_();
  if (!props.getProperty('MANDO_CLAVE')) props.setProperty('MANDO_CLAVE', mClaveNueva_());

  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'importarBuzonMando') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('importarBuzonMando').timeBased().everyHours(1).create();

  Logger.log('Hoja: ' + ss.getUrl());
  Logger.log('Buzón: ' + buzon.getUrl());
  Logger.log('CLAVE DEL CENTRO DE MANDO (guárdala): ' + props.getProperty('MANDO_CLAVE'));
}

/** Cambia la clave si crees que alguien la vio. La página te la volverá a pedir. */
function cambiarClaveMando() {
  var c = mClaveNueva_();
  PropertiesService.getScriptProperties().setProperty('MANDO_CLAVE', c);
  Logger.log('Clave nueva: ' + c);
}

/* ───────────── Entrada desde la página mando/ ───────────── */

/** Code.gs llama esta función cuando la petición trae «accion». */
function mando_(body) {
  mVerificar_(body.clave);
  var a = String(body.accion || '');
  if (a === 'datos') return mDatos_();
  if (a === 'guardarProyecto') return mGuardarProyecto_(body.proyecto || {});
  if (a === 'resolverDictamen') return mResolver_(body.id, body.calificacion, body.comentarios, body.decision);
  if (a === 'guardarRitual') return mGuardarRitual_(body.ritual || {});
  if (a === 'importar') { importarBuzonMando(); return mDatos_(); }
  throw new Error('Acción desconocida.');
}

function mVerificar_(clave) {
  var real = PropertiesService.getScriptProperties().getProperty('MANDO_CLAVE');
  if (!real) throw new Error('El centro de mando no está instalado. Ejecuta instalarMando().');
  if (String(clave || '') === real) return;
  // La clave tiene 16 caracteres al azar; esto solo frena a quien prueba muchas seguidas.
  var cache = CacheService.getScriptCache(), fallos = Number(cache.get('mando_fallos') || 0);
  cache.put('mando_fallos', String(fallos + 1), 900);
  if (fallos >= 10) Utilities.sleep(3000);
  throw new Error('CLAVE');
}

function mDatos_() {
  var hoy = mFecha_(new Date());
  var proyectos = mLeer_(MANDO_HOJAS.PROYECTOS).filter(function (r) { return r['Proyecto']; });
  var dict = mLeer_(MANDO_HOJAS.DICTAMENES).filter(function (r) { return r['ID']; });
  var ritual = mLeer_(MANDO_HOJAS.RITUAL).filter(function (r) { return r['Fecha']; });
  var pendientes = dict.filter(function (r) { return r['Estado'] === 'Por aprobar'; });
  var revisados = dict.filter(function (r) { return r['Estado'] && r['Estado'] !== 'Por aprobar'; })
    .sort(function (a, b) { return String(b['Revisado']).localeCompare(String(a['Revisado'])); }).slice(0, 30);
  [proyectos, pendientes, revisados, ritual].forEach(function (l) { l.forEach(function (r) { delete r._fila; }); });
  return {
    hoy: hoy, estados: MANDO_ESTADOS, proyectos: proyectos, pendientes: pendientes, revisados: revisados,
    ritual: ritual.slice(-8).reverse(), sinDictamen: mSinDictamen_(dict)
  };
}

/** Cuenta, por misión y grupo, las entregas finales de los alumnos que todavía no tienen dictamen. */
function mSinDictamen_(dict) {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) return [];
  var hechos = {};
  dict.forEach(function (r) { if (r['Misión']) hechos[mClaveEnvio_(r['Misión'], r['Matrícula'] || r['Equipo o alumno'], r['Envío'])] = true; });
  var conteo = {};
  SpreadsheetApp.openById(id).getSheets().forEach(function (sh) {
    var mision = sh.getName();
    if (mision === 'Léeme' || mision === 'prueba' || sh.getLastRow() < 2) return;
    var v = sh.getDataRange().getValues(), enc = v[0];
    var iR = enc.indexOf('Recibido'), iT = enc.indexOf('Tipo'), iG = enc.indexOf('Grupo'),
      iN = enc.indexOf('Nombre'), iM = enc.indexOf('Matrícula');
    v.slice(1).forEach(function (f) {
      if (String(f[iT]) !== 'entrega') return;
      var envio = f[iR] instanceof Date ? mFechaHora_(f[iR]) : String(f[iR]);
      var quien = f[iM] || f[iN];
      // Cubierta si hay dictamen de ese envío, o un dictamen de la misión sin fecha de envío.
      if (hechos[mClaveEnvio_(mision, quien, envio)] || hechos[mClaveEnvio_(mision, quien, '')]) return;
      var k = mision + '|' + f[iG];
      conteo[k] = conteo[k] || { mision: mision, grupo: String(f[iG]), entregas: 0 };
      conteo[k].entregas++;
    });
  });
  return Object.keys(conteo).map(function (k) { return conteo[k]; });
}

function mGuardarProyecto_(d) {
  return mCandado_(function () {
    var sh = mHoja_(MANDO_HOJAS.PROYECTOS), cols = MANDO.PROYECTOS;
    var v = {
      'Proyecto': mTxt_(d['Proyecto']), 'Ámbito': mTxt_(d['Ámbito']),
      'Estado': MANDO_ESTADOS.indexOf(d['Estado']) >= 0 ? d['Estado'] : 'Por definir',
      'Siguiente acción': mTxt_(d['Siguiente acción']), 'Fecha': mDesdeTexto_(d['Fecha']),
      'Enlace': mTxt_(d['Enlace']), 'Notas': mTxt_(d['Notas']), 'Actualizado': new Date()
    };
    if (!v['Proyecto']) throw new Error('Escribe el nombre del proyecto.');
    var fila = d['ID'] ? mBuscar_(sh, cols, 'ID', d['ID']) : -1;
    if (fila > 0) mEscribir_(sh, cols, fila, v);
    else { v['ID'] = mId_('P'); sh.appendRow(cols.map(function (c) { return v[c] !== undefined ? v[c] : ''; })); }
    return mDatos_();
  });
}

function mResolver_(id, calificacion, comentarios, decision) {
  return mCandado_(function () {
    var sh = mHoja_(MANDO_HOJAS.DICTAMENES), cols = MANDO.DICTAMENES;
    var fila = mBuscar_(sh, cols, 'ID', id);
    if (fila < 0) throw new Error('No encontré ese dictamen; recarga la página.');
    var r = mFila_(sh, cols, fila);
    if (r['Estado'] !== 'Por aprobar') throw new Error('Este dictamen ya fue revisado.');
    var ahora = new Date();
    if (decision === 'descartar') {
      mEscribir_(sh, cols, fila, { 'Estado': 'Descartado', 'Revisado': ahora });
      return mDatos_();
    }
    var cal = mTxt_(calificacion), com = mTxt_(comentarios);
    if (cal === '') throw new Error('Falta la calificación.');
    var igual = mMismaCal_(cal, r['Calificación propuesta']) && com === String(r['Comentarios propuestos']).trim();
    mEscribir_(sh, cols, fila, {
      'Calificación final': cal, 'Comentarios finales': com, 'Estado': igual ? 'Aprobado' : 'Ajustado', 'Revisado': ahora
    });
    mHoja_(MANDO_HOJAS.CALIFICACIONES).appendRow([
      r['Misión'], r['Asignatura'], r['Grupo'], r['Equipo o alumno'], r['Matrícula'], r['Actividad'], cal, com, ahora, id
    ].map(mSeguro_));
    return mDatos_();
  });
}

function mGuardarRitual_(d) {
  return mCandado_(function () {
    var tipo = d.tipo === 'Debrief' ? 'Debrief' : 'Briefing';
    var fila = [new Date(), tipo, d.p1, d.p2, d.p3, d.cerre, d.atasco, d.aprendi].map(function (x, i) { return i < 2 ? x : mTxt_(x); });
    if (fila.slice(2).join('') === '') throw new Error('No hay nada que guardar.');
    mHoja_(MANDO_HOJAS.RITUAL).appendRow(fila);
    return mDatos_();
  });
}

/* ───────────── Buzón: así llegan las propuestas de Claude ───────────── */

/**
 * Lee la carpeta «Buzón del centro de mando»:
 *  dictamenes*.csv → filas «Por aprobar» en Dictámenes (sin duplicar)
 *  proyectos*.csv  → actualiza o crea proyectos por nombre («cierra sesión»)
 * Acepta CSV u hoja de Google. Al terminar mueve cada archivo a «Procesados».
 */
function importarBuzonMando() {
  var buzon = mBuzon_();
  var it = buzon.getFoldersByName('Procesados');
  var procesados = it.hasNext() ? it.next() : buzon.createFolder('Procesados');
  var archivos = buzon.getFiles(), informe = { dictamenes: 0, proyectos: 0, omitidos: 0 };
  while (archivos.hasNext()) {
    var f = archivos.next(), n = f.getName().toLowerCase();
    var tipo = n.indexOf('dictamen') === 0 ? 'd' : n.indexOf('proyecto') === 0 ? 'p' : '';
    if (!tipo) continue;
    var filas = f.getMimeType() === MimeType.GOOGLE_SHEETS
      ? SpreadsheetApp.openById(f.getId()).getSheets()[0].getDataRange().getDisplayValues()
      : Utilities.parseCsv(f.getBlob().getDataAsString('UTF-8').replace(/^﻿/, ''));
    if (filas.length > 1) {
      var enc = filas[0].map(mNorm_);
      var objs = filas.slice(1).filter(function (r) { return r.join('').trim() !== ''; }).map(function (r) {
        var o = {}; enc.forEach(function (c, i) { o[c] = r[i] === undefined ? '' : String(r[i]).trim(); }); return o;
      });
      mCandado_(function () { if (tipo === 'd') mImportarDict_(objs, informe); else mImportarProy_(objs, informe); });
    }
    f.moveTo(procesados);
  }
  return informe;
}

function mImportarDict_(objs, informe) {
  var sh = mHoja_(MANDO_HOJAS.DICTAMENES), cols = MANDO.DICTAMENES;
  var ya = {};
  mLeer_(MANDO_HOJAS.DICTAMENES).forEach(function (r) { ya[mClaveDict_(r)] = true; });
  var ahora = new Date(), nuevas = [];
  objs.forEach(function (o) {
    var r = {
      'ID': mId_('D'), 'Recibido': ahora, 'Misión': o['mision'], 'Asignatura': o['asignatura'], 'Grupo': o['grupo'],
      'Equipo o alumno': o['equipo o alumno'] || o['nombre'] || o['equipo'] || o['alumno'], 'Matrícula': o['matricula'],
      'Actividad': o['actividad'], 'Envío': o['envio'],
      'Calificación propuesta': o['calificacion propuesta'] || o['calificacion'],
      'Comentarios propuestos': o['comentarios propuestos'] || o['comentarios'],
      'Calificación final': '', 'Comentarios finales': '', 'Estado': 'Por aprobar', 'Revisado': '',
      'Enlace a la entrega': o['enlace a la entrega'] || o['enlace']
    };
    if (!r['Equipo o alumno'] || !(r['Actividad'] || r['Misión'])) { informe.omitidos++; return; }
    var k = mClaveDict_(r);
    if (ya[k]) { informe.omitidos++; return; }
    ya[k] = true;
    nuevas.push(cols.map(function (c) { return mSeguro_(r[c] === undefined ? '' : r[c]); }));
  });
  if (nuevas.length) sh.getRange(sh.getLastRow() + 1, 1, nuevas.length, cols.length).setValues(nuevas);
  informe.dictamenes += nuevas.length;
}

function mImportarProy_(objs, informe) {
  var sh = mHoja_(MANDO_HOJAS.PROYECTOS), cols = MANDO.PROYECTOS, actuales = mLeer_(MANDO_HOJAS.PROYECTOS);
  objs.forEach(function (o) {
    if (!o['proyecto']) { informe.omitidos++; return; }
    var r = actuales.filter(function (x) { return mNorm_(x['Proyecto']) === mNorm_(o['proyecto']); })[0];
    var c = { 'Actualizado': new Date() };
    var e = MANDO_ESTADOS.filter(function (x) { return mNorm_(x) === mNorm_(o['estado']); })[0];
    if (e) c['Estado'] = e;
    if (o['siguiente accion']) c['Siguiente acción'] = mSeguro_(o['siguiente accion']);
    if (o['fecha']) c['Fecha'] = mDesdeTexto_(o['fecha']);
    if (o['enlace']) c['Enlace'] = mSeguro_(o['enlace']);
    if (o['notas']) c['Notas'] = mSeguro_(o['notas']);
    if (o['ambito']) c['Ámbito'] = mSeguro_(o['ambito']);
    if (r) mEscribir_(sh, cols, r._fila, c);
    else {
      c['ID'] = mId_('P'); c['Proyecto'] = mSeguro_(o['proyecto']); c['Estado'] = c['Estado'] || 'Por definir';
      sh.appendRow(cols.map(function (k) { return c[k] !== undefined ? c[k] : ''; }));
    }
    informe.proyectos++;
  });
}

function mBuzon_() {
  var props = PropertiesService.getScriptProperties(), id = props.getProperty('MANDO_BUZON_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { /* se borró: se crea de nuevo */ } }
  var padres = DriveApp.getFileById(props.getProperty('MANDO_SHEET_ID')).getParents();
  var base = padres.hasNext() ? padres.next() : DriveApp.getRootFolder();
  var b = base.createFolder('Buzón del centro de mando');
  b.createFolder('Procesados');
  props.setProperty('MANDO_BUZON_ID', b.getId());
  return b;
}

/* ───────────── Utilidades ───────────── */

function mHoja_(nombre) {
  var id = PropertiesService.getScriptProperties().getProperty('MANDO_SHEET_ID');
  if (!id) throw new Error('El centro de mando no está instalado. Ejecuta instalarMando().');
  var sh = SpreadsheetApp.openById(id).getSheetByName(nombre);
  if (!sh) throw new Error('Falta la hoja «' + nombre + '». Ejecuta instalarMando() otra vez; no borra datos.');
  return sh;
}

function mLeer_(nombre) {
  var v = mHoja_(nombre).getDataRange().getValues();
  if (v.length < 2) return [];
  var enc = v[0];
  return v.slice(1).map(function (f, i) {
    var o = { _fila: i + 2 };
    enc.forEach(function (c, j) { o[c] = f[j] instanceof Date ? (c === 'Envío' ? mFechaHora_(f[j]) : mFecha_(f[j])) : f[j]; });
    return o;
  });
}

function mFila_(sh, cols, fila) {
  var v = sh.getRange(fila, 1, 1, cols.length).getValues()[0], o = {};
  cols.forEach(function (c, j) { o[c] = v[j] instanceof Date ? mFecha_(v[j]) : v[j]; });
  return o;
}

function mBuscar_(sh, cols, campo, valor) {
  var n = sh.getLastRow() - 1;
  if (n < 1) return -1;
  var v = sh.getRange(2, cols.indexOf(campo) + 1, n, 1).getValues();
  for (var i = 0; i < v.length; i++) if (String(v[i][0]) === String(valor)) return i + 2;
  return -1;
}

function mEscribir_(sh, cols, fila, campos) {
  Object.keys(campos).forEach(function (c) {
    var k = cols.indexOf(c) + 1;
    if (k > 0) sh.getRange(fila, k).setValue(campos[c]);
  });
}

function mCandado_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function mClaveDict_(r) {
  return r['Misión'] ? mClaveEnvio_(r['Misión'], r['Matrícula'] || r['Equipo o alumno'], r['Envío'])
    : [r['Asignatura'], r['Grupo'], r['Equipo o alumno'], r['Actividad']].map(mNorm_).join('|');
}
function mClaveEnvio_(mision, quien, envio) {
  // El envío se compara al minuto: «2026-11-12 09:41».
  return [mNorm_(mision), mNorm_(quien), mNorm_(envio).replace('t', ' ').slice(0, 16)].join('|');
}

function mClaveNueva_() {
  var a = 'abcdefghjkmnpqrstuvwxyz23456789', s = '';
  for (var i = 0; i < 16; i++) { s += a.charAt(Math.floor(Math.random() * a.length)); if (i % 4 === 3 && i < 15) s += '-'; }
  return s;
}
function mMismaCal_(a, b) {
  var x = parseFloat(a), y = parseFloat(b);
  return isNaN(x) || isNaN(y) ? String(a).trim() === String(b).trim() : x === y;
}
function mId_(p) { return p + '-' + Utilities.getUuid().slice(0, 8); }
function mZona_() { return Session.getScriptTimeZone() || 'America/Mexico_City'; }
function mFecha_(d) { return Utilities.formatDate(d, mZona_(), 'yyyy-MM-dd'); }
function mFechaHora_(d) { return Utilities.formatDate(d, mZona_(), 'yyyy-MM-dd HH:mm:ss'); }
function mDesdeTexto_(t) {
  var m = String(t || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : '';
}
function mTxt_(x) { return mSeguro_(x === undefined || x === null ? '' : String(x).trim().slice(0, 5000)); }
// Evita que un texto se interprete como fórmula en la hoja.
function mSeguro_(v) { var s = String(v == null ? '' : v); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function mNorm_(x) { return String(x || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
