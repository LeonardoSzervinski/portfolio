const GITHUB = 'https://github.com/LeonardoSzervinski';

/**
 * Projects shown on the laptop, in order.
 * `media.type` picks how the screen renders it (see screen/slideFactory.js):
 *   - 'scene' → an animated showcase defined in config/scenes.js
 *   - 'video' → an mp4 demo at `media.src`
 * Links without `href` are rendered as plain text (private repositories).
 */
export const projects = Object.freeze([
  {
    id: 'bb-billing',
    title: 'COBRANÇA BB',
    key: { pt: '// api de cobranças bb', en: '// bb billing api' },
    facts: {
      pt: ['PHP 8 · SQLITE', 'API REST · OAUTH2', '2026'],
      en: ['PHP 8 · SQLITE', 'REST API · OAUTH2', '2026'],
    },
    summary: {
      pt: '— teste técnico: mini gestor de boletos que emite, consulta, lista e baixa boletos na API de Cobranças v2 do Banco do Brasil (homologação), com testes em PHPUnit.',
      en: '— technical test: a small billing app that issues, checks, lists and cancels bank slips through Banco do Brasil’s Billing API v2 (sandbox), covered by PHPUnit tests.',
    },
    links: [{ label: 'linkPrivate' }],
    media: { type: 'scene', scene: 'bbBilling' },
  },
  {
    id: 'pdf-insight',
    title: 'PDF IA',
    key: { pt: '// pdf insight ai', en: '// pdf insight ai' },
    facts: {
      pt: ['NEXT.JS · TYPESCRIPT', 'IA · OLLAMA / OPENAI', '2026'],
      en: ['NEXT.JS · TYPESCRIPT', 'AI · OLLAMA / OPENAI', '2026'],
    },
    summary: {
      pt: '— envie um PDF e a IA devolve resumo, pontos principais, insights e frases-chave, prontos para copiar ou exportar.',
      en: '— upload a PDF and AI returns a summary, key points, insights and key quotes, ready to copy or export.',
    },
    links: [
      { label: 'linkSite', href: 'https://pdf-insight-ai-gamma.vercel.app' },
      { label: 'linkCode', href: `${GITHUB}/pdf-insight-ai` },
    ],
    media: { type: 'scene', scene: 'pdfInsight' },
  },
  {
    id: 'oracle-apex',
    title: 'ORACLE APEX',
    key: { pt: '// cadastro de produtos', en: '// product catalog' },
    facts: {
      pt: ['ORACLE APEX', 'SQL · PL/SQL', '2025'],
      en: ['ORACLE APEX', 'SQL · PL/SQL', '2025'],
    },
    summary: {
      pt: '— cadastro de produtos e categorias em Oracle APEX, com validação de preço feita por trigger em PL/SQL.',
      en: '— a product and category catalog built in Oracle APEX, with price validation enforced by a PL/SQL trigger.',
    },
    links: [
      { label: 'linkDemo', href: 'https://apex.oracle.com/pls/apex/r/szervinski_ws/cadastro-de-produtos/home' },
      { label: 'linkCode', href: `${GITHUB}/oracle-apex-cadastro-produtos` },
    ],
    media: { type: 'scene', scene: 'oracleApex' },
  },
]);
