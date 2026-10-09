// Todo el texto del sitio vive aca para poder corregirlo sin tocar componentes.

export const NAV_LINKS = [
  { href: "/#natural", label: "Agua natural" },
  { href: "/#productos", label: "Productos" },
  { href: "/dispenser/", label: "Dispenser" },
  { href: "/#empresa", label: "La empresa" },
  { href: "/#revendedores", label: "Revendedores" },
  { href: "/#preguntas", label: "Preguntas" },
];

/** Promocion de bienvenida. Cambiar aca si cambia la campania. */
export const PROMO = {
  badge: "Promo de bienvenida",
  title: "50% en tu primer bidón",
  text: "Tu primer bidón a mitad de precio por darte de alta como cliente nuevo.",
};

export const HERO = {
  eyebrow: "Agua mineral natural · reparto a domicilio en CABA",
  title: ["Agua mineral natural,", "en la puerta de tu casa."],
  subtitle:
    "Bidones de 12 y 20 litros y dispensers frío/calor con reparto a domicilio en la Ciudad de Buenos Aires. Envasada en origen, en 9 de Julio, sin procesos artificiales.",
  primaryCta: "Quiero agua en casa",
  secondaryCta: "Escribir por WhatsApp",
  trust: "Más de 15 años llevando agua mineral natural a hogares y oficinas.",
  chips: [
    { label: "Promo", value: "50% en el primer bidón" },
    { label: "Sin mínimos", value: "Ni contratos" },
    { label: "Reparto", value: "A domicilio en CABA" },
  ],
};

export const NATURAL = {
  eyebrow: "¿Qué agua estás tomando?",
  title: "Mineral natural no es lo mismo que agua de mesa",
  text: "Casi toda el agua en bidón que llega a los hogares de Buenos Aires es agua de mesa: agua de red o de pozo que se purifica y se trata, a veces con minerales agregados. El agua mineral natural es otra categoría: nace con sus minerales de una fuente subterránea protegida y se envasa en origen, sin tratamientos. Upsala es agua mineral natural, y en CABA eso es poco común.",
  /** Lo que NO es (en tono tranquilo) y lo que sí es. */
  compare: [
    { is: false, title: "No es mineralizada", text: "No se le agregan minerales después: los trae de la fuente, en su proporción natural." },
    { is: false, title: "No es agua de mesa", text: "No sale de la red ni de un pozo cualquiera: viene de una napa protegida en zona rural." },
    { is: false, title: "No es purificada ni tratada", text: "No pasa por ósmosis, cloro ni filtrados químicos: no hace falta, ya nace pura." },
    { is: true, title: "Es agua mineral natural", text: "Envasada en origen en Villa Fournier, 9 de Julio, con controles de laboratorio periódicos. Tal como sale de la tierra." },
  ],
  points: [
    { title: "De napa protegida", text: "Nace en una zona rural rodeada de campos, lejos de la polución de las grandes ciudades." },
    { title: "Envasada en origen", text: "La planta embotelladora está sobre la misma fuente, en Villa Fournier, 9 de Julio." },
    { title: "Controlada siempre", text: "Análisis periódicos y envases lavados y sanitizados en cada recambio." },
  ],
};

export type Product = {
  key: "b12" | "b20";
  name: string;
  liters: number;
  /** Precio final por bidon, con IVA. */
  price: number;
  title: string;
  text: string;
  bullets: string[];
  image: string;
};

export const PRODUCTS = {
  eyebrow: "Dos tamaños",
  title: "Bidones de 12 y 20 litros",
  text: "Retornables, livianos de manejar y siempre con recambio: te dejamos uno lleno y nos llevamos el vacío.",
  priceNote: "Precio final por bidón, IVA incluido. Con la promo de bienvenida, el primer bidón sale a la mitad.",
  /** Posicionamiento de precio: hay mas caras y mas baratas; lo que se paga es agua mineral natural. */
  pricing: {
    title: "Hay agua más barata y agua más cara. La diferencia es qué estás pagando.",
    text: "La mayoría de los bidones del mercado son agua de mesa: agua de red o de pozo tratada. Con Upsala pagás por agua mineral natural, de fuente protegida y envasada en origen. Por eso no es la más barata, y tampoco hace falta pagar de más por una marca grande.",
  },
  items: [
    {
      key: "b12",
      name: "Bidón 12 L",
      liters: 12,
      price: 7250,
      title: "Para hogares y departamentos",
      text: "Fácil de instalar y de cambiar. Entra en cualquier dispenser y se levanta sin esfuerzo.",
      bullets: ["Ideal para 1 a 3 personas", "Liviano: lo cambia cualquiera", "Apto dispenser y sifón eléctrico"],
      image: "/img/bidon-12.png",
    },
    {
      key: "b20",
      name: "Bidón 20 L",
      liters: 20,
      price: 9700,
      title: "Para consumos grandes",
      text: "El clásico de oficinas, consultorios, gimnasios y familias numerosas. Más litros por visita.",
      bullets: ["Ideal para oficinas y familias", "Menos recambios por semana", "Mejor precio por litro"],
      image: "/img/bidon-20.png",
    },
  ] satisfies Product[],
};

export const DISPENSER = {
  eyebrow: "Dispenser frío / calor",
  title: "Agua fría y caliente, siempre lista",
  text: "Te instalamos un dispenser frío/calor en comodato con tu bidón de 20 litros. Sin comprar equipo, sin service: si falla, lo cambiamos.",
  priceLabel: "Alquiler mensual",
  price: "$ 15.000",
  priceNote: "por mes, y se bonifica según los bidones de 20 L que consumís en el mes",
  /** Escala de bonificación por consumo mensual de bidones. */
  tiers: [
    { range: "6 o más bidones", bonus: "100%", pay: "No pagás alquiler", highlight: true },
    { range: "4 o 5 bidones", bonus: "50%", pay: "Pagás $ 7.500", highlight: false },
    { range: "2 o 3 bidones", bonus: "Sin bonificación", pay: "Pagás $ 15.000", highlight: false },
  ],
  tiersNote: "Consumo mínimo: 2 bidones por mes.",
  bullets: ["Instalación y retiro sin cargo", "Cambio del equipo si tiene una falla", "Sin contrato: lo devolvés cuando quieras"],
  cta: "Quiero un dispenser",
  ctaBusiness: "Planes para empresas",
};

/** Pagina /dispenser/: hogares (alquiler bonificado) y empresas (abono con dispenser sin cargo). */
export const DISPENSER_PAGE = {
  eyebrow: "Dispenser frío / calor",
  title: ["Agua fría y caliente al instante,", "con el dispenser en comodato."],
  subtitle:
    "Te lo llevamos, lo instalamos y lo mantenemos. Vos solo elegís cuántos bidones de agua mineral natural necesitás por mes. Para tu casa o para tu empresa.",
  segments: { home: "Para tu casa", business: "Para tu empresa" },
  home: {
    title: "En casa: el alquiler se paga solo con tu consumo",
    text: "El dispenser cuesta $ 15.000 por mes, pero se bonifica según los bidones de 20 L que consumís. Una familia que toma 6 bidones al mes no paga alquiler.",
    points: ["Instalación y retiro sin cargo", "Cambio del equipo si tiene una falla", "Sin contrato: lo devolvés cuando quieras", "Consumo mínimo: 2 bidones de 20 L por mes"],
  },
  business: {
    title: "En tu empresa: abono mensual con el dispenser sin cargo",
    text: "Para oficinas, consultorios, estudios, comercios, gimnasios y colegios armamos un abono mensual con la cantidad que realmente consumen. El dispenser va incluido, sin alquiler ni instalación, durante toda la relación. Entrega programada en día fijo y una sola factura A con IVA discriminado.",
    reference: "Como referencia, una persona en una oficina consume alrededor de un bidón de 20 L por mes. Dimensionamos el abono con ese dato y lo ajustamos después del primer mes real.",
    plans: [
      { people: "Hasta 25 personas", bidones: 12, dispensers: "1 dispenser", price: 116400, promo: 58200 },
      { people: "De 25 a 45 personas", bidones: 20, dispensers: "1 o 2 dispensers", price: 194000, promo: 97000 },
      { people: "Más de 45 personas", bidones: 26, dispensers: "2 o más dispensers", price: 252200, promo: 126100 },
    ],
    promo: { badge: "Promo empresas", title: "Los primeros 2 meses al 50%", text: "Después, el precio del tramo se mantiene aunque ajustemos la cantidad de bidones al consumo real." },
    conditions: [
      "Dispensers sin cargo de alquiler ni instalación, siempre, no solo en la promoción",
      "Sin permanencia: si no les sirve, retiramos el equipo sin costo de salida",
      "Entrega programada, retiro de envases vacíos, service o reemplazo del equipo ante cualquier falla",
      "Factura A con IVA discriminado, pago por transferencia a 15 días",
      "En enero y febrero, si no necesitan, se suspende la entrega y no se factura",
      "Se pueden combinar bidones de 20 y 12 L dentro del mismo abono",
    ],
    priceNote: "Precios finales con IVA incluido, vigentes a agosto de 2026, sujetos a revisión trimestral con 30 días de aviso.",
  },
  form: {
    eyebrow: "Pedí tu dispenser",
    title: "Contanos para dónde es y te armamos la propuesta",
    text: "Si es para una empresa, con la cantidad de personas te pasamos el plan con precio cerrado, en el día y sin compromiso.",
    success: "Te escribimos por WhatsApp para coordinar la instalación del dispenser.",
    successBusiness: "Te mandamos la propuesta con el plan y el precio cerrado en el día.",
  },
  faq: [
    { q: "¿El dispenser tiene costo de instalación?", a: "No. Lo llevamos, lo instalamos y queda funcionando el mismo día, sin cargo. Para empresas tampoco tiene alquiler." },
    { q: "¿Qué pasa si el dispenser falla?", a: "Lo reemplazamos sin cargo. El service está incluido tanto en casas como en empresas." },
    { q: "¿Puedo combinar bidones de 20 y de 12 litros?", a: "Sí. El dispenser va con el de 20 L, pero el abono puede incluir bidones de 12 L en la proporción que les convenga." },
    { q: "¿Hay permanencia?", a: "No. En casa lo devolvés cuando quieras. En empresas, si no les sirve retiramos el equipo sin costo de salida." },
  ],
};

export const ABOUT = {
  eyebrow: "La empresa",
  title: "De 9 de Julio a tu casa",
  paragraphs: [
    "Upsala es una distribuidora de agua mineral natural con más de 15 años de trayectoria. En 2005 confirmamos la existencia de agua mineral natural en una zona rural de 9 de Julio, rodeada de campos y alejada de la polución de las grandes ciudades, donde conviven una gran variedad de especies autóctonas de flora y fauna.",
    "Su pureza, y por qué no algún recuerdo inconsciente de la Patagonia, nos embarcaron en este proyecto que llamamos Upsala.",
    "Hoy, con la misma pasión, junto a un equipo comprometido con los más altos estándares de calidad, seguimos envasando agua mineral natural en origen y la repartimos a domicilio en la Ciudad de Buenos Aires.",
  ],
  stats: [
    { value: 2005, label: "Desde", prefix: "", suffix: "" },
    { value: 15, label: "Años de trayectoria", prefix: "+", suffix: "" },
    { value: 2, label: "Tamaños de bidón", prefix: "", suffix: "" },
  ],
  plantLabel: "Planta embotelladora",
  salesLabel: "Ventas y distribución",
};

export const STEPS = {
  eyebrow: "Cómo funciona",
  title: "Tres pasos y tenés agua en casa",
  items: [
    {
      title: "Dejanos tus datos",
      text: "Completás el formulario con tu dirección y tu barrio. Al elegirlo te decimos al instante si tenemos cobertura.",
    },
    {
      title: "Te contactamos",
      text: "Te escribimos por WhatsApp para coordinar el día y el horario de tu primera entrega.",
    },
    {
      title: "Pasamos a dejarte agua",
      text: "El reparto te deja los bidones llenos, se lleva los vacíos y te avisa por WhatsApp antes de cada visita.",
    },
  ],
};

export const REGISTER = {
  eyebrow: "Quiero ser cliente",
  title: "Pedí tu primera entrega",
  text: "Dos minutos. Elegí tu barrio para saber si tenemos cobertura antes de completar el resto.",
  coveredMsg: "Tenemos cobertura en tu barrio.",
  notCoveredMsg: "Todavía no llegamos a tu barrio. Dejanos tus datos igual y te avisamos cuando lleguemos.",
  unknownMsg: "No pudimos verificar la cobertura automáticamente. Dejanos tus datos y te confirmamos por WhatsApp.",
  successTitle: "¡Registro recibido!",
  confirmTitle: "¡Listo! Ahora confirmá por WhatsApp",
  confirmText: "Tocá el botón: se abre WhatsApp con tus datos ya escritos, lo enviás y coordinamos la entrega de tu primer bidón.",
  confirmHint: "Tus datos ya nos llegaron. Si no tenés WhatsApp a mano, igual te contactamos nosotros.",
  successCovered: "Te escribimos por WhatsApp a la brevedad para coordinar tu primera entrega y aplicar el 50% en tu primer bidón.",
  successNotCovered:
    "Todavía no tenemos reparto en tu barrio, pero guardamos tus datos: en cuanto lleguemos te avisamos.",
  privacy: "Tus datos son confidenciales y solo los usamos para coordinar tu entrega.",
  products: ["Bidón 12 L", "Bidón 20 L", "Dispenser frío/calor + bidón 20 L", "Todavía no sé"],
};

export const RESELLERS = {
  eyebrow: "Revendedores",
  title: "Sumate a vender agua Upsala",
  text: "Si tenés un comercio, un reparto propio o querés arrancar uno, te damos producto, precio de revendedor y apoyo para crecer en tu zona.",
  points: [
    { title: "Precio de revendedor", text: "Margen real sobre cada bidón, con lista por volumen." },
    { title: "Producto diferenciado", text: "Agua mineral natural, no agua tratada. Un argumento de venta que el cliente nota." },
    { title: "Envases y logística", text: "Te proveemos los bidones retornables y coordinamos el abastecimiento." },
    { title: "Zonas disponibles", text: "Priorizamos barrios y localidades donde todavía no tenemos reparto propio." },
  ],
  cta: "Quiero ser revendedor",
  successTitle: "¡Gracias por tu interés!",
  successText: "Te contactamos en los próximos días para contarte las condiciones y ver tu zona.",
};

export const FAQ = [
  {
    q: "¿Qué diferencia hay entre agua mineral natural y agua de mesa?",
    a: "El agua de mesa es agua de red o de pozo que se purifica y se trata, y a veces se mineraliza agregándole sales. El agua mineral natural nace con sus minerales de una fuente subterránea protegida, se envasa en origen y no se trata. Upsala es agua mineral natural: en Buenos Aires, la mayoría de los bidones son agua de mesa.",
  },
  {
    q: "¿En qué zonas reparten?",
    a: "Repartimos a domicilio en barrios de la Ciudad de Buenos Aires. En el formulario, al elegir tu barrio te decimos al instante si tenemos cobertura. Si todavía no llegamos, te avisamos cuando lleguemos.",
  },
  {
    q: "¿Hay un mínimo de pedido o un contrato?",
    a: "Para los bidones, no: pedís lo que necesitás, cuando lo necesitás, y el reparto te avisa por WhatsApp antes de cada visita. El único mínimo es para el dispenser frío/calor en comodato: 2 bidones de 20 L por mes.",
  },
  {
    q: "¿Cómo funciona el dispenser frío/calor?",
    a: "Te lo instalamos en comodato por $ 15.000 al mes, que se bonifican según tu consumo: con 6 o más bidones de 20 L al mes no pagás alquiler, con 4 o 5 pagás la mitad y con 2 o 3 pagás el alquiler completo. El consumo mínimo es de 2 bidones por mes. Si el equipo tiene una falla, lo cambiamos sin cargo.",
  },
  {
    q: "¿Cómo pago?",
    a: "En efectivo al repartidor o por transferencia. Si necesitás factura, la emitimos con tu CUIT.",
  },
  {
    q: "¿Tengo que estar en casa?",
    a: "Para el recambio sí, porque retiramos el bidón vacío. Por eso te avisamos por WhatsApp el día anterior y podés confirmar o reprogramar la visita.",
  },
];

export const FINAL_CTA = {
  title: "¿Arrancamos?",
  text: "Dejanos tus datos y te contactamos para coordinar la primera entrega. O escribinos directo por WhatsApp.",
  button: "Quiero agua en casa",
};
