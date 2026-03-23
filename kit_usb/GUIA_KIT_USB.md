# KIT USB SECRETIUM UNLOCK — Guia Tecnico

## QUE ES
Un pendrive USB bootable con todas las herramientas para desbloquear
cualquier ordenador Windows/Mac/Linux en menos de 15 minutos.
Esto es lo que usan los tecnicos profesionales en todo el mundo.

## QUE NECESITAS
- 1x Pendrive USB de 16GB o mas (recomendado 32GB)
- 1x PC con Windows para prepararlo
- 30 minutos para montarlo

## PASO 1: Descargar Hiren's Boot PE (GRATIS, LEGAL)
1. Ve a: https://www.hirensbootcd.org/download/
2. Descarga "Hiren's Boot CD PE" (ISO, ~2GB)
3. Esto incluye TODAS las herramientas que necesitas:
   - NTPWEdit (resetear contrasenas Windows)
   - Registry Editor offline
   - Herramientas de disco
   - Navegador web
   - Antivirus
   - Recuperacion de archivos

## PASO 2: Grabar en USB
1. Descarga Rufus: https://rufus.ie/
2. Abre Rufus
3. Selecciona tu USB en "Dispositivo"
4. En "Seleccionar" elige la ISO de Hiren's que descargaste
5. Deja todo por defecto y pulsa "Empezar"
6. Espera 5-10 minutos

## PASO 3: Anadir herramientas extra al USB
Despues de grabar Hiren's, copia estas carpetas al USB:
- /SECRETIUM/ (scripts automaticos, ver abajo)
- /DICCIONARIOS/ (opcional, para WiFi)

---

# PROCEDIMIENTOS POR DISPOSITIVO

## WINDOWS 10/11 — Metodo 1: Microsoft (5 min, MANTIENE DATOS)
Si el PC usa cuenta Microsoft (lo mas comun hoy dia):
1. Desde CUALQUIER otro dispositivo (movil, otro PC)
2. Ve a: https://account.live.com/password/reset
3. Introduce el email de la cuenta
4. Verifica por SMS, email alternativo o app
5. Cambia la contrasena
6. En el PC, conecta a internet y usa la nueva contrasena
**Resultado**: Todo intacto, 0 riesgo

## WINDOWS 10/11 — Metodo 2: Hiren's Boot (15 min, MANTIENE DATOS)
1. Conecta el USB al PC bloqueado
2. Enciende y pulsa F12 / F2 / DEL (segun marca) para boot menu
   - HP: F9 | Dell: F12 | Lenovo: F12 | Acer: F12 | Asus: F8/F2
   - Si no funciona: entra en BIOS (DEL o F2) y pon USB primero
3. Arranca desde el USB — sale el escritorio de Hiren's
4. Abre "NTPWEdit" (esta en el escritorio o menu inicio)
5. Se abre automaticamente el archivo SAM de Windows
6. Selecciona el usuario bloqueado
7. Click "Change password" → dejar en blanco → "Save changes"
8. Reinicia SIN el USB
9. Windows arranca y entra sin contrasena
10. El cliente pone una nueva contrasena
**Resultado**: Todo intacto, contrasena borrada

## WINDOWS 7/8 — Metodo: Utilman (10 min, MANTIENE DATOS)
1. Arranca desde USB de instalacion Windows
2. En pantalla de instalacion: Shift + F10 (abre CMD)
3. Encuentra la letra del disco Windows:
   - Escribe: dir C:\Windows (o D:\Windows, E:\Windows...)
4. Ejecuta:
   ```
   move C:\Windows\System32\utilman.exe C:\Windows\System32\utilman.bak
   copy C:\Windows\System32\cmd.exe C:\Windows\System32\utilman.exe
   ```
5. Reinicia sin USB
6. En pantalla de login, click icono "Accesibilidad" (abajo derecha)
7. Se abre CMD. Escribe: net user NOMBRE_USUARIO NuevaContrasena123
8. Entra con la nueva contrasena
9. IMPORTANTE: Restaurar utilman despues:
   ```
   move C:\Windows\System32\utilman.bak C:\Windows\System32\utilman.exe
   ```
**Resultado**: Todo intacto

## MAC — Metodo 1: Apple ID (5 min)
1. En pantalla login, intenta 3 veces contrasena incorrecta
2. Aparece: "Resetear con Apple ID"
3. Introduce Apple ID y contrasena
4. Crea nueva contrasena de usuario
**Resultado**: Todo intacto (Keychain se resetea)

## MAC — Metodo 2: Recovery Mode (10 min)
1. Mac Intel: Reinicia + Command + R
   Mac M1/M2/M3/M4: Apaga, manten boton encendido hasta "Opciones"
2. Ve a Utilidades > Terminal
3. Escribe: resetpassword
4. Selecciona el disco y usuario
5. Pon nueva contrasena
6. Reinicia
**Resultado**: Todo intacto (Keychain se resetea)

---

## TECLAS BOOT MENU POR MARCA
| Marca    | Boot Menu | BIOS    |
|----------|-----------|---------|
| HP       | F9        | F10     |
| Dell     | F12       | F2      |
| Lenovo   | F12       | F2/Fn+F2|
| Acer     | F12       | F2/DEL  |
| Asus     | F8/ESC    | F2/DEL  |
| Toshiba  | F12       | F2      |
| Samsung  | F2        | F2      |
| MSI      | F11       | DEL     |
| Gigabyte | F12       | DEL     |
| Apple    | Option    | -       |

---

## TIEMPO ESTIMADO POR CASO
| Caso                        | Tiempo  | Dificultad |
|-----------------------------|---------|------------|
| Windows + cuenta Microsoft  | 5 min   | Facil      |
| Windows + cuenta local      | 15 min  | Facil      |
| Windows 7/8                 | 10 min  | Facil      |
| Mac con Apple ID            | 5 min   | Facil      |
| Mac sin Apple ID            | 10 min  | Facil      |
| Mac con FileVault           | 30+ min | Medio      |
| Linux                       | 5 min   | Facil      |

## LINUX — Recovery (5 min)
1. Reinicia, en GRUB pulsa 'e' para editar
2. Busca la linea que dice "linux" y anade al final: init=/bin/bash
3. Pulsa Ctrl+X para arrancar
4. Escribe: mount -o remount,rw /
5. Escribe: passwd NOMBRE_USUARIO
6. Pon nueva contrasena
7. Reinicia: exec /sbin/init
