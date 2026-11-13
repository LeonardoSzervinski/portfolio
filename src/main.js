/**
 * Composition root: builds every component, wires their dependencies and events.
 * Nothing else in the codebase reaches for globals or other components directly.
 */
import { contact } from './config/contact.js';
import { projects } from './config/projects.js';
import { scenes } from './config/scenes.js';
import { story } from './config/story.js';
import { translations } from './config/translations.js';
import { $, $$ } from './core/dom.js';
import { EventBus } from './core/EventBus.js';
import { Motion } from './core/Motion.js';
import { I18n } from './i18n/I18n.js';
import { ViewportLayout } from './layout/ViewportLayout.js';
import { Badge } from './components/Badge.js';
import { Dialog } from './components/Dialog.js';
import { Hero } from './components/Hero.js';
import { LanguageToggle } from './components/LanguageToggle.js';
import { Laptop } from './components/Laptop.js';
import { Memoji } from './components/Memoji.js';
import { ResumeDialog } from './components/ResumeDialog.js';
import { ResumeReveal } from './components/ResumeReveal.js';
import { ShowcasePanel } from './components/ShowcasePanel.js';
import { StoryDialog } from './components/StoryDialog.js';
import { ScreenPlayer } from './screen/ScreenPlayer.js';
import { Journey, MODE } from './journey/Journey.js';
import { InputController } from './input/InputController.js';

const root = document.documentElement;
const { body } = document;

const safeStorage = (() => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
})();

const bus = new EventBus();
const motion = new Motion({ reduced: matchMedia('(prefers-reduced-motion: reduce)').matches });
const i18n = new I18n({ dictionary: translations, storage: safeStorage, bus });

/* ---------- scene ---------- */
const laptop = new Laptop({
  model: $('#laptop'),
  frame: $('#scene-frame'),
  lid: $('#laptop-lid'),
  screen: $('#screen'),
});

const player = new ScreenPlayer({
  screen: $('#screen'),
  flash: $('#screen-flash'),
  projects,
  scenes,
  motion,
  language: i18n.language,
});

const layout = new ViewportLayout({
  root,
  ticket: $('#ticket'),
  info: $('#project-info'),
  wordmark: $('#wordmark'),
  lanyard: $('#lanyard'),
});

const memoji = new Memoji({ container: $('#memoji'), tilt: $('#memoji-tilt'), face: $('#memoji-face'), motion });

/* ---------- dialogs ---------- */
const inertTargets = [$('#stage'), $('#overlay')];

const profile = new Dialog({
  element: $('#profile'),
  card: $('#profile-card'),
  closeButton: $('#profile-close'),
  motion,
  inertTargets,
});

const resume = new ResumeDialog({
  element: $('#resume'),
  card: $('#resume-card'),
  closeButton: $('#resume-close'),
  frame: $('#resume-frame'),
  downloadLink: $('#resume-download'),
  i18n,
  motion,
  inertTargets,
});

const reveal = new ResumeReveal({ element: $('#reveal'), motion });

const storyDialog = new StoryDialog({
  element: $('#story'),
  card: $('#story-stage'),
  closeButton: $('#story-close'),
  slides: $('#story-slides'),
  progress: $('#story-progress'),
  previousButton: $('#story-prev'),
  nextButton: $('#story-next'),
  soundButton: $('#story-sound'),
  story,
  i18n,
  motion,
  inertTargets,
  onResume: () => openResume(),
});

const isBlocked = () => profile.isOpen || resume.isOpen || storyDialog.isOpen || reveal.isRunning;

/* ---------- hero ---------- */
let journey;

const badge = new Badge({
  element: $('#badge'),
  handle: $('#badge-handle'),
  motion,
  onOpen: () => profile.open(),
  canInteract: () => !isBlocked() && journey?.mode === MODE.HERO && !journey.busy && journey.progress < 0.3,
});

const hero = new Hero({
  container: $('#hero'),
  wordmark: $('#wordmark'),
  tagline: $('#tagline'),
  badge,
  memoji,
  navTags: $$('.nav-tag'),
  hint: $('#scroll-hint'),
  arrow: $('#chalk-arrow'),
  storyButton: $('#story-button'),
  languageToggle: $('#lang-toggle'),
  motion,
});

const panel = new ShowcasePanel({
  ticket: $('#ticket'),
  title: $('#ticket-title'),
  facts: $('#ticket-facts'),
  info: $('#project-info'),
  key: $('#project-key'),
  summary: $('#project-summary'),
  links: $('#project-links'),
  count: $('#project-count'),
  previousButton: $('#case-prev'),
  i18n,
  motion,
});

journey = new Journey({
  layout,
  laptop,
  memoji,
  hero,
  panel,
  player,
  projects,
  motion,
  bus,
  body,
  glow: $('#stage-glow'),
});

const languageToggle = new LanguageToggle({ element: $('#lang-toggle'), i18n });

/* ---------- events ---------- */
async function openResume() {
  if (isBlocked()) return;
  resume.preload(); // loads while the intro plays
  await reveal.run();
  resume.open();
}

function applyLanguage() {
  root.lang = i18n.language === 'pt' ? 'pt-BR' : 'en';
  document.title = i18n.t('documentTitle');
  i18n.translate(document);
  languageToggle.sync();
  player.setLanguage(i18n.language);
  journey.refreshText();
}

bus.on('language:change', applyLanguage);
bus.on('mode:change', (mode) => {
  memoji.enabled = mode === MODE.HERO;
  if (mode === MODE.HERO) badge.startSway();
  else badge.stopSway();
});

$('#nav-studio').addEventListener('click', () => journey.close());
$('#nav-portfolio').addEventListener('click', () => journey.open());
$('#nav-resume').addEventListener('click', openResume);
$('#story-button').addEventListener('click', () => !isBlocked() && storyDialog.open());
$('#brand').addEventListener('click', () => journey.close());
$('#case-prev').addEventListener('click', () => journey.previous());
$('#case-next').addEventListener('click', () => journey.next());
$('#screen-hit').addEventListener('click', () => journey.next());

addEventListener('pointermove', (event) => {
  if (journey.mode === MODE.HERO && event.pointerType !== 'touch') memoji.lookAt(event.clientX, event.clientY);
});
document.documentElement.addEventListener('pointerleave', () => memoji.reset());
addEventListener('resize', () => journey.relayout());

new InputController({ journey, isBlocked, onEscape: () => reveal.skip() }).listen();

/* ---------- contact links come from one place ---------- */
for (const link of $$('[data-contact]')) {
  const kind = link.dataset.contact;
  link.href = kind === 'email' ? `mailto:${contact.email}` : contact[kind];
}

/* ---------- start ---------- */
applyLanguage();
journey.start();

const fontsReady = document.fonts?.ready ?? Promise.resolve();
Promise.race([fontsReady, motion.wait(2000)]).then(() => {
  journey.relayout();
  hero.playIntro();
});
setTimeout(() => hero.playIntro(), 3500);
