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
};

const QUICK_STEPS: Record<string, string[]> = {
  wifi: [
    "Mira la pegatina debajo del router - a veces tiene la clave original",
    "Si tienes un movil conectado, ve a Ajustes > WiFi > tu red > Compartir para ver la clave",
    "En Windows conectado: cmd > netsh wlan show profile name=TUNOMBRE key=clear",
    "Si nada funciona, te contactamos para usar nuestro sistema de 5M+ combinaciones",
  ],
  phone: [
    "Android: Intenta con tu cuenta Google desde otro dispositivo (google.com/android/find)",
    "Samsung: Usa Find My Mobile (findmymobile.samsung.com) si tienes cuenta Samsung",
    "iPhone: Conecta a iTunes/Finder y haz restauracion (necesitaras tu Apple ID despues)",
    "Si estas bloqueado completamente, te contactamos para guiarte paso a paso",
  ],
  computer: [
    "Windows: Reinicia y pulsa Shift+Reiniciar para entrar en modo recuperacion",
    "Mac: Reinicia manteniendo Cmd+R para entrar en Utilidades",
    "Si tienes otro usuario admin, puedes cambiar la contrasena desde ahi",
    "Te contactamos para guiarte con el metodo exacto para tu sistema",
  ],
  camera: [
    "Busca el boton de reset fisico en la camara (normalmente un agujero pequeno)",
    "Manten pulsado 10-30 segundos con un clip mientras esta encendida",
    "Dahua: usuario admin, prueba 888888, 666666, admin123",
    "Hikvision: usuario admin, prueba 12345, abcdef",
  ],
  wallet: [
    "Busca tu frase semilla (12-24 palabras) en papeles, fotos, notas",
    "Revisa gestores de contrasenas (Chrome, Firefox, 1Password, etc)",
    "MetaMask: Ajustes > Seguridad > Revelar frase semilla (si recuerdas la contrasena)",
    "Te contactamos para analisis avanzado con diccionario de 6.5M+ combinaciones",
  ],
  email: [
    "Gmail: Usa la opcion 'Olvidaste tu contrasena' y sigue los pasos de Google",
    "Outlook: Usa account.live.com/password/reset",
    "Revisa si tienes sesion abierta en algun otro dispositivo",
    "Te guiamos paso a paso por telefono si no lo consigues",
  ],
  card: [
    "Llama a tu banco directamente - ellos pueden enviarte un nuevo PIN",
    "Usa la app del banco - muchas permiten cambiar el PIN online",
    "Ve a una oficina con tu DNI para solicitar cambio de PIN",
    "Te ayudamos a encontrar el telefono y proceso de tu banco",
  ],
  safe: [
    "Busca la combinacion por defecto de tu marca (muchas usan 0000, 1234, o similar)",
    "Mira el manual - a veces hay un master code impreso",
    "Prueba con la fecha de compra o tu fecha de nacimiento",
    "Te contactamos con nuestra base de datos de combinaciones por marca",
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, device, name, phone, email } = body;

    const serviceName = SERVICE_NAMES[type] || type;
    const steps = QUICK_STEPS[type] || ["Te contactamos en breve para ayudarte."];

    // Send to Telegram
    const msg =
      `🔓 NUEVO DESBLOQUEO - SECRETIUM UNLOCK\n\n` +
      `Servicio: ${serviceName}\n` +
      `Dispositivo: ${device}\n` +
      `Cliente: ${name}\n` +
      `Tel: ${phone}\n` +
      `Email: ${email}\n` +
      `Hora: ${new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT, text: msg }),
    }).catch(() => {});

    // Try to get quick results from VPS API for some types
    let vpsData = null;
    try {
      if (type === "wifi" && device) {
        const ssidMatch = device.match(/(?:MOVISTAR|VODAFONE|ORANGE|DIGI|MASMOVIL|JAZZTEL|PEPEPHONE)[_\s-]?\w*/i);
        if (ssidMatch) {
          const res = await fetch(`${VPS_API}/api/wifi?${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ssid: ssidMatch[0] }),
            signal: AbortSignal.timeout(5000),
          });
          vpsData = await res.json();
        }
      }
    } catch {}

    return NextResponse.json({
      success: true,
      service: serviceName,
      steps,
      message: "Solicitud recibida. Te contactamos en menos de 30 minutos.",
      vps_results: vpsData ? { total_passwords: vpsData.total } : null,
    });
  } catch {
    return NextResponse.json({ error: true, message: "Error procesando solicitud." }, { status: 500 });
  }
}
