import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_TOKEN = "8451701836:AAHnoYbzI14jnyCVtfx05iuA_CfkYKwPtX8";
const TELEGRAM_CHAT = "1802913178";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, city, investment } = body;

    const msg =
      `🏪 SOLICITUD FRANQUICIA - SECRETIUM UNLOCK\n\n` +
      `Nombre: ${name}\n` +
      `Tel: ${phone}\n` +
      `Email: ${email || "No proporcionado"}\n` +
      `Ciudad: ${city || "No especificada"}\n` +
      `Plan: ${investment || "Sin especificar"}\n` +
      `Hora: ${new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT, text: msg }),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
