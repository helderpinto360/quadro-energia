// Comparação de tarifários no simulador de Tiago Felícia
// https://www.tiagofelicia.pt/eletricidade-tiagofelicia.html  →  separador "Simulação Completa"
//
// Como usar: abre a página num browser que o Claude controle (browser integrado da app Claude,
// Claude in Chrome, ou Playwright), carrega em "Simulação Completa", e corre este script na página
// (consola do browser ou ferramenta de JavaScript do Claude). Ajusta antes o bloco DADOS à tua última fatura.
//
// Notas:
// - Os menus da página são personalizados: os campos preenchem-se pelos ids e com eventos input/change.
// - O site usa vírgula decimal; o script aceita os dois formatos.
// - Se o site mudar e o script falhar, preenche à mão e diz ao Claude o que mudou.
// - Usa o simulador com moderação (uma vez por mês chega) e, se te for útil, apoia o projeto do Tiago Felícia.

const DADOS = {
  potencia: '6.9',             // potência contratada em kVA, como aparece no menu do site: 3.45, 4.6, 5.75, 6.9, 10.35, 13.8 ...
  inicio: '2026-09-09',        // primeiro dia do período da fatura (AAAA-MM-DD)
  fim: '2026-10-08',           // último dia do período da fatura
  vazio: 400, ponta: 60, cheias: 140   // kWh da fatura. Bi-horário: fora de vazio = ponta + cheias. Simples: soma tudo.
};
// O nome do teu tarifário atual, tal como aparece na tabela do simulador (copia da página):
const ATUAL = 'EDP | Eletricidade · Digital · Campanha -20% | DD + FE';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const set = (id, v) => { const e = document.getElementById(id); if (!e) throw new Error(`campo ${id} não encontrado: o site pode ter mudado`); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); };
const linhas = () => { const t = document.body.innerText; return t.slice(t.indexOf('\tDetalhes'), t.indexOf('Apoie este Projeto')).split('\n\n').map(s => s.trim()).filter(s => /€/.test(s)); };
const total = r => { const m = r.match(/\t\s*([\d.]*\d,\d+|\d+\.\d+)\s*€/); return m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : null; };
const resumo = () => {
  const L = linhas(), a = L.find(r => r.includes(ATUAL));
  return {
    melhores: L.slice(0, 5).map(r => ({ tarifario: r.split('\n')[1], total: total(r) })),
    atual: a ? total(a) : null,
    melhorIndexado: (() => { const r = L.find(x => /INDEXADO/.test(x)); return r ? { tarifario: r.split('\n')[1], total: total(r) } : null; })(),
    omie: (document.body.innerText.match(/OMIE \(Média Final\)[^\n]*/) || [''])[0]
  };
};

const out = { dados: DADOS };
set('potencia', DADOS.potencia); await sleep(1500);
set('d_inicio', DADOS.inicio); await sleep(600); set('d_fim', DADOS.fim); await sleep(600);
set('ciclo', 'Bi-horário - Ciclo Diário'); await sleep(2500);
set('kwh_V', DADOS.vazio); set('kwh_F', DADOS.ponta + DADOS.cheias); await sleep(3000); out.biHorario = resumo();
set('ciclo', 'Tri-horário - Ciclo Diário'); await sleep(2500);
set('kwh_V', DADOS.vazio); set('kwh_C', DADOS.cheias); set('kwh_P', DADOS.ponta); await sleep(3000); out.triHorario = resumo();
set('ciclo', 'Simples'); await sleep(2500);
set('kwh_S', DADOS.vazio + DADOS.ponta + DADOS.cheias); await sleep(3000); out.simples = resumo();
out;
