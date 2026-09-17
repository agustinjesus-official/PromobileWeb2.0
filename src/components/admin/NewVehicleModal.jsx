import React, { useState } from 'react';
import { X, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';

export default function NewVehicleModal({ onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    km: '',
    fuel: 'Nafta',
    transmission: 'Manual',
    category: 'auto',
    priceUSD: '',
    badge: '',
    badgeType: 'red',
    featured: true,
    acceptsTradeIn: false,
    description: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let uploadedImageUrls = [];

      // 1. Subir imágenes si seleccionó
      if (selectedFiles.length > 0) {
        setUploadProgress(`Subiendo ${selectedFiles.length} foto(s)...`);
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          setUploadProgress(`Subiendo foto ${i + 1} de ${selectedFiles.length}...`);
          const url = await vehicleService.uploadImage(file);
          uploadedImageUrls.push(url);
        }
      } else {
        uploadedImageUrls = ['/images/generic_car.jpg'];
      }

      setUploadProgress('Guardando en base de datos...');

      // 2. Crear registro en Supabase
      const newVehicle = await vehicleService.createVehicle({
        ...form,
        images: uploadedImageUrls
      });

      onCreated(newVehicle);
      onClose();
    } catch (err) {
      console.error('Error al crear vehículo:', err);
      setError(err.message || 'Error al guardar el vehículo en Supabase');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-2">Agregar Nuevo Vehículo</h2>
        <p className="text-xs text-text-muted mb-6">Completa los datos para publicar en el catálogo público</p>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Título de Publicación *</label>
              <input
                type="text"
                required
                placeholder="Ej: Ford Focus Titanium 2.0 AT"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Precio en USD *</label>
              <input
                type="number"
                required
                placeholder="Ej: 16500"
                value={form.priceUSD}
                onChange={(e) => setForm({ ...form, priceUSD: e.target.value })}
                className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Marca *</label>
              <input
                type="text"
                required
                placeholder="Ej: Ford"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Modelo *</label>
              <input
                type="text"
                required
                placeholder="Ej: Focus"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Año *</label>
              <input
                type="number"
                required
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Kilometraje *</label>
              <input
                type="text"
                required
                placeholder="Ej: 54.000"
                value={form.km}
                onChange={(e) => setForm({ ...form, km: e.target.value })}
                className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Transmisión</label>
              <select
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              >
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
                <option value="Semiautomática">Semiautomática</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              >
                <option value="auto">Auto</option>
                <option value="suv">SUV</option>
                <option value="moto">Moto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Combustible</label>
              <select
                value={form.fuel}
                onChange={(e) => setForm({ ...form, fuel: e.target.value })}
                className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              >
                <option value="Nafta">Nafta</option>
                <option value="Diésel">Diésel</option>
                <option value="GNC">GNC</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Etiqueta (Badge)</label>
              <select
                value={form.badge}
                onChange={(e) => {
                  const val = e.target.value;
                  let type = 'red';
                  if (val.includes('Oportunidad')) type = 'amber';
                  if (val.includes('Gama')) type = 'cyan';
                  if (val.includes('Financiación') || val.includes('Asientos')) type = 'emerald';
                  setForm({ ...form, badge: val, badgeType: type });
                }}
                className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              >
                <option value="">Sin Etiqueta</option>
                <option value="Recién Ingresado">Recién Ingresado (Rojo)</option>
                <option value="Oportunidad">Oportunidad (Naranja)</option>
                <option value="Tope de Gama">Tope de Gama (Celeste)</option>
                <option value="Financiación DNI">Financiación DNI (Verde)</option>
                <option value="3 Filas de Asientos">3 Filas (Verde)</option>
              </select>
            </div>
            
            <div className="flex flex-col justify-end pb-2 gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-white">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
                Destacar al inicio
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-white">
                <input
                  type="checkbox"
                  checked={form.acceptsTradeIn}
                  onChange={(e) => setForm({ ...form, acceptsTradeIn: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                Mostrar etiqueta "Permuta"
              </label>
            </div>
          </div>

          {/* Subida de Fotos */}
          <div>
            <label className="text-xs font-semibold text-text-muted block mb-1">Fotos del Vehículo</label>
            <div className="border-2 border-dashed border-border hover:border-accent/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-surfaceLight/40 relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload size={24} className="mx-auto text-accent mb-2" />
              <p className="text-xs text-white font-medium">Arrastra fotos o haz clic para seleccionarlas</p>
              <p className="text-[10px] text-text-muted mt-0.5">Soporta JPG, PNG, WEBP (se suben directo a Supabase Storage)</p>
            </div>

            {/* Preview de fotos */}
            {previewUrls.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {previewUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-16 h-12 object-cover rounded-lg border border-border shrink-0"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-text-muted block mb-1">Descripción</label>
            <textarea
              rows={3}
              placeholder="Detalles sobre equipamiento, mantenimiento, papeles al día..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-surfaceLight border border-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-text-muted hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{uploadProgress || 'Guardando...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Publicar Vehículo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
