# Tutorial: o teu Quadro da Energia em 4 passos

Tempo: 20 minutos para o quadro, mais 30 para a casa em 3D. Não precisas de saber programar.

## Antes de começar

- **A app Claude** (claude.ai/download), de preferência no computador. O separador **Code** é o que permite ao Claude trabalhar com os ficheiros, abrir o browser e agendar tarefas. Para o passo 1 também serve uma conversa normal em claude.ai.
- **A tua última fatura de eletricidade em PDF.** Na app ou na área de cliente do teu comercializador.
- Opcional: capturas de ecrã do **relatório mensal** da app dos painéis solares e das **estatísticas de carregamento** do carro elétrico, do mesmo período.

Cria uma pasta, por exemplo `Energia`, e põe lá tudo.

## Passo 1 — Os números do mês e o quadro

1. Descarrega este repositório: botão verde **Code → Download ZIP**, e descomprime-o dentro da pasta `Energia`.
2. Abre a app Claude, separador Code, e escolhe a pasta `Energia`.
3. Abre [prompts/01-quadro-da-energia.md](prompts/01-quadro-da-energia.md), copia o texto a partir da linha e cola-o. Junta a fatura e as capturas.
4. O Claude lê a fatura, reconstrói o total ao cêntimo, calcula quanto o sol poupou e quanto custa o carro, e mostra-te o quadro.

**Confirma uma coisa:** o total que o Claude reconstrói tem de bater com a fatura. Se não bater, há um número mal lido e vale a pena pedir para ele rever.

## Passo 2 — A tua casa em 3D (opcional)

1. Junta a planta da casa à pasta. Se a app dos painéis deixar, exporta um dia de sol com valores de 5 ou 15 minutos.
2. Cola o prompt de [prompts/02-casa-em-3d.md](prompts/02-casa-em-3d.md).
3. Vai corrigindo por conversa: "a cozinha é do outro lado", "o carro fica na rampa", "tenho 12 painéis virados a sul".

## Passo 3 — Comparar tarifários todos os meses

Segue [prompts/03-comparar-tarifarios-todos-os-meses.md](prompts/03-comparar-tarifarios-todos-os-meses.md). Em resumo: o Claude cria uma tarefa agendada para o dia 12 de cada mês; ela pega na fatura mais recente, corre-a no simulador de tiagofelicia.pt, confirma que o simulador bate com a fatura real, e diz-te se há um tarifário mais barato e quanto pouparias por ano.

Depois de criada, carrega uma vez em **Executar agora** (barra lateral → Agendadas) para aprovar as permissões.

## Passo 4 — Pôr na TV

1. Cria uma conta gratuita em vercel.com.
2. Pede ao Claude: *"Publica o meu quadro na Vercel, com a versão com os meus dados num endereço secreto, como em publicar/."*
3. Abre o endereço no browser da TV, num Chromecast ou num Fire TV. Ao fim de 45 segundos sem ninguém mexer, a casa 3D começa um passeio sozinha.

## E depois, todos os meses

- Quando chegar a fatura nova, pede ao Claude para atualizar o quadro com ela e com as capturas do mês.
- Se quiseres dar o salto para a recolha automática, lê [prompts/04-recolha-automatica.md](prompts/04-recolha-automatica.md).

## Problemas comuns

| Sintoma | O que fazer |
|---|---|
| O quadro aparece vazio ao abrir o ficheiro | Abre-o através de um servidor (ver README) ou publica na Vercel. Abrir o `index.html` diretamente não lê o `data.json`. |
| O simulador de tarifários dá um valor diferente da fatura | Confirma datas, potência e kWh. As faturas por períodos que não começam no dia 1 enganam muito. |
| A casa 3D está lenta na TV | Acrescenta `?leve` ao endereço. |
| A tarefa mensal não correu | Só corre com a app Claude aberta. Corre quando a abrires. |
