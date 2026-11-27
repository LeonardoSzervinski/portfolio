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

/* ---------- Cobrança BB ---------- */
const bbNav = (active) => sidebar('Boletos', ['Boletos', 'Pagadores', 'Boletos no BB'], active, 'HOMOLOGAÇÃO');

const bbSummary = `
  <div class="kp"><div><span>Emitidos</span><b>3</b></div><div><span>Registrados</span><b>1</b></div>
  <div><span>Baixados</span><b>2</b></div><div><span>Total</span><b>R$ 5.777,50</b></div></div>`;

const bbTable = `
  <div class="tb">
    <div class="tr h"><span>Nosso número</span><span>Pagador</span><span>Valor</span><span>Vencimento</span><span>Situação</span></div>
    <div class="tr"><span class="n">00031285573369053823</span><span>Marina Alves</span><b>R$ 5.537,60</b><span>10/12/2026</span><span class="pill">Baixado</span></div>
    <div class="tr"><span class="n">00031285573369053822</span><span>Pedro Souza</span><b>R$ 89,90</b><span>21/11/2026</span><span class="pill">Baixado</span></div>
    <div class="tr"><span class="n">00031285573369053821</span><span>Pedro Souza</span><b>R$ 150,00</b><span>15/12/2026</span><span class="pill ok">Registrado</span></div>
  </div>`;

const bbCode = codeLines([
  ['cc', '// cliente da API de Cobranças · OAuth2 com cache'],
  ['', '<span class="ck">public function</span> <span class="cf">obterToken</span>(): <span class="ct">string</span>'],
  ['', '{'],
  ['', '    <span class="cv">$tokenGuardado</span> = <span class="cv">$this</span>->tokenCache-><span class="cf">tokenValido</span>(<span class="cv">$agora</span>);'],
  ['', '    <span class="ck">if</span> (<span class="cv">$tokenGuardado</span> !== <span class="ck">null</span>) <span class="ck">return</span> <span class="cv">$tokenGuardado</span>;'],
  ['', ''],
  ['', '    <span class="cv">$resposta</span> = <span class="cv">$this</span>-><span class="cf">executar</span>(['],
  ['', '        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,'],
  ['', '        CURLOPT_POSTFIELDS => <span class="cf">http_build_query</span>(['],
  ['', "            <span class=\"cs\">'grant_type'</span> => <span class=\"cs\">'client_credentials'</span>,"],
  ['', "            <span class=\"cs\">'scope'</span> => self::ESCOPOS ]),"],
  ['', '    ]);'],
  ['', ''],
  ['', "    <span class=\"ck\">if</span> (<span class=\"cv\">$resposta</span>[<span class=\"cs\">'status'</span>] === <span class=\"cv\">401</span>) <span class=\"ck\">throw new</span> <span class=\"ct\">BBException</span>(…);"],
  ['', "    <span class=\"cv\">$this</span>->tokenCache-><span class=\"cf\">guardar</span>(<span class=\"cv\">$dados</span>[<span class=\"cs\">'access_token'</span>], …);"],
  ['', "    <span class=\"ck\">return</span> <span class=\"cv\">$dados</span>[<span class=\"cs\">'access_token'</span>];"],
  ['', '}'],
]);

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
  bbBilling: {
    accent: '#5b7cf6',
    background: 'linear-gradient(135deg,#1d2a6b 0%,#3b5bdb 55%,#36c2a5 120%)',
    address: 'gestor-de-boletos · homologação',
    frameDuration: 4800,
    frames: [
      { html: `<div class="bb">${bbNav('Boletos')}<main><h5>Boletos <small>convênio de teste</small></h5>${bbSummary}${bbTable}</main></div>` },
      {
        html: `<div class="bb">${bbNav('Boletos')}<main><h5>Boletos</h5>${bbSummary}${bbTable}<div class="bb-dim"></div>
          <div class="mdl"><h6>Emitir boleto no BB</h6>
            <div class="fld"><span>Pagador</span><div><i class="typ ty1" style="--w:9em">Pedro Souza ▾</i></div></div>
            <div class="fld"><span>Valor</span><div>R$&nbsp;<i class="typ ty2" style="--w:4em">150,00</i></div></div>
            <div class="fld"><span>Vencimento</span><div><i class="typ ty3" style="--w:6em">15/12/2026</i></div></div>
            <div class="btn"><span class="spin"></span>Emitir no BB</div></div>
          <div class="toast">✓ Registrado no BB<small>nosso número 00031285573369053821</small></div>
          <span class="cur c1"></span></main></div>`,
      },
      {
        html: `<div class="bb">${bbNav('Boletos')}<main><h5>Boleto <small>00031285573369053821</small></h5>
          <div class="dt"><div class="bcard"><div class="lb">Situação no BB · consultado agora</div>
            <div class="vv">R$ 150,00 <span class="pill ok">Normal</span></div>
            <div class="g3"><div><span class="lb">Vencimento</span><b>15/12/2026</b></div><div><span class="lb">Emissão</span><b>11/11/2026</b></div><div><span class="lb">Pagador</span><b>Pedro Souza</b></div></div>
            <div class="lb" style="margin-top:12px">Linha digitável</div><div class="ld">00190.00009 03128.557331 69053.821174 5 16610000015000</div></div>
            <div class="bcard"><div class="lb">Ciclo do boleto</div>
              <div class="steps"><div class="st"><i>✓</i>Nosso número reservado</div><div class="st"><i>✓</i>Enviado ao BB (POST /boletos)</div><div class="st"><i>✓</i>Registrado e conferido</div></div>
              <div class="danger">Baixar (cancelar) boleto</div><div class="note">aceito 30 min após a emissão</div></div></div></main></div>`,
      },
      { html: `<div class="code">${bbCode}<span class="tests">✓ testes PHPUnit</span></div>` },
    ],
    chips: [
      { frame: 0, text: { pt: 'API de Cobranças v2 · BB', en: 'BB Billing API v2' } },
      { frame: 0, text: { pt: 'PHP 8 + SQLite', en: 'PHP 8 + SQLite' } },
      { frame: 1, text: { pt: 'POST /boletos', en: 'POST /boletos' } },
      { frame: 1, text: { pt: 'erros do BB tratados', en: 'BB errors handled' } },
      { frame: 2, text: { pt: 'consulta em tempo real', en: 'live status check' } },
      { frame: 2, text: { pt: 'baixa · POST /baixar', en: 'cancel · POST /baixar' } },
      { frame: 3, text: { pt: 'OAuth2 com cache de token', en: 'OAuth2 with token cache' } },
    ],
  },

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
