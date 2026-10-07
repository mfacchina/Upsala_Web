// Todo el texto del sitio vive aca para poder corregirlo sin tocar componentes.

export const NAV_LINKS = [
  { href: "/#natural", label: "Agua natural" },
  { href: "/#productos", label: "Productos" },
  { href: "/#dispenser", label: "Dispenser" },
  { href: "/#empresa", label: "La empresa" },
  { href: "/#revendedores", label: "Revendedores" },
  { href: "/#preguntas", label: "Preguntas" },
];

/** Promocion de bienvenida. Cambiar aca si cambia la campania. */
export const PROMO = {
  badge: "Promo de bienvenida",
  title: "2×1 en tu primer pedido",
  text: "Llevás dos bidones y pagás uno. Válido al darte de alta como cliente nuevo.",
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
    { label: "Promo", value: "2×1 en el primer pedido" },
    { label: "Sin mínimos", value: "Ni contratos" },
    { label: "Reparto", value: "A domicilio en CABA" },
  ],
};

export const NATURAL = {
  eyebrow: "100% mineral natural",
  title: "Tan pura que no necesita presentación",
  text: "No es agua de red filtrada ni tratada: es agua mineral natural, extraída de una napa protegida en una zona rural de 9 de Julio y envasada en origen, con la misma pureza que le da la naturaleza.",
  points: [
    {
      title: "De napa protegida",
      text: "Nace en una zona rural rodeada de campos, lejos de la polución de las grandes ciudades.",
    },
    {
      title: "Sin procesos artificiales",
      text: "No se le agrega ni se le quita nada. Se envasa tal como sale, con sus minerales naturales.",
    },
    {
      title: "Envasada en origen",
      text: "La planta embotelladora está sobre la misma fuente, en Villa Fournier, 9 de Julio.",
    },
    {
      title: "Controlada siempre",
      text: "Análisis periódicos y envases lavados y sanitizados en cada recambio.",
    },
  ],
};

export type Product = {
  key: "b12" | "b20";
  name: string;
  liters: number;
  title: string;
  text: string;
  bullets: string[];
  image: string;
};

export const PRODUCTS = {
  eyebrow: "Dos tamaños",
  title: "Bidones de 12 y 20 litros",
  text: "Retornables, livianos de manejar y siempre con recambio: te dejamos uno lleno y nos llevamos el vacío.",
  items: [
    {
      key: "b12",
      name: "Bidón 12 L",
      liters: 12,
      title: "Para hogares y departamentos",
      text: "Fácil de instalar y de cambiar. Entra en cualquier dispenser y se levanta sin esfuerzo.",
      bullets: ["Ideal para 1 a 3 personas", "Liviano: lo cambia cualquiera", "Apto dispenser y sifón eléctrico"],
      image: "/img/bidon-12.png",
    },
    {
      key: "b20",
      name: "Bidón 20 L",
      liters: 20,
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
  priceNote: "por mes, con bonificación según tu consumo de bidones",
  bullets: [
    "Instalación y retiro sin cargo",
    "Cambio del equipo si tiene una falla",
    "Se bonifica con tu consumo: cuanta más agua pedís, menos pagás de alquiler",
    "Sin mínimos ni máximos: armamos el abono a tu medida",
  ],
  cta: "Quiero un dispenser",
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
  successCovered: "Te escribimos por WhatsApp a la brevedad para coordinar tu primera entrega y activar tu promo 2×1.",
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
    q: "¿Qué diferencia hay entre agua mineral natural y agua purificada?",
    a: "El agua purificada es agua de red o de pozo que se filtra y se trata. El agua mineral natural nace de una napa protegida, se envasa en origen y conserva sus minerales sin agregados ni procesos artificiales. Upsala es agua mineral natural.",
  },
  {
    q: "¿En qué zonas reparten?",
    a: "Repartimos a domicilio en barrios de la Ciudad de Buenos Aires. En el formulario, al elegir tu barrio te decimos al instante si tenemos cobertura. Si todavía no llegamos, te avisamos cuando lleguemos.",
  },
  {
    q: "¿Hay un mínimo de pedido o un contrato?",
    a: "No. Pedís lo que necesitás, cuando lo necesitás. El reparto pasa con la frecuencia que acordemos y te avisa por WhatsApp antes de cada visita.",
  },
  {
    q: "¿Cómo funciona el dispenser frío/calor?",
    a: "Te lo instalamos en comodato por un alquiler mensual que se bonifica según tu consumo de bidones. Si el equipo tiene una falla, lo cambiamos sin cargo.",
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
