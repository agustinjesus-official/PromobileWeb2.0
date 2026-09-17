import { supabase, isConfigured, testConnection as _testConnection } from './supabase';
import { VEHICLES as LOCAL_VEHICLES } from '../data/vehicles';

const USD_RATE = 1300;

export const vehicleService = {
  // Verificar conexión a Supabase
  async testConnection() {
    return _testConnection();
  },

  // Obtener todos los vehículos (con fallback seguro a datos locales)
  async getVehicles() {
    if (!isConfigured) {
      console.info('ℹ️ Supabase no configurado — usando catálogo local de respaldo');
      return LOCAL_VEHICLES;
    }

    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Aviso: Usando catálogo local mientras se inicializa Supabase:', error.message);
        return LOCAL_VEHICLES;
      }

      if (!data || data.length === 0) {
        return LOCAL_VEHICLES;
      }

      // Mapear campos de la base de datos a los que espera el frontend
      return data.map((v) => ({
        id: v.id,
        title: v.title,
        brand: v.brand,
        model: v.model,
        year: v.year,
        km: v.km,
        fuel: v.fuel,
        transmission: v.transmission,
        category: v.category || 'auto',
        priceUSD: Number(v.price_usd),
        priceARS: Math.round(Number(v.price_usd) * USD_RATE),
        badge: v.badge || null,
        badgeType: v.badge_type || 'red',
        featured: Boolean(v.featured),
        acceptsTradeIn: Boolean(v.accepts_trade_in),
        images: v.images && v.images.length > 0 ? v.images : ['/images/generic_car.jpg'],
        description: v.description || '',
        status: v.status || 'published'
      }));
    } catch (err) {
      console.warn('Error conectando a Supabase, usando respaldo local:', err);
      return LOCAL_VEHICLES;
    }
  },

  // Subir imagen a Supabase Storage
  async uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('vehicles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('vehicles')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Crear nuevo vehículo
  async createVehicle(vehicle) {
    const id = vehicle.id || `${vehicle.brand.toLowerCase()}-${vehicle.model.toLowerCase().replace(/\s+/g, '-')}-${vehicle.year}-${Date.now().toString().slice(-4)}`;
    
    // Normalizar km — puede ser número o string
    const kmStr = String(vehicle.km || '0');
    const kmFormatted = kmStr.toLowerCase().includes('km') ? kmStr : `${kmStr} km`;

    const dbPayload = {
      id,
      title: vehicle.title,
      brand: vehicle.brand,
      model: vehicle.model,
      year: parseInt(vehicle.year, 10),
      km: kmFormatted,
      fuel: vehicle.fuel || 'Nafta',
      transmission: vehicle.transmission || 'Manual',
      category: vehicle.category || 'auto',
      price_usd: parseFloat(vehicle.priceUSD),
      badge: vehicle.badge || null,
      badge_type: vehicle.badgeType || 'red',
      featured: Boolean(vehicle.featured),
      accepts_trade_in: Boolean(vehicle.acceptsTradeIn),
      images: vehicle.images || ['/images/generic_car.jpg'],
      description: vehicle.description || '',
      status: 'published'
    };

    const { data, error } = await supabase
      .from('vehicles')
      .insert([dbPayload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar vehículo existente
  async updateVehicle(id, changes) {
    // Mapear nombres frontend → nombres DB
    const fieldMap = {
      priceUSD: 'price_usd',
      badgeType: 'badge_type',
      acceptsTradeIn: 'accepts_trade_in',
    };

    const dbChanges = {};
    for (const [key, value] of Object.entries(changes)) {
      const dbKey = fieldMap[key] || key;
      dbChanges[dbKey] = value;
    }
    dbChanges.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('vehicles')
      .update(dbChanges)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Cambiar estado publicado/borrador
  async toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    const { data, error } = await supabase
      .from('vehicles')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar vehículo
  async deleteVehicle(id) {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

