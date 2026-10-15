# Relevamiento Zetas — V8.6 · Zonas offline

Esta versión mantiene los datos del relevamiento separados de la web pública y agrega un segundo sistema offline más robusto:

- **Archivo físico `.mapdata`**: método recomendado.
- **Caché del navegador**: respaldo.
- **Online**: cuando hay conexión.

## Privacidad

El repositorio público NO contiene las coordenadas ni IDs reales de las Zetas.

El archivo privado `relevamiento_zetas_PRIVADO.json` se carga localmente desde el teléfono.

El `.mapdata` también debe tratarse como información confidencial: aunque no guarda la lista de Zetas, sus teselas revelan aproximadamente las áreas de cobertura.

## Crear el mapa offline

1. Abrir la app desde HTTPS.
2. Cargar el relevamiento privado.
3. Menú → **Crear archivo físico .mapdata**.
4. Elegir radio, zoom y `Híbrido + imagen aérea`.
5. Guardar como `relevamiento_mapa.mapdata`.
6. Menú → **Abrir .mapdata** y seleccionar ese archivo.
7. Probar en modo avión.

El formato V2 se lee por rangos, por lo que un archivo grande no se carga entero en RAM.

## Fuentes

- Argenmap Híbrido — Instituto Geográfico Nacional de la República Argentina.
- Fotografías aéreas / ortomosaicos del IGN.

Atribución incluida en la aplicación.


## Mejora V8.1

El panel lateral ahora tiene desplazamiento vertical independiente.
No es necesario reducir el zoom del navegador para acceder a todas las opciones.
Funciona con rueda del mouse, touchpad y gesto táctil en celular.


## Corrección V8.2

Se corrigió el error en Android/Brave:
`Must be handling a user gesture to show a file picker`.

Ahora `showSaveFilePicker()` se ejecuta inmediatamente al tocar el botón,
antes de cualquier confirmación, cálculo o operación asíncrona.


## Corrección V8.3 — vistas generales offline

Los paquetes anteriores creados con zoom 10–16 siguen siendo compatibles.

Si la aplicación necesita mostrar zoom 9, 8 o 7 para encuadrar muchos puntos,
ahora reutiliza las teselas del zoom mínimo almacenado y las reduce visualmente,
en vez de dejar el fondo vacío.

Los paquetes nuevos incluyen zoom 8 y 9 además de los niveles de detalle seleccionados.


## Mejora V8.4 — paquetes por zona

Al crear el `.mapdata` ahora se puede elegir:
- Todos
- Solo Este
- Solo Oeste

El radio recomendado predeterminado pasó a 2.000 m.
El zoom recomendado sigue siendo 17.

Nombres sugeridos:
- `relevamiento_este_z17_2000m.mapdata`
- `relevamiento_oeste_z17_2000m.mapdata`

Cada archivo incluye solamente las teselas necesarias alrededor de los puntos de la zona elegida.
Esto reduce el tamaño frente a un paquete único de todo el relevamiento.

Los `.mapdata` de versiones anteriores siguen siendo compatibles.


## Correcciones V8.5

- Al elegir la ubicación del `.mapdata`, la creación comienza automáticamente.
- Se eliminó la confirmación posterior al selector de archivos.
- El estado cambia inmediatamente a `Preparando cobertura...`.
- El buscador quedó casi pegado al encabezado azul.
- Los filtros y el panel lateral también se desplazaron hacia arriba.


## Corrección V8.6

Se corrigió el error:
`lonLatToTile is not defined`

La conversión geográfica longitud/latitud → tesela XYZ ahora está definida explícitamente
dentro de la aplicación y el generador `.mapdata` no depende de funciones heredadas.
