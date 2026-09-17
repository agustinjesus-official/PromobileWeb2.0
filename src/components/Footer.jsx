import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { AGENCY_INFO } from '../data/vehicles';

export default function Footer() {
  return (
    <footer className="bg-[#06070a] border-t border-border py-8 mt-12 text-sm text-text-muted">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-white/5">
          {/* Logo y Ubicación */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display font-black text-white text-base tracking-widest">
              PROMOBILE
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin size={14} className="text-accent" />
              <span>Santa Fe Capital</span>
            </div>
            <span className="text-white/20 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock size={14} />
              <span>{AGENCY_INFO.hours}</span>
            </div>
          </div>

          {/* Redes */}
          <div>
            <a
              href={AGENCY_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white font-semibold hover:text-accent transition-colors"
            >
              <InstagramIcon size={16} />
              <span>{AGENCY_INFO.instagramHandle}</span>
            </a>
          </div>
        </div>

        {/* Copy & Acceso Admin */}
        <div className="pt-6 flex flex-wrap justify-between items-center gap-2 text-xs text-gray-500">
          <div>© {new Date().getFullYear()} {AGENCY_INFO.name} • Catálogo Digital</div>
          <a
            href="#admin"
            className="text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1 py-1 px-2 rounded hover:bg-white/5"
            title="Panel de Control de la Agencia"
          >
            <span>Acceso Concesionaria</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
