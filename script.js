const WHATSAPP_BARBEIRO = "5511999999999";
let demoMode = location.hostname.endsWith("github.io") || location.protocol === "file:";
let shop = null;
let services = [];
const state = { service: null, date: null, time: null };
const serviceList = document.querySelector("#service-list"), serviceSelect = document.querySelector("#service-select"), dateList = document.querySelector("#date-list"), timeList = document.querySelector("#time-list"), summary = document.querySelector("#booking-summary");
const money = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dateValue = (date) => date.toISOString().slice(0, 10);
const dateText = (date) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date).replace(".", "");
function dates() { const list = []; const today = new Date(); for (let i = 1; list.length < 6; i += 1) { const date = new Date(today); date.setDate(today.getDate() + i); if (![0, 1].includes(date.getDay())) list.push(date); } return list; }
async function render() {
  serviceSelect.innerHTML = services.map((s) => `<option value="${s.id}">${s.name} - ${money(s.price)}</option>`).join(""); serviceSelect.value = state.service.id;
  serviceList.innerHTML = services.map((s) => `<button class="service-card ${s.id === state.service.id ? "selected" : ""}" type="button" data-service="${s.id}"><span class="service-icon"><i data-lucide="${s.id === "corte" ? "scissors" : s.id === "barba" ? "sparkles" : "badge-check"}"></i></span><h3>${s.name}</h3><p>${s.description || "Atendimento com hora marcada e atencao aos detalhes."}</p><span class="service-meta"><span>${s.duration} min</span><span>${money(s.price)}</span></span></button>`).join("");
  const options = dates(); state.date ??= options[0]; dateList.innerHTML = options.map((date) => `<button class="date-option ${dateValue(date) === dateValue(state.date) ? "selected" : ""}" type="button" data-date="${dateValue(date)}"><small>${new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date)}</small>${dateText(date)}</button>`).join("");
  timeList.innerHTML = "<span class=loading>Consultando agenda...</span>"; const times = demoMode ? DemoStore.available(dateValue(state.date), state.service.id) : (await (await fetch(`/api/availability?date=${dateValue(state.date)}&serviceId=${state.service.id}`)).json()).times || []; if (!times.includes(state.time)) state.time = null;
  timeList.innerHTML = times.length ? times.map((time) => `<button class="time-option ${time === state.time ? "selected" : ""}" type="button" data-time="${time}">${time}</button>`).join("") : "<span class=loading>Nenhum horario livre nesta data.</span>";
  summary.textContent = state.time ? `${state.service.name} em ${dateText(state.date)} as ${state.time} - ${money(state.service.price)}` : `${state.service.name} - ${state.service.duration} min. Selecione um horario.`; lucide.createIcons();
}
serviceList.addEventListener("click", async (event) => { const item = event.target.closest("[data-service]"); if (item) { state.service = services.find((s) => s.id === item.dataset.service); state.time = null; await render(); } });
serviceSelect.addEventListener("change", async () => { state.service = services.find((s) => s.id === serviceSelect.value); state.time = null; await render(); });
dateList.addEventListener("click", async (event) => { const item = event.target.closest("[data-date]"); if (item) { state.date = new Date(`${item.dataset.date}T12:00:00`); state.time = null; await render(); } });
timeList.addEventListener("click", (event) => { const item = event.target.closest("[data-time]"); if (item) { state.time = item.dataset.time; render(); } });
document.querySelector("#booking-form").addEventListener("submit", async (event) => { event.preventDefault(); if (!state.time) { summary.textContent = "Escolha uma data e horario antes de continuar."; return; } const form = new FormData(event.currentTarget), payload = { name: form.get("name"), phone: form.get("phone"), serviceId: state.service.id, date: dateValue(state.date), time: state.time, policyAccepted: true }; let data, response; try { if (demoMode) data = { booking: DemoStore.createBooking(payload), pix: { pixRecipient: "Barbearia Norte", pixKey: "barbearia.norte@exemplo.com", depositCents: 2000, whatsapp: WHATSAPP_BARBEIRO } }; else { response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); data = await response.json(); if (!response.ok) throw new Error(data.error); } } catch (error) { summary.textContent = error.message; await render(); return; } const booking = data.booking; shop = data.pix; document.querySelector("#success-message").textContent = `Reserva ${booking.code} criada para ${dateText(state.date)} as ${booking.time}. Faca o sinal para o barbeiro confirmar.`; document.querySelector("#pix-details").hidden = false; document.querySelector("#pix-value").textContent = money(shop.depositCents / 100); document.querySelector("#pix-recipient").textContent = `Recebedor: ${shop.pixRecipient}`; document.querySelector("#pix-key").textContent = shop.pixKey; document.querySelector("#success-dialog").showModal(); event.currentTarget.reset(); state.time = null; await render(); });
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => document.querySelector("#success-dialog").close()));
document.querySelector("#copy-pix").addEventListener("click", async (event) => { await navigator.clipboard.writeText(shop.pixKey); event.currentTarget.textContent = "Chave copiada"; event.currentTarget.classList.add("copied"); });
document.querySelector("#send-proof").addEventListener("click", () => { const code = document.querySelector("#success-message").textContent.match(/BN-[\d-]+/)?.[0] || ""; const message = encodeURIComponent(`Ola! Envio o comprovante do sinal da reserva ${code}.`); window.open(`https://wa.me/${shop?.whatsapp || WHATSAPP_BARBEIRO}?text=${message}`, "_blank", "noopener"); });
Promise.all([fetch("/api/services").then((response) => response.json()), fetch("/api/settings").then((response) => response.json())]).then(async ([serviceData, settings]) => { services = serviceData; shop = settings; state.service = services[0]; await render(); }).catch(async () => { demoMode = true; services = DemoStore.getServices(); shop = { whatsapp: WHATSAPP_BARBEIRO }; if (!services.length) { summary.textContent = "Nenhum servico esta disponivel."; return; } state.service = services[0]; await render(); });

const reservationStatuses = { aguardando_pix: "Aguardando sinal PIX", pendente: "Pendente", confirmado: "Confirmada", concluido: "Concluida", falta: "Falta registrada", cancelado: "Cancelada" };
let viewedReservation = null;
const digits = (value) => String(value).replace(/\D/g, "");
function renderReservation(booking) {
  const details = document.querySelector("#reservation-details"), feedback = document.querySelector("#lookup-feedback"), cancel = document.querySelector("#cancel-reservation");
  viewedReservation = booking; details.hidden = false; document.querySelector("#reservation-status").textContent = reservationStatuses[booking.status] || booking.status; document.querySelector("#reservation-service").textContent = booking.service; document.querySelector("#reservation-date").textContent = `${booking.date.split("-").reverse().join("/")} as ${booking.time}`; document.querySelector("#reservation-code").textContent = `Codigo: ${booking.code}`;
  const appointment = new Date(`${booking.date}T${booking.time}:00`), canCancel = !["cancelado", "concluido", "falta"].includes(booking.status) && appointment.getTime() - Date.now() >= 2 * 60 * 60 * 1000;
  cancel.disabled = !canCancel; cancel.textContent = booking.status === "cancelado" ? "Reserva cancelada" : canCancel ? "Cancelar reserva" : "Cancelamento indisponivel";
  feedback.textContent = canCancel ? "Cancelamentos sao permitidos com pelo menos 2 horas de antecedencia." : "Esta reserva nao pode mais ser cancelada online."; lucide.createIcons();
}
document.querySelector("#reservation-lookup").addEventListener("submit", (event) => {
  event.preventDefault(); const feedback = document.querySelector("#lookup-feedback"), code = document.querySelector("#lookup-code").value.trim().toUpperCase(), phone = digits(document.querySelector("#lookup-phone").value);
  if (!demoMode) { feedback.textContent = "A consulta do cliente esta disponivel na demonstracao online."; return; }
  const booking = DemoStore.getBookings().find((item) => item.code === code && digits(item.phone) === phone);
  if (!booking) { document.querySelector("#reservation-details").hidden = true; feedback.textContent = "Nao encontramos uma reserva com estes dados."; return; } renderReservation(booking);
});
document.querySelector("#cancel-reservation").addEventListener("click", (event) => {
  if (!viewedReservation || !demoMode || event.currentTarget.disabled) return;
  DemoStore.updateBooking(viewedReservation.code, { status: "cancelado" }); renderReservation(DemoStore.getBookings().find((item) => item.code === viewedReservation.code));
});
document.querySelector("#resend-pix").addEventListener("click", () => {
  if (!viewedReservation) return; const message = encodeURIComponent(`Ola! Gostaria de rever as instrucoes de PIX da reserva ${viewedReservation.code}.`); window.open(`https://wa.me/${shop?.whatsapp || WHATSAPP_BARBEIRO}?text=${message}`, "_blank", "noopener");
});
