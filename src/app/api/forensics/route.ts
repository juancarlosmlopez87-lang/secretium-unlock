import { NextResponse } from "next/server";

const VPS = "http://62.171.128.42:5571";
const AUTH = "Basic " + Buffer.from("secretium:JC2026!grupo").toString("base64");
const TG_BOT = "8451701836:AAHnoYbzI14jnyCVtfx05iuA_CfkYKwPtX8";
const TG_CHAT = "1802913178";

async function tg(msg: string) {
  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT, text: msg, parse_mode: "HTML" }),
    });
  } catch {}
}

async function vpsCall(path: string, method = "GET", body?: any) {
  const opts: RequestInit = {
    method,
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${VPS}${path}`, opts);
  return res.json();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "cases";

  try {
    switch (action) {
      case "cases":
        return NextResponse.json(await vpsCall("/api/forensics/cases"));
      case "report": {
        const caseId = searchParams.get("case_id") || "";
        return NextResponse.json(await vpsCall(`/api/forensics/report/${caseId}`));
      }
      case "devices":
        return NextResponse.json(await vpsCall("/api/forensics/android/devices"));
      default:
        return NextResponse.json({ error: "action: cases|report|devices" });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const action = data.action || "new_case";

  try {
    switch (action) {
      case "new_case": {
        const result = await vpsCall("/api/forensics/new_case", "POST", {
          client_name: data.client_name,
          device_description: data.device_description,
          examiner: data.examiner || "SECRETIUM",
        });
        await tg(
          `<b>FORENSICS - Nuevo caso</b>\nCliente: ${data.client_name}\nDispositivo: ${data.device_description}\nCaso: ${result.case_id}`
        );
        return NextResponse.json(result);
      }

      case "hash_identify":
        return NextResponse.json(
          await vpsCall("/api/forensics/hash/identify", "POST", { hash: data.hash })
        );

      case "hash_compute":
        return NextResponse.json(
          await vpsCall("/api/forensics/hash/compute", "POST", { text: data.text })
        );

      case "android_info":
        return NextResponse.json(
          await vpsCall("/api/forensics/android/info", "POST", {
            case_id: data.case_id,
            serial: data.serial,
          })
        );

      case "android_extract":
        return NextResponse.json(
          await vpsCall("/api/forensics/android/extract", "POST", {
            case_id: data.case_id,
            serial: data.serial,
            extract: data.extract,
          })
        );

      case "android_full":
        return NextResponse.json(
          await vpsCall("/api/forensics/android/full", "POST", {
            case_id: data.case_id,
            client_name: data.client_name,
            device: data.device,
            serial: data.serial,
          })
        );

      case "network_scan":
        return NextResponse.json(
          await vpsCall("/api/forensics/network/scan", "POST", {
            case_id: data.case_id,
            target: data.target,
            type: data.scan_type || "quick",
          })
        );

      case "sqlite_analyze":
        return NextResponse.json(
          await vpsCall("/api/forensics/sqlite/analyze", "POST", {
            case_id: data.case_id,
            db_path: data.db_path,
          })
        );

      case "sqlite_whatsapp":
        return NextResponse.json(
          await vpsCall("/api/forensics/sqlite/whatsapp", "POST", {
            case_id: data.case_id,
            db_path: data.db_path,
          })
        );

      case "sqlite_recover":
        return NextResponse.json(
          await vpsCall("/api/forensics/sqlite/recover", "POST", {
            case_id: data.case_id,
            db_path: data.db_path,
          })
        );

      case "windows_sam":
        return NextResponse.json(
          await vpsCall("/api/forensics/windows/sam", "POST", {
            case_id: data.case_id,
            sam_path: data.sam_path,
            system_path: data.system_path,
          })
        );

      case "carve":
        return NextResponse.json(
          await vpsCall("/api/forensics/carve", "POST", {
            case_id: data.case_id,
            image_path: data.image_path,
            types: data.types,
          })
        );

      default:
        return NextResponse.json({
          error: "Unknown action",
          actions: [
            "new_case", "hash_identify", "hash_compute",
            "android_info", "android_extract", "android_full",
            "network_scan", "sqlite_analyze", "sqlite_whatsapp",
            "sqlite_recover", "windows_sam", "carve",
          ],
        });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
