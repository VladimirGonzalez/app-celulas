'use client';
/*──────────────────────────────────────────────────────────────────────────────
  ARCHIVO:  src/app/members/page.js          (≈ 420 líneas con comentarios)
  OBJETIVO: CRUD completo de MIEMBROS
            – Campos: fullName · phone · cellId · joinDate (ISO)
            – Vista listado · Buscador · Panel lateral detalle · Modal alta/edición
            – Relación 1-N con Células (select)
            – Persistencia en localStorage (clave = 'membersV2')
            – Control de espacio con navigator.storage.estimate
            – Componentes externos (se entregarán luego):
                 • MemberCard
                 • MemberSidePanel
                 • MemberFormModal
──────────────────────────────────────────────────────────────────────────────*/

import { useEffect, useMemo, useState } from 'react';
import MemberCard       from '@/components/MemberCard';
import MemberSidePanel  from '@/components/MemberSidePanel';
import MemberFormModal  from '@/components/MemberFormModal';

const STORAGE_KEY_MEMBERS = 'membersV2';
const STORAGE_KEY_CELLS   = 'cellsV2';          // para leer nombres de células

/*—— helpers / persistencia ———————————————————————————————————————*/
const loadLS = (key, def = []) => {
  if (typeof window === 'undefined') return def;
  try { return JSON.parse(localStorage.getItem(key)) ?? def; }
  catch { return def; }
};

async function hasRoom(str) {
  if (!navigator.storage?.estimate) return true;
  const { quota = 5_000_000, usage = 0 } = await navigator.storage.estimate();
  return usage + new Blob([str]).size < quota - 100 * 1024;
}

const saveMembers = async data => {
  if (typeof window === 'undefined') return;
  const str = JSON.stringify(data);
  if (await hasRoom(str)) localStorage.setItem(STORAGE_KEY_MEMBERS, str);
  else alert('⚠️ Límite de almacenamiento local alcanzado (Miembros).');
};

/*──────────────────────────── Componente principal ───────────────────────────*/
export default function MembersPage() {
  /*— estado global —*/
  const [members, setMembers]     = useState([]);
  const [cells,   setCells]       = useState([]);
  const [filter,  setFilter]      = useState('');     // texto buscador
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [selected,  setSelected]  = useState(null);

  /*— carga inicial —*/
  useEffect(() => {
    setMembers(loadLS(STORAGE_KEY_MEMBERS));
    setCells  (loadLS(STORAGE_KEY_CELLS));
  }, []);

  /*— persistencia —*/
  useEffect(() => { saveMembers(members); }, [members]);

  /*— CRUD —*/
  const upsert = m => {
    setMembers(prev => {
      const i = prev.findIndex(x => x.id === m.id);
      return i === -1 ? [...prev, m] : prev.map(x => x.id === m.id ? m : x);
    });
  };

  const deleteMember = id => {
    if (!confirm('¿Eliminar este miembro?')) return;
    setMembers(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  /*— filtrado memorizado —*/
  const visibles = useMemo(() => {
    const txt = filter.trim().toLowerCase();
    return txt
      ? members.filter(m =>
          m.fullName.toLowerCase().includes(txt) ||
          m.phone?.toLowerCase().includes(txt))
      : members;
  }, [members, filter]);

  /*────────────────────────── Render UI ──────────────────────────────────────*/
  return (
    <>
      {/* CABECERA */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Miembros</h1>
          <p className="text-white/80 text-sm">
            Gestiona los miembros y su célula de pertenencia.
          </p>
        </div>

        <input
          placeholder="Buscar..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border rounded px-3 py-1 text-sm md:w-52"
        />

        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Nuevo miembro
        </button>
      </header>

      {/* LISTADO */}
      {visibles.length === 0 && (
        <p className="text-white/80 text-sm">No hay resultados.</p>
      )}
      {visibles.map(m => (
        <MemberCard
          key={m.id}
          member={m}
          cells={cells}
          onView={() => setSelected(m)}
          onEdit={() => { setEditing(m); setShowModal(true); }}
          onDelete={() => deleteMember(m.id)}
        />
      ))}

      {/* MODAL alta / edición */}
      {showModal && (
        <MemberFormModal
          onClose={() => setShowModal(false)}
          onSave={upsert}
          initial={editing}
          cells={cells}
        />
      )}

      {/* PANEL lateral */}
      {selected && (
        <MemberSidePanel
          member={selected}
          cells={cells}
          onClose={() => setSelected(null)}
          onDelete={() => deleteMember(selected.id)}
        />
      )}
    </>
  );
}
