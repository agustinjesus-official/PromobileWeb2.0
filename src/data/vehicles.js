// Catálogo de Vehículos en Stock - Promobile Concesionaria (Santa Fe)
// Este archivo permite agregar, modificar o dar de baja vehículos fácilmente.

const RAW_VEHICLES = [
  {
    id: "citroen-ds3-2018",
    title: "Citroën DS3 1.6 Turbo So Chic",
    brand: "Citroën",
    model: "DS3",
    year: 2018,
    km: "62.000 km",
    fuel: "Nafta",
    transmission: "Manual 6ta",
    category: "auto",
    priceUSD: 14800,
    priceARS: 19240000,
    
    
    featured: true,
    acceptsTradeIn: false,
    images: [
      "/images/generic_car.jpg"
    ],
    description: "Excelente estado general. Versión So Chic bicolor (blanco perlado con techo negro). Motor 1.6 THP de 165 CV, tapizados deportivos, sensores de estacionamiento, climatizador automático y control de estabilidad ESP. Documentación al día, listo para transferir.",
    financing: {
      minAdvanceUSD: 7500,
      installments: "Hasta 36 cuotas fijas en pesos solo con DNI"
    }
  },
  {
    id: "ford-focus-titanium-2019",
    title: "Ford Focus Titanium 2.0 AT",
    brand: "Ford",
    model: "Focus",
    year: 2019,
    km: "54.000 km",
    fuel: "Nafta",
    transmission: "Automática",
    category: "auto",
    priceUSD: 16500,
    priceARS: 21450000,
    
    
    featured: true,
    acceptsTradeIn: false,
    images: [
      "/images/generic_car.jpg"
    ],
    description: "El sedán más equipado de su segmento. Estacionamiento asistido automático paralelo y perpendicular, faros Bi-Xenón direccionales, pantalla táctil SYNC 3 con Apple CarPlay y Android Auto, audio Sony de 9 parlantes, techo solar y llantas 17 diamantadas.",
    financing: {
      minAdvanceUSD: 8000,
      installments: "Financiación bancaria o prendaria a tasa preferencial"
    }
  },
  {
    id: "vw-gol-trend-2019",
    title: "Volkswagen Gol Trend 1.6 MSI Trendline",
    brand: "Volkswagen",
    model: "Gol Trend",
    year: 2019,
    km: "78.000 km",
    fuel: "Nafta",
    transmission: "Manual",
    category: "auto",
    priceUSD: 9800,
    priceARS: 12740000,
    
    
    featured: false,
    acceptsTradeIn: false,
    images: [
      "/images/generic_car.jpg"
    ],
    description: "El auto más confiable y económico para mantenimiento. Aire acondicionado, dirección asistida, doble airbag, frenos ABS y stereo Bluetooth. Cubiertas delanteras con solo 5.000 km. Verificación policial aprobada.",
    financing: {
      minAdvanceUSD: 4500,
      installments: "Anticipo y saldo en hasta 24 cuotas"
    }
  },
  {
    id: "hyundai-santa-fe-4wd",
    title: "Hyundai Santa Fe 2.2 CRDi 4WD GLS",
    brand: "Hyundai",
    model: "Santa Fe",
    year: 2015,
    km: "128.000 km",
    fuel: "Diésel",
    transmission: "Automática",
    category: "suv",
    priceUSD: 18900,
    priceARS: 24570000,
    
    
    featured: true,
    acceptsTradeIn: false,
    images: [
      "/images/generic_suv.jpg"
    ],
    description: "SUV familiar de gran porte para 7 pasajeros. Motor turbo diésel de enorme torque y bajo consumo en ruta. Tracción integral 4WD inteligente, tapizados de cuero negro, techo panorámico corredizo y butacas eléctricas calefaccionadas.",
    financing: {
      minAdvanceUSD: 9500,
      installments: "Aceptamos permuta de menor o mayor valor"
    }
  },
  {
    id: "honda-cbr-600-f",
    title: "Honda CBR 600 F Sport",
    brand: "Honda",
    model: "CBR 600",
    year: 2013,
    km: "34.000 km",
    fuel: "Nafta",
    transmission: "Manual 6ta",
    category: "moto",
    priceUSD: 11200,
    priceARS: 14560000,
    
    
    featured: true,
    acceptsTradeIn: false,
    images: [
      "/images/generic_moto.jpg"
    ],
    description: "Impecable estado para entendidos. Motor 4 cilindros en línea de 102 CV, sonido inigualable con escape deportivo homologado, frenos Nissin con pastillas nuevas y service de fluidos recién realizado. Muy cuidada.",
    financing: {
      minAdvanceUSD: 5500,
      installments: "Tomamos motos de menor cilindrada en parte de pago"
    }
  },
  {
    id: "peugeot-208-allure-2020",
    title: "Peugeot 208 1.6 Allure Tiptronic",
    brand: "Peugeot",
    model: "208",
    year: 2020,
    km: "42.000 km",
    fuel: "Nafta",
    transmission: "Automática",
    category: "auto",
    priceUSD: 13900,
    priceARS: 18070000,
    
    
    featured: false,
    acceptsTradeIn: false,
    images: [
      "/images/generic_car.jpg"
    ],
    description: "Línea nueva. Diseño agresivo con colmillos LED delanteros, tablero i-Cockpit, pantalla táctil de 7 pulgadas con conectividad completa, cámara de retroceso y velocidad crucero. Único dueño de Santa Fe.",
    financing: {
      minAdvanceUSD: 6500,
      installments: "Planes de cuotas fijas en pesos"
    }
  },
  {
    id: "jeep-compass-sport-2018",
    title: "Jeep Compass 2.4 Sport MT",
    brand: "Jeep",
    model: "Compass",
    year: 2018,
    km: "71.000 km",
    fuel: "Nafta",
    transmission: "Manual 6ta",
    category: "suv",
    priceUSD: 17200,
    priceARS: 22360000,
    
    
    featured: false,
    acceptsTradeIn: false,
    images: [
      "/images/generic_suv.jpg"
    ],
    description: "Auténtico ADN Jeep. Motor Tigershark 2.4 de 174 CV, frenos de mano eléctrico, control de arranque en pendiente, pantalla multimedia Uconnect de 7'', llantas de aleación y gran despeje del suelo.",
    financing: {
      minAdvanceUSD: 8500,
      installments: "Cuotas en pesos con mínimos requisitos"
    }
  },
  {
    id: "honda-wave-110s-2023",
    title: "Honda Wave 110 S Disco",
    brand: "Honda",
    model: "Wave",
    year: 2023,
    km: "6.500 km",
    fuel: "Nafta",
    transmission: "Semiautomática",
    category: "moto",
    priceUSD: 1750,
    priceARS: 2275000,
    
    
    featured: false,
    acceptsTradeIn: false,
    images: [
      "/images/generic_moto.jpg"
    ],
    description: "Versión con freno a disco delantero y llantas de aleación. Prácticamente nueva, services oficiales al día, batería nueva. Consumo insignificante para la ciudad.",
    financing: {
      minAdvanceUSD: 800,
      installments: "12 cuotas con tarjeta o crédito personal"
    }
  }
];

export const AGENCY_INFO = {
  name: "Promobile Concesionaria",
  tagline: "Concesionario Multimarcas en Santa Fe",
  phone: "+54 9 342 500-0000", // Número editable de WhatsApp
  whatsappNumber: "5493425000000",
  address: "Santa Fe Capital, Santa Fe, Argentina",
  hours: "Lunes a Viernes de 9:00 a 18:00 hs (Corrido)",
  instagram: "https://www.instagram.com/promobile.stafe/",
  instagramHandle: "@promobile.stafe",
  followers: "17.4k",
  usdRate: 1300 // Cotización de referencia dólar blue/mep
};

export const VEHICLES = RAW_VEHICLES.map(v => ({
  ...v,
  priceARS: v.priceUSD * AGENCY_INFO.usdRate
}));
