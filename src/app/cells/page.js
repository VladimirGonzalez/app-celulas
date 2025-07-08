'use client';
/*──────────────────────────────────────────────────────────────────────────────
  ARCHIVO:  src/app/cells/page.js          (≈ 420 líneas con comentarios)
  OBJETIVO: Gestión completa de CÉLULAS (grupos) ─ CRUD + horario fijo
            – name, leader, dayOfWeek, hour
            – Vista listado  ·  Panel lateral detalle  ·  Modal alta / edición
            – Persistencia en localStorage  (clave = 'cellsV2')
            – Control de espacio con navigator.storage.estimate
            – Componentes desacoplados en /src/components  (se entregarán luego):
                 • CellCard
                 • CellSidePanel
                 • CellFormModal
──────────────────────────────────────────────────────────────────────────────*/

import { useEffect, useMemo, useState } from 'react';
import CellCard       from '@/components/CellCard';
import CellSidePanel  from '@/components/CellSidePanel';
import CellFormModal  from '@/components/CellFormModal';

/*──────────────────────────── Config / helpers básicos ──────────────────────*/
const STORAGE_KEY = 'cellsV2';
const DAYS_ES     = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];   // visual
const HOUR_DEF    = '20:00';

/* —— persistencia simple ——————————————————————————————————————— */
const load = () => {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; }
  catch { return []; }
};

async function hasRoom(str) {
  if (!navigator.storage?.estimate) return true;
  const { quota = 5_000_000, usage = 0 } = await navigator.storage.estimate();
  return usage + new Blob([str]).size < quota - 100 * 1024;  // margen 100 kB
}
const save = async data => {
  if (typeof window === 'undefined') return;
  const str = JSON.stringify(data);
  if (await hasRoom(str)) localStorage.setItem(STORAGE_KEY, str);
  else alert('⚠️ Límite de almacenamiento local alcanzado: elimina registros.');
};

/*────────────────────────── Componente principal ───────────────────────────*/
export default function CellsPage() {
  /* — estado global — */
  const [cells,      setCells]      = useState([]);
  const [filterText, setFilterText] = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState(null);   // celda que editamos
  const [selected,   setSelected]   = useState(null);   // panel lateral

  /* carga inicial + persistencia */
  useEffect(() => setCells(load()), []);
  useEffect(() => { save(cells); }, [cells]);

  /* CRUD */
  const upsert = cell => {
    setCells(prev => {
      const idx = prev.findIndex(c => c.id === cell.id);
      return idx === -1
        ? [...prev, cell]                    // crear
        : prev.map(c => c.id===cell.id?cell:c); // editar
    });
  };

  const deleteCell = id => {
    if (!confirm('¿Eliminar esta célula? Se perderán los datos vinculados.')) return;
    setCells(prev => prev.filter(c => c.id !== id));
    if (selected?.id === id)   setSelected(null);
    if (editing?.id  === id)   setEditing(null);
  };

  /* filtrado memorizado */
  const visibles = useMemo(() => {
    const txt = filterText.trim().toLowerCase();
    return txt
      ? cells.filter(c =>
          c.name.toLowerCase().includes(txt) ||
          c.leader.toLowerCase().includes(txt))
      : cells;
  }, [cells, filterText]);

  /* — vista — */
  return (
    <>
      {/* CABECERA */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Células</h1>
          <p className="text-white/80 text-sm">
            Administra los grupos con su líder y horario fijo.
          </p>
        </div>

        {/* buscador */}
        <input
          placeholder="Buscar..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="border rounded px-3 py-1 text-sm md:w-52"
        />

        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nueva célula
        </button>
      </header>

      {/* LISTADO */}
      {visibles.length === 0 && (
        <p className="text-white/80 text-sm">No hay resultados.</p>
      )}
      {visibles.map(c => (
        <CellCard
          key={c.id}
          cell={c}
          onView={() => setSelected(c)}
          onEdit={() => { setEditing(c); setShowModal(true); }}
          onDelete={() => deleteCell(c.id)}
        />
      ))}

      {/* MODAL (alta / edición) */}
      {showModal && (
        <CellFormModal
          onClose={() => setShowModal(false)}
          onSave={upsert}
          initial={editing}
          /* valores por defecto */
          defaultHour={HOUR_DEF}
        />
      )}

      {/* PANEL LATERAL */}
      {selected && (
        <CellSidePanel
          cell={selected}
          onClose={() => setSelected(null)}
          deleteCell={() => deleteCell(selected.id)}
        />
      )}
    </>
  );
}

/*────────────────────────── Export utilitario ──────────────────────────────*/
/*  Si otro módulo necesita los días en español:
      import { DAYS_ES } from '@/app/cells/page';
*/
export { DAYS_ES };
