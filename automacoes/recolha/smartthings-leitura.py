#!/usr/bin/env python3
"""Lê o contador de energia de cada dispositivo SmartThings com powerConsumptionReport
e acrescenta uma linha por dispositivo a dados/smartthings/leituras.csv.
Correr às 08:00 e às 22:00: a diferença entre leituras dá os kWh de vazio (22h–08h)
e de fora de vazio (08h–22h) de cada aparelho."""
import json, subprocess, csv, datetime, pathlib, sys

BASE = pathlib.Path(__file__).resolve().parent.parent
DADOS = BASE / "dados" / "smartthings"
CSV = DADOS / "leituras.csv"
CLI = "/opt/homebrew/bin/smartthings"

def cli(*args):
    r = subprocess.run([CLI, *args, "--json"], capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip()[:300])
    return json.loads(r.stdout)

def main():
    agora = datetime.datetime.now().astimezone().replace(microsecond=0)
    devs = cli("devices")
    (DADOS / "dispositivos.json").write_text(json.dumps(devs, ensure_ascii=False, indent=1))
    novo = not CSV.exists()
    with CSV.open("a", newline="") as f:
        w = csv.writer(f)
        if novo:
            w.writerow(["timestamp", "deviceId", "label", "switch", "modo", "temp_C", "setpoint_C", "energia_Wh", "potencia_W", "energia_ts"])
        for d in devs:
            caps = {c["id"] for comp in d.get("components", []) for c in comp.get("capabilities", [])}
            if "powerConsumptionReport" not in caps:
                continue
            try:
                st = cli("devices:status", d["deviceId"])["components"]["main"]
            except Exception as e:
                print(f"{d['label']}: erro {e}", file=sys.stderr); continue
            pc = (st.get("powerConsumptionReport", {}).get("powerConsumption", {}) or {})
            v = pc.get("value") or {}
            g = lambda cap, attr: (st.get(cap, {}).get(attr, {}) or {}).get("value")
            w.writerow([agora.isoformat(), d["deviceId"], d["label"], g("switch", "switch"),
                        g("airConditionerMode", "airConditionerMode"), g("temperatureMeasurement", "temperature"),
                        g("thermostatCoolingSetpoint", "coolingSetpoint"), v.get("energy"), v.get("power"), pc.get("timestamp")])
            print(f"{agora:%Y-%m-%d %H:%M}  {d['label']:32s} {v.get('energy')} Wh  {v.get('power')} W")

if __name__ == "__main__":
    main()
