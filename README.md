# Relevamiento Zetas — V8.1 · Archivo físico offline

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
