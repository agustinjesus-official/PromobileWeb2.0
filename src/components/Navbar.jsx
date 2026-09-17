import React from 'react';
import { Car, Repeat } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';
import { AGENCY_INFO } from '../data/vehicles';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

export default function Navbar({ onOpenTradeIn }) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Promobile (Texto) */}
        <div className="flex flex-col justify-center">
          <div className="font-display text-2xl sm:text-3xl font-black italic tracking-widest text-white leading-none">
            PROMOBILE
          </div>
          <div className="text-[7px] sm:text-[9px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 uppercase mt-1">
            Concesionario Oficial Multimarcas
          </div>
        </div>

        {/* Info y Acciones */}
        <div className="flex items-center">
          {/* Botón WhatsApp */}
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2.5 text-sm font-bold text-white bg-[#25D366] hover:bg-[#1DA851] rounded-full transition-colors shadow-lg shadow-[#25D366]/20"
          >
            <WhatsAppIcon size={18} color="#ffffff" />
            <span className="hidden md:inline">Contactar</span>
          </a>
        </div>
      </div>
    </header>
  );
}
