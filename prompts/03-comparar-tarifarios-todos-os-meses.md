# Comparar tarifários todos os meses, automaticamente

Esta automação pega na tua última fatura de eletricidade, corre-a no simulador de [Tiago Felícia](https://www.tiagofelicia.pt/eletricidade-tiagofelicia.html) e diz-te se há um tarifário mais barato para o teu consumo real. Faz isto sozinha, uma vez por mês.

## O que precisas

- A app **Claude** no computador (Mac ou Windows), com o separador Code. As tarefas agendadas e o browser integrado vêm com a app.
- Uma pasta no computador onde guardas as faturas em PDF. Por exemplo `Documentos/Energia/faturas`.
- O ficheiro [`automacoes/tarifarios/simulador-tiagofelicia.js`](../automacoes/tarifarios/simulador-tiagofelicia.js) deste repositório, guardado nessa pasta.

## Como montar (5 minutos)

1. Abre a app Claude, separador Code, e escolhe a pasta da energia como projeto.
2. Cola o prompt abaixo e diz-lhe para criar uma **tarefa agendada** para o dia 12 de cada mês às 10h (a fatura costuma chegar por volta do dia 11). Adapta o nome do teu tarifário e a pasta.
3. Na barra lateral, em **Agendadas**, carrega em **Executar agora** uma vez. Assim aprovas as permissões do browser e dos ficheiros, e as execuções seguintes já não ficam à espera.

A tarefa só corre com a app aberta. Se o computador estiver desligado no dia 12, corre quando a abrires.

## O prompt da tarefa

```text
Responde em português europeu, com frases curtas.

Objetivo: verificar se existe um tarifário de eletricidade mais barato para o meu consumo real.

1. Procura a fatura de eletricidade mais recente em [PASTA DAS FATURAS] e em ~/Downloads (PDF do comercializador).
   Extrai: período (data de início e de fim), dias, potência contratada, opção horária, kWh por período
   (vazio, ponta, cheias, ou simples), preços e total com IVA. Reconstrói o total com esses valores e confirma
   que bate com a fatura; se não bater, explica porquê.
2. Abre no browser integrado https://www.tiagofelicia.pt/eletricidade-tiagofelicia.html, rejeita os cookies
   não essenciais e carrega em "Simulação Completa".
3. Lê o ficheiro [PASTA]/simulador-tiagofelicia.js, ajusta o bloco DADOS com a fatura (potência, datas, kWh)
   e a constante ATUAL com o nome do meu tarifário: [NOME DO TEU TARIFÁRIO, tal como aparece no simulador].
   Corre o script na página. Esperas maiores se os campos ainda não existirem.
4. Valida: o total que o simulador dá para o meu tarifário tem de bater com o total real da fatura
   (diferença de poucos cêntimos). Se não bater, diz-me e não tires conclusões.
5. Responde com uma tabela curta: o meu tarifário, as 3 alternativas mais baratas em bi-horário,
   o melhor tri-horário, o melhor simples e o melhor indexado, com o total do período e a diferença
   para o meu. Diz em uma frase se vale a pena mudar e quanto pouparia por ano.
6. Acrescenta o resultado a [PASTA]/comparacoes.md com a data, para eu ver a evolução.

Regras: não mudes de tarifário nem preenchas formulários de adesão. Não inventes valores.
Se o site mudar e o script falhar, preenche à mão e explica o que mudou.
```

## Porque é que a validação é importante

O simulador do Tiago Felícia reproduz as faturas reais com muita precisão. Na casa de exemplo, o tarifário atual deu 280,34 € no simulador contra 280,38 € na fatura, e 234,65 € contra 234,69 € no mês seguinte. Se a diferença for grande, há um dado mal lido (datas, potência ou kWh) e a comparação não vale.

## O que aprendemos com a casa de exemplo

- **Indexados:** em 2026 a energia no mercado ficou mais cara à noite do que de dia, por causa do solar. Para quem consome sobretudo de noite (carro elétrico, bateria a carregar em vazio), os indexados saíram mais de 200 € acima por mês.
- **Descontos com prazo:** muitos tarifários baratos têm descontos que acabam. Diz ao Claude a data em que o teu desconto termina, para ele comparar também sem desconto a partir de dois meses antes.

Este repositório não tem qualquer ligação ao Tiago Felícia. Usa o simulador com moderação e, se te for útil, apoia o projeto dele no próprio site.
