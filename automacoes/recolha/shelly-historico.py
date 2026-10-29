#!/usr/bin/env python3
"""Fecho mensal dos Shelly pela cloud (histórico guardado pela Shelly, não depende do Mac).
  shelly-historico.py 2026-09            totais do mês por circuito; hora a hora (vazio/fora de vazio) para os >= 3 kWh
  shelly-historico.py 2026-09 --tudo     hora a hora para todos (lento: ~1 pedido/s)
Credenciais em ~/.config/shelly/.env (SHELLY_SERVER, SHELLY_AUTH_KEY). Saída: dados/shelly/<mês>.csv
Vazio = 22h-08h (bi-horário diário)."""
import sys, json, time, csv, calendar, datetime, pathlib, urllib.request, urllib.parse

BASE = pathlib.Path(__file__).resolve().parent.parent
ENV = dict(l.strip().split("=", 1) for l in (pathlib.Path.home()/".config/shelly/.env").read_text().splitlines() if "=" in l)
SRV, KEY = ENV["SHELLY_SERVER"], ENV["SHELLY_AUTH_KEY"]
LIMIAR_HORARIO_KWH = 3.0
_ultimo = [0.0]

def api(caminho, post=False, **params):
    espera = 1.15 - (time.time() - _ultimo[0])          # limite da cloud: 1 pedido por segundo
    if espera > 0: time.sleep(espera)
    params["auth_key"] = KEY
    dados = urllib.parse.urlencode(params)
    url = f"{SRV}/{caminho}" if post else f"{SRV}/{caminho}?{dados}"
    for tentativa in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, data=dados.encode() if post else None), timeout=30) as r:
                _ultimo[0] = time.time(); return json.loads(r.read())
        except Exception as e:
            _ultimo[0] = time.time(); time.sleep(2 + 2*tentativa); erro = e
    raise RuntimeError(f"{caminho}: {erro}")

def circuitos():
    """Lista (id, canal, nome, modelo) de todos os canais com medição de energia."""
    nomes = api("interface/device/list", post=True)["data"]["devices"]
    estado = api("device/all_status", post=True, show_info="true", no_shared="true")["data"]["devices_status"]
    out = []
    for did, st in estado.items():
        for k, v in st.items():
            if isinstance(v, dict) and "aenergy" in v and ":" in k:
                canal = int(k.split(":")[1])
                chave = did if canal == 0 else f"{did}_{canal}"
                n = nomes.get(chave) or nomes.get(did) or {}
                out.append((did, canal, n.get("name", chave), n.get("type", "")))
    return sorted(out, key=lambda x: x[2])

def historico(did, canal, **kw):
    return api("v2/statistics/power-consumption", id=did, channel=canal, **kw).get("history", [])

def main():
    mes = sys.argv[1]; tudo = "--tudo" in sys.argv
    ano, m = map(int, mes.split("-")); ndias = calendar.monthrange(ano, m)[1]
    hoje = datetime.date.today()
    linhas = []
    for did, canal, nome, modelo in circuitos():
        h = historico(did, canal, date_range="custom", date_from=f"{mes}-01 00:00:00", date_to=f"{mes}-{ndias:02d} 23:59:59")
        total = sum(x.get("consumption", 0) for x in h) / 1000
        vazio = fora = None
        if tudo or total >= LIMIAR_HORARIO_KWH:
            vazio = fora = 0.0
            for d in range(1, ndias + 1):
                if datetime.date(ano, m, d) > hoje: break
                for x in historico(did, canal, date_range="day", date_from=f"{mes}-{d:02d} 00:00:00"):
                    hora = int(x["datetime"][11:13]); kwh = x.get("consumption", 0) / 1000
                    if hora >= 22 or hora < 8: vazio += kwh
                    else: fora += kwh
        linhas.append([nome, modelo, did, canal, round(total, 3), None if vazio is None else round(vazio, 3), None if fora is None else round(fora, 3)])
        print(f"{nome:34s} {total:8.2f} kWh" + (f"   vazio {vazio:.2f} / fora {fora:.2f}" if vazio is not None else ""), flush=True)
    saida = BASE / "dados" / "shelly" / f"{mes}.csv"
    with saida.open("w", newline="") as f:
        w = csv.writer(f); w.writerow(["nome", "modelo", "id", "canal", "kWh_mes", "kWh_vazio", "kWh_fora_vazio"]); w.writerows(linhas)
    print(f"\nTOTAL {sum(l[4] for l in linhas):.2f} kWh em {len(linhas)} circuitos -> {saida}")

if __name__ == "__main__": main()
