import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/config/projects.js';
import { scenes } from '../src/config/scenes.js';
import { LANGUAGES, translations } from '../src/config/translations.js';
import { contact } from '../src/config/contact.js';
import { story } from '../src/config/story.js';

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

test('the story is complete in every language and covers every project', () => {
  const ids = story.slides.map((slide) => slide.id);
  for (const project of projects) assert.ok(ids.includes(project.id), `no slide for ${project.id}`);
  for (const slide of story.slides) {
    for (const language of LANGUAGES) {
      for (const field of ['kicker', 'title', 'note', 'narration']) assert.ok(slide[field][language], `${slide.id}.${field}.${language}`);
    }
    assert.ok(slide.code.file && slide.code.text.trim(), `${slide.id}.code`);
    for (const line of slide.code.text.split('\n')) assert.ok(line.length <= 46, `${slide.id}: code line too wide for phones: ${line}`);
    for (const file of Object.values(slide.audio ?? {})) assert.match(file, /^assets\/audio\/[\w-]+\.mp3$/);
  }
  assert.ok(story.slides.at(-1).actions, 'the last slide offers the next steps');
});

test('contact details are well formed', () => {
  assert.match(contact.email, /^[^@\s]+@[^@\s]+\.[a-z]+$/);
  assert.match(contact.linkedin, /^https:\/\/www\.linkedin\.com\/in\//);
  assert.match(contact.github, /^https:\/\/github\.com\//);
});
