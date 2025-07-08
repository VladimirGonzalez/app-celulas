'use client';
/*──────────────────────────────────────────────────────────────────────────────
  COMPONENTE : MemberFormModal
  PROPÓSITO  : Alta / Edición de Miembro
               – Campos: fullName · phone · cellId · joinDate
               – Valida campos requeridos
  PROPS
    • onClose()           cierra sin guardar
    • onSave(obj)         envía el miembro al padre
    • cells[]             lista de células disponibles
    • initial  (opcional) miembro existente para modo edición
──────────────────────────────────────────────────────────────────────────────*/

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function initState(initial, cells) {
  return {
    id       : initial?.id        ?? Date.now(),
    fullName : initial?.fullName  ?? '',
    phone    : initial?.phone     ?? '',
    cellId   : initial?.cellId    ?? cells[0]?.id ?? null,
    joinDate : initial?.joinDate  ?? new Date().toISOString().slice(0, 10),
  };
}

export default function MemberFormModal({ onClose, onSave, cells, initial }) {
  const [state, setState] = useState(() => initState(initial, cells));
  const [errors, setErrors] = useState({});

  /* reset si cambia initial */
  useEffect(() => {
    setState(initState(initial, cells));
    setErrors({});
  }, [initial, cells]);

  /* helpers */
  const handle = k => e => setState(s => ({ ...s, [k]: e.target.value }));

  const validate = () => {
    const err = {};
    if (!state.fullName.trim()) err.fullName = 'Nombre requerido';
    if (!state.cellId)          err.cellId   = 'Seleccione célula';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = e => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      id       : state.id,
      fullName : state.fullName.trim(),
      phone    : state.phone.trim(),
      cellId   : +state.cellId,
      joinDate : state.joinDate,
    });
    onClose();
  };

  /* UI */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={submit}
        className="bg-white w-full max-w-lg p-6 rounded shadow
                   overflow-y-auto max-h-[90vh] flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold">
          {initial ? 'Editar miembro' : 'Nuevo miembro'}
        </h2>

        {/* Nombre */}
        <label className="text-sm">
          Nombre completo
          <input
            className={`border w-full px-2 py-1 rounded mt-1
                       ${errors.fullName ? 'border-red-500' : ''}`}
            value={state.fullName}
            onChange={handle('fullName')}
            autoFocus
          />
        </label>
        {errors.fullName && (
          <p className="text-xs text-red-600 -mt-3">{errors.fullName}</p>
        )}

        {/* Teléfono */}
        <label className="text-sm">
          Teléfono (opcional)
          <input
            className="border w-full px-2 py-1 rounded mt-1"
            value={state.phone}
            onChange={handle('phone')}
          />
        </label>

        {/* Célula */}
        <label className="text-sm">
          Célula
          <select
            className={`border w-full px-2 py-1 rounded mt-1
                       ${errors.cellId ? 'border-red-500' : ''}`}
            value={state.cellId}
            onChange={handle('cellId')}
          >
            {cells.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        {errors.cellId && (
          <p className="text-xs text-red-600 -mt-3">{errors.cellId}</p>
        )}

        {/* Fecha alta */}
        <label className="text-sm">
          Fecha de ingreso
          <input
            type="date"
            className="border w-full px-2 py-1 rounded mt-1"
            value={state.joinDate}
            onChange={handle('joinDate')}
          />
        </label>

        {/* Acciones */}
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
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {initial ? 'Guardar cambios' : 'Crear miembro'}
          </button>
        </div>
      </form>
    </div>
  );
}

MemberFormModal.propTypes = {
  onClose : PropTypes.func.isRequired,
  onSave  : PropTypes.func.isRequired,
  cells   : PropTypes.array.isRequired,
  initial : PropTypes.object,
};
