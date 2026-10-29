"""Encontra o IP atual do logger Solarman pelo endereço físico (MAC), porque o router muda-lhe o IP.
Ordem: último IP conhecido -> tabela ARP -> varrimento da rede 192.168.1.0/24. Devolve None fora de casa."""
import socket, subprocess, re, pathlib, concurrent.futures

import os
MAC = os.environ["SOLARMAN_MAC"].lower()   # endereço MAC do logger, com dois pontos (aa:bb:cc:dd:ee:ff)
PORTA = 8899
CACHE = pathlib.Path(__file__).resolve().parent.parent / "dados" / "deye" / "logger_ip.txt"

def _abre(ip):
    try:
        socket.create_connection((ip, PORTA), timeout=2).close(); return True
    except OSError:
        return False

def _arp():
    out = subprocess.run(["/usr/sbin/arp", "-a"], capture_output=True, text=True).stdout
    for linha in out.splitlines():
        if MAC in linha.lower():
            m = re.search(r"\((\d+\.\d+\.\d+\.\d+)\)", linha)
            if m: return m.group(1)
    return None

def _varre(rede=os.environ.get("REDE_LOCAL", "192.168.1")):
    ping = lambda i: subprocess.run(["/sbin/ping", "-c1", "-W", "300", f"{rede}.{i}"], capture_output=True)
    with concurrent.futures.ThreadPoolExecutor(64) as ex: list(ex.map(ping, range(1, 255)))

def encontrar():
    if CACHE.exists():
        ip = CACHE.read_text().strip()
        if ip and _abre(ip): return ip
    ip = _arp()
    if not ip:
        _varre(); ip = _arp()
    if ip and _abre(ip):
        CACHE.write_text(ip); return ip
    return None

if __name__ == "__main__":
    print(encontrar())
