import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/config/projects.js';
import { scenes } from '../src/config/scenes.js';
import { bootScript, LANGUAGES, translations } from '../src/config/translations.js';
import { contact } from '../src/config/contact.js';

test('every language has exactly the same interface keys', () => {
  const [reference, ...others] = LANGUAGES.map((language) => Object.keys(translations[language]).sort());
  for (const keys of others) assert.deepEqual(keys, reference);
});

test('no translation is empty', () => {
  for (const language of LANGUAGES) {
    for (const [key, value] of Object.entries(translations[language])) {
      assert.ok(value.trim().length > 0, `${language}.${key}`);
    }
  }
});

test('the boot script exists for every language', () => {
  for (const language of LANGUAGES) {
    const script = bootScript[language];
    assert.ok(script.title && script.warning && script.skip);
    assert.ok(script.lines.length > 0);
  }
});

test('projects are complete in every language', () => {
  const ids = new Set();
  for (const project of projects) {
    assert.ok(!ids.has(project.id), `duplicate id ${project.id}`);
    ids.add(project.id);
    for (const language of LANGUAGES) {
      assert.ok(project.key[language], `${project.id}.key.${language}`);
      assert.ok(project.summary[language], `${project.id}.summary.${language}`);
      assert.equal(project.facts[language].length, 3, `${project.id}.facts.${language}`);
    }
  }
});

test('project links use known labels and secure URLs', () => {
  for (const project of projects) {
    for (const link of project.links) {
      assert.ok(link.label in translations.pt, `${project.id}: ${link.label}`);
      if (link.href) assert.match(link.href, /^https:\/\//);
    }
  }
});

test('each project points to an existing scene with valid chips', () => {
  for (const project of projects.filter((p) => p.media.type === 'scene')) {
    const scene = scenes[project.media.scene];
    assert.ok(scene, `${project.id} → ${project.media.scene}`);
    assert.ok(scene.frames.length > 0);
    for (const chip of scene.chips) {
      assert.ok(chip.frame < scene.frames.length, `${project.id}: chip on frame ${chip.frame}`);
      for (const language of LANGUAGES) assert.ok(chip.text[language]);
    }
  }
});

test('contact details are well formed', () => {
  assert.match(contact.email, /^[^@\s]+@[^@\s]+\.[a-z]+$/);
  assert.match(contact.linkedin, /^https:\/\/www\.linkedin\.com\/in\//);
  assert.match(contact.github, /^https:\/\/github\.com\//);
});
