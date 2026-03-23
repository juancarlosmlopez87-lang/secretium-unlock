import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_TOKEN = "8451701836:AAHnoYbzI14jnyCVtfx05iuA_CfkYKwPtX8";
const TELEGRAM_CHAT = "1802913178";

/*
  SMART UNLOCK ENGINE — Lo que nos diferencia de TODOS
  =====================================================
  No somos "instrucciones de como hacer reset". Eso lo tiene Google.

  SOMOS UN SISTEMA INTELIGENTE que:
  1. ANALIZA el dispositivo exacto del cliente (marca + modelo)
  2. GENERA un plan personalizado paso a paso
  3. DETECTA el mejor metodo automaticamente
  4. OFRECE soporte remoto INMEDIATO (AnyDesk/TeamViewer)
  5. TIENE una IA que aprende de cada caso

  ¿Por que paga el cliente? Porque:
  - No sabe que tecla pulsar en SU portatil concreto
  - No sabe si su cuenta es Microsoft o local
  - Tiene panico de romper algo
  - Quiere que alguien lo haga POR el
  - Necesita soporte en tiempo real

  MODELO: Instrucciones guiadas GRATIS (genera confianza)
          + Soporte remoto/presencial DE PAGO (genera dinero)
*/

// Base de datos de modelos con instrucciones ESPECIFICAS
const DEVICE_DB: Record<string, any> = {
  // === WINDOWS LAPTOPS ===
  "hp_pavilion": { boot: "F9", bios: "F10", brand: "HP", recovery: "F11" },
  "hp_envy": { boot: "F9", bios: "F10", brand: "HP", recovery: "F11" },
  "hp_omen": { boot: "F9", bios: "F10", brand: "HP", recovery: "F11" },
  "hp_probook": { boot: "F9", bios: "F10", brand: "HP", recovery: "F11" },
  "hp_elitebook": { boot: "F9", bios: "F10", brand: "HP", recovery: "F11" },
  "dell_inspiron": { boot: "F12", bios: "F2", brand: "Dell", recovery: "F8" },
  "dell_latitude": { boot: "F12", bios: "F2", brand: "Dell", recovery: "F8" },
  "dell_xps": { boot: "F12", bios: "F2", brand: "Dell", recovery: "F8" },
  "dell_vostro": { boot: "F12", bios: "F2", brand: "Dell", recovery: "F8" },
  "lenovo_thinkpad": { boot: "F12", bios: "F2 o Fn+F2", brand: "Lenovo", recovery: "F11" },
  "lenovo_ideapad": { boot: "F12", bios: "Fn+F2", brand: "Lenovo", recovery: "F11", note: "Algunos Lenovo: boton Novo (agujerito al lado del cargador) con el PC apagado" },
  "lenovo_legion": { boot: "F12", bios: "F2", brand: "Lenovo", recovery: "F11" },
  "lenovo_yoga": { boot: "F12", bios: "Fn+F2", brand: "Lenovo", recovery: "F11", note: "Boton Novo lateral" },
  "acer_aspire": { boot: "F12", bios: "F2", brand: "Acer", recovery: "Alt+F10" },
  "acer_nitro": { boot: "F12", bios: "F2/DEL", brand: "Acer", recovery: "Alt+F10" },
  "acer_swift": { boot: "F12", bios: "F2", brand: "Acer", recovery: "Alt+F10" },
  "asus_vivobook": { boot: "F8 o ESC", bios: "F2 o DEL", brand: "Asus", recovery: "F9" },
  "asus_zenbook": { boot: "ESC", bios: "F2", brand: "Asus", recovery: "F9" },
  "asus_rog": { boot: "F8 o ESC", bios: "DEL", brand: "Asus", recovery: "F9" },
  "asus_tuf": { boot: "F8", bios: "DEL o F2", brand: "Asus", recovery: "F9" },
  "msi_gaming": { boot: "F11", bios: "DEL", brand: "MSI", recovery: "F3" },
  "toshiba_satellite": { boot: "F12", bios: "F2", brand: "Toshiba", recovery: "0 (cero al encender)" },
  "samsung_galaxy_book": { boot: "F2", bios: "F2", brand: "Samsung", recovery: "F4" },
  "huawei_matebook": { boot: "F12", bios: "F2", brand: "Huawei", recovery: "F10" },

  // === ROUTERS ESPANA ===
  "movistar_hgu": { admin_url: "http://192.168.1.1", user: "admin", pass: "admin o 1234", wifi_type: "Clave larga en etiqueta o tipo AdjetivoNombre12", reset: "Boton lateral, clip 15 seg" },
  "movistar_smart_wifi": { admin_url: "http://192.168.1.1", user: "admin", pass: "1234", wifi_type: "En la app Smart WiFi o etiqueta", reset: "Boton Reset 15 seg" },
  "vodafone_station": { admin_url: "http://192.168.0.1", user: "vodafone", pass: "vodafone", wifi_type: "Etiqueta inferior", reset: "Reset 10 seg", note: "Algunos modelos: user vacio, pass en etiqueta" },
  "orange_livebox": { admin_url: "http://192.168.1.1", user: "admin", pass: "admin o clave en etiqueta", wifi_type: "Etiqueta lateral", reset: "Reset 10 seg" },
  "digi_router": { admin_url: "http://192.168.1.1", user: "admin", pass: "admin", wifi_type: "Etiqueta inferior", reset: "Reset 15 seg" },
  "masmovil_router": { admin_url: "http://192.168.1.1", user: "admin", pass: "admin o 1234", reset: "Reset 15 seg" },
  "pepephone_router": { admin_url: "http://192.168.1.1", user: "admin", pass: "admin o 1234", reset: "Reset 15 seg", note: "Usan routers Movistar reciclados normalmente" },

  // === CAMARAS ===
  "dahua_dvr": { default_user: "admin", default_pass: "admin", tool: "Dahua ConfigTool", tool_url: "https://dahuawiki.com/ConfigTool", reset: "Boton trasero 15-20 seg", app: "DMSS" },
  "dahua_ip": { default_user: "admin", default_pass: "admin (o vacio en nuevos)", tool: "Dahua ConfigTool", reset: "Boton en base de camara 15 seg", app: "DMSS" },
  "hikvision_dvr": { default_user: "admin", default_pass: "12345 (modelos antiguos)", tool: "SADP Tool", tool_url: "https://www.hikvision.com/en/support/tools/", reset: "Via SADP o boton fisico", app: "Hik-Connect" },
  "hikvision_ip": { default_user: "admin", default_pass: "12345 o configurado en primer uso", tool: "SADP Tool", reset: "Boton en camara 15 seg" },
  "reolink_camera": { default_user: "admin", default_pass: "vacio (sin contrasena)", reset: "Boton en camara 10 seg", app: "Reolink" },
  "tplink_tapo": { default_user: "admin", default_pass: "Se configura en app Tapo", reset: "Boton en camara 5 seg", app: "TP-Link Tapo", note: "Reset = hay que configurar de nuevo en la app" },

  // === CAJAS FUERTES ===
  "arregui_safe": { defaults: ["1234", "123456", "0000"], emergency: "Llave debajo del teclado (tapa plastica)", brand_support: "arregui.com — formulario contacto con N/S" },
  "btv_safe": { defaults: ["1234", "159B", "0000"], emergency: "Llave en parte inferior", brand_support: "btv.es — telefono 943 880 500" },
  "yale_safe": { defaults: ["123456", "1-2-3-4-5-6"], emergency: "Llave bajo tapa con logo Yale", brand_support: "yalelock.es" },
  "master_lock_safe": { defaults: ["0-0-0-0", "0000"], emergency: "Llave incluida en caja original" },
  "sentry_safe": { defaults: ["1-7-5-0-0", "00000"], emergency: "Llave en sobre entregado al comprar", brand_support: "sentrysafe.com — con N/S dan codigo master" },

  // === CERRADURAS DIGITALES ===
  "yale_lock": { emergency: "Llave fisica siempre incluida, ranura bajo teclado", reset: "Quitar pilas + reset button + poner pilas (puerta ABIERTA)", battery_emergency: "Pila 9V en contactos inferiores" },
  "samsung_lock": { emergency: "Llave fisica incluida", reset: "Quitar pilas + boton interior + poner pilas 3 seg", battery_emergency: "Pila 9V en contactos base" },
  "nuki_lock": { emergency: "Tu llave normal (Nuki es un complemento)", reset: "Quitar pilas 30 seg + mantener boton al poner pilas 10 seg", battery_emergency: "N/A - usa tu llave normal" },
};

// Detectar modelo de las keywords del usuario
function detectDevice(description: string): { key: string; info: any } | null {
  const desc = description.toLowerCase();

  for (const [key, info] of Object.entries(DEVICE_DB)) {
    const parts = key.split("_");
    const allMatch = parts.every(part => desc.includes(part));
    if (allMatch) return { key, info };
  }

  // Partial matches
  for (const [key, info] of Object.entries(DEVICE_DB)) {
    const parts = key.split("_");
    if (parts.some(part => part.length > 3 && desc.includes(part))) {
      return { key, info };
    }
  }

  return null;
}

// Detectar si es cuenta Microsoft o local
function detectAccountType(description: string): "microsoft" | "local" | "unknown" {
  const desc = description.toLowerCase();
  if (desc.includes("microsoft") || desc.includes("hotmail") || desc.includes("outlook") || desc.includes("@live") || desc.includes("@msn")) return "microsoft";
  if (desc.includes("local") || desc.includes("sin cuenta") || desc.includes("no tiene email")) return "local";
  return "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, device, name, phone, email } = body;

    // Notificar a Telegram
    const msg =
      `SMART UNLOCK\n` +
      `Tipo: ${type}\nDevice: ${device}\n` +
      `Cliente: ${name || "?"}\nTel: ${phone || "?"}\n` +
      `Email: ${email || "?"}\n` +
      `Hora: ${new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}`;
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT, text: msg }),
    }).catch(() => {});

    const detected = detectDevice(device || "");
    const accountType = type === "computer" ? detectAccountType(device || "") : null;

    // Generar plan personalizado
    const plan: any = {
      detected_device: detected ? detected.key.replace(/_/g, " ").toUpperCase() : null,
      device_info: detected?.info || null,
      account_type: accountType,
      steps: [] as any[],
      support: {
        whatsapp: "+34 620 300 647",
        message: "Escribe 'UNLOCK' + tu problema y te respondemos en minutos",
        remote: "Si necesitas que lo hagamos nosotros, instalamos AnyDesk/TeamViewer y lo resolvemos en directo",
      },
    };

    // Generar pasos personalizados segun tipo + modelo detectado
    if (type === "computer" && detected?.info?.boot) {
      const info = detected.info;
      if (accountType === "microsoft") {
        plan.steps.push({
          title: `Recuperar cuenta Microsoft (${info.brand})`,
          time: "5 min",
          detail: [
            "Desde tu movil o cualquier otro dispositivo con internet:",
            "1. Abre el navegador y ve a: account.live.com/password/reset",
            "2. Escribe el email de tu cuenta Microsoft",
            "3. Verifica tu identidad (SMS, email alternativo o app)",
            "4. Crea una nueva contrasena",
            `5. En tu ${info.brand}, conecta a WiFi o cable de red`,
            "6. Usa la nueva contrasena para entrar. Listo!",
          ],
        });
      }
      plan.steps.push({
        title: `Kit USB para ${info.brand} (Cuenta local)`,
        time: "15 min",
        detail: [
          `Tu ${info.brand} usa la tecla ${info.boot} para el menu de arranque`,
          `(Si no funciona, prueba ${info.bios} para entrar en BIOS)`,
          info.note || "",
          "",
          "Pasos con el Kit USB Secretium:",
          "1. Conecta nuestro USB al portatil",
          `2. Enciende y pulsa ${info.boot} repetidamente`,
          "3. Selecciona 'USB' o 'UEFI USB' en el menu",
          "4. Se carga Hiren's Boot PE (mini Windows)",
          "5. Abre NTPWEdit en el escritorio",
          "6. Selecciona tu usuario -> Change Password -> dejar vacio",
          "7. Save -> Quita USB -> Reinicia",
          "8. Entras sin contrasena. Pon una nueva en Configuracion.",
          "",
          "Tus archivos, fotos, programas — TODO sigue intacto.",
        ].filter(Boolean),
      });
    } else if (type === "wifi" && detected?.info?.admin_url) {
      const info = detected.info;
      plan.steps.push({
        title: `Recuperar WiFi ${detected.key.split("_").join(" ").toUpperCase()}`,
        time: "1-3 min",
        detail: [
          `Tu router ${detected.key.split("_")[0].toUpperCase()} tiene la clave de fabrica en la etiqueta:`,
          "1. Dale la vuelta al router o mira la parte de abajo/detras",
          "2. Busca la pegatina con 'WiFi Password', 'WPA Key' o 'Clave WiFi'",
          info.wifi_type ? `3. En tu modelo: ${info.wifi_type}` : "3. La clave esta impresa ahi",
          "",
          "Si la cambio y no la recuerda:",
          `4. Busca el boton RESET (agujerito en la parte trasera)`,
          `5. ${info.reset}`,
          "6. El router se reinicia con la clave de fabrica",
          "",
          `Panel de administracion: ${info.admin_url}`,
          `  Usuario: ${info.user} / Contrasena: ${info.pass}`,
          info.note || "",
        ].filter(Boolean),
      });
    } else if (type === "camera" && detected?.info) {
      const info = detected.info;
      plan.steps.push({
        title: `Recuperar ${detected.key.replace(/_/g, " ").toUpperCase()}`,
        time: "5-10 min",
        detail: [
          `Contrasena de fabrica: ${info.default_user} / ${info.default_pass}`,
          "",
          "Si la contrasena de fabrica no funciona:",
          `1. ${info.reset}`,
          "2. Espera a que reinicie (1-2 minutos)",
          `3. Prueba de nuevo: ${info.default_user} / ${info.default_pass}`,
          "",
          info.tool ? `Herramienta oficial: ${info.tool}` : "",
          info.tool_url ? `Descarga: ${info.tool_url}` : "",
          info.app ? `App movil: ${info.app}` : "",
        ].filter(Boolean),
      });
    } else if (type === "safe" && detected?.info) {
      const info = detected.info;
      plan.steps.push({
        title: `Abrir ${detected.key.replace(/_/g, " ").toUpperCase()}`,
        time: "5-15 min",
        detail: [
          "PASO 1 — Llave de emergencia (lo primero!):",
          info.emergency,
          "",
          "PASO 2 — Codigos de fabrica:",
          `Prueba estos: ${info.defaults.join(", ")}`,
          "Prueba tambien: fecha nacimiento, aniversario",
          "",
          info.brand_support ? `PASO 3 — Fabricante: ${info.brand_support}` : "",
          info.brand_support ? "Con el numero de serie te dan el codigo maestro" : "",
        ].filter(Boolean),
      });
    } else if (type === "lock" && detected?.info) {
      const info = detected.info;
      plan.steps.push({
        title: `Abrir ${detected.key.replace(/_/g, " ").toUpperCase()}`,
        time: "2-10 min",
        detail: [
          "PASO 1 — Llave fisica:",
          info.emergency,
          "",
          info.battery_emergency ? `PASO 2 — Si no enciende (bateria agotada): ${info.battery_emergency}` : "",
          "",
          `PASO 3 — Reset (con puerta ABIERTA!): ${info.reset}`,
        ].filter(Boolean),
      });
    }

    // Siempre anadir opcion de soporte remoto
    plan.steps.push({
      title: "Necesitas que lo hagamos nosotros?",
      time: "15-30 min con soporte",
      detail: [
        "Si no te sale o no te atreves, te ayudamos EN DIRECTO:",
        "",
        "OPCION A — Videollamada WhatsApp (GRATIS):",
        "  Llamanos al +34 620 300 647 y te guiamos paso a paso",
        "  Tu haces, nosotros te decimos que pulsar",
        "",
        "OPCION B — Control remoto (ordenadores):",
        "  1. Descarga AnyDesk (anydesk.com) en otro PC/movil",
        "  2. Danos el codigo de 9 digitos",
        "  3. Nosotros entramos y lo resolvemos en minutos",
        "  4. Tu ves todo lo que hacemos en pantalla",
        "",
        "OPCION C — Envio del dispositivo o visita en tienda:",
        "  C/ Callejon de la Luna 1, Local 4",
        "  30500 Molina de Segura (Murcia)",
      ],
    });

    return NextResponse.json({
      success: true,
      smart: true,
      plan,
    });
  } catch {
    return NextResponse.json({ error: true, message: "Error" }, { status: 500 });
  }
}
