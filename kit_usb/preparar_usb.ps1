# ============================================================
# SECRETIUM UNLOCK — Preparador de Kit USB
# Ejecutar como Administrador en PowerShell
# ============================================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SECRETIUM UNLOCK — Kit USB Profesional" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$desktopPath = [Environment]::GetFolderPath("Desktop")
$kitFolder = "$desktopPath\SECRETIUM_KIT_USB"

# Crear estructura
New-Item -ItemType Directory -Force -Path "$kitFolder" | Out-Null
New-Item -ItemType Directory -Force -Path "$kitFolder\herramientas" | Out-Null
New-Item -ItemType Directory -Force -Path "$kitFolder\scripts" | Out-Null

Write-Host "[1/4] Creando scripts de recuperacion..." -ForegroundColor Yellow

# Script batch para resetear password Windows (desde Hiren's PE)
@"
@echo off
echo ============================================
echo   SECRETIUM UNLOCK - Reset Password Windows
echo ============================================
echo.

:: Buscar la particion de Windows
for %%d in (C D E F G H) do (
    if exist "%%d:\Windows\System32\config\SAM" (
        echo [OK] Windows encontrado en %%d:\
        set WINDRIVE=%%d:
        goto :found
    )
)
echo [ERROR] No se encontro Windows en ninguna particion
pause
exit /b

:found
echo.
echo Opciones:
echo   1. Resetear contrasena con NTPWEdit (recomendado)
echo   2. Metodo Utilman (cmd en login)
echo   3. Ver usuarios del sistema
echo.
set /p opcion="Elige opcion (1-3): "

if "%opcion%"=="1" (
    echo.
    echo Abriendo NTPWEdit...
    echo Selecciona el archivo SAM en: %WINDRIVE%\Windows\System32\config\SAM
    echo Selecciona el usuario y pon contrasena en blanco
    echo.
    if exist "%~dp0..\herramientas\NTPWEdit\NTPWEdit.exe" (
        start "" "%~dp0..\herramientas\NTPWEdit\NTPWEdit.exe"
    ) else (
        echo NTPWEdit no encontrado. Abrelo desde el menu de Hiren's Boot PE.
    )
)

if "%opcion%"=="2" (
    echo.
    echo Aplicando metodo Utilman...
    copy "%WINDRIVE%\Windows\System32\utilman.exe" "%WINDRIVE%\Windows\System32\utilman.exe.bak"
    copy "%WINDRIVE%\Windows\System32\cmd.exe" "%WINDRIVE%\Windows\System32\utilman.exe" /Y
    echo.
    echo [OK] Hecho. Reinicia sin USB.
    echo En la pantalla de login, pulsa el icono de Accesibilidad.
    echo Se abre CMD. Escribe: net user USUARIO NuevaPassword
    echo.
    echo IMPORTANTE: Despues restaura utilman:
    echo   copy C:\Windows\System32\utilman.exe.bak C:\Windows\System32\utilman.exe
)

if "%opcion%"=="3" (
    echo.
    echo Usuarios del sistema:
    echo.
    reg load HKLM\OFFLINE %WINDRIVE%\Windows\System32\config\SAM 2>nul
    if errorlevel 1 (
        echo Usa NTPWEdit para ver usuarios (opcion 1)
    ) else (
        reg query "HKLM\OFFLINE\SAM\Domains\Account\Users\Names" 2>nul
        reg unload HKLM\OFFLINE 2>nul
    )
)

echo.
pause
"@ | Out-File -FilePath "$kitFolder\scripts\reset_windows.bat" -Encoding ascii

# Script para restaurar utilman
@"
@echo off
echo Restaurando utilman.exe...
for %%d in (C D E F G H) do (
    if exist "%%d:\Windows\System32\utilman.exe.bak" (
        copy "%%d:\Windows\System32\utilman.exe.bak" "%%d:\Windows\System32\utilman.exe" /Y
        del "%%d:\Windows\System32\utilman.exe.bak"
        echo [OK] utilman.exe restaurado en %%d:\
    )
)
echo Hecho.
pause
"@ | Out-File -FilePath "$kitFolder\scripts\restaurar_utilman.bat" -Encoding ascii

# Script info WiFi Windows
@"
@echo off
echo ============================================
echo   SECRETIUM UNLOCK - Recuperar WiFi
echo ============================================
echo.
echo Redes WiFi guardadas en este PC:
echo.
netsh wlan show profiles
echo.
echo ============================================
echo Para ver la contrasena de una red:
echo   netsh wlan show profile name="NOMBRE_RED" key=clear
echo ============================================
echo.
set /p red="Nombre de la red WiFi: "
echo.
netsh wlan show profile name="%red%" key=clear
echo.
echo Busca "Contenido de la clave" arriba - esa es la contrasena WiFi
echo.
pause
"@ | Out-File -FilePath "$kitFolder\scripts\recuperar_wifi.bat" -Encoding ascii

Write-Host "[2/4] Creando guia rapida del tecnico..." -ForegroundColor Yellow

@"
SECRETIUM UNLOCK — REFERENCIA RAPIDA DEL TECNICO
=================================================

WINDOWS (Cuenta Microsoft) -> 5 min
  1. Desde otro dispositivo: account.live.com/password/reset
  2. Verificar por SMS/email
  3. Cambiar contrasena, conectar PC a internet, listo

WINDOWS (Cuenta local) -> 15 min
  1. Arrancar con Kit USB (F12 al encender)
  2. Abrir NTPWEdit
  3. Seleccionar SAM -> usuario -> borrar contrasena
  4. Reiniciar sin USB -> entra sin contrasena

MAC -> 10 min
  Intel: Reiniciar + Cmd+R -> Terminal -> resetpassword
  M1+: Apagar, mantener Power -> Opciones -> Terminal -> resetpassword

ANDROID -> 5-15 min
  Samsung: findmymobile.samsung.com (desbloqueo remoto)
  Google: google.com/android/find (bloquear con nuevo PIN)
  Reset: Apagar + Vol Up + Power = factory reset (BORRA DATOS)
    Samsung: Vol Up + Power (+ Bixby en modelos viejos)
    Xiaomi: Vol Up + Power -> Wipe Data
    Huawei: Vol Up + Power 10 seg
    Google Pixel: Vol Down + Power -> Recovery -> Wipe

iPHONE -> 10-30 min
  1. Conectar a PC con iTunes/Finder
  2. Poner en modo DFU:
     iPhone 8+: Vol Up, Vol Down, mantener lateral
     iPhone 7: mantener Vol Down + lateral
     iPhone 6s-: mantener Home + lateral
  3. iTunes detecta en modo recuperacion -> Restaurar
  NOTA: Necesita Apple ID despues. Sin Apple ID = paperweight

WIFI/ROUTER -> 1-2 min
  1. Mirar etiqueta debajo del router (tiene clave fabrica)
  2. Si la cambio: Reset 15 seg con clip = vuelve a fabrica
  3. Si tiene PC conectado: netsh wlan show profile key=clear

CAMARA/DVR -> 5-10 min
  Dahua: Boton reset 15-20 seg -> admin/admin
  Hikvision: Usar SADP Tool (gratis) -> reset por email
  General: Boton reset en la camara/DVR
  Herramientas: SADP Tool (Hikvision), ConfigTool (Dahua)

CAJA FUERTE -> 5-60 min
  1. Buscar cerradura emergencia (llave, normalmente tapada)
  2. Probar codigos fabrica:
     Genericos: 0000, 1234, 9999, 1111, 123456
     Master Lock: 0-0-0-0
     Yale: 1-2-3-4-5-6
     Arregui: 1234
  3. Contactar fabricante con numero de serie

CERRADURA DIGITAL -> 5-15 min
  Yale: llave de emergencia (siempre incluida) + reset
  Samsung: llave emergencia + 2x codigo random en pantalla + reset
  Nuki: quitar pilas 30 seg, poner pilas + mantener boton 10 seg
  General: Casi TODAS tienen llave fisica de emergencia

WALLET CRYPTO -> Variable
  1. BUSCAR frase semilla (12-24 palabras) en papeles/fotos/notas
  2. Si la tiene: importar en wallet oficial = resuelto
  3. Revisar contrasenas guardadas en Chrome/Firefox
  4. MetaMask: Settings > Security > Reveal Seed Phrase (si sabe la pass)
"@ | Out-File -FilePath "$kitFolder\REFERENCIA_RAPIDA_TECNICO.txt" -Encoding utf8

Write-Host "[3/4] Creando checklist de verificacion de propiedad..." -ForegroundColor Yellow

@"
SECRETIUM UNLOCK — CHECKLIST DE VERIFICACION
=============================================

ANTES de empezar cualquier desbloqueo, verificar:

[ ] 1. IDENTIFICACION del cliente
    - DNI/NIE/Pasaporte (foto o presencial)
    - Nombre completo

[ ] 2. PROPIEDAD del dispositivo (al menos UNO):
    NIVEL A (Completo):
    [ ] Factura de compra
    [ ] Ticket de caja
    [ ] Pedido online (Amazon, PcComponentes, etc)

    NIVEL B (Estandar):
    [ ] DNI del cliente
    [ ] Cuenta asociada al dispositivo (email, Apple ID, etc)

    NIVEL C (Foto):
    [ ] Foto del cliente CON el dispositivo
    [ ] Al menos 1 dato personal en el dispositivo

    NIVEL D (Declaracion — para mayores/sin papeles):
    [ ] Declaracion jurada firmada
    [ ] Testigo presente (familiar, amigo)
    [ ] Descripcion del contenido del dispositivo

[ ] 3. AUTORIZACION firmada
    - Documento de autorizacion con:
      - Nombre y DNI del cliente
      - Tipo de dispositivo y marca/modelo
      - Servicio solicitado
      - Firma del cliente
      - Fecha

[ ] 4. ANTES de empezar:
    - Explicar al cliente que datos se pueden perder
    - Confirmar que acepta el riesgo
    - Cobrar ANTES o confirmar que paga si funciona

NOTAS:
- Si algo huele raro, NO hacer el servicio
- Personas mayores: ser pacientes, explicar bien
- Menores: necesitan autorizacion de padre/tutor
- Empresas: necesitan autorizacion del responsable
"@ | Out-File -FilePath "$kitFolder\CHECKLIST_VERIFICACION.txt" -Encoding utf8

Write-Host "[4/4] Creando script rapido para defaults de camaras..." -ForegroundColor Yellow

# Script Python para probar defaults rapido (solo los 20-30 defaults por marca, NO brute force)
@"
#!/usr/bin/env python3
"""
SECRETIUM UNLOCK - Test rapido de defaults para camaras/DVR
Solo prueba las 20-30 contrasenas de fabrica conocidas.
NO es brute force. Tarda menos de 1 minuto.
"""
import sys, json, hashlib
from urllib.request import urlopen, Request
from urllib.error import HTTPError
from base64 import b64encode

DEFAULTS = {
    "dahua": [
        ("admin", "admin"), ("admin", ""), ("admin", "admin123"),
        ("admin", "888888"), ("admin", "666666"), ("admin", "123456"),
        ("admin", "12345"), ("admin", "1234"), ("admin", "Admin123"),
        ("admin", "admin888"), ("admin", "admin1"), ("admin", "admin1234"),
        ("888888", "888888"), ("default", "default"),
        ("admin", "7ujMko0admin"), ("admin", "7ujMko0"),
    ],
    "hikvision": [
        ("admin", "12345"), ("admin", "admin"), ("admin", "hiklinux"),
        ("admin", "Hikvision"), ("admin", "abcdef"), ("admin", "admin12345"),
        ("admin", "admin123"), ("admin", "hik12345"), ("admin", "1234"),
        ("admin", "password"), ("admin", "123456"),
    ],
    "reolink": [
        ("admin", ""), ("admin", "123456"), ("admin", "admin"),
        ("admin", "reolink"), ("admin", "Reolink123"),
    ],
    "tplink": [
        ("admin", "admin"), ("admin", "tp-link"), ("admin", "tplink"),
        ("admin", "TP-LINK"), ("admin", "admin123"),
    ],
    "generic": [
        ("admin", "admin"), ("admin", ""), ("admin", "password"),
        ("admin", "1234"), ("admin", "12345"), ("admin", "123456"),
        ("root", "root"), ("root", "admin"), ("root", ""),
        ("user", "user"), ("guest", "guest"),
    ],
}

def try_dahua(ip, port, user, pw):
    try:
        url = f"http://{ip}:{port}/RPC2_Login"
        p1 = json.dumps({"method":"global.login",
              "params":{"userName":user,"password":"","clientType":"Web3.0"},"id":1})
        req1 = Request(url, data=p1.encode(), headers={"Content-Type":"application/json"})
        r1 = json.loads(urlopen(req1, timeout=5).read())
        params = r1.get("params", {})
        realm, rand = params.get("realm",""), params.get("random","")
        session = r1.get("session","")
        if not realm or not rand: return False
        ha1 = hashlib.md5(f"{user}:{realm}:{pw}".encode()).hexdigest().upper()
        final = hashlib.md5(f"{user}:{rand}:{ha1}".encode()).hexdigest().upper()
        p2 = json.dumps({"method":"global.login",
              "params":{"userName":user,"password":final,
                        "clientType":"Web3.0","authorityType":"Default"},
              "id":2,"session":session})
        req2 = Request(url, data=p2.encode(), headers={"Content-Type":"application/json"})
        r2 = json.loads(urlopen(req2, timeout=5).read())
        return r2.get("result", False)
    except:
        return False

def try_hikvision(ip, port, user, pw):
    try:
        creds = b64encode(f"{user}:{pw}".encode()).decode()
        req = Request(f"http://{ip}:{port}/ISAPI/System/deviceInfo",
                     headers={"Authorization": f"Basic {creds}"})
        return urlopen(req, timeout=5).getcode() == 200
    except HTTPError as e:
        return e.code not in [401, 403]
    except:
        return False

def try_http(ip, port, user, pw):
    try:
        creds = b64encode(f"{user}:{pw}".encode()).decode()
        req = Request(f"http://{ip}:{port}/",
                     headers={"Authorization": f"Basic {creds}"})
        return urlopen(req, timeout=5).getcode() in [200, 301, 302]
    except HTTPError as e:
        return e.code not in [401, 403]
    except:
        return False

def main():
    if len(sys.argv) < 3:
        print("Uso: python test_defaults_camara.py IP MARCA")
        print("Marcas: dahua, hikvision, reolink, tplink, generic")
        sys.exit(1)

    ip = sys.argv[1]
    brand = sys.argv[2].lower()
    port = int(sys.argv[3]) if len(sys.argv) > 3 else 80

    pairs = DEFAULTS.get(brand, DEFAULTS["generic"])
    fn = try_dahua if brand == "dahua" else try_hikvision if brand == "hikvision" else try_http

    print(f"Probando {len(pairs)} defaults de {brand} en {ip}:{port}...")
    for i, (user, pw) in enumerate(pairs, 1):
        display_pw = pw if pw else "(vacia)"
        print(f"  [{i}/{len(pairs)}] {user} / {display_pw}", end="")
        if fn(ip, port, user, pw):
            print(" -> ENCONTRADA!")
            print(f"\n  Usuario:  {user}")
            print(f"  Password: {display_pw}")
            print(f"  Accede a: http://{ip}:{port}")
            return
        print(" -> No")

    print(f"\nNinguna default funciono. Opciones:")
    print(f"  1. Boton RESET fisico en el dispositivo (15-20 seg)")
    print(f"  2. Usar herramienta del fabricante:")
    if brand == "dahua":
        print(f"     -> Dahua ConfigTool: https://dahuawiki.com/ConfigTool")
    elif brand == "hikvision":
        print(f"     -> Hikvision SADP Tool: https://www.hikvision.com/en/support/tools/")

if __name__ == "__main__":
    main()
"@ | Out-File -FilePath "$kitFolder\scripts\test_defaults_camara.py" -Encoding utf8

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  KIT USB PREPARADO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Carpeta: $kitFolder" -ForegroundColor White
Write-Host ""
Write-Host "Contenido:" -ForegroundColor Yellow
Write-Host "  REFERENCIA_RAPIDA_TECNICO.txt  — Guia rapida para el tecnico"
Write-Host "  CHECKLIST_VERIFICACION.txt     — Verificar propiedad ANTES"
Write-Host "  scripts/reset_windows.bat      — Reset password Windows"
Write-Host "  scripts/restaurar_utilman.bat   — Restaurar utilman despues"
Write-Host "  scripts/recuperar_wifi.bat      — Ver contrasenas WiFi guardadas"
Write-Host "  scripts/test_defaults_camara.py — Test defaults camaras (1 min)"
Write-Host ""
Write-Host "SIGUIENTE PASO:" -ForegroundColor Cyan
Write-Host "  1. Descarga Hiren's Boot PE: https://www.hirensbootcd.org/download/"
Write-Host "  2. Graba en USB con Rufus: https://rufus.ie/"
Write-Host "  3. Copia la carpeta SECRETIUM_KIT_USB al USB"
Write-Host "  4. Ya tienes tu kit profesional!"
Write-Host ""
