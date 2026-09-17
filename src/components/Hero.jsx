import React, { useEffect, useRef } from 'react';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export default function Hero() {
  const parallaxRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Efecto Parallax en el fondo
    if (bgRef.current && parallaxRef.current) {
      gsap.to(bgRef.current, {
        yPercent: 30, // Se mueve hacia abajo un 30% a medida que scrolleas
        ease: "none",
        scrollTrigger: {
          trigger: parallaxRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // Inicializar Lenis para Scroll Suave en toda la página
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.killTweensOf(bgRef.current);
      lenis.destroy();
    };
  }, []);

  return (
    <section ref={parallaxRef} className="relative w-full min-h-[90vh] pt-20 pb-12 flex flex-col items-center justify-center overflow-hidden">
      {/* Fondo Parallax */}
      <div 
        ref={bgRef}
        className="absolute top-[-10%] left-0 right-0 h-[120%] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=1920&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/50" />
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center justify-center flex-1 h-full min-h-[60vh] sm:min-h-[75vh]">
        
        {/* Espaciador superior */}
        <div className="flex-1"></div>

        {/* Texto principal (Centrado) */}
        <div className="flex flex-col items-center justify-center w-full py-10">
          <h1 className="font-display text-[11vw] leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl font-black italic tracking-tight text-white uppercase text-center max-w-5xl drop-shadow-2xl">
            Tu próximo vehículo<br />
            <span className="text-accent">te espera acá.</span>
          </h1>
        </div>

        {/* Espaciador inferior */}
        <div className="flex-1"></div>
      </div>

      {/* Tarjetas COMPRÁ / VENDÉ / CONTACTANOS */}
      <div className="container relative z-10 mx-auto px-4 pb-4 w-full">
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-6xl mx-auto">
          {/* COMPRÁ */}
          <button 
            onClick={() => document.getElementById('inventario')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative group overflow-hidden rounded-3xl h-28 sm:h-40 shadow-2xl text-left border border-white/5"
          >
            <img 
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop" 
              alt="Comprá"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-6">
              <h2 className="font-display text-3xl sm:text-4xl font-black italic tracking-wider text-white drop-shadow-lg group-hover:text-accent transition-colors">
                COMPRÁ
              </h2>
            </div>
          </button>

          {/* VENDÉ */}
          <a 
            href={getGeneralWhatsAppUrl()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="relative group overflow-hidden rounded-3xl h-28 sm:h-40 shadow-2xl text-left block border border-white/5"
          >
            <img 
              src="/images/vende_handover.jpg" 
              alt="Vendé"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay oscuro (bg-black/60) combinado con gradiente para asegurar la legibilidad del texto */}
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-6">
              <h2 className="font-display text-3xl sm:text-4xl font-black italic tracking-wider text-white drop-shadow-lg group-hover:text-accent transition-colors">
                VENDÉ
              </h2>
            </div>
          </a>

          {/* CONTACTANOS */}
          <a 
            href={getGeneralWhatsAppUrl()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="relative group overflow-hidden rounded-3xl h-28 sm:h-40 shadow-2xl text-left block border border-white/5 sm:col-span-1"
          >
            <img 
              src="/images/contact_handshake.jpg" 
              alt="Contactanos"
              className="absolute inset-0 w-full h-full object-cover object-[center_60%] transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay oscuro (bg-black/60) combinado con gradiente para asegurar la legibilidad del texto */}
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-6">
              <h2 className="font-display text-3xl sm:text-4xl font-black italic tracking-wider text-white drop-shadow-lg group-hover:text-accent transition-colors">
                CONTACTANOS
              </h2>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
