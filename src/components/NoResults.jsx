import React from 'react';
import { SearchX } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

export default function NoResults({ onReset }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '2rem 1.25rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      maxWidth: '440px',
      margin: '1.5rem auto'
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <SearchX size={22} color="var(--text-muted)" />
      </div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
        Sin resultados para esta búsqueda
      </h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        Consultanos directo por WhatsApp si buscás algún modelo específico que aún no figure cargado.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onReset}
          className="btn-secondary"
          style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem' }}
        >
          Limpiar filtros
        </button>
        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
          style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem' }}
        >
          <WhatsAppIcon size={14} color="#ffffff" />
          <span>Consultar por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
