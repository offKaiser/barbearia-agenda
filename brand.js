window.BusinessBrand = {
  businessName: "Barbearia Norte",
  professionalName: "Rafael Norte",
  initials: "BN",
  tagline: "Cortes com identidade",
  heroTitle: "Seu horario. Seu estilo.",
  heroDescription: "Cortes classicos e contemporaneos, barba e acabamento em um estudio feito para voce.",
  address: "Rua das Flores, 214 - Centro",
  whatsapp: "5511999999999",
  pixKey: "barbearia.norte@exemplo.com",
  depositCents: 2000,
  instagram: "@barbearianorte",
  logoUrl: "",
  heroImageUrl: "",
  colors: { primary: "#0f766e", primaryActive: "#115e59" },
  policy: { lateMinutes: 15, cancellationHours: 2, depositRequired: true },
  storageKey: "agenda-demo-barbearia-norte",
  defaultServices: [
    { id: "servico-essencial", name: "Servico essencial", description: "Atendimento personalizado com hora marcada.", duration: 45, price: 55, active: true },
    { id: "servico-completo", name: "Servico completo", description: "Uma experiencia completa para o seu momento.", duration: 75, price: 90, active: true },
  ],
};

try {
  const saved = JSON.parse(localStorage.getItem(`${window.BusinessBrand.storageKey}-brand`) || "{}");
  Object.assign(window.BusinessBrand, saved, { colors: { ...window.BusinessBrand.colors, ...saved.colors }, policy: { ...window.BusinessBrand.policy, ...saved.policy } });
} catch { /* Usa a identidade padrao quando nao houver configuracao valida. */ }

window.applyBusinessBrand = function applyBusinessBrand() {
  const brand = window.BusinessBrand;
  document.documentElement.style.setProperty("--brand-primary", brand.colors.primary);
  document.documentElement.style.setProperty("--brand-primary-active", brand.colors.primaryActive);
  document.querySelectorAll("[data-brand-name]").forEach((element) => { element.textContent = brand.businessName; });
  document.querySelectorAll("[data-brand-initials]").forEach((element) => { element.textContent = brand.initials; });
  document.querySelectorAll("[data-brand-address]").forEach((element) => { element.textContent = brand.address; });
  document.querySelectorAll("[data-brand-hero-title]").forEach((element) => { element.textContent = brand.heroTitle; });
  document.querySelectorAll("[data-brand-hero-description]").forEach((element) => { element.textContent = brand.heroDescription; });
  const heroImage = document.querySelector(".hero-image");
  if (heroImage && brand.heroImageUrl) heroImage.style.backgroundImage = `url("${brand.heroImageUrl}")`;
  if (brand.logoUrl) document.querySelectorAll("[data-brand-initials]").forEach((element) => {
    element.textContent = "";
    const image = document.createElement("img");
    image.src = brand.logoUrl;
    image.alt = `Logo ${brand.businessName}`;
    image.style.cssText = "width:100%;height:100%;object-fit:contain";
    element.append(image);
  });
  document.title = `${brand.businessName} | Agendamento`;
};
