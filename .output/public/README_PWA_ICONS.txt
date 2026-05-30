Este directorio (public/) se usa para assets PWA (manifest icons, favicon, logo).

Manifest (config en `nuxt.config.ts`) ahora apunta a archivos locales en `public/`:
- /favicon.png  (64x64)
- /logo-192.png (192x192)
- /logo-512.png (512x512)

Si este entorno no puede generar binarios automáticamente, reemplaza manualmente:
1) public/favicon.png   (64x64)
2) public/logo-192.png  (192x192)
3) public/logo-512.png  (512x512)

Con eso, la app debe ser instalable y funcionar offline respecto a sus íconos (sin URLs externas en el manifest).

