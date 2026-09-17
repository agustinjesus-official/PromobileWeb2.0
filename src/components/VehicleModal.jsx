import React, { useState, useEffect } from 'react';
import { X, Repeat, Banknote } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { getVehicleInquiryUrl, getFinancingInquiryUrl } from '../utils/whatsapp';

export default function VehicleModal({ vehicle, currency, onClose, onOpenTradeIn }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!vehicle) return null;

  const isUSD = currency === 'USD';
  const mainPrice = isUSD 
    ? `$${vehicle.priceUSD.toLocaleString('es-AR')} USD`
    : `$${vehicle.priceARS.toLocaleString('es-AR')} ARS`;

  const secondaryPrice = isUSD
    ? `Aprox. $${vehicle.priceARS.toLocaleString('es-AR')} ARS`
    : `Aprox. $${vehicle.priceUSD.toLocaleString('es-AR')} USD`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div 
        className="bg-surface w-full md:w-[600px] max-h-[90vh] md:max-h-[85vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border-t md:border border-border flex flex-col animate-slide-up md:animate-zoom-in" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar Flotante */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <X size={20} />
        </button>

        {/* Galería de Imágenes */}
        <div className="relative bg-black w-full">
          <div className="aspect-[4/3] md:aspect-[16/9] w-full">
            <img 
              src={vehicle.images[activeImgIndex] || vehicle.images[0]} 
              alt={vehicle.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {vehicle.images.length > 1 && (
            <div className="flex gap-2 p-3 bg-surface border-b border-border overflow-x-auto">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
                    activeImgIndex === idx ? 'border-accent opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-5 flex flex-col gap-5">
          {/* Cabecera */}
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <div className="text-accent text-xs font-bold uppercase tracking-widest mb-1">
                {vehicle.brand} • {vehicle.year}
              </div>
              <h2 id="modal-title" className="text-xl md:text-2xl font-bold text-white leading-tight">
                {vehicle.title}
              </h2>
            </div>
            <div className="md:text-right shrink-0">
              <div className="font-display text-3xl font-black text-white leading-none">
                {mainPrice}
              </div>
              <div className="text-xs text-text-muted mt-1 font-medium">
                {secondaryPrice}
              </div>
            </div>
          </div>

          {/* Grilla Specs */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-surfaceLight border border-border rounded-xl text-center">
            <div>
              <div className="text-[10px] text-text-muted font-bold tracking-wider mb-1">KM</div>
              <div className="text-xs font-bold text-white">{vehicle.km}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-bold tracking-wider mb-1">AÑO</div>
              <div className="text-xs font-bold text-white">{vehicle.year}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-bold tracking-wider mb-1">CAJA</div>
              <div className="text-xs font-bold text-white">{vehicle.transmission}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-bold tracking-wider mb-1">MOTOR</div>
              <div className="text-xs font-bold text-white">{vehicle.fuel}</div>
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed font-light">
            {vehicle.description}
          </p>

          {/* Financiación */}
          {vehicle.financing && (
            <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Banknote size={20} className="text-amber-500" />
                <span className="text-sm font-medium text-amber-100">
                  {vehicle.financing.installments}
                </span>
              </div>
              <a
                href={getFinancingInquiryUrl(vehicle)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-500 hover:text-amber-400 underline"
              >
                Consultar
              </a>
            </div>
          )}

          {/* Botones Fijos Abajo en Móvil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pb-6 md:pb-0">
            <a
              href={getVehicleInquiryUrl(vehicle, currency)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-[#25D366]/20 active:scale-95"
            >
              <WhatsAppIcon size={18} color="#ffffff" />
              <span>Ver por WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onOpenTradeIn(vehicle);
              }}
              className="flex items-center justify-center gap-2 bg-surfaceLight border border-border text-white py-3.5 rounded-xl font-bold hover:bg-white/5 transition-all active:scale-95"
            >
              <Repeat size={16} className="text-accent" />
              <span>Tasar Permuta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
