# 1. Quadro da Energia — o prompt principal

Copia tudo o que está abaixo da linha e cola numa conversa com o Claude (claude.ai ou Claude Code), junto com os teus ficheiros. Funciona com qualquer comercializador e qualquer marca de painéis. Se não tens painéis, bateria ou carro elétrico, o quadro adapta-se.

**O que precisas de juntar:**
- A última fatura de eletricidade em PDF (obrigatório). Se tiveres as duas últimas, melhor: o quadro mostra a evolução.
- Capturas do relatório mensal da app dos painéis solares, se tiveres (produção, consumo, rede, bateria).
- Captura das estatísticas de carregamento do carro elétrico, se tiveres (kWh, km, % em horas de vazio).
- Opcional: os pesos dos grandes consumidores, se tiveres tomadas inteligentes (Shelly, TP-Link, etc.).

---

És o meu assistente de energia. Quero um quadro para a TV com os números da energia lá de casa, a partir dos ficheiros que te envio. Trabalha assim:

1. **Fatura.** Lê a fatura e tira: comercializador, tarifário, potência contratada, opção horária, período e dias faturados, kWh por período horário (vazio, fora de vazio, ou ponta/cheias/vazio, ou simples), preços por kWh e por dia de potência, descontos, IEC, IVA, taxas fixas (CAV, DGEG) e o total. Calcula o preço efetivo de cada kWh já com desconto, IEC e IVA. Reconstrói o total da fatura com esses valores e confirma que bate certo ao cêntimo; se não bater, diz-me porquê antes de continuar.
2. **Solar e bateria (se houver).** Das capturas tira: produção do mês, solar consumido diretamente, solar enviado para a bateria, exportado para a rede, consumo total da casa, energia vinda da rede e da bateria. Se a bateria descarregou mais do que recebeu do sol, a diferença veio da rede: calcula-a com 90% de eficiência. Valoriza o solar consumido ao preço do kWh que ele evitou comprar (fora de vazio, se for de dia) e o exportado ao preço de venda.
3. **Carro (se houver).** Das estatísticas tira kWh carregados em casa, quilómetros e a percentagem em horas de vazio. Calcula o custo real com os preços efetivos da fatura e o custo por 100 km. Compara com um carro a gasolina de 7,5 L/100 km ao preço atual da gasolina em Portugal.
4. **Quem gasta mais.** Faz uma lista dos consumidores: o carro, os aparelhos com medição, e estimativas razoáveis para os grandes consumidores que eu indicar (marca como estimado). O que sobrar é "Resto da casa".
5. **Tarifários.** Se conseguires usar um navegador, abre o simulador em https://www.tiagofelicia.pt/eletricidade-tiagofelicia.html, separador "Simulação Completa", e mete a minha potência, opção horária, datas e kWh da fatura. Confirma que o meu tarifário atual dá o mesmo total que a fatura. Guarda o meu e as 5 alternativas mais baratas. Se não conseguires usar um navegador, salta este passo.
6. **Dados.** Preenche um ficheiro `data.json` com exatamente a estrutura do exemplo `quadro/data.json` do repositório (todos os valores em kWh e euros do período). Campos que não se aplicam ficam a `null`: `carro`, `mudanca`, `tarifarios`, e `historico` se só houver um mês.
7. **Quadro.** Usa o `quadro/index.html` do repositório https://github.com/helderpinto360/quadro-energia sem o alterar: ele lê o `data.json` da mesma pasta. Mostra-me o resultado.
8. **Publicar na Vercel (só se eu pedir).** Cria uma pasta com `public/<nome-secreto>/index.html` e `data.json`, um `vercel.json` com `X-Robots-Tag: noindex`, e publica com `npx vercel deploy --prod`. O endereço com o nome secreto é o que abro na TV.

No fim, dá-me um resumo curto: quanto paguei, quanto o sol poupou, quanto custa o carro por 100 km, quem gasta mais, e até três ações concretas para poupar, cada uma com o valor estimado em euros por mês.

Regras: não inventes números. Na casa 3D não incluas alarmes, câmaras, fechaduras nem a morada. Se faltar um dado, pergunta-me ou deixa o campo a `null`. Não ponhas no quadro a morada, o NIF, o código do ponto de entrega nem números de fatura.
