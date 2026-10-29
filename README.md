# Quadro da Energia

Um quadro para a TV com a energia lá de casa: quanto pagas, quanto o sol poupa, quanto custa o carro elétrico por 100 km, quem gasta mais, e se há um tarifário mais barato para o teu consumo real. Com a casa em 3D e a energia a correr lá dentro.

Tudo feito com o Claude, a partir da tua fatura de eletricidade. Não precisas de saber programar.

**Ver ao vivo (casa de exemplo, dados reais):**
- Casa em 3D: https://quadro-energia.vercel.app/casa/
- Quadro 2D: https://quadro-energia.vercel.app/demo/

## O que consegues fazer

| Nível | Precisas de | Ficas com |
|---|---|---|
| 1. Quadro | a fatura em PDF; capturas da app dos painéis e do carro, se tiveres | o quadro 2D para a TV, com 6 ecrãs que rodam sozinhos |
| 2. Casa em 3D | a planta da casa; a exportação de um dia da app dos painéis | a tua casa em maqueta, com um dia de energia em 48 segundos |
| 3. Tarifários todos os meses | a app Claude no computador | uma tarefa que compara a tua fatura com todos os tarifários do mercado, sozinha, uma vez por mês |
| 4. Recolha automática | tomadas com medição (ex.: Shelly), inversor com acesso local | o consumo de cada aparelho, hora a hora, sem capturas de ecrã |

Começa pelo [TUTORIAL.md](TUTORIAL.md).

## O que está neste repositório

```text
prompts/
  01-quadro-da-energia.md               o prompt principal: fatura → números → quadro
  02-casa-em-3d.md                      a tua casa em 3D a partir da planta
  03-comparar-tarifarios-todos-os-meses.md   a automação mensal com o simulador de tiagofelicia.pt
  04-recolha-automatica.md              Shelly, inversor Deye/Solarman, SmartThings
quadro/       o quadro 2D (index.html + data.json de exemplo)
casa/         a versão 3D (index.html, modelo da casa, estilo, carro, dados de exemplo)
automacoes/
  tarifarios/ script do simulador de tarifários
  recolha/    scripts de recolha e exemplos para correr sozinhos no Mac
publicar/     vercel.json e script para pôr o quadro online
```

## Ver no teu computador

```bash
cd casa
python3 -m http.server 8000
```

Depois abre http://localhost:8000. O quadro 2D funciona da mesma forma a partir da pasta `quadro`.

Atalhos no endereço: `?parar` fixa a imagem (para gravar), `?cena=3` começa no 3.º ecrã do quadro 2D, `?hora=13` e `?dia=AAAA-MM-DD` na casa 3D, `?vista=tour` começa o passeio, `?leve` para TVs mais fracas.

## Privacidade

O quadro foi pensado para não mostrar dados que identifiquem a casa: sem morada, NIF, código do ponto de entrega, números de fatura, nem alarmes e câmaras. Os prompts pedem isso ao Claude. Mesmo assim, revê o que publicas: na Vercel, usa um endereço secreto para a versão com os teus dados reais.

## Créditos

- Simulador de tarifários: [Tiago Felícia](https://www.tiagofelicia.pt/eletricidade-tiagofelicia.html). Este projeto não tem ligação ao simulador; usa-o com moderação e apoia-o se te for útil.
- 3D: [three.js](https://threejs.org) (MIT), carregado a partir de CDN.
- Feito com o [Claude](https://claude.ai), da Anthropic.

Licença MIT. Usa, adapta e partilha.
