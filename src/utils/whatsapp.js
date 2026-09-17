import { AGENCY_INFO } from '../data/vehicles';

export function getVehicleInquiryUrl(vehicle, currency = 'USD') {
  if (!vehicle) return getGeneralWhatsAppUrl();
  const priceUSD = vehicle.priceUSD ? `$${vehicle.priceUSD.toLocaleString('es-AR')} USD` : 'Consultar precio';
  const priceARS = vehicle.priceARS ? `$${vehicle.priceARS.toLocaleString('es-AR')} ARS` : 'Consultar precio';
  const price = currency === 'USD' ? priceUSD : priceARS;

  const text = `¡Hola Promobile! 👋 Estuve viendo en su catálogo web el *${vehicle.title}* (${vehicle.year}) publicado a *${price}*. Quisiera consultar si sigue disponible y si podemos coordinar para pasar a verlo por el salón. ¡Muchas gracias!`;

  return `https://wa.me/${AGENCY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function getTradeInProposalUrl(targetVehicle, customerCar = {}) {
  const targetTitle = targetVehicle?.title ? targetVehicle.title : "uno de sus vehículos en stock";
  
  const text = `¡Hola equipo de Promobile! 👋 Me interesa *${targetTitle}* y quisiera consultar para entregar mi usado en parte de pago / permuta:

📌 *Mi vehículo actual:*
• Modelo: ${customerCar?.brand || '-'} ${customerCar?.model || ''}
• Año: ${customerCar?.year || 'No especificado'}
• Kilometraje: ${customerCar?.km || 'No especificado'} km
• Caja: ${customerCar?.transmission || 'Manual'}
• Estado general: ${customerCar?.condition || 'Muy bueno'}
${customerCar?.notes ? `• Detalle adicional: ${customerCar.notes}` : ''}

¿Podrían indicarme una cotización o diferencia estimada? Quedo a disposición para enviarles fotos o acercarlo al salón. ¡Gracias!`;

  return `https://wa.me/${AGENCY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function getFinancingInquiryUrl(vehicle) {
  if (!vehicle) return getGeneralWhatsAppUrl();
  const text = `¡Hola Promobile! 👋 Me interesa saber sobre los planes de *financiación en cuotas solo con DNI* para el *${vehicle.title}* (${vehicle.year}). ¿Qué anticipo mínimo se necesita y en cuántas cuotas se puede hacer?`;

  return `https://wa.me/${AGENCY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function getGeneralWhatsAppUrl() {
  const text = `¡Hola chicos de Promobile! 👋 Estuve mirando su catálogo online y quería hacerles una consulta sobre su stock en Santa Fe.`;
  return `https://wa.me/${AGENCY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
