/* =========================================================
   CONTEÚDO DO SITE — Mentoria Educacional Promover (7º Ano)
   Matemática · Medidas de Tendência Central
   c = índice da correta (0=A,1=B,2=C,3=D)
   ========================================================= */
const CONFIG = { serie: '7º', serieLonga: '7º Ano', lsKey: 'promover_7ano_mat_v1', area: 'Matemática' };
const FR = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;

const MODULOS = {
  m1: {
    id: 'm1', titulo: 'Matemática', sub: 'Média Simples, Média Ponderada, Moda e Mediana', emoji: '📊',
    topicos: ['Média simples', 'Média ponderada', 'Moda, mediana e amplitude', 'Cascas de banana (pegadinhas)'],
    questoes: [
      { t: 0, fig: 'q1', txt: 'O gráfico de colunas mostra a pontuação de Ana em quatro rodadas de um campeonato de matemática. Redistribuindo igualmente os pontos entre as quatro rodadas (<b>média aritmética simples</b>), quantos pontos ficam em cada rodada?',
        ops: ['6 pontos.', '7 pontos.', '8 pontos.', '28 pontos.'], c: 1,
        dica: 'Some as 4 colunas e divida por 4. Não pare na soma!',
        exp: `Soma: 4 + 8 + 6 + 10 = 28. Média: ${FR(28, 4)} = <b>7 pontos</b>. A pegadinha é parar no 28 (letra D) e esquecer de dividir.` },
      { t: 2, txt: 'Associe cada medida da <b>Coluna A</b> à definição da <b>Coluna B</b>:<br><table class="assoc"><tr><th>Coluna A</th><th>Coluna B</th></tr><tr><td>(1) Média simples</td><td>( ) Valor central de um conjunto ordenado.</td></tr><tr><td>(2) Média ponderada</td><td>( ) Soma de todos os valores dividida pela quantidade.</td></tr><tr><td>(3) Moda</td><td>( ) Valor ou categoria de maior frequência.</td></tr><tr><td>(4) Mediana</td><td>( ) Soma dos produtos pelos pesos dividida pela soma dos pesos.</td></tr></table>A sequência correta da Coluna B, de cima para baixo, é:',
        ops: ['4 − 1 − 3 − 2.', '1 − 4 − 3 − 2.', '4 − 3 − 1 − 2.', '3 − 1 − 4 − 2.'], c: 0,
        dica: 'Valor central = mediana. Soma ÷ quantidade = média simples.',
        exp: 'Valor central ordenado → <b>Mediana (4)</b>. Soma ÷ quantidade → <b>Média simples (1)</b>. Maior frequência → <b>Moda (3)</b>. Pesos → <b>Média ponderada (2)</b>. Sequência: <b>4 − 1 − 3 − 2</b>.' },
      { t: 1, txt: 'Numa olimpíada, a nota final é a <b>média ponderada</b> de três etapas: Prova Objetiva (peso 2), Redação (peso 3) e Prova Oral (peso 5). Pedro tirou <b>7,0</b> na Objetiva, <b>8,0</b> na Redação e <b>6,0</b> na Oral. Qual foi sua média final?',
        ops: ['6,8.', '7,0.', '7,2.', '22,6.'], c: 0,
        dica: 'Multiplique cada nota pelo peso e divida pela SOMA DOS PESOS (2 + 3 + 5).',
        exp: `${FR('7·2 + 8·3 + 6·5', '2 + 3 + 5')} = ${FR('14 + 24 + 30', 10)} = ${FR(68, 10)} = <b>6,8</b>. Pegadinhas: fazer média simples (7,0) ou dividir por 3 (22,6).` },
      { t: 2, txt: 'As temperaturas mínimas de uma cidade serrana em seis dias foram: <b>18 °C, 21 °C, 16 °C, 20 °C, 17 °C e 22 °C</b>. Qual é a <b>mediana</b>?',
        ops: ['18,0 °C.', '18,5 °C.', '19,0 °C.', '20,0 °C.'], c: 2,
        dica: 'Primeiro coloque em ordem! Com 6 valores (par), faça a média dos dois do meio.',
        exp: `Rol: 16, 17, <b>18, 20</b>, 21, 22. São 6 valores (par): Me = ${FR('18 + 20', 2)} = <b>19,0 °C</b>.` },
      { t: 3, fig: 'q5', txt: 'A tabela mostra o número de livros lidos no bimestre pelos <b>20 alunos</b> de uma turma. Qual é a <b>moda</b> e a <b>média</b> de livros lidos por aluno, respectivamente?',
        ops: ['9 livros e 2,50 livros.', '2 livros e 2,25 livros.', '2 livros e 2,50 livros.', '9 livros e 2,25 livros.'], c: 1,
        dica: 'A moda é a quantidade de LIVROS mais votada, não o número de alunos (9)!',
        exp: `Moda: <b>2 livros</b> (9 alunos leram 2 livros — não confunda com o 9!). Média: ${FR('1·4 + 2·9 + 3·5 + 4·2', 20)} = ${FR(45, 20)} = <b>2,25 livros</b>.` },
      { t: 3, txt: 'Os tempos de cinco nadadores numa bateria de 50 m foram: <b>28 s, 31 s, 29 s, 33 s e 30 s</b>. Sobre a <b>moda</b>, é correto afirmar que:',
        ops: ['a moda é 0 s, pois nenhum número se repete.', 'a moda é 30 s, pois é o valor central do conjunto ordenado.', 'o conjunto não possui moda, sendo classificado como amodal.', 'a moda é 33 s, por ser o maior tempo registrado.'], c: 2,
        dica: 'Algum tempo aparece mais de uma vez?',
        exp: 'Todos os tempos são diferentes: nenhum se repete. O conjunto é <b>amodal</b> (não tem moda). Nunca diga que a moda é 0 se o 0 nem aparece! (30 s é a <i>mediana</i>, não a moda.)' },
      { t: 0, txt: 'Para ser aprovado direto em História, um estudante precisa de <b>média simples 7,0</b> nos quatro bimestres. Nos três primeiros, tirou <b>6,5</b>, <b>6,0</b> e <b>7,5</b>. Qual nota mínima precisa tirar no 4º bimestre?',
        ops: ['7,0.', '7,5.', '8,0.', '8,5.'], c: 2,
        dica: 'Use a calculadora "Quanto preciso tirar?". Soma necessária = média × quantidade.',
        exp: 'Soma necessária: 7,0 × 4 = 28,0. Já tem: 6,5 + 6,0 + 7,5 = 20,0. Falta: 28,0 − 20,0 = <b>8,0</b>.' },
      { t: 2, txt: 'Numa empresa com 10 funcionários, <b>8 recebem R$ 2.000,00</b> cada e <b>2 gerentes recebem R$ 7.000,00</b> cada. Qual é a diferença entre a <b>média salarial</b> e a <b>mediana salarial</b>?',
        ops: ['R$ 0,00.', 'R$ 1.000,00.', 'R$ 1.500,00.', 'R$ 2.500,00.'], c: 1,
        dica: 'Veja a simulação dos salários no tópico 3. Quais são o 5º e o 6º salários em ordem?',
        exp: `Média: ${FR('8 · 2.000 + 2 · 7.000', 10)} = ${FR('30.000', 10)} = R$ 3.000. Mediana: 5º e 6º salários = ${FR('2.000 + 2.000', 2)} = R$ 2.000. Diferença: <b>R$ 1.000,00</b>.` },
      { t: 2, fig: 'q9', txt: 'O gráfico mostra quantos alunos tiraram cada nota (de 5 a 8) num simulado de Ciências. Considerando os <b>10 alunos</b>, qual é a <b>mediana</b> das notas?',
        ops: ['6,0.', '6,5.', '7,0.', '2,5.'], c: 0,
        dica: 'Escreva as 10 notas em fila: duas vezes o 5, quatro vezes o 6…',
        exp: `Rol: 5, 5, 6, 6, <b>6, 6</b>, 7, 7, 7, 8. O 5º e o 6º valem 6: Me = ${FR('6 + 6', 2)} = <b>6,0</b>.` },
      { t: 0, txt: 'A média das idades dos <b>5 jogadores</b> de um time de basquete em quadra é <b>24 anos</b>. Um jogador de <b>20 anos</b> foi substituído por um reserva de <b>30 anos</b>. Qual a nova média de idade dos 5 em quadra?',
        ops: ['24 anos.', '25 anos.', '26 anos.', '34 anos.'], c: 2,
        dica: 'Ache a soma das idades (média × 5). O que acontece com a soma na troca?',
        exp: `Soma inicial: 5 × 24 = 120. Troca: 120 − 20 + 30 = 130. Nova média: ${FR(130, 5)} = <b>26 anos</b>.` },
      { t: 1, txt: 'Numa disciplina, o Trabalho tem <b>peso 2</b> e a Prova Final tem <b>peso 3</b>. Carlos tirou <b>8,5</b> no Trabalho e ficou com média ponderada <b>7,3</b>. Qual foi a nota da Prova Final?',
        ops: ['6,1.', '6,5.', '7,0.', '7,3.'], c: 1,
        dica: 'Total de pontos ponderados = média × soma dos pesos (7,3 × 5).',
        exp: `Total ponderado: 7,3 × 5 = 36,5. Trabalho: 8,5 × 2 = 17,0. Sobram 36,5 − 17,0 = 19,5 para a prova (peso 3): ${FR('19,5', 3)} = <b>6,5</b>.` },
      { t: 2, txt: 'Dado o conjunto ordenado <b>{4, 6, 6, 8, 10, 14}</b>, associe:<br><table class="assoc"><tr><th>Coluna A</th><th>Coluna B</th></tr><tr><td>(1) Média simples</td><td>( ) 6</td></tr><tr><td>(2) Moda</td><td>( ) 7</td></tr><tr><td>(3) Mediana</td><td>( ) 8</td></tr><tr><td>(4) Amplitude</td><td>( ) 10</td></tr></table>A sequência correta da Coluna B, de cima para baixo, é:',
        ops: ['2 − 3 − 1 − 4.', '3 − 2 − 1 − 4.', '2 − 1 − 3 − 4.', '1 − 3 − 2 − 4.'], c: 0,
        dica: 'Calcule as quatro medidas (ou use a calculadora do tópico 3) e veja qual dá 6, 7, 8 e 10.',
        exp: `Moda = <b>6</b> (2). Mediana = ${FR('6 + 8', 2)} = <b>7</b> (3). Média = ${FR(48, 6)} = <b>8</b> (1). Amplitude = 14 − 4 = <b>10</b> (4). Sequência: <b>2 − 3 − 1 − 4</b>.` },
      { t: 1, txt: 'Júlia comprou <b>3 cadernos a R$ 12,00</b>, <b>2 livros a R$ 25,00</b> e <b>5 canetas a R$ 2,80</b>. Qual foi o preço <b>médio por item</b>?',
        ops: ['R$ 9,50.', 'R$ 10,00.', 'R$ 13,27.', 'R$ 33,33.'], c: 1,
        dica: 'Total gasto ÷ total de ITENS (3 + 2 + 5), não ÷ 3 tipos.',
        exp: `${FR('3·12 + 2·25 + 5·2,80', '3 + 2 + 5')} = ${FR('36 + 50 + 14', 10)} = ${FR(100, 10)} = <b>R$ 10,00</b>. (R$ 13,27 seria a média simples dos 3 preços, sem considerar as quantidades.)` },
      { t: 2, txt: 'Os tempos de 6 corredores são: <b>42, 45, 47, 49, 51, 54</b> segundos. Se o mais lento (<b>54 s</b>) for trocado por um atleta que faz <b>48 s</b>, o que acontece com a <b>média</b> e a <b>mediana</b>?',
        ops: ['A média diminui de 48 s para 47 s, e a mediana diminui de 48 s para 47,5 s.', 'A média permanece 48 s, e a mediana aumenta para 49 s.', 'A média aumenta para 49 s, e a mediana permanece 48 s.', 'Ambas permanecem inalteradas em 48 s.'], c: 0,
        dica: 'Calcule antes e depois. Depois da troca, reordene: o 48 entra no meio da fila!',
        exp: `Antes: soma 288 → média 48; Me = ${FR('47 + 49', 2)} = 48. Depois: rol 42, 45, <b>47, 48</b>, 49, 51; soma 282 → média <b>47</b>; Me = ${FR('47 + 48', 2)} = <b>47,5</b>.` },
      { t: 2, txt: 'Um conjunto de <b>cinco números inteiros</b> em ordem crescente tem <b>menor elemento 4</b>, <b>mediana 12</b>, <b>moda 15</b> e <b>média 11</b>. Qual é o <b>segundo elemento</b>?',
        ops: ['7.', '8.', '9.', '10.'], c: 2,
        dica: 'Monte: 4, ?, 12, ?, ?. A moda 15 precisa aparecer pelo menos 2 vezes. Soma = 5 × 11.',
        exp: 'Conjunto: 4, b, 12, d, e. Mediana → 3º = 12. Moda 15 (maior que 12) → d = e = 15. Soma = 5 × 11 = 55. Então 4 + b + 12 + 15 + 15 = 55 → 46 + b = 55 → <b>b = 9</b>.' }
    ]
  }
};

/* ---------------- TEORIA ---------------- */
const TEORIA = {
  m1: [
    () => `
      <p class="lead">A <b>média simples</b> é o valor que cada um teria se o total fosse <b>repartido igualmente</b>. É como <b>nivelar as torres</b>: tirar blocos das altas e colocar nas baixas até todas ficarem iguais.</p>
      <div class="formula big">x̄ = ${FR('soma de todos os valores', 'quantidade de valores')}</div>
      <div data-w="torres"></div>
      <div class="alerta">🔑 Truque importante: <b>Soma = Média × Quantidade</b>. Ele resolve as questões de "quanto preciso tirar?" e de troca de jogadores.</div>
      <div data-w="meta"></div>
      ${exemplo('Exemplo 2', 'Marina tirou 6,0, 7,5 e 8,5. Quanto precisa na 4ª avaliação para ter média 8,0?',
        'Soma necessária: 4 × 8,0 = 32,0. Já tem: 6,0 + 7,5 + 8,5 = 22,0. Falta: 32,0 − 22,0 = <b>10,0</b>.')}`,
    () => `
      <p class="lead">Na <b>média ponderada</b>, cada valor tem um <b>peso</b> (importância). Quanto maior o peso, mais aquele valor "conta". Multiplique cada valor pelo peso, some tudo e divida pela <b>soma dos pesos</b>.</p>
      <div class="formula big">x̄ₚ = ${FR('v₁·p₁ + v₂·p₂ + …', 'p₁ + p₂ + …')}</div>
      <div data-w="ponderada"></div>
      <h4>📋 Tabela de frequência também é média ponderada!</h4>
      <p>Numa tabela de frequência, o <b>número de pessoas</b> funciona como o <b>peso</b>.</p>
      ${tabelaIrmaos()}
      ${exemplo('Exemplo 1', 'Numa pesquisa com 10 alunos, 2 têm 0 irmãos, 5 têm 1 irmão e 3 têm 2 irmãos. Qual é a moda e a média?',
        `A maior frequência (5 alunos) é de <b>1 irmão</b> → Mo = 1 irmão (não 5!). Média: ${FR('0·2 + 1·5 + 2·3', '2 + 5 + 3')} = ${FR(11, 10)} = <b>1,1 irmão</b>.`)}`,
    () => `
      <div class="tres">
        <div class="box ql"><b>👑 Moda (Mo)</b><p>O valor que <b>mais se repete</b>.</p><p class="mini-ex"><b>Unimodal</b>: 1 moda · <b>Bimodal</b>: 2 empatadas · <b>Amodal</b>: nenhum se repete</p></div>
        <div class="box qt"><b>🎯 Mediana (Me)</b><p>O valor do <b>meio</b>, <u>depois de ordenar</u> (rol).</p><p class="mini-ex">Ímpar: o termo do meio · Par: média dos dois do meio</p></div>
        <div class="box qa"><b>↔️ Amplitude (A)</b><p>A variação total dos dados.</p><p class="mini-ex"><b>A = maior − menor</b></p></div>
      </div>
      <h4>🎯 Encontrando a mediana (depois de ordenar!)</h4>
      <div data-w="ordenar"></div>
      <h4>🧮 Calculadora das 4 medidas</h4>
      <div data-w="medidas"></div>
      <h4>💼 Média × mediana: o efeito dos valores extremos</h4>
      <div data-w="salarios"></div>`,
    () => `
      <p class="lead">As três pegadinhas que mais derrubam alunos nas provas. Toque em cada cartão para ver o jeito certo.</p>
      <div class="cascas">
        <button class="casca"><span class="ic">🍌</span><b>1. Mediana sem ordenar</b>
          <span class="err">❌ Lista {9, 3, 12, 5, 7} → "o meio é 12"</span><span class="ok">✅ Ordene primeiro: 3, 5, <b>7</b>, 9, 12 → Me = 7</span></button>
        <button class="casca"><span class="ic">🍌</span><b>2. Divisor da média ponderada</b>
          <span class="err">❌ Pesos 2 e 3 → dividir por 2 (nº de provas)</span><span class="ok">✅ Dividir pela <b>soma dos pesos</b>: 2 + 3 = 5</span></button>
        <button class="casca"><span class="ic">🍌</span><b>3. Moda em tabelas e conjuntos amodais</b>
          <span class="err">❌ "9 alunos leram 2 livros → a moda é 9" · "nada se repete → moda 0"</span><span class="ok">✅ A moda é a <b>categoria</b> mais votada (2 livros). Se nada se repete: <b>amodal</b></span></button>
      </div>
      <div data-w="caca"></div>`
  ]
};
