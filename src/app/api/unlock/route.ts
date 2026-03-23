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

const VPS_ENDPOINTS: Record<string, string> = {
  wifi: "/api/unlock/router",
  phone: "/api/unlock/android",
  computer: "/api/unlock/windows",
  camera: "/api/crack/camera",
  wallet: "/api/unlock/wallet",
  email: "/api/suggest",
  safe: "/api/unlock/safe",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, device, name, phone, email, birth_date, pet, partner, city } = body;
    const serviceName = SERVICE_NAMES[type] || type;

    // Send to Telegram
    const msg =
      `🔓 DESBLOQUEO - SECRETIUM UNLOCK\n\n` +
      `Servicio: ${serviceName}\n` +
      `Dispositivo: ${device}\n` +
      `Cliente: ${name}\n` +
      `Tel: ${phone}\n` +
      `Email: ${email}\n` +
      `Hora: ${new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}`;

    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT, text: msg }),
    }).catch(() => {});

    // Call VPS API for real instructions
    let vpsResult = null;
    const endpoint = VPS_ENDPOINTS[type];

    try {
      if (type === "email") {
        // Personal password suggestions
        const res = await fetch(`${VPS_API}/api/suggest?${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || "",
            email: email || "",
            birth_date: birth_date || "",
            phone: phone || "",
            pet: pet || "",
            partner: partner || "",
            city: city || "",
            extra_words: device ? device.split(" ") : [],
          }),
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        vpsResult = {
          type: "passwords",
          total: data.total,
          top_passwords: data.top_50 || data.passwords?.slice(0, 50),
          instructions: [
            "Prueba estas contrasenas una a una en la pagina de login",
            "Las primeras son las mas probables (personalizadas con tus datos)",
            "Gmail/Outlook bloquean despues de ~10 intentos, espera 1h si se bloquea",
            "Revisa tambien chrome://settings/passwords en tu navegador",
          ],
        };
      } else if (type === "camera") {
        const brand = device?.toLowerCase().includes("hikvision") ? "hikvision"
          : device?.toLowerCase().includes("dahua") ? "dahua"
          : device?.toLowerCase().includes("reolink") ? "reolink"
          : device?.toLowerCase().includes("tp-link") ? "tplink" : "dahua";
        const res = await fetch(`${VPS_API}/api/crack/camera?${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand, ip: "192.168.1.101" }),
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        vpsResult = {
          type: "camera",
          passwords: data.passwords,
          total: data.total_passwords,
          users: data.common_users,
          brands: data.all_brands,
          instructions: [
            `Accede a la camara por navegador: http://IP_DE_TU_CAMARA`,
            `Prueba estos usuarios: admin, root, supervisor`,
            `Contrasenas mas comunes para ${brand}: ${(data.passwords || []).slice(0, 10).join(", ")}`,
            "Si no funciona: boton RESET fisico 15 segundos con un clip",
          ],
        };
      } else if (type === "wifi") {
        const res = await fetch(`${VPS_API}/api/unlock/router?${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand: device || "generic" }),
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        vpsResult = {
          type: "router",
          brands: data.brands,
          methods: data.methods,
          instructions: [
            "1. Mira la ETIQUETA debajo del router - tiene la clave de fabrica",
            "2. Si la cambiaste: pulsa el boton RESET del router 10-15 segundos",
            "3. Tras el reset, la clave vuelve a la de la etiqueta",
            "4. Entra en http://192.168.1.1 con admin/1234 para configurar",
            "5. Si tienes un movil conectado: Ajustes > WiFi > Compartir red",
          ],
        };
      } else if (type === "computer") {
        const res = await fetch(`${VPS_API}/api/unlock/windows?${API_KEY}`, {
          method: "GET",
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        vpsResult = {
          type: "computer",
          methods: (data.methods || []).map((m: any) => ({
            name: m.name,
            difficulty: m.difficulty,
            time: m.time,
            steps: m.steps,
          })),
          instructions: [
            "Metodo mas facil: Si usas cuenta Microsoft, ve a account.live.com/password/reset",
            "Metodo rapido: Reinicia con Shift+Reiniciar > Solucionar problemas > Opciones avanzadas",
            "Metodo seguro: Arranca desde USB Linux y usa la herramienta chntpw",
          ],
        };
      } else if (type === "phone") {
        const isIphone = device?.toLowerCase().includes("iphone") || device?.toLowerCase().includes("apple");
        const ep = isIphone ? "/api/unlock/iphone" : "/api/unlock/android";
        const res = await fetch(`${VPS_API}${ep}?${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand: device || "generic" }),
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        vpsResult = {
          type: isIphone ? "iphone" : "android",
          methods: (data.methods || []).map((m: any) => ({
            name: m.name,
            difficulty: m.difficulty,
            steps: m.steps,
          })),
          instructions: isIphone ? [
            "iPhone: Conecta a iTunes/Finder y pon en modo DFU para restaurar",
            "Si sabes tu Apple ID: usa icloud.com/find para borrar y restaurar",
            "IMPORTANTE: Siempre necesitaras el Apple ID despues de restaurar",
          ] : [
            "Android: Intenta google.com/android/find para desbloquear remotamente",
            "Samsung: findmymobile.samsung.com si tienes cuenta Samsung",
            "Factory reset: Vol Up + Power en el arranque (BORRA DATOS)",
            "Si tienes ADB activado: adb shell rm /data/system/gesture.key",
          ],
        };
      } else if (type === "safe") {
        const res = await fetch(`${VPS_API}/api/unlock/safe?${API_KEY}`, {
          method: "GET",
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        vpsResult = {
          type: "safe",
          combinations: data.default_combinations,
          generic_codes: data.generic_codes,
          instructions: [
            "Prueba los codigos por defecto de tu marca (ver lista abajo)",
            "Prueba: 0000, 1234, 9999, tu fecha de nacimiento",
            "Busca una cerradura de emergencia (llave pequena, normalmente tapada)",
            "Si nada funciona: contacta al fabricante con el numero de serie",
          ],
        };
      } else if (type === "wallet") {
        const res = await fetch(`${VPS_API}/api/unlock/wallet?${API_KEY}`, {
          method: "GET",
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        vpsResult = {
          type: "wallet",
          methods: (data.methods || []).map((m: any) => ({
            name: m.name,
            steps: m.steps,
          })),
          instructions: [
            "PRIMERO: Busca tu frase semilla (12-24 palabras) en papeles, fotos, notas",
            "Si la encuentras, importa en wallet oficial y listo",
            "Revisa contrasenas guardadas en Chrome/Firefox",
            "Ultimo recurso: ataque por diccionario con hashcat (necesita archivo del wallet)",
          ],
        };
      }
    } catch (err) {
      // VPS not reachable, use fallback
    }

    return NextResponse.json({
      success: true,
      service: serviceName,
      result: vpsResult,
      message: vpsResult
        ? "Aqui tienes las instrucciones para desbloquear tu dispositivo."
        : "Solicitud recibida. Te contactamos en menos de 30 minutos.",
    });
  } catch {
    return NextResponse.json({ error: true, message: "Error procesando solicitud." }, { status: 500 });
  }
}
