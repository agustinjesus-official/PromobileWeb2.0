import React, { useState, useEffect } from 'react';
import { X, Repeat, Car } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { getTradeInProposalUrl } from '../utils/whatsapp';
import { VEHICLES } from '../data/vehicles';

export default function TradeInModal({ initialVehicle, onClose }) {
  const [selectedTargetId, setSelectedTargetId] = useState(initialVehicle ? initialVehicle.id : 'any');
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    km: '',
    transmission: 'Manual',
    condition: 'Muy Bueno',
    notes: ''
  });

  const selectedTarget = VEHICLES.find(v => v.id === selectedTargetId) || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = getTradeInProposalUrl(selectedTarget, formData);
    window.open(url, '_blank', 'noopener noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="tradein-title">
      <div 
        className="bg-surface w-full md:w-[520px] max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border-t md:border border-border flex flex-col animate-slide-up md:animate-zoom-in relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 z-10 bg-surfaceLight hover:bg-white/10 text-white p-2 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6 md:p-8">
          {/* Cabecera */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-2">
              <Repeat size={14} />
              <span>Operación Llave contra Llave</span>
            </div>
            <h2 id="tradein-title" className="text-2xl font-black text-white leading-tight">
              Tasar mi Usado en Permuta
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Auto de interés */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider pl-1">
                Auto que te interesa
              </label>
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full bg-surfaceLight border border-border text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none"
              >
                <option value="any">Cualquiera en stock (Ver opciones luego)</option>
                {VEHICLES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} ({v.year}) - ${v.priceUSD.toLocaleString('es-AR')} USD
                  </option>
                ))}
              </select>
            </div>

            {/* Datos del auto del cliente */}
            <div className="bg-surfaceLight/50 border border-border rounded-2xl p-4 flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
                <Car size={16} className="text-accent" />
                <span>Datos de tu vehículo actual</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider pl-1">Marca</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: VW, Ford"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-surface border border-border text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider pl-1">Modelo / Versión</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Gol Trend"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-surface border border-border text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider pl-1">Año</label>
                  <input
                    type="number"
                    required
                    min="1995"
                    max="2026"
                    placeholder="Ej: 2016"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-surface border border-border text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider pl-1">KM aprox.</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 85.000"
                    value={formData.km}
                    onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                    className="w-full bg-surface border border-border text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider pl-1">Caja</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full bg-surface border border-border text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent transition-all appearance-none"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automática">Automática</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider pl-1">Estado</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-surface border border-border text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent transition-all appearance-none"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Muy Bueno">Muy Bueno</option>
                    <option value="Bueno con detalles">Con detalles</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botón de Envío Directo */}
            <button
              type="submit"
              className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white w-full py-4 rounded-xl font-bold transition-all shadow-lg shadow-[#25D366]/20 active:scale-95"
            >
              <WhatsAppIcon size={20} color="#ffffff" />
              <span>Enviar Tasación por WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
