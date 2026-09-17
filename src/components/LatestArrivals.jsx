import React from 'react';

export default function LatestArrivals({ vehicles }) {
  // Mostrar solo los publicados y tomar los primeros 6
  const latest = vehicles.filter(v => v.status !== 'draft').slice(0, 6);

  if (latest.length === 0) return null;

  // Duplicamos la lista varias veces para que el deslizamiento continuo nunca se quede vacío
  const displayItems = [...latest, ...latest, ...latest, ...latest];

  return (
    <section className="w-full pt-6 pb-4 overflow-hidden bg-background">
      <div className="container mx-auto px-4 mb-5">
        <h2 className="font-display text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase drop-shadow-md">
          Últimos <span className="text-accent">Ingresos</span>
        </h2>
      </div>
      
      {/* Carrusel infinito animado */}
      <div className="relative w-full overflow-hidden flex group">
        <div className="flex gap-4 px-4 w-max animate-marquee">
          {displayItems.map((vehicle, idx) => (
            <button 
              key={`${vehicle.id}-${idx}`} 
              onClick={() => {
                document.getElementById('inventario')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="shrink-0 w-[260px] bg-surfaceLight border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 transition-all shadow-xl text-left block"
            >
              {/* Imagen */}
              <div className="aspect-[4/3] bg-surface relative overflow-hidden">
                <img 
                  src={vehicle.images?.[0] || '/images/generic_car.jpg'} 
                  alt={vehicle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
                  Nuevo
                </div>
              </div>
              
              {/* Info */}
              <div className="p-4">
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1 flex justify-between items-center">
                  <span>{vehicle.brand}</span>
                  <span>{vehicle.year}</span>
                </div>
                <h3 className="text-white font-bold text-base leading-tight mb-2 line-clamp-1 hover:text-accent transition-colors">
                  {vehicle.title}
                </h3>
                <div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                  <span>{vehicle.km}</span>
                  <span className="w-1 h-1 rounded-full bg-border"></span>
                  <span className="capitalize">{vehicle.fuel || 'Nafta'}</span>
                </div>
                <div className="text-xl font-black text-white">
                  ${(vehicle.priceUSD || 0).toLocaleString('es-AR')}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
