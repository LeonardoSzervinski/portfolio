# Leonardo Olivieri Szervinski — Portfolio

**Live:** [leonardosz.com](https://leonardosz.com)

Interactive portfolio: scrolling opens a 3D laptop and the camera flies into its screen,
where each project plays as an animated showcase. Portuguese and English, phone and desktop.

- **No build step and no runtime dependencies.** HTML, CSS and native ES modules.
- **Tests** run on Node's built-in test runner, in CI on every push.

## Running locally

```bash
npm start          # http://localhost:5173
npm test           # unit tests
npm run build:resume   # regenerates the résumé PDFs from resume.html
```

Requires Node 20+. `build:resume` also needs Google Chrome or Chromium.

## Project structure

```
index.html              page markup (no inline logic)
resume.html             printable résumé, also embedded in the résumé dialog
styles/                 one stylesheet per area (tokens, stage, hero, showcase, dialogs, …)
src/
  main.js               composition root: builds and wires every component
  config/               content only — projects, scenes, translations, contact
  core/                 math helpers, EventBus, Motion (Web Animations), DOM helpers
  layout/               pure camera geometry + ViewportLayout (reads the DOM)
  journey/              Journey (hero ⇄ showcase state machine) and ProgressTween
  screen/               Slide strategies, slide factory and ScreenPlayer
  components/           Laptop, Hero, Badge, Memoji, ShowcasePanel, Dialog, …
  input/                InputController: wheel, touch and keyboard → commands
tests/                  unit tests (geometry, easing, content, i18n, events)
tools/                  dev server and résumé PDF script
docs/BOARD.md           Kanban board and Definition of Done
```

## Architecture

| Principle / pattern | Where |
|---|---|
| **Single responsibility** | Each class does one job: `Laptop` only moves the 3D model, `ShowcasePanel` only renders project text, `InputController` only translates gestures. |
| **Open/Closed** | New screen media (e.g. a recorded demo) is a new `Slide` registered in `screen/slideFactory.js`; nothing else changes. |
| **Liskov substitution** | `SceneSlide` and `VideoSlide` are interchangeable behind the `Slide` interface used by `ScreenPlayer`. |
| **Interface segregation** | Components receive only the elements and callbacks they use (e.g. `Badge` gets `onOpen` and `canInteract`). |
| **Dependency inversion** | Dependencies are injected in `main.js`; `I18n` receives its storage, so tests pass an in-memory one. |
| **Observer** | `EventBus` (`language:change`, `mode:change`) decouples components. |
| **Strategy + Factory** | `Slide` subclasses chosen by `createSlide()` from each project's `media.type`. |
| **Template Method** | `Dialog.open()/close()` with `onOpen/onClose` hooks (`ResumeDialog`). |
| **State machine** | `Journey` moves between `hero` and `showcase`; progress drives every visual. |
| **Pure core** | `layout/geometry.js`, `journey/ProgressTween.js` and `config/*` have no DOM access and are unit tested. |

### Adding a project

1. Add an entry to `src/config/projects.js` (texts in `pt` and `en`).
2. Point `media` to a scene in `src/config/scenes.js`, or use `{ type: 'video', src: 'assets/…/demo.mp4' }`.
3. Run `npm test` — it checks translations, links and scene references.

## Accessibility and usability

- Real buttons and links with accessible names in both languages; visible focus ring.
- Dialogs trap focus, make the page behind them inert, close on Escape and return focus.
- Full keyboard control: ↓ / Space / PageDown advance, ↑ / ← go back, → next project.
- `prefers-reduced-motion` removes animation and makes the journey instant.
- Project changes are announced through an `aria-live` region; the page language follows the toggle.

## Deploy

Static hosting (e.g. Vercel or GitHub Pages) serving the repository root. CI runs the tests on
every push and pull request; connect the repository to the host to deploy `main` automatically.
