/**
 * Showcase scenes played on the laptop screen. Each scene is a browser window with
 * a few frames (HTML or an image with a slow pan) and feature chips per frame.
 * Styling lives in styles/scenes.css.
 */

const sidebar = (brand, items, active, environment) => `
  <nav><b>${brand}</b>${items.map((item) => `<a${item === active ? ' class="act"' : ''}>${item}</a>`).join('')}
  <span class="env">● ${environment}</span></nav>`;

const codeLines = (lines) =>
  lines
    .map(([className, html], index) => `<span class="ln${className ? ` ${className}` : ''}" style="--d:${index}">${html || ' '}</span>`)
    .join('');

/* ---------- Oracle APEX ---------- */
const oracleNav = (active) => sidebar('Produtos', ['Home', 'Gerenciar Categorias', 'Gerenciar Produtos'], active, 'APEX · ORACLE SQL');

const oracleRows = `
  <div class="tr o3"><b>Mouse Escritório</b><span class="pill or">Informática</span><b>R$ 49,90</b><span class="ed">✎</span></div>
  <div class="tr o3"><b>Teclado</b><span class="pill or">Informática</span><b>R$ 100,00</b><span class="ed">✎</span></div>`;

const oracleSearch = '<div class="srch"><div>⌕ Pesquisar produtos…</div><span>+ Criar</span></div>';

const oracleCode = codeLines([
  ['cc', '-- regra de negócio garantida no banco'],
  ['', '<span class="ck">CREATE OR REPLACE TRIGGER</span> <span class="cf">trg_produto_preco</span>'],
  ['', '  <span class="ck">BEFORE INSERT OR UPDATE ON</span> <span class="ct">produtos</span>'],
  ['', '  <span class="ck">FOR EACH ROW</span>'],
  ['', '<span class="ck">BEGIN</span>'],
  ['', '  <span class="ck">IF</span> :NEW.preco <span class="ck">IS NULL OR</span> :NEW.preco &lt;= <span class="cv">0</span> <span class="ck">THEN</span>'],
  ['', '    <span class="cf">RAISE_APPLICATION_ERROR</span>(<span class="cv">-20001</span>,'],
  ['', "      <span class=\"cs\">'O preço deve ser maior que zero'</span>);"],
  ['', '  <span class="ck">END IF</span>;'],
  ['', '<span class="ck">END</span>;'],
  ['', '/'],
]);

export const scenes = Object.freeze({
  pdfInsight: {
    accent: '#137a5c',
    background: 'linear-gradient(135deg,#0f3d33 0%,#137a5c 55%,#9fe0c4 120%)',
    address: 'pdf-insight-ai-gamma.vercel.app',
    frameDuration: 4800,
    frames: [
      {
        image: { src: 'assets/images/pdf-insight-home.webp', from: '50% 0%', to: '50% 0%' },
        html: '<div class="drop"></div><div class="pfile">PDF</div><span class="cur c2"></span>',
      },
      {
        image: { src: 'assets/images/pdf-insight-home.webp', from: '50% 0%', to: '50% 0%' },
        html: `<div class="dimw"></div><div class="proc"><b>relatorio-anual.pdf</b><small>2,4 MB · 38 páginas</small><div class="bar2"><i></i></div>
          <div class="ps"><span>Extraindo texto (pdf-parse)</span><span>Dividindo em trechos</span><span>Analisando com IA…</span></div></div>`,
      },
      {
        html: `<div class="res"><header>PDF Insight AI<em><span>Copiar</span><span>Exportar .txt</span></em></header>
          <div class="rc"><h6>Resumo geral</h6><p>O relatório apresenta os resultados do ano, destaca o crescimento das vendas digitais e propõe metas de eficiência para o próximo ciclo, com foco em automação e atendimento.</p>
            <h6 style="margin-top:12px">Frases-chave</h6><div class="qt"><span>“vendas digitais +32%”</span><span>“automação como prioridade”</span><span>“meta: −15% de custos”</span></div></div>
          <div class="rcol"><div class="rc"><h6>Pontos principais</h6><ul><li>Crescimento puxado pelo canal digital</li><li>Custos operacionais acima da meta</li><li>Novo plano de atendimento</li></ul></div>
            <div class="rc"><h6>Insights</h6><ul><li>Priorizar automação traz o maior retorno</li><li>Atendimento é o gargalo atual</li></ul></div></div></div>`,
      },
    ],
    chips: [
      { frame: 0, text: { pt: 'Next.js + TypeScript', en: 'Next.js + TypeScript' } },
      { frame: 0, text: { pt: 'upload de PDF', en: 'PDF upload' } },
      { frame: 1, text: { pt: 'extração no backend', en: 'server-side extraction' } },
      { frame: 1, text: { pt: 'PDFs longos em trechos', en: 'long PDFs chunked' } },
      { frame: 2, text: { pt: 'Ollama ou API OpenAI-compatible', en: 'Ollama or OpenAI-compatible API' } },
      { frame: 2, text: { pt: 'exporta .txt', en: 'exports .txt' } },
    ],
  },

  oracleApex: {
    accent: '#e8763a',
    background: 'linear-gradient(135deg,#3a1408 0%,#c4552a 55%,#f6c08a 120%)',
    address: 'cadastro-de-produtos · oracle apex',
    frameDuration: 4600,
    frames: [
      {
        html: `<div class="bb orx">${oracleNav('Home')}<main><h5>Cadastro de Produtos <small>Oracle APEX</small></h5>
          <div class="kp k3"><div><span>Categorias</span><b>1</b></div><div><span>Produtos</span><b>2</b></div><div><span>Preço médio</span><b>R$ 74,95</b></div></div>
          <div class="tiles"><div class="tile"><i>▤</i><b>Gerenciar Categorias</b><small>criar, editar e listar categorias</small></div>
            <div class="tile"><i>⧉</i><b>Gerenciar Produtos</b><small>nome, descrição, preço e categoria</small></div></div>
          <div class="tb" style="margin-top:12px"><div class="tr o3 h"><span>Últimos produtos</span><span>Categoria</span><span>Preço</span><span></span></div>${oracleRows}</div></main></div>`,
      },
      {
        html: `<div class="bb orx">${oracleNav('Gerenciar Produtos')}<main><h5>Produtos</h5>${oracleSearch}
          <div class="tb"><div class="tr o3 h"><span>Nome</span><span>Categoria</span><span>Preço</span><span></span></div>${oracleRows}</div></main></div>`,
      },
      {
        html: `<div class="bb orx">${oracleNav('Gerenciar Produtos')}<main><h5>Produtos</h5>${oracleSearch}<div class="bb-dim"></div>
          <div class="mdl oerr"><h6>Novo produto</h6>
            <div class="fld"><span>Nome</span><div><i class="typ ty1" style="--w:8em">Teste Trigger</i></div></div>
            <div class="fld bad"><span>Preço</span><div><i class="typ ty2" style="--w:2em">-5</i></div></div>
            <div class="fld"><span>Categoria</span><div><i class="typ ty3" style="--w:7em">Informática ▾</i></div></div>
            <div class="btn">Salvar</div>
            <div class="oramsg">⚠ ORA-20001: O preço deve ser maior que zero</div></div>
          <span class="cur c1"></span></main></div>`,
      },
      { html: `<div class="code big">${oracleCode}<span class="tests or">✓ preço validado no banco</span></div>` },
    ],
    chips: [
      { frame: 0, text: { pt: 'Oracle APEX', en: 'Oracle APEX' } },
      { frame: 0, text: { pt: 'categorias + produtos', en: 'categories + products' } },
      { frame: 1, text: { pt: 'SQL · CRUD completo', en: 'SQL · full CRUD' } },
      { frame: 2, text: { pt: 'trigger barra preço ≤ 0', en: 'trigger blocks price ≤ 0' } },
      { frame: 3, text: { pt: 'PL/SQL no banco', en: 'PL/SQL in the database' } },
    ],
  },
});
