# Misiones exprés · UPSRJ

Fábrica de misiones de 45 minutos con agentes de IA para pensamiento crítico y ética.
Lic. Cristóbal Guerrero Hernández · Universidad Politécnica de Santa Rosa Jáuregui · Designed and built by Chipo.

**Sitio para alumnos:** https://chipoguerrero-lgtm.github.io/misiones/

Todas las misiones comparten cuatro reglas: el alumno decide solo primero, sin IA; la IA no da la respuesta correcta; se libera evidencia nueva a mitad del ejercicio; y se evalúa con una rúbrica de cuatro dimensiones (16 puntos). Todos los casos son ficticios.

## Misiones publicadas

| Misión | Carpeta | Asignatura · grupo |
|---|---|---|
| El comité de dictamen · La rodilla a la semana 8 | `comite-tf/` | Habilidades del Pensamiento · LTF 06 |
| El comité de dictamen · El sensor que se detiene solo | `comite-irc/` | Habilidades del Pensamiento · IRC MPR 02 |
| El comité de dictamen · Once de cuarenta mil | `comite-isa/` | Habilidades del Pensamiento · ISA SA 04 |
| Las 100 000 dosis | `dosis-100000/` | Ética Profesional |

## Cómo funciona

- `motor/` pinta cualquier misión a partir de su archivo `mision.json`. No hay que programar para crear una misión nueva.
- Cada misión tiene dos botones de accesibilidad: **Español simplificado** (textos breves para alumnos Sordos o con dificultades de lectura) y **Baja visión** (letra grande y alto contraste). Cada paso tiene además un botón **Escuchar** que lo lee en voz alta.
- El paso del agente de IA funciona copiando las instrucciones y la ficha del alumno a ChatGPT.
- Los envíos (calentamiento y entrega final) llegan a una hoja de cálculo de la cuenta institucional, con una pestaña por misión. Ver `apps-script/`.
- Lo que el alumno escribe se guarda en su navegador mientras trabaja.

## Conectar los envíos (una sola vez)

1. Entra a https://script.google.com con **cguerrero@upsrj.edu.mx** › **Proyecto nuevo** › nómbralo *Misiones exprés*.
2. Borra lo que trae `Código.gs` y pega todo [`apps-script/Code.gs`](apps-script/Code.gs). Guarda.
3. Elige la función **instalar** › **Ejecutar** › acepta los permisos. Se crea la hoja *Misiones exprés – Envíos* en tu Drive.
4. **Implementar › Nueva implementación** › engrane › **Aplicación web**. *Ejecutar como:* Yo. *Quién tiene acceso:* Cualquier usuario. **Implementar** y copia la URL que termina en `/exec`.
5. En este repositorio abre `config.js`, pega la URL entre las comillas de `API_URL` y guarda (*Commit changes*).

Mientras `API_URL` esté vacía, las misiones funcionan en **modo de prueba**: se pueden recorrer completas, pero no envían nada.

## Centro de mando docente (privado)

Página para el docente en **https://chipoguerrero-lgtm.github.io/misiones/mando/**, con tres secciones: **Proyectos** (estado, siguiente acción y fecha; «Esta semana»), **Dictámenes** (Claude propone calificación y comentarios, el docente aprueba o ajusta) y **Ritual** (briefing del domingo, debrief del viernes). No aparece en la portada, pide clave y no guarda ningún dato en este repositorio: todo vive en la hoja «Centro de mando docente» de la cuenta institucional.

Usa el mismo proyecto de Apps Script y la misma URL de `config.js` que las misiones.

**Instalación (una sola vez, unos 10 minutos)**

1. Abre el proyecto *Misiones exprés* en https://script.google.com con **cguerrero@upsrj.edu.mx**.
2. Reemplaza `Código.gs` con la versión nueva de [`apps-script/Code.gs`](apps-script/Code.gs) (solo agrega una línea que dirige las peticiones del centro de mando).
3. **+ › Secuencia de comandos**, nómbralo `Mando` y pega todo [`apps-script/Mando.gs`](apps-script/Mando.gs). Guarda.
4. Elige la función **instalarMando** › **Ejecutar** › acepta los permisos nuevos (Drive y activadores). Se crean la hoja *Centro de mando docente* con tus 17 proyectos, la carpeta *Buzón del centro de mando* y la importación cada hora.
5. Abre **Registro de ejecución** y copia la **clave** (formato `xxxx-xxxx-xxxx-xxxx`). Guárdala en tu gestor de contraseñas.
6. **Implementar › Gestionar implementaciones** › lápiz › *Versión:* **Nueva versión** › **Implementar**. La URL `/exec` no cambia, así que `config.js` y las misiones siguen igual.
7. Entra a `…/misiones/mando/`, escribe la clave y marca «Recordar en este navegador» solo en tus equipos.
8. Para que Claude deje propuestas: comparte la carpeta *Buzón del centro de mando* con tu cuenta personal como **editor**, y la hoja *Misiones exprés – Envíos* como **lector**.

**El buzón.** Claude deja archivos CSV en la carpeta; cada hora (o con el botón «Revisar el buzón ahora») se importan y se mueven a *Procesados*.

- `dictamenes_….csv`: Misión, Asignatura, Grupo, Equipo o alumno, Matrícula, Actividad, Envío (fecha y hora del envío del alumno), Calificación propuesta, Comentarios propuestos, Enlace a la entrega. Entran como «Por aprobar» y no se duplican.
- `proyectos_….csv`: Proyecto, Estado, Siguiente acción, Fecha (aaaa-mm-dd), Enlace, Notas. Actualiza el proyecto con ese nombre o lo crea; así funciona «cierra sesión».

La sección Dictámenes cuenta, por misión y grupo, las entregas finales que todavía no tienen dictamen.

**Reglas.** Ninguna calificación pasa a la hoja *Calificaciones* sin aprobación del docente. Se usa la rúbrica de cada misión (4 dimensiones, 16 puntos) o la de la asignatura; no se inventan escalas. Si alguien ve la clave, ejecuta **cambiarClaveMando** y entra con la nueva.

## Agregar una misión nueva

Ver [`plantilla/COMO-AGREGAR.md`](plantilla/COMO-AGREGAR.md).
