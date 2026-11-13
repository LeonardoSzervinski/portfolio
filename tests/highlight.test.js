import { test } from 'node:test';
import assert from 'node:assert/strict';
import { highlight, readingTime, takeCharacters } from '../src/screen/highlight.js';

const kinds = (code) => highlight(code).filter((token) => token.kind !== 'plain').map((token) => `${token.kind}:${token.text}`);

test('highlight keeps every character of the code', () => {
  const code = "// oi\nconst a = ['x', 2];\n$ git push";
  assert.equal(highlight(code).map((token) => token.text).join(''), code);
});

test('highlight recognises comments, keywords, strings, numbers and variables', () => {
  assert.deepEqual(kinds("const idade = 23; // anos"), ['keyword:const', 'number:23', 'comment:// anos']);
  assert.deepEqual(kinds("return $token['id'];"), ['keyword:return', 'variable:$token', "string:'id'"]);
  assert.deepEqual(kinds('-- regra\nBEGIN'), ['comment:-- regra', 'keyword:BEGIN']);
});

test('takeCharacters types the code progressively without losing colours', () => {
  const tokens = highlight("const nome = 'Leo';");
  assert.equal(takeCharacters(tokens, 0).length, 0);
  const partial = takeCharacters(tokens, 3);
  assert.deepEqual(partial, [{ text: 'con', kind: 'keyword' }]);
  assert.equal(takeCharacters(tokens, 999).map((token) => token.text).join(''), "const nome = 'Leo';");
});

test('reading time grows with the text and never rushes a short line', () => {
  assert.equal(readingTime('oi'), 4200);
  assert.ok(readingTime('x'.repeat(120)) > readingTime('x'.repeat(80)));
});
