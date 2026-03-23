import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_TOKEN = "8451701836:AAHnoYbzI14jnyCVtfx05iuA_CfkYKwPtX8";
const TELEGRAM_CHAT = "1802913178";
const VPS_API = "http://62.171.128.42:5571";
const API_KEY = "_key=JC2026%21grupo";

const SERVICE_NAMES: Record<string, string> = {
  wifi: "WiFi / Router",
  phone: "Movil / Tablet",
  computer: "Ordenador",
  camera: "Camara / DVR",
  wallet: "Wallet Crypto",
  email: "Email / Cuentas",
  card: "Tarjeta / PIN",
  safe: "Caja Fuerte",
  lock: "Cerradura Digital",
};

// ============================================================
// INSTRUCCIONES COMPLETAS POR DISPOSITIVO (NO depende del VPS)
// ============================================================

function getComputerInstructions(device: string) {
  const isMac = device?.toLowerCase().includes("mac") || device?.toLowerCase().includes("apple") || device?.toLowerCase().includes("imac") || device?.toLowerCase().includes("macbook");

  if (isMac) {
    return {
      type: "computer_mac",
      estimated_time: "5-10 minutos",
      data_safe: true,
      methods: [
        {
          name: "Apple ID (Recomendado)",
          time: "5 min",
          difficulty: "Facil",
          data_loss: false,
          steps: [
            "En la pantalla de inicio de sesion, escribe una contrasena incorrecta 3 veces",
            "Aparece la opcion 'Restablecer con Apple ID' — haz click",
            "Introduce tu Apple ID y contrasena",
            "Crea una nueva contrasena para el Mac",
            "Listo — todo tus datos siguen intactos",
          ],
        },
        {
          name: "Recovery Mode (Terminal)",
          time: "10 min",
          difficulty: "Medio",
          data_loss: false,
          steps: [
            "Mac Intel: Reinicia y manten Command + R al encender",
            "Mac M1/M2/M3/M4: Apaga completamente, manten el boton de encendido hasta que salga 'Opciones de arranque'",
            "Selecciona 'Opciones' y pulsa Continuar",
            "Arriba en el menu, ve a Utilidades > Terminal",
            "Escribe: resetpassword (una sola palabra, enter)",
            "Se abre la herramienta — selecciona tu disco y tu usuario",
            "Pon una nueva contrasena y reinicia",
            "NOTA: El Llavero (Keychain) se resetea, pero todos tus archivos estan bien",
          ],
        },
      ],
      important: "Si tiene FileVault activado, necesitas el Apple ID o la clave de recuperacion. Sin eso, Apple tampoco puede acceder.",
    };
  }

  return {
    type: "computer_windows",
    estimated_time: "5-15 minutos",
    data_safe: true,
    methods: [
      {
        name: "Cuenta Microsoft (Lo mas rapido)",
        time: "5 min",
        difficulty: "Facil",
        data_loss: false,
        steps: [
          "Desde CUALQUIER dispositivo (movil, otro PC), abre el navegador",
          "Ve a: account.live.com/password/reset",
          "Introduce el email de la cuenta Microsoft del PC",
          "Verifica tu identidad por SMS, email alternativo o app Authenticator",
          "Crea una nueva contrasena",
          "En el PC bloqueado, conecta a internet (WiFi o cable)",
          "Introduce la nueva contrasena — listo, todo intacto",
        ],
      },
      {
        name: "Kit USB Secretium (Cuenta local)",
        time: "15 min",
        difficulty: "Facil con el kit",
        data_loss: false,
        steps: [
          "Conecta el USB Kit Secretium al PC bloqueado",
          "Enciende y pulsa la tecla de Boot Menu:",
          "  HP: F9 | Dell: F12 | Lenovo: F12 | Acer: F12 | Asus: F8",
          "Selecciona arrancar desde USB",
          "Se carga Hiren's Boot PE (un mini Windows)",
          "Abre NTPWEdit (en el escritorio)",
          "Automaticamente encuentra el archivo SAM de Windows",
          "Selecciona el usuario bloqueado",
          "Click 'Change password' > deja en blanco > 'Save changes'",
          "Quita el USB y reinicia",
          "Windows arranca y entra sin contrasena",
          "El cliente pone una nueva contrasena en Configuracion",
        ],
        tools_needed: ["USB Kit Secretium (Hiren's Boot PE)"],
      },
      {
        name: "Metodo Utilman (Sin herramientas extra)",
        time: "10 min",
        difficulty: "Medio",
        data_loss: false,
        steps: [
          "Necesitas un USB de instalacion de Windows (descargable gratis de microsoft.com)",
          "Conecta el USB, arranca desde el (F12 al encender)",
          "En la pantalla de instalacion, pulsa Shift + F10",
          "Se abre el Simbolo del sistema (CMD)",
          "Escribe: dir D:\\Windows (prueba C:, D:, E: hasta encontrar Windows)",
          "Cuando lo encuentres, escribe estos comandos:",
          "  move D:\\Windows\\System32\\utilman.exe D:\\Windows\\System32\\utilman.bak",
          "  copy D:\\Windows\\System32\\cmd.exe D:\\Windows\\System32\\utilman.exe",
          "Cierra todo y reinicia SIN el USB",
          "En la pantalla de login, click el icono de Accesibilidad (abajo derecha)",
          "Se abre CMD — escribe: net user NOMBRE NuevaContrasena123",
          "Entra con la nueva contrasena",
          "IMPORTANTE: Despues restaura utilman ejecutando como admin:",
          "  move C:\\Windows\\System32\\utilman.bak C:\\Windows\\System32\\utilman.exe",
        ],
      },
    ],
    boot_keys: {
      HP: "F9", Dell: "F12", Lenovo: "F12", Acer: "F12",
      Asus: "F8/ESC", Toshiba: "F12", Samsung: "F2", MSI: "F11",
    },
  };
}

function getPhoneInstructions(device: string) {
  const isIphone = device?.toLowerCase().includes("iphone") || device?.toLowerCase().includes("apple") || device?.toLowerCase().includes("ipad");
  const isSamsung = device?.toLowerCase().includes("samsung") || device?.toLowerCase().includes("galaxy");
  const isXiaomi = device?.toLowerCase().includes("xiaomi") || device?.toLowerCase().includes("redmi") || device?.toLowerCase().includes("poco");
  const isHuawei = device?.toLowerCase().includes("huawei") || device?.toLowerCase().includes("honor");

  if (isIphone) {
    return {
      type: "iphone",
      estimated_time: "10-30 minutos",
      data_safe: false,
      warning: "iPhone SIEMPRE borra datos al desbloquear. Apple lo diseno asi. Necesitaras el Apple ID despues.",
      methods: [
        {
          name: "iCloud (Si tiene cuenta)",
          time: "10 min",
          difficulty: "Facil",
          steps: [
            "Desde otro dispositivo, ve a: icloud.com/find",
            "Inicia sesion con el Apple ID del dueno",
            "Selecciona el iPhone bloqueado",
            "Click 'Borrar iPhone'",
            "El iPhone se reinicia como nuevo",
            "Configura de nuevo con el Apple ID — los datos se restauran de iCloud",
          ],
        },
        {
          name: "iTunes/Finder + Modo DFU",
          time: "20 min",
          difficulty: "Medio",
          steps: [
            "Conecta el iPhone al PC/Mac con cable USB",
            "Abre iTunes (Windows) o Finder (Mac)",
            "Pon el iPhone en modo DFU:",
            "  iPhone 8 y superior: Pulsa Vol+, suelta. Pulsa Vol-, suelta. Manten boton lateral hasta pantalla negra",
            "  iPhone 7: Manten Vol- y boton lateral juntos 10 seg, suelta lateral",
            "  iPhone 6s y anterior: Manten Home y boton lateral juntos 10 seg, suelta lateral",
            "iTunes/Finder detecta el iPhone en modo recuperacion",
            "Click 'Restaurar'",
            "Espera a que descargue e instale iOS (15-30 min con buena conexion)",
            "Configura de nuevo con Apple ID",
          ],
        },
      ],
      important: "Sin el Apple ID del dueno, despues del reset el iPhone queda bloqueado por Activation Lock. NO hay forma legal de saltarse esto.",
    };
  }

  const resetCombo = isSamsung
    ? "Vol Up + Power (mantener juntos hasta que aparezca el logo)"
    : isXiaomi
    ? "Vol Up + Power (mantener hasta que salga el menu MI Recovery)"
    : isHuawei
    ? "Vol Up + Power (mantener 10 segundos)"
    : "Vol Up + Power (mantener hasta ver el menu Recovery)";

  const brand = isSamsung ? "Samsung" : isXiaomi ? "Xiaomi" : isHuawei ? "Huawei" : "Android";

  return {
    type: "android",
    brand,
    estimated_time: "5-15 minutos",
    methods: [
      ...(isSamsung ? [{
        name: "Samsung Find My Mobile (Sin borrar datos!)",
        time: "5 min",
        difficulty: "Facil",
        data_loss: false,
        steps: [
          "Desde otro dispositivo: findmymobile.samsung.com",
          "Inicia sesion con la cuenta Samsung del dueno",
          "Selecciona el telefono",
          "Click 'Desbloquear' — quita el PIN/patron remotamente",
          "El telefono se desbloquea con TODOS los datos intactos",
        ],
        requirement: "Necesita cuenta Samsung configurada y telefono con internet",
      }] : []),
      {
        name: "Google Find My Device",
        time: "5 min",
        difficulty: "Facil",
        data_loss: false,
        steps: [
          "Desde otro dispositivo: google.com/android/find",
          "Inicia sesion con la cuenta Google del telefono",
          "Selecciona 'Proteger dispositivo'",
          "Pon un nuevo PIN/contrasena",
          "En el telefono, usa ese nuevo PIN para entrar",
        ],
        requirement: "Necesita cuenta Google y telefono con internet",
      },
      {
        name: `Factory Reset ${brand} (Borra datos)`,
        time: "10 min",
        difficulty: "Facil",
        data_loss: true,
        steps: [
          "Apaga el telefono completamente",
          `Combinacion: ${resetCombo}`,
          "Aparece el menu Recovery (texto sobre fondo negro)",
          "Con los botones de volumen, navega a 'Wipe data/factory reset'",
          "Confirma con el boton de encendido",
          "Espera a que termine (2-5 minutos)",
          "Selecciona 'Reboot system now'",
          "El telefono arranca como nuevo",
          "NOTA: Pedira la cuenta Google anterior (FRP). El dueno necesita recordar su cuenta Google.",
        ],
      },
    ],
    important: "Despues del factory reset, Google pide la cuenta anterior (FRP). Si el dueno no recuerda su cuenta Google, necesita contactar al fabricante con prueba de compra.",
  };
}

function getWifiInstructions(device: string) {
  const brand = device?.toLowerCase() || "";
  const isMovistar = brand.includes("movistar") || brand.includes("hgu");
  const isVodafone = brand.includes("vodafone");
  const isOrange = brand.includes("orange") || brand.includes("livebox");
  const isDigi = brand.includes("digi");

  return {
    type: "wifi",
    estimated_time: "1-5 minutos",
    data_safe: true,
    methods: [
      {
        name: "Etiqueta del Router (Lo mas rapido)",
        time: "1 min",
        difficulty: "Facil",
        steps: [
          "Dale la vuelta al router (o mira por debajo/detras)",
          "Busca una pegatina/etiqueta blanca",
          "Dice algo como: 'Clave WiFi', 'WPA Key', 'Password', 'Contrasena'",
          "Esa es la contrasena de FABRICA del WiFi",
          "Si nunca la cambio, esa es la contrasena",
          isMovistar ? "Movistar HGU: La clave suele ser tipo 'adjetivo+sustantivo+2numeros' (ej: HappyCat42)" :
          isVodafone ? "Vodafone: Busca la clave larga alfanumerica en la pegatina lateral" :
          isOrange ? "Orange/Livebox: La clave esta en la pegatina inferior" :
          isDigi ? "Digi: La clave esta en la parte de abajo del router" :
          "La clave esta en la etiqueta del router",
        ],
      },
      {
        name: "Ver clave guardada en movil/PC conectado",
        time: "2 min",
        difficulty: "Facil",
        steps: [
          "Si tienes un dispositivo YA conectado a esa WiFi:",
          "",
          "ANDROID: Ajustes > WiFi > tu red > Compartir (aparece QR y contrasena)",
          "iPHONE: No muestra contrasena directamente, pero puedes compartir WiFi acercando otro iPhone",
          "WINDOWS: Abre CMD y escribe:",
          "  netsh wlan show profile name=\"NOMBRE_RED\" key=clear",
          "  Busca 'Contenido de la clave' — esa es la contrasena",
          "MAC: Abre la app 'Acceso a Llaveros', busca el nombre de la red, marca 'Mostrar contrasena'",
        ],
      },
      {
        name: "Reset del Router (Si cambio la clave)",
        time: "3 min",
        difficulty: "Facil",
        data_loss: true,
        steps: [
          "Busca el boton RESET en el router (agujerito pequeño, normalmente detras)",
          "Con un clip o alfiler, manten pulsado 15 segundos",
          "Las luces del router parpadean y se reinicia",
          "La clave WiFi vuelve a la de FABRICA (la de la etiqueta)",
          "Reconecta todos tus dispositivos con la clave de la etiqueta",
          "Para entrar al panel del router: http://192.168.1.1 (user: admin, pass: admin o 1234)",
          "NOTA: Si tienes configuracion especial (puertos, VPN, etc) se pierde — solo se resetea",
        ],
      },
    ],
    default_admin: {
      "Movistar": { url: "http://192.168.1.1", user: "admin", pass: "admin o 1234" },
      "Vodafone": { url: "http://192.168.0.1", user: "vodafone", pass: "vodafone" },
      "Orange": { url: "http://192.168.1.1", user: "admin", pass: "admin" },
      "Digi": { url: "http://192.168.1.1", user: "admin", pass: "admin" },
      "MasMovil": { url: "http://192.168.1.1", user: "admin", pass: "admin" },
    },
  };
}

function getCameraInstructions(device: string) {
  const brand = device?.toLowerCase() || "";
  const isDahua = brand.includes("dahua");
  const isHikvision = brand.includes("hikvision") || brand.includes("hik");

  return {
    type: "camera",
    estimated_time: "5-10 minutos",
    methods: [
      {
        name: "Reset Fisico (Lo mas rapido y seguro)",
        time: "2 min",
        difficulty: "Facil",
        data_loss: false,
        steps: [
          "Busca el boton RESET en la camara/DVR:",
          "  - DVR/NVR: normalmente en la parte trasera, un agujerito pequeño",
          "  - Camara IP: en la base o lateral, puede ser un boton o pinhole",
          "Con un clip, manten pulsado 15-20 segundos con el equipo encendido",
          "Las luces parpadean — el equipo se reinicia",
          "La contrasena vuelve a fabrica:",
          isDahua ? "  Dahua: usuario 'admin', contrasena 'admin' (o vacia en modelos nuevos)" :
          isHikvision ? "  Hikvision: usuario 'admin', contrasena '12345' (modelos antiguos) o necesita SADP" :
          "  Generica: usuario 'admin', contrasena 'admin' o '12345'",
          "Accede por navegador: http://IP_DE_LA_CAMARA",
          "Las grabaciones normalmente se MANTIENEN despues del reset",
        ],
      },
      {
        name: "Herramienta del Fabricante",
        time: "10 min",
        difficulty: "Medio",
        steps: isDahua ? [
          "Descarga Dahua ConfigTool (gratis): https://dahuawiki.com/ConfigTool",
          "Conecta el PC a la misma red que el DVR/camara",
          "ConfigTool detecta automaticamente el dispositivo",
          "Click derecho > 'Forgot Password' o 'Reset Password'",
          "Te da un codigo QR — escanea con la app DMSS",
          "O contacta soporte Dahua con el numero de serie",
        ] : isHikvision ? [
          "Descarga SADP Tool (gratis): https://www.hikvision.com/en/support/tools/",
          "Conecta el PC a la misma red que la camara/DVR",
          "SADP detecta el dispositivo automaticamente",
          "Selecciona el dispositivo > 'Forgot Password'",
          "Genera un archivo XML que envias a Hikvision por email",
          "Te responden con un archivo de reset (normalmente mismo dia)",
          "O usa la app Hik-Connect para reset por QR",
        ] : [
          "Busca la herramienta de configuracion de tu marca en su web",
          "Normalmente se llama 'IP Config Tool' o 'Device Manager'",
          "Conecta el PC a la misma red",
          "La herramienta detecta el dispositivo y permite reset",
        ],
      },
      {
        name: "Probar Contrasenas de Fabrica",
        time: "2 min",
        difficulty: "Facil",
        steps: [
          "Accede a la camara por navegador: http://IP_CAMARA (normalmente 192.168.1.108 o similar)",
          "Prueba estas combinaciones:",
          isDahua
            ? "  admin / admin | admin / admin123 | admin / 888888 | 888888 / 888888 | admin / 123456"
            : isHikvision
            ? "  admin / 12345 | admin / hiklinux | admin / Hikvision | admin / abcdef | admin / admin12345"
            : "  admin / admin | admin / 12345 | admin / password | admin / 123456 | root / root",
          "Si ninguna funciona, usa el reset fisico (metodo 1)",
        ],
      },
    ],
  };
}

function getSafeInstructions(device: string) {
  const brand = device?.toLowerCase() || "";
  return {
    type: "safe",
    estimated_time: "5-30 minutos",
    methods: [
      {
        name: "Llave de Emergencia (Lo primero!)",
        time: "1 min",
        steps: [
          "TODAS las cajas fuertes electronicas tienen una cerradura de llave de emergencia",
          "Normalmente esta TAPADA con una tapa de plastico:",
          "  - Debajo del teclado numerico",
          "  - Detras de una tapa con el logo de la marca",
          "  - En el lateral o parte inferior",
          "La llave de emergencia viene con la caja fuerte (busca en la caja original o entre tus llaves)",
          "Abre con la llave y luego resetea el codigo electronico",
        ],
      },
      {
        name: "Codigos de Fabrica",
        time: "5 min",
        steps: [
          "Prueba estos codigos (muchos no los cambian):",
          "  0000 | 1234 | 9999 | 1111 | 123456 | 000000",
          "",
          "Por marca:",
          brand.includes("arregui") ? "  Arregui: 1234 o 123456" :
          brand.includes("btv") ? "  BTV: 1234 o 159B" :
          brand.includes("yale") ? "  Yale: 123456 o 1-2-3-4-5-6" :
          brand.includes("master") ? "  Master Lock: 0-0-0-0" :
          brand.includes("sentry") ? "  SentrySafe: 1-7-5-0-0 (master comun)" :
          "  Genericos: 0000, 1234, 9999, 123456",
          "",
          "Prueba tambien: fecha de nacimiento, aniversario, ano de compra",
        ],
      },
      {
        name: "Contactar Fabricante",
        time: "30 min - 24h",
        steps: [
          "Si nada funciona, contacta al fabricante con:",
          "  - Numero de serie de la caja fuerte (etiqueta interior o exterior)",
          "  - Tu DNI/identificacion",
          "  - Prueba de compra si la tienes",
          "El fabricante puede darte el codigo maestro o enviar un cerrajero",
          "Algunas marcas tienen atencion telefonica para esto",
        ],
      },
    ],
  };
}

function getLockInstructions(device: string) {
  const brand = device?.toLowerCase() || "";
  return {
    type: "lock",
    estimated_time: "5-15 minutos",
    methods: [
      {
        name: "Llave Fisica de Emergencia",
        time: "1 min",
        steps: [
          "CASI TODAS las cerraduras digitales incluyen una llave fisica de emergencia",
          "Busca la ranura de llave (normalmente debajo de la tapa del teclado o en la parte inferior)",
          "La llave viene con la cerradura — busca en la caja original o tus llaves",
          brand.includes("yale") ? "Yale: La llave esta siempre, busca la tapa inferior" :
          brand.includes("samsung") ? "Samsung: Llave de emergencia incluida, ranura oculta" :
          brand.includes("nuki") ? "Nuki: Funciona con tu llave normal de toda la vida" :
          "Busca la ranura de llave oculta",
        ],
      },
      {
        name: "Pila de Emergencia (Si se quedo sin bateria)",
        time: "2 min",
        steps: [
          "Si la cerradura no responde, puede ser bateria agotada",
          "Busca los contactos de emergencia (normalmente debajo de la cerradura, 2 puntos metalicos)",
          "Aplica una pila de 9V en los contactos — la cerradura se enciende temporalmente",
          "Introduce tu codigo normal y abre",
          "Cambia las pilas inmediatamente",
        ],
      },
      {
        name: "Reset de Fabrica",
        time: "5 min",
        steps: [
          "Con la puerta ABIERTA (importante!):",
          brand.includes("yale") ? [
            "Yale: Quita las pilas, manten el boton de reset, pon las pilas manteniendo el boton, suelta a los 5 seg",
          ].join("\n") :
          brand.includes("samsung") ? [
            "Samsung: Quita las pilas, manten el boton interior mientras pones las pilas, suelta a los 3 seg",
          ].join("\n") :
          "General: Quita las pilas, manten el boton de reset, pon las pilas, suelta a los 5 segundos",
          "La cerradura pita confirmando el reset",
          "Configura un nuevo codigo",
        ],
      },
    ],
    important: "SIEMPRE haz el reset con la puerta ABIERTA. Si se resetea con la puerta cerrada y falla, te quedas fuera.",
  };
}

function getCardInstructions() {
  return {
    type: "card",
    estimated_time: "5-10 minutos",
    methods: [
      {
        name: "Banca Online / App del Banco",
        time: "5 min",
        steps: [
          "La mayoria de bancos permiten cambiar el PIN desde la app:",
          "  CaixaBank: App > Tarjetas > PIN > Cambiar PIN",
          "  BBVA: App > Tarjetas > Consultar PIN (te lo muestra!)",
          "  Santander: App > Tarjetas > Gestionar PIN",
          "  Bankinter: App > Tarjetas > Ver PIN",
          "  ING: App > Tarjetas > PIN",
          "  Sabadell: App > Tarjetas > Consultar PIN",
          "Algunos bancos muestran el PIN actual, otros te dejan cambiarlo",
        ],
      },
      {
        name: "Cajero Automatico",
        time: "5 min",
        steps: [
          "Ve a un cajero de TU banco con tu tarjeta y DNI",
          "Selecciona 'Cambiar PIN' o 'Servicios de tarjeta'",
          "Algunos cajeros piden el PIN actual (no sirve si no lo recuerdas)",
          "Si no funciona, pide ayuda en ventanilla",
        ],
      },
      {
        name: "Llamar al Banco",
        time: "10 min",
        steps: [
          "Llama al telefono de atencion de tu banco:",
          "  CaixaBank: 900 40 40 90",
          "  BBVA: 900 102 801",
          "  Santander: 915 123 123",
          "  Sabadell: 963 085 000",
          "  ING: 901 105 115",
          "  Bankinter: 900 802 081",
          "Pide un nuevo PIN — te lo envian por correo o lo recoges en oficina",
        ],
      },
    ],
  };
}

function getWalletInstructions() {
  return {
    type: "wallet",
    estimated_time: "Variable (minutos a horas)",
    methods: [
      {
        name: "Frase Semilla (Seed Phrase) — Solucion definitiva",
        time: "5 min si la tienes",
        steps: [
          "BUSCA tu frase semilla (12 o 24 palabras en ingles) en:",
          "  - Papel escrito a mano (lo escribiste al crear el wallet)",
          "  - Fotos en tu movil/PC",
          "  - Notas guardadas (app de notas, email a ti mismo)",
          "  - Caja fuerte fisica (muchos lo guardan ahi)",
          "  - Familiares de confianza",
          "Si la encuentras: abre el wallet oficial y selecciona 'Importar/Restaurar con frase semilla'",
          "Esto da acceso COMPLETO a todas tus criptomonedas",
        ],
      },
      {
        name: "Contrasenas Guardadas",
        time: "5 min",
        steps: [
          "Revisa contrasenas guardadas en tu navegador:",
          "  Chrome: chrome://settings/passwords",
          "  Firefox: about:logins",
          "  Edge: edge://settings/passwords",
          "  Safari: Preferencias > Contrasenas",
          "Busca 'metamask', 'blockchain', 'exodus', 'trust' o el nombre de tu wallet",
          "Muchas veces la contrasena esta guardada sin que lo recuerdes",
        ],
      },
      {
        name: "Wallet Especificos",
        time: "Variable",
        steps: [
          "MetaMask: Si tienes la extension abierta, ve a Configuracion > Seguridad > Revelar frase semilla",
          "Exodus: Configuracion > Backup > ver frase (necesita contrasena)",
          "Trust Wallet: Configuracion > Wallets > ver frase semilla",
          "Ledger/Trezor: La frase esta en la tarjeta que viene en la caja — BUSCALA",
          "Coinbase: No es wallet propio — recupera cuenta en coinbase.com con email",
          "Binance: Igual — recupera cuenta con email en binance.com",
        ],
      },
    ],
    important: "NUNCA compartas tu frase semilla con nadie online. Cualquiera con esas palabras puede robar todo tu dinero.",
  };
}

function getEmailInstructions(email: string) {
  const domain = email?.split("@")[1]?.toLowerCase() || "";
  const isGmail = domain.includes("gmail");
  const isOutlook = domain.includes("outlook") || domain.includes("hotmail") || domain.includes("live");
  const isYahoo = domain.includes("yahoo");

  return {
    type: "email",
    estimated_time: "5-15 minutos",
    methods: [
      {
        name: isGmail ? "Recuperar cuenta Google/Gmail" : isOutlook ? "Recuperar cuenta Microsoft/Outlook" : isYahoo ? "Recuperar cuenta Yahoo" : "Recuperar cuenta de email",
        time: "5 min",
        steps: isGmail ? [
          "Ve a: accounts.google.com/signin/recovery",
          "Escribe el email (Gmail)",
          "Click 'Siguiente'",
          "Google te ofrece varias formas de verificar:",
          "  - SMS al telefono asociado",
          "  - Email de recuperacion alternativo",
          "  - Preguntas de seguridad",
          "  - Notificacion en un movil donde este la cuenta abierta",
          "Sigue los pasos y crea una nueva contrasena",
        ] : isOutlook ? [
          "Ve a: account.live.com/password/reset",
          "Escribe el email (Outlook/Hotmail)",
          "Microsoft te ofrece verificar por SMS, email alternativo o app",
          "Si no tienes acceso a nada: selecciona 'No tengo ninguno de estos'",
          "Te pide rellenar un formulario de identidad (puede tardar 24h)",
          "Si funciona, crea nueva contrasena",
        ] : isYahoo ? [
          "Ve a: login.yahoo.com/forgot",
          "Escribe el email (Yahoo)",
          "Verifica por telefono o email alternativo",
          "Crea nueva contrasena",
        ] : [
          "Ve a la pagina de login de tu proveedor de email",
          "Busca el enlace 'He olvidado mi contrasena' o 'Forgot password'",
          "Sigue los pasos de verificacion (telefono, email alternativo)",
          "Crea una nueva contrasena",
        ],
      },
      {
        name: "Contrasenas Guardadas en el Navegador",
        time: "2 min",
        steps: [
          "Muchas veces la contrasena esta guardada sin que lo sepas:",
          "  Chrome: chrome://settings/passwords (o chrome://password-manager/passwords)",
          "  Firefox: about:logins",
          "  Edge: edge://settings/passwords",
          "  Safari: Preferencias > Contrasenas",
          "Busca tu email — puede que la contrasena este ahi",
          "Tambien revisa el movil: Ajustes > Contrasenas (iPhone) o Google > Contrasenas (Android)",
        ],
      },
      {
        name: "Contactar al Proveedor",
        time: "Variable",
        steps: [
          "Si nada funciona, contacta al soporte del proveedor:",
          isGmail ? "  Google: support.google.com/accounts/answer/7682439" :
          isOutlook ? "  Microsoft: support.microsoft.com/es-es/account-billing" :
          isYahoo ? "  Yahoo: help.yahoo.com/kb/account" :
          "  Busca 'soporte + nombre de tu proveedor'",
          "Lleva tu DNI y datos de la cuenta (fecha creacion, contactos frecuentes, etc)",
          "Google/Microsoft pueden tardar 1-3 dias laborables",
        ],
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, device, name, phone, email, birth_date, pet, partner, city } = body;
    const serviceName = SERVICE_NAMES[type] || type;

    // Send to Telegram
    const msg =
      `DESBLOQUEO - SECRETIUM UNLOCK\n\n` +
      `Servicio: ${serviceName}\n` +
      `Dispositivo: ${device || "No especificado"}\n` +
      `Cliente: ${name || "Anonimo"}\n` +
      `Tel: ${phone || "-"}\n` +
      `Email: ${email || "-"}\n` +
      `Hora: ${new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}`;

    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT, text: msg }),
    }).catch(() => {});

    // Generate instant instructions based on device type
    let result = null;

    switch (type) {
      case "computer":
        result = getComputerInstructions(device || "windows");
        break;
      case "phone":
        result = getPhoneInstructions(device || "android");
        break;
      case "wifi":
        result = getWifiInstructions(device || "generic");
        break;
      case "camera":
        result = getCameraInstructions(device || "generic");
        break;
      case "safe":
        result = getSafeInstructions(device || "generic");
        break;
      case "lock":
        result = getLockInstructions(device || "generic");
        break;
      case "card":
        result = getCardInstructions();
        break;
      case "wallet":
        result = getWalletInstructions();
        break;
      case "email":
        result = getEmailInstructions(email || "");
        break;
      default:
        result = { type: "unknown", instructions: ["Contacta con nosotros para ayuda personalizada."] };
    }

    // Also try VPS for personalized passwords (email/camera only, non-blocking)
    let vpsExtra = null;
    try {
      if (type === "email" && (name || email || birth_date)) {
        const res = await fetch(`${VPS_API}/api/suggest?${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || "", email: email || "", birth_date: birth_date || "",
            phone: phone || "", pet: pet || "", partner: partner || "", city: city || "",
            extra_words: device ? device.split(" ") : [],
          }),
          signal: AbortSignal.timeout(8000),
        });
        const data = await res.json();
        vpsExtra = {
          personalized_passwords: data.top_50 || data.passwords?.slice(0, 50),
          total_generated: data.total,
        };
      }
    } catch {
      // VPS not reachable, local instructions are enough
    }

    return NextResponse.json({
      success: true,
      service: serviceName,
      result,
      personalized: vpsExtra,
      message: "Instrucciones listas. Sigue los pasos en orden de mas facil a mas dificil.",
    });
  } catch {
    return NextResponse.json({ error: true, message: "Error procesando solicitud." }, { status: 500 });
  }
}
