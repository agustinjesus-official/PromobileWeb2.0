import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function FilterBar({ 
  activeCategory, 
  setActiveCategory, 
  currency, 
  setCurrency,
  sortBy,
  setSortBy,
  counts
}) {
  const categories = [
    { id: 'all', label: 'Todos', count: counts.all },
    { id: 'auto', label: 'Autos', count: counts.auto },
    { id: 'suv', label: 'SUVs', count: counts.suv },
    { id: 'moto', label: 'Motos', count: counts.moto }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Píldoras de Categoría */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-surfaceLight p-1 rounded-xl border border-border overflow-x-auto w-full md:w-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeCategory === cat.id 
                ? 'bg-accent text-white shadow-lg' 
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            {cat.label} <span className="opacity-60 text-[10px] sm:text-xs ml-0.5 sm:ml-1">({cat.count || 0})</span>
          </button>
        ))}
      </div>

      {/* Controles de Moneda y Orden */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Switch USD / ARS */}
        <div className="flex items-center bg-surfaceLight border border-border p-1 rounded-xl">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currency === 'USD' ? 'bg-background text-white shadow-sm' : 'text-text-muted hover:text-white'
            }`}
            onClick={() => setCurrency('USD')}
          >
            USD
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currency === 'ARS' ? 'bg-background text-white shadow-sm' : 'text-text-muted hover:text-white'
            }`}
            onClick={() => setCurrency('ARS')}
          >
            ARS
          </button>
        </div>

        {/* Orden */}
        <div className="relative flex items-center">
          <div className="absolute left-3 pointer-events-none">
            <ArrowUpDown size={14} className="text-text-muted" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-9 pr-8 py-2 bg-surfaceLight border border-border rounded-xl text-sm font-medium text-white appearance-none focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="year-desc">Año más nuevo</option>
            <option value="km-asc">Menor km</option>
          </select>
        </div>
      </div>
    </div>
  );
}
