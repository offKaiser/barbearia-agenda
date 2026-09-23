(() => {
  const brand = window.BusinessBrand || {};
  const key = brand.storageKey || "agenda-demo";
  const defaults = {
    services: brand.defaultServices || [],
    schedule: { 0: null, 1: null, 2: { open: "09:00", close: "20:00", breakStart: "", breakEnd: "" }, 3: { open: "09:00", close: "20:00", breakStart: "", breakEnd: "" }, 4: { open: "09:00", close: "20:00", breakStart: "", breakEnd: "" }, 5: { open: "09:00", close: "20:00", breakStart: "", breakEnd: "" }, 6: { open: "09:00", close: "17:00", breakStart: "", breakEnd: "" }, overrides: {} },
    bookings: [],
  };
  function read() { try { return { ...defaults, ...JSON.parse(localStorage.getItem(key) || "{}") }; } catch { return structuredClone(defaults); } }
  function write(data) { localStorage.setItem(key, JSON.stringify(data)); }
  function minutes(value) { const [hour, minute] = value.split(":").map(Number); return hour * 60 + minute; }
  function time(value) { return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`; }
  function service(id) { return read().services.find((item) => item.id === id && item.active); }
  function available(date, serviceId) {
    const data = read(), selected = service(serviceId), override = data.schedule.overrides?.[date], day = new Date(`${date}T12:00:00`).getDay(), rawHours = override?.closed ? null : override || data.schedule[day];
    if (!selected || !rawHours) return [];
    const hours = Array.isArray(rawHours) ? { open: rawHours[0], close: rawHours[1] } : rawHours, open = minutes(hours.open), close = minutes(hours.close), pauseStart = hours.breakStart ? minutes(hours.breakStart) : null, pauseEnd = hours.breakEnd ? minutes(hours.breakEnd) : null, bookings = data.bookings.filter((item) => item.date === date && !["cancelado", "falta"].includes(item.status)), result = [];
    for (let start = open; start + selected.duration <= close; start += 15) {
      const end = start + selected.duration;
      const hitsPause = pauseStart !== null && start < pauseEnd && end > pauseStart;
      if (!hitsPause && !bookings.some((item) => start < minutes(item.time) + item.duration && end > minutes(item.time))) result.push(time(start));
    }
    return result;
  }
  window.DemoStore = {
    getServices: () => read().services.filter((item) => item.active), getAllServices: () => read().services,
    saveServices(services) { const data = read(); data.services = services; write(data); }, getSchedule: () => read().schedule,
    saveSchedule(schedule) { const data = read(); data.schedule = schedule; write(data); }, getBookings: () => read().bookings, available,
    createBooking(data) {
      const selected = service(data.serviceId);
      const name = String(data.name || "").trim(), phone = String(data.phone || "").replace(/\D/g, "");
      if (name.length < 2 || !/^\d{10,15}$/.test(phone) || data.policyAccepted !== true) throw new Error("Confira nome, WhatsApp e aceite da politica.");
      if (!selected || !available(data.date, data.serviceId).includes(data.time)) throw new Error("Horario indisponivel. Escolha outro.");
      const prefix = String(brand.initials || "AG").replace(/\W/g, "").toUpperCase().slice(0, 4) || "AG";
      const store = read(), booking = { code: `${prefix}-${Date.now().toString().slice(-7)}-${Math.floor(Math.random() * 90 + 10)}`, name, phone, service: selected.name, serviceId: selected.id, duration: selected.duration, price: selected.price, date: data.date, time: data.time, status: "aguardando_pix", payment_status: "aguardando", payment_amount: Number(brand.depositCents) || 0, payment_reference: `PIX-DEMO-${Date.now().toString().slice(-6)}` };
      store.bookings.push(booking); write(store); return booking;
    },
    updateBooking(code, changes) { const data = read(), booking = data.bookings.find((item) => item.code === code); if (!booking) return false; Object.assign(booking, changes); write(data); return true; },
  };
})();
