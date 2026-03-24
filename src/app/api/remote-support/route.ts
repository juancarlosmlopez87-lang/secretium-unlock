import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_TOKEN = "8451701836:AAHnoYbzI14jnyCVtfx05iuA_CfkYKwPtX8";
const TELEGRAM_CHAT = "1802913178";

/*
  REMOTE SUPPORT INVITATION SYSTEM — Secretium Unlock
  ====================================================
  Sistema profesional de soporte remoto.

  Flujo:
  1. Cliente solicita ayuda remota desde la web
  2. Se genera una sesion unica con instrucciones personalizadas
  3. El tecnico recibe notificacion por Telegram al instante
  4. Cliente instala AnyDesk (gratuito) y comparte su codigo
  5. El tecnico se conecta y resuelve el problema

  Dispositivos soportados:
  - Windows, Mac, Linux (AnyDesk completo)
  - Android (AnyDesk desde Play Store)
  - iPhone/iPad (limitado, videollamada WhatsApp)
  - Router/WiFi (acceso al panel de administracion)
*/

// ─── Tipos ───────────────────────────────────────────────────

type DeviceType = "windows" | "mac" | "android" | "iphone" | "linux" | "router";

interface SessionRequest {
  action: "create_session" | "get_instructions";
  client_name: string;
  client_email?: string;
  client_phone?: string;
  device_type: DeviceType;
  problem_description: string;
}

interface DeviceInstructions {
  device_type: DeviceType;
  device_label: string;
  steps: string[];
  estimated_time: string;
  remote_capabilities: string[];
  tools_used: string[];
  notes: string[];
}

// ─── Generador de Session ID ─────────────────────────────────

function generateSessionId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O/1/I para evitar confusion
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// ─── Instrucciones por Dispositivo ───────────────────────────

function getDeviceInstructions(deviceType: DeviceType): DeviceInstructions {
  const instructions: Record<DeviceType, DeviceInstructions> = {
    windows: {
      device_type: "windows",
      device_label: "Windows (PC / Portatil)",
      steps: [
        "1. Abra su navegador (Chrome, Edge, Firefox) y vaya a: https://anydesk.com/es/downloads",
        "2. Haga clic en 'Descarga gratuita' - se descargara un archivo llamado AnyDesk.exe",
        "3. Abra el archivo descargado (puede ejecutarlo sin instalar, o instalarlo para uso futuro)",
        "4. Si Windows muestra un aviso de seguridad, haga clic en 'Ejecutar de todas formas' o 'Mas informacion' > 'Ejecutar'",
        "5. Se abrira AnyDesk y vera un numero de 9 digitos en la pantalla principal (ejemplo: 123 456 789)",
        "6. Comuniquenos ese numero de 9 digitos por telefono, WhatsApp o chat",
        "7. Cuando nuestro tecnico solicite conexion, aparecera una ventana pidiendo permiso - haga clic en 'Aceptar'",
        "8. Mantengase frente al ordenador durante la sesion por si necesitamos su confirmacion",
      ],
      estimated_time: "15-45 minutos dependiendo del problema",
      remote_capabilities: [
        "Control total del escritorio",
        "Instalacion y desinstalacion de programas",
        "Configuracion de red y Wi-Fi",
        "Eliminacion de virus y malware",
        "Recuperacion de contrasenas del sistema",
        "Configuracion de correo y cuentas",
        "Optimizacion y limpieza del sistema",
        "Actualizacion de drivers y Windows Update",
        "Configuracion de impresoras y perifericos",
      ],
      tools_used: [
        "AnyDesk (conexion remota gratuita)",
        "Herramientas de diagnostico de Windows",
        "Software de recuperacion de contrasenas (si aplica)",
        "Antivirus y herramientas de limpieza",
      ],
      notes: [
        "No necesita instalar AnyDesk, puede ejecutarlo directamente",
        "La conexion es cifrada y segura (TLS 1.2)",
        "Usted puede ver todo lo que hace el tecnico en su pantalla",
        "Puede desconectar en cualquier momento cerrando AnyDesk",
      ],
    },

    mac: {
      device_type: "mac",
      device_label: "Mac (MacBook / iMac / Mac Mini)",
      steps: [
        "1. Abra Safari o Chrome y vaya a: https://anydesk.com/es/downloads",
        "2. Descargue la version para macOS",
        "3. Abra el archivo .dmg descargado y arrastre AnyDesk a la carpeta Aplicaciones",
        "4. Abra AnyDesk desde Aplicaciones (si aparece aviso de desarrollador, vaya a Ajustes del Sistema > Privacidad y Seguridad > y haga clic en 'Abrir igualmente')",
        "5. IMPORTANTE - Conceda permisos: vaya a Ajustes del Sistema > Privacidad y Seguridad > Accesibilidad > active AnyDesk",
        "6. Tambien en: Ajustes del Sistema > Privacidad y Seguridad > Grabacion de pantalla > active AnyDesk",
        "7. Puede que necesite reiniciar AnyDesk tras dar los permisos",
        "8. Vera un numero de 9 digitos en la pantalla principal de AnyDesk",
        "9. Comuniquenos ese numero por telefono, WhatsApp o chat",
        "10. Cuando aparezca la solicitud de conexion, haga clic en 'Aceptar'",
      ],
      estimated_time: "20-50 minutos (los permisos de Mac requieren tiempo extra)",
      remote_capabilities: [
        "Control del escritorio (con permisos activos)",
        "Configuracion de red y Wi-Fi",
        "Instalacion de aplicaciones",
        "Configuracion de cuentas Apple ID e iCloud",
        "Limpieza y optimizacion del sistema",
        "Configuracion de correo y calendario",
        "Resolucion de problemas de rendimiento",
      ],
      tools_used: [
        "AnyDesk para Mac (conexion remota)",
        "Terminal de macOS para diagnostico avanzado",
        "Utilidad de Discos si es necesario",
        "Preferencias del Sistema para configuracion",
      ],
      notes: [
        "macOS requiere permisos explicitos para el control remoto - es normal y necesario",
        "Si no da los permisos de Accesibilidad, el tecnico solo podra VER pero no controlar",
        "En Mac con chip Apple Silicon (M1/M2/M3) los permisos son identicos",
        "La primera vez que abra AnyDesk, Mac pedira confirmacion - esto es normal",
      ],
    },

    android: {
      device_type: "android",
      device_label: "Android (Movil / Tablet)",
      steps: [
        "1. Abra Google Play Store en su dispositivo",
        "2. Busque 'AnyDesk Remote Desktop' (desarrollador: AnyDesk Software GmbH)",
        "3. Instale la aplicacion (es gratuita, ~25 MB)",
        "4. Al abrir AnyDesk por primera vez, acepte los permisos que solicite",
        "5. IMPORTANTE: Instalara automaticamente un plugin de control - acepte la instalacion",
        "6. Vaya a Ajustes > Accesibilidad > AnyDesk Control Plugin > activelo",
        "7. En la pantalla principal de AnyDesk vera su codigo de 9 digitos",
        "8. Envie ese codigo por WhatsApp, telefono o chat",
        "9. Cuando el tecnico se conecte, aparecera una solicitud - pulse 'Aceptar'",
        "10. Acepte tambien el permiso de proyeccion de pantalla cuando aparezca",
      ],
      estimated_time: "10-30 minutos",
      remote_capabilities: [
        "Visualizacion y control de la pantalla del movil",
        "Configuracion de Wi-Fi y datos moviles",
        "Instalacion y desinstalacion de apps",
        "Configuracion de cuentas de correo",
        "Eliminacion de apps sospechosas o malware",
        "Configuracion de bloqueo de pantalla",
        "Ajustes de notificaciones y permisos",
      ],
      tools_used: [
        "AnyDesk para Android (Play Store)",
        "AnyDesk Control Plugin (se instala automaticamente)",
        "Herramientas de ajustes de Android",
      ],
      notes: [
        "El plugin de control es necesario para que el tecnico pueda interactuar con su pantalla",
        "En algunos Samsung necesita activar AnyDesk en Ajustes > Accesibilidad",
        "Su bateria debe estar al menos al 30% para la sesion",
        "Conecte a Wi-Fi para evitar consumo de datos (la sesion usa ~50-100 MB)",
      ],
    },

    iphone: {
      device_type: "iphone",
      device_label: "iPhone / iPad (iOS / iPadOS)",
      steps: [
        "1. NOTA IMPORTANTE: Apple NO permite el control remoto de iPhones/iPads por seguridad",
        "2. En su lugar, haremos una videollamada por WhatsApp donde usted muestra su pantalla",
        "3. Abra WhatsApp y busque nuestro numero: +34 620 300 647",
        "4. Inicie una videollamada con nosotros",
        "5. Durante la videollamada, enfoque la camara a la pantalla de su iPhone/iPad",
        "6. El tecnico le guiara paso a paso diciendole que tocar en cada momento",
        "7. ALTERNATIVA: Si prefiere compartir pantalla, usaremos FaceTime o Google Meet",
        "8. Para compartir pantalla en FaceTime: durante la llamada, pulse el icono de compartir pantalla",
        "9. Para Google Meet: le enviaremos un enlace, unase y pulse 'Presentar pantalla'",
      ],
      estimated_time: "15-40 minutos (requiere mas comunicacion verbal)",
      remote_capabilities: [
        "Guia visual paso a paso via videollamada",
        "Indicaciones precisas de donde tocar y que configurar",
        "Configuracion de Wi-Fi, correo, cuentas",
        "Resolucion de problemas de apps y almacenamiento",
        "Configuracion de Apple ID e iCloud",
        "Restauracion de ajustes si es necesario",
      ],
      tools_used: [
        "WhatsApp Videollamada (principal)",
        "FaceTime con pantalla compartida (alternativa)",
        "Google Meet con presentacion de pantalla (alternativa)",
      ],
      notes: [
        "iOS no permite control remoto por restricciones de Apple - es normal",
        "La videollamada es la forma mas efectiva para soporte en iPhone",
        "Si el problema es complejo, podemos hacer la sesion por FaceTime compartiendo pantalla",
        "Asegurese de tener buena conexion Wi-Fi para la videollamada",
        "Cargue su dispositivo al menos al 50% antes de la sesion",
      ],
    },

    linux: {
      device_type: "linux",
      device_label: "Linux (Ubuntu / Debian / Fedora / otros)",
      steps: [
        "1. Abra una terminal (Ctrl+Alt+T en la mayoria de distribuciones)",
        "2. Para Ubuntu/Debian, ejecute estos comandos:",
        "   wget -qO - https://keys.anydesk.com/repos/DEB-GPG-KEY | sudo apt-key add -",
        '   echo "deb http://deb.anydesk.com/ all main" | sudo tee /etc/apt/sources.list.d/anydesk-stable.list',
        "   sudo apt update && sudo apt install anydesk -y",
        "3. Para Fedora/RHEL: sudo dnf install https://download.anydesk.com/linux/anydesk-x.x.x-1.x86_64.rpm",
        "4. Alternativa rapida: descargue desde https://anydesk.com/es/downloads/linux",
        "5. Ejecute AnyDesk desde el menu de aplicaciones o escriba 'anydesk' en terminal",
        "6. Vera un codigo de 9 digitos en la pantalla principal",
        "7. Comuniquenos ese codigo por telefono, WhatsApp o chat",
        "8. Acepte la solicitud de conexion cuando aparezca",
      ],
      estimated_time: "15-45 minutos",
      remote_capabilities: [
        "Control completo del escritorio",
        "Ejecucion de comandos en terminal",
        "Configuracion de red y firewall",
        "Instalacion de paquetes y dependencias",
        "Configuracion de servidores y servicios",
        "Diagnostico avanzado del sistema",
        "Configuracion de permisos y usuarios",
      ],
      tools_used: [
        "AnyDesk para Linux",
        "Terminal / Shell (bash, zsh)",
        "Herramientas nativas del sistema (systemctl, journalctl, etc.)",
        "Gestor de paquetes (apt, dnf, pacman)",
      ],
      notes: [
        "Necesitara permisos de administrador (sudo) para instalar AnyDesk",
        "Si usa Wayland en lugar de X11, AnyDesk puede tener limitaciones - cambie a X11 en la pantalla de login si es posible",
        "En distribuciones sin escritorio grafico, usaremos SSH en su lugar",
        "AnyDesk funciona en la mayoria de distribuciones basadas en Debian, Red Hat y Arch",
      ],
    },

    router: {
      device_type: "router",
      device_label: "Router / WiFi / Red",
      steps: [
        "1. Necesitamos acceder al panel de administracion de su router",
        "2. Abra un navegador en cualquier dispositivo conectado a su Wi-Fi",
        "3. En la barra de direcciones, escriba una de estas direcciones:",
        "   - 192.168.1.1 (la mas comun en Espana: Movistar, Orange, Vodafone)",
        "   - 192.168.0.1 (algunos routers Vodafone, TP-Link, Netgear)",
        "   - 192.168.1.254 (algunos routers de fibra)",
        "   - 192.168.8.1 (routers 4G Huawei)",
        "4. Aparecera una pantalla de login del router",
        "5. Las credenciales suelen estar en una pegatina debajo del router:",
        "   - Usuario: admin | Contrasena: admin (por defecto en muchos modelos)",
        "   - Usuario: admin | Contrasena: la de la pegatina del router",
        "   - Usuario: 1234 | Contrasena: 1234 (algunos Zyxel de Movistar)",
        "6. Si puede entrar al panel, haga una captura de pantalla y envienosla por WhatsApp",
        "7. Si NO puede entrar, necesitaremos conectarnos por AnyDesk a su PC para acceder al router desde ahi",
        "8. En ese caso, siga las instrucciones de Windows/Mac para instalar AnyDesk",
      ],
      estimated_time: "10-30 minutos",
      remote_capabilities: [
        "Configuracion de nombre y contrasena Wi-Fi",
        "Apertura de puertos para juegos o camaras",
        "Configuracion de DNS (mejora de velocidad)",
        "Activacion/desactivacion de Wi-Fi 5GHz",
        "Configuracion de control parental",
        "Actualizacion del firmware del router",
        "Diagnostico de problemas de conexion",
        "Configuracion de red de invitados",
      ],
      tools_used: [
        "Panel de administracion del router (via navegador)",
        "AnyDesk (si necesitamos acceder via su PC)",
        "Herramientas de diagnostico de red (ping, traceroute)",
        "WhatsApp para recibir capturas de pantalla del panel",
      ],
      notes: [
        "Las credenciales del router suelen estar en la pegatina del propio router (parte inferior o trasera)",
        "Si ha cambiado la contrasena del router y no la recuerda, se puede resetear con el boton fisico (perdera la configuracion)",
        "Para problemas de velocidad, verificaremos tambien la banda 5GHz",
        "Operadores en Espana: Movistar (192.168.1.1), Orange (192.168.1.1), Vodafone (192.168.0.1), MasMovil (192.168.1.1)",
      ],
    },
  };

  return instructions[deviceType] || instructions["windows"];
}

// ─── Notificacion Telegram ───────────────────────────────────

async function sendTelegramNotification(
  sessionId: string,
  clientName: string,
  clientEmail: string | undefined,
  clientPhone: string | undefined,
  deviceType: string,
  problemDescription: string,
  deviceLabel: string,
  estimatedTime: string
): Promise<boolean> {
  const timestamp = new Date().toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const message =
    `🖥️ NUEVA SESION DE SOPORTE REMOTO\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📋 Sesion: #${sessionId}\n` +
    `📅 Fecha: ${timestamp}\n\n` +
    `👤 Cliente: ${clientName}\n` +
    `${clientEmail ? `📧 Email: ${clientEmail}\n` : ""}` +
    `${clientPhone ? `📱 Tel: ${clientPhone}\n` : ""}` +
    `💻 Dispositivo: ${deviceLabel}\n` +
    `⏱️ Tiempo estimado: ${estimatedTime}\n\n` +
    `🔧 Problema:\n${problemDescription}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `⚡ Instrucciones enviadas al cliente.\n` +
    `📞 Contactar para recibir codigo AnyDesk.`;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );
    return res.ok;
  } catch {
    console.error("Error enviando notificacion Telegram");
    return false;
  }
}

// ─── Handlers ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body: SessionRequest = await req.json();
    const {
      action,
      client_name,
      client_email,
      client_phone,
      device_type,
      problem_description,
    } = body;

    // Validaciones basicas
    if (!action || !client_name || !device_type || !problem_description) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Faltan campos obligatorios: action, client_name, device_type, problem_description",
        },
        { status: 400 }
      );
    }

    const validDevices: DeviceType[] = [
      "windows",
      "mac",
      "android",
      "iphone",
      "linux",
      "router",
    ];
    if (!validDevices.includes(device_type)) {
      return NextResponse.json(
        {
          ok: false,
          error: `Tipo de dispositivo no valido. Use: ${validDevices.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // ─── GET INSTRUCTIONS ───────────────────────────────────

    if (action === "get_instructions") {
      const instructions = getDeviceInstructions(device_type);
      return NextResponse.json({
        ok: true,
        action: "get_instructions",
        instructions,
      });
    }

    // ─── CREATE SESSION ─────────────────────────────────────

    if (action === "create_session") {
      const sessionId = generateSessionId();
      const instructions = getDeviceInstructions(device_type);

      // Enviar notificacion Telegram al tecnico
      const telegramSent = await sendTelegramNotification(
        sessionId,
        client_name,
        client_email,
        client_phone,
        device_type,
        problem_description,
        instructions.device_label,
        instructions.estimated_time
      );

      return NextResponse.json({
        ok: true,
        action: "create_session",
        session: {
          id: sessionId,
          created_at: new Date().toISOString(),
          client_name,
          device_type,
          status: "pending_code",
        },
        instructions,
        message: `Sesion #${sessionId} creada correctamente. Siga las instrucciones para conectar con nuestro tecnico.`,
        telegram_notified: telegramSent,
        next_steps: [
          "Siga las instrucciones de instalacion de AnyDesk para su dispositivo",
          "Una vez tenga el codigo de 9 digitos, compartalo con nosotros por telefono (+34 620 300 647) o WhatsApp",
          "Nuestro tecnico se conectara y resolvera su problema",
          "Puede desconectar la sesion en cualquier momento cerrando AnyDesk",
        ],
        contact: {
          phone: "+34 620 300 647",
          whatsapp: "https://wa.me/34620300647",
          email: "inmobancamurcia@gmail.com",
        },
      });
    }

    return NextResponse.json(
      { ok: false, error: "Accion no reconocida. Use: create_session o get_instructions" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Error en /api/remote-support:", err);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET - Informacion del servicio
export async function GET() {
  return NextResponse.json({
    service: "Secretium Unlock - Soporte Remoto",
    version: "1.0",
    description:
      "Sistema de invitacion a soporte remoto. Genera sesiones con instrucciones personalizadas para que el cliente instale AnyDesk y comparta su codigo de acceso.",
    supported_devices: [
      { type: "windows", label: "Windows (PC / Portatil)", method: "AnyDesk" },
      { type: "mac", label: "Mac (MacBook / iMac)", method: "AnyDesk" },
      { type: "android", label: "Android (Movil / Tablet)", method: "AnyDesk" },
      {
        type: "iphone",
        label: "iPhone / iPad",
        method: "Videollamada WhatsApp/FaceTime",
      },
      { type: "linux", label: "Linux", method: "AnyDesk" },
      {
        type: "router",
        label: "Router / WiFi",
        method: "Panel admin + AnyDesk",
      },
    ],
    endpoints: {
      "POST /api/remote-support": {
        actions: ["create_session", "get_instructions"],
        body: {
          action: "create_session | get_instructions",
          client_name: "string (obligatorio)",
          client_email: "string (opcional)",
          client_phone: "string (opcional)",
          device_type:
            "windows | mac | android | iphone | linux | router (obligatorio)",
          problem_description: "string (obligatorio)",
        },
      },
    },
    contact: {
      phone: "+34 620 300 647",
      whatsapp: "https://wa.me/34620300647",
    },
  });
}
