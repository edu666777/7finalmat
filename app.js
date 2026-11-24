/* =========================================================
   APP — navegação, exercícios, ilustrações e relatório
   ========================================================= */
const WHATSAPP = '5585992621003';           // (85) 99262-1003
const LS_KEY = CONFIG.lsKey;
const LETRAS = ['A', 'B', 'C', 'D'];
const MODS = Object.keys(MODULOS);

/* ---------- estado salvo no aparelho do aluno ---------- */
let S = (() => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; } })();
S.aluno = S.aluno || { nome: '', turma: '' };
S.r = S.r || {}; S.pos = S.pos || {};
MODS.forEach(m => { S.r[m] = S.r[m] || {}; S.pos[m] = S.pos[m] || 0; });
const save = () => localStorage.setItem(LS_KEY, JSON.stringify(S));

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = n => Number(n).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const R$ = n => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const strip = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent; };
const INK = '#1f2a44';
const num = v => parseFloat(String(v).replace(',', '.'));

/* =========================================================
   ILUSTRAÇÕES
   ========================================================= */
function barChart(vals, labs, o = {}) {
  const w = o.w || 340, h = o.h || 210, pl = 40, pb = 28, pt = 22, pr = 10;
  const min = o.min || 0, max = o.max || Math.max(...vals) * 1.2, ticks = o.ticks || 4;
  const cw = w - pl - pr, ch = h - pt - pb, n = vals.length, bw = cw / n * 0.58;
  let s = `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img">`;
  for (let k = 0; k <= ticks; k++) {
    const v = min + (max - min) * k / ticks, y = pt + ch - ch * k / ticks;
    s += `<line x1="${pl}" x2="${w - pr}" y1="${y}" y2="${y}" class="grid"/><text x="${pl - 6}" y="${y + 4}" class="tk" text-anchor="end">${fmt(v)}</text>`;
  }
  vals.forEach((v, i) => {
    const x = pl + cw / n * i + (cw / n - bw) / 2, bh = ch * (v - min) / (max - min), y = pt + ch - bh;
    const col = Array.isArray(o.color) ? o.color[i % o.color.length] : (o.color || '#7c5cff');
    s += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="4" fill="${col}" class="bar" style="animation-delay:${i * 90}ms"/>`;
    s += `<text x="${x + bw / 2}" y="${y - 5}" text-anchor="middle" class="vl">${fmt(v)}</text>`;
    s += `<text x="${x + bw / 2}" y="${h - 9}" text-anchor="middle" class="lb">${labs[i]}</text>`;
  });
  s += `<line x1="${pl}" x2="${pl}" y1="${pt}" y2="${pt + ch}" class="axis"/><line x1="${pl}" x2="${w - pr}" y1="${pt + ch}" y2="${pt + ch}" class="axis"/>`;
  if (o.ylabel) s += `<text x="${pl - 30}" y="12" class="tk">${o.ylabel}</text>`;
  return s + '</svg>';
}

function exemplo(t, q, r) {
  return `<div class="exemplo"><span class="tag">✏️ ${t}</span><p>${q}</p><details><summary>Ver resposta comentada</summary><div class="resp">${r}</div></details></div>`;
}

function tabelaIrmaos() {
  const d = [[0, 2], [1, 5], [2, 3]];
  return `<div class="freq">
    <table class="dupla"><thead><tr><th>Irmãos</th>${d.map(x => `<th>${x[0]}</th>`).join('')}</tr></thead><tbody><tr><th>Nº de alunos</th>${d.map(x => `<td class="${x[1] === 5 ? 'hl' : ''}">${x[1]}</td>`).join('')}</tr></tbody></table>
    <p class="center">⬇️ "abrindo" a tabela: cada aluno vira uma ficha</p>
    <div class="fichas">${d.map(([v, f]) => Array.from({ length: f }, () => `<i class="${v === 1 ? 'moda' : ''}">${v}</i>`).join('')).join('')}</div>
    <p class="center">São <b>10 fichas</b>. A que mais aparece é o <b>1</b> (moda). Somando todas: 0+0+1+1+1+1+1+2+2+2 = 11 → média = 11 ÷ 10 = <b>1,1</b></p></div>`;
}

function tabelaHTML(titulo, head, rows) {
  return `<p class="figt">${titulo}</p><table class="dupla"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, j) => j === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

const FIG = {
  q1: () => `<p class="figt">Pontuação de Ana por rodada</p>` + barChart([4, 8, 6, 10], ['Rod. 1', 'Rod. 2', 'Rod. 3', 'Rod. 4'], { max: 12, ticks: 6, color: '#7c5cff' }),
  q5: () => tabelaHTML('Livros lidos no bimestre (20 alunos)', ['Livros lidos', '1 livro', '2 livros', '3 livros', '4 livros'], [['Nº de alunos', 4, 9, 5, 2]]),
  q9: () => `<p class="figt">Notas do simulado de Ciências</p>` + barChart([2, 4, 3, 1], ['Nota 5', 'Nota 6', 'Nota 7', 'Nota 8'], { max: 5, ticks: 5, color: '#ff7a59', ylabel: 'alunos' })
};

/* quiz genérico dos mini-jogos */
function miniQuiz(el, titulo, itens, botoes) {
  let i = 0, ok = 0;
  const draw = (msg = '') => {
    if (i >= itens.length) {
      el.innerHTML = `<div class="jogo"><span class="tag">${titulo}</span><p class="placarj">🎉 Você acertou <b>${ok} de ${itens.length}</b>!</p><div class="row"><button class="btn sm" id="jr">Jogar de novo</button></div></div>`;
      $('#jr', el).onclick = () => { i = 0; ok = 0; draw(); }; return;
    }
    el.innerHTML = `<div class="jogo"><span class="tag">${titulo} (${i + 1}/${itens.length})</span>
      <div class="var">${itens[i][0]}</div>
      <div class="row">${botoes.map((b, k) => `<button class="btn sm" data-v="${k}">${b}</button>`).join('')}</div><p class="msg">${msg}</p></div>`;
    $$('[data-v]', el).forEach(b => b.onclick = () => {
      const k = +b.dataset.v, it = itens[i], acertou = k === it[1];
      if (acertou) ok++;
      i++; draw((acertou ? '✅ Isso! ' : `❌ Era <b>${botoes[it[1]]}</b>. `) + (it[2] || ''));
    });
  };
  draw();
}

/* =========================================================
   WIDGETS INTERATIVOS
   ========================================================= */
const WIDGETS = {
  torres(el) {
    let vals = [2, 6, 4], nivel = false;
    const U = 22, CORES = ['#7c5cff', '#ff7a59', '#21b5a5', '#ffb000', '#e2477a'];
    const draw = () => {
      el.innerHTML = `<div class="jogo"><span class="tag">🧱 Nivelando as torres</span>
        <div class="torres"><div class="linha-media" id="lm"><span></span></div>
          ${vals.map((v, i) => `<div class="col-t"><div class="tw" data-i="${i}" style="--c:${CORES[i]}"></div><b class="vt">${v}</b>
            <div class="mm"><button data-m="${i}" aria-label="menos">−</button><button data-p="${i}" aria-label="mais">+</button></div></div>`).join('')}</div>
        <div class="formula" id="tf"></div>
        <div class="row"><button class="btn" id="tn"></button><button class="btn sm ghost" id="ta" ${vals.length >= 5 ? 'disabled' : ''}>➕ torre</button><button class="btn sm ghost" id="tr" ${vals.length <= 2 ? 'disabled' : ''}>➖ torre</button></div></div>`;
      $$('[data-p]', el).forEach(b => b.onclick = () => { const i = +b.dataset.p; if (vals[i] < 10) vals[i]++; nivel = false; draw(); });
      $$('[data-m]', el).forEach(b => b.onclick = () => { const i = +b.dataset.m; if (vals[i] > 1) vals[i]--; nivel = false; draw(); });
      $('#ta', el).onclick = () => { vals.push(3); nivel = false; draw(); };
      $('#tr', el).onclick = () => { vals.pop(); nivel = false; draw(); };
      $('#tn', el).onclick = () => { nivel = !nivel; upd(); };
      requestAnimationFrame(upd);
    };
    const upd = () => {
      const soma = vals.reduce((a, b) => a + b, 0), m = soma / vals.length;
      $$('.tw', el).forEach((t, i) => t.style.height = ((nivel ? m : vals[i]) * U) + 'px');
      const lm = $('#lm', el); lm.style.bottom = (m * U + 52) + 'px'; lm.style.opacity = nivel ? 1 : .35; $('span', lm).textContent = `média = ${fmt(m)}`;
      $$('.vt', el).forEach((b, i) => b.textContent = nivel ? fmt(m) : vals[i]);
      $('#tf', el).innerHTML = `Soma = ${vals.join(' + ')} = <b>${soma}</b> · Quantidade = <b>${vals.length}</b> · Média = ${FR(soma, vals.length)} = <b style="color:#7c5cff">${fmt(m)}</b>`;
      $('#tn', el).textContent = nivel ? '↩️ Valores reais' : '⚖️ Nivelar as torres!';
    };
    draw();
  },
  meta(el) {
    el.innerHTML = `<div class="jogo"><span class="tag">🎯 Calculadora: quanto preciso tirar?</span>
      <div class="meta-g"><label>1º<input inputmode="decimal" value="6,0" data-n></label><label>2º<input inputmode="decimal" value="7,5" data-n></label><label>3º<input inputmode="decimal" value="8,5" data-n></label>
      <label class="alvo">Média que quero<input inputmode="decimal" value="8,0" id="mt"></label></div>
      <div id="mr"></div></div>`;
    const upd = () => {
      const ns = $$('[data-n]', el).map(i => num(i.value) || 0), alvo = num($('#mt', el).value) || 0, q = ns.length + 1;
      const precisa = alvo * q, tem = ns.reduce((a, b) => a + b, 0), falta = precisa - tem;
      const pct = Math.min(100, tem / precisa * 100);
      $('#mr', el).innerHTML = `<div class="pontos"><div style="width:${pct}%"></div><span style="left:${pct}%"></span></div>
        <p class="passo">1️⃣ Soma necessária: ${fmt(alvo)} × ${q} = <b>${fmt(precisa)}</b></p>
        <p class="passo">2️⃣ Já tenho: ${ns.map(fmt).join(' + ')} = <b>${fmt(tem)}</b></p>
        <p class="passo big">3️⃣ Preciso tirar: ${fmt(precisa)} − ${fmt(tem)} = <b style="color:${falta > 10 ? '#e5484d' : '#7c5cff'}">${fmt(Math.round(falta * 100) / 100)}</b></p>
        ${falta > 10 ? '<p class="msg">😬 Mais de 10: não dá para chegar nessa média só com a 4ª nota!</p>' : falta <= 0 ? '<p class="msg">🎉 Você já tem pontos suficientes!</p>' : ''}`;
    };
    $$('input', el).forEach(i => i.oninput = upd); upd();
  },
  ponderada(el) {
    const L = [['📝 Trabalho', 6, 2], ['📄 Prova', 8, 3], ['🗣️ Oral', 7, 0]];
    el.innerHTML = `<div class="jogo"><span class="tag">⚖️ Média ponderada: o peso é "quantas vezes a nota conta"</span>
      <table class="mini wide pond"><tr><th></th><th>Nota</th><th>Peso</th><th>Nota × Peso</th></tr>
      ${L.map((l, i) => `<tr><td>${l[0]}</td><td><input inputmode="decimal" value="${l[1]}" data-i="${i}" data-c="n"></td><td><input type="number" min="0" max="6" value="${l[2]}" data-i="${i}" data-c="p"></td><td id="pp${i}"></td></tr>`).join('')}</table>
      <div class="chips" id="pc"></div><div class="formula" id="pt"></div><p class="msg" id="ps"></p></div>`;
    const upd = () => {
      let sn = 0, sp = 0, chips = '', simples = [];
      L.forEach((l, i) => {
        const n = num($(`[data-i="${i}"][data-c="n"]`, el).value) || 0, p = Math.max(0, Math.min(6, parseInt($(`[data-i="${i}"][data-c="p"]`, el).value) || 0));
        $('#pp' + i, el).textContent = `${fmt(n)} × ${p} = ${fmt(n * p)}`; sn += n * p; sp += p;
        if (p) simples.push(n);
        chips += Array.from({ length: p }, () => `<i class="c${i}">${fmt(n)}</i>`).join('');
      });
      $('#pc', el).innerHTML = chips ? `<small>É como se fossem <b>${sp} notas</b>:</small>${chips}` : '';
      $('#pt', el).innerHTML = sp ? `x̄ₚ = ${FR(fmt(sn), `${sp} <small>(soma dos pesos)</small>`)} = <b style="color:#7c5cff">${fmt(Math.round(sn / sp * 100) / 100)}</b>` : 'A soma dos pesos não pode ser zero.';
      $('#ps', el).innerHTML = simples.length ? `Sem os pesos (média simples) daria ${fmt(Math.round(simples.reduce((a, b) => a + b, 0) / simples.length * 100) / 100)}. 🍌 Cuidado: divida pela <b>soma dos pesos</b>, não pela quantidade de provas!` : '';
    };
    $$('input', el).forEach(i => i.oninput = upd); upd();
  },
  ordenar(el) {
    const C = [[9, 3, 12, 5, 7], [10, 4, 15, 6]];
    const st = [false, false];
    const draw = () => {
      el.innerHTML = `<div class="duo">${C.map((c, k) => {
        const lst = st[k] ? [...c].sort((a, b) => a - b) : c, n = c.length, mid = n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2];
        const me = mid.reduce((a, i) => a + lst[i], 0) / mid.length;
        return `<div class="jogo ord"><span class="tag">${n} termos (${n % 2 ? 'ÍMPAR' : 'PAR'})</span>
          <div class="cartas">${lst.map((v, i) => `<i class="${mid.includes(i) ? (st[k] ? 'mid ok' : 'mid bad') : ''}">${v}</i>`).join('')}</div>
          <p class="msg">${st[k] ? (n % 2 ? `✅ Rol ordenado: o termo do meio é <b>${me}</b> → Me = ${me}` : `✅ Dois termos no meio: Me = ${FR(`${lst[mid[0]]} + ${lst[mid[1]]}`, 2)} = <b>${fmt(me)}</b>`) : `❌ Na lista bagunçada o "meio" seria ${mid.map(i => c[i]).join(' e ')}… <b>errado!</b>`}</p>
          <div class="row"><button class="btn sm" data-o="${k}">${st[k] ? '🔀 Bagunçar' : '↕️ Ordenar (ROL)'}</button></div></div>`;
      }).join('')}</div>`;
      $$('[data-o]', el).forEach(b => b.onclick = () => { st[+b.dataset.o] = !st[+b.dataset.o]; draw(); });
    };
    draw();
  },
  medidas(el) {
    el.innerHTML = `<div class="jogo"><span class="tag">🧮 Digite os valores separados por espaço</span>
      <label class="campo">Use vírgula para decimal:<input id="mv" value="4 6 6 8 10 14" inputmode="decimal"></label>
      <div class="row"><button class="btn sm ghost" data-ex="18 21 16 20 17 22">Temperaturas (Q4)</button><button class="btn sm ghost" data-ex="28 31 29 33 30">Nadadores (Q6)</button><button class="btn sm ghost" data-ex="5 5 6 6 6 6 7 7 7 8">Simulado (Q9)</button><button class="btn sm ghost" data-ex="2 6 4">Torres</button></div>
      <div id="mo"></div></div>`;
    const upd = () => {
      const v = $('#mv', el).value.split(/[\s;]+/).filter(Boolean).map(num).filter(x => !isNaN(x));
      if (!v.length) { $('#mo', el).innerHTML = '<p class="msg">Digite alguns números.</p>'; return; }
      const r = [...v].sort((a, b) => a - b), n = r.length, soma = r.reduce((a, b) => a + b, 0);
      const freq = {}; r.forEach(x => freq[x] = (freq[x] || 0) + 1);
      const dist = Object.keys(freq).map(Number).sort((a, b) => a - b), fmax = Math.max(...Object.values(freq));
      const modas = fmax === 1 ? [] : dist.filter(d => freq[d] === fmax);
      const meio = n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2], me = meio.reduce((a, i) => a + r[i], 0) / meio.length;
      $('#mo', el).innerHTML = `
        <p class="rol"><small>Rol:</small> ${r.map((x, i) => `<i class="${meio.includes(i) ? 'mid' : ''} ${modas.includes(x) ? 'moda' : ''}">${fmt(x)}</i>`).join('')}</p>
        <div class="fig">${barChart(dist.map(d => freq[d]), dist.map(fmt), { max: fmax + 1, ticks: Math.min(fmax + 1, 5), color: dist.map(d => modas.includes(d) ? '#ff7a59' : '#a9b1c6'), ylabel: 'repetições' })}</div>
        <div class="res4">
          <div><b>Média</b>${FR(fmt(soma), n)} = <em>${fmt(Math.round(soma / n * 100) / 100)}</em></div>
          <div><b>Moda</b>${modas.length ? `<em>${modas.map(fmt).join(' e ')}</em><small>${modas.length > 2 ? 'multimodal' : modas.length > 1 ? 'bimodal' : 'unimodal'}</small>` : '<em>não tem</em><small>amodal</small>'}</div>
          <div><b>Mediana</b>${n % 2 ? `<small>n = ${n} (ímpar)</small><em>${fmt(me)}</em>` : `<small>n = ${n} (par)</small>${FR(`${fmt(r[meio[0]])} + ${fmt(r[meio[1]])}`, 2)} = <em>${fmt(me)}</em>`}</div>
          <div><b>Amplitude</b>${fmt(r[n - 1])} − ${fmt(r[0])} = <em>${fmt(Math.round((r[n - 1] - r[0]) * 100) / 100)}</em></div>
        </div>`;
    };
    $('#mv', el).oninput = upd;
    $$('[data-ex]', el).forEach(b => b.onclick = () => { $('#mv', el).value = b.dataset.ex; upd(); });
    upd();
  },
  salarios(el) {
    el.innerHTML = `<div class="jogo"><span class="tag">💼 8 funcionários ganham R$ 2.000 · arraste o salário dos 2 gerentes</span>
      <input type="range" min="2000" max="20000" step="1000" value="7000" id="sg"><div id="sz"></div></div>`;
    const upd = () => {
      const g = +$('#sg', el).value, lista = [...Array(8).fill(2000), g, g], media = lista.reduce((a, b) => a + b, 0) / 10, mediana = 2000;
      const H = x => Math.max(10, x / 20000 * 120);
      $('#sz', el).innerHTML = `<div class="sal">${lista.map((s, i) => `<div><span style="height:${H(s)}px" class="${i >= 8 ? 'ger' : ''}"></span><small>${i >= 8 ? '👔' : '👷'}</small></div>`).join('')}
        <div class="lin md" style="bottom:${H(media) + 22}px"><b>média ${R$(media)}</b></div><div class="lin me" style="bottom:${H(mediana) + 22}px"><b>mediana ${R$(mediana)}</b></div></div>
        <p class="msg">Gerentes: <b>${R$(g)}</b> → média <b style="color:#ff7a59">${R$(media)}</b>, mediana <b style="color:#21b5a5">${R$(mediana)}</b>. Diferença: <b>${R$(media - mediana)}</b>.<br><small>A <b>média</b> é "puxada" por valores muito altos ou baixos; a <b>mediana</b> quase não muda.</small></p>`;
    };
    $('#sg', el).oninput = upd; upd();
  },
  caca(el) {
    miniQuiz(el, '🕵️ Caça às cascas de banana: certo ou errado?', [
      ['"Em {8, 2, 5}, a mediana é 2, porque está no meio."', 1, 'Ordenando: 2, 5, 8 → Me = 5.'],
      ['"Pesos 2 e 3: divido a soma dos produtos por 5."', 0, 'Soma dos pesos = 5.'],
      ['"Numa tabela, se 12 alunos tiraram nota 7, a moda é 12."', 1, 'A moda é a nota 7.'],
      ['"Em {3, 8, 1, 9}, nada se repete, então é amodal."', 0],
      ['"Em {3, 8, 1, 9}, nada se repete, então a moda é 0."', 1, 'Escreva amodal.'],
      ['"Com 6 valores, a mediana é a média do 3º e do 4º termos (já ordenados)."', 0],
      ['"Para média 7 em 4 provas, preciso somar 28 pontos."', 0, '7 × 4 = 28.']
    ], ['✅ Certo', '❌ Errado']);
  }
};
function initWidgets(root) {
  $$('[data-w]', root).forEach(el => WIDGETS[el.dataset.w] && WIDGETS[el.dataset.w](el));
  $$('.casca', root).forEach(c => c.onclick = () => c.classList.toggle('virou'));
}

/* =========================================================
   ESTATÍSTICAS
   ========================================================= */
function stats(m) {
  const qs = MODULOS[m].questoes, porTopico = MODULOS[m].topicos.map(() => ({ ok: 0, n: 0 }));
  let resp = 0, acertos = 0; const erros = [];
  qs.forEach((q, i) => {
    const r = S.r[m][i];
    if (r && r.p !== undefined) {
      resp++; porTopico[q.t].n++;
      if (r.p === q.c) { acertos++; porTopico[q.t].ok++; } else erros.push(i);
    }
  });
  return { total: qs.length, resp, acertos, erros, porTopico, pct: resp ? Math.round(acertos / resp * 100) : 0 };
}

/* =========================================================
   TELAS
   ========================================================= */
const app = () => $('#app');

function header(extra = '') {
  return `<header class="top"><a href="#" class="logo"><span class="selo">${CONFIG.serie}</span><span><b>Mentoria Educacional Promover</b><small>${CONFIG.area} · ${CONFIG.serieLonga}</small></span></a>${extra}</header>`;
}

function renderHome() {
  const cards = MODS.map(m => {
    const mod = MODULOS[m], s = stats(m), prog = Math.round(s.resp / s.total * 100);
    return `<article class="mod ${m}">
      <div class="mod-top"><span class="emoji">${mod.emoji}</span><div class="anel" style="--p:${prog}"><span>${s.resp}/${s.total}</span></div></div>
      <h2>${mod.titulo}</h2><p class="sub">${mod.sub}</p>
      <ul class="tops">${mod.topicos.map((t, i) => `<li><a href="#${m}/t/${i}">${i + 1}. ${t}</a></li>`).join('')}</ul>
      <div class="row"><a class="btn" href="#${m}/t">📖 Estudar a teoria</a><a class="btn alt" href="#${m}/q">✍️ Fazer as ${s.total} questões</a></div>
      ${s.resp ? `<p class="mini-score">Acertos na 1ª tentativa: <b>${s.acertos}/${s.resp}</b></p>` : ''}
    </article>`;
  }).join('');
  app().innerHTML = header() + `
    <section class="hero">
      <div class="hero-txt"><p class="kicker">${CONFIG.serieLonga} · Ensino Fundamental II</p>
      <h1>Média, moda e mediana <mark>sem mistério</mark>!</h1>
      <p>Nivele torres, ordene cartas, mexa nos salários e descubra as pegadinhas das provas. Depois faça as questões e <b>envie seu relatório de erros</b> para o professor pelo WhatsApp.</p>
      <form class="aluno" onsubmit="return false">
        <span class="fita"></span><b>Quem está estudando?</b>
        <label>Seu nome<input id="nome" value="${esc(S.aluno.nome)}" placeholder="Digite seu nome completo" autocomplete="name"></label>
        <label>Turma<input id="turma" value="${esc(S.aluno.turma)}" placeholder="Ex.: ${CONFIG.serie} A"></label>
        <small>Fica salvo só neste aparelho.</small>
      </form></div>
      <div class="hero-ilus"><div class="mini-torres"><span style="--h:2"></span><span style="--h:6"></span><span style="--h:4"></span></div><p><b>2, 6, 4</b> → nivelando → <b>4, 4, 4</b></p></div>
    </section>
    <section class="passos"><span>1 📖 Estude</span><span>2 🧱 Brinque com as torres</span><span>3 ✍️ Responda</span><span>4 💬 Envie no WhatsApp</span></section>
    <section class="mods">${cards}</section>
    <a class="btn relat" href="#relatorio">📋 Ver meu relatório de erros</a>`;
  $('#nome').oninput = e => { S.aluno.nome = e.target.value; save(); };
  $('#turma').oninput = e => { S.aluno.turma = e.target.value; save(); };
}

function renderModulo(m, tab, arg) {
  const mod = MODULOS[m];
  app().innerHTML = header(`<a href="#relatorio" class="btn sm ghost">📋 Relatório</a>`) + `
    <div class="mhead ${m}"><a href="#" class="voltar">← Início</a><h1>${mod.emoji} ${mod.titulo}<small>${mod.sub}</small></h1>
      <nav class="tabs"><a href="#${m}/t" class="${tab === 't' ? 'on' : ''}">📖 Teoria</a><a href="#${m}/q" class="${tab === 'q' ? 'on' : ''}">✍️ Questões</a></nav></div>
    <main id="main" class="${m}"></main>`;
  if (tab === 'q') { if (arg !== undefined && !isNaN(+arg)) { S.pos[m] = +arg; save(); } renderQuestao(m); }
  else renderTeoria(m, arg);
}

function renderTeoria(m, foco) {
  const mod = MODULOS[m], main = $('#main');
  main.innerHTML = `<nav class="indice">${mod.topicos.map((t, i) => `<a href="#${m}/t/${i}">${i + 1}. ${t}</a>`).join('')}</nav>` +
    TEORIA[m].map((fn, i) => {
      const primeira = mod.questoes.findIndex(q => q.t === i), qtd = mod.questoes.filter(q => q.t === i).length;
      return `<section class="topico" id="top-${i}"><span class="num">${i + 1}</span><h2>${mod.topicos[i]}</h2>${fn()}
        <a class="btn alt pratica" href="#${m}/q/${primeira}">✍️ Praticar este tópico (${qtd} questões) →</a></section>`;
    }).join('');
  initWidgets(main);
  if (foco !== undefined) setTimeout(() => { const t = $('#top-' + foco); t && t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
}

function renderQuestao(m) {
  const mod = MODULOS[m], i = Math.min(S.pos[m] || 0, mod.questoes.length - 1), q = mod.questoes[i];
  const r = S.r[m][i] || {}, feito = r.u !== undefined, s = stats(m);
  const dotsNav = mod.questoes.map((qq, k) => {
    const rr = S.r[m][k]; let c = '';
    if (rr && rr.u !== undefined) c = rr.u === qq.c ? (rr.p === qq.c ? 'ok' : 'fix') : 'err';
    else if (rr && rr.p !== undefined) c = 'err';
    return `<button class="qd ${c} ${k === i ? 'cur' : ''}" data-k="${k}" aria-label="Questão ${k + 1}">${k + 1}</button>`;
  }).join('');
  const ops = q.ops.map((o, k) => {
    let c = '';
    if (feito) { if (k === q.c) c = 'certa'; else if (k === r.u) c = 'errada'; else c = 'apagada'; }
    return `<button class="op ${c}" data-o="${k}" ${feito ? 'disabled' : ''}><span class="let">${LETRAS[k]}</span><span>${o}</span></button>`;
  }).join('');
  const acertou = feito && r.u === q.c;
  const fb = !feito ? '' : `<div class="fb ${acertou ? 'sim' : 'nao'}">
      <b>${acertou ? (r.p === q.c ? '🎉 Acertou de primeira!' : '💪 Agora sim! (conta como erro no relatório, mas você aprendeu)') : `😕 Não foi dessa vez. A resposta certa é a <span class="let">${LETRAS[q.c]}</span>.`}</b>
      <div class="exp"><span class="tag">🧑‍🏫 Resolução comentada</span><p>${q.exp}</p></div>
      ${acertou ? '' : `<a class="link" href="#${m}/t/${q.t}">📖 Rever a teoria: ${mod.topicos[q.t]}</a>`}
    </div>`;
  const todas = s.resp === s.total;
  const temErradas = mod.questoes.some((qq, k) => S.r[m][k] && S.r[m][k].u !== undefined && S.r[m][k].u !== qq.c);
  $('#main').innerHTML = `
    <div class="qnav">${dotsNav}</div>
    <p class="legenda"><i class="ok"></i>acertou <i class="fix"></i>corrigiu <i class="err"></i>errou</p>
    <article class="qcard">
      <div class="qmeta"><span class="qn">Questão ${i + 1}<small>/${mod.questoes.length}</small></span><span class="pill">${mod.topicos[q.t]}</span></div>
      <div class="enun">${q.txt}</div>
      ${q.fig ? `<div class="fig">${FIG[q.fig]()}</div>` : ''}
      ${!feito ? `<details class="dica"><summary>💡 Preciso de uma dica</summary><p>${q.dica}</p></details>` : ''}
      <div class="ops">${ops}</div>
      ${fb}
      <div class="row nav">
        <button class="btn ghost" id="ant" ${i === 0 ? 'disabled' : ''}>← Anterior</button>
        ${i < mod.questoes.length - 1 ? `<button class="btn" id="prox">Próxima →</button>` : `<a class="btn" href="#relatorio">📋 Ver relatório</a>`}
      </div>
    </article>
    ${todas ? `<div class="fim"><b>🏁 Você respondeu todas as questões de ${mod.titulo}!</b><p>Acertos na 1ª tentativa: <b>${s.acertos}/${s.total}</b> (${s.pct}%).</p>
      <div class="row">${temErradas ? `<button class="btn alt" id="refazer">🔁 Refazer só as que errei</button>` : ''}<a class="btn" href="#relatorio">📋 Ver e enviar relatório</a></div></div>` : ''}
    <p class="reset"><button class="linkbtn" id="zerar">Apagar respostas deste módulo e recomeçar</button></p>`;

  $$('.qd').forEach(b => b.onclick = () => { S.pos[m] = +b.dataset.k; save(); renderQuestao(m); scrollTo({ top: 0, behavior: 'smooth' }); });
  $$('.op:not([disabled])').forEach(b => b.onclick = () => {
    const k = +b.dataset.o, rr = S.r[m][i] || {};
    if (rr.p === undefined) rr.p = k;
    rr.u = k; rr.n = (rr.n || 0) + 1; S.r[m][i] = rr; save();
    renderQuestao(m);
    const f = $('.fb'); f && f.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (k === q.c) estrelas();
  });
  const go = d => { S.pos[m] = i + d; save(); renderQuestao(m); scrollTo({ top: 0, behavior: 'smooth' }); };
  $('#ant') && ($('#ant').onclick = () => go(-1));
  $('#prox') && ($('#prox').onclick = () => go(1));
  $('#refazer') && ($('#refazer').onclick = () => {
    let primeira = null;
    mod.questoes.forEach((qq, k) => { const rr = S.r[m][k]; if (rr && rr.u !== qq.c) { delete rr.u; if (primeira === null) primeira = k; } });
    S.pos[m] = primeira || 0; save(); renderQuestao(m); scrollTo({ top: 0 });
  });
  $('#zerar').onclick = () => { if (confirm('Apagar todas as respostas de ' + mod.titulo + '?')) { S.r[m] = {}; S.pos[m] = 0; save(); renderQuestao(m); } };
}

function estrelas() {
  const box = document.createElement('div'); box.className = 'estrelas';
  box.innerHTML = Array.from({ length: 14 }, (_, k) => `<i style="--x:${Math.cos(k / 14 * 6.28) * 140}px;--y:${Math.sin(k / 14 * 6.28) * 140}px">${['⭐', '✨', '🌟'][k % 3]}</i>`).join('');
  document.body.appendChild(box); setTimeout(() => box.remove(), 1000);
}

/* ---------------- RELATÓRIO ---------------- */
function textoRelatorio() {
  const d = new Date().toLocaleDateString('pt-BR');
  let t = `*RELATÓRIO DE ESTUDO – ${CONFIG.serieLonga.toUpperCase()}*\nMentoria Educacional Promover · ${CONFIG.area}\n\n👤 Aluno(a): ${S.aluno.nome || '(sem nome)'}\n🏫 Turma: ${S.aluno.turma || '-'}\n📅 Data: ${d}\n`;
  const revisar = [];
  MODS.forEach(m => {
    const mod = MODULOS[m], s = stats(m);
    t += `\n*${mod.titulo} – ${mod.sub}*\n`;
    if (!s.resp) { t += 'Ainda não respondeu.\n'; return; }
    t += `Respondidas: ${s.resp}/${s.total}\n✅ Acertos de 1ª: ${s.acertos}/${s.resp} (${s.pct}%)\n`;
    if (s.erros.length) {
      t += `❌ Erros (${s.erros.length}):\n`;
      s.erros.forEach(i => {
        const q = mod.questoes[i], r = S.r[m][i];
        t += `• Q${i + 1} (${mod.topicos[q.t]}): marcou ${LETRAS[r.p]}, certa ${LETRAS[q.c]}${r.u === q.c ? ' – corrigiu depois' : ''}\n`;
      });
    } else t += '🎉 Nenhum erro!\n';
    s.porTopico.forEach((p, k) => { if (p.n && p.ok / p.n < 0.7) revisar.push(`${mod.titulo}: ${mod.topicos[k]}`); });
  });
  if (revisar.length) t += `\n📌 *Preciso revisar:*\n${revisar.map(x => '• ' + x).join('\n')}\n`;
  return t;
}

function renderRelatorio() {
  const total = MODS.reduce((a, m) => { const s = stats(m); a.r += s.resp; a.a += s.acertos; a.t += s.total; return a; }, { r: 0, a: 0, t: 0 });
  const bloco = m => {
    const mod = MODULOS[m], s = stats(m);
    if (!s.resp) return `<section class="rbloco ${m}"><h2>${mod.emoji} ${mod.titulo}<small>${mod.sub}</small></h2><p class="vazio">Você ainda não respondeu nenhuma questão. <a href="#${m}/q">Começar agora →</a></p></section>`;
    return `<section class="rbloco ${m}">
      <h2>${mod.emoji} ${mod.titulo}<small>${mod.sub}</small></h2>
      <div class="placar"><div class="nota"><b>${s.acertos}</b><span>de ${s.resp} respondidas</span></div><div class="nota"><b>${s.pct}%</b><span>acertos de 1ª</span></div><div class="nota"><b>${s.total - s.resp}</b><span>sem responder</span></div></div>
      <div class="barras">${mod.topicos.map((t, k) => { const p = s.porTopico[k], pc = p.n ? Math.round(p.ok / p.n * 100) : 0; return `<div class="bt"><span>${t}</span><div class="trilho"><div style="width:${pc}%;background:${!p.n ? '#ccc' : pc >= 70 ? '#2bb673' : pc >= 40 ? '#ffb000' : '#e5484d'}"></div></div><em>${p.n ? `${p.ok}/${p.n}` : '–'}</em>${p.n && pc < 70 ? `<a href="#${m}/t/${k}" class="rev no-print">revisar</a>` : ''}</div>`; }).join('')}</div>
      ${s.erros.length ? `<h3>❌ Questões que errei</h3><ol class="erros">${s.erros.map(i => {
        const q = mod.questoes[i], r = S.r[m][i];
        return `<li><div class="eh"><b>Questão ${i + 1}</b><span class="pill">${mod.topicos[q.t]}</span>${r.u === q.c ? '<span class="pill verde">corrigi depois ✔</span>' : ''}</div>
          <p class="eq">${strip(q.txt).slice(0, 170)}${strip(q.txt).length > 170 ? '…' : ''}</p>
          <p class="cmp"><span class="m">Marquei: <b>${LETRAS[r.p]}</b> ${q.ops[r.p]}</span><span class="c">Certa: <b>${LETRAS[q.c]}</b> ${q.ops[q.c]}</span></p>
          <details><summary>Ver resolução</summary><p>${q.exp}</p></details></li>`;
      }).join('')}</ol>` : '<p class="parabens">🎉 Nenhum erro nas questões respondidas!</p>'}
    </section>`;
  };
  const txt = textoRelatorio();
  app().innerHTML = header(`<a href="#" class="btn sm ghost">← Início</a>`) + `
    <section class="rel-capa">
      <p class="kicker">Relatório de erros · ${CONFIG.area} · ${CONFIG.serieLonga}</p>
      <h1>${S.aluno.nome ? esc(S.aluno.nome) : 'Aluno(a) sem nome'}</h1>
      <p>${S.aluno.turma ? 'Turma ' + esc(S.aluno.turma) + ' · ' : ''}${new Date().toLocaleDateString('pt-BR')} · ${total.r}/${total.t} questões respondidas · ${total.a} acertos de 1ª</p>
      <div class="aluno inline no-print"><label>Nome<input id="nome" value="${esc(S.aluno.nome)}" placeholder="Seu nome"></label><label>Turma<input id="turma" value="${esc(S.aluno.turma)}" placeholder="${CONFIG.serie} A"></label></div>
    </section>
    ${MODS.map(bloco).join('')}
    <section class="enviar no-print">
      <h2>💬 Enviar para o professor</h2>
      <p>O WhatsApp vai abrir com a mensagem pronta para <b>(85) 99262-1003</b>. É só tocar em enviar.</p>
      <pre class="previa">${esc(txt)}</pre>
      <div class="row"><a class="btn whats" id="wpp" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}" target="_blank" rel="noopener">📲 Enviar pelo WhatsApp</a>
      <button class="btn ghost" id="copiar">📋 Copiar texto</button><button class="btn ghost" onclick="print()">🖨️ Imprimir / PDF</button></div>
      <p class="msg" id="cmsg"></p>
    </section>`;
  const upd = () => {
    save();
    const t = textoRelatorio();
    $('.previa').textContent = t;
    $('#wpp').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
    $('.rel-capa h1').textContent = S.aluno.nome || 'Aluno(a) sem nome';
  };
  $('#nome').oninput = e => { S.aluno.nome = e.target.value; upd(); };
  $('#turma').oninput = e => { S.aluno.turma = e.target.value; upd(); };
  $('#wpp').onclick = e => { upd(); if (!S.aluno.nome.trim()) { e.preventDefault(); $('#cmsg').innerHTML = '⚠️ Escreva seu nome lá em cima antes de enviar.'; $('#nome').focus(); } };
  $('#copiar').onclick = () => { navigator.clipboard.writeText(textoRelatorio()).then(() => $('#cmsg').textContent = '✅ Copiado! Cole no WhatsApp.', () => $('#cmsg').textContent = 'Não consegui copiar — selecione o texto acima.'); };
}

/* ---------------- ROTAS ---------------- */
function route() {
  const [mod, tab, arg] = (location.hash.slice(1) || '').split('/');
  if (MODULOS[mod]) renderModulo(mod, tab || 't', arg);
  else if (mod === 'relatorio') renderRelatorio();
  else renderHome();
  if (!(tab === 't' && arg !== undefined)) scrollTo(0, 0);
}
addEventListener('hashchange', route);
route();
