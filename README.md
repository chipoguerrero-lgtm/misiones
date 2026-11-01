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

## Agregar una misión nueva

Ver [`plantilla/COMO-AGREGAR.md`](plantilla/COMO-AGREGAR.md).
