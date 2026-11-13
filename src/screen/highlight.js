const KEYWORDS = new Set([
  'const', 'let', 'export', 'default', 'async', 'function', 'await', 'return', 'while', 'true', 'null', 'if',
  'public', 'string', 'File',
  'CREATE', 'OR', 'REPLACE', 'TRIGGER', 'BEFORE', 'INSERT', 'UPDATE', 'ON', 'FOR', 'EACH', 'ROW', 'BEGIN', 'IF', 'THEN', 'END',
]);

const TOKEN = /(\/\/.*|--.*|^\$ .*|✔.*)|('[^'\n]*'|"[^"\n]*")|(\$?[A-Za-zÀ-ÿ_][\wÀ-ÿ]*)|(\d+)/gm;

/**
 * Splits a code snippet into coloured tokens. Deliberately tiny: it only knows
 * comments, strings, numbers and a handful of keywords, enough for the story.
 * @returns {{ text: string, kind: string }[]} kinds: comment, command, string, keyword, variable, number, plain
 */
export function highlight(code) {
  const tokens = [];
  let last = 0;
  for (const match of code.matchAll(TOKEN)) {
    if (match.index > last) tokens.push({ text: code.slice(last, match.index), kind: 'plain' });
    const [text, comment, string, word, number] = match;
    let kind = 'plain';
    if (comment) kind = comment.startsWith('$') ? 'command' : comment.startsWith('✔') ? 'string' : 'comment';
    else if (string) kind = 'string';
    else if (number) kind = 'number';
    else if (word?.startsWith('$')) kind = 'variable';
    else if (KEYWORDS.has(word)) kind = 'keyword';
    tokens.push({ text, kind });
    last = match.index + text.length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), kind: 'plain' });
  return tokens;
}

/** The first `count` characters of a token list (used to "type" the code). */
export function takeCharacters(tokens, count) {
  const taken = [];
  let remaining = count;
  for (const token of tokens) {
    if (remaining <= 0) break;
    taken.push(token.text.length <= remaining ? token : { ...token, text: token.text.slice(0, remaining) });
    remaining -= token.text.length;
  }
  return taken;
}

/** How long a narration takes to read aloud when there is no audio for it (ms). */
export const readingTime = (text) => Math.max(4200, 900 + text.length * 62);
