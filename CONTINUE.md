# Continuar en otra PC — Petto Web (dashboard + sitio)

Este doc es para retomar el trabajo en `petto-web` (este repo) en otra máquina con Claude Code.
Hay un hermano de este doc en el repo del bot (`petto-bot`) con el mismo propósito.

## Setup en la PC nueva

1. Clonar ambos repos **como carpetas hermanas** (mismo padre):
   ```
   algún-directorio/
     petto bot 1/       <- el bot (repo petto-bot.git)
     petto-web/         <- este repo (tetto-web-.git)
   ```
   `astro.config.mjs` carga las env vars del bot con
   `loadEnv({ path: path.resolve('../petto bot 1/.env') })` — si cambiás el nombre de la carpeta
   del bot, hay que actualizar esa ruta o el dev server no va a tener las claves de Discord/API.
2. El bot necesita su `.env` real copiado a mano (no está en ningún repo). Sin eso, todo lo que
   pega a Discord/API privada en el dashboard (login, `/dash/manage`, cualquier página de guild)
   redirige a `?error=server_not_configured` o similar.
3. `npm install`, `npm run dev` (Astro 4 + `@astrojs/react` islands, puerto 4321 por defecto).
4. `npm run build` antes de dar cualquier cambio por terminado, es la única forma real de detectar
   errores de compilación en este proyecto (no hay test suite).
5. Deploy: Cloudflare Pages/Workers (`@astrojs/cloudflare` adapter, `output: 'hybrid'`). En
   producción las env vars se configuran en el dashboard de Cloudflare Pages, no se leen de
   `.env` (eso es solo para dev local).

## Cómo le gusta trabajar al usuario (Lian/Liam)

- **Español neutro, sin voseo, nunca uses el guion largo (em dash, —)** en las respuestas de chat.
  Regla fija, no preferencia de estilo.
- Explicá el *por qué* además del *qué*, sobre todo en troubleshooting.
- Antes de decir que un cambio visual "quedó terminado": describí qué se ve raro y por qué si hay
  dudas, no asumas. Si no podés verlo corriendo (auth real, datos reales de Discord), decilo
  explícitamente en vez de asegurar que "debería verse bien".
- Corré `npm run build` después de cada tanda de cambios, no confíes en que "compila seguro".
- Liam es el jefe/dueño del proyecto, sé cálido y deferente.

## Guía de diseño del dashboard (repetido seguido, conviene tenerlo presente)

- Nunca `<select multiple>` nativo, siempre el patrón checkbox-list en un div con borde,
  `max-height` y `overflow-y:auto` (ver cualquier `Dash*.astro` con `data-filterable` como
  referencia, ej. `DashModeration.astro`, `DashLeveling.astro`).
- Mismo patrón visual en todos los módulos: card con `var(--card)`, header con ícono en un chip
  de color (`--c` custom property + `color-mix`), título, y descripción chica debajo. Ver
  `DashModeration.astro`'s `.md-card`/`.md-card-head`/`.md-card-icon` como el patrón canónico,
  ya replicado en Automation/Leveling/Tickets/Giveaways/General.
- Texto suelto sin fondo/borde al lado de elementos con card se ve inconsistente, envolver en
  chip/card.
- Verificar visualmente antes de cerrar un cambio de diseño (build + captura o descripción
  detallada), no alcanza con que el build compile.

## Estado del proyecto al momento de este doc

Todo lo de esta sección ya está hecho y pusheado a `main`, es contexto para no repetir trabajo:

- **Embed Builder** en React (`src/react/embeds/`), habla con la API privada (`embed_templates`) y con
  el bot real, no con tokens/webhooks pegados a mano. Incluye preview en vivo, hasta 10 embeds y
  5 filas de botones, y un panel de variables (`VariablesPanel.tsx`) siempre visible (reemplazó un
  popup flotante que se rompía).
- **`/dash/manage`**: cards con banner blureado del ícono del server + avatar sobrepuesto, botón
  "Add Bot" en gris (no azul) para servers sin el bot, ícono default (`/assets/dash-guild-fallback.avif`)
  cuando el server no tiene ícono propio, footer visible, scroll arreglado.
- **`/dash`** (login/landing): ya no hace redirect forzado a manage si estás logueado, muestra un
  botón "Go to your servers" en su lugar. Rediseñado con secciones "What you get" / "How it works"
  / CTA final, footer visible.
- **Dashboard de guild** (`DashGuildLayout.astro`, el shell con sidebar):
  - Server switcher es un dropdown real (lista los servers donde está el bot), no un link fijo a
    `/dash/manage`.
  - Barra de "cambios sin guardar" flotante abajo: bloquea navegación (shake) si hay un form
    tocado sin guardar, funciona como botón de guardar siempre accesible, color de contraste
    (`var(--text)`/`var(--bg)`, no azul).
  - Navegación del sidebar convertida a AJAX (antes recargaba la página entera en cada click),
    con una barra de progreso fina arriba durante la carga.
  - Responsive: sidebar colapsa detrás de un botón toggle en mobile/tablet (antes ocupaba 70vh
    fijo siempre visible).
- **Navbar principal** (`Base.astro`): tiene menú hamburguesa real en mobile/tablet (antes el
  `nav.links` completo desaparecía sin ningún reemplazo bajo 880px).
- **`/docs` local eliminado por completo** (los 33 archivos en en/es/pt-br + los componentes
  `Docs.astro`/`DocsModule.astro`/`DocsLayout.astro`). Todo redirige 301 a `https://wiki.petto.sbs`
  vía `astro.config.mjs`'s `redirects`. Los docs reales viven en un repo aparte
  (`https://github.com/liamt8d/wiki-petto.git`, sitio Mintlify).
- Todos los módulos del dashboard de guild pasaron por una pasada de consistencia visual
  (Automation, Leveling, Tickets, Giveaways, General), agregando headers con ícono que antes no
  tenían. `DashModeration.astro`, `DashCommunity.astro`, `DashOnboarding.astro`, `DashLogging.astro`
  ya estaban al día antes de esta pasada.

## Pendiente / no hecho todavía

Nada quedó explícitamente pendiente de la última sesión de trabajo, pero son proyectos vivos —
preguntale al usuario qué sigue en vez de asumir. Cosas que podrían valer una revisión futura:
- No hay test suite automatizado en ninguno de los dos repos, solo `npm run build`.
- El bot se despliega a mano (tar.gz), sin CI/CD real todavía.

## Prompt para pegarle a Claude Code al arrancar en la PC nueva

```
Segui trabajando en el dashboard de Petto (Astro 4 + React islands, Cloudflare). Leé CONTINUE.md
en la raíz de este repo primero, es el contexto de dónde quedó todo. El bot hermano está en
../petto bot 1 (repo petto-bot.git, hace falta para las env vars en dev), y los docs públicos en
un tercer repo separado (wiki-petto, sitio Mintlify en wiki.petto.sbs) que no es parte de este
working directory.
```
