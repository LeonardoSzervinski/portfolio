import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventBus } from '../src/core/EventBus.js';
import { I18n } from '../src/i18n/I18n.js';

class MemoryStorage {
  #data = new Map();
  getItem(key) { return this.#data.get(key) ?? null; }
  setItem(key, value) { this.#data.set(key, String(value)); }
}

const dictionary = {
  pt: { hello: 'olá', count: 'Projeto {current} de {total}' },
  en: { hello: 'hello', count: 'Project {current} of {total}' },
};

test('event bus delivers payloads and supports unsubscribing', () => {
  const bus = new EventBus();
  const received = [];
  const off = bus.on('ping', (value) => received.push(value));
  bus.emit('ping', 1);
  off();
  bus.emit('ping', 2);
  assert.deepEqual(received, [1]);
});

test('i18n translates, interpolates and picks localized values', () => {
  const i18n = new I18n({ dictionary, storage: new MemoryStorage() });
  assert.equal(i18n.language, 'pt');
  assert.equal(i18n.t('hello'), 'olá');
  assert.equal(i18n.t('count', { current: 2, total: 3 }), 'Projeto 2 de 3');
  assert.equal(i18n.pick({ pt: 'a', en: 'b' }), 'a');
  assert.equal(i18n.t('missing'), 'missing');
});

test('changing language persists it and notifies listeners', () => {
  const storage = new MemoryStorage();
  const bus = new EventBus();
  const events = [];
  bus.on('language:change', (language) => events.push(language));

  const i18n = new I18n({ dictionary, storage, bus });
  i18n.setLanguage('en');
  i18n.setLanguage('en');
  i18n.setLanguage('fr');

  assert.equal(i18n.t('hello'), 'hello');
  assert.deepEqual(events, ['en'], 'emits once and ignores unknown languages');
  assert.equal(new I18n({ dictionary, storage }).language, 'en', 'restored on the next visit');
});

test('i18n works without storage (private browsing)', () => {
  const failing = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  const i18n = new I18n({ dictionary, storage: failing });
  i18n.setLanguage('en');
  assert.equal(i18n.language, 'en');
});
