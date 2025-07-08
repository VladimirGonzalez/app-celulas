'use client';
/*──────────────────────────────────────────────────────────────────────────────
  PÁGINA : Reporte de Ofrendas
  OBJETO : Listar ingresos por reunión (cash + transferencia) y totales
──────────────────────────────────────────────────────────────────────────────*/

import { useEffect, useMemo, useState } from 'react';
import OfferingCard from '@/components/OfferingCard';

/* — claves LS — */
const LS_ENV   = 'envelopesV2';
const LS_CELLS = 'cellsV2';

/* helpers */
const load = (k, d = []) => {
  if (typeof window === 'undefined') return d;
  try { return JSON.parse(localStorage.getItem(k)) ?? d; }
  catch { return d; }
};

export default function OfferingsPage() {
  const [envs , setEnvs ] = useState([]);
  const [cells, setCells] = useState([]);
  const [filter, setFilter] = useState('all');

  /* carga inicial */
  useEffect(() => {
    setEnvs (load(LS_ENV));
    setCells(load(LS_CELLS));
  }, []);

  /* filtrar por célula */
  const visibles = useMemo(() =>
    (filter === 'all'
      ? envs
      : envs.filter(e => e.cellId === +filter)
    ).sort((a, b) => new Date(b.date) - new Date(a.date))
  , [envs, filter]);

  /* totales */
  const totals = useMemo(() => visibles.reduce((acc, e) => ({
    cash : acc.cash  + e.cashAmount,
    transf: acc.transf + e.transferAmount,
  }), { cash:0, transf:0 }), [visibles]);

  return (
    <>
      {/* CABECERA */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Reporte de Ofrendas</h1>
          <p className="text-white/80 text-sm">
            Totales en efectivo y transferencia por reunión.
          </p>
        </div>

        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="all">— Todas las células —</option>
          {cells.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </header>

      {/* RESUMEN TOTAL */}
      <div className="card bg-blue-50 dark:bg-slate-700/30 mb-4">
        <p className="text-sm text-gray-500">Total visible</p>
        <p className="text-lg font-semibold">
          💵 ${totals.cash.toFixed(2)} &nbsp;·&nbsp;
          💳 ${totals.transf.toFixed(2)}
        </p>
      </div>

      {/* LISTADO */}
      {visibles.length === 0 && (
        <p className="text-white/80 text-sm">No hay sobres para este filtro.</p>
      )}

      {visibles.map(env => (
        <OfferingCard key={env.id} env={env} cells={cells} />
      ))}
    </>
  );
}
