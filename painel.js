if (!(location.hostname.endsWith("github.io") || location.protocol === "file:")) {
const statuses = { aguardando_pix: "Aguardando PIX", pendente: "Pendente", confirmado: "Confirmado", concluido: "Concluido", falta: "Falta", cancelado: "Cancelado" };
const money = (value) => (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
async function renderBookings() {
  const bookings = await fetch("/api/bookings").then((response) => response.json());
  const active = bookings.filter((booking) => !["concluido", "falta", "cancelado"].includes(booking.status));
  document.querySelector("#stats").innerHTML = `<article><span>Reservas</span><strong>${bookings.length}</strong></article><article><span>Aguardando sinal</span><strong>${bookings.filter((b) => ["pendente", "aguardando_pix"].includes(b.status)).length}</strong></article><article><span>Confirmados</span><strong>${bookings.filter((b) => b.status === "confirmado").length}</strong></article><article><span>Agenda ativa</span><strong>${active.length}</strong></article>`;
  const table = document.querySelector("#booking-table");
  if (!bookings.length) { table.innerHTML = `<div class="empty-state"><i data-lucide="calendar-days"></i><h3>Nenhuma reserva por enquanto.</h3><p>As reservas feitas pela pagina publica aparecem aqui.</p></div>`; lucide.createIcons(); return; }
  table.innerHTML = `<div class="table-head"><span>Cliente</span><span>Servico</span><span>Horario</span><span>Status</span><span>Acao</span></div>${bookings.map((booking) => `<div class="booking-row"><div><b>${booking.name}</b><small>${booking.phone}<br />${booking.code}</small></div><span>${booking.service}</span><span>${booking.date}<br /><b>${booking.time}</b></span><span class="status ${booking.status}">${statuses[booking.status]}</span><div class="payment-action"><select data-code="${booking.code}" aria-label="Atualizar status de ${booking.name}">${Object.entries(statuses).map(([value, label]) => `<option value="${value}" ${value === booking.status ? "selected" : ""}>${label}</option>`).join("")}</select>${booking.payment_status === "aguardando" ? `<button type="button" data-payment="${booking.payment_reference}">Simular PIX ${money(booking.payment_amount)}</button>` : ""}</div></div>`).join("")}`;
  lucide.createIcons();
}
async function loadSettings() {
  const settings = await fetch("/api/settings").then((response) => response.json());
  document.querySelector("#setting-whatsapp").value = settings.whatsapp;
  document.querySelector("#setting-pix-key").value = settings.pixKey;
  document.querySelector("#setting-pix-recipient").value = settings.pixRecipient;
  document.querySelector("#setting-deposit").value = settings.depositCents;
  document.querySelector("#setting-auto-reply").value = settings.autoReply;
  document.querySelector("#chatbot-preview").textContent = settings.autoReply;
}
document.querySelector("#booking-table").addEventListener("change", async (event) => { const field = event.target.closest("[data-code]"); if (!field) return; await fetch(`/api/bookings/${field.dataset.code}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: field.value }) }); renderBookings(); });
document.querySelector("#booking-table").addEventListener("click", async (event) => { const button = event.target.closest("[data-payment]"); if (!button) return; const token = document.querySelector("#admin-token").value; if (!token) { document.querySelector("#settings-feedback").textContent = "Informe o token administrativo para confirmar o PIX de teste."; return; } const response = await fetch(`/api/payments/${button.dataset.payment}/simulate-confirmation`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }); const result = await response.json(); document.querySelector("#settings-feedback").textContent = response.ok ? "PIX de teste confirmado e reserva atualizada." : result.error; renderBookings(); });
document.querySelector("#settings-form").addEventListener("submit", async (event) => {
  event.preventDefault(); const feedback = document.querySelector("#settings-feedback"); const body = { whatsapp: document.querySelector("#setting-whatsapp").value, pixKey: document.querySelector("#setting-pix-key").value, pixRecipient: document.querySelector("#setting-pix-recipient").value, depositCents: Number(document.querySelector("#setting-deposit").value), autoReply: document.querySelector("#setting-auto-reply").value };
  const response = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${document.querySelector("#admin-token").value}` }, body: JSON.stringify(body) }); const result = await response.json(); feedback.textContent = response.ok ? `Configuracoes salvas. Sinal: ${money(result.depositCents)}.` : result.error; if (response.ok) { document.querySelector("#chatbot-preview").textContent = result.autoReply; document.querySelector("#admin-token").value = ""; } });
Promise.all([renderBookings(), loadSettings()]).then(() => lucide.createIcons());
}
