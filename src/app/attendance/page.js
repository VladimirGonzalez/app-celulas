'use client';
/*──────────────────────────────────────────────────────────────────────────────
  PÁGINA : Asistencias
  OBJETO : Listar reuniones (desde envelopesV2) y registrar presentes
──────────────────────────────────────────────────────────────────────────────*/

import { useEffect, useMemo, useState } from 'react';
import AttendanceCard      from '@/components/AttendanceCard';
import AttendanceFormModal from '@/components/AttendanceFormModal';

/* — claves LS — */
const LS_ENV   = 'envelopesV2';
const LS_ATT   = 'attendanceV1';
const LS_CELLS = 'cellsV2';
const LS_MEMB  = 'membersV2';

/* — helpers cortos — */
const load = (k, d = []) => {
  if (typeof window === 'undefined') return d;
  try { return JSON.parse(localStorage.getItem(k)) ?? d; }
  catch { return d; }
};
const save = (k, data) => {
  if (typeof window !== 'undefined')
    localStorage.setItem(k, JSON.stringify(data));
};

export default function AttendancePage() {
  /* ─ estado global ─ */
  const [envelopes,  setEnvelopes]  = useState([]);
  const [attendance, setAttendance] = useState([]);   // [{meetingId, attendeesIds}]
  const [cells,      setCells]      = useState([]);
  const [members,    setMembers]    = useState([]);
  const [filter,     setFilter]     = useState('all');

  /* modal */
  const [selected,   setSelected]   = useState(null); // envelope
  const [showModal,  setShowModal]  = useState(false);

  /* ─ carga inicial ─ */
  useEffect(() => {
    setEnvelopes (load(LS_ENV));
    setAttendance(load(LS_ATT));
    setCells     (load(LS_CELLS));
    setMembers   (load(LS_MEMB));
  }, []);

  /* ─ persistencia asistencia ─ */
  useEffect(() => save(LS_ATT, attendance), [attendance]);

  /* mapa rápido de presentes por meetingId */
  const mapPresent = useMemo(() => {
    const m = {};
    attendance.forEach(r => { m[r.meetingId] = r.attendeesIds.length; });
    return m;
  }, [attendance]);

  /* filtros */
  const visibles = useMemo(() =>
    (filter === 'all'
      ? envelopes
      : envelopes.filter(e => e.cellId === +filter)
    ).sort((a, b) => new Date(b.date) - new Date(a.date))
  , [envelopes, filter]);

  /* guardar desde el modal */
  const saveAttendance = (meetingId, ids) => {
    setAttendance(prev => {
      const i = prev.findIndex(r => r.meetingId === meetingId);
      return i === -1
        ? [...prev, { meetingId, attendeesIds: ids }]
        : prev.map(r => r.meetingId === meetingId ? { meetingId, attendeesIds: ids } : r);
    });
  };

  /* ─ UI ─ */
  return (
    <>
      {/* CABECERA */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Asistencias</h1>
          <p className="text-white/80 text-sm">
            Marca presentes y ausentes de cada reunión.
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

      {/* LISTADO */}
      {visibles.length === 0 && (
        <p className="text-white/80 text-sm">No hay reuniones para mostrar.</p>
      )}

      {visibles.map(env => (
        <AttendanceCard
          key={env.id}
          env={env}
          cells={cells}
          presentCount={mapPresent[env.id] ?? env.attendeesIds.length}
          onEdit={() => { setSelected(env); setShowModal(true); }}
        />
      ))}

      {/* MODAL */}
      {showModal && selected && (
        <AttendanceFormModal
          meeting={selected}
          cells={cells}
          members={members}
          initialAttendees={
            attendance.find(a => a.meetingId === selected.id)?.attendeesIds
            ?? selected.attendeesIds
          }
          onClose={() => { setShowModal(false); setSelected(null); }}
          onSave={(ids) => {
            saveAttendance(selected.id, ids);
            setShowModal(false); setSelected(null);
          }}
        />
      )}
    </>
  );
}
