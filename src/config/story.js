/**
 * Script of the short narrated story about Leonardo ("meet Leonardo"). A narrator
 * presents him in the third person.
 * Each slide has a kicker, a title, a handwritten note, the narration (spoken and
 * shown as a caption) and a snippet typed in the editor. `audio` is optional per
 * language: without it the slide is timed from the length of the narration.
 */
export const story = Object.freeze({
  slides: [
    {
      id: 'hello',
      image: 'assets/images/memoji.webp',
      kicker: { pt: '~/sobre $ whoami', en: '~/about $ whoami' },
      title: { pt: 'ESTE É O LEONARDO', en: 'THIS IS LEONARDO' },
      note: { pt: 'dev python e IA', en: 'python & AI dev' },
      narration: {
        pt: 'Este é o Leonardo, engenheiro de software de Brasília, com foco em Python e IA. Em poucos segundos, você vai ver o que ele constrói.',
        en: 'This is Leonardo, a software engineer from Brasília focused on Python and AI. In a few seconds, you’ll see what he builds.',
      },
      code: {
        file: 'leonardo.ts',
        text: `// quem é o Leonardo
const leonardo = {
  cargo: 'engenheiro de software',
  cidade: 'Brasília – DF',
  idade: 23,
  foco: ['Python', 'IA', 'APIs'],
};

export default leonardo;`,
      },
    },
    {
      id: 'path',
      kicker: { pt: '$ cat formacao.txt', en: '$ cat education.txt' },
      title: { pt: 'ELE APRENDE CONSTRUINDO', en: 'HE LEARNS BY BUILDING' },
      note: { pt: 'um projeto por vez', en: 'one project at a time' },
      narration: {
        pt: 'Formado em Engenharia de Software, ele aprende do jeito que mais gosta: colocando a mão no código.',
        en: 'With a degree in Software Engineering, he learns the way he likes best: with his hands on the code.',
      },
      audio: { pt: 'assets/audio/story-path-pt.mp3' },
      code: {
        file: 'formacao.ts',
        text: `// formação
const formacao = [
  'Eng. de Software — UCB',
];

const foco = ['Python', 'IA generativa',
  'SQL'];

while (true) aprender(construindo);`,
      },
    },
    {
      id: 'pdf-insight',
      kicker: { pt: 'projeto 01 / 02', en: 'project 01 / 02' },
      title: { pt: 'PDF IA', en: 'PDF AI' },
      note: { pt: 'entra PDF, sai resumo', en: 'PDF in, summary out' },
      narration: {
        pt: 'Primeiro projeto: o PDF IA. Você envia um PDF, e a inteligência artificial devolve resumo, pontos principais e insights.',
        en: 'First project: PDF AI. You upload a PDF, and artificial intelligence returns a summary, key points and insights.',
      },
      code: {
        file: 'analisar.ts',
        text: `// PDF entra, resumo sai
export async function analisar(pdf: File) {
  const texto = await extrairTexto(pdf);
  const trechos = dividir(texto);

  return ia.resumir(trechos, {
    saida: ['resumo', 'pontos', 'insights'],
  });
}`,
      },
    },
    {
      id: 'oracle-apex',
      kicker: { pt: 'projeto 02 / 02', en: 'project 02 / 02' },
      title: { pt: 'ORACLE APEX', en: 'ORACLE APEX' },
      note: { pt: 'a regra mora no banco', en: 'the rule lives in the database' },
      narration: {
        pt: 'Segundo: um cadastro de produtos em Oracle APEX, com a regra de preço garantida por uma trigger em PL/SQL.',
        en: 'Second: a product catalog in Oracle APEX, with the price rule enforced by a PL/SQL trigger.',
      },
      code: {
        file: 'trg_preco.sql',
        text: `-- a regra mora no banco
CREATE OR REPLACE TRIGGER trg_preco
BEFORE INSERT OR UPDATE ON produtos
FOR EACH ROW
BEGIN
  IF :NEW.preco <= 0 THEN
    RAISE_APPLICATION_ERROR(-20001,
      'Preço deve ser maior que zero');
  END IF;
END;`,
      },
    },
    {
      id: 'bye',
      actions: true,
      kicker: { pt: '$ exit', en: '$ exit' },
      title: { pt: 'VAMOS CONSTRUIR ALGO?', en: 'SHALL WE BUILD SOMETHING?' },
      note: { pt: 'é só chamar', en: 'just say hi' },
      narration: {
        pt: 'Gostou? Então chame o Leonardo para construir algo com você. O currículo dele está a um clique.',
        en: 'Liked it? Then call Leonardo to build something with you. His résumé is one click away.',
      },
      audio: { pt: 'assets/audio/story-bye-pt.mp3' },
      code: {
        file: 'terminal',
        text: `$ git commit -m "vamos construir algo?"
$ git push origin futuro

✔ pronto para o próximo projeto`,
      },
    },
  ],
});
