# Wiremotion

[English](README.md) · [한국어](README.ko.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [Español](README.es.md)

**Convierte pequeños diagramas JSON en GIF animados de estilo esquemático para tu README.**

[Abrir el editor](https://jeffrog-256k1.github.io/wiremotion/?lang=es) · [Configuración (inglés)](docs/configuration.md) · [Ejemplos](examples)

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/pipeline.png">
  <img src="assets/pipeline.gif" alt="Capture, Transform y Ship conectados por señales animadas" width="1280">
</picture>

[Ver imagen fija](assets/pipeline.png)

Da movimiento a un flujo con semitonos, conexiones precisas, señales que avanzan y un color de acento. Edita el JSON y guarda un GIF y un PNG estático. El diagrama se procesa en tu navegador: sin subidas, cuentas ni claves de API.

## Crea tu primer diagrama

1. Abre el editor en línea.
2. Elige **Secuencia**, **Ramificación** o **Centro** y edita las etiquetas del JSON.
3. Selecciona un tema y pulsa **Exportar GIF** y **Guardar PNG**.
4. Copia el código README y coloca ambas imágenes en la carpeta `assets/` de tu repositorio.

Si el JSON no es válido, se conserva la última vista válida y se desactiva la exportación. El GIF se genera en un Worker y se puede cancelar. El contenido no se guarda automáticamente: descarga tu JSON antes de salir. Solo se guarda localmente tu preferencia de idioma.

## Cinco idiomas

La interfaz y el README están disponibles en inglés, coreano, chino simplificado, japonés y español. Usa el menú superior o comparte un enlace con `?lang=es`. Los valores admitidos son `en`, `ko`, `zh-CN`, `ja` y `es`. Cambiar de idioma conserva el JSON, el tema y el diagrama. Los botones, errores de validación, etiquetas accesibles y estados de exportación están traducidos. El contenido de ejemplo, las leyendas técnicas del gráfico, las claves JSON, la salida de la CLI y la referencia avanzada siguen en inglés. Puedes escribir tus etiquetas en cualquier idioma compatible con las fuentes del sistema.

## Tres plantillas

| Plantilla                          | Uso                                              | Estructura                             |
| ---------------------------------- | ------------------------------------------------ | -------------------------------------- |
| [Pipeline](examples/pipeline.json) | Compilación, publicación, procesamiento de datos | De 2 a 5 nodos en orden                |
| [Branch](examples/branch.json)     | Una entrada, varias salidas                      | Una raíz y de 2 a 4 hojas              |
| [Hub](examples/hub.json)           | Espacios de trabajo, conexiones entre servicios  | Un centro y de 2 a 5 nodos periféricos |

<details>
<summary>Ver Ramificación y Centro en movimiento</summary>

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/branch.png">
  <img src="assets/branch.gif" alt="Flujo ficticio que se divide en un artículo, un vídeo y una demo" width="1280">
</picture>

[Ver imagen fija](assets/branch.png)

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/hub.png">
  <img src="assets/hub.gif" alt="Espacio de trabajo claro conectado a notas, archivos, tareas y personas" width="1280">
</picture>

[Ver imagen fija](assets/hub.png)

</details>

## Ejecución local

Requiere **Node.js 22.12 o posterior** y npm. No necesita Python, FFmpeg, fuentes externas ni servicios de pago.

```sh
git clone https://github.com/jeffrog-256k1/wiremotion.git
cd wiremotion
npm ci
npm run dev
```

Abre **http://127.0.0.1:4317**. El servidor de desarrollo solo escucha en loopback. El editor necesita Canvas, Web Workers y OffscreenCanvas; Chromium es el navegador principal de pruebas. La descarga inicial del sitio y sus recursos usa la red, pero el procesamiento y las exportaciones son locales.

### Renderizar desde un archivo

```sh
npx playwright install chromium
npm run render -- examples/pipeline.json --out renders/my-flow
```

Este comando compila la aplicación, renderiza mediante un servidor temporal en loopback y crea `my-flow.gif`, `my-flow.png` y `my-flow.md`. No sobrescribe archivos existentes salvo que uses `--force`. Las rutas del Markdown son relativas a las imágenes; ajústalas al moverlo al README. En Linux puede ser necesario `npx playwright install --with-deps chromium`. También puedes definir `WIREMOTION_BROWSER_CHANNEL=chrome` para usar Chrome instalado. Aún no hay un paquete publicado en npm; ejecuta estos comandos desde el repositorio clonado.

## La entrada es JSON

```json
{
  "version": 1,
  "title": "Una pequeña idea, publicada.",
  "layout": "pipeline",
  "nodes": [
    {
      "id": "idea",
      "label": "Idea"
    },
    {
      "id": "ship",
      "label": "Publicar"
    }
  ],
  "edges": [
    {
      "from": "idea",
      "to": "ship"
    }
  ]
}
```

Los campos opcionales son `theme`, `accent`, `subtitle`, `duration`, `width`, `seed` y `sequence`. En `sequence`, cada ID de nodo aparece exactamente una vez. Debe haber una conexión menos que nodos: en secuencia se conectan en orden; en ramificación y centro, el primer nodo se conecta con los demás. Máximos: entrada de 16 KiB, título de 52 caracteres, subtítulo de 96, etiqueta de nodo de 26, detalle de 42 y etiqueta de conexión de 16. Consulta la [referencia completa](docs/configuration.md) en inglés.

## Alcance

- Tres diseños fijos; temas oscuro y claro; color de acento hexadecimal de seis dígitos.
- Bucles de 4 o 6 segundos a 15 fps; salida de 960×540 o 1280×720.
- GIF, PNG, JSON y código README. Las imágenes no incluyen JavaScript, logotipo ni marca de agua obligatoria.
- La preferencia de movimiento reducido pausa la vista inicial. El código README incluye una imagen fija alternativa.
- Mismas entradas, seed, navegador y fuentes producen los mismos fotogramas. Las fuentes del sistema varían; no se promete identidad de píxeles entre plataformas.
- Las etiquetas largas se reducen y, si es necesario, se recortan con puntos suspensivos. Usa textos breves para facilitar la lectura en móviles.

No incluye distribución de grafos arbitrarios, sintaxis Mermaid ni dibujo libre. Wiremotion está pensado para crear un bucle breve y coherente que puedas exportar y guardar en tu repositorio.

## Desarrollo y pruebas

```sh
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

Las pruebas cubren límites de entrada, conexiones, disposición, fotogramas reproducibles, duración y número de fotogramas GIF, exportación, cancelación, movimiento reducido, desbordamiento móvil e idiomas. También comprueban que la aplicación local no realiza peticiones externas. Solo usan ejemplos ficticios.

La vista previa y la exportación comparten `src/renderer.ts`. gifenc codifica los GIF; Vite compila la aplicación estática y Playwright ejecuta la CLI local y las pruebas de navegador.

Las guías de [contribución](CONTRIBUTING.md) y [seguridad](SECURITY.md) están en inglés. Se agradecen informes con un pequeño JSON de ejemplo y mejoras de traducción.

## Licencia

MIT. Consulta [LICENSE](LICENSE) y los [avisos de terceros](THIRD_PARTY_NOTICES.md). Puedes usar las imágenes exportadas en proyectos personales o comerciales; no incluyas información privada en diagramas que vayas a publicar.

[jeffrog-256k1](https://github.com/jeffrog-256k1) · [leejungjae.app](https://leejungjae.app)
