import React from 'react';
import { Banknote, Repeat, ShieldCheck, ArrowRight } from 'lucide-react';

export default function FinancingBanner({ onOpenTradeIn }) {
  return (
    <section style={{ margin: '2.5rem 0 1.5rem 0' }}>
      <div className="container">
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          alignItems: 'center'
        }}>
          {/* Item 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Banknote size={18} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                Financiación con DNI
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Hasta 36 cuotas fijas en pesos.
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(225, 29, 72, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Repeat size={18} color="var(--accent-red)" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                Llave contra Llave
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Tasamos tu auto o moto en el acto.
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={18} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                Gestoría Propia
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Transferencias y 08 al día sin demoras.
              </div>
            </div>
          </div>

          {/* Botón Tasar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => onOpenTradeIn(null)}
              className="btn-tradein"
              style={{
                width: '100%',
                padding: '0.55rem 0.95rem',
                fontSize: '0.82rem'
              }}
            >
              <Repeat size={14} color="var(--accent-red)" />
              <span>Cotizar Permuta</span>
              <ArrowRight size={13} style={{ marginLeft: 'auto', opacity: 0.7 }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
