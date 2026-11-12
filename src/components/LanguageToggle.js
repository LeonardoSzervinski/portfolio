/** PT / EN switch. Reflects the current language through aria-pressed. */
export class LanguageToggle {
  constructor({ element, i18n }) {
    this.buttons = [...element.querySelectorAll('[data-lang]')];
    this.i18n = i18n;
    for (const button of this.buttons) {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        i18n.setLanguage(button.dataset.lang);
      });
    }
    this.sync();
  }

  sync() {
    for (const button of this.buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.lang === this.i18n.language));
    }
  }
}
