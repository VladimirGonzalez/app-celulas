'use client';
/*──────────────────────────────────────────────────────────────────────────────
  COMPONENTE : AttendanceFormModal
  PROPÓSITO  : Modal para marcar presentes/ausentes
  PROPS
    • meeting            objeto envelope seleccionado
    • members[]          todos los miembros
    • cells[]            listado de células (para el nombre)
    • initialAttendees[] ids ya marcados como presentes
    • onClose()
    • onSave(ids[])      devuelve lista final de presentes
──────────────────────────────────────────────────────────────────────────────*/

import { useState } from 'react';
import PropTypes from 'prop-types';

export default function AttendanceFormModal({
  meeting, members, cells, initialAttendees, onClose, onSave
}) {
  const cellMembers = members.filter(m => m.cellId === meeting.cellId);
  const [attIds, setAttIds] = useState(initialAttendees ?? []);

  const toggle = id =>
    setAttIds(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);

  const cell = cells.find(c => c.id === meeting.cellId);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={e => { e.preventDefault(); onSave(attIds); }}
        className="bg-white w-full max-w-md p-6 rounded shadow
                   overflow-y-auto max-h-[90vh] flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold">{cell?.name} – Asistencia</h2>
        <p className="text-sm text-gray-500">
          {new Date(meeting.date).toLocaleDateString('es-AR')} · {meeting.hour}h
        </p>

        <fieldset className="border rounded p-3">
          <legend className="text-sm font-medium">
            Presentes ({attIds.length}/{cellMembers.length})
          </legend>

          <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
            {cellMembers.map(m => (
              <label key={m.id} className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={attIds.includes(m.id)}
                  onChange={() => toggle(m.id)}
                />
                {m.fullName}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border py-2 rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

AttendanceFormModal.propTypes = {
  meeting         : PropTypes.object.isRequired,
  members         : PropTypes.array.isRequired,
  cells           : PropTypes.array.isRequired,
  initialAttendees: PropTypes.array,
  onClose         : PropTypes.func.isRequired,
  onSave          : PropTypes.func.isRequired,
};
