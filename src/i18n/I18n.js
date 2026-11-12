import { DEFAULT_LANGUAGE, LANGUAGES } from '../config/translations.js';

const STORAGE_KEY = 'lang';

/**
 * Holds the current language, persists the choice and translates the markup.
 * Storage is injected so it can be swapped (or faked in tests).
 */
export class I18n {
  #language;

  constructor({ dictionary, storage = null, bus = null, languages = LANGUAGES, fallback = DEFAULT_LANGUAGE }) {
    this.dictionary = dictionary;
    this.storage = storage;
    this.bus = bus;
    this.languages = languages;
    this.#language = this.#readStored() ?? fallback;
  }

  get language() {
    return this.#language;
  }

  t(key, variables = {}) {
    const text = this.dictionary[this.#language]?.[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (_, name) => variables[name] ?? '');
  }

  /** Picks the current language from an object like { pt: '…', en: '…' }. */
  pick(localized) {
    return localized?.[this.#language] ?? localized?.[this.languages[0]];
  }

  setLanguage(language) {
    if (!this.languages.includes(language) || language === this.#language) return;
    this.#language = language;
    try {
      this.storage?.setItem(STORAGE_KEY, language);
    } catch {
      /* private mode: keep the choice for this visit only */
    }
    this.bus?.emit('language:change', language);
  }

  /** Translates every element marked with data-i18n, data-i18n-html or data-i18n-aria. */
  translate(root) {
    for (const element of root.querySelectorAll('[data-i18n]')) element.textContent = this.t(element.dataset.i18n);
    for (const element of root.querySelectorAll('[data-i18n-html]')) element.innerHTML = this.t(element.dataset.i18nHtml);
    for (const element of root.querySelectorAll('[data-i18n-aria]')) element.setAttribute('aria-label', this.t(element.dataset.i18nAria));
  }

  #readStored() {
    try {
      const stored = this.storage?.getItem(STORAGE_KEY);
      return this.languages.includes(stored) ? stored : null;
    } catch {
      return null;
    }
  }
}
