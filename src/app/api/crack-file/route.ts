import { NextRequest, NextResponse } from "next/server";

const VPS_API = "http://62.171.128.42:5571";
const API_KEY = "_key=JC2026%21grupo";
const TELEGRAM_TOKEN = "8451701836:AAHnoYbzI14jnyCVtfx05iuA_CfkYKwPtX8";
const TELEGRAM_CHAT = "1802913178";

async function notifyTelegram(hash: string, type: string) {
  const msg =
    `CRACK FILE - Nuevo trabajo\n` +
    `Tipo: ${type}\n` +
    `Hash: ${hash.substring(0, 32)}${hash.length > 32 ? "..." : ""}\n` +
    `Hora: ${new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}`;
  fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT, text: msg }),
  }).catch(() => {});
}

async function vpsFetch(path: string, options?: RequestInit) {
  const separator = path.includes("?") ? "&" : "?";
  const url = `${VPS_API}${path}${separator}${API_KEY}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`VPS error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, hash, type, job_id, personal_data } = body;

    if (!action) {
      return NextResponse.json(
        { error: true, message: "Falta el campo 'action'" },
        { status: 400 }
      );
    }

    // === CRACK: enviar hash al VPS ===
    if (action === "crack") {
      if (!hash || !type) {
        return NextResponse.json(
          { error: true, message: "Faltan campos: hash, type" },
          { status: 400 }
        );
      }

      // Telegram notification (fire and forget)
      notifyTelegram(hash, type);

      const payload: Record<string, any> = { hash, type };
      if (personal_data) payload.personal_data = personal_data;

      const data = await vpsFetch("/api/crack/hash", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return NextResponse.json({ success: true, ...data });
    }

    // === STATUS: consultar estado del job ===
    if (action === "status") {
      if (!job_id) {
        return NextResponse.json(
          { error: true, message: "Falta campo: job_id" },
          { status: 400 }
        );
      }

      const data = await vpsFetch(`/api/crack/status/${job_id}`);
      return NextResponse.json({ success: true, ...data });
    }

    // === TYPES: listar tipos soportados ===
    if (action === "types") {
      const data = await vpsFetch("/api/crack/types");
      return NextResponse.json({ success: true, ...data });
    }

    // === GUIDE: guia de extraccion ===
    if (action === "guide") {
      if (!type) {
        return NextResponse.json(
          { error: true, message: "Falta campo: type" },
          { status: 400 }
        );
      }

      const data = await vpsFetch(`/api/crack/guide/${type}`);
      return NextResponse.json({ success: true, ...data });
    }

    return NextResponse.json(
      { error: true, message: `Accion no reconocida: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: true, message: err?.message || "Error interno" },
      { status: 500 }
    );
  }
}
