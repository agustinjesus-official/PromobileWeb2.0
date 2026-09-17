import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestArrivals from './components/LatestArrivals';
import FilterBar from './components/FilterBar';
import VehicleCard from './components/VehicleCard';
import FinancingBanner from './components/FinancingBanner';
import Footer from './components/Footer';
import NoResults from './components/NoResults';
import AdminPanel from './components/admin/AdminPanel';
import { VEHICLES } from './data/vehicles';
import { vehicleService } from './services/vehicleService';

// Lazy loading para los modales
const VehicleModal = lazy(() => import('./components/VehicleModal'));
const TradeInModal = lazy(() => import('./components/TradeInModal'));

export default function App() {
  const [isAdminView, setIsAdminView] = useState(window.location.hash === '#admin');
  const [vehicles, setVehicles] = useState(VEHICLES);

  // Cargar catálogo desde Supabase
  useEffect(() => {
    vehicleService.getVehicles()
      .then((data) => {
        if (data && data.length > 0) {
          setVehicles(data);
        }
      })
      .catch((err) => {
        console.warn('Error cargando catálogo desde Supabase:', err);
      });
  }, []);

  const refreshVehicles = () => {
    vehicleService.getVehicles().then((data) => {
      if (data && data.length > 0) {
        setVehicles(data);
      }
    });
  };

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [sortBy, setSortBy] = useState('featured');
  
  // Modales
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [tradeInVehicle, setTradeInVehicle] = useState(null); // null = cerrado, 'any' = auto genérico, objeto = auto específico

  // Bloquear scroll cuando hay un modal abierto
  useEffect(() => {
    if (selectedVehicle || tradeInVehicle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedVehicle, tradeInVehicle]);

  // Conteo por categoría
  const categoryCounts = useMemo(() => {
    return vehicles
      .filter(v => v.status !== 'draft')
      .reduce((acc, vehicle) => {
        const cat = vehicle.category || 'other';
        acc[cat] = (acc[cat] || 0) + 1;
        acc.all = (acc.all || 0) + 1;
        return acc;
      }, { all: 0 });
  }, [vehicles]);

  // Filtrado y Ordenamiento
  const filteredVehicles = useMemo(() => {
    // Excluir los ocultos/borradores de la vista pública
    let result = vehicles.filter(v => v.status !== 'draft');

    // Filtro Categoría
    if (activeCategory !== 'all') {
      result = result.filter(v => v.category === activeCategory);
    }

    // Filtro Búsqueda
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(v => 
        v.title?.toLowerCase().includes(query) ||
        v.brand?.toLowerCase().includes(query) ||
        v.model?.toLowerCase().includes(query) ||
        v.year?.toString().includes(query) ||
        v.fuel?.toLowerCase().includes(query)
      );
    }

    // Ordenamiento
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
      if (sortBy === 'year-desc') return b.year - a.year;
      if (sortBy === 'km-asc') {
        const kmA = parseInt(String(a.km || '').replace(/\D/g, '')) || 0;
        const kmB = parseInt(String(b.km || '').replace(/\D/g, '')) || 0;
        return kmA - kmB;
      }
      // 'featured' por defecto
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return result;
  }, [activeCategory, searchTerm, sortBy, vehicles]);

  const handleOpenTradeIn = (vehicle = null) => {
    setTradeInVehicle(vehicle || 'any');
  };

  if (isAdminView) {
    return <AdminPanel onExit={() => { window.location.hash = ''; }} onRefresh={refreshVehicles} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-accent selection:text-white">
      {/* Navegación */}
      <Navbar onOpenTradeIn={handleOpenTradeIn} />

      {/* Hero Principal */}
      <Hero />

      {/* Carrusel Últimos Ingresos */}
      <LatestArrivals vehicles={vehicles} />

      {/* Contenido Principal (Inventario) */}
      <main id="inventario" className="container mx-auto px-4 py-8 flex-1 scroll-mt-20">
        {/* Barra de Filtros */}
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          currency={currency}
          setCurrency={setCurrency}
          sortBy={sortBy}
          setSortBy={setSortBy}
          counts={categoryCounts}
        />

        {/* Encabezado del listado con contador */}
        <div className="flex justify-between items-center mb-6 text-sm text-text-muted">
          <div>
            Mostrando <strong className="text-white">{filteredVehicles.length}</strong> {filteredVehicles.length === 1 ? 'vehículo disponible' : 'vehículos disponibles'}
          </div>
          {searchTerm && (
            <div className="text-xs text-accent bg-accent/10 px-2 py-1 rounded">
              Búsqueda: "{searchTerm}"
            </div>
          )}
        </div>

        {/* Grilla de Vehículos */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle, idx) => (
              <VehicleCard
                key={vehicle.id}
                index={idx}
                vehicle={vehicle}
                currency={currency}
                onSelectVehicle={setSelectedVehicle}
                onOpenTradeIn={handleOpenTradeIn}
              />
            ))}
          </div>
        ) : (
          /* Estado Vacío / Sin Resultados */
          <NoResults onReset={() => {
            setSearchTerm('');
            setActiveCategory('all');
          }} />
        )}

        {/* Sección de Financiación y Gestoría */}
        <FinancingBanner onOpenTradeIn={handleOpenTradeIn} />
      </main>

      {/* Pie de Página */}
      <Footer />

      {/* Modales */}
      <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />}>
        {selectedVehicle && (
          <VehicleModal
            vehicle={selectedVehicle}
            currency={currency}
            onClose={() => setSelectedVehicle(null)}
            onOpenTradeIn={handleOpenTradeIn}
          />
        )}

        {tradeInVehicle && (
          <TradeInModal
            initialVehicle={tradeInVehicle === 'any' ? null : tradeInVehicle}
            onClose={() => setTradeInVehicle(null)}
          />
        )}
      </Suspense>
    </div>
  );
}
