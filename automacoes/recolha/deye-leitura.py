#!/usr/bin/env python3
"""Lê o inversor Deye SUN-5K-SG03LP1-EU pelo logger Solarman (LSW-3) na rede local
e acrescenta uma linha a dados/deye/leituras.csv.
Contadores diários e totais em kWh; potências instantâneas em W.
Convenções Deye: bateria_W > 0 a descarregar, < 0 a carregar; rede_W > 0 a importar, < 0 a exportar."""
import csv, datetime, pathlib, sys
from pysolarmanv5 import PySolarmanV5
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from logger_ip import encontrar

import os
LOGGER_SN = int(os.environ["SOLARMAN_SN"])   # número de série do logger Solarman (na etiqueta do stick WiFi ou na app)
BASE = pathlib.Path(__file__).resolve().parent.parent
CSV = BASE / "dados" / "deye" / "leituras.csv"

COLS = ["timestamp","pv_dia_kWh","carga_dia_kWh","rede_compra_dia_kWh","rede_venda_dia_kWh","bat_carga_dia_kWh","bat_descarga_dia_kWh",
        "pv_total_kWh","carga_total_kWh","rede_compra_total_kWh","rede_venda_total_kWh","bat_carga_total_kWh","bat_descarga_total_kWh",
        "pv_W","carga_W","rede_W","bateria_W","bateria_SOC","bateria_V","rede_V","temp_C"]

def s16(v): return v - 65536 if v > 32767 else v


def main():
    agora = datetime.datetime.now().astimezone().replace(microsecond=0)
    ip = encontrar()          # None fora da rede da casa: sair sem ruído
    if not ip:
        return
    m = PySolarmanV5(ip, LOGGER_SN, port=8899, mb_slave_id=1, socket_timeout=20)
    r = {}
    for start, n in [(70, 40), (150, 45)]:
        for i, v in enumerate(m.read_holding_registers(register_addr=start, quantity=n)):
            r[start + i] = v
    m.disconnect()
    u32 = lambda lo, hi: (r[lo] + (r[hi] << 16)) / 10
    linha = [agora.isoformat(),
        r[108]/10, r[84]/10, r[76]/10, r[77]/10, r[70]/10, r[71]/10,
        u32(96,97), u32(85,86), u32(78,80), u32(81,82), u32(72,73), u32(74,75),
        r[186] + r[187], s16(r[178]), s16(r[169]), s16(r[190]), r[184], r[183]/100, r[150]/10, (r[90]-1000)/10]
    novo = not CSV.exists()
    with CSV.open("a", newline="") as f:
        w = csv.writer(f)
        if novo: w.writerow(COLS)
        w.writerow(linha)
    print(f"{agora:%Y-%m-%d %H:%M}  PV {linha[13]} W  carga {linha[14]} W  rede {linha[15]} W  bat {linha[16]} W ({linha[17]}%)  | dia: PV {linha[1]}  carga {linha[2]}  rede {linha[3]} kWh")

if __name__ == "__main__":
    try: main()
    except Exception as e:
        print(f"{datetime.datetime.now():%Y-%m-%d %H:%M} erro: {e}", file=sys.stderr); sys.exit(1)
