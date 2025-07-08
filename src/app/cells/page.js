'use client';
/*──────────────────────────────────────────────────────────────────────────────
  ARCHIVO:  src/app/cells/page.js
  OBJETIVO: Gestión completa de CÉLULAS (grupos) ─ CRUD + horario fijo
            – name, leader, dayOfWeek, hour
            – Vista listado  ·  Panel lateral detalle  ·  Modal alta / edición
            – Persistencia en **Supabase**
            – Componentes desacoplados en /src/components:
                 • CellCard
                 • CellSidePanel
                 • CellFormModal
──────────────────────────────────────────────────────────────────────────────*/

import { useMemo, useState } from 'react';
import CellCard       from '@/components/CellCard';
import CellSidePanel  from '@/components/CellSidePanel';
import CellFormModal  from '@/components/CellFormModal';
import { useTable }   from '@/hooks/useTable';

/*──────────────────────────── Constantes básicas ───────────────────────────*/
const DAYS_ES  = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']; // visual
const HOUR_DEF = '20:00';

/*────────────────────────── Componente principal ───────────────────────────*/
export default function CellsPage() {
  /*— conexión Supabase —*/
  const {
    data: cells = [],     // lista reactiva
    upsert,               // crea / edita
    remove                // elimina
  } = useTable('cells');

  /*— estado de interfaz —*/
  const [filterText, setFilterText] = useState('');
  const [showModal , setShowModal ] = useState(false);
  const [editing   , setEditing   ] = useState(null);   // célula que se edita
  const [selected  , setSelected  ] = useState(null);   // célula en panel lateral

  /*— derivado: lista filtrada —*/
  const visibles = useMemo(() => {
    const txt = filterText.trim().toLowerCase();
    return txt
      ? cells.filter(c =>
          c.name.toLowerCase().includes(txt) ||
          c.leader?.toLowerCase().includes(txt)
        )
      : cells;
  }, [cells, filterText]);

  /*— helpers —*/
  const deleteCell = async (id) => {
    if (!confirm('¿Eliminar esta célula? Se perderán los datos vinculados.')) return;
    await remove(id);
    if (selected?.id === id) setSelected(null);
  };

  /*────────────────────────────── Render ───────────────────────────────────*/
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
          onView   ={() => setSelected(c)}
          onEdit   ={() => { setEditing(c); setShowModal(true); }}
          onDelete ={() => deleteCell(c.id)}
        />
      ))}

      {/* MODAL (alta / edición) */}
      {showModal && (
        <CellFormModal
          onClose     ={() => setShowModal(false)}
          onSave      ={upsert}
          initial     ={editing}
          defaultHour ={HOUR_DEF}
        />
      )}

      {/* PANEL LATERAL */}
      {selected && (
        <CellSidePanel
          cell      ={selected}
          onClose   ={() => setSelected(null)}
          onUpdate  ={upsert}
        />
      )}
    </>
  );
}

/*────────────────────────── Export utilitario ─────────────────────────────*/
export { DAYS_ES };
