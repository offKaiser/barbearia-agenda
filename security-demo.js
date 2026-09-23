(() => {
  if (!location.hostname.endsWith("github.io")) return;

  const notice = document.createElement("aside");
  notice.className = "summary";
  notice.textContent = "Demonstracao de portfolio: nao informe dados reais. As interacoes desta pagina nao criam uma reserva real.";
  document.querySelector("#booking-form")?.prepend(notice);

  document.addEventListener("submit", (event) => {
    if (!event.target.matches("#booking-form, #reservation-lookup")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const output = event.target.querySelector("output") || document.querySelector("#lookup-feedback");
    if (output) output.textContent = "A versao publicada e somente demonstrativa. Use dados ficticios.";
  }, true);
})();
