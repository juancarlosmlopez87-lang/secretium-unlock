"use client";
import { useState, useEffect, useRef } from "react";

/* ============================================================
   SECRETIUM UNLOCK — Franchise Landing + Online Unlock Service
   ============================================================ */

const SERVICES = [
  { id: "wifi", icon: "📡", name: "WiFi / Router", price: 29.99, success: "99%", time: "1-3 min", desc: "Recupera la clave de tu WiFi o router. Movistar, Vodafone, Orange, Digi. Reset + claves de fabrica.", online: true },
  { id: "phone", icon: "📱", name: "Movil / Tablet", price: 79.99, success: "90%+", time: "5-15 min", desc: "Desbloquea Android o iPhone. Samsung Find My, Google Find My, factory reset. Sin perder datos si es posible.", online: true },
  { id: "computer", icon: "💻", name: "Ordenador", price: 59.99, success: "99%", time: "5-15 min", desc: "Windows y Mac. Kit USB profesional que resetea la contrasena sin perder NINGUN dato. 100% seguro.", online: true },
  { id: "camera", icon: "📹", name: "Camara / DVR", price: 49.99, success: "99%", time: "2-10 min", desc: "Dahua, Hikvision, Reolink, TP-Link. Reset fisico + herramientas oficiales del fabricante.", online: true },
  { id: "wallet", icon: "🪙", name: "Wallet Crypto", price: 149.99, success: "50-80%", time: "5 min - 24h", desc: "Bitcoin, Ethereum, MetaMask, Exodus, Ledger. Recuperacion por frase semilla + contrasenas guardadas.", online: false },
  { id: "email", icon: "📧", name: "Email / Cuentas", price: 19.99, success: "85%+", time: "5-15 min", desc: "Gmail, Outlook, Yahoo, iCloud. Recuperacion oficial + contrasenas guardadas en navegador. Rapido.", online: true },
  { id: "card", icon: "💳", name: "Tarjeta / PIN", price: 14.99, success: "100%", time: "5 min", desc: "Recupera el PIN de tu tarjeta desde la app del banco o llamando. BBVA, CaixaBank, Santander y mas.", online: true },
  { id: "safe", icon: "🔐", name: "Caja Fuerte", price: 39.99, success: "80%+", time: "10-60 min", desc: "Cajas fuertes electronicas. Codigos de fabrica + llave de emergencia. Arregui, Yale, BTV y mas.", online: false },
  { id: "lock", icon: "🚪", name: "Cerradura Digital", price: 44.99, success: "90%+", time: "5-15 min", desc: "Yale, Samsung, Nuki y mas. Reset de codigo, pila de emergencia, llave fisica.", online: false },
];

const STORE_PRODUCTS = [
  { cat: "Accesorios Movil", items: ["Fundas premium", "Protectores pantalla", "Cargadores rapidos", "Cables USB-C/Lightning", "Powerbanks"], margin: "40-60%" },
  { cat: "Seguridad", items: ["Camaras WiFi", "Cerraduras inteligentes", "Alarmas hogar", "Cajas fuertes digitales", "Candados Bluetooth"], margin: "30-50%" },
  { cat: "Smart Home", items: ["Alexa / Google Home", "Bombillas inteligentes", "Enchufes WiFi", "Sensores movimiento", "Timbres con camara"], margin: "25-40%" },
  { cat: "Recuperacion", items: ["USBs de rescate", "Discos duros externos", "Lectores de tarjetas", "Kits reparacion movil", "Cables OTG"], margin: "50-70%" },
  { cat: "Software", items: ["Antivirus (licencias)", "VPN premium", "Almacenamiento nube", "Office 365", "Apps de seguridad"], margin: "60-80%" },
  { cat: "Formacion", items: ["Cursos ciberseguridad", "Talleres desbloqueo", "Certificaciones", "Manuales tecnicos", "Kits de aprendizaje"], margin: "80-90%" },
];

const FRANCHISE_TIERS = [
  { name: "STARTER", price: 4999, monthly: 299, desc: "Local pequeno o corner", includes: ["Software completo", "6.5M+ diccionarios", "Formacion inicial", "Documentos legales", "Soporte email"], revenue: "3.000-5.000" },
  { name: "PRO", price: 9999, monthly: 499, desc: "Local propio 30-60m2", includes: ["Todo de STARTER", "Diseno de tienda", "Marketing local", "Punto de venta", "Stock inicial productos", "Soporte prioritario"], revenue: "5.000-10.000", popular: true },
  { name: "MASTER", price: 24999, monthly: 799, desc: "Local premium + zona exclusiva", includes: ["Todo de PRO", "Exclusividad territorial", "Web propia", "Campanas Google/Meta", "Formacion avanzada", "Franquiciados bajo tu zona", "Soporte 24/7"], revenue: "10.000-25.000" },
];

const STATS = [
  { label: "Dispositivos desbloqueados", value: 12847, suffix: "+" },
  { label: "Diccionarios de contrasenas", value: 6500000, suffix: "+" },
  { label: "Tasa de exito media", value: 87, suffix: "%" },
  { label: "Clientes satisfechos", value: 4200, suffix: "+" },
];

const FAQS = [
  { q: "Es legal desbloquear dispositivos?", a: "Si, 100% legal. Siempre con autorizacion del propietario. Funcionamos como un cerrajero digital: el dueno demuestra que es suyo y firmamos una autorizacion. Empresas como iMyFone o Tenorshare llevan anos haciendo esto legalmente." },
  { q: "Que pasa si no tengo factura ni papeles?", a: "No pasa nada. Tenemos un sistema de 4 niveles de verificacion. Para personas sin documentos (como mayores), aceptamos foto con el dispositivo, un testigo, o una declaracion jurada. Queremos ayudar a la gente de buena fe." },
  { q: "Cuanto tarda el desbloqueo?", a: "Depende del dispositivo. Un WiFi puede ser 1 minuto, un movil 15-60 minutos, un wallet crypto puede tardar horas. Te damos estimacion antes de empezar y solo cobras si funciona." },
  { q: "Puedo hacerlo online desde casa?", a: "Si! Muchos servicios se pueden hacer online. Entras en la web, describes tu problema, te damos las instrucciones paso a paso o lo hacemos remotamente. Los que requieren acceso fisico se hacen en tienda." },
  { q: "Cuanto cuesta abrir una franquicia?", a: "Desde 4.999EUR la version STARTER. La inversion se recupera en 2-3 meses con solo 3-4 desbloqueos al dia. No necesitas conocimientos tecnicos, nosotros te formamos." },
  { q: "Necesito saber de informatica?", a: "No. Nuestro software hace todo automaticamente. Tu solo sigues los pasos en pantalla. Damos formacion completa de 2 semanas y soporte continuo." },
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = end / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  const display = end >= 1000000 ? `${(count / 1000000).toFixed(1)}M` : end >= 1000 ? `${(count / 1000).toFixed(count >= end ? 0 : 1)}K` : count.toString();
  return <div ref={ref} className="counter text-4xl md:text-5xl font-black gradient-text">{display}{suffix}</div>;
}

export default function Home() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [showUnlock, setShowUnlock] = useState(false);
  const [unlockForm, setUnlockForm] = useState({ type: "wifi", device: "", name: "", phone: "", email: "" });
  const [unlockResult, setUnlockResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showFranchise, setShowFranchise] = useState(false);
  const [franchiseForm, setFranchiseForm] = useState({ name: "", phone: "", email: "", city: "", investment: "" });
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  const handleUnlock = async () => {
    setLoading(true);
    try {
      // Smart unlock: detecta modelo y genera plan personalizado
      const [smartRes, standardRes] = await Promise.all([
        fetch("/api/smart-unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(unlockForm),
        }).catch(() => null),
        fetch("/api/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(unlockForm),
        }),
      ]);
      const smartData = smartRes ? await smartRes.json().catch(() => null) : null;
      const standardData = await standardRes.json();

      // Merge: smart plan + standard methods
      setUnlockResult({
        ...standardData,
        smart: smartData?.plan || null,
      });
    } catch { setUnlockResult({ error: true, message: "Error de conexion. Intentalo de nuevo." }); }
    setLoading(false);
  };

  const handleFranchise = async () => {
    setLoading(true);
    try {
      await fetch("/api/franchise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(franchiseForm),
      });
      setSent(true);
    } catch {}
    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔓</span>
            <span className="text-xl font-black text-white">SECRETIUM <span className="text-brand-500">UNLOCK</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#servicios" className="hover:text-white transition">Servicios</a>
            <a href="#online" className="hover:text-white transition">Desbloqueo Online</a>
            <a href="#tienda" className="hover:text-white transition">Tienda</a>
            <a href="#franquicia" className="hover:text-white transition">Franquicia</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>
          <button onClick={() => setShowUnlock(true)} className="bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition">
            Desbloquear Ahora
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-4 hero-grid overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-600/10 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-500/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-success rounded-full pulse-dot" />
            <span className="text-brand-400 text-sm font-medium">Sistema activo — 6.5M+ contrasenas en base de datos</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">
            Desbloquea <span className="gradient-text">cualquier dispositivo</span><br />
            de forma legal y rapida
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Moviles, WiFi, ordenadores, camaras, wallets, cajas fuertes.
            El cerrajero digital #1 de Espana. Servicio presencial y online.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button onClick={() => setShowUnlock(true)} className="btn-primary text-lg">
              🔓 Desbloquear Ahora — Online
            </button>
            <a href="#franquicia" className="btn-success text-lg text-center">
              🏪 Abrir Franquicia — desde 4.999EUR
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="card-glass rounded-2xl p-4">
                <Counter end={s.value} suffix={s.suffix} />
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-white">Nuestros <span className="gradient-text">Servicios</span></h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">9 servicios profesionales de desbloqueo. Presencial y online. Siempre con autorizacion del propietario.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((s) => (
              <div key={s.id} onClick={() => setActiveService(activeService === s.id ? null : s.id)}
                className={`card-glass rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${activeService === s.id ? "glow-blue border-brand-500/30" : ""}`}>
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="text-lg font-bold text-white mb-1">{s.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-black text-brand-400">{s.price}EUR</span>
                  {s.online && <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">ONLINE</span>}
                </div>
                <p className="text-sm text-gray-400 mb-3">{s.desc}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Exito: {s.success}</span>
                  <span>{s.time}</span>
                </div>
                {activeService === s.id && (
                  <button onClick={(e) => { e.stopPropagation(); setUnlockForm({ ...unlockForm, type: s.id }); setShowUnlock(true); }}
                    className="mt-4 w-full bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold py-2 rounded-lg transition">
                    Solicitar Desbloqueo
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-20 px-4 bg-dark-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-white">Como <span className="gradient-text">Funciona</span></h2>
          <p className="text-center text-gray-400 mb-12">4 pasos simples. Sin complicaciones.</p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", icon: "📋", title: "Describe tu problema", desc: "Dinos que dispositivo tienes bloqueado y que ha pasado" },
              { step: "2", icon: "🪪", title: "Verificamos propiedad", desc: "DNI, foto con el dispositivo, o declaracion jurada. Flexible para todos" },
              { step: "3", icon: "⚡", title: "Desbloqueamos", desc: "Instrucciones al instante + soporte remoto si necesitas ayuda" },
              { step: "4", icon: "✅", title: "Acceso recuperado!", desc: "Solo pagas si funciona. Te damos la clave o desbloqueamos el dispositivo" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-2xl mx-auto mb-4 float">
                  {s.icon}
                </div>
                <div className="text-brand-400 text-sm font-bold mb-1">PASO {s.step}</div>
                <h3 className="text-white font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFICACION - PARA TODOS */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-white">Verificacion <span className="gradient-text">Para Todos</span></h2>
          <p className="text-center text-gray-400 mb-12">No importa tu situacion. Tenemos una solucion para verificar que el dispositivo es tuyo.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { level: "FULL", color: "from-green-500 to-emerald-400", icon: "🛡️", title: "Verificacion Completa", desc: "DNI + factura o numero de serie", who: "Tienes todos los papeles" },
              { level: "STANDARD", color: "from-blue-500 to-cyan-400", icon: "🪪", title: "Solo DNI", desc: "Presentas tu documento de identidad", who: "No encuentras la factura" },
              { level: "PHOTO", color: "from-purple-500 to-pink-400", icon: "📸", title: "Foto con Dispositivo", desc: "Te haces una foto sosteniendo el aparato", who: "No llevas el DNI encima" },
              { level: "DECLARATION", color: "from-amber-500 to-orange-400", icon: "✍️", title: "Declaracion Jurada", desc: "Firmas que es tuyo bajo tu responsabilidad", who: "Mayores, sin papeles, urgencias" },
            ].map((v) => (
              <div key={v.level} className="card-glass rounded-2xl p-6">
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${v.color} text-white text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                  {v.icon} {v.level}
                </div>
                <h3 className="text-white font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{v.desc}</p>
                <p className="text-xs text-gray-500 italic">Ideal si: {v.who}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 card-glass rounded-2xl p-6 border border-amber-500/20">
            <div className="flex items-start gap-4">
              <span className="text-4xl">👴👵</span>
              <div>
                <h3 className="text-amber-400 font-bold text-lg mb-2">Atencion Especial para Mayores — 20% Descuento</h3>
                <p className="text-gray-400 text-sm">Sabemos que muchas personas mayores no tienen facturas ni conocimientos tecnicos. Por eso ofrecemos verificacion flexible: un familiar como testigo, una foto antigua donde aparezca el aparato en su casa, o simplemente su palabra con una declaracion firmada. Queremos ayudar a la gente de buena fe.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIENDA FISICA */}
      <section id="tienda" className="py-20 px-4 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-white">La Tienda del <span className="gradient-text">Futuro</span></h2>
          <p className="text-center text-gray-400 mb-4 max-w-2xl mx-auto">No es una tienda de informatica vieja. Es un espacio tecnologico premium donde la gente viene a resolver problemas y descubrir productos.</p>
          <p className="text-center text-brand-400 font-bold mb-12">Diseno Apple Store: minimalista, limpio, con pantallas y luz LED azul</p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "🖥️", title: "Zona Desbloqueo", desc: "Mostrador principal con pantallas. El cliente ve en tiempo real como trabajamos. Experiencia transparente." },
              { icon: "🛒", title: "Zona Productos", desc: "Estanterias iluminadas con accesorios, seguridad, smart home. Productos con margen del 30-80%." },
              { icon: "🎓", title: "Zona Formacion", desc: "Pantalla grande para talleres. Cursos de ciberseguridad, uso de moviles para mayores, proteccion digital." },
            ].map((z, i) => (
              <div key={i} className="card-glass rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">{z.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{z.title}</h3>
                <p className="text-sm text-gray-400">{z.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-white text-center mb-8">Productos en Tienda — 6 Categorias</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STORE_PRODUCTS.map((cat, i) => (
              <div key={i} className="card-glass rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-bold">{cat.cat}</h4>
                  <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">Margen: {cat.margin}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, j) => (
                    <span key={j} className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded-lg">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRANQUICIA */}
      <section id="franquicia" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-white">Abre tu <span className="gradient-text">Franquicia</span></h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">El negocio de desbloqueo esta creciendo. 50 millones de personas olvidan contrasenas cada ano solo en Espana. Se el primero en tu zona.</p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {FRANCHISE_TIERS.map((tier) => (
              <div key={tier.name} className={`card-glass rounded-2xl p-8 relative ${tier.popular ? "glow-blue border-brand-500/30 scale-105" : ""}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MAS POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-black text-white mb-1">{tier.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{tier.desc}</p>
                <div className="mb-1">
                  <span className="text-4xl font-black text-brand-400">{tier.price.toLocaleString()}EUR</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">+ {tier.monthly}EUR/mes</p>
                <ul className="space-y-2 mb-6">
                  {tier.includes.map((inc, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-success">✓</span> {inc}
                    </li>
                  ))}
                </ul>
                <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
                  <p className="text-success text-sm font-bold">Ingresos estimados: {tier.revenue}EUR/mes</p>
                </div>
                <button onClick={() => { setFranchiseForm({ ...franchiseForm, investment: tier.name }); setShowFranchise(true); }}
                  className={`w-full font-bold py-3 rounded-xl transition ${tier.popular ? "bg-brand-600 hover:bg-brand-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}>
                  Solicitar Informacion
                </button>
              </div>
            ))}
          </div>

          <div className="card-glass rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Por que SECRETIUM UNLOCK?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Recuperacion en 2-3 meses",
                "No necesitas experiencia tecnica",
                "Software propio con 6.5M+ contrasenas",
                "Formacion completa incluida",
                "Mercado en crecimiento constante",
                "Multiples fuentes de ingresos",
                "Soporte continuo del equipo central",
                "Exclusividad territorial disponible",
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-brand-400 font-bold">→</span> {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NUMEROS */}
      <section className="py-20 px-4 bg-dark-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-white">Los <span className="gradient-text">Numeros</span></h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { label: "Inversion media", value: "9.999EUR", sub: "Plan PRO" },
              { label: "Facturacion mensual", value: "5-10K EUR", sub: "Desde el mes 2" },
              { label: "ROI", value: "2-3 meses", sub: "Recuperas la inversion" },
              { label: "Desbloqueos/dia", value: "5-15", sub: "Media por tienda" },
              { label: "Ticket medio", value: "52EUR", sub: "Servicios + productos" },
              { label: "Margen neto", value: "60-75%", sub: "Servicio digital = alto margen" },
            ].map((n, i) => (
              <div key={i} className="card-glass rounded-xl p-6 text-center">
                <div className="text-3xl font-black text-brand-400 mb-1">{n.value}</div>
                <div className="text-white font-bold text-sm">{n.label}</div>
                <div className="text-xs text-gray-500">{n.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-white">Preguntas <span className="gradient-text">Frecuentes</span></h2>
          <div className="mt-12 space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="card-glass rounded-xl overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-white font-bold pr-4">{faq.q}</span>
                  <span className="text-brand-400 text-xl flex-shrink-0">{faqOpen === i ? "−" : "+"}</span>
                </button>
                {faqOpen === i && <div className="px-5 pb-5 text-gray-400 text-sm">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-4 bg-gradient-to-t from-brand-600/20 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Empieza hoy</h2>
          <p className="text-gray-400 mb-8">Desbloquea tu dispositivo ahora o abre tu propia franquicia.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowUnlock(true)} className="btn-primary text-lg">🔓 Desbloquear Dispositivo</button>
            <button onClick={() => setShowFranchise(true)} className="btn-success text-lg">🏪 Quiero la Franquicia</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>SECRETIUM UNLOCK — Parte del ecosistema <span className="text-brand-400">SECRETIUM GROUP</span></div>
          <div className="flex gap-4">
            <span>Molina de Segura, Murcia</span>
            <span>+34 620 300 647</span>
          </div>
        </div>
      </footer>

      {/* MODAL: DESBLOQUEO ONLINE */}
      {showUnlock && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setShowUnlock(false); setUnlockResult(null); }}>
          <div className="bg-dark-800 rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">🔓 Desbloqueo Online</h3>
              <button onClick={() => { setShowUnlock(false); setUnlockResult(null); }} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>

            {unlockResult ? (
              <div>
                {unlockResult.error ? (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">{unlockResult.message}</div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                      <p className="text-success font-bold text-lg">Instrucciones listas!</p>
                      <p className="text-sm text-gray-400 mt-1">{unlockResult.message}</p>
                    </div>

                    {/* SMART UNLOCK — Plan personalizado si se detecto modelo */}
                    {unlockResult.smart?.detected_device && (
                      <div className="bg-brand-600/10 border border-brand-500/30 rounded-xl p-4">
                        <p className="text-brand-400 font-bold text-sm">Dispositivo detectado: {unlockResult.smart.detected_device}</p>
                        {unlockResult.smart.account_type && unlockResult.smart.account_type !== "unknown" && (
                          <p className="text-xs text-gray-400 mt-1">Tipo de cuenta: {unlockResult.smart.account_type === "microsoft" ? "Microsoft (online)" : "Local"}</p>
                        )}
                      </div>
                    )}

                    {unlockResult.smart?.steps?.map((step: any, si: number) => (
                      <div key={`smart-${si}`} className="bg-white/5 rounded-xl p-4 border border-brand-500/10">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-bold text-sm">{step.title}</h4>
                          {step.time && <span className="text-xs bg-brand-600/20 text-brand-400 px-2 py-0.5 rounded-full">{step.time}</span>}
                        </div>
                        {step.detail?.map((line: string, li: number) => (
                          <p key={li} className={`text-sm py-0.5 ${line === "" ? "h-2" : line.startsWith("  ") ? "text-gray-500 pl-4" : "text-gray-400 pl-2 border-l-2 border-brand-600/30"}`}>
                            {line}
                          </p>
                        ))}
                      </div>
                    ))}

                    {/* METODOS GENERALES (si no hubo smart match) */}
                    {unlockResult.result?.estimated_time && !(unlockResult.smart?.steps?.length > 1) && (
                      <div className="flex gap-3">
                        <div className="bg-brand-600/10 border border-brand-500/20 rounded-lg px-3 py-2 text-center flex-1">
                          <p className="text-brand-400 font-bold text-sm">{unlockResult.result.estimated_time}</p>
                          <p className="text-xs text-gray-500">Tiempo estimado</p>
                        </div>
                        {unlockResult.result.data_safe !== undefined && (
                          <div className={`${unlockResult.result.data_safe ? "bg-green-500/10 border-green-500/20" : "bg-amber-500/10 border-amber-500/20"} border rounded-lg px-3 py-2 text-center flex-1`}>
                            <p className={`${unlockResult.result.data_safe ? "text-green-400" : "text-amber-400"} font-bold text-sm`}>{unlockResult.result.data_safe ? "Datos seguros" : "Posible perdida"}</p>
                            <p className="text-xs text-gray-500">Datos</p>
                          </div>
                        )}
                      </div>
                    )}

                    {unlockResult.result?.warning && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                        <p className="text-amber-400 text-sm font-bold">Aviso importante</p>
                        <p className="text-amber-300/80 text-sm mt-1">{unlockResult.result.warning}</p>
                      </div>
                    )}

                    {unlockResult.result?.methods?.map((method: any, mi: number) => (
                      <div key={mi} className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-bold text-sm">Metodo {mi + 1}: {method.name}</h4>
                          <div className="flex gap-2">
                            {method.time && <span className="text-xs bg-brand-600/20 text-brand-400 px-2 py-0.5 rounded-full">{method.time}</span>}
                            {method.data_loss === false && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Sin perdida</span>}
                            {method.data_loss === true && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Borra datos</span>}
                          </div>
                        </div>
                        {method.steps?.map((step: string, si: number) => (
                          <p key={si} className="text-sm text-gray-400 py-0.5 pl-2 border-l-2 border-brand-600/30 mb-1">{step}</p>
                        ))}
                        {method.requirement && (
                          <p className="text-xs text-amber-400 mt-2 italic">Requisito: {method.requirement}</p>
                        )}
                      </div>
                    ))}

                    {unlockResult.result?.important && (
                      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{unlockResult.result.important}</p>
                      </div>
                    )}

                    {unlockResult.result?.boot_keys && (
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-white font-bold text-sm mb-2">Tecla Boot Menu por marca:</p>
                        <div className="grid grid-cols-2 gap-1">
                          {Object.entries(unlockResult.result.boot_keys).map(([brand, key]: [string, any]) => (
                            <p key={brand} className="text-xs text-gray-400"><span className="text-gray-300">{brand}:</span> {key}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {unlockResult.result?.default_admin && (
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-white font-bold text-sm mb-2">Panel admin del router:</p>
                        {Object.entries(unlockResult.result.default_admin).map(([isp, info]: [string, any]) => (
                          <p key={isp} className="text-xs text-gray-400"><span className="text-gray-300">{isp}:</span> {info.url} — {info.user} / {info.pass}</p>
                        ))}
                      </div>
                    )}

                    {unlockResult.personalized?.personalized_passwords && (
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-white font-bold text-sm mb-2">Contrasenas personalizadas ({unlockResult.personalized.total_generated} generadas):</p>
                        <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                          {unlockResult.personalized.personalized_passwords.map((pw: string, i: number) => (
                            <p key={i} className="text-xs text-brand-300 font-mono">{pw}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-brand-600/10 border border-brand-500/20 rounded-xl p-4 text-center">
                      <p className="text-brand-400 font-bold text-sm">Necesitas ayuda? Te guiamos por videollamada</p>
                      <p className="text-xs text-gray-400 mt-1">Whatsapp: +34 620 300 647 — Respondemos en minutos</p>
                    </div>
                  </div>
                )}
                <button onClick={() => { setShowUnlock(false); setUnlockResult(null); }}
                  className="mt-4 w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition">Cerrar</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Tipo de dispositivo</label>
                  <select value={unlockForm.type} onChange={(e) => setUnlockForm({ ...unlockForm, type: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none">
                    {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.name} — {s.price}EUR</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Describe el dispositivo y el problema</label>
                  <textarea value={unlockForm.device} onChange={(e) => setUnlockForm({ ...unlockForm, device: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none h-24 resize-none"
                    placeholder="Ej: Router Movistar HGU, no recuerdo la clave WiFi que puse..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Tu nombre</label>
                    <input value={unlockForm.name} onChange={(e) => setUnlockForm({ ...unlockForm, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none" placeholder="Nombre completo" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Telefono</label>
                    <input value={unlockForm.phone} onChange={(e) => setUnlockForm({ ...unlockForm, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none" placeholder="+34 ..." />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Email</label>
                  <input value={unlockForm.email} onChange={(e) => setUnlockForm({ ...unlockForm, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none" placeholder="tu@email.com" />
                </div>
                <button onClick={handleUnlock} disabled={loading || !unlockForm.device || !unlockForm.name}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Procesando..." : "🔓 Solicitar Desbloqueo"}
                </button>
                <p className="text-xs text-gray-500 text-center">Solo pagas si conseguimos desbloquearlo. 100% legal con autorizacion.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: FRANQUICIA */}
      {showFranchise && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setShowFranchise(false); setSent(false); }}>
          <div className="bg-dark-800 rounded-2xl p-6 md:p-8 max-w-lg w-full border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">🏪 Solicitar Franquicia</h3>
              <button onClick={() => { setShowFranchise(false); setSent(false); }} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>

            {sent ? (
              <div>
                <div className="bg-success/10 border border-success/20 rounded-xl p-6 text-center">
                  <p className="text-success text-3xl mb-2">✅</p>
                  <p className="text-success font-bold text-lg">Solicitud enviada!</p>
                  <p className="text-gray-400 text-sm mt-2">Te contactaremos en 24h para explicarte todo sin compromiso.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {franchiseForm.investment && (
                  <div className="bg-brand-600/10 border border-brand-500/20 rounded-xl p-3 text-center">
                    <span className="text-brand-400 font-bold">Plan seleccionado: {franchiseForm.investment}</span>
                  </div>
                )}
                <input value={franchiseForm.name} onChange={(e) => setFranchiseForm({ ...franchiseForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none" placeholder="Nombre completo" />
                <input value={franchiseForm.phone} onChange={(e) => setFranchiseForm({ ...franchiseForm, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none" placeholder="Telefono" />
                <input value={franchiseForm.email} onChange={(e) => setFranchiseForm({ ...franchiseForm, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none" placeholder="Email" />
                <input value={franchiseForm.city} onChange={(e) => setFranchiseForm({ ...franchiseForm, city: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none" placeholder="Ciudad donde abririas la tienda" />
                <button onClick={handleFranchise} disabled={loading || !franchiseForm.name || !franchiseForm.phone}
                  className="w-full btn-success disabled:opacity-50">
                  {loading ? "Enviando..." : "Solicitar Informacion Sin Compromiso"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
