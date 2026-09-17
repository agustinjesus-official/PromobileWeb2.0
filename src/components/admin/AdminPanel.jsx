import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CarFront, Settings, LogOut, Plus, Trash2, Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Loader2, XCircle, RefreshCw, Pencil } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import { supabase } from '../../services/supabase';
import NewVehicleModal from './NewVehicleModal';

export default function AdminPanel({ onExit, onRefresh }) {
  const [session, setSession] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const [activeTab, setActiveTab] = useState('inventory');
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Estado de conexión real a Supabase
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, count: 0, error: null, checking: true });

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Comprobar sesión de Supabase al cargar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Verificar conexión real a Supabase
  const checkConnection = async () => {
    setConnectionStatus(prev => ({ ...prev, checking: true }));
    const result = await vehicleService.testConnection();
    setConnectionStatus({ ...result, checking: false });
  };

  useEffect(() => {
    checkConnection();
  }, []);

  // Cargar inventario desde Supabase
  const loadInventory = async () => {
    setLoadingVehicles(true);
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Error cargando inventario:', err);
    } finally {
      setLoadingVehicles(false);
    }
  };

  useEffect(() => {
    if (session || isDemoMode) {
      loadInventory();
    }
  }, [session, isDemoMode]);

  // Manejar Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      setSession(data.session);
    } catch (err) {
      setAuthError(err.message || 'Credenciales incorrectas');
    } finally {
      setAuthLoading(false);
    }
  };

  // Manejar Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsDemoMode(false);
  };

  // Eliminar vehículo
  const handleDelete = async (id, title) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${title}" del catálogo?`)) return;

    try {
      await vehicleService.deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
      showToast(`"${title}" eliminado del catálogo`);
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast('Error al eliminar: ' + err.message, 'error');
    }
  };

  // Cambiar estado publicar/ocultar
  const handleToggleStatus = async (id, currentStatus, title) => {
    try {
      await vehicleService.toggleStatus(id, currentStatus);
      setVehicles(prev => prev.map(v => 
        v.id === id ? { ...v, status: currentStatus === 'published' ? 'draft' : 'published' } : v
      ));
      const newStatus = currentStatus === 'published' ? 'ocultado' : 'publicado';
      showToast(`"${title}" ${newStatus}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast('Error al cambiar estado: ' + err.message, 'error');
    }
  };

  // Vehículo creado exitosamente
  const handleVehicleCreated = () => {
    loadInventory();
    showToast('Vehículo publicado exitosamente');
    if (onRefresh) onRefresh();
  };

  // Si no está autenticado ni en modo demo, mostrar Login
  if (!session && !isDemoMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface border border-border w-full max-w-md p-8 rounded-3xl shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-accent/10 border border-accent/20 text-accent mb-3">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">PROMOBILE ADMIN</h1>
            <p className="text-xs text-text-muted mt-1">Ingresa con tus credenciales de Supabase</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="admin@promobile.com.ar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surfaceLight border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surfaceLight border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="bg-accent hover:bg-rose-700 text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {authLoading ? <Loader2 size={18} className="animate-spin" /> : <span>Iniciar Sesión</span>}
            </button>
          </form>

          {/* Acceso demo / bypass para pruebas */}
          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <button
              type="button"
              onClick={() => setIsDemoMode(true)}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Probar Panel en Modo Preview (Sin Clave)
            </button>
            <div className="mt-4">
              <button
                onClick={onExit}
                className="text-xs text-text-muted hover:text-white"
              >
                ← Volver al sitio público
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Stats
  const publishedVehicles = vehicles.filter(v => v.status !== 'draft');
  const totalVehicles = vehicles.length;
  const totalValue = vehicles.reduce((acc, curr) => acc + (curr.priceUSD || 0), 0);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 shadow-2xl animate-zoom-in ${
          toast.type === 'error' 
            ? 'bg-red-500/15 border-red-500/30 text-red-400' 
            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
        }`}>
          {toast.type === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="font-display text-xl font-black text-white tracking-widest">
            PROMOBILE
          </div>
          <div className="text-[10px] font-bold text-accent tracking-widest uppercase mt-1">
            Panel de Control
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'dashboard' ? 'bg-accent text-white' : 'text-text-muted hover:bg-surfaceLight hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            Inicio
          </button>
          
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'inventory' ? 'bg-accent text-white' : 'text-text-muted hover:bg-surfaceLight hover:text-white'
            }`}
          >
            <CarFront size={18} />
            Inventario
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'settings' ? 'bg-accent text-white' : 'text-text-muted hover:bg-surfaceLight hover:text-white'
            }`}
          >
            <Settings size={18} />
            Configuración
          </button>
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
          <button 
            onClick={onExit}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-text-muted hover:text-accent transition-all"
          >
            ← Volver a la web
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {activeTab === 'dashboard' && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <LayoutDashboard size={48} className="text-text-muted mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">Panel de Inicio</h2>
            <p className="text-text-muted max-w-md">Esta sección estará disponible próximamente con gráficos de métricas y estadísticas de tus vehículos.</p>
            <button onClick={() => setActiveTab('inventory')} className="mt-6 text-accent hover:underline text-sm font-bold">Ir al Inventario →</button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Settings size={48} className="text-text-muted mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">Configuración</h2>
            <p className="text-text-muted max-w-md">Aquí podrás configurar el número de WhatsApp, el enlace de Instagram y el valor de cotización del Dólar.</p>
            <button onClick={() => setActiveTab('inventory')} className="mt-6 text-accent hover:underline text-sm font-bold">Ir al Inventario →</button>
          </div>
        )}

        {activeTab === 'inventory' && (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white">Inventario de Vehículos</h1>
                <p className="text-sm text-text-muted mt-1">
                  {connectionStatus.connected ? 'Conectado a Supabase en tiempo real' : 'Usando datos locales de respaldo'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { loadInventory(); checkConnection(); }}
                  className="p-2.5 rounded-xl border border-border text-text-muted hover:text-white hover:bg-surfaceLight transition-all"
                  title="Recargar inventario"
                >
                  <RefreshCw size={16} />
                </button>
                <button 
                  onClick={() => setIsNewModalOpen(true)}
                  className="bg-accent hover:bg-rose-700 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-accent/20 active:scale-95"
                >
                  <Plus size={18} />
                  <span>Nuevo Vehículo</span>
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-surfaceLight border border-border p-5 rounded-2xl">
                <div className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Vehículos Activos</div>
                <div className="text-3xl font-black text-white">{publishedVehicles.length}<span className="text-sm font-normal text-text-muted ml-1">/ {totalVehicles}</span></div>
              </div>
              <div className="bg-surfaceLight border border-border p-5 rounded-2xl">
                <div className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Valor Total USD</div>
                <div className="text-3xl font-black text-emerald-400">${totalValue.toLocaleString('es-AR')}</div>
              </div>
              <div className="bg-surfaceLight border border-border p-5 rounded-2xl">
                <div className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Estado Supabase</div>
                {connectionStatus.checking ? (
                  <div className="text-sm font-bold text-text-muted flex items-center gap-1.5 mt-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : connectionStatus.connected ? (
                  <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-2">
                    <CheckCircle2 size={16} />
                    <span>Conectado ({connectionStatus.count} registros)</span>
                  </div>
                ) : (
                  <div className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mt-2">
                    <AlertCircle size={16} />
                    <span>{connectionStatus.error || 'Desconectado'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Table/List */}
            <div className="bg-surfaceLight border border-border rounded-2xl overflow-hidden">
              {loadingVehicles ? (
                <div className="p-8 text-center text-text-muted">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2 text-accent" />
                  <span>Cargando catálogo...</span>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="p-12 text-center text-text-muted">
                  <CarFront size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No hay vehículos en el inventario</p>
                  <p className="text-xs mt-1">Hacé clic en "Nuevo Vehículo" para agregar el primero</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface/50 border-b border-border text-text-muted">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Vehículo</th>
                        <th className="px-6 py-4 font-semibold">Precio (USD)</th>
                        <th className="px-6 py-4 font-semibold">Categoría</th>
                        <th className="px-6 py-4 font-semibold">Estado</th>
                        <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {vehicles.map((vehicle) => (
                        <tr key={vehicle.id} className={`hover:bg-white/5 transition-colors group ${vehicle.status === 'draft' ? 'opacity-50' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-background shrink-0 relative">
                                <img 
                                  src={vehicle.images && vehicle.images[0] ? vehicle.images[0] : '/images/generic_car.jpg'} 
                                  alt={vehicle.title} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <div>
                                <div className="font-bold text-white group-hover:text-accent transition-colors">{vehicle.title}</div>
                                <div className="text-xs text-text-muted mt-0.5">{vehicle.year} • {vehicle.km}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-white">
                            ${(vehicle.priceUSD || 0).toLocaleString('es-AR')}
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-surface border border-border px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-text-muted">
                              {vehicle.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              vehicle.status === 'draft' 
                                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            }`}>
                              {vehicle.status === 'draft' ? 'Oculto' : 'Publicado'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => handleToggleStatus(vehicle.id, vehicle.status || 'published', vehicle.title)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" 
                                title={vehicle.status === 'draft' ? 'Publicar' : 'Ocultar'}
                              >
                                {vehicle.status === 'draft' ? <Eye size={16} /> : <EyeOff size={16} />}
                              </button>
                              <button 
                                onClick={() => handleDelete(vehicle.id, vehicle.title)}
                                className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors" 
                                title="Eliminar vehículo"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Modal para Crear Vehículo */}
      {isNewModalOpen && (
        <NewVehicleModal 
          onClose={() => setIsNewModalOpen(false)}
          onCreated={handleVehicleCreated}
        />
      )}
    </div>
  );
}
