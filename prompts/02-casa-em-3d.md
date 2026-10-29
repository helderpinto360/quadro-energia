# 2. A tua casa em 3D, com a energia a correr lá dentro

A pasta [`casa/`](../casa) tem a versão 3D do quadro: a casa em maqueta, com os fluxos de energia do sol, da bateria, da rede e do carro, um dia real a passar em 48 segundos, cartões ao tocar em cada aparelho, e um passeio automático para a TV.

A casa de exemplo foi gerada por código a partir das medidas da planta, sem nenhum programa de modelação. Tu podes fazer o mesmo com a tua.

## O que precisas

- A **planta da casa**: o PDF do projeto ou uma fotografia, de preferência com as medidas. Se não tiveres, servem fotografias de cada divisão e as medidas aproximadas.
- Opcional, para o "dia na vida da casa": a **exportação de um dia** da app dos painéis com valores de 5 ou 15 minutos (CSV ou Excel). A maioria das apps deixa exportar (Solarman, FusionSolar, SolarEdge, Fronius, Growatt...). Escolhe um dia de sol.
- Ter feito o [prompt 1](01-quadro-da-energia.md), que gera o `data.json` com os números do mês.

## O prompt

```text
Quero a minha casa em 3D no Quadro da Energia. Usa a pasta casa/ do repositório
https://github.com/helderpinto360/quadro-energia como base.

Regras do código:
- index.html, casa-cena.js, estilo.js e carro.js NÃO se alteram.
- Escreve um modelo-casa.js novo, com exatamente a mesma estrutura do exemplo
  (pisos com altura, contornos, divisões com x0/x1/y0/y1 em metros, paredes, escadas,
  vazios, piscina se houver), a partir da minha planta.
- Mantém os nomes de objeto que o quadro usa ("Inversor Deye", "Bateria Felicity 1..4",
  "AQS Baxi", "Máquina de lavar", "Máquina de secar", "Carregador Tesla", "Painel solar N",
  "Piscina") e coloca-os onde estão na minha casa. Se eu não tiver algum, não o ponhas.
  Se o meu equipamento for de outra marca, mantém o nome do objeto e escreve a marca certa
  só no texto dos cartões.
- Painéis: o número e a orientação reais do meu telhado.

Dados:
- O data.json vem do prompt 1.
- A partir da exportação diária dos painéis, cria dia-AAAA-MM-DD.json com a mesma estrutura
  do exemplo: 96 pontos de 15 minutos com pv, carga, rede (+ a importar), bat (+ a descarregar),
  soc, e os fluxos sol_casa, sol_bat, bat_casa, rede_bat, rede_casa e carro.
  Explica-me como calculaste os fluxos. Cria também dias.json com a lista dos dias.
- Se não houver exportação diária, mostra só os valores do mês.

Privacidade: não incluas alarmes, câmaras, fechaduras, a morada nem coordenadas.

Mostra-me a casa a funcionar e depois diz-me o que ficou por confirmar nas medidas.
```

## Dicas

- **Primeiro a forma, depois os detalhes.** Pede ao Claude para acertar pisos, paredes e telhado antes do mobiliário. Depois vai pedindo: "a cozinha tem uma ilha", "o carro fica na rampa".
- **Endereço com opções:** `?parar` fixa a imagem (bom para gravar), `?hora=13` começa às 13h, `?dia=AAAA-MM-DD` escolhe o dia, `?vista=tour` começa no passeio, `?leve` desliga o estilo de maqueta em TVs mais fracas.
- **Na TV:** o 3D pede alguma placa gráfica. Num Chromecast recente, num Fire TV ou num portátil ligado à TV corre bem.
