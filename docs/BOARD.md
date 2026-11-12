# Board

Work is tracked Kanban-style. Each item moves left to right and is only "Done" when it meets the
Definition of Done below. Keep **Doing** to one or two items at a time.

## Backlog

- [ ] "Behind the code" section: short personal story with a few photos (needs photos and consent)
- [ ] Screen recordings of PDF Insight AI to use as a `video` slide
- [ ] Open Graph image and meta tags for link previews
- [ ] End-to-end smoke test in CI (headless browser: scroll, open a project, open the résumé)

## Doing

- [ ] —

## Done

- [x] Modular architecture (ES modules, one responsibility per class) and unit tests
- [x] CI on GitHub Actions (tests + reference check)
- [x] Self-hosted fonts and images; no third-party requests
- [x] Accessible dialogs (focus trap, inert background, Escape, focus return)
- [x] Scroll-driven 3D laptop, project showcases, PT/EN, profile card and résumé with PDF download

## Definition of Done

- `npm test` passes and CI is green
- Works on phone (375px) and desktop (1440px), in Portuguese and English
- Keyboard-only flow works; focus is visible; reduced-motion respected
- No console errors; no unused files or dead code left behind
- Content changes go through `src/config/*`, never hard-coded in components
