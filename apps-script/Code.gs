/**
 * MISIONES EXPRÉS · Receptor de envíos
 * UPSRJ · Designed and built by Chipo · Lic. Cristóbal Guerrero Hernández
 *
 * Recibe los envíos de todas las misiones publicadas en GitHub Pages y los guarda en
 * una hoja de cálculo de esta cuenta (cguerrero@upsrj.edu.mx). Cada misión tiene su
 * pestaña; cada envío es una fila. Los datos de los alumnos no salen de la universidad.
 *
 * INSTALACIÓN (una sola vez, unos 10 minutos) — ver LEEME.md del repositorio:
 * 1. script.google.com › Proyecto nuevo › nómbralo «Misiones exprés» › pega este archivo.
 * 2. Ejecuta la función «instalar» y acepta los permisos. Se crea la hoja
 *    «Misiones exprés – Envíos» en tu Drive.
 * 3. Implementar › Nueva implementación › Aplicación web ·
 *    Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario.
 * 4. Copia la URL que termina en /exec y pégala en config.js del repositorio.
 *
 * Respaldo: si quieres copia semanal de la hoja, agrega también el archivo Respaldo.gs
 * que ya usas en tus otros proyectos (con RESPALDO_ID_HOJA vacío lo encuentra solo).
 */

var COLUMNAS_FIJAS = ['Recibido', 'Tipo', 'Grupo', 'Nombre', 'Matrícula'];
var MAX_TEXTO = 45000; // límite de seguridad por celda

function instalar() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  if (id) { Logger.log('Ya estaba instalado: ' + SpreadsheetApp.openById(id).getUrl()); return; }
  var ss = SpreadsheetApp.create('Misiones exprés – Envíos');
  var info = ss.getSheets()[0];
  info.setName('Léeme');
  info.getRange(1, 1, 4, 1).setValues([
    ['Envíos de las misiones exprés. Cada misión crea su propia pestaña con su primer envío.'],
    ['Cada fila es un envío. Si un alumno envía dos veces, cuenta el último (columna «Recibido»).'],
    ['No edites los encabezados de las pestañas: el script los usa para acomodar los datos.'],
    ['Designed and built by Chipo · UPSRJ']
  ]);
  props.setProperty('SHEET_ID', ss.getId());
  Logger.log('Hoja creada: ' + ss.getUrl());
}

function doGet() {
  return json_({ ok: true, app: 'Misiones exprés', version: 1 });
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var mision = limpio_(body.mision, 60);
    if (!/^[a-z0-9-]+$/.test(mision)) throw new Error('misión inválida');
    var datos = body.datos || {};
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var hoja = hojaDe_(mision);
      var enc = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
      var claves = Object.keys(datos);
      claves.forEach(function (k) {
        if (enc.indexOf(k) < 0) { enc.push(k); hoja.getRange(1, enc.length).setValue(k).setFontWeight('bold'); }
      });
      var fila = enc.map(function (col) {
        switch (col) {
          case 'Recibido': return new Date();
          case 'Tipo': return limpio_(body.tipo, 40);
          case 'Grupo': return limpio_(body.grupo, 60);
          case 'Nombre': return limpio_(body.nombre, 120);
          case 'Matrícula': return limpio_(body.matricula, 40);
          default: return datos.hasOwnProperty(col) ? limpio_(datos[col], MAX_TEXTO) : '';
        }
      });
      hoja.appendRow(fila);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function hojaDe_(mision) {
  var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
  var hoja = ss.getSheetByName(mision);
  if (!hoja) {
    hoja = ss.insertSheet(mision);
    hoja.getRange(1, 1, 1, COLUMNAS_FIJAS.length).setValues([COLUMNAS_FIJAS]).setFontWeight('bold');
    hoja.setFrozenRows(1);
  }
  return hoja;
}

// Evita que un texto se interprete como fórmula en la hoja.
function limpio_(v, max) {
  var s = String(v == null ? '' : v).slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- Prueba rápida desde el editor ---------- */
function probarEnvio() {
  var r = doPost({ postData: { contents: JSON.stringify({
    mision: 'prueba', tipo: 'calentamiento', grupo: 'PRUEBA', nombre: 'Prueba del docente', matricula: '000',
    datos: { cal: 'Esto es una prueba', calvid: '' }
  }) } });
  Logger.log(r.getContent());
}
