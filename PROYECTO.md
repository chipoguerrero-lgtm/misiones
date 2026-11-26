# Proyecto Misiones UPSRJ · registro central

Lic. Cristóbal Guerrero Hernández · Universidad Politécnica de Santa Rosa Jáuregui · Designed and built by Chipo.

Este archivo es el punto de partida para todo lo relacionado con las misiones y las actividades web por equipos. Reúne en un solo lugar los repositorios, los sitios, los servidores de Apps Script, las conversaciones con Claude donde se construyó cada cosa, las decisiones de diseño y lo que queda pendiente. Actualízalo cada vez que se agregue o cambie una misión.

> Este repositorio es público. Aquí no se escriben PINs, claves del centro de mando ni códigos de grupo. Esos datos van cifrados en la página privada **Mis misiones UPSRJ** (artifact en claude.ai).

Última actualización: 26 de noviembre de 2026.

---

## 1. Mapa del proyecto

| Pieza | Qué es | Repositorio | Página de alumnos | Panel docente |
|---|---|---|---|---|
| **Fábrica de misiones exprés** (núcleo) | Motor común y misiones de 45 min con agente de IA | [misiones](https://github.com/chipoguerrero-lgtm/misiones) | [Portada](https://chipoguerrero-lgtm.github.io/misiones/) | [Centro de mando](https://chipoguerrero-lgtm.github.io/misiones/mando/) |
| **Campus Mission** | Inducción por equipos: 10 edificios, mapa, foto, edificio Lego 3D, mapa mental | [campus-mission](https://github.com/chipoguerrero-lgtm/campus-mission) | [Sitio](https://chipoguerrero-lgtm.github.io/campus-mission/) | [docente.html](https://chipoguerrero-lgtm.github.io/campus-mission/docente.html) |
| **Sustainability Mission · Good practices** | 9 equipos, una buena práctica de sustentabilidad cada uno; investigación, entrevista y PDF | [sustainability-mission](https://github.com/chipoguerrero-lgtm/sustainability-mission) | [Sitio](https://chipoguerrero-lgtm.github.io/sustainability-mission/) | [docente.html](https://chipoguerrero-lgtm.github.io/sustainability-mission/docente.html) |
| **El comité de dictamen (sitio original)** | Primera versión, antes de la fábrica (Terapia Física y Robótica, con Tally) | [comite-dictamen-tf](https://github.com/chipoguerrero-lgtm/comite-dictamen-tf) | [Sitio](https://chipoguerrero-lgtm.github.io/comite-dictamen-tf/) | Respuestas en Tally |
| **Study Sprint** | Cuatro misiones en una semana (Plan, Run, Retrieval, Proof) para Tutoring | Sin repositorio: es una app de Apps Script | URL `/exec` en *Mis misiones UPSRJ* | Hoja de cálculo del script |

### Misiones dentro de la fábrica

| Misión | Carpeta | Asignatura · grupo | Idioma |
|---|---|---|---|
| El comité de dictamen · La rodilla a la semana 8 | `comite-tf/` | Habilidades del Pensamiento · LTF 06 | Español |
| El comité de dictamen · El sensor que se detiene solo | `comite-irc/` | Habilidades del Pensamiento · IRC MPR 02 | Español |
| El comité de dictamen · Once de cuarenta mil | `comite-isa/` | Habilidades del Pensamiento · ISA SA 04 | Español |
| Las 100 000 dosis | `dosis-100000/` | Ética Profesional | Español |
| The confidence trap | `confidence-trap/` | Tutoring for Immersion · S11 · grupos 2, 07, 09, 10 | Inglés (con audios grabados por el docente) |
| The law everyone would sign | `deonto-ley-universal/` | Ética Profesional · clase muestra de deontología | Inglés B2 (plan de clase en `plan.html`) |

### Dónde viven los datos

Todo se guarda en el Drive de **cguerrero@upsrj.edu.mx**, cada sitio con su propio proyecto de Apps Script:

| Sitio | Proyecto de Apps Script | Hoja o carpeta |
|---|---|---|
| Fábrica de misiones | *Misiones exprés* (`apps-script/Code.gs` y `Mando.gs`) | *Misiones exprés – Envíos* (una pestaña por misión) y *Centro de mando docente* |
| Campus Mission | *Campus Mission* | Carpeta *Campus Mission (datos)* |
| Sustainability Mission | *Sustainability Mission* | Hoja de respuestas y carpeta de fotos |
| Study Sprint | *Study Sprint* (versión anterior: *Ruta de misiones*) | Hoja del script |

Las URL `/exec` de cada servidor están en el `config.js` de cada repositorio y en *Mis misiones UPSRJ*. Respaldo semanal con `Respaldo.gs` hasta el último día presencial del cuatrimestre (10 de diciembre de 2026).

---

## 2. Reglas comunes (decisiones ya tomadas)

**Pedagogía de las misiones exprés**
- El alumno decide solo primero, sin IA; la IA no da la respuesta correcta; a mitad del ejercicio se libera evidencia nueva; se evalúa con una rúbrica de cuatro dimensiones (16 puntos). Todos los casos son ficticios.
- El paso del agente de IA funciona copiando las instrucciones y la ficha a ChatGPT (no hay chat integrado con API).
- Los pasos pueden ser opcionales y se encienden o apagan desde el centro de mando (pestaña *Misiones*).

**Accesibilidad e inclusión (en todo sitio nuevo)**
- Botón de **español sencillo** para alumnos Sordos o con dificultad de lectura, y modo de **baja visión** (letra grande y alto contraste).
- Sin voz sintética: los audios son grabaciones del propio docente, procesadas y aprobadas por él antes de publicarse.
- Los ajustes para un alumno Sordo o con baja visión se aplican solo en los grupos donde hay alumnos así.

**Identidad**
- Logos de la UPSRJ y de IEHL, y la firma «Designed and built by Chipo», discretos, en pie de página.
- Créditos como «Lic. Cristóbal Guerrero Hernández».

**Infraestructura**
- Sitios en GitHub Pages, sin que los alumnos necesiten cuenta; datos en la cuenta institucional vía Apps Script.
- Las actividades por equipos usan código de grupo y PIN de 4 dígitos para volver a entrar durante la semana.
- Los borrados en los paneles docentes archivan, no eliminan; las fotos se pueden ocultar sin perder el avance.
- Las versiones anteriores (artifact de Campus Mission con base de datos propia, *Ruta de misiones*) ya no se usan.

---

## 3. Conversaciones con Claude donde se construyó cada pieza

Los enlaces solo los abre la cuenta de Chipo en claude.ai.

| Conversación | Qué se hizo |
|---|---|
| [GitHub para clases de Desarrollo Humano](https://claude.ai/chat/b9d932c0-5334-4a41-94fd-ad05711ec735) (1 nov.) | Diagnóstico y seis proyectos; piloto automático semanal de tareas programadas y respaldos; creación de la fábrica (motor, tres comités, Las 100 000 dosis); The confidence trap y audios grabados. |
| [Misión mapa interactivo universidad](https://claude.ai/chat/7e4580f8-91bf-437b-94f8-620315f7cfd6) (hasta 10 nov.) | Campus Mission (del artifact a GitHub + Apps Script), Sustainability Mission, presentación para alumnos y la página *Mis misiones UPSRJ* con bóveda cifrada. |
| [Misiones de deontología para Cognitive skills](https://claude.ai/chat/f387a73d-027e-480e-8a43-aafa41ec8903) (hasta 24 nov.) | Tres opciones de misión de deontología; «The law everyone would sign» en inglés B2; pasos opcionales y pestaña *Misiones* del centro de mando; plan de clase. |
| [Cognitive Skills project optimization](https://claude.ai/chat/8244afde-76a5-4e9e-971b-c9501f221074) (17 nov.) | Trabajo sobre el sitio original del comité de dictamen (versión Robótica) y la regla de los tres logos. |
| [Video recap de ABP](https://claude.ai/chat/6c763920-c811-49b7-abdf-91edbf364397) (31 oct.) | Reel de Instagram sobre Study Sprint. |

---

## 4. Pendientes y decisiones abiertas

- [ ] **Clave del centro de mando:** pasarla de las notas de *Mis misiones UPSRJ* al campo cifrado *Otras claves* (apareció sin cifrar en un chat). Si hay duda, generar una nueva con `cambiarClaveMando`.
- [ ] **PIN de docente** de Campus Mission y Sustainability Mission: usar uno propio, no adivinable, y guardarlo en la bóveda.
- [ ] **comite-dictamen-tf:** la fábrica ya tiene `comite-tf/` y `comite-irc/`. Decidir si el sitio original se archiva o se conserva (aún usa Tally).
- [ ] **Ruta de misiones:** archivar su implementación si ya no se usa, para que nadie entre a la versión vieja de Study Sprint.
- [ ] **Audios** de los tres comités y de Las 100 000 dosis: falta grabarlos (solo The confidence trap los tiene).
- [ ] **Examen con IA** de «The law everyone would sign»: está desactivado; encenderlo desde el centro de mando cuando toque.

---

## 5. Cómo seguir desarrollando

- **Misión nueva de 45 min:** copiar `plantilla/` y seguir [`plantilla/COMO-AGREGAR.md`](plantilla/COMO-AGREGAR.md), o pedirle a Claude «crea la misión X a partir de este documento». Agregarla a `catalogo.json` y a las tablas de este archivo.
- **Actividad por equipos de una semana** (tipo Campus o Sustainability): partir de `sustainability-mission`, que es la versión más completa. Crear un repositorio nuevo y su propio proyecto de Apps Script, y agregarla a `catalogo.json` con `"url"` para que aparezca en la portada.
- **Al terminar cualquier cambio:** actualizar este archivo (mapa, conversación y pendientes) y la tarjeta en *Mis misiones UPSRJ*.
