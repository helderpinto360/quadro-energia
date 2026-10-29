# 4. Recolha automática de dados (nível avançado)

Os prompts 1 a 3 funcionam só com a fatura e capturas de ecrã. Este passo é para quem quer que os números se recolham sozinhos: o consumo de cada aparelho, o inversor de 5 em 5 minutos e o ar condicionado.

Os scripts estão em [`automacoes/recolha/`](../automacoes/recolha). São um ponto de partida: a casa de exemplo tem tomadas Shelly, inversor Deye com logger Solarman e ar condicionado Samsung. Se o teu equipamento for outro, pede ao Claude para adaptar o script à tua marca.

## Tomadas Shelly (o mais útil e o mais simples)

Uma tomada com medição em cada grande consumidor: máquina de lavar, de secar, frigorífico, bomba de calor das águas quentes. A Shelly guarda o histórico hora a hora na cloud, por isso não depende do computador estar ligado.

1. Na app Shelly: Definições → Definições do utilizador → **Chave de autorização cloud**. Copia a chave e o endereço do servidor.
2. Cria o ficheiro `~/.config/shelly/.env` (só tu o deves conseguir ler) com:
   ```text
   SHELLY_SERVER=https://shelly-XX-eu.shelly.cloud
   SHELLY_AUTH_KEY=a-tua-chave
   ```
3. No fim de cada mês: `python3 shelly-historico.py AAAA-MM`. Sai um CSV com os kWh do mês de cada aparelho e, para os que gastam mais, a divisão entre vazio e fora de vazio.

Nunca coles a chave num chat nem num ficheiro público. Se isso acontecer, muda a palavra-passe da conta Shelly e gera uma chave nova.

**Que tomada usar:** para aparelhos até 13 A (máquinas, frigorífico) a Shelly Plug M Gen3 ou a Plug PM Gen3 servem. Confirma sempre a potência máxima na etiqueta do aparelho.

## Inversor Deye com logger Solarman (leitura local)

O logger WiFi da Solarman deixa ler o inversor diretamente na rede de casa, sem cloud, com a biblioteca aberta `pysolarmanv5`.

1. `python3 -m pip install --user pysolarmanv5`
2. Precisas do número de série do logger (na app Solarman, no dispositivo "Logger") e do endereço MAC dele (no mesmo ecrã).
3. Define as variáveis `SOLARMAN_SN`, `SOLARMAN_MAC` e, se a tua rede não for 192.168.1.x, `REDE_LOCAL`.
4. `python3 deye-leitura.py` grava uma linha com produção, consumo, rede e bateria. O script encontra o logger pelo MAC, porque o router muda-lhe o IP.

Os registos usados são os do Deye SUN-5K-SG03LP1 (monofásico, baixa tensão). Noutros modelos Deye podem mudar: confirma os valores com a app antes de confiar neles.

**Não alteres os horários da bateria por script sem perceber a potência contratada.** Na casa de exemplo, carregar a bateria da rede à noite ao mesmo tempo que o carro fez ultrapassar a potência e a E-Redes enviou um aviso. Se mexeres nisso, ativa primeiro o "Grid peak shaving" do inversor, abaixo da tua potência contratada.

## Ar condicionado Samsung (SmartThings)

1. Instala a CLI oficial: `brew install smartthingscommunity/smartthings/smartthings` (Mac).
2. Corre `smartthings devices` uma vez: abre o browser para autorizares. As credenciais renovam-se sozinhas.
3. `python3 smartthings-leitura.py` grava o contador de energia de cada aparelho que o reporte. Nem todos reportam: na casa de exemplo, só 1 de 5 ares condicionados o fazia.

## Correr sozinho no Mac (launchd)

Os ficheiros em `launchd/` são exemplos para correr os scripts a horas certas. Duas lições aprendidas:

- **O macOS não deixa tarefas agendadas lerem a pasta Documentos.** Põe os scripts e os dados numa pasta fora dela, por exemplo `~/energia-casa`.
- **Testa sempre pelo próprio agendador** (`launchctl kickstart gui/$(id -u)/nome.da.tarefa`) e confirma que o ficheiro de dados cresceu. Na casa de exemplo, um script testado só à mão falhou em silêncio durante três semanas.
