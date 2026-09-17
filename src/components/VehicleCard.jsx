import React from 'react';
import { Gauge, Fuel, Cog, Eye } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { getVehicleInquiryUrl } from '../utils/whatsapp';

export default function VehicleCard({ vehicle, currency, index = 0, onSelectVehicle, onOpenTradeIn }) {
  const isUSD = currency === 'USD';
  
  const mainPrice = isUSD 
    ? `$${vehicle.priceUSD.toLocaleString('es-AR')} USD`
    : `$${vehicle.priceARS.toLocaleString('es-AR')} ARS`;

  const secondaryPrice = isUSD
    ? `Aprox. $${vehicle.priceARS.toLocaleString('es-AR')} ARS`
    : `Aprox. $${vehicle.priceUSD.toLocaleString('es-AR')} USD`;

  const badgeColors = {
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  };
  const badgeClass = badgeColors[vehicle.badgeType] || badgeColors.red;

  return (
    <article 
      className="group bg-surface rounded-2xl border border-border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/30"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      {/* Contenedor de Imagen */}
      <div 
        className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-background"
        onClick={() => onSelectVehicle(vehicle)}
      >
        <img 
          src={vehicle.images[0]} 
          alt={vehicle.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badge Superior Izquierdo */}
        {vehicle.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${badgeClass}`}>
              {vehicle.badge}
            </span>
          </div>
        )}

        {/* Permuta Tag Superior Derecho */}
        {vehicle.acceptsTradeIn && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-emerald-500/90 text-white border border-emerald-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Permuta
            </span>
          </div>
        )}
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Marca y Año */}
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              {vehicle.brand}
            </span>
            <span className="text-xs font-semibold text-text-muted">
              {vehicle.year}
            </span>
          </div>

          {/* Título del Modelo */}
          <h3 
            className="text-lg font-bold text-white leading-tight mb-3 cursor-pointer group-hover:text-accent transition-colors line-clamp-2"
            onClick={() => onSelectVehicle(vehicle)}
          >
            {vehicle.title}
          </h3>

          {/* Ficha Rápida (Specs) */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-surfaceLight border border-border text-[11px] text-gray-300 font-medium">
              <Gauge size={12} className="text-text-muted" />
              <span>{vehicle.km}</span>
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-surfaceLight border border-border text-[11px] text-gray-300 font-medium">
              <Cog size={12} className="text-text-muted" />
              <span>{vehicle.transmission}</span>
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-surfaceLight border border-border text-[11px] text-gray-300 font-medium">
              <Fuel size={12} className="text-text-muted" />
              <span>{vehicle.fuel}</span>
            </span>
          </div>
        </div>

        {/* Precios y Botones */}
        <div className="pt-4 border-t border-border flex flex-col gap-4">
          <div>
            <div className="font-display text-2xl font-black text-white leading-none">
              {mainPrice}
            </div>
            <div className="text-xs text-text-muted mt-1 font-medium">
              {secondaryPrice}
            </div>
          </div>

          {/* Botones */}
          <div className="grid grid-cols-[1fr_1.3fr] gap-2">
            <button
              onClick={() => onSelectVehicle(vehicle)}
              className="btn-secondary py-2 text-xs"
            >
              <Eye size={14} />
              <span>Detalles</span>
            </button>

            <a
              href={getVehicleInquiryUrl(vehicle, currency)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-[#25D366]/10 active:scale-95"
            >
              <WhatsAppIcon size={14} color="#ffffff" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
