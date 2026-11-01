# Cómo agregar una misión nueva

1. **Copia la carpeta `plantilla/`** con un nombre corto, en minúsculas y con guiones: por ejemplo `comite-ltf-unidad2`. Ese nombre será la dirección: `…/misiones/comite-ltf-unidad2/`.
2. **Edita `mision.json`** dentro de la carpeta nueva:
   - `id`: el mismo nombre de la carpeta.
   - `titulo`, `asignatura`, `programa`, `grupos`, `lead`, `regla`, `ficticio`.
   - `pasos`: la lista de pasos. Cada paso tiene un `tipo`:
     - `respuesta`: una consigna breve y un cuadro de respuesta que se envía (calentamiento).
     - `caso`: el caso por escrito; opcionalmente un video (`video.src`), una tabla (`tabla`) y las opciones (`opciones`).
     - `ficha`: temporizador (`minutos`), recursos para documentarse y los campos que llena el alumno (`campos`).
     - `ia`: las voces del agente, el `prompt` que se copia a ChatGPT y los campos `requeridos` para habilitarlo.
     - `entrega`: campos finales, campos `requeridos` y la `rubrica`.
   - `ficha`: las líneas del resumen que se pega en ChatGPT y se envía con la entrega. `{clave}` se reemplaza por lo que escribió el alumno.
   - Los campos `introSimple`, `casoSimple`, `consignaSimple` y `leadSimple` son la versión en español simplificado.
3. **Agrega la misión a `catalogo.json`** para que aparezca en la portada.
4. Si la misión lleva video, ponlo en `video/` dentro de su carpeta (MP4, sin voz y con texto en pantalla).

Lo más rápido: pídele a Claude «crea la misión X a partir de este documento» y él genera el `mision.json`.
