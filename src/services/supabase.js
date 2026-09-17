import { createClient } from '@supabase/supabase-js';

// Usamos las claves directamente para evitar problemas de lectura del .env.local
const supabaseUrl = 'https://nahdvqbiiienglneumvk.supabase.co';
const supabaseAnonKey = 'sb_publishable_qkWoojddMt097iLmMekwog_H3dMffag';

// Validar configuración al iniciar
export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Verifica la conexión real a Supabase intentando contar registros en la tabla vehicles.
 * @returns {{ connected: boolean, count: number, error: string|null }}
 */
export async function testConnection() {
  if (!isConfigured) {
    return { connected: false, count: 0, error: 'Credenciales no configuradas' };
  }

  try {
    const { count, error } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return { connected: false, count: 0, error: error.message };
    }

    return { connected: true, count: count || 0, error: null };
  } catch (err) {
    return { connected: false, count: 0, error: err.message };
  }
}
