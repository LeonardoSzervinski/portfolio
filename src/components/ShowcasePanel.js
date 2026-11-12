import { createElement } from '../core/dom.js';
import { EASE_IN } from '../core/Motion.js';

const pad = (value) => String(value).padStart(2, '0');

/** Project ticket, description, links and the previous/next controls. */
export class ShowcasePanel {
  constructor({ ticket, title, facts, info, key, summary, links, count, previousButton, i18n, motion }) {
    Object.assign(this, { ticket, title, facts, info, key, summary, links, count, previousButton, i18n, motion });
  }

  render(project, index, total) {
    const { i18n } = this;
    this.title.textContent = project.title;
    this.facts.replaceChildren(...i18n.pick(project.facts).map((fact) => createElement('li', { text: fact })));
    this.key.textContent = i18n.pick(project.key);
    this.summary.textContent = i18n.pick(project.summary);
    this.links.replaceChildren(...project.links.map((link) => this.#link(link)));
    this.count.textContent = `${pad(index + 1)} / ${pad(total)}`;
    this.count.setAttribute('aria-label', i18n.t('projectOf', { current: index + 1, total }));
    this.previousButton.classList.toggle('is-dimmed', index === 0);
  }

  enter({ first = false } = {}) {
    this.motion.animate(this.ticket, [
      { opacity: 0, transform: 'translateY(-60px) rotate(-6deg)' },
      { offset: 0.7, opacity: 1, transform: 'translateY(6px) rotate(1.2deg)' },
      { opacity: 1, transform: 'none' },
    ], { duration: 800, delay: first ? 150 : 0 });

    [...this.info.children].forEach((element, order) => {
      this.motion.animate(element, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], {
        duration: 600,
        delay: (first ? 250 : 80) + order * 70,
      });
    });
  }

  leave() {
    const options = { easing: EASE_IN, fill: 'forwards' };
    const animations = [
      this.motion.animate(this.ticket, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-40px) rotate(4deg)' }], { ...options, duration: 380 }),
      ...[...this.info.children].map((element, order) =>
        this.motion.animate(element, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }], { ...options, duration: 300, delay: order * 40 }),
      ),
    ];
    return Promise.all(animations.map((animation) => animation.finished.catch(() => {})));
  }

  #link({ label, href }) {
    if (!href) return createElement('span', { text: `🔒 ${this.i18n.t(label)}` });
    return createElement('a', {
      text: this.i18n.t(label),
      attributes: { href, target: '_blank', rel: 'noopener' },
    });
  }
}
